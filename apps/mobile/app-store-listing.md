# App Store Connect Listing — Draft (Task #8)

Everything here is name-independent and locked-decision-derived — safe to
draft now. Items marked `TODO` are blocked on the pending app name decision
or real artwork and must not be filled with "Charisma Trainer" as final.

## App Name / Subtitle / Screenshots — BLOCKED

- App Name: `TODO: pending final name decision`
- Subtitle (30 char): `TODO: pending final name decision`
- Screenshots (6.7", 6.5", 5.5", iPad if supporting tablet): `TODO: pending real artwork`
  (placeholder icon/splash at `apps/mobile/assets/` are explicitly non-final, do not screenshot them for the listing)

## Promotional Text (170 char, editable without review)

Practice real conversations with an AI character, get instant feedback, and
build your charisma one daily challenge at a time.

## Description

Build charisma through daily practice, not theory.

{{APP_NAME}} gives you a short, realistic text conversation with an AI
character every day. You respond in the moment, then get feedback on what
worked, what to fix, and a key moment to remember — plus a deterministic
score you can track over time.

- One daily challenge, 3-5 minutes
- Real-time conversation with an AI character (text chat)
- Feedback after every session: a win, a fix, and a key moment
- Score and streak tracking to keep you consistent
- Sign in securely to sync your progress across devices

Free to play the daily text-chat challenge. An optional subscription
unlocks the avatar tier (coming in a future update).

## Keywords (100 char, comma-separated, no spaces)

charisma,confidence,communication,conversation,socialskills,practice,coaching,softskills,dating,networking

## Category

- Primary: Lifestyle
- Secondary: Education

## Age Rating Questionnaire

- Cartoon or Fantasy Violence: None
- Realistic Violence: None
- Sexual Content or Nudity: None
- Profanity or Crude Humor: None
- Alcohol, Tobacco, or Drug Use: None
- Mature/Suggestive Themes: None
- Horror/Fear Themes: None
- Gambling (simulated or real money): None
- Unrestricted Web Access: No
- User-Generated Content shared with other users: No — conversation partner
  is a single AI character; there is no messaging, feed, or profile visible
  to other real users
- Contests: No
- Expected rating: **4+**

## Privacy — "Nutrition Label" (App Store Connect → App Privacy)

Facts below are pulled directly from `apps/server/src/db/schema.ts`,
`services/analytics.ts`, `services/retention.ts`, `services/deletion.ts`,
`model/AnthropicChatModel.ts`, and `routes/webhooks.ts` — not guessed.

### Data collected

| Category | Data | Linked to identity? | Used for | Third-party sharing |
|---|---|---|---|---|
| Identifiers | Clerk user ID (opaque, `users.clerkId`) | Yes | App functionality, account | No — Clerk (auth provider) holds the real identity (email/credentials); our own DB never stores email or name |
| Usage Data | Session state, scores, streak, call counts (`sessions`, `results`) | Yes | App functionality | No |
| User Content | Chat transcript text (`transcripts.messages`) | Yes | App functionality (generating character replies + feedback) | **Yes — sent to Anthropic (LLM provider) to generate responses**; not used for advertising or sold |
| Purchases | Subscription/entitlement status and product (`entitlements`) | Yes | App functionality | Payment processor only (Paddle/Apple/Google), once Phase 6 ships |
| Diagnostics/Analytics | Allowlisted event names + numeric/enum-only props, e.g. `session_completed{score, result}`, `streak_broken{previousStreak}` (`analytics_events`) | Yes | Analytics (first-party only) | No — no third-party analytics or crash SDK is integrated (no Sentry/Mixpanel/Amplitude/Firebase in either `apps/server` or `apps/mobile` package.json) |

Explicitly **not** collected: precise location (only IANA timezone string
is stored, for local-day computation), contacts, photos, browsing history,
advertising identifiers, or any messaging with other real users.

### Tracking

**No tracking** (per Apple's definition — no data linked across apps/sites
for advertising). No third-party ad SDK is present.

### Data retention / deletion

- Chat transcripts and session results: auto-deleted 60 days after
  creation via an hourly sweep (`retention.ts: sweepExpiredContent`) —
  hard delete, not soft-delete.
- Full account deletion: a single atomic SQL function
  (`delete_user_data(uuid)`, wrapped by `services/deletion.ts`) hard-deletes
  every row across `results`, `transcripts`, `sessions`, `progress_events`,
  `analytics_events`, `daily_usage`, `user_skill_state`, `entitlements`,
  and `users` — triggered automatically by Clerk's `user.deleted` webhook,
  so account deletion in Clerk cascades to full data deletion here.

### Suggested App Privacy answers

- Data Used to Track You: **None**
- Data Linked to You: Identifiers (User ID), Usage Data, User Content, Purchases
- Data Not Linked to You: Diagnostics (analytics event names/props are
  stored per-user internally but are non-content and not exposed/sold —
  mark as "linked" to be conservative unless a stricter reading is preferred)

## Support / Marketing URLs

- Support URL: `TODO` (needs a hosted page — VPS is Task #3, not yet provisioned)
- Marketing URL: `TODO` (optional, skip if none)
- Privacy Policy URL: `https://bhj37193.github.io/communication/`
  (live via GitHub Pages, serving `docs/index.html`, reflects the data
  table above, self-contained, no build step).

## What's still blocking submission

1. App name (user "still deciding") → blocks App Name, Subtitle, bundle
   display name, and description's `{{APP_NAME}}` placeholder. Also still
   needs replacing throughout `docs/index.html` (currently says "Charisma
   Trainer").
2. Real icon/screenshots (current assets are placeholder, PIL-generated).
3. ~~Deploying the drafted Privacy Policy page~~ — done, hosted at
   `docs/index.html` via GitHub Pages.
4. Apple Developer Program membership (Task #1) to actually create the
   App Store Connect listing at all.
