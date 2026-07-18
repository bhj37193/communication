# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS (2026-07-18d, Phase 0 build)

**Completed this session:** Drizzle schema + `0000_init` migration, applied to `charisma_test`.
- `apps/server/src/db/schema.ts` (15 tables, 3 enums, drizzle-orm/pg-core).
- `apps/server/src/db/migrations/0000_init.sql`: `charisma_app` role has NO password
  (local trust auth, matches superuser `main`); role creation idempotent
  (`IF NOT EXISTS` on `pg_roles`, cluster-wide, safe to re-run against `charisma` later);
  `GRANT CONNECT` made dynamic via `EXECUTE format(..., current_database())`;
  least-privilege grants + append-only `REVOKE UPDATE, DELETE ON progress_events` kept.
- `apps/server/package.json`: added `drizzle-orm` dep, `db:migrate` script (plain `psql`,
  no drizzle-kit yet). `env.ts` + root `.env.example`: added `DATABASE_URL` /
  `DATABASE_URL_OWNER` (dev defaults, db `charisma`, port 5432, no Docker).
- **VERIFIED GREEN:** `pnpm install` exit 0; `pnpm -r typecheck` exit 0 (both packages);
  `db:migrate` against `charisma_test` exit 0, 15 tables/3 enums/role/fn created; manual
  psql checks: `charisma_app` can SELECT/INSERT `users`, UPDATE on `progress_events`
  correctly denied, role-creation block re-run is a no-op error-free; `pnpm -r test` exit
  0 (`packages/core` 63/63 unchanged, `apps/server` 1/1 unchanged).
- Migration applied to `charisma_test` ONLY, not yet to dev db `charisma`.

**Next action (ONE task only):** wire session / chat-turn / submit-scoring endpoints to
`packages/core` (validator + score) + FakeChatModel + FakeAuthVerifier + daily cap + cost
circuit breaker. Needs a new `apps/server/src/db/client.ts` (`pg` driver dep) wired to
`DATABASE_URL` — add as part of this task. Do NOT also build the integration test in the
same pass. Refs: BUILD-EXECUTION-PLAN.md mock boundary 256-490, API contracts 493-610,
character prompt 960-1030, Phase 0 tasks 1031-1278.

**After that:** ONE integration test driving FakeChatModel's scripted GOOD/BAD runs
end-to-end (good passes with exact deterministic score, bad fails, fabricated-quote
feedback rejected). Connects to `charisma_test`, no real API key.

## LOCKED DECISIONS
- **Entity:** Korean young-entrepreneur SME (청년창업중소기업 세액감면), founder relocating to
  Korea. F-1 gate moot. Payments: Merchant-of-Record (Paddle, web only, no Stripe/no IAP v1,
  entitlement layer must accept IAP later without rewrite).
- **Product:** ONE mode, EVERYDAY/charisma, TEXT CHAT only v1 (voice deferred, dormant seam
  ships Phase 1). Open app -> one short daily chat challenge vs AI character -> warmth
  responds to how interesting you are -> instant feedback (win/fix quoted) + charisma
  SCORE (deterministic) + streak. 3-5 min.
- **Monetization:** text chat FULLY FREE (abuse-limited only); paywall is a premium AVATAR
  tier (live lip-synced, PTT-interruptable, 15-min free trial -> $14.99/mo or $119/yr,
  120-min cap). Avatar tier is Phase 6. (Text-tier $9.99/mo idea superseded.)
- **Model:** Claude Haiku behind a swappable ChatModel interface; 2 model calls/session
  (character + one scoring call); scoring PASS is deterministic, not LLM-judged.
- **Positioning:** "Charisma is a skill. Train it." Category: conversation trainer
  ("Duolingo for talking to people"). Audience: both genders, English-first, global,
  company in Korea.
- **Build order:** thin vertical slice (Sam housewarming loop) end-to-end first, then
  diagnostic + skill tree + paywall, then model swap at scale.

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, NO Docker. Superuser `main`, local trust auth, no
  password. DBs `charisma` (dev) + `charisma_test` (test) exist.
- Do not shell out `kill $(lsof -ti:3000)` or assume port 3000 is free (an unrelated
  Next.js dev server may occupy it) — verify server boot via vitest `app.inject()`.
- Open gates (not yet needed): G-01 Anthropic key, G-02 Clerk, G-03 Paddle, G-04 deploy.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
BUILD-PLAN-MAP.md (phase map) | BUILD-EXECUTION-PLAN.md (spec, read offset/limit only) |
FABLE-PROMPT-CHARISMA-CHAT.md (current build spec, supersedes BUILD-BRIEF-FOR-FABLE.md /
prd.md) | POSITIONING.md | PRICING-AND-ECONOMICS.md | AVATAR-TIER-PRICING.md |
BUSINESS-MODEL-CONVERSION.md | COMPETITOR-REVIEW-MINING.md | HANDOFF.md (autonomous
build loop instructions, doctrine, one-task-per-cycle rule).
