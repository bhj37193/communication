// Integration test: P0-21, the retention sweep, DELETE /v1/me/data, and the
// Clerk webhook, driven over real HTTP (webhook + deletion) and direct
// service calls (sweep — jobs/scheduler.ts is started by index.ts only,
// never by tests) against charisma_test. No real API key.
import { createHmac, randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { FakeChatModel, SAM_GOOD_RUN } from '@charisma/core/fakes/FakeChatModel';
import { buildApp } from '../app.js';
import { FakeAuthVerifier } from '../auth/AuthVerifier.js';
import type { Deps } from '../composition.js';
import { createDb } from '../db/client.js';
import { results, sessions, transcripts, users } from '../db/schema.js';
import { ensureContentSeeded } from '../db/seed.js';
import { loadEnv, type Env } from '../env.js';
import { sweepExpiredContent, sweepStaleOpenSessions } from '../services/retention.js';

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

function authHeaders(prefix: string): Record<string, string> {
  return { authorization: `Bearer ${prefix}-${randomUUID()}` };
}

async function openSession(app: ReturnType<typeof buildTestApp>, headers: Record<string, string>) {
  const opened = await app.inject({ method: 'POST', url: '/v1/sessions', headers });
  expect(opened.statusCode).toBe(201);
  return opened.json().session_id as string;
}

describe('retention sweep', () => {
  it('hard-deletes transcripts/results past their TTL', async () => {
    const app = buildTestApp(env);
    const sessionId = await openSession(app, authHeaders('ttl'));

    await db.update(transcripts).set({ expiresAt: new Date(0) }).where(eq(transcripts.sessionId, sessionId));

    await sweepExpiredContent(db, new Date());

    const [row] = await db.select().from(transcripts).where(eq(transcripts.sessionId, sessionId));
    expect(row).toBeUndefined();
  });

  it('auto-ends a stale open session with no messages as abandoned', async () => {
    const app = buildTestApp(env);
    const sessionId = await openSession(app, authHeaders('stale-empty'));

    await db
      .update(sessions)
      .set({ startedAt: new Date(Date.now() - 61 * 60 * 1000) })
      .where(eq(sessions.id, sessionId));

    await sweepStaleOpenSessions(db, new Date());

    const [row] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    expect(row?.state).toBe('abandoned');
  });

  it('auto-ends a stale open session with a user message as scored (template feedback)', async () => {
    const app = buildTestApp(env);
    const headers = authHeaders('stale-active');
    const sessionId = await openSession(app, headers);

    const message = await app.inject({
      method: 'POST',
      url: `/v1/sessions/${sessionId}/messages`,
      headers,
      payload: { text: SAM_GOOD_RUN.userMessages[0] },
    });
    expect(message.statusCode).toBe(200);

    await db
      .update(sessions)
      .set({ startedAt: new Date(Date.now() - 61 * 60 * 1000) })
      .where(eq(sessions.id, sessionId));

    const { scored, abandoned } = await sweepStaleOpenSessions(db, new Date());
    expect(scored).toBeGreaterThanOrEqual(1);
    expect(abandoned).toBeGreaterThanOrEqual(0);

    const [session] = await db.select().from(sessions).where(eq(sessions.id, sessionId));
    expect(session?.state).toBe('scored');
    const [result] = await db.select().from(results).where(eq(results.sessionId, sessionId));
    expect(result?.templateFallback).toBe(true);
  });
});

describe('DELETE /v1/me/data', () => {
  it('hard-deletes the caller and returns 204', async () => {
    const app = buildTestApp(env);
    const headers = authHeaders('delete-me');
    await openSession(app, headers);

    const clerkId = headers.authorization!.slice('Bearer '.length);
    const deleted = await app.inject({ method: 'DELETE', url: '/v1/me/data', headers });
    expect(deleted.statusCode).toBe(204);

    const [row] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    expect(row).toBeUndefined();
  });
});

describe('POST /v1/webhooks/clerk', () => {
  it('accepts unsigned bodies and upserts a user on user.created (fake/test mode)', async () => {
    const app = buildTestApp(env);
    const clerkId = `webhook-created-${randomUUID()}`;

    const res = await app.inject({
      method: 'POST',
      url: '/v1/webhooks/clerk',
      payload: { type: 'user.created', data: { id: clerkId } },
    });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ received: true });

    const [row] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    expect(row).toBeDefined();
  });

  it('hard-deletes the user on user.deleted, and is idempotent for an unknown user', async () => {
    const app = buildTestApp(env);
    const clerkId = `webhook-deleted-${randomUUID()}`;
    await app.inject({ method: 'POST', url: '/v1/webhooks/clerk', payload: { type: 'user.created', data: { id: clerkId } } });

    const first = await app.inject({
      method: 'POST',
      url: '/v1/webhooks/clerk',
      payload: { type: 'user.deleted', data: { id: clerkId } },
    });
    expect(first.statusCode).toBe(200);
    const [row] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    expect(row).toBeUndefined();

    // Clerk retries webhooks; a re-delivered user.deleted must not error.
    const second = await app.inject({
      method: 'POST',
      url: '/v1/webhooks/clerk',
      payload: { type: 'user.deleted', data: { id: clerkId } },
    });
    expect(second.statusCode).toBe(200);
  });

  it('rejects a bad svix signature and accepts a valid one when CLERK_WEBHOOK_SECRET is set', async () => {
    const secret = 'whsec_' + Buffer.from('test-signing-secret-32-bytes!!!').toString('base64');
    const signedEnv = loadEnv({ ...process.env, DATABASE_URL: env.DATABASE_URL, CLERK_WEBHOOK_SECRET: secret });
    const app = buildTestApp(signedEnv);
    const clerkId = `webhook-signed-${randomUUID()}`;
    const body = JSON.stringify({ type: 'user.created', data: { id: clerkId } });

    const svixId = `msg_${randomUUID()}`;
    const svixTimestamp = String(Math.floor(Date.now() / 1000));
    const signedContent = `${svixId}.${svixTimestamp}.${body}`;
    const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
    const signature = createHmac('sha256', secretBytes).update(signedContent).digest('base64');

    const bad = await app.inject({
      method: 'POST',
      url: '/v1/webhooks/clerk',
      headers: {
        'content-type': 'application/json',
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': 'v1,not-the-real-signature',
      },
      payload: body,
    });
    expect(bad.statusCode).toBe(400);

    const good = await app.inject({
      method: 'POST',
      url: '/v1/webhooks/clerk',
      headers: {
        'content-type': 'application/json',
        'svix-id': svixId,
        'svix-timestamp': svixTimestamp,
        'svix-signature': `v1,${signature}`,
      },
      payload: body,
    });
    expect(good.statusCode).toBe(200);
    const [row] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    expect(row).toBeDefined();
  });
});
