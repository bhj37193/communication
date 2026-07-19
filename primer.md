# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `FakeChatModel` + `FakeAuthVerifier` + daily cap + cost circuit breaker +
retention/deletion sweep + Clerk webhook + analytics, plus `apps/server/src/db/client.ts`.
Integration suite proves the full loop end to end; E2E smoke proves it over real HTTP
against a real spawned server process; CI now runs the whole offline-green list on every PR.

**Completed this session:** P0-25 CI pipeline (`packages/core` untouched). New:
`.github/workflows/ci.yml` — postgres:18 service container (trust auth, matching local
parity), migrates a fresh db, then runs the exact Section 3.6 list. Root script
`ci:local` mirrors the same 7 commands for local runs, skipping migrate (local
`charisma_test` already migrated; `0000_init.sql` isn't idempotent). `@charisma/content`/
`@charisma/mobile` don't exist yet — `pnpm --filter` on an unscaffolded package no-ops at
exit 0 (confirmed), so the list is clean today and activates once those land. `pnpm
ci:local` -> exit 0, all 7 green; `ci.yml` YAML-parse validated. Also hardened
`smoke.ts`: try/finally so the spawned server is killed even on an unexpected throw,
not just an asserted mismatch.

Flagged, unfixed (2, carried from P0-20): (a) `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` — shifts `warmTwoIndex`/reciprocity; (b)
409 CAPPED spec wants a next-open-time, current impl/test omit it. Both need own cycle.

**Next action (ONE task only):** P0-26 AnthropicChatModel (deps P0-08/P0-12, satisfied;
AUTONOMOUS build+unit, GATED G-01 for live smoke). Files: `model/AnthropicChatModel.ts`,
`scripts/smoke-anthropic.ts`, unit tests w/ injected fake Anthropic client asserting model
id, cache_control on system block, temps by tag, maxTokens, JSON retry, usage mapping.
Goal: real ChatModel fully built offline; `smoke:anthropic` is the deferred live check
once G-01 lands. Accept: `pnpm --filter @charisma/server test` (live: `smoke:anthropic`
after G-01).

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
