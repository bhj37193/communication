# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS

Session/chat-turn/submit-scoring endpoints wired to `packages/core` (validator + score)
+ `AnthropicChatModel` (real) / `FakeChatModel` (test) + `FakeAuthVerifier` + daily cap +
cost circuit breaker + retention/deletion sweep + Clerk webhook + analytics + CI. `apps/mobile`
(Expo/RN): P0-27 (scaffold) and P0-28 (share card) both CLOSED, green. `apps/web` not
started (P2, not blocking). No code changed this session — scoping only, see below.

Flagged, unfixed (carried, need own cycle): (a) `/end` passes `computeSignals` a
`warmthTrace` missing the leading opener `0` — shifts `warmTwoIndex`/reciprocity; (b) 409
CAPPED spec wants a next-open-time, current impl/test omit it.

**P0-29 scoping done (no files written yet).** Confirmed repo has NONE of: `docker-compose.yml`,
`Caddyfile`, root `README.md`, or any `Dockerfile` (apps/server never got one, despite
BUILD-EXECUTION-PLAN P0-12 listing it — gap in earlier work, not this task's fault). Dev/CI
use native Postgres directly (no dev docker profile exists or is needed). `apps/web` doesn't
exist, so Caddyfile/compose should NOT reference a `web` service yet — api + caddy + postgres
+ uptime-kuma only, web routing left as a commented placeholder. Also noticed (pre-existing,
OUT OF SCOPE): `ci.yml`/root `package.json` both run `pnpm --filter @charisma/content validate`
but `packages/content` isn't a real pnpm package — `content/` and `fakes/` are plain data dirs
INSIDE `packages/core`, not workspace members. Did not touch this; flagging for its own cycle.

**Next action (ONE task only):** P0-29 Deploy artifacts, AUTONOMOUS-author portion only
(deps: P0-25, satisfied; execute portion is GATED G-04/G-05/G-09, do NOT attempt that half).
Write: `Caddyfile` (api.DOMAIN -> api:3000 only; web routing commented placeholder),
`docker-compose.yml` (prod profile only — services: caddy, api build from apps/server, postgres,
uptime-kuma; no dev profile), a minimal `apps/server/Dockerfile` (node:22-slim, pnpm workspace
install, run via existing `tsx src/index.ts` — no build script exists, don't add one) so the
compose file's `api` service has something real to build, `.github/workflows/deploy.yml`
(push-to-main: ssh VPS, compose pull/up; no-ops with a clear message when SSH_HOST/SSH_USER/
SSH_KEY secrets are absent), `README.md` ops section (restic setup w/ Hetzner Storage Box +
RESTIC_PASSWORD, Uptime Kuma, secret placement matching G-04/G-05/G-09 names in
BUILD-EXECUTION-PLAN.md's gates table ~line 1380). Accept: `docker compose --profile prod
config` validates, and `pnpm ci:local` still green (unaffected by these changes but re-run to
confirm no regression).

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
see above; P0-29 spec at line ~1254, gates table ~1370-1395, file tree ~95-120) |
FABLE-PROMPT-CHARISMA-CHAT.md | POSITIONING.md | PRICING-AND-ECONOMICS.md |
AVATAR-TIER-PRICING.md | BUSINESS-MODEL-CONVERSION.md | COMPETITOR-REVIEW-MINING.md |
HANDOFF.md (loop doctrine).
