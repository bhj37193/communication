# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS
Core loop green (core 71/71, server 35/35) on real Anthropic models (Haiku
character / Sonnet feedback). Mobile app works end-to-end live. Pivoting to
**public App Store release, mobile-only** (apps/web stays P2/deferred,
Paddle/G-03 not needed yet).

## COMPLETED THIS SESSION
- **Task #5 DONE, reviewed**: `deploy/` (README, systemd unit, Caddyfile,
  .env.example) — no Docker, native Postgres 18, tsx runtime, Caddy auto-TLS.
- **Task #6 NEARLY DONE (background agent a1a25387581a1450f, was still
  `running` as of last check — do NOT duplicate, do NOT trust as final
  yet)**: real Clerk auth wiring, mobile + server. Self-reported: mobile
  suite 24/24 pass, server suite 35/35 pass, typecheck clean both sides, no
  leaked secrets found in `.env.example` files, no debug leftovers. Agent
  called its own advisor for a final self-check and had not yet reported
  completion. Mobile side confirmed written: `apps/mobile/app/_layout.tsx`
  splits `DevAuthProvider` vs `ClerkAuthBridge` behind
  `USE_CLERK = !isAuthConfigured()`; `apps/mobile/lib/auth.ts` has real
  `getClerkToken()` (`getClerkInstance().session?.getToken()`) +
  AsyncStorage `tokenCache`. Server-side files not yet individually
  re-confirmed post-edit by me. **I (main session) have NOT independently
  reviewed the diff yet** — the above is the agent's own self-report only.

## EXACT NEXT STEP
1. Check status of `a1a25387581a1450f` (TaskOutput, block=false). If
   `status: completed`, read the FULL diff (`git diff`) myself before
   trusting anything — do not just accept its self-report.
2. Independently rerun `pnpm --filter @charisma/server test` +
   `pnpm --filter @charisma/mobile test` + typecheck both. Confirm
   fake-auth path (`AUTH_PROVIDER=fake`, default) still passes untouched.
   Clerk path is NOT verifiable yet (user has no Clerk account — task #4):
   only claim it typechecks and matches Clerk's documented API, never that
   it "works."
3. Then resume task #7 (eas.json + app icons — needs user-supplied artwork,
   don't fabricate branding) and #8 (App Store listing prep).
4. Tasks #1-4 (signups: Apple Developer, Expo/EAS, VPS, Clerk) are blocking
   and on the user — check in on progress before assuming done.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME.
- ONE mode, EVERYDAY/charisma, TEXT CHAT only v1. Daily challenge vs AI
  character -> feedback + deterministic score + streak. 3-5 min.
- Text chat fully free; paywall = premium AVATAR tier (Phase 6, not built).
- Prompt design LOCKED: static system per unit; per-turn context in
  messages, never in system (assemble.test.ts enforces).
- Model per touchpoint: character = Haiku (`claude-haiku-4-5`), feedback =
  Sonnet (`claude-sonnet-5`), routed by call `tag` in AnthropicChatModel.
- Mobile-only public App Store release is the target; hosting = user's own
  plain Ubuntu VPS, no Docker, no PaaS; real Clerk auth required.

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, no Docker locally. apps/server/.env
  (gitignored) holds real env incl. Anthropic key.
- Gates: G-01 CLOSED. G-02 Clerk in progress. G-03 Paddle deferred. G-04/05/09
  deploy in progress via deploy/.
- User has zero of: Apple Developer account, Expo/EAS account, VPS, Clerk
  account — all four are hard blockers only the user can clear.
- Flagged only, do not fix unprompted: ci.yml/root package.json reference
  nonexistent `@charisma/content`; SOURCE-DO-NOT-SHIP/ deletion discrepancy
  unreconciled before IP sign-off.
- userProfile projection (services/profile.ts) feeds FEEDBACK only, never
  the character (Sam is a stranger, must not know history).

## DOC REFS
content-library/README.md + CONTEXT.md | BUILD-PLAN-MAP.md |
BUILD-EXECUTION-PLAN.md (gates ~1370-1395) | FABLE-PROMPT-CONNECTION-LIBRARY.md
| POSITIONING.md | HANDOFF.md (loop doctrine) | deploy/README.md.
