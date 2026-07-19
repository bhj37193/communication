// Integration test: POST /v1/events/share-tapped, the mobile share-card
// analytics ping, driven over real HTTP against charisma_test. No real API key.
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { afterAll, describe, expect, it } from 'vitest';
import { FakeChatModel, SAM_GOOD_RUN } from '@charisma/core/fakes/FakeChatModel';
import { analyticsEvents, users } from '../../src/db/schema.js';
import { buildTestApp, db, pool } from './setup.js';

afterAll(async () => {
  await pool.end();
});

describe('POST /v1/events/share-tapped', () => {
  it('returns 401 with no Authorization header', async () => {
    const app = buildTestApp(new FakeChatModel(SAM_GOOD_RUN));
    const res = await app.inject({ method: 'POST', url: '/v1/events/share-tapped' });
    expect(res.statusCode).toBe(401);
  });

  it('records a share_tapped event and returns 204 for an authenticated caller', async () => {
    const app = buildTestApp(new FakeChatModel(SAM_GOOD_RUN));
    const clerkId = `share-${randomUUID()}`;
    const headers = { authorization: `Bearer ${clerkId}` };

    const res = await app.inject({ method: 'POST', url: '/v1/events/share-tapped', headers });
    expect(res.statusCode).toBe(204);

    const [user] = await db.select().from(users).where(eq(users.clerkId, clerkId));
    expect(user).toBeDefined();

    const rows = await db
      .select()
      .from(analyticsEvents)
      .where(eq(analyticsEvents.userId, user!.id));
    expect(rows.some((r) => r.name === 'share_tapped')).toBe(true);
  });
});
