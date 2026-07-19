// Content-free analytics: every event name is allowlisted (mirrors the SQL
// CHECK on analytics_events.name) and every prop is enums/numbers only, so
// no transcript text or other free-form user content can ever land in an
// event. d1_return is never called directly by routes; it's derived here
// whenever a user's event is the first one on a new local calendar day.
import { desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import type { Db } from '../db/client.js';
import { analyticsEvents } from '../db/schema.js';
import { localDate } from './caps.js';

const EVENT_SCHEMAS = {
  signup: z.object({}).strict(),
  challenge_viewed: z.object({}).strict(),
  session_started: z.object({}).strict(),
  session_completed: z
    .object({
      score: z.number().int().min(0).max(100),
      result: z.enum(['passed', 'failed']),
    })
    .strict(),
  result_viewed: z.object({}).strict(),
  share_tapped: z.object({}).strict(),
  d1_return: z.object({}).strict(),
  streak_broken: z.object({ previousStreak: z.number().int().nonnegative() }).strict(),
  paywall_viewed: z.object({}).strict(),
  subscribe_started: z.object({}).strict(),
  subscribe_completed: z.object({}).strict(),
} as const;

export type AnalyticsEventName = keyof typeof EVENT_SCHEMAS;
export type AnalyticsUser = { id: string; tz: string };

async function insertEvent(
  db: Db,
  userId: string | null,
  name: AnalyticsEventName,
  props: unknown,
  now: Date,
): Promise<void> {
  const parsed = EVENT_SCHEMAS[name].parse(props);
  await db.insert(analyticsEvents).values({ userId, name, props: parsed, createdAt: now });
}

export async function trackEvent<Name extends AnalyticsEventName>(
  db: Db,
  user: AnalyticsUser | null,
  name: Name,
  props: z.infer<(typeof EVENT_SCHEMAS)[Name]>,
  now: Date,
): Promise<void> {
  if (user && name !== 'd1_return') {
    const [last] = await db
      .select({ createdAt: analyticsEvents.createdAt })
      .from(analyticsEvents)
      .where(eq(analyticsEvents.userId, user.id))
      .orderBy(desc(analyticsEvents.createdAt))
      .limit(1);
    if (last && localDate(user.tz, last.createdAt) !== localDate(user.tz, now)) {
      await insertEvent(db, user.id, 'd1_return', {}, now);
    }
  }
  await insertEvent(db, user?.id ?? null, name, props, now);
}
