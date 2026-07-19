// Shared plumbing for integration tests: real HTTP round trips against the
// app factory + charisma_test db, no real API key. One db/pool per test
// file (vitest isolates files into separate workers), closed in afterAll.
import { randomUUID } from 'node:crypto';
import { expect } from 'vitest';
import type { ScriptedSession } from '@charisma/core/fakes/FakeChatModel';
import type { ChatModel } from '@charisma/core/model';
import { buildApp } from '../../src/app.js';
import { FakeAuthVerifier } from '../../src/auth/AuthVerifier.js';
import type { Deps } from '../../src/composition.js';
import { createDb } from '../../src/db/client.js';
import { ensureContentSeeded } from '../../src/db/seed.js';
import { loadEnv } from '../../src/env.js';

export const env = loadEnv({
  ...process.env,
  DATABASE_URL: 'postgres://charisma_app@localhost:5432/charisma_test',
});
export const { db, pool } = createDb(env.DATABASE_URL);

export async function seedContent(): Promise<void> {
  await ensureContentSeeded(db);
}

export function buildTestApp(chatModel: ChatModel) {
  const deps: Deps = {
    env,
    db,
    authVerifier: new FakeAuthVerifier(),
    getChatModel: () => chatModel,
    releaseChatModel: () => {},
  };
  return buildApp(deps);
}

// Replays a scripted session over real HTTP, mirroring the server's turn
// flow, and returns the polled /result body. Each call uses a fresh random
// user so tests never collide on the one-scored-session daily cap.
export async function playToResult(app: ReturnType<typeof buildApp>, session: ScriptedSession) {
  const bearer = `${session.name}-${randomUUID()}`;
  const headers = { authorization: `Bearer ${bearer}` };

  const created = await app.inject({ method: 'POST', url: '/v1/sessions', headers });
  expect(created.statusCode).toBe(201);
  const { session_id: sessionId, opener } = created.json();
  expect(opener).toBe(session.opener);

  let warmth = 0;
  for (const [i, text] of session.userMessages.entries()) {
    const res = await app.inject({
      method: 'POST',
      url: `/v1/sessions/${sessionId}/messages`,
      headers,
      payload: { text },
    });
    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body.reply).toBe(session.characterOutputs[i]!.reply);
    warmth = Math.min(3, Math.max(0, warmth + session.characterOutputs[i]!.warmth_delta));
    expect(body.warmth).toBe(warmth);
  }

  const ended = await app.inject({ method: 'POST', url: `/v1/sessions/${sessionId}/end`, headers });
  expect(ended.statusCode).toBe(200);
  expect(ended.json()).toEqual({ session_id: sessionId, status: 'scored' });

  const result = await app.inject({ method: 'GET', url: `/v1/sessions/${sessionId}/result`, headers });
  expect(result.statusCode).toBe(200);
  return result.json();
}
