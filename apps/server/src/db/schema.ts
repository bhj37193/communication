import { sql } from 'drizzle-orm';
import { pgTable, pgEnum, uuid, text, integer, boolean, jsonb,
  timestamp, date, bigserial, primaryKey, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const entitlementSource = pgEnum('entitlement_source', ['paddle','apple','google','promo']);
export const entitlementStatus = pgEnum('entitlement_status', ['active','past_due','canceled']);
export const sessionState     = pgEnum('session_state', ['open','scoring','scored','abandoned']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  tz: text('tz').notNull().default('UTC'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const entitlements = pgTable('entitlements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  source: entitlementSource('source').notNull(),
  product: text('product').notNull(),
  status: entitlementStatus('status').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  externalRef: text('external_ref'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('entitlements_user_idx').on(t.userId)]);

export const paddleEvents = pgTable('paddle_events', {
  eventId: text('event_id').primaryKey(),
  payload: jsonb('payload').notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }).notNull().defaultNow(),
});

export const skillPacks = pgTable('skill_packs', {
  packId: text('pack_id').primaryKey(),
  version: text('version').notNull(),
  loadedAt: timestamp('loaded_at', { withTimezone: true }).notNull().defaultNow(),
});

export const skills = pgTable('skills', {
  id: text('id').primaryKey(),
  packId: text('pack_id').notNull().references(() => skillPacks.packId),
  name: text('name').notNull(),
  objective: text('objective').notNull(),
  prerequisites: text('prerequisites').array().notNull().default([]),
});

export const units = pgTable('units', {
  id: text('id').primaryKey(),
  skillId: text('skill_id').notNull().references(() => skills.id),
  spec: jsonb('spec').notNull(),                 // full Unit (PRD 4.2), Zod-validated at load
});

export const progressEvents = pgTable('progress_events', {   // append-only (SD-8)
  seq: bigserial('seq', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').notNull(),
  type: text('type').notNull(),                  // PRD 4.7 event names, CHECK-constrained in SQL
  payload: jsonb('payload').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('progress_events_user_idx').on(t.userId, t.seq)]);

export const userSkillState = pgTable('user_skill_state', {  // fold over progress_events, rebuildable
  userId: uuid('user_id').notNull(),
  skillId: text('skill_id').notNull(),
  status: text('status').notNull().default('locked'),        // locked|unlocked|in_progress|mastered
  passes: integer('passes').notNull().default(0),
  lastPassDate: date('last_pass_date'),                      // user-tz date, for distinct_days
  reviewBox: integer('review_box'),                          // 1..3 -> 2/7/21 days (P1)
  reviewDueAt: timestamp('review_due_at', { withTimezone: true }),
}, t => [primaryKey({ columns: [t.userId, t.skillId] })]);

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  unitId: text('unit_id').notNull().references(() => units.id),
  state: sessionState('state').notNull().default('open'),
  warmth: integer('warmth').notNull().default(0),            // current server-held warmth
  warmthTrace: jsonb('warmth_trace').notNull().default([]),  // int[] appended per turn
  characterCalls: integer('character_calls').notNull().default(0),  // 12-call cap (PRD 3.10)
  feedbackCalls: integer('feedback_calls').notNull().default(0),    // 2-call cap (SD-7)
  incognito: boolean('incognito').notNull().default(false),  // always false until P3
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
}, t => [uniqueIndex('sessions_one_open_per_user').on(t.userId).where(sql`state = 'open'`)]);

export const transcripts = pgTable('transcripts', {
  sessionId: uuid('session_id').primaryKey().references(() => sessions.id, { onDelete: 'cascade' }),
  messages: jsonb('messages').notNull().default([]),         // ChatLine[] incl opener
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),  // created + 60d (PRD 3.8)
});

export const results = pgTable('results', {
  sessionId: uuid('session_id').primaryKey().references(() => sessions.id, { onDelete: 'cascade' }),
  win: jsonb('win').notNull(), fix: jsonb('fix').notNull(), moment: jsonb('moment').notNull(),
  score: integer('score').notNull(),
  passed: boolean('passed').notNull(),
  signals: jsonb('signals').notNull(),
  templateFallback: boolean('template_fallback').notNull().default(false),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const dailyUsage = pgTable('daily_usage', {
  userId: uuid('user_id').notNull(),
  day: date('day').notNull(),                                // user-tz local date
  scoredCount: integer('scored_count').notNull().default(0),
  incognitoCount: integer('incognito_count').notNull().default(0),
}, t => [primaryKey({ columns: [t.userId, t.day] })]);

export const modelUsage = pgTable('model_usage', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sessionId: uuid('session_id'),
  tag: text('tag').notNull(),                                // character | feedback
  tokensIn: integer('tokens_in').notNull(),
  tokensOut: integer('tokens_out').notNull(),
  cachedIn: integer('cached_in').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('model_usage_day_idx').on(t.createdAt)]);

export const analyticsEvents = pgTable('analytics_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id'),                                   // nullable: pre-auth events
  name: text('name').notNull(),                              // closed allowlist, CHECK in SQL
  props: jsonb('props').notNull().default({}),               // closed Zod schema per name, no free text
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const evalTranscripts = pgTable('eval_transcripts', { // SD-9, anonymized
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  messages: jsonb('messages').notNull(),
  warmthTrace: jsonb('warmth_trace').notNull(),
  signals: jsonb('signals').notNull(),
  score: integer('score').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
