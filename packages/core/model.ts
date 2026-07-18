// packages/core/model.ts
// ChatModel provider abstraction, exactly as PRD-CHARISMA-CHAT.md Section 3.4.
// Interface only: concrete implementations (AnthropicChatModel, OpenWeightsChatModel)
// live outside packages/core and are chosen in one composition-root file.
import type { ZodTypeAny } from 'zod';
import type { ChatMessage } from './schemas';

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cachedInputTokens: number;
}

export interface ChatModel {
  complete(req: {
    system: string; // cacheable prefix
    messages: ChatMessage[];
    maxTokens: number;
    json?: ZodTypeAny; // when set, response is parsed+validated JSON
    tag: 'character' | 'feedback'; // for per-touchpoint cost metering
  }): Promise<{ text: string; json?: unknown; usage: TokenUsage }>;
}
