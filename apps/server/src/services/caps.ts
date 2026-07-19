// Daily free-tier cap (1 scored session/day, user-tz local date) and a cost
// circuit breaker (blocks new sessions once today's model spend crosses
// DAILY_MODEL_BUDGET_USD; already-open sessions are left to finish).
import { and, eq, gte, sql } from 'drizzle-orm';
import type { Db } from '../db/client.js';
import { dailyUsage, modelUsage } from '../db/schema.js';

export function localDate(tz: string, now: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(now);
}

export function dailyCapExceeded(scoredCount: number): boolean {
  return scoredCount >= 1;
}

export async function checkDailyCap(
  db: Db,
  userId: string,
  tz: string,
  now: Date,
): Promise<boolean> {
  const day = localDate(tz, now);
  const rows = await db
    .select()
    .from(dailyUsage)
    .where(and(eq(dailyUsage.userId, userId), eq(dailyUsage.day, day)));
  return !dailyCapExceeded(rows[0]?.scoredCount ?? 0);
}

export async function incrementDailyUsage(
  db: Db,
  userId: string,
  tz: string,
  now: Date,
): Promise<void> {
  const day = localDate(tz, now);
  await db
    .insert(dailyUsage)
    .values({ userId, day, scoredCount: 1 })
    .onConflictDoUpdate({
      target: [dailyUsage.userId, dailyUsage.day],
      set: { scoredCount: sql`${dailyUsage.scoredCount} + 1` },
    });
}

// ponytail: approximate Claude Haiku spot pricing (USD/token). Confirm against
// the live pricing page before this gates real spend; good enough as a
// breaker ceiling until then.
const HAIKU_INPUT_USD_PER_TOKEN = 1 / 1_000_000;
const HAIKU_OUTPUT_USD_PER_TOKEN = 5 / 1_000_000;

export function computeSpendUsd(rows: { tokensIn: number; tokensOut: number }[]): number {
  return rows.reduce(
    (sum, r) => sum + r.tokensIn * HAIKU_INPUT_USD_PER_TOKEN + r.tokensOut * HAIKU_OUTPUT_USD_PER_TOKEN,
    0,
  );
}

export async function todaySpendUsd(db: Db, now: Date): Promise<number> {
  const dayStart = new Date(now);
  dayStart.setUTCHours(0, 0, 0, 0);
  const rows = await db
    .select({ tokensIn: modelUsage.tokensIn, tokensOut: modelUsage.tokensOut })
    .from(modelUsage)
    .where(gte(modelUsage.createdAt, dayStart));
  return computeSpendUsd(rows);
}

export async function checkBreaker(db: Db, budgetUsd: number, now: Date): Promise<boolean> {
  return (await todaySpendUsd(db, now)) < budgetUsd;
}

// ponytail: single offset-correction pass, can land up to an hour off right
// at a DST transition that coincides with local midnight. Fine for a
// cap-reset hint; add a second correction pass if that edge case ever bites.
export function nextLocalMidnightUTC(tz: string, now: Date): Date {
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const guess = new Date(`${localDate(tz, tomorrow)}T00:00:00Z`);
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = Object.fromEntries(dtf.formatToParts(guess).map((p) => [p.type, p.value]));
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return new Date(guess.getTime() - (asUtc - guess.getTime()));
}
