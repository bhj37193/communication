# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS
Core loop green (core 71/71, server 35/35) on real Anthropic models (Haiku
character / Sonnet feedback). Mobile app works end-to-end live. Pivoting to
**public App Store release, mobile-only** (apps/web stays P2/deferred,
Paddle/G-03 not needed yet — no paywall exists, avatar tier is Phase 6).

## COMPLETED THIS SESSION
Scoped the mobile-only App Store path into 8 tracked tasks (#1-8). 4 are user
signups (Apple Developer $99/yr, Expo/EAS, VPS, Clerk — user confirmed none
exist yet, chose VPS over managed hosting). 4 are code/config prep, 2 of
which were dispatched as background executor agents in parallel:
- **Task #5 DONE, reviewed**: `deploy/` created (README.md,
  charisma-server.service, Caddyfile, .env.example) — no Docker, native
  Postgres 18, tsx runtime (no build step exists), systemd + Caddy auto-TLS.
  Correctly flagged a real blocker: `composition.ts` refuses to boot with
  `NODE_ENV=production` unless `AUTH_PROVIDER=clerk` works, which doesn't
  exist yet — ties directly to task #6.
- **Task #6 IN PROGRESS (background agent, id a1a25387581a1450f)**: wiring
  real Clerk auth end-to-end (server-side session verification + mobile
  sign-in screens), gated behind `AUTH_PROVIDER=clerk` vs `fake` so existing
  fake-auth tests stay green. Agent was mid-investigation of `@clerk/shared`
  type exports (SignInResource/SignUpResource) and had just called its own
  advisor when this session ended — NOT reviewed yet, do not trust
  unreviewed output.

## EXACT NEXT STEP
1. Check status of background agent `a1a25387581a1450f` (Clerk auth wiring)
   — resume via SendMessage if still addressable, else re-launch fresh (full
   brief: replace fake bearer-auth with real Clerk session verification
   server-side + sign-in/sign-up screens mobile-side, gated by
   AUTH_PROVIDER env var, must not break existing fake-auth tests).
2. Once it reports, REVIEW before trusting: read the actual diff, run
   `pnpm --filter @charisma/server test` + typecheck on server+mobile,
   confirm fake-auth path still passes untouched.
3. Then resume task #7 (eas.json + app icons — needs user-supplied artwork,
   don't fabricate branding) and #8 (App Store listing prep).
4. Tasks #1-4 (signups: Apple Developer, Expo/EAS, VPS, Clerk) are blocking
   and on the user — check in on progress before assuming they're done.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME.
- ONE mode, EVERYDAY/charisma, TEXT CHAT only v1. Daily challenge vs AI
  character -> feedback + deterministic score + streak. 3-5 min.
- Text chat fully free; paywall = premium AVATAR tier (Phase 6, not built).
- Prompt design LOCKED: static system per unit; per-turn context in
  messages, never in system (assemble.test.ts enforces).
- Model per touchpoint (live-verified): character = Haiku
  (`claude-haiku-4-5`), feedback = Sonnet (`claude-sonnet-5`), routed by
  call `tag` in AnthropicChatModel. Sonnet call omits `temperature`.
- NEW this session: mobile-only public App Store release is the target;
  hosting = user's own plain Ubuntu VPS, no Docker, no PaaS; real Clerk auth
  required (fake bearer token cannot ship to App Store review).

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, no Docker locally (matches new
  deploy/ convention for the VPS). apps/server/.env (gitignored) holds real
  env incl. Anthropic key.
- Gates: G-01 CLOSED. G-02 Clerk in progress. G-03 Paddle deferred (no
  paywall in v1). G-04/05/09 deploy in progress via deploy/.
- User has zero of: Apple Developer account, Expo/EAS account, VPS, Clerk
  account — all four are hard blockers only the user can clear.
- Flagged only, do not fix unprompted: ci.yml/root package.json reference
  nonexistent `@charisma/content`; SOURCE-DO-NOT-SHIP/ deletion discrepancy
  still unreconciled before IP sign-off.
- userProfile projection wired (services/profile.ts): feeds FEEDBACK only,
  never the character (Sam is a stranger, must not know history).

## DOC REFS
content-library/README.md + CONTEXT.md | BUILD-PLAN-MAP.md |
BUILD-EXECUTION-PLAN.md (gates ~1370-1395) | FABLE-PROMPT-CONNECTION-LIBRARY.md
| POSITIONING.md | HANDOFF.md (loop doctrine) | deploy/README.md (new).
