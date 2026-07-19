// Integration test: P0-20, the daily cap + cost circuit breaker, driven over
// real HTTP against charisma_test. No real API key. Each test uses a fresh
// random user so tests never collide on the one-scored-session daily cap.
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { FakeChatModel, SAM_GOOD_RUN } from '@charisma/core/fakes/FakeChatModel';
import { buildApp } from '../app.js';
import { FakeAuthVerifier } from '../auth/AuthVerifier.js';
import type { Deps } from '../composition.js';
import { createDb } from '../db/client.js';
import { modelUsage } from '../db/schema.js';
import { ensureContentSeeded } from '../db/seed.js';
import { loadEnv, type Env } from '../env.js';

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

function buildTestApp(testEnv: Env) {
  const deps: Deps = {
    env: testEnv,
    db,
    authVerifier: new FakeAuthVerifier(),
    getChatModel: () => new FakeChatModel(SAM_GOOD_RUN),
    releaseChatModel: () => {},
  };
  return buildApp(deps);
}

function authHeaders(): Record<string, string> {
  return { authorization: `Bearer caps-${randomUUID()}` };
}

describe('daily scored-session cap', () => {
  it('blocks a second session the same day for the same user', async () => {
    const app = buildTestApp(env);
    const headers = authHeaders();

    const first = await app.inject({ method: 'POST', url: '/v1/sessions', headers });
    expect(first.statusCode).toBe(201);

    const second = await app.inject({ method: 'POST', url: '/v1/sessions', headers });
    expect(second.statusCode).toBe(409);
    expect(second.json()).toEqual({
      error: { code: 'CAPPED', message: 'daily scored session limit reached' },
    });
  });
});

describe('cost circuit breaker', () => {
  it('blocks new sessions once budget is crossed, but lets an open session finish', async () => {
    const appDefault = buildTestApp(env);

    // Open a session under the default (generous) budget before the breaker trips.
    const openHeaders = authHeaders();
    const opened = await appDefault.inject({ method: 'POST', url: '/v1/sessions', headers: openHeaders });
    expect(opened.statusCode).toBe(201);
    const { session_id: openSessionId } = opened.json();

    // Directly record spend that crosses a low budget deterministically
    // (FakeChatModel always reports zero usage, so it can never trip the
    // breaker on its own — ponytail: simulate real provider spend by
    // inserting the model_usage row the real ChatModel would have written).
    // tokensIn * 1e-6 + tokensOut * 5e-6 = 0.01 + 0.04 = 0.05 USD.
    await db.insert(modelUsage).values({
      sessionId: null,
      tag: 'character',
      tokensIn: 10_000,
      tokensOut: 8_000,
    });

    const lowBudgetEnv = loadEnv({ ...process.env, DATABASE_URL: env.DATABASE_URL, DAILY_MODEL_BUDGET_USD: '0.01' });
    const appTripped = buildTestApp(lowBudgetEnv);

    const blocked = await appTripped.inject({ method: 'POST', url: '/v1/sessions', headers: authHeaders() });
    expect(blocked.statusCode).toBe(503);
    expect(blocked.json()).toEqual({
      error: { code: 'BUDGET_EXCEEDED', message: 'daily model budget exhausted' },
    });

    // The breaker only guards session creation, not message/end — drive the
    // rest of the same open session through the tripped (low-budget) app to
    // prove that, not just that some other app has headroom.
    const message = await appTripped.inject({
      method: 'POST',
      url: `/v1/sessions/${openSessionId}/messages`,
      headers: openHeaders,
      payload: { text: SAM_GOOD_RUN.userMessages[0] },
    });
    expect(message.statusCode).toBe(200);

    const ended = await appTripped.inject({
      method: 'POST',
      url: `/v1/sessions/${openSessionId}/end`,
      headers: openHeaders,
    });
    expect(ended.statusCode).toBe(200);
    expect(ended.json()).toEqual({ session_id: openSessionId, status: 'scored' });
  });
});
