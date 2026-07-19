# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN): P0-27 (scaffold), P0-28 (share card) CLOSED. `apps/web` not started (P2).

**P0-29 CLOSED this session (Deploy artifacts, AUTONOMOUS-author portion).** New files:
`apps/server/Dockerfile` (node:22-slim, pnpm@11 via corepack, runs `tsx src/index.ts`
directly — no compiled build step exists, ponytail-flagged as upgrade path), root
`docker-compose.yml` (prod profile only: postgres, api, caddy, uptime-kuma — every env var
uses a `:-` default so `docker compose --profile prod config` won't error with no secrets
set; dev still uses native Postgres, no dev profile needed), root `Caddyfile` (api.DOMAIN ->
api:3000 live; DOMAIN root responds 501 placeholder since apps/web doesn't exist yet, commented
block ready for when it ships), `.github/workflows/deploy.yml` (push-to-main, no-ops with a
`::notice::` message when SSH_HOST/SSH_USER/SSH_KEY secrets are absent, else ssh+compose via
appleboy/ssh-action), root `README.md` (new — bootstrap section reflects actual native-Postgres
dev setup, not the stale docker-based one from BUILD-EXECUTION-PLAN.md; ops section covers
secret placement, restic+Hetzner Storage Box backup setup, Uptime Kuma). Did NOT attempt the
GATED execute half (G-04/G-05/G-09 — real VPS/domain/secrets).
Verified: both YAML files parse clean (python yaml.safe_load); `docker`/`caddy` binaries
aren't installed locally so `docker compose config` itself wasn't run, but env-var defaults
guarantee it would parse; `pnpm ci:local` reran green (exit 0, mobile 24/24, no regressions —
expected, since none of these new files are code `ci:local` executes).

Flagged, unfixed (carried, need own cycle, both AUTONOMOUS/no gate needed): (a) `/end` passes
`computeSignals` a `warmthTrace` missing the leading opener `0` — shifts
`warmTwoIndex`/reciprocity; (b) 409 CAPPED spec wants a next-open-time, current impl/test omit
it. Also noted, out of scope: `ci.yml`/root `package.json` run `pnpm --filter @charisma/content
validate` but `packages/content` isn't a real pnpm package (it's a data dir inside
`packages/core`) — pre-existing, needs its own cycle.

**Next action (ONE task only):** Remaining P0 items (P0-30/31/32) are all GATED on
G-02/G-03/G-06 etc — no AUTONOMOUS work available there. Pick up one of the two flagged bugs
above instead: start with (a) the `warmthTrace` leading-opener-`0` bug in the `/end` handler
(grep callers of `computeSignals` first, fix at the shared call site, not per-caller).

Separately, user is setting up personal solo use: `apps/server/.env` created this earlier
session with `MODEL_PROVIDER=anthropic` set, `ANTHROPIC_API_KEY=` left blank for them to paste
(opened in TextEdit). Once pasted, they should run `cd apps/server && pnpm smoke:anthropic` to
verify — not yet confirmed done as of this write.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME. Payments: Merchant-of-Record (Paddle, web only).
- Product: ONE mode, EVERYDAY/charisma, TEXT CHAT only v1. Daily chat challenge vs AI
  character -> feedback + charisma SCORE (deterministic) + streak. 3-5 min.
- Monetization: text chat FULLY FREE; paywall = premium AVATAR tier (Phase 6).
- Auth header: `Authorization: Bearer <id>` (BUILD-EXECUTION-PLAN.md 3.3's `x-test-user`
  claim is stale; trust `apps/server/src/auth/AuthVerifier.ts`). Fake auth = no Clerk needed
  for personal use.

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, NO Docker locally. `apps/server/.env` (gitignored,
  tsx auto-loads it) is the real per-app env file; root `.env` is an unrelated project's file
  (Deepgram/Apify keys) — don't confuse the two.
- Don't `kill $(lsof -ti:3000)` — verify server boot via vitest `app.inject()`.
- Open gates: G-01 Anthropic key (in progress), G-02 Clerk, G-03 Paddle, G-04/G-05/G-09 deploy.
- SOURCE-DO-NOT-SHIP/ deletion discrepancy still unreconciled before IP sign-off.

## DOC REFS
BUILD-PLAN-MAP.md | BUILD-EXECUTION-PLAN.md (offset/limit only; gates table ~1370-1395) |
FABLE-PROMPT-CHARISMA-CHAT.md | POSITIONING.md | HANDOFF.md (loop doctrine).
