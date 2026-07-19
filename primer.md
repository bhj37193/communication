# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN): P0-27 (scaffold) and P0-28 (share card) both CLOSED, green. `apps/web` not
started (P2, not blocking).

**P0-28 CLOSED (Share card).** `components/ScoreCard.tsx` (forwardRef<View>, SCORE +
PASSED/KEEP PRACTICING + exact POSITIONING.md paradox tagline — no win/fix/moment/quote
text, ever), `lib/share.ts` (`captureRef` -> `Sharing.shareAsync` -> fire-and-forget
`trackShareTapped()`), Share button on `app/result.tsx`. New server route `POST
/v1/events/share-tapped` (`apps/server/src/routes/me.ts`, didn't exist before — needed so
`share_tapped`, already in the analytics allowlist, could fire); `lib/api.ts` got
`trackShareTapped()`. Deliberate cut: NO streak number, no data source exists (documented
gap, not a bug). Deps added: `react-native-view-shot`, `expo-sharing`. Verified: mobile
tests 24/24 (was 20/20), server 33/33 incl. new `events.test.ts`, `pnpm -r typecheck`
clean, full `pnpm ci:local` exit 0 (core 63/63, e2e smoke 100).

Flagged, unfixed (carried, need own cycle): (a) `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` — shifts `warmTwoIndex`/reciprocity; (b) 409
CAPPED spec wants a next-open-time, current impl/test omit it.

**Next action (ONE task only):** P0-29 Deploy artifacts, AUTONOMOUS-author portion only
(deps: P0-25, satisfied; execute portion is GATED G-04/G-05/G-09, do NOT attempt that half):
`Caddyfile`, prod profile in `docker-compose.yml`, `.github/workflows/deploy.yml`,
`README.md` ops section (restic setup, Uptime Kuma, secret placement). Goal: complete
deploy path that needs only real secrets to run; `deploy.yml` no-ops with a clear message
when secrets are absent. Accept: `docker compose --profile prod config` validates, and
`pnpm ci:local` still green.

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
- Native Postgres 18, localhost:5432, NO Docker locally. DBs `charisma` (dev) + `charisma_test`
  (test) exist; migration applied to `charisma_test` ONLY.
- Don't `kill $(lsof -ti:3000)` — verify server boot via vitest `app.inject()`.
- Open gates: G-01 Anthropic key, G-02 Clerk, G-03 Paddle, G-04/G-05/G-09 deploy.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md (offset/limit only; auth section 3.3 is stale,
see above; P0-29 spec at line ~1254) | FABLE-PROMPT-CHARISMA-CHAT.md | POSITIONING.md |
PRICING-AND-ECONOMICS.md | AVATAR-TIER-PRICING.md | BUSINESS-MODEL-CONVERSION.md |
COMPETITOR-REVIEW-MINING.md | HANDOFF.md (loop doctrine).
