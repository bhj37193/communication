// Integration test: the loop proof, scoped to what's wired so far (primer.md).
// Real HTTP round trips against the app factory + charisma_test db + a
// FakeChatModel built per test, no real API key. Each test uses a fresh
// random user so tests never collide on the one-scored-session daily cap.
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  FakeChatModel,
  SAM_BAD_RUN,
  SAM_GOOD_RUN,
  type ScriptedSession,
} from '@charisma/core/fakes/FakeChatModel';
import type { ChatModel } from '@charisma/core/model';
import { buildApp } from '../app.js';
import { FakeAuthVerifier } from '../auth/AuthVerifier.js';
import type { Deps } from '../composition.js';
import { createDb } from '../db/client.js';
import { ensureContentSeeded } from '../db/seed.js';
import { loadEnv } from '../env.js';

const env = loadEnv({
  ...process.env,
  DATABASE_URL: 'postgres://charisma_app@localhost:5432/charisma_test',
});
const { db, pool } = createDb(env.DATABASE_URL);

beforeAll(async () => {
  await ensureContentSeeded(db);
});
afterAll(async () => {
  await pool.end();
});

function buildTestApp(chatModel: ChatModel) {
  const deps: Deps = {
    env,
    db,
    authVerifier: new FakeAuthVerifier(),
    getChatModel: () => chatModel,
    releaseChatModel: () => {},
  };
  return buildApp(deps);
}

async function playToResult(app: ReturnType<typeof buildApp>, session: ScriptedSession) {
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

describe('the loop proof (P0-23, scoped)', () => {
  it('good run passes at its exact deterministic score', async () => {
    const app = buildTestApp(new FakeChatModel(SAM_GOOD_RUN));
    const result = await playToResult(app, SAM_GOOD_RUN);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
    expect(result.win.quote).toBe(SAM_GOOD_RUN.feedback.win.quote);
    expect(result.template_fallback).toBe(false);
    expect(result.signals).toEqual({
      open_questions: 3,
      followups: 2,
      reciprocity: 2,
      spotlight_share: 0.6,
      interview_mode: false,
      monologue_brag: false,
      final_warmth: 3,
    });
  });

  it('bad run fails at its exact deterministic score', async () => {
    const app = buildTestApp(new FakeChatModel(SAM_BAD_RUN));
    const result = await playToResult(app, SAM_BAD_RUN);
    expect(result.score).toBe(20);
    expect(result.passed).toBe(false);
    expect(result.signals.monologue_brag).toBe(true);
    expect(result.template_fallback).toBe(false);
  });

  it('fabricated-quote feedback is rejected and falls back to the template', async () => {
    const app = buildTestApp(new FakeChatModel(SAM_GOOD_RUN, { fabricateFeedbackQuote: true }));
    const result = await playToResult(app, SAM_GOOD_RUN);
    expect(result.score).toBe(100); // signals-only; unaffected by the feedback fallback
    expect(result.template_fallback).toBe(true);
    expect(result.win.quote).toBe(''); // template feedback carries no quote to fabricate
  });
});
