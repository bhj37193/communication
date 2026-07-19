# Primer: Charisma Trainer (consumer, TEXT-CHAT charisma app). Name TBD.

## STATUS
Core loop green (core 71/71, server 39/39) on real Anthropic models (Haiku
character / Sonnet feedback). Mobile app works end-to-end live. Pivoting to
**public App Store release, mobile-only** (apps/web stays P2/deferred).

## COMPLETED THIS SESSION
- Task #5 DONE: `deploy/` (systemd, Caddyfile, .env.example, no Docker).
- Task #6 DONE, independently verified (not just agent self-report): real
  Clerk auth wiring mobile+server. server 39/39, mobile jest 24/24, both
  typecheck clean, diff scoped to 8 expected files, no leaked secrets.
  Clerk itself still unverifiable end-to-end (no real account, task #4).
- Task #7 DONE: `eas.json` build profiles (submit block omitted, needs
  #1/#2). Placeholder icon/adaptive-icon/splash (PIL-generated, explicitly
  non-final) wired into `app.json`.
- Task #8 partially DONE: drafted `apps/mobile/app-store-listing.md` —
  description, keywords, category, age rating (4+), full privacy label
  derived directly from schema.ts/analytics.ts/retention.ts/deletion.ts/
  AnthropicChatModel.ts/webhooks.ts (our DB stores only Clerk's opaque
  user id, never email/name; chat text goes to Anthropic for replies/
  feedback; transcripts/results hard-delete at 60d; account deletion is
  one atomic DB fn wiping every table via Clerk's webhook; no third-party
  analytics/crash SDK present). App Name/Subtitle/Screenshots/Privacy
  Policy URL/Support URL left as explicit TODO. NOTE: schema.ts also has
  an `eval_transcripts` table (SD-9, anonymized, no userId) not yet
  reflected in the listing's privacy table — low priority, anonymized.
- Checked in with user (2026-07-19, 4x): name still "deciding", tasks
  #1-4 confirmed still all pending every time. Last 3 `/autopilot`
  invocations had zero new state between them — flagged to user as
  likely an auto-re-firing loop, not manual re-invocation.

## EXACT NEXT STEP
Nothing autonomously actionable — remaining #8 gaps (name, screenshots,
hosted privacy policy URL) and #1-4 are all user-blocked. On resume:
1. Check in on app name + #1-4 status. If yet another resume shows zero
   new state again, say so briefly and cancel — do not re-run full checks
   every cycle.
2. Once a real name exists: update `app.json` name/slug, fill in
   `app-store-listing.md` Name/Subtitle/`{{APP_NAME}}`.
3. Once real artwork exists: swap `apps/mobile/assets/{icon,
   adaptive-icon,splash}.png`; take real screenshots.
4. Once #1/#2 land: fill `eas.json` submit block + `app.json`
   extra.eas.projectId/owner from `eas init`.
5. Once #3 (VPS) lands: host a privacy policy page from the table in
   `app-store-listing.md`, link as Privacy Policy URL.

## LOCKED DECISIONS
- Entity: Korean young-entrepreneur SME. ONE mode, EVERYDAY/charisma, TEXT
  CHAT only v1. Daily challenge vs AI character -> feedback + deterministic
  score + streak. 3-5 min. Text chat free; paywall = AVATAR tier (Phase 6).
- Prompt design LOCKED: static system per unit; per-turn context in
  messages, never system (assemble.test.ts enforces).
- Models: character = Haiku (`claude-haiku-4-5`), feedback = Sonnet
  (`claude-sonnet-5`), routed by call `tag` in AnthropicChatModel.
- Mobile-only App Store release; hosting = user's own plain Ubuntu VPS,
  no Docker/PaaS; real Clerk auth required to ship.

## OUTSTANDING OPS / ENV FACTS
- Native Postgres 18, localhost:5432, no Docker locally. apps/server/.env
  (gitignored) holds real env incl. Anthropic key.
- Gates: G-01 CLOSED. G-02 Clerk in progress. G-03 Paddle deferred.
- User has zero of: Apple Developer, Expo/EAS, VPS, Clerk accounts.
- Flagged only, don't fix unprompted: ci.yml/root package.json reference
  nonexistent `@charisma/content`; SOURCE-DO-NOT-SHIP/ deletion discrepancy.

## DOC REFS
content-library/README.md + CONTEXT.md | BUILD-PLAN-MAP.md |
BUILD-EXECUTION-PLAN.md (gates ~1370-1395) | FABLE-PROMPT-CONNECTION-LIBRARY.md
| POSITIONING.md | HANDOFF.md | deploy/README.md | apps/mobile/app-store-listing.md.
