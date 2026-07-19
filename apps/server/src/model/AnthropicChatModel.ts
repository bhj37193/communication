// apps/server/src/model/AnthropicChatModel.ts
// Real ChatModel impl, PRD-CHARISMA-CHAT.md Section 3.4. Lives outside
// packages/core (model.ts is interface-only, per its own header comment).
// Client is injected so unit tests run offline against a fake; composition.ts
// wires the real @anthropic-ai/sdk client.
import type { ZodTypeAny } from 'zod';
import type { ChatModel, TokenUsage } from '@charisma/core/model';
import type { ChatMessage } from '@charisma/core/schemas';

export const ANTHROPIC_MODEL_ID = 'claude-haiku-4-5';
const TEMPERATURE_BY_TAG = { character: 0.7, feedback: 0.2 } as const;
const RETRY_INSTRUCTION =
  'Your previous response was not valid JSON matching the required schema. Reply with ONLY the corrected JSON object, nothing else.';

export interface AnthropicMessageParam {
  role: 'user' | 'assistant';
  content: string;
}

export interface AnthropicSystemBlock {
  type: 'text';
  text: string;
  cache_control?: { type: 'ephemeral' };
}

export interface AnthropicCreateParams {
  model: string;
  max_tokens: number;
  temperature: number;
  system: AnthropicSystemBlock[];
  messages: AnthropicMessageParam[];
}

export interface AnthropicCreateResult {
  content: Array<{ type: string; text?: string }>;
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number | null;
  };
}

export interface AnthropicClient {
  messages: { create(params: AnthropicCreateParams): Promise<AnthropicCreateResult> };
}

function toAnthropicRole(role: ChatMessage['role']): 'user' | 'assistant' {
  return role === 'user' ? 'user' : 'assistant';
}

export class AnthropicChatModel implements ChatModel {
  constructor(private readonly client: AnthropicClient) {}

  async complete(req: Parameters<ChatModel['complete']>[0]): ReturnType<ChatModel['complete']> {
    const params: AnthropicCreateParams = {
      model: ANTHROPIC_MODEL_ID,
      max_tokens: req.maxTokens,
      temperature: TEMPERATURE_BY_TAG[req.tag],
      system: [{ type: 'text', text: req.system, cache_control: { type: 'ephemeral' } }],
      messages: req.messages.map((m) => ({ role: toAnthropicRole(m.role), content: m.content })),
    };

    let result = await this.client.messages.create(params);
    let usage = this.usageOf(result);
    let parsed = this.tryParse(result, req.json);

    if (req.json && !parsed.ok) {
      const badText = this.textOf(result);
      result = await this.client.messages.create({
        ...params,
        messages: [
          ...params.messages,
          { role: 'user', content: `${RETRY_INSTRUCTION}\n\nYour previous response was:\n${badText}` },
        ],
      });
      usage = this.sumUsage(usage, this.usageOf(result));
      parsed = this.tryParse(result, req.json);
      if (!parsed.ok) {
        throw new Error(`AnthropicChatModel: response failed JSON schema after retry (tag=${req.tag})`);
      }
    }

    return { text: this.textOf(result), json: parsed.ok ? parsed.value : undefined, usage };
  }

  private sumUsage(a: TokenUsage, b: TokenUsage): TokenUsage {
    return {
      inputTokens: a.inputTokens + b.inputTokens,
      outputTokens: a.outputTokens + b.outputTokens,
      cachedInputTokens: a.cachedInputTokens + b.cachedInputTokens,
    };
  }

  private textOf(result: AnthropicCreateResult): string {
    const block = result.content.find((b) => b.type === 'text' && typeof b.text === 'string');
    if (!block?.text) throw new Error('AnthropicChatModel: no text content block in response');
    return block.text;
  }

  private tryParse(
    result: AnthropicCreateResult,
    schema: ZodTypeAny | undefined,
  ): { ok: true; value: unknown } | { ok: false } {
    if (!schema) return { ok: true, value: undefined };
    try {
      const out = schema.safeParse(JSON.parse(this.textOf(result)));
      return out.success ? { ok: true, value: out.data } : { ok: false };
    } catch {
      return { ok: false };
    }
  }

  private usageOf(result: AnthropicCreateResult): TokenUsage {
    return {
      inputTokens: result.usage.input_tokens,
      outputTokens: result.usage.output_tokens,
      cachedInputTokens: result.usage.cache_read_input_tokens ?? 0,
    };
  }
}
