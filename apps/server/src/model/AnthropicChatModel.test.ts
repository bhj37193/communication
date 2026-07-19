// AnthropicChatModel unit tests: injected fake Anthropic client, no network.
import { describe, expect, it, vi } from 'vitest';
import { CharacterOutputSchema } from '@charisma/core/schemas';
import {
  ANTHROPIC_MODEL_ID,
  AnthropicChatModel,
  type AnthropicClient,
  type AnthropicCreateResult,
} from './AnthropicChatModel.js';

function textResult(text: string, usage: Partial<AnthropicCreateResult['usage']> = {}): AnthropicCreateResult {
  return {
    content: [{ type: 'text', text }],
    usage: { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0, ...usage },
  };
}

function fakeClient(create: AnthropicClient['messages']['create']): AnthropicClient {
  return { messages: { create } };
}

describe('AnthropicChatModel', () => {
  it('sends model id, cache_control on system, temperature by tag, and maxTokens', async () => {
    const create = vi.fn().mockResolvedValue(textResult('plain reply'));
    const model = new AnthropicChatModel(fakeClient(create));

    await model.complete({
      system: 'you are Sam',
      messages: [{ role: 'user', content: 'hi' }],
      maxTokens: 120,
      tag: 'character',
    });

    expect(create).toHaveBeenCalledTimes(1);
    const params = create.mock.calls[0]![0];
    expect(params.model).toBe(ANTHROPIC_MODEL_ID);
    expect(params.max_tokens).toBe(120);
    expect(params.temperature).toBe(0.7);
    expect(params.system).toEqual([{ type: 'text', text: 'you are Sam', cache_control: { type: 'ephemeral' } }]);
    expect(params.messages).toEqual([{ role: 'user', content: 'hi' }]);
  });

  it('uses temperature 0.2 for feedback tag', async () => {
    const create = vi.fn().mockResolvedValue(textResult('plain reply'));
    const model = new AnthropicChatModel(fakeClient(create));

    await model.complete({ system: 's', messages: [], maxTokens: 300, tag: 'feedback' });

    expect(create.mock.calls[0]![0].temperature).toBe(0.2);
  });

  it('maps usage fields including cache_read_input_tokens', async () => {
    const create = vi
      .fn()
      .mockResolvedValue(textResult('plain reply', { input_tokens: 42, output_tokens: 7, cache_read_input_tokens: 30 }));
    const model = new AnthropicChatModel(fakeClient(create));

    const result = await model.complete({ system: 's', messages: [], maxTokens: 50, tag: 'character' });

    expect(result.usage).toEqual({ inputTokens: 42, outputTokens: 7, cachedInputTokens: 30 });
  });

  it('defaults cachedInputTokens to 0 when the field is null', async () => {
    const create = vi.fn().mockResolvedValue(textResult('plain reply', { cache_read_input_tokens: null }));
    const model = new AnthropicChatModel(fakeClient(create));

    const result = await model.complete({ system: 's', messages: [], maxTokens: 50, tag: 'character' });

    expect(result.usage.cachedInputTokens).toBe(0);
  });

  it('parses and validates JSON on the first try when it matches the schema', async () => {
    const good = { reply: 'hi', warmth_delta: 1, reason_code: 'open_question' };
    const create = vi.fn().mockResolvedValue(textResult(JSON.stringify(good)));
    const model = new AnthropicChatModel(fakeClient(create));

    const result = await model.complete({
      system: 's',
      messages: [],
      maxTokens: 120,
      json: CharacterOutputSchema,
      tag: 'character',
    });

    expect(create).toHaveBeenCalledTimes(1);
    expect(result.json).toEqual(good);
  });

  it('retries once with a corrective message when JSON fails to parse or validate, then succeeds', async () => {
    const good = { reply: 'hi', warmth_delta: 1, reason_code: 'open_question' };
    const create = vi
      .fn()
      .mockResolvedValueOnce(textResult('not json', { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 2 }))
      .mockResolvedValueOnce(
        textResult(JSON.stringify(good), { input_tokens: 20, output_tokens: 8, cache_read_input_tokens: 3 }),
      );
    const model = new AnthropicChatModel(fakeClient(create));

    const result = await model.complete({
      system: 's',
      messages: [{ role: 'user', content: 'hi' }],
      maxTokens: 120,
      json: CharacterOutputSchema,
      tag: 'character',
    });

    expect(create).toHaveBeenCalledTimes(2);
    expect(result.json).toEqual(good);
    // usage must be summed across both API calls, not just the retry's, so the cost circuit breaker isn't undercounted
    expect(result.usage).toEqual({ inputTokens: 30, outputTokens: 13, cachedInputTokens: 5 });
    const retryParams = create.mock.calls[1]![0];
    expect(retryParams.messages).toEqual([
      { role: 'user', content: 'hi' },
      {
        role: 'user',
        content:
          'Your previous response was not valid JSON matching the required schema. Reply with ONLY the corrected JSON object, nothing else.\n\nYour previous response was:\nnot json',
      },
    ]);
  });

  it('keeps a single user-role retry message even when the transcript ends on a character turn (no assistant/assistant collision)', async () => {
    const good = { reply: 'hi', warmth_delta: 1, reason_code: 'open_question' };
    const create = vi
      .fn()
      .mockResolvedValueOnce(textResult('not json'))
      .mockResolvedValueOnce(textResult(JSON.stringify(good)));
    const model = new AnthropicChatModel(fakeClient(create));

    await model.complete({
      system: 's',
      messages: [
        { role: 'user', content: 'hi' },
        { role: 'character', content: 'hey there' },
      ],
      maxTokens: 120,
      json: CharacterOutputSchema,
      tag: 'feedback',
    });

    const retryParams = create.mock.calls[1]![0];
    const roles = retryParams.messages.map((m: { role: string }) => m.role);
    expect(roles).toEqual(['user', 'assistant', 'user']);
  });

  it('throws when JSON is still invalid after the retry', async () => {
    const create = vi
      .fn()
      .mockResolvedValueOnce(textResult('not json'))
      .mockResolvedValueOnce(textResult('still not json'));
    const model = new AnthropicChatModel(fakeClient(create));

    await expect(
      model.complete({ system: 's', messages: [], maxTokens: 120, json: CharacterOutputSchema, tag: 'character' }),
    ).rejects.toThrow(/failed JSON schema after retry/);
    expect(create).toHaveBeenCalledTimes(2);
  });
});
