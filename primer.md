# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `FakeChatModel` + `FakeAuthVerifier` + daily cap + cost circuit breaker, plus
`apps/server/src/db/client.ts` (`pg`, `DATABASE_URL`).

**Completed this session:** P0-23-scoped loop-proof integration test at
`apps/server/src/routes/sessions.test.ts` (real HTTP round trips via `app.inject`
against `charisma_test`, no real API key, `packages/core` untouched): good run =
exact score 100 + exact known-answer signals; bad run = exact score 20 +
`monologue_brag`; fabricated-quote run = template fallback. Colocated, not at
`test/integration/loop.test.ts` — don't duplicate. Narrower than P0-23's full scope
(no 8-msg run, no progress_events/streak, no caps/retention/webhook suites — those
don't exist yet). `pnpm -r test` green: core 63/63, server 9/9. `pnpm -r typecheck` clean.

Flagged, unfixed: `routes/sessions.ts` `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` (stored `[1,2,3,3,3]` vs contract
`[0,1,2,3,3,3]` per `validator.test.ts`) — shifts `warmTwoIndex`, feeds reciprocity.
Invisible on Sam good/bad scripts; latent bug for other content. Needs its own
fix + regression test.

**Next action (ONE task only):** P0-20 caps/circuit-breaker integration test (deps
P0-16, satisfied): lower `DAILY_MODEL_BUDGET_USD` to cross it deterministically
(FakeChatModel usage is fixed), assert `POST /v1/sessions` returns 409 CAPPED past
the daily cap and 503 BUDGET_EXCEEDED once the breaker trips, while an already-open
session finishes. `checkBreaker`/`checkDailyCap` already wired in `services/caps.ts`
+ `routes/sessions.ts` — test-only, no new service code expected. Do NOT touch
`packages/core`. Refs: BUILD-EXECUTION-PLAN.md 1182-1190.

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
- Positioning: "Charisma is a skill. Train it." Conversation trainer, both genders,
  English-first, global, company in Korea.
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
