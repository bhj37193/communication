// The ONLY file that reads provider env vars and instantiates concrete
// classes (mock-boundary architecture). Everything else consumes Deps.
import Anthropic from '@anthropic-ai/sdk';
import { FakeChatModel, SAM_GOOD_RUN } from '@charisma/core/fakes/FakeChatModel';
import type { ChatModel } from '@charisma/core/model';
import { FakeAuthVerifier, type AuthVerifier } from './auth/AuthVerifier.js';
import type { Db } from './db/client.js';
import type { Env } from './env.js';
import { AnthropicChatModel } from './model/AnthropicChatModel.js';

export interface Deps {
  env: Env;
  db: Db;
  authVerifier: AuthVerifier;
  getChatModel: (sessionId: string) => ChatModel;
  releaseChatModel: (sessionId: string) => void;
}

// ponytail: in-memory per-session cache. Only needed because FakeChatModel is
// stateful across calls (a real ChatModel is stateless per call and needs no
// cache). Ceiling: single-process, lost on restart; drop this once
// MODEL_PROVIDER=anthropic ships.
const fakeModelsBySession = new Map<string, ChatModel>();

export function buildDeps(env: Env, db: Db): Deps {
  if (env.NODE_ENV === 'production' && env.AUTH_PROVIDER === 'fake') {
    throw new Error('fail-closed: AUTH_PROVIDER=fake is forbidden when NODE_ENV=production');
  }
  if (env.AUTH_PROVIDER !== 'fake') {
    throw new Error(`AUTH_PROVIDER=${env.AUTH_PROVIDER} has no implementation yet`);
  }
  const authVerifier: AuthVerifier = new FakeAuthVerifier();

  if (env.MODEL_PROVIDER === 'anthropic') {
    if (!env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is required when MODEL_PROVIDER=anthropic');
    }
    const anthropicModel: ChatModel = new AnthropicChatModel(new Anthropic({ apiKey: env.ANTHROPIC_API_KEY }));
    const getChatModel = (): ChatModel => anthropicModel;
    const releaseChatModel = (): void => {};
    return { env, db, authVerifier, getChatModel, releaseChatModel };
  }
  if (env.MODEL_PROVIDER !== 'fake') {
    throw new Error(`MODEL_PROVIDER=${env.MODEL_PROVIDER} has no implementation yet`);
  }
  const getChatModel = (sessionId: string): ChatModel => {
    let model = fakeModelsBySession.get(sessionId);
    if (!model) {
      model = new FakeChatModel(SAM_GOOD_RUN);
      fakeModelsBySession.set(sessionId, model);
    }
    return model;
  };
  const releaseChatModel = (sessionId: string): void => {
    fakeModelsBySession.delete(sessionId);
  };

  return { env, db, authVerifier, getChatModel, releaseChatModel };
}
