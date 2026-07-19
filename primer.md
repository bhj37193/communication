# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics, plus
`apps/server/src/db/client.ts`. Integration suite proves the full loop end to end; E2E
smoke proves it over real HTTP against a real spawned server process; CI runs the whole
offline-green list on every PR.

**Completed this session:** P0-26 AnthropicChatModel. `apps/server/src/model/AnthropicChatModel.ts`,
real `ChatModel` impl (concrete impls live outside `packages/core`, per `model.ts`'s
header comment). Injected `AnthropicClient` interface so tests run offline;
`composition.ts` wires the real SDK client when `MODEL_PROVIDER=anthropic`, fail-closed
if `ANTHROPIC_API_KEY` is empty. Model `claude-haiku-4-5`, cache_control:ephemeral system
block, temp 0.7 character / 0.2 feedback, one corrective JSON retry (single `user`
message quoting the bad output, to avoid consecutive-assistant-role risk), usage summed
across both calls on retry (fixed an undercount bug caught in review — was only
returning the second call's tokens, would have undercounted the cost circuit breaker).
`smoke:anthropic` script deferred until G-01. 8 unit tests green. `pnpm ci:local` exit 0
(typecheck, 94 tests across packages, e2e smoke, all green).

Flagged, unfixed (carried, need own cycle): (a) `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` — shifts `warmTwoIndex`/reciprocity; (b) 409
CAPPED spec wants a next-open-time, current impl/test omit it.

**Next action (ONE task only):** P0-27 Expo app (deps P0-16..P0-19, satisfied;
AUTONOMOUS). Files: everything under `apps/mobile/src`, `app.json`, jest config, tests.
Goal: three surfaces (entry, chat with typing delay + remaining counter, result card)
plus profile (sign out, delete my data), typed api client, dev fake-auth mode
(`EXPO_PUBLIC_DEV_FAKE_AUTH=true` sends `x-test-user`), Clerk code paths present but inert
without a publishable key. Accept: `pnpm --filter @charisma/mobile typecheck && pnpm
--filter @charisma/mobile test`. Note: `apps/mobile` doesn't exist yet — fresh scaffold,
not an edit; check `apps/server`'s typed api client shape (routes/schemas) for the
contract the mobile client must match before scaffolding.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME, founder relocating to Korea. Payments:
  Merchant-of-Record (Paddle, web only, no Stripe/IAP v1; entitlement layer IAP-ready).
- Product: ONE mode, EVERYDAY/charisma, TEXT CHAT only v1 (voice deferred). Daily chat
  challenge vs AI character -> feedback + charisma SCORE (deterministic) + streak. 3-5 min.
- Monetization: text chat FULLY FREE (abuse-limited); paywall = premium AVATAR tier
  (lip-synced, PTT, 15-min trial -> $14.99/mo or $119/yr, 120-min cap). Avatar = Phase 6.
- Model: Claude Haiku behind swappable ChatModel; 2 calls/session (character + scoring);
  scoring PASS is deterministic, not LLM-judged.
- Build order: thin vertical slice (Sam housewarming) end-to-end, then diagnostic + skill
  tree + paywall, then model swap at scale.

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, NO Docker. Superuser `main`, local trust auth, no
  password. DBs `charisma` (dev) + `charisma_test` (test) exist; migration applied to
  `charisma_test` ONLY, not yet to dev db `charisma`.
- Don't `kill $(lsof -ti:3000)` / assume port 3000 free — verify server boot via vitest
  `app.inject()`.
- Open gates: G-01 Anthropic key, G-02 Clerk, G-03 Paddle, G-04 deploy.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md (offset/limit only) | FABLE-PROMPT-CHARISMA-CHAT.md
(supersedes BUILD-BRIEF-FOR-FABLE.md/prd.md) | POSITIONING.md | PRICING-AND-ECONOMICS.md |
AVATAR-TIER-PRICING.md | BUSINESS-MODEL-CONVERSION.md | COMPETITOR-REVIEW-MINING.md | HANDOFF.md
(loop doctrine).
