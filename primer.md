# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS
Core loop green (core 71/71, server 35/35) on real Anthropic models (Haiku
character / Sonnet feedback). Mobile app works end-to-end live. Pivoting to
**public App Store release, mobile-only** (apps/web stays P2/deferred,
Paddle/G-03 not needed yet).

## COMPLETED THIS SESSION
- **Task #5 DONE, reviewed**: `deploy/` (README, systemd unit, Caddyfile,
  .env.example) — no Docker, native Postgres 18, tsx runtime, Caddy auto-TLS.
- **Task #6 IN PROGRESS (background agent a1a25387581a1450f, still running,
  do NOT duplicate)**: real Clerk auth wiring. Mobile side is substantially
  written: `apps/mobile/app/_layout.tsx` now splits `DevAuthProvider` vs
  `ClerkAuthBridge` behind `USE_CLERK = !isAuthConfigured()`;
  `apps/mobile/lib/auth.ts` has a real `getClerkToken()`
  (`getClerkInstance().session?.getToken()`) and an AsyncStorage-backed
  `tokenCache`. Agent was last seen self-repairing test breakage it caused
  (mocking `useAuth` from `_layout` in `test/screens.test.tsx`) and about to
  rerun the full mobile suite. Server-side (`env.ts` CLERK_SECRET_KEY,
  `AuthVerifier.ts` ClerkAuthVerifier, `composition.ts` wiring) NOT yet
  confirmed written — check on resume. NOTHING here has been reviewed yet.
  As of this checkpoint the agent is STILL running; no new report to review.

## EXACT NEXT STEP
1. Check status of `a1a25387581a1450f` (TaskOutput, block=false first). If
   done, read its full diff (`git diff`) before trusting anything.
2. Review: run `pnpm --filter @charisma/server test` + typecheck on
   server+mobile; confirm fake-auth path (`AUTH_PROVIDER=fake`, default)
   still passes untouched. Clerk path itself is NOT verifiable yet (user has
   no Clerk account — task #4) — do not claim it "works," only that it
   typechecks and matches Clerk's documented API.
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
  plain Ubuntu VPS, no Docker, no PaaS; real Clerk auth required (fake
  bearer token cannot ship to App Store review).

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
