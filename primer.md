# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `FakeChatModel` + `FakeAuthVerifier` + daily cap + cost circuit breaker +
retention/deletion sweep + Clerk webhook + analytics, plus `apps/server/src/db/client.ts`.
Integration suite proves the full loop end to end; E2E smoke proves it over real HTTP
against a real spawned server process; CI now runs the whole offline-green list on every PR.

**Completed this session:** P0-26 AnthropicChatModel (`packages/core` untouched). New:
`apps/server/src/model/AnthropicChatModel.ts` — real `ChatModel` impl. Path ambiguity
resolved via `model.ts`'s own header comment: concrete implementations live outside
`packages/core`, so this is `apps/server/src/`, not `packages/core/`. Injected
`AnthropicClient` (narrow `{ messages: { create } }` interface, not the full SDK type) so
unit tests run offline against a fake; `composition.ts` wires the real `new
Anthropic({ apiKey })` from `@anthropic-ai/sdk` (added to `apps/server/package.json`,
installed). Model id `claude-haiku-4-5`, system sent as one cache_control:ephemeral text
block, temperature 0.7 character / 0.2 feedback (PRD 3.4), one corrective JSON retry
before throwing, usage mapped incl. `cache_read_input_tokens` -> `cachedInputTokens`
(nullish-coalesced to 0). Post-advisor-review fix: retry now sums usage across BOTH API
calls (`sumUsage`), not just the second — the first (failed) call's tokens were silently
dropped, which would have undercounted the cost circuit breaker on every retry. Also
switched the retry's corrective turn from an `{assistant, user}` pair to a single `user`
message quoting the bad output, since a transcript ending on a `character` turn would
otherwise produce two consecutive `assistant` messages (untestable without G-01; sidestepped
instead of shipped-unverified). Added `ANTHROPIC_API_KEY` to `env.ts` (default `''`);
`composition.ts` fail-closed throws if `MODEL_PROVIDER=anthropic` and the key is empty.
`apps/server/scripts/smoke-anthropic.ts` + `smoke:anthropic` script: one real
character-turn call, asserts schema + nonzero usage, deferred until G-01. 8 unit tests
(model id, cache_control, temps by tag, maxTokens, retry-then-succeed w/ summed-usage
assertion, retry-exhausted-throws, usage mapping incl. null->0, retry role-alternation
w/ character-ending transcript) all green. `pnpm ci:local` -> exit 0, all green (fake
provider path untouched, still default, incl. e2e smoke). Manually verified (no live API
call): `MODEL_PROVIDER=anthropic` wiring in `composition.ts` constructs `AnthropicChatModel`
correctly end to end.

Flagged, unfixed (2, carried from P0-20): (a) `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` — shifts `warmTwoIndex`/reciprocity; (b)
409 CAPPED spec wants a next-open-time, current impl/test omit it. Both need own cycle.

**Next action (ONE task only):** P0-27 Expo app (deps P0-16..P0-19, satisfied;
AUTONOMOUS). Files: everything under `apps/mobile/src`, `app.json`, jest config, tests.
Goal: three surfaces (entry, chat with typing delay + remaining counter, result card)
plus profile (sign out, delete my data), typed api client, dev fake-auth mode
(`EXPO_PUBLIC_DEV_FAKE_AUTH=true` sends `x-test-user`), Clerk code paths present but inert
without a publishable key. Accept: `pnpm --filter @charisma/mobile typecheck && pnpm
--filter @charisma/mobile test`. Note: `apps/mobile` doesn't exist yet — this is a fresh
scaffold, not an edit; check `apps/server`'s typed api client shape (routes/schemas) for
the contract the mobile client must match before scaffolding.

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
