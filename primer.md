# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN, P0-27) now scaffolded and green. `apps/web` not started (P2, not blocking).

**Completed this session:** P0-27 Expo app. New `apps/mobile` package: `app/_layout.tsx`,
`app/{index,chat,result,profile}.tsx` (Expo Router), `lib/api.ts` (typed client for all 5
session endpoints + DELETE /v1/me/data), `lib/auth.ts`, `components/MessageBubble.tsx`,
jest-expo tests (`test/api.test.ts`, `test/screens.test.tsx`, 20 tests). Deliberately skipped
(P0-28 scope, not this task): `lib/share.ts`, `components/ScoreCard.tsx`, `eas.json`.
**Important fix, verified against actual server code, not the stale plan doc:**
`BUILD-EXECUTION-PLAN.md` says dev-fake-auth sends header `x-test-user` — that's wrong/stale.
The real `apps/server/src/auth/AuthVerifier.ts` `FakeAuthVerifier` reads
`Authorization: Bearer <externalId>` (confirmed via every integration test + e2e smoke).
`lib/auth.ts` sends that; persists a stable per-install UUID via AsyncStorage, gated on
`EXPO_PUBLIC_DEV_FAKE_AUTH`, falls back to dev-fake identity whenever
`EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` is unset (Clerk not implemented server-side yet either —
composition.ts throws on `AUTH_PROVIDER=clerk`). Clerk code path present but inert (dynamic
import, never exercised without a key), per spec. Verified: `pnpm --filter @charisma/mobile
typecheck` clean, `pnpm --filter @charisma/mobile test` 20/20, `pnpm -r typecheck` clean,
`pnpm ci:local` exit 0 (core 3 files, server unit 7 files, server integration 7 files, e2e
smoke PASSED score 100, mobile 2 suites/20 tests, all green).

**OUTSTANDING FROM THIS SESSION (do first, before P0-28):** Dispatched an independent
code-reviewer agent (opus) to audit `apps/mobile/lib/auth.ts`, `lib/api.ts`, `app/chat.tsx`,
`app/profile.tsx`, `app/index.tsx`, `app/result.tsx`, `app/_layout.tsx` for correctness bugs,
auth-header consistency, chat typing-delay race conditions, and delete-my-data/sign-out
flow correctness. **It did not finish before this context cycle ended — no findings were
collected.** Re-run this review before starting P0-28; do not assume the mobile auth/api
code is clean. Also unaddressed: a jest `act()` console warning in `app/chat.tsx`'s
typing-delay state update (test/screens.test.tsx passes regardless, cosmetic but unreviewed).

Flagged, unfixed (carried, need own cycle): (a) `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` — shifts `warmTwoIndex`/reciprocity; (b) 409
CAPPED spec wants a next-open-time, current impl/test omit it.

**Next action (ONE task only):** Re-run the code-reviewer pass on `apps/mobile` (see above)
and fix anything it finds. THEN P0-28 Share card (deps: P0-27, satisfied; AUTONOMOUS):
`apps/mobile/lib/share.ts` (react-native-view-shot capture -> share sheet),
`components/ScoreCard.tsx` (shareable WIN/FIX/MOMENT/SCORE render), wire a share button on
`app/result.tsx`. Accept: `pnpm --filter @charisma/mobile typecheck && pnpm --filter
@charisma/mobile test`.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME, founder relocating to Korea. Payments:
  Merchant-of-Record (Paddle, web only, no Stripe/IAP v1; entitlement layer IAP-ready).
- Product: ONE mode, EVERYDAY/charisma, TEXT CHAT only v1 (voice deferred). Daily chat
  challenge vs AI character -> feedback + charisma SCORE (deterministic) + streak. 3-5 min.
- Monetization: text chat FULLY FREE (abuse-limited); paywall = premium AVATAR tier
  (lip-synced, PTT, 15-min trial -> $14.99/mo or $119/yr, 120-min cap). Avatar = Phase 6.
- Model: Claude Haiku behind swappable ChatModel; 2 calls/session (character + scoring).
- Auth header (dev-fake mode, verified against actual code): `Authorization: Bearer <id>`,
  NOT `x-test-user` as BUILD-EXECUTION-PLAN.md's Section 3.3 claims — that doc is stale on
  this point; trust `apps/server/src/auth/AuthVerifier.ts` over the doc.

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, NO Docker. DBs `charisma` (dev) + `charisma_test`
  (test) exist; migration applied to `charisma_test` ONLY.
- Don't `kill $(lsof -ti:3000)` — verify server boot via vitest `app.inject()`.
- Open gates: G-01 Anthropic key, G-02 Clerk, G-03 Paddle, G-04 deploy.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md (offset/limit only; auth section 3.3 is stale,
see above) | FABLE-PROMPT-CHARISMA-CHAT.md | POSITIONING.md | PRICING-AND-ECONOMICS.md |
AVATAR-TIER-PRICING.md | BUSINESS-MODEL-CONVERSION.md | COMPETITOR-REVIEW-MINING.md |
HANDOFF.md (loop doctrine).
