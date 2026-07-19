# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `FakeChatModel` + `FakeAuthVerifier` + daily cap + cost circuit breaker +
retention/deletion sweep + Clerk webhook + analytics, plus `apps/server/src/db/client.ts`.

**Completed this session:** P0-22 analytics, content-free by construction (`packages/core`
untouched). `services/analytics.ts`: `trackEvent`, allowlisted names, per-name Zod
`.strict()` props (enums/numbers only); `d1_return` derived from `localDate(tz)` of the
user's last event vs `now`; both inserts stamp `createdAt: now` explicitly (not DB
`defaultNow()`) so the day-boundary is provable under synthetic timestamps. Wired into
`routes/sessions.ts`: `upsertUser`->`signup`, `POST /sessions`->`session_started`,
`/end`->`session_completed`, `/result`->`result_viewed`. Unwired (no route yet):
`challenge_viewed`, `share_tapped`, `streak_broken`, `paywall_viewed`, `subscribe_*`.
Tests: `analytics.test.ts`, 5 (dual `@ts-expect-error`+`.rejects.toThrow()` on bad enum;
same-day negative case added after review caught original new-day test passed for wrong
reason). `test` -> 23/23. `pnpm -r test`: core 63/63, server 23/23, typecheck clean.

Flagged, unfixed (2, carried from P0-20): (a) `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` — shifts `warmTwoIndex`/reciprocity; (b)
409 CAPPED spec wants a next-open-time, current impl/test omit it. Both need own cycle.

**Next action (ONE task only):** P0-23 integration suite, the loop proof (deps
P0-18..P0-22, satisfied, AUTONOMOUS). Files: `test/integration/loop.test.ts`,
`test/integration/setup.ts`. Full HTTP round trips vs app factory + `charisma_test` +
Fakes -> good run (8 msgs, end, poll: score 100, passed, WIN quote matches U3), bad run
(score 10, failed), fabricated-quote run (template fallback), plus caps/retention/webhook
green together. Partial scoped version exists at `routes/sessions.test.ts`
(`describe('the loop proof (P0-23, scoped)')`, good-run only) — extend, don't duplicate.
Refs: BUILD-EXECUTION-PLAN.md ("P0-23"). Accept: `test:integration` (script TBD, add it).

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
BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md (offset/limit only) | FABLE-PROMPT-CHARISMA-CHAT.md
(supersedes BUILD-BRIEF-FOR-FABLE.md/prd.md) | POSITIONING.md | PRICING-AND-ECONOMICS.md |
AVATAR-TIER-PRICING.md | BUSINESS-MODEL-CONVERSION.md | COMPETITOR-REVIEW-MINING.md | HANDOFF.md
(loop doctrine).
