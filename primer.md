# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS (2026-07-18e, Phase 0 build)

**Completed this session:** Session/chat-turn/submit-scoring endpoints wired to
`packages/core` (validator + score) + `FakeChatModel` + `FakeAuthVerifier` + daily cap +
cost circuit breaker. Committed `a7b1a31` ("checkpoint: wire session/chat-turn/scoring
endpoints to core+fakes+caps", 14 files, +681/-5).
- New `apps/server/src/db/client.ts` (`pg` driver) wired to `DATABASE_URL`.
- `apps/server/src/services/caps.ts` (+ `caps.test.ts`, 5 tests): daily cap + cost circuit
  breaker.
- `apps/server/src/routes/sessions.ts` (301 lines): session/chat-turn/submit-scoring
  endpoints, `app.ts`/`composition.ts` wired through.
- **VERIFIED GREEN:** `pnpm -r test` exit 0 — `packages/core` 63/63 (score/schemas/validator
  unchanged), `apps/server` 6/6 (`caps.test.ts` 5 new + `app.test.ts` 1, up from 1/1).

**Next action (ONE task only, deferred from this cycle per HANDOFF.md):** ONE integration
test driving `FakeChatModel`'s scripted GOOD/BAD runs end-to-end (good passes with exact
deterministic score, bad fails, fabricated-quote feedback rejected). Connects to
`charisma_test`, no real API key. Do NOT touch `packages/core` logic/tests. Refs:
BUILD-EXECUTION-PLAN.md mock boundary 256-490, API contracts 493-610, Phase 0 tasks
1031-1278.

- Migration still applied to `charisma_test` ONLY, not yet to dev db `charisma`.

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
