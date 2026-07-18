# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints are wired to `packages/core` (validator +
score) + `FakeChatModel` + `FakeAuthVerifier` + daily cap + cost circuit breaker, plus
`apps/server/src/db/client.ts` (`pg`, `DATABASE_URL`). Committed and pushed to
`origin` = `github.com/bhj37193/communication` (private). `pnpm -r test` green: core
63/63, server 6/6 (caps.test.ts + app.test.ts).

**Next action (ONE task only):** ONE integration test driving `FakeChatModel`'s scripted
GOOD/BAD runs end-to-end (good passes with exact deterministic score, bad fails,
fabricated-quote feedback rejected). Connects to `charisma_test`, no real API key. Do NOT
touch `packages/core` logic/tests. Refs: BUILD-EXECUTION-PLAN.md mock boundary 256-490,
API contracts 493-610, Phase 0 tasks 1031-1278.

Migration applied to `charisma_test` ONLY, not yet to dev db `charisma`.

Global ralph-loop hooks (`~/.claude/hooks/context-watchdog.optimized.sh`,
`primer-resumer.sh`) were hardened this session (cwd/pid-tagged logs, EXIT trap, split
`tmux send-keys` to avoid an autocomplete race, pane-tracker fallback). Threshold stays
at 40% intentionally.

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
