// P0-22: analytics is content-free by construction — every prop is closed
// (enums/numbers only), so no free text can reach analytics_events. Runs
// against real Postgres like the other service-level integration tests.
import { randomUUID } from 'node:crypto';
import { eq } from 'drizzle-orm';
import { describe, expect, it } from 'vitest';
import { createDb } from '../db/client.js';
import { analyticsEvents, users } from '../db/schema.js';
import { loadEnv } from '../env.js';
import { trackEvent } from './analytics.js';

const env = loadEnv({
  ...process.env,
  DATABASE_URL: 'postgres://charisma_app@localhost:5432/charisma_test',
});
const { db } = createDb(env.DATABASE_URL);

async function makeUser(tz = 'UTC') {
  const [row] = await db.insert(users).values({ clerkId: `analytics-${randomUUID()}`, tz }).returning();
  return row!;
}

describe('trackEvent', () => {
  it('rejects a free-text value in a closed enum prop, at compile time and at runtime', async () => {
    await expect(
      trackEvent(
        db,
        null,
        'session_completed',
        // @ts-expect-error — `result` is a closed enum, not a free-text field
        { score: 100, result: 'amazing win, total charisma' },
        new Date(),
      ),
    ).rejects.toThrow();
  });

  it('inserts a valid event with a closed props schema', async () => {
    const user = await makeUser();
    await trackEvent(db, user, 'session_started', {}, new Date());
    const rows = await db.select().from(analyticsEvents).where(eq(analyticsEvents.userId, user.id));
    expect(rows.some((r) => r.name === 'session_started')).toBe(true);
  });

  it('does not fire d1_return on a user\'s first-ever event', async () => {
    const user = await makeUser();
    await trackEvent(db, user, 'session_started', {}, new Date('2026-01-01T12:00:00Z'));
    const rows = await db.select().from(analyticsEvents).where(eq(analyticsEvents.userId, user.id));
    expect(rows.some((r) => r.name === 'd1_return')).toBe(false);
  });

  it('does not fire d1_return for a second event on the same local day', async () => {
    const user = await makeUser('UTC');
    await trackEvent(db, user, 'session_started', {}, new Date('2026-01-01T12:00:00Z'));
    await trackEvent(db, user, 'session_started', {}, new Date('2026-01-01T18:00:00Z'));

    const rows = await db.select().from(analyticsEvents).where(eq(analyticsEvents.userId, user.id));
    expect(rows.some((r) => r.name === 'd1_return')).toBe(false);
  });

  it('derives d1_return on the first event of a new local day', async () => {
    const user = await makeUser('UTC');
    await trackEvent(db, user, 'session_started', {}, new Date('2026-01-01T12:00:00Z'));
    await trackEvent(db, user, 'session_started', {}, new Date('2026-01-02T12:00:00Z'));

    const rows = await db.select().from(analyticsEvents).where(eq(analyticsEvents.userId, user.id));
    expect(rows.filter((r) => r.name === 'd1_return')).toHaveLength(1);
  });
});
