// P0-26: live smoke for AnthropicChatModel, deferred until G-01 (real
// ANTHROPIC_API_KEY) lands. One real character-turn call, asserts the
// response parses against CharacterOutputSchema and usage is nonzero.
import Anthropic from '@anthropic-ai/sdk';
import { CharacterOutputSchema } from '@charisma/core/schemas';
import { AnthropicChatModel } from '../src/model/AnthropicChatModel.js';

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  console.error('smoke:anthropic FAILED: ANTHROPIC_API_KEY is not set (G-01 not yet landed).');
  process.exit(1);
}

const model = new AnthropicChatModel(new Anthropic({ apiKey }));

const result = await model.complete({
  system: 'You are Sam, a friendly stranger at a housewarming party. Reply in character as strict JSON.',
  messages: [{ role: 'user', content: 'Hey, how do you know the host?' }],
  maxTokens: 120,
  json: CharacterOutputSchema,
  tag: 'character',
});

const parsed = CharacterOutputSchema.safeParse(result.json);
if (!parsed.success) {
  console.error('smoke:anthropic FAILED: response did not match CharacterOutputSchema.', result.text);
  process.exit(1);
}
if (result.usage.inputTokens <= 0 || result.usage.outputTokens <= 0) {
  console.error('smoke:anthropic FAILED: usage tokens were not reported.', result.usage);
  process.exit(1);
}

console.log('smoke:anthropic PASSED', { reply: parsed.data.reply, usage: result.usage });
process.exit(0);
