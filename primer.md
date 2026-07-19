# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS
Core loop green (core 71/71, server 35/35) on real Anthropic models (Haiku
character / Sonnet feedback). Mobile app works end-to-end live. Pivoting to
**public App Store release, mobile-only** (apps/web stays P2/deferred,
Paddle/G-03 not needed yet).

## COMPLETED THIS SESSION
- **Task #5 DONE, reviewed**: `deploy/` (README, systemd unit, Caddyfile,
  .env.example) — no Docker, native Postgres 18, tsx runtime, Caddy auto-TLS.
- **Task #6 IN PROGRESS (background agent a1a25387581a1450f)**: real Clerk
  auth wiring, mobile + server. Its `advisor()` call took ~3.5 min and
  returned at 15:23:14; it's now acting on that feedback (was reading
  `AnthropicChatModel.test.ts`, likely checking a pattern/convention the
  advisor flagged) — a few identical polls in a row earlier was NOT a
  stall, just a slow advisor call; check timestamps before concluding
  stuck. Self-reported before that call: mobile suite 24/24 pass, server
  suite 35/35 pass, typecheck clean both sides, no debug leftovers, no
  leaked secrets. Mobile side confirmed written:
  `apps/mobile/app/_layout.tsx` splits `DevAuthProvider` vs
  `ClerkAuthBridge` behind `USE_CLERK = !isAuthConfigured()`;
  `apps/mobile/lib/auth.ts` has real `getClerkToken()`
  (`getClerkInstance().session?.getToken()`) + AsyncStorage `tokenCache`.
  **The diff has NOT been independently reviewed by me yet.**

## EXACT NEXT STEP
1. `TaskOutput(a1a25387581a1450f, block=false)` to check current state. If
   `status: completed`, read the full diff (`git diff`) myself first —
   don't just accept the self-report, especially server-side files
   (env.ts CLERK_SECRET_KEY, AuthVerifier.ts ClerkAuthVerifier,
   composition.ts wiring) which weren't independently confirmed.
2. Run `pnpm --filter @charisma/server test` + typecheck server+mobile
   myself. Confirm fake-auth path (`AUTH_PROVIDER=fake`, default) still
   passes. Clerk path is unverifiable (no Clerk account — task #4): only
   claim it typechecks/matches Clerk's API, never "works."
3. Then task #7 (eas.json + icons, need user artwork, don't fabricate
   branding) and #8 (App Store listing prep).
4. Tasks #1-4 (Apple Developer, Expo/EAS, VPS, Clerk signups) are on the
   user — check in, don't assume done.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME. ONE mode, EVERYDAY/charisma, TEXT
  CHAT only v1. Daily challenge vs AI character -> feedback + deterministic
  score + streak. 3-5 min. Text chat free; paywall = AVATAR tier (Phase 6).
- Prompt design LOCKED: static system per unit; per-turn context in
  messages, never system (assemble.test.ts enforces).
- Models: character = Haiku (`claude-haiku-4-5`), feedback = Sonnet
  (`claude-sonnet-5`), routed by call `tag` in AnthropicChatModel.
- Mobile-only App Store release target; hosting = user's own plain Ubuntu
  VPS, no Docker/PaaS; real Clerk auth required to ship.

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, no Docker locally. apps/server/.env
  (gitignored) holds real env incl. Anthropic key.
- Gates: G-01 CLOSED. G-02 Clerk in progress. G-03 Paddle deferred.
  G-04/05/09 deploy in progress via deploy/.
- User has zero of: Apple Developer, Expo/EAS, VPS, Clerk accounts.
- Flagged only, don't fix unprompted: ci.yml/root package.json reference
  nonexistent `@charisma/content`; SOURCE-DO-NOT-SHIP/ deletion discrepancy.
- userProfile projection (services/profile.ts) feeds FEEDBACK only, never
  the character.

## DOC REFS
content-library/README.md + CONTEXT.md | BUILD-PLAN-MAP.md |
BUILD-EXECUTION-PLAN.md (gates ~1370-1395) | FABLE-PROMPT-CONNECTION-LIBRARY.md
| POSITIONING.md | HANDOFF.md | deploy/README.md.
