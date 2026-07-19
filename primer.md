# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN, P0-27) now scaffolded and green. `apps/web` not started (P2, not blocking).

**P0-27 CLOSED (Expo app).** `apps/mobile`: `app/_layout.tsx`, `app/{index,chat,result,
profile}.tsx` (Expo Router), `lib/api.ts` (typed client, all 5 session endpoints + DELETE
/v1/me/data), `lib/auth.ts`, `components/MessageBubble.tsx`, jest-expo tests (20 tests).
Skipped on purpose (P0-28 scope): `lib/share.ts`, `components/ScoreCard.tsx`, `eas.json`.
Auth header fix (see LOCKED DECISIONS) verified against actual server code, not the stale
plan doc. Independent code-reviewer pass then found + fixed 4 real golden-path bugs:
`profile.tsx` sign-out had no try/catch (could strand screen in `busy`); `chat.tsx`
"I'm done" wasn't gated on `sending`/`typing` (double-`endSession` race), fixed with
`ending||sending||typing` + an `activeRef` mounted-guard (mirrors `result.tsx`'s `active`
flag) around post-await setState in `onSend`/`goToResult`; `chat.tsx` optimistic user
message wasn't rolled back on send failure, now popped + input text restored in the catch;
`result.tsx` polling was unbounded, now `MAX_POLLS` (~3min) + `MAX_CONSECUTIVE_ERRORS` (3
retries on transient errors before surfacing). Verified: `pnpm --filter @charisma/mobile
typecheck && test` (20/20), `pnpm -r typecheck` clean, `pnpm ci:local` exit 0 (e2e smoke
score 100). Cosmetic/unfixed: jest `act()` warning in `chat.tsx`'s typing-delay update.

Flagged, unfixed (carried, need own cycle): (a) `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` — shifts `warmTwoIndex`/reciprocity; (b) 409
CAPPED spec wants a next-open-time, current impl/test omit it.

**Next action (ONE task only):** P0-28 Share card (deps: P0-27, satisfied; AUTONOMOUS):
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
