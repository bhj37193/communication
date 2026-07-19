# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `FakeChatModel` + `FakeAuthVerifier` + daily cap + cost circuit breaker, plus
`apps/server/src/db/client.ts` (`pg`, `DATABASE_URL`).

**Completed this session:** P0-20 caps/circuit-breaker integration test at
`apps/server/src/routes/sessions.caps.test.ts` (real HTTP via `app.inject` against
`charisma_test`, no real API key, `packages/core` untouched): 409 CAPPED on a second
same-day session; 503 BUDGET_EXCEEDED once a synthetically-inserted `model_usage` row
(FakeChatModel always reports zero usage, so real spend was simulated via a direct
Drizzle insert) crosses a low custom `DAILY_MODEL_BUDGET_USD`; an already-open session
(message + end) still completes to `scored` when driven through the SAME tripped
low-budget app, proving the breaker only guards session creation. `pnpm --filter
@charisma/server test` -> 11/11. `pnpm -r test` green: core 63/63, server 11/11.
`pnpm -r typecheck` clean.

Flagged, unfixed (2): (a) `routes/sessions.ts` `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` ([1,2,3,3,3] vs contract [0,1,2,3,3,3])
— shifts `warmTwoIndex`/reciprocity, invisible on Sam scripts, latent for other
content; (b) 409 CAPPED spec wants a next-open-time, current impl/test omit it
(server gap, not test scope). Both need their own future cycle.

**Next action (ONE task only):** P0-21 retention/deletion + Clerk webhook (deps
P0-18, satisfied). Build account-deletion path (Clerk `user.deleted` webhook ->
purge/anonymize user data per retention policy) + its integration test. Do NOT
touch existing `packages/core` score/validator logic. Refs: BUILD-EXECUTION-PLAN.md
(search "P0-21").

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
