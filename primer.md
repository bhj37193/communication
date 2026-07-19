# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN) has real screens: `chat.tsx`, `result.tsx`, `profile.tsx`, `index.tsx` — P0-27
(scaffold) and P0-28 (share card) both CLOSED, green. `apps/web` not started (P2, not
blocking). No code changed this session (Q&A only: confirmed auth is not a bottleneck for
personal single-user use — see below).

Flagged, unfixed (carried, need own cycle): (a) `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` — shifts `warmTwoIndex`/reciprocity; (b) 409
CAPPED spec wants a next-open-time, current impl/test omit it.

**Confirmed this session (informational, no files changed):** For personal/solo use, auth
is already a non-issue — `FakeAuthVerifier` (`apps/server/src/auth/AuthVerifier.ts`) trusts
any `Authorization: Bearer <id>` as a permanent user id; `composition.ts` only fail-closes
if `AUTH_PROVIDER != fake` in production. No Clerk/G-02 needed. The one real bottleneck to
personal use is G-01 (`ANTHROPIC_API_KEY` + `MODEL_PROVIDER=anthropic` in `apps/server/.env`)
— without it `FakeChatModel` just replays the scripted `SAM_GOOD_RUN` fixture, not a real
character. Once that key is set: `pnpm --filter @charisma/server smoke:anthropic` to verify,
then `pnpm --filter @charisma/server dev` + `expo start` in `apps/mobile` pointed at
`EXPO_PUBLIC_API_URL=http://localhost:3000`.

**Next action (ONE task only, unchanged from before this session):** P0-29 Deploy artifacts,
AUTONOMOUS-author portion only (deps: P0-25 satisfied; execute portion is GATED
G-04/G-05/G-09, do NOT attempt that half). Repo currently has NONE of: `docker-compose.yml`,
`Caddyfile`, root `README.md`, `apps/server/Dockerfile` (P0-12 gap, not this task's fault).
`apps/web` doesn't exist — Caddyfile/compose should NOT reference a `web` service yet (api +
caddy + postgres + uptime-kuma only; web routing as commented placeholder). Write: `Caddyfile`,
`docker-compose.yml` (prod profile only, no dev profile needed — native Postgres is used
locally), minimal `apps/server/Dockerfile` (node:22-slim, pnpm workspace install, run via
existing `tsx src/index.ts`, no build script to add), `.github/workflows/deploy.yml` (no-ops
with clear message when SSH_HOST/SSH_USER/SSH_KEY secrets absent), `README.md` ops section
(restic + Hetzner Storage Box + RESTIC_PASSWORD, Uptime Kuma, secret names matching
BUILD-EXECUTION-PLAN.md gates table ~line 1380). Accept: `docker compose --profile prod
config` validates, `pnpm ci:local` still green. Also noted, OUT OF SCOPE for P0-29: `ci.yml`
runs `pnpm --filter @charisma/content validate` but `packages/content` isn't a real pnpm
package (it's a data dir inside `packages/core`) — pre-existing, needs its own cycle.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME, founder relocating to Korea. Payments:
  Merchant-of-Record (Paddle, web only, no Stripe/IAP v1; entitlement layer IAP-ready).
- Product: ONE mode, EVERYDAY/charisma, TEXT CHAT only v1 (voice deferred). Daily chat
  challenge vs AI character -> feedback + charisma SCORE (deterministic) + streak. 3-5 min.
- Monetization: text chat FULLY FREE (abuse-limited); paywall = premium AVATAR tier.
- Model: Claude Haiku behind swappable ChatModel; 2 calls/session (character + scoring).
- Auth header: `Authorization: Bearer <id>`, NOT `x-test-user` (BUILD-EXECUTION-PLAN.md
  Section 3.3 is stale on this point; trust `apps/server/src/auth/AuthVerifier.ts`).

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, NO Docker locally. DBs `charisma` (dev) + `charisma_test`
  (test) exist; migration applied to `charisma_test` ONLY.
- Don't `kill $(lsof -ti:3000)` — verify server boot via vitest `app.inject()`.
- Open gates: G-01 Anthropic key, G-02 Clerk, G-03 Paddle, G-04/G-05/G-09 deploy.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md (offset/limit only; P0-29 spec ~line 1254,
gates table ~1370-1395, file tree ~95-120) | FABLE-PROMPT-CHARISMA-CHAT.md | POSITIONING.md |
PRICING-AND-ECONOMICS.md | AVATAR-TIER-PRICING.md | BUSINESS-MODEL-CONVERSION.md |
HANDOFF.md (loop doctrine).
