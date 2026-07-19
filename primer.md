# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `FakeChatModel` + `FakeAuthVerifier` + daily cap + cost circuit breaker +
retention/deletion sweep + Clerk webhook, plus `apps/server/src/db/client.ts`
(`pg`, `DATABASE_URL`).

**Completed this session:** P0-21 retention/deletion + Clerk webhook (`packages/core`
untouched). New: `services/retention.ts` (hourly sweep: TTL hard-delete of expired
transcripts/results; auto-ends stale-open sessions >60min -> `abandoned`/`scored` via
`buildTemplateFeedback` directly, no model call; conditional `WHERE state='open'` on
both transitions closes a `/end` race), `services/deletion.ts` (wraps pre-existing
SECURITY DEFINER `delete_user_data(uuid)`), `routes/me.ts` (`DELETE /v1/me/data` ->
204), `routes/webhooks.ts` (`POST /v1/webhooks/clerk`: `user.created` upserts,
`user.deleted` hard-deletes, idempotent), `webhooks/verifyClerkWebhook.ts`
(hand-rolled svix HMAC-SHA256, `node:crypto`, no new dep; unsigned bodies only when
`CLERK_WEBHOOK_SECRET=''` — real Clerk unavailable under current gates, so signature
path is tested against self-signed fixtures only, not live-verified), `jobs/
scheduler.ts` (hourly, started from `index.ts` only). Tests: `routes/
retention.test.ts`, 7 tests, real HTTP via `app.inject` against `charisma_test`.
`pnpm --filter @charisma/server test` -> 18/18. `pnpm -r test` green: core 63/63,
server 18/18. `pnpm -r typecheck` clean.

Flagged, unfixed (2, carried from P0-20): (a) `routes/sessions.ts` `/end` passes
`computeSignals` a `warmthTrace` missing the leading opener `0` ([1,2,3,3,3] vs
contract [0,1,2,3,3,3]) — shifts `warmTwoIndex`/reciprocity, invisible on Sam scripts,
latent for other content; (b) 409 CAPPED spec wants a next-open-time, current
impl/test omit it (server gap, not test scope). Both need their own future cycle.

**Next action (ONE task only):** P0-22 analytics, content-free by construction (deps
P0-15, satisfied). Build `services/analytics.ts`: insert function accepts only
allowlisted event names (Section 4.3 CHECK list) + per-name Zod-closed props schema,
enums/numbers only, no free-text; wire across routes; unit tests must prove a string
prop fails compilation (type-level) AND throws at runtime; `d1_return` derived
server-side on first event of a new local day. Do NOT touch `packages/core`
score/validator logic. Refs: BUILD-EXECUTION-PLAN.md (search "P0-22"). Accept:
`pnpm --filter @charisma/server test`.

Migration applied to `charisma_test` ONLY, not yet to dev db `charisma`.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME, founder relocating to Korea. Payments:
  Merchant-of-Record (Paddle, web only, no Stripe/IAP v1; entitlement layer IAP-ready).
- Product: ONE mode, EVERYDAY/charisma, TEXT CHAT only v1 (voice deferred). Daily chat
  challenge vs AI character -> feedback + charisma SCORE (deterministic) + streak. 3-5 min.
- Monetization: text chat FULLY FREE (abuse-limited); paywall = premium AVATAR tier
  (lip-synced, PTT, 15-min trial -> $14.99/mo or $119/yr, 120-min cap). Avatar = Phase 6.
- Model: Claude Haiku behind swappable ChatModel; 2 calls/session (character + scoring);
  scoring PASS is deterministic, not LLM-judged.
- Build order: thin vertical slice (Sam housewarming) end-to-end first, then diagnostic +
  skill tree + paywall, then model swap at scale.

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, NO Docker. Superuser `main`, local trust auth, no
  password. DBs `charisma` (dev) + `charisma_test` (test) exist.
- Don't `kill $(lsof -ti:3000)` / assume port 3000 free — verify server boot via vitest
  `app.inject()`.
- Open gates: G-01 Anthropic key, G-02 Clerk, G-03 Paddle, G-04 deploy.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md (offset/limit only) |
FABLE-PROMPT-CHARISMA-CHAT.md (supersedes BUILD-BRIEF-FOR-FABLE.md/prd.md) |
POSITIONING.md | PRICING-AND-ECONOMICS.md | AVATAR-TIER-PRICING.md |
BUSINESS-MODEL-CONVERSION.md | COMPETITOR-REVIEW-MINING.md | HANDOFF.md (loop doctrine).
