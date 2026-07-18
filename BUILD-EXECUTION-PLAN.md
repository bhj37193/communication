# BUILD-EXECUTION PLAN: charisma chat trainer (v1, 2026-07-18)

Produced by Fable 5 against FABLE-PROMPT-BUILD-EXECUTION.md. The design source of truth
is PRD-CHARISMA-CHAT.md (LOCKED). This document is the execution layer: it tells a fleet
of autonomous Sonnet coding agents exactly what to build, in what order, against what
Fakes, with what acceptance command, and tells the human exactly where they must step in.
Every decision below is made. No em-dashes anywhere.

## Addendum A (2026-07-18): competitive-research design requirements

New requirements from PRD section 11 (mined from 3,700 competitor reviews). Each maps to a
phase and a task with an acceptance criterion. These augment the DAG below, they do not
replace it.

- **A1. Trust billing UX (PRD 11.1), Phase 2 (money).** Visible in-app cancel reachable in
  <=2 taps; a pre-charge reminder before any renewal or trial-to-paid conversion; free text
  usable with no card. Acceptance: an e2e test asserts the cancel route exists and is <=2 taps
  from account, a renewal-reminder job is scheduled on subscription create, and no endpoint on
  the free text path requires an entitlement.
- **A2. Coach memory/continuity (PRD 11.2), Phase 1 (engine).** The feedback prompt receives a
  compact user-memory summary (goals, recurring weak signals, last-session note) projected
  from the event log. Acceptance: an integration test seeds a prior session with a weak signal
  and asserts the next feedback references it; basic memory works with no entitlement.
- **A3. Real-world transformation events (PRD 11.3), Phase 1 then surfaced Phase 3.** Add
  `real_world_report` and `situation_outcome` event types to the append-only log and a
  lightweight check-in path; expose a "real conversations reported" metric. Acceptance: events
  persist and project into the metric; a test drives a report and asserts the metric moves.
- **A4. Outcome-tied scenarios (PRD 11.4), Phase 1 (content) + onboarding.** Onboarding
  captures the user's target situation; the SkillPack unit schema carries a real-event tag.
  Acceptance: onboarding persists a target-situation field; at least one seeded scenario is
  tagged to a real event and selectable.
- **A5. Voice/avatar reliability P0 (PRD 11.5), Phase 6.** Mic capture, audio reliability, and
  the interrupt/barge-in path are launch-blocking. Acceptance (Phase 6 gate): a reliability
  test suite (mic acquire, stream, interrupt latency <200ms) must pass before the tier ships.

A1 to A4 are inside the already-planned Phases 1 to 3 and need no new external accounts, so
autonomous agents build them against the existing mock boundary. A5 belongs to the deferred
voice/avatar tier and is gated with it.

Conventions used throughout:
- Workspace package names: `@charisma/core`, `@charisma/content`, `@charisma/server`,
  `@charisma/mobile`, `@charisma/web`.
- Test runner: Vitest for core/content/server. Jest (jest-expo) for mobile.
- Local Postgres: Docker Compose service `postgres`, host port 5433, user `charisma`,
  password `charisma`, db `charisma` (test db `charisma_test`, created by test setup).
- "AUTONOMOUS" = buildable and verifiable entirely offline against Fakes plus local
  Postgres, zero real credentials. "GATED (G-xx)" = blocked until human gate G-xx clears.
- Every acceptance criterion is a command that exits 0. An agent never marks a task done
  while its command is red.

---

## 1. Spec deltas

Defects and underspecifications found while planning. The PRD stays authoritative for
everything else; these are the only changes, each one line.

- SD-1: No mid-session recovery endpoint exists; an app restart orphans the chat. Fix:
  add `GET /v1/sessions/:id` returning `{state, messages, remaining}` (owner only).
- SD-2: `POST /end` triggers async scoring but `GET /result` has no pending semantics.
  Fix: result returns `202 {status:"scoring"}` until the results row exists, then 200.
- SD-3: "Session ends at 10 user messages or a natural close" leaves "natural close"
  undefined. Fix: v1 natural close is the user tapping End (explicit `POST /end`);
  additionally the sweep job auto-ends sessions open longer than 60 minutes (scored if
  they have at least 1 user message, else marked `abandoned`, no cap consumption).
- SD-4: Section 4.6 says weights live in SignalDefs, but the formula also uses caps
  (`min(x,3)`) and an in-band bonus that SignalDef cannot express. Fix: extend SignalDef
  with optional `cap?: number` and `band?: {min,max}` fields; score.ts reads weight, cap,
  and band from the pack, with the PRD 4.6 constants as the shipped pack values.
- SD-5: `sessions.state` values are never enumerated. Fix: enum
  `open | scoring | scored | abandoned`.
- SD-6: `users.tz` is set "from device at signup" but the Clerk `user.created` webhook
  carries no device timezone. Fix: client sends `x-device-tz` (IANA name) on every
  request; the server sets `users.tz` on first authenticated call if still default.
- SD-7: Section 3.10 caps feedback at 2 calls (one retry) but 3.5 grants both a parse
  retry and an evidence-failure regeneration (potentially 3 calls). Fix: hard cap 2
  feedback calls total per session; a parse retry consumes the regeneration budget.
- SD-8: Section 3.6 forbids UPDATE/DELETE grants on `progress_events`, but Section 3.8
  hard-deletes a user's progress events. Fix: the API role has no UPDATE/DELETE on that
  table; deletion goes through a `SECURITY DEFINER` function `delete_user_data(uuid)`
  owned by the migration role, called by `DELETE /v1/me/data` and the Clerk
  `user.deleted` handler.
- SD-9: Section 7.3 wants a rolling eval set "from Phase 0" while 3.8 expires
  transcripts at 60 days. Fix: an `eval_transcripts` table (anonymized: no user_id, no
  clerk id) populated at scoring time up to a rolling 200 rows, carrying the same
  60-day `expires_at`; the Phase 5 swap harness therefore replays a recent window, not
  an archive, which is what 7.3 intends ("until transcript expiry").

---

## 2. Repo scaffold

Exact monorepo tree. Every file, one-line responsibility. Files marked (P1), (P2), (P3)
are created in that later phase; everything unmarked is Phase 0.

```
charisma/
  package.json                      # root scripts: typecheck, test, ci:local, content:load, e2e:smoke
  pnpm-workspace.yaml               # workspaces: apps/*, packages/*
  tsconfig.base.json                # strict TS config all packages extend
  .gitignore                        # node_modules, .env, dist, .expo, coverage
  .env.example                      # every env var in the Section 4.4 manifest with its mock default
  docker-compose.yml                # dev profile: postgres. prod profile: caddy, api, web, postgres, uptime-kuma
  Caddyfile                         # TLS + reverse proxy: api.DOMAIN -> api:3000, DOMAIN -> web:3001
  README.md                         # bootstrap: pnpm install, docker compose up -d postgres, pnpm db:migrate, pnpm dev
  .github/
    workflows/
      ci.yml                        # PR gate: typecheck, core+content+server unit, integration (pg service), e2e smoke, docker build
      deploy.yml                    # push-to-main: ssh to VPS, compose pull/up (needs G-04/G-05/G-09 secrets)

  packages/core/                    # pure logic: zero I/O, zero env reads, fully unit-tested
    package.json                    # @charisma/core; scripts: test, typecheck
    vitest.config.ts                # vitest node config
    src/
      index.ts                      # public exports (schemas, validator, score, engine, model, fakes)
      schemas.ts                    # every Zod schema: pack/unit/signal, model outputs, API DTOs
      model.ts                      # ChatModel interface, ChatMessage, TokenUsage types (PRD 3.4)
      speech.ts                     # (P1) SpeechProvider + VoiceProvider interfaces (PRD 8.1), dormant
      validator.ts                  # deterministic classifiers, signals, evidence check, pass rule (PRD 4.5)
      score.ts                      # deterministic score fold over signals + pack weights (PRD 4.6, SD-4)
      engine.ts                     # pure state machine: user state, session reducer, caps math, streak fold, mastery counter
      prompts.ts                    # character system-prompt template builder + per-turn state block + feedback transcript renderer
      fakes/
        FakeChatModel.ts            # script-replaying ChatModel (Section 3.2 of this plan)
        scripts.ts                  # the good-sam / bad-sam / fabricated-quote scripts, exported for tests
        FakeSpeechProvider.ts       # (P1) returns scripted transcription for any audio
        FakeVoiceProvider.ts        # (P1) yields a constant silent WAV chunk stream
    fixtures/
      good-run.json                 # full good transcript + warmth trace + expected signals + expected score 100
      bad-run.json                  # full bad transcript + trace + expected signals + expected score 10
      mid-run.json                  # mid-quality transcript + expected signals + expected score 81, passed false
      classifier-cases.json         # per-classifier known-answer table (question/open/followup/disclosure edge cases)
    test/
      schemas.test.ts               # every schema accepts its fixture and rejects mutations
      classifiers.test.ts           # classifier known-answer table green
      validator.test.ts             # signals + evidence + pass rule against the three run fixtures
      score.test.ts                 # score known answers incl clamp; weights read from pack
      engine.test.ts                # state transitions, caps, streak, mastery folds
      fake-chat-model.test.ts       # script selection, turn indexing, feedback replay, default flat script
      prompts.test.ts               # rendered system prompt snapshot for the Sam unit

  packages/content/                 # skill packs as data; validated, never imported as code by the app
    package.json                    # @charisma/content; scripts: validate, test
    src/
      validate.ts                   # CLI: Zod-validate every pack file, check prereq graph, check rubric signal ids exist
    everyday/
      pack.json                     # pack_id "everyday", version, signal defs (with weight/cap/band per SD-4)
      skills.json                   # the 8 skills of PRD 6.1 with prerequisites
      units/
        followups.housewarming-sam.json   # the Sam unit, verbatim PRD 6.2 (plus nothing)
      lists/
        open-starters.json          # curated open-question starter list (PRD 4.5)
        closed-starters.json        # closed-question starter list
        stopwords.json              # stopword list for followup/content-word matching
    test/
      content.test.ts               # pack validates; Sam unit round-trips through Unit schema

  apps/server/
    package.json                    # @charisma/server; scripts: dev, build, test, test:integration, db:migrate, db:check, content:load, smoke:anthropic, tune:sam
    vitest.config.ts                # two projects: unit, integration
    Dockerfile                      # node:22-slim, pnpm deploy, runs dist/index.js
    drizzle.config.ts               # drizzle-kit config pointing at src/db/schema.ts
    src/
      index.ts                      # entrypoint: parse env, build composition root, start Fastify + jobs
      env.ts                        # Zod-parsed env manifest; crashes on invalid; defaults are the mock values
      composition.ts                # THE composition root: picks Fake vs real for every interface by env var
      app.ts                        # Fastify app factory (takes the composition root; used by index.ts and tests)
      db/
        schema.ts                   # full Drizzle schema (Section 4.2 of this plan)
        client.ts                   # pg Pool + drizzle instance from DATABASE_URL
        migrate.ts                  # runs ./migrations with drizzle-orm migrator
        migrations/0000_init.sql    # initial migration (Section 4.3 of this plan)
      auth/
        AuthVerifier.ts             # interface: verify(headers) -> {clerkId} | null
        ClerkAuthVerifier.ts        # real: verifies Clerk JWT via @clerk/backend
        plugin.ts                   # Fastify preHandler: verify, upsert users row, set tz (SD-6), attach req.user
      model/
        AnthropicChatModel.ts       # real ChatModel: claude-haiku-4-5, prompt caching, JSON parse + one retry, usage metering
      billing/
        BillingWebhookVerifier.ts   # (P2 real use; interface now) verifyAndParse(raw, sig) -> PaddleEvent | null
        PaddleWebhookVerifier.ts    # (P2) real HMAC verification of Paddle signatures
      receipts/
        ReceiptValidator.ts         # interface only (apple/google), per PRD 3.9 step 5; no implementation in v1
      telemetry/
        ErrorTracker.ts             # interface: captureException, flush
        SentryTracker.ts            # real Sentry with beforeSend body scrubbing
      fakes/
        FakeAuthVerifier.ts         # mints identity from x-test-user header (Section 3.3 of this plan)
        FakeBillingWebhookVerifier.ts  # accepts signature "test-signature", parses body as PaddleEvent
        FakeReceiptValidator.ts     # always returns {valid:false, reason:"fake"}
        NoopErrorTracker.ts         # swallows everything; default whenever SENTRY_DSN is empty
      routes/
        me.ts                       # GET /v1/me, GET /v1/me/history (P2), DELETE /v1/me/data
        challenge.ts                # GET /v1/challenge/today
        sessions.ts                 # POST /v1/sessions, GET /v1/sessions/:id, POST .../messages, POST .../end, GET .../result
        voice.ts                    # (P1) POST /v1/sessions/:id/voice-message, 404 unless VOICE_ENABLED=true
        webhooks.ts                 # POST /v1/webhooks/paddle (P2 live), POST /v1/webhooks/clerk
        health.ts                   # GET /healthz: {ok, db}
      services/
        turn.ts                     # chat turn flow (PRD 3.3): guards, prompt build, model call, clamp, trace, usage row
        scoring.ts                  # session-end pipeline (PRD 3.5 + SD-7): feedback call, validator, fallback, events, results row
        router.ts                   # unit router; Phase 0: always the Sam unit; (P1) reviews -> in-progress -> next unlocked
        caps.ts                     # daily_usage enforcement + global circuit breaker state
        streak.ts                   # streak projection from progress_events, tz-aware
        analytics.ts                # closed-props event insert (allowlisted names, Zod-closed props, no free text)
        evalset.ts                  # rolling 200-row anonymized eval_transcripts writer (SD-9)
        retention.ts                # sweep job: TTL deletes, stale-open-session auto-end (SD-3)
        deletion.ts                 # calls delete_user_data() SECURITY DEFINER fn (SD-8)
      jobs/
        scheduler.ts                # setInterval runners: breaker (60s), sweep (hourly); started by index.ts, not by tests
      scripts/
        content-load.ts             # CLI: load packages/content into skill_packs/skills/units tables
        smoke-anthropic.ts          # GATED G-01: one live character call + one feedback call, prints usage
        tune-sam.ts                 # GATED G-01: replays N scripted user runs against the live model, logs warmth traces
    test/
      unit/                         # route/service tests against Fakes with mocked db where cheap
      integration/
        setup.ts                    # creates/drops charisma_test db, runs migrations, truncates between tests
        loop.test.ts                # full good-run and bad-run over HTTP: THE Phase 0 proof (Section 8.2)
        caps.test.ts                # free cap, breaker, 409s
        retention.test.ts           # TTL sweep, stale session auto-end, delete-my-data, clerk user.deleted
        webhooks.test.ts            # (P2) paddle fixture replay -> entitlements rows
      fixtures/paddle/              # (P2) recorded Paddle webhook JSON: created, updated, canceled, past_due, transaction
      e2e/smoke.ts                  # boots real server process w/ Fakes + local pg, drives good run via fetch, asserts score 100

  apps/mobile/
    package.json                    # @charisma/mobile; scripts: start, ios, android, typecheck, test
    app.json                        # Expo config (scheme, bundle ids, EAS project id placeholder)
    eas.json                        # EAS build profiles: development, preview, production (GATED creds)
    babel.config.js                 # expo preset
    src/
      app/_layout.tsx               # Expo Router root: auth provider (Clerk or dev fake), query client
      app/index.tsx                 # entry card: scenario title/setup, Start button, streak flame
      app/chat.tsx                  # chat surface: bubbles, typing delay 600-1800ms + length-proportional, remaining counter
      app/result.tsx                # result card: WIN / FIX / THE MOMENT / SCORE, share button
      app/profile.tsx               # sign out + delete-my-data (the only settings in Phase 0)
      lib/api.ts                    # typed client for the Section 4.1 contracts; base URL from EXPO_PUBLIC_API_URL
      lib/auth.ts                   # Clerk token getter; DEV fake mode sends x-test-user instead (Section 3.3)
      lib/share.ts                  # react-native-view-shot capture of the score card -> share sheet
      components/ScoreCard.tsx      # the shareable render of WIN/FIX/MOMENT/SCORE
    test/
      api.test.ts                   # api client against mocked fetch: contract shapes
      screens.test.tsx              # entry/chat/result render with mocked api

  apps/web/                         # (P2) marketing + checkout + account; Phase 0 ships nothing here
    package.json                    # @charisma/web; Next.js 15 static-first
    next.config.mjs                 # static export where possible
    src/app/page.tsx                # (P2) marketing one-pager
    src/app/account/page.tsx        # (P2) Clerk sign-in + subscribe (Paddle overlay) + manage plan
    src/app/layout.tsx              # (P2) ClerkProvider, Plausible script
    Dockerfile                      # (P2) node:22-slim next start
```

---

## 3. The mock boundary

Rule: every external dependency lives behind an interface. The real class and the Fake
implement the same interface. `apps/server/src/composition.ts` is the ONLY file that
reads provider env vars and instantiates concrete classes. Tests construct the
composition root directly with Fakes. An agent with zero credentials runs everything.

Summary table:

| Dependency | Interface (file) | Real impl | Fake impl | Selector env var (mock default) |
|---|---|---|---|---|
| Model provider | `ChatModel` (core/src/model.ts) | `AnthropicChatModel` | `fakes/FakeChatModel` | `MODEL_PROVIDER=fake` |
| Auth | `AuthVerifier` (server/src/auth) | `ClerkAuthVerifier` | `fakes/FakeAuthVerifier` | `AUTH_PROVIDER=fake` |
| Billing webhooks | `BillingWebhookVerifier` (server/src/billing) | `PaddleWebhookVerifier` (P2) | `fakes/FakeBillingWebhookVerifier` | `BILLING_PROVIDER=fake` |
| Error tracking | `ErrorTracker` (server/src/telemetry) | `SentryTracker` | `fakes/NoopErrorTracker` | `SENTRY_DSN=` (empty = noop) |
| Store receipts | `ReceiptValidator` (server/src/receipts) | none in v1 (PRD 3.9) | `fakes/FakeReceiptValidator` | `RECEIPT_VALIDATOR=fake` |
| STT (P1, dormant) | `SpeechProvider` (core/src/speech.ts) | managed adapter (later) | `fakes/FakeSpeechProvider` | `SPEECH_PROVIDER=fake` |
| TTS (P1, dormant) | `VoiceProvider` (core/src/speech.ts) | managed adapter (later) | `fakes/FakeVoiceProvider` | `VOICE_PROVIDER=fake` |

### 3.1 ChatModel (already fixed by PRD 3.4; restated for the Fake contract)

```ts
// packages/core/src/model.ts
export type ChatRole = 'user' | 'assistant';
export interface ChatMessage { role: ChatRole; content: string }
export interface TokenUsage { tokensIn: number; tokensOut: number; cachedIn: number }
export interface ChatModel {
  complete(req: {
    system: string;                 // cacheable prefix
    messages: ChatMessage[];
    maxTokens: number;
    json?: z.ZodTypeAny;            // when set, response parsed + validated
    tag: 'character' | 'feedback';  // per-touchpoint cost metering
  }): Promise<{ text: string; json?: unknown; usage: TokenUsage }>;
}
```

`AnthropicChatModel` (apps/server/src/model/AnthropicChatModel.ts): model
`claude-haiku-4-5`, `cache_control: {type:'ephemeral'}` on the system block, temperature
0.7 for tag `character` and 0.2 for `feedback`, one JSON-parse retry, then throws
`ModelParseError` (the caller applies the PRD fallback: neutral reply, delta 0, or
template feedback). Writes nothing itself; the caller writes `model_usage`.

### 3.2 FakeChatModel: the scripted transcripts

```ts
// packages/core/src/fakes/FakeChatModel.ts
export interface FakeScript {
  id: string;
  match: string;      // exact first user message that selects this script
  turns: { reply: string; warmth_delta: -1 | 0 | 1; reason_code: ReasonCode }[];
  feedback: FeedbackOut;   // returned verbatim on every tag:'feedback' call
}
export class FakeChatModel implements ChatModel {
  constructor(private scripts: FakeScript[] = BUILT_IN_SCRIPTS) {}
}
```

Behavior (stateless, fully deterministic, zero I/O):
- Script selection: find the script whose `match` equals the FIRST user-role message in
  `req.messages` (whitespace-trimmed). No match: the `flat` default script (every turn
  `{reply: "Mm. Yeah.", warmth_delta: 0, reason_code: "neutral"}`, feedback = a minimal
  valid object quoting the user's first message).
- `tag:'character'`: turn index = count of user-role messages minus 1; return
  `turns[min(index, turns.length - 1)]` serialized as the strict JSON the real model
  would emit, plus `usage = {tokensIn: 800, tokensOut: 60, cachedIn: 600}` (fixed, so
  cost metering and the circuit breaker are testable with exact numbers).
- `tag:'feedback'`: return the script's `feedback` object, `usage = {tokensIn: 2500,
  tokensOut: 600, cachedIn: 0}`. It returns the SAME feedback on the retry call too,
  which is what makes the fabricated-quote script deterministically exercise the
  template-feedback fallback (SD-7 allows exactly one regeneration).

Three built-in scripts ship in `fakes/scripts.ts`, and the same message text lives in
`fixtures/good-run.json` and `fixtures/bad-run.json` so the validator fixtures and the
FakeChatModel replay the identical conversations.

Sam's opener (from the unit, not the script): "Hey. Nice place, right? I think I'm
mostly here for the snacks."

**Script `good-sam`: warms Sam 0 to 3, passes, deterministic score 100.**

| # | User message | Scripted `{warmth_delta, reason_code}` | Scripted reply (delivered at post-delta warmth) |
|---|---|---|---|
| U1 | Ha, the snacks might be the best part. How do you know Jess? | +1, open_question | College roommates, actually. We survived a very bad apartment together. |
| U2 | Roommates! I lived with three random strangers my first year and barely survived it. What was she like back in college? | +1, followup | Chaotic, in a fun way. I actually just got back myself, I was away most of the year, sort of an unusual gig. |
| U3 | Back from where? What kind of gig keeps someone away most of the year? | +1, followup | Crewing a sailboat across the Pacific, five months of it. One night near the Marquesas the whole ocean glowed green, I still think about it. What's the boldest thing you've done this year? |
| U4 | Honestly, my last real adventure was a rainy solo bike ride upstate, and it kind of rewired me. | +1 (clamped at 3), reciprocity | Rain has a way of making a small ride feel epic. I respect that. |
| U5 | Which part of the Pacific scared you the most? | +1 (clamped), followup | The squalls, at first. By month three it was the quiet that got to me, in a good way. |
| U6 | I get nervous just merging onto the highway, honestly. That kind of nerve is beyond me. | +1 (clamped), reciprocity | Ha, fair. Everyone has their ocean, mine just happened to be literal. |
| U7 | My friends will not believe this conversation, for the record. | 0, neutral | You're good company. That's rarer than you'd think. |
| U8 | Okay, deal. Same drinks table at the next party? | 0, neutral | Deal. Next time I'll bring the story and you bring the bike. |

Session then ends by explicit `POST /end` (natural close, SD-3).

Known-answer validator output for `good-run.json` (asserted exactly in tests):
`open_questions = 4` (U1 how, U2 what, U3 what, U5 which part; U8 is a question but not
open), `followups = 4` (U1 echoes "snacks" from the opener, U2 echoes
"roommates"/"college", U3 echoes "gig"/"year", U5 back-references "Pacific" with "you"),
`reciprocity = 3` (U4, U6, U7: self-disclosures after S2, the first character turn at
warmth 2), `spotlight_share = 5/8 = 0.625` (U1, U2, U3, U5, U8 are about Sam),
`interview_mode = false` (the U1-U3 question run contains U2's self-disclosure
sentence), `monologue_brag = false`, `final_warmth = 3`, warmth trace
`[1,2,3,3,3,3,3,3]`.
Score: `40 + 8*min(4,3) + 10*min(4,2) + 10*min(3,1) + 10 + 5*3 = 119 -> clamp 100`.
Pass: all four hard bands hold. PASS.

Scripted `good-sam` feedback JSON (every quote is an exact substring of the correct
speaker, so the evidence check passes):

```json
{
  "win": { "text": "You built on Sam's answers instead of resetting. The follow-up about the gig is what unlocked the whole story.",
           "quote": "Back from where? What kind of gig keeps someone away most of the year?" },
  "fix": { "text": "Land one follow-up on the emotional part of an answer, not just the facts. When Sam mentioned the quiet getting to them, ask about that.",
           "anchor": "4 of your 5 questions targeted facts" },
  "moment": { "text": "Sam warmed the moment you made the conversation about Sam. You became more interesting by making Sam feel interesting.",
              "quote": "What was she like back in college?" },
  "labels": []
}
```

**Script `bad-sam`: Sam stays flat, fails, deterministic score 10.**

| # | User message | Scripted `{warmth_delta, reason_code}` | Scripted reply |
|---|---|---|---|
| U1 | Hey. Yeah, it's fine. I just got a big promotion, so honestly everything is coming up me lately. | -1 (clamped at 0), brag | Oh. Congrats. |
| U2 | Do you like the apartment? | 0, neutral | It's nice, yeah. |
| U3 | I have been to about forty housewarmings this year because I am basically the social one in every group, people say I should honestly charge for showing up, I bring the playlists, I bring the stories, I did a half marathon last month, I closed the biggest deal at work last quarter, and frankly these snacks are below my usual standard. | -1 (clamped), monologue | Right. That's a lot. |
| U4 | Are you having fun? | 0, neutral | Sure. |
| U5 | Did you try the dip? | 0, neutral | Not yet. |
| U6 | Have you met the neighbors? | 0, neutral | A couple of them. |
| U7 | Well, I am probably the most interesting person here anyway, no offense. | -1 (clamped), brag | Hm. I might go find Jess. |

Session ends by `POST /end`.

Known-answer validator output for `bad-run.json`: `open_questions = 0` (U2/U4/U5/U6 all
begin with closed starters), `followups = 0`, `reciprocity = 0` (warmth never reaches
2), `spotlight_share = 4/7 = 0.571` (the four questions), `interview_mode = true`
(U4-U6: three consecutive questions, zero self-disclosure), `monologue_brag = true`
(U3 is 61 words), `final_warmth = 0`, warmth trace `[0,0,0,0,0,0,0]`.
Score: `40 + 0 + 0 + 0 + 10 + 0 - 20 - 20 = 10`.
Pass: four hard bands broken. FAIL.

Scripted `bad-sam` feedback JSON (valid quotes, including a brag label whose quote is
exactly U7, exercising the model-flag-with-evidence path of `monologue_brag`):

```json
{
  "win": { "text": "You did check in on them directly at least once.",
           "quote": "Are you having fun?" },
  "fix": { "text": "Ask one open question about Sam's world and then follow up on the answer. None of your questions could be answered with more than a yes or no.",
           "anchor": "0 open questions in 7 messages" },
  "moment": { "text": "Sam went flat immediately and stayed there: the opener was about you, not the person in front of you.",
              "quote": "I just got a big promotion, so honestly everything is coming up me lately." },
  "labels": [ { "label": "brag", "quote": "Well, I am probably the most interesting person here anyway, no offense." } ]
}
```

**Script `fabricated-quote`: same turns as `bad-sam` (different `match` first message:
"Hello. Long day, huh? I just got a big promotion." with turn 1 scripted -1/brag), but
its feedback `win.quote` is "You asked Sam some really thoughtful questions tonight",
which appears nowhere in the transcript.** The evidence check rejects the feedback, the
pipeline regenerates once, receives the identical fabricated object, and falls back to
template feedback assembled from the validator's own signals. The integration test
asserts the user still receives a complete result card and that the score is unchanged
(the score never depended on the model).

### 3.3 AuthVerifier

```ts
// apps/server/src/auth/AuthVerifier.ts
export interface AuthVerifier {
  verify(headers: Record<string, string | string[] | undefined>):
    Promise<{ clerkId: string } | null>;   // null -> 401
}
```

- `FakeAuthVerifier` (`AUTH_PROVIDER=fake`): reads header `x-test-user`. Present:
  returns `{clerkId: "test_" + value}`. Absent: null. The auth plugin then upserts the
  `users` row exactly as in production, so every downstream path (streaks, caps,
  deletion) is identical under test. Refuses to load when `NODE_ENV=production` AND
  `AUTH_PROVIDER=fake` (the server crashes at boot: fail closed).
- `ClerkAuthVerifier` (`AUTH_PROVIDER=clerk`): verifies the `Authorization: Bearer`
  Clerk JWT with `@clerk/backend` using `CLERK_SECRET_KEY`. Built and unit-tested with
  an injected stub verifier in Phase 0; verified live only after G-02.
- Clerk webhooks: with `AUTH_PROVIDER=fake` (or empty `CLERK_WEBHOOK_SECRET`),
  `/v1/webhooks/clerk` accepts unsigned JSON bodies (test mode); with real config it
  requires a valid svix signature.

### 3.4 BillingWebhookVerifier (interface now, live in Phase 2)

```ts
// apps/server/src/billing/BillingWebhookVerifier.ts
export interface PaddleEvent { event_id: string; event_type: string; data: unknown }
export interface BillingWebhookVerifier {
  verifyAndParse(rawBody: Buffer, signatureHeader: string | undefined): PaddleEvent | null;
}
```

- `FakeBillingWebhookVerifier` (`BILLING_PROVIDER=fake`): accepts exactly
  `paddle-signature: test-signature`, parses the body as `PaddleEvent`. Anything else:
  null (400). The webhook-replay fixtures in `apps/server/test/fixtures/paddle/` are
  complete Paddle Billing payloads for `subscription.created`, `subscription.updated`
  (incl `past_due`), `subscription.canceled`, and `transaction.completed`, each with a
  distinct `event_id` plus one duplicate pair to prove idempotency via `paddle_events`.
- `PaddleWebhookVerifier` (`BILLING_PROVIDER=paddle`): real HMAC-SHA256 verification
  against `PADDLE_WEBHOOK_SECRET` per Paddle's signature scheme. Phase 2.

### 3.5 ErrorTracker, ReceiptValidator, Speech/Voice

- `ErrorTracker { captureException(e, ctx): void; flush(): Promise<void> }`.
  `NoopErrorTracker` whenever `SENTRY_DSN` is empty (the agent default).
  `SentryTracker` scrubs request bodies in `beforeSend` (PRD 3.8).
- `ReceiptValidator { validate(platform: 'apple'|'google', receipt: string):
  Promise<{valid: boolean; expiresAt?: Date; productId?: string; reason?: string}> }`.
  Only `FakeReceiptValidator` exists in v1 (always invalid); the interface is the PRD
  3.9 step-5 seam. No real implementation is built until a store forces IAP (G-15).
- `SpeechProvider` / `VoiceProvider` (Phase 1, PRD 8.1 verbatim): `FakeSpeechProvider`
  yields `{final: "How do you know Jess?"}` for any audio (so the voice endpoint can be
  integration-tested end to end: audio in, ChatModel turn, audio out);
  `FakeVoiceProvider` yields three constant `Uint8Array` chunks of a valid 16-bit PCM
  WAV of silence. Both selected by env, both dormant behind `VOICE_ENABLED=false`.

### 3.6 What "offline green" means (the boundary's acceptance test)

With `.env` copied from `.env.example` untouched (all mock defaults), no network access
beyond localhost, and only Docker Postgres running, ALL of the following pass:
`pnpm -r typecheck`, `pnpm --filter @charisma/core test`,
`pnpm --filter @charisma/content validate`, `pnpm --filter @charisma/server test`,
`pnpm --filter @charisma/server test:integration`, `pnpm e2e:smoke`,
`pnpm --filter @charisma/mobile test`. This exact list is the CI job and the definition
of a green tree everywhere in Section 5.

---

## 4. Exact contracts

### 4.1 API surface: Zod request/response schemas

All schemas live in `packages/core/src/schemas.ts` and are imported by both the server
routes and the mobile api client. Auth: Clerk JWT (or `x-test-user` under Fake auth) on
everything except `/v1/webhooks/*` and `/healthz`. Errors share one envelope:
`ErrorRes = z.object({ code: z.string(), message: z.string() })` with codes noted below.

```ts
import { z } from 'zod';

// ---- shared atoms ----
export const ReasonCode = z.enum(['open_question','followup','reciprocity',
  'monologue','brag','ignored_content','neutral']);
export const CharacterTurnOut = z.object({          // model touchpoint 1 (PRD 3.3)
  reply: z.string().min(1).max(600),
  warmth_delta: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
  reason_code: ReasonCode,
});
export const FeedbackOut = z.object({               // model touchpoint 2 (PRD 3.5)
  win:    z.object({ text: z.string(), quote: z.string() }),
  fix:    z.object({ text: z.string(), anchor: z.string() }),
  moment: z.object({ text: z.string(), quote: z.string() }),
  labels: z.array(z.object({ label: z.enum(['brag']), quote: z.string() })).default([]),
});
export const Signals = z.object({
  open_questions: z.number().int().min(0),
  followups: z.number().int().min(0),
  reciprocity: z.number().int().min(0),
  spotlight_share: z.number().min(0).max(1),
  interview_mode: z.boolean(),
  monologue_brag: z.boolean(),
  final_warmth: z.number().int().min(0).max(3),
});
export const UserState = z.enum(['ACTIVE','REVIEW_DUE','SESSION_OPEN','CAPPED']);
export const ChatLine = z.object({ role: z.enum(['user','character']), text: z.string() });

// ---- GET /v1/me -> 200 MeRes ----
export const MeRes = z.object({
  state: UserState,
  streak: z.object({ current: z.number().int(), last_scored_date: z.string().nullable() }), // YYYY-MM-DD in user tz
  entitlement: z.object({ active: z.boolean(), plan: z.string().nullable() }),
  caps: z.object({
    scored_used: z.number().int(), scored_limit: z.number().int(),
    incognito_used: z.number().int(), incognito_limit: z.number().int() }),
  score: z.number().int().nullable(),          // most recent scored session, null if none
  open_session_id: z.string().uuid().nullable(),
});

// ---- GET /v1/challenge/today -> 200 TodayRes ----  (client-safe slice ONLY, INV-7)
export const TodayRes = z.object({
  scenario: z.object({
    title: z.string(), setup_text: z.string(),
    character_name: z.string(), message_budget: z.number().int() }),
  review: z.boolean(),                          // true when serving a due review (P1)
});

// ---- POST /v1/sessions  {} -> 201 SessionCreatedRes ----
// 409 code CAPPED (daily cap or breaker) | 409 code SESSION_OPEN (returns open_session_id in message)
export const SessionCreatedRes = z.object({
  session_id: z.string().uuid(),
  opener: z.string(),                           // persona.opener, the character speaks first
  remaining: z.number().int(),                  // = message_budget
});

// ---- GET /v1/sessions/:id -> 200 SessionRes ----  (SD-1; owner only, else 404)
export const SessionRes = z.object({
  state: z.enum(['open','scoring','scored','abandoned']),
  messages: z.array(ChatLine),                  // includes opener; warmth NEVER present
  remaining: z.number().int(),
});

// ---- POST /v1/sessions/:id/messages ----
// 409 code SESSION_NOT_OPEN | 429 code RATE_LIMITED (>1 msg per 2s) | 400 on body
export const SendMessageReq = z.object({ text: z.string().trim().min(1).max(500) });
export const SendMessageRes = z.object({ reply: z.string(), remaining: z.number().int() });

// ---- POST /v1/sessions/:id/end  {} -> 202 {status:'scoring'} ----  (idempotent; 404 unknown)
export const EndRes = z.object({ status: z.literal('scoring') });

// ---- GET /v1/sessions/:id/result -> 200 ResultRes | 202 {status:'scoring'} ----  (SD-2)
export const ResultRes = z.object({
  win: FeedbackOut.shape.win, fix: FeedbackOut.shape.fix, moment: FeedbackOut.shape.moment,
  score: z.number().int().min(0).max(100),
  passed: z.boolean(),
  signals: Signals,
});

// ---- GET /v1/me/history -> 200 HistoryRes ----  (P2; free tier -> 403 code PAID_ONLY)
export const HistoryRes = z.object({ sessions: z.array(z.object({
  date: z.string(), score: z.number().int(), unit_title: z.string() })) });

// ---- DELETE /v1/me/data -> 204 (no body) ----  one transaction, real deletes (SD-8)

// ---- POST /v1/webhooks/paddle -> 200 {received:true} | 400 bad signature ----
export const PaddleWebhookRes = z.object({ received: z.literal(true) });

// ---- POST /v1/webhooks/clerk -> 200 {received:true} ----
export const ClerkWebhookReq = z.object({          // svix-verified body (see 3.3)
  type: z.enum(['user.created','user.deleted']),
  data: z.object({ id: z.string() }).passthrough(),
});

// ---- GET /healthz -> 200 {ok:true, db:'up'} | 503 {ok:false, db:'down'} ----
export const HealthRes = z.object({ ok: z.boolean(), db: z.enum(['up','down']) });

// ---- POST /v1/sessions/:id/voice-message ----  (P1, dormant; 404 while VOICE_ENABLED=false)
// multipart: field "audio" (wav/m4a <= 2 MB). Response mirrors SendMessageRes plus audio.
export const VoiceMessageRes = z.object({
  transcript: z.string(),                        // what STT heard (user-visible)
  reply: z.string(), remaining: z.number().int(),
  audio_b64: z.string(),                         // TTS of the reply (base64 WAV)
});
```

Content-pack schemas (`SkillPack`, `Skill`, `Unit`, `SignalDef` with SD-4's optional
`cap`/`band`, `RubricLine`) are transcribed 1:1 from PRD 4.2 and 4.3 into the same
schemas.ts; the Sam unit JSON in PRD 6.2 is the golden fixture that must round-trip.

### 4.2 Drizzle schema (apps/server/src/db/schema.ts, complete)

```ts
import { pgTable, pgEnum, uuid, text, integer, bigint, boolean, jsonb,
  timestamp, date, bigserial, primaryKey, uniqueIndex, index } from 'drizzle-orm/pg-core';

export const entitlementSource = pgEnum('entitlement_source', ['paddle','apple','google','promo']);
export const entitlementStatus = pgEnum('entitlement_status', ['active','past_due','canceled']);
export const sessionState     = pgEnum('session_state', ['open','scoring','scored','abandoned']);

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  tz: text('tz').notNull().default('UTC'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const entitlements = pgTable('entitlements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  source: entitlementSource('source').notNull(),
  product: text('product').notNull(),
  status: entitlementStatus('status').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
  externalRef: text('external_ref'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('entitlements_user_idx').on(t.userId)]);

export const paddleEvents = pgTable('paddle_events', {
  eventId: text('event_id').primaryKey(),
  payload: jsonb('payload').notNull(),
  processedAt: timestamp('processed_at', { withTimezone: true }).notNull().defaultNow(),
});

export const skillPacks = pgTable('skill_packs', {
  packId: text('pack_id').primaryKey(),
  version: text('version').notNull(),
  loadedAt: timestamp('loaded_at', { withTimezone: true }).notNull().defaultNow(),
});

export const skills = pgTable('skills', {
  id: text('id').primaryKey(),
  packId: text('pack_id').notNull().references(() => skillPacks.packId),
  name: text('name').notNull(),
  objective: text('objective').notNull(),
  prerequisites: text('prerequisites').array().notNull().default([]),
});

export const units = pgTable('units', {
  id: text('id').primaryKey(),
  skillId: text('skill_id').notNull().references(() => skills.id),
  spec: jsonb('spec').notNull(),                 // full Unit (PRD 4.2), Zod-validated at load
});

export const progressEvents = pgTable('progress_events', {   // append-only (SD-8)
  seq: bigserial('seq', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id').notNull(),
  type: text('type').notNull(),                  // PRD 4.7 event names, CHECK-constrained in SQL
  payload: jsonb('payload').notNull().default({}),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('progress_events_user_idx').on(t.userId, t.seq)]);

export const userSkillState = pgTable('user_skill_state', {  // fold over progress_events, rebuildable
  userId: uuid('user_id').notNull(),
  skillId: text('skill_id').notNull(),
  status: text('status').notNull().default('locked'),        // locked|unlocked|in_progress|mastered
  passes: integer('passes').notNull().default(0),
  lastPassDate: date('last_pass_date'),                      // user-tz date, for distinct_days
  reviewBox: integer('review_box'),                          // 1..3 -> 2/7/21 days (P1)
  reviewDueAt: timestamp('review_due_at', { withTimezone: true }),
}, t => [primaryKey({ columns: [t.userId, t.skillId] })]);

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  unitId: text('unit_id').notNull().references(() => units.id),
  state: sessionState('state').notNull().default('open'),
  warmth: integer('warmth').notNull().default(0),            // current server-held warmth
  warmthTrace: jsonb('warmth_trace').notNull().default([]),  // int[] appended per turn
  characterCalls: integer('character_calls').notNull().default(0),  // 12-call cap (PRD 3.10)
  feedbackCalls: integer('feedback_calls').notNull().default(0),    // 2-call cap (SD-7)
  incognito: boolean('incognito').notNull().default(false),  // always false until P3
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  endedAt: timestamp('ended_at', { withTimezone: true }),
}, t => [uniqueIndex('sessions_one_open_per_user').on(t.userId).where(sql`state = 'open'`)]);

export const transcripts = pgTable('transcripts', {
  sessionId: uuid('session_id').primaryKey().references(() => sessions.id, { onDelete: 'cascade' }),
  messages: jsonb('messages').notNull().default([]),         // ChatLine[] incl opener
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),  // created + 60d (PRD 3.8)
});

export const results = pgTable('results', {
  sessionId: uuid('session_id').primaryKey().references(() => sessions.id, { onDelete: 'cascade' }),
  win: jsonb('win').notNull(), fix: jsonb('fix').notNull(), moment: jsonb('moment').notNull(),
  score: integer('score').notNull(),
  passed: boolean('passed').notNull(),
  signals: jsonb('signals').notNull(),
  templateFallback: boolean('template_fallback').notNull().default(false),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const dailyUsage = pgTable('daily_usage', {
  userId: uuid('user_id').notNull(),
  day: date('day').notNull(),                                // user-tz local date
  scoredCount: integer('scored_count').notNull().default(0),
  incognitoCount: integer('incognito_count').notNull().default(0),
}, t => [primaryKey({ columns: [t.userId, t.day] })]);

export const modelUsage = pgTable('model_usage', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  sessionId: uuid('session_id'),
  tag: text('tag').notNull(),                                // character | feedback
  tokensIn: integer('tokens_in').notNull(),
  tokensOut: integer('tokens_out').notNull(),
  cachedIn: integer('cached_in').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, t => [index('model_usage_day_idx').on(t.createdAt)]);

export const analyticsEvents = pgTable('analytics_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: uuid('user_id'),                                   // nullable: pre-auth events
  name: text('name').notNull(),                              // closed allowlist, CHECK in SQL
  props: jsonb('props').notNull().default({}),               // closed Zod schema per name, no free text
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const evalTranscripts = pgTable('eval_transcripts', { // SD-9, anonymized
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  messages: jsonb('messages').notNull(),
  warmthTrace: jsonb('warmth_trace').notNull(),
  signals: jsonb('signals').notNull(),
  score: integer('score').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});
```

### 4.3 Initial migration (apps/server/src/db/migrations/0000_init.sql)

```sql
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE entitlement_source AS ENUM ('paddle','apple','google','promo');
CREATE TYPE entitlement_status AS ENUM ('active','past_due','canceled');
CREATE TYPE session_state      AS ENUM ('open','scoring','scored','abandoned');

CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_id text NOT NULL UNIQUE,
  tz text NOT NULL DEFAULT 'UTC',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source entitlement_source NOT NULL,
  product text NOT NULL,
  status entitlement_status NOT NULL,
  expires_at timestamptz,
  external_ref text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX entitlements_user_idx ON entitlements(user_id);

CREATE TABLE paddle_events (
  event_id text PRIMARY KEY,
  payload jsonb NOT NULL,
  processed_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE skill_packs (
  pack_id text PRIMARY KEY,
  version text NOT NULL,
  loaded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE skills (
  id text PRIMARY KEY,
  pack_id text NOT NULL REFERENCES skill_packs(pack_id),
  name text NOT NULL,
  objective text NOT NULL,
  prerequisites text[] NOT NULL DEFAULT '{}'
);

CREATE TABLE units (
  id text PRIMARY KEY,
  skill_id text NOT NULL REFERENCES skills(id),
  spec jsonb NOT NULL
);

CREATE TABLE progress_events (
  seq bigserial PRIMARY KEY,
  user_id uuid NOT NULL,
  type text NOT NULL CHECK (type IN ('session_started','message_exchanged',
    'attempt_submitted','unit_passed','unit_failed','skill_mastered',
    'review_scheduled','review_passed','review_failed','placement_set',
    'streak_updated','entitlement_changed')),
  payload jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX progress_events_user_idx ON progress_events(user_id, seq);

CREATE TABLE user_skill_state (
  user_id uuid NOT NULL,
  skill_id text NOT NULL,
  status text NOT NULL DEFAULT 'locked',
  passes integer NOT NULL DEFAULT 0,
  last_pass_date date,
  review_box integer,
  review_due_at timestamptz,
  PRIMARY KEY (user_id, skill_id)
);

CREATE TABLE sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  unit_id text NOT NULL REFERENCES units(id),
  state session_state NOT NULL DEFAULT 'open',
  warmth integer NOT NULL DEFAULT 0 CHECK (warmth BETWEEN 0 AND 3),
  warmth_trace jsonb NOT NULL DEFAULT '[]',
  character_calls integer NOT NULL DEFAULT 0,
  feedback_calls integer NOT NULL DEFAULT 0,
  incognito boolean NOT NULL DEFAULT false,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);
CREATE UNIQUE INDEX sessions_one_open_per_user ON sessions(user_id) WHERE state = 'open';

CREATE TABLE transcripts (
  session_id uuid PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  messages jsonb NOT NULL DEFAULT '[]',
  expires_at timestamptz NOT NULL
);
CREATE INDEX transcripts_expiry_idx ON transcripts(expires_at);

CREATE TABLE results (
  session_id uuid PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  win jsonb NOT NULL, fix jsonb NOT NULL, moment jsonb NOT NULL,
  score integer NOT NULL CHECK (score BETWEEN 0 AND 100),
  passed boolean NOT NULL,
  signals jsonb NOT NULL,
  template_fallback boolean NOT NULL DEFAULT false,
  expires_at timestamptz NOT NULL
);
CREATE INDEX results_expiry_idx ON results(expires_at);

CREATE TABLE daily_usage (
  user_id uuid NOT NULL,
  day date NOT NULL,
  scored_count integer NOT NULL DEFAULT 0,
  incognito_count integer NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
);

CREATE TABLE model_usage (
  id bigserial PRIMARY KEY,
  session_id uuid,
  tag text NOT NULL,
  tokens_in integer NOT NULL,
  tokens_out integer NOT NULL,
  cached_in integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX model_usage_day_idx ON model_usage(created_at);

CREATE TABLE analytics_events (
  id bigserial PRIMARY KEY,
  user_id uuid,
  name text NOT NULL CHECK (name IN ('signup','challenge_viewed','session_started',
    'session_completed','result_viewed','share_tapped','d1_return','streak_broken',
    'paywall_viewed','subscribe_started','subscribe_completed')),
  props jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE eval_transcripts (
  id bigserial PRIMARY KEY,
  messages jsonb NOT NULL,
  warmth_trace jsonb NOT NULL,
  signals jsonb NOT NULL,
  score integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- SD-8: least-privilege app role; append-only progress_events; deletion via definer fn
CREATE ROLE charisma_app LOGIN PASSWORD 'charisma_app';
GRANT CONNECT ON DATABASE charisma TO charisma_app;
GRANT USAGE ON SCHEMA public TO charisma_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO charisma_app;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO charisma_app;
REVOKE UPDATE, DELETE ON progress_events FROM charisma_app;

CREATE FUNCTION delete_user_data(p_user_id uuid) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  DELETE FROM results  WHERE session_id IN (SELECT id FROM sessions WHERE user_id = p_user_id);
  DELETE FROM transcripts WHERE session_id IN (SELECT id FROM sessions WHERE user_id = p_user_id);
  DELETE FROM sessions WHERE user_id = p_user_id;
  DELETE FROM progress_events WHERE user_id = p_user_id;
  DELETE FROM analytics_events WHERE user_id = p_user_id;
  DELETE FROM daily_usage WHERE user_id = p_user_id;
  DELETE FROM user_skill_state WHERE user_id = p_user_id;
  DELETE FROM entitlements WHERE user_id = p_user_id;
  DELETE FROM users WHERE id = p_user_id;
END $$;
GRANT EXECUTE ON FUNCTION delete_user_data(uuid) TO charisma_app;
```

The api service connects as `charisma_app`; migrations run as the `charisma` owner.
`db:check` asserts drizzle-kit reports zero drift between schema.ts and migrations.

### 4.4 Env-var manifest (.env.example ships exactly this)

| Name | Purpose | Mock default (agents) | Real value (human gate) |
|---|---|---|---|
| NODE_ENV | environment | development | production (G-04) |
| PORT | api port | 3000 | 3000 |
| DATABASE_URL | api connection (app role) | postgres://charisma_app:charisma_app@localhost:5433/charisma | VPS-internal DSN (G-04) |
| DATABASE_URL_OWNER | migrations | postgres://charisma:charisma@localhost:5433/charisma | VPS-internal DSN (G-04) |
| MODEL_PROVIDER | fake / anthropic | fake | anthropic (G-01) |
| ANTHROPIC_API_KEY | Anthropic key, zero-retention org | (empty) | sk-ant-... (G-01) |
| DAILY_MODEL_BUDGET_USD | circuit breaker cap | 50 | 50, human-tuned |
| AUTH_PROVIDER | fake / clerk | fake | clerk (G-02) |
| CLERK_SECRET_KEY | server JWT verification | (empty) | sk_live_... (G-02) |
| CLERK_WEBHOOK_SECRET | svix signature | (empty = unsigned test mode) | whsec_... (G-02) |
| BILLING_PROVIDER | fake / paddle | fake | paddle (G-03, P2) |
| PADDLE_API_KEY | Paddle API | (empty) | (G-03, P2) |
| PADDLE_WEBHOOK_SECRET | webhook HMAC | (empty) | (G-03, P2) |
| SENTRY_DSN | error tracking; empty = noop | (empty) | DSN (G-08) |
| RECEIPT_VALIDATOR | fake only in v1 | fake | n/a until store forces IAP (G-15) |
| VOICE_ENABLED | voice seam master switch | false | false until voice launch |
| SPEECH_PROVIDER | fake / managed adapter (P1 seam) | fake | deferred |
| VOICE_PROVIDER | fake / managed adapter (P1 seam) | fake | deferred |
| TRANSCRIPT_TTL_DAYS | retention window | 60 | 60 |
| FREE_SCORED_PER_DAY | free cap | 1 | 1 |
| PAID_SCORED_PER_DAY | paid cap | 10 | 10 |
| EXPO_PUBLIC_API_URL | mobile -> api base url | http://localhost:3000 | https://api.DOMAIN (G-05) |
| EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY | mobile Clerk | (empty = dev fake-auth mode) | pk_live_... (G-02) |
| EXPO_PUBLIC_DEV_FAKE_AUTH | mobile sends x-test-user | true | absent in prod builds |
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | web Clerk (P2) | (empty) | pk_live_... (G-02) |
| NEXT_PUBLIC_PADDLE_CLIENT_TOKEN | web checkout overlay (P2) | (empty) | (G-03) |

`env.ts` Zod-parses this manifest, applies the mock defaults, and enforces the fail-
closed rules: `NODE_ENV=production` requires `AUTH_PROVIDER=clerk`,
`MODEL_PROVIDER=anthropic`, and a non-empty `DATABASE_URL`; violation crashes at boot.

### 4.5 Character system prompt template (verbatim; prompts.ts renders it)

Static, cacheable system prefix (all placeholders come from the unit's persona; this is
the `system` argument, identical every turn of a session, so Anthropic prompt caching
holds):

```
You are {character_name}, a real-feeling person in a text conversation. This is a
social roleplay. Stay in character in every reply. You are never a coach, never an
assistant, and you never mention AI, warmth, rules, points, or scores.

WHO YOU ARE
{persona.brief}

WHAT YOU ARE HOLDING BACK
{persona.hidden_depth}
Reveal it only in layers, only as the warmth behavior below permits. Never lead with it.

HOW WARMTH WORKS (internal, never mention it)
Warmth is an integer from 0 to 3 held by the server. Each turn you are told the current
warmth. You must behave exactly per the matching line:
0: {behavior_by_warmth.0}
1: {behavior_by_warmth.1}
2: {behavior_by_warmth.2}
3: {behavior_by_warmth.3}

JUDGING THE USER'S LATEST MESSAGE
Raise warmth (+1) only if it does one of these: {warmth_rules.increments, semicolon-joined}
Lower warmth (-1) if it does one of these: {warmth_rules.decrements, semicolon-joined}
It does NOTHING (0) if it is only: {warmth_rules.neutral, semicolon-joined}

OUTPUT FORMAT (strict)
Reply with ONLY a JSON object, no prose before or after it:
{"reply": "<your in-character reply, 1 to 2 sentences, under 60 words>",
 "warmth_delta": -1 | 0 | 1,
 "reason_code": "open_question" | "followup" | "reciprocity" | "monologue" | "brag" | "ignored_content" | "neutral"}
reason_code states why you chose the delta. If warmth_delta is 0 use "neutral" or
"ignored_content".
```

Per-turn dynamic injection (keeps the cached prefix byte-identical): the transcript maps
to `messages` with character turns as `assistant` (reply text only, never their JSON)
and user turns as `user`; the FINAL user message is the new text plus a state suffix:

```
{user text}

[state: warmth={current_warmth}. Behave per warmth line {current_warmth}. Judge the
message above and output the strict JSON only.]
```

The suffix is stripped before the transcript is stored; it exists only in the model
request. Feedback calls use `system = unit.feedback_prompt` and one user message: the
transcript rendered as alternating `USER: ...` / `CHARACTER ({name}): ...` lines, which
is also the exact rendering the validator's evidence check quotes against.

### 4.6 Validator precision rules (pins the two heuristics PRD 4.5 leaves open)

- Closed/open starter matching is sentence-start anchored, case-insensitive, after
  stripping leading interjections ("ha,", "wow,", "okay,", "well,"). A message is an
  open question when at least one sentence ends in `?` and begins with an open starter,
  and no `?`-sentence begins with a closed starter.
- `is_followup` is true when any of: (a) the message shares at least one content word
  (>= 4 chars, stopword-filtered, Porter-stemmed) with the immediately previous
  character message; (b) it contains an explicit back-reference marker ("you said",
  "you mentioned", "earlier you"); (c) it is addressed to the character (contains
  "you" or "your") and shares a content word with ANY prior character message in the
  session. The good-run fixture exercises (a) via U2 and (c) via U5.

---

## 5. Task DAG

One task = one agent, one session, one PR. Format per task: id, deps, marking, files,
goal, and the machine-checkable acceptance command (must exit 0). The Phase 0 critical
path (P0-01 through P0-25) is entirely AUTONOMOUS: a fleet with zero credentials takes
the repo from empty to a green, offline, self-verifying core server.

### Phase 0: thin vertical slice (exhaustive)

**P0-01. Monorepo scaffold.** deps: none. AUTONOMOUS.
Files: root `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`, `.gitignore`,
`.env.example`, per-package `package.json` + empty `src/index.ts` + vitest configs.
Goal: pnpm workspace with five packages, strict TS, shared config, root scripts.
Accept: `pnpm install && pnpm -r typecheck`

**P0-02. Local infra.** deps: P0-01. AUTONOMOUS.
Files: `docker-compose.yml` (dev profile: postgres 16 on 5433, named volume, healthcheck),
`README.md` bootstrap section.
Goal: one command brings up the only stateful dependency.
Accept: `docker compose up -d postgres && docker compose exec -T postgres pg_isready -U charisma`

**P0-03. Core schemas.** deps: P0-01. AUTONOMOUS.
Files: `packages/core/src/schemas.ts`, `test/schemas.test.ts`.
Goal: every Zod schema in Section 4.1 plus the pack schemas (PRD 4.1-4.3, SD-4 fields);
PRD 6.2's Sam unit JSON must parse under `Unit`.
Accept: `pnpm --filter @charisma/core test`

**P0-04. Content pack: Sam unit + lists.** deps: P0-03. AUTONOMOUS.
Files: `packages/content/everyday/pack.json`, `skills.json`,
`units/followups.housewarming-sam.json` (PRD 6.2 verbatim), `lists/*.json`,
`src/validate.ts`, `test/content.test.ts`.
Goal: the everyday pack with only the followups skill line and the Sam unit; signal
defs carry the PRD 4.6 weights/caps/bands; starter and stopword lists ship as data.
Accept: `pnpm --filter @charisma/content validate && pnpm --filter @charisma/content test`

**P0-05. Validator classifiers.** deps: P0-04. AUTONOMOUS.
Files: `packages/core/src/validator.ts` (classifiers only),
`fixtures/classifier-cases.json`, `test/classifiers.test.ts`.
Goal: `is_question`, `is_open_question`, `is_followup`, `is_self_disclosure`,
`word_count` exactly per PRD 4.5 plus Section 4.6 precision rules; the known-answer
table covers every rule branch (interjection stripping, closed-starter override, each
followup clause, stem matching, the 6-word disclosure floor).
Accept: `pnpm --filter @charisma/core test`

**P0-06. Validator signals, evidence check, pass rule.** deps: P0-05. AUTONOMOUS.
Files: `validator.ts` (completed), `fixtures/good-run.json`, `fixtures/bad-run.json`,
`fixtures/mid-run.json`, `test/validator.test.ts`.
Goal: the seven recomputed signals, whitespace-normalized substring evidence check
against the correct speaker, feedback accept/reject verdict, band pass rule. Fixture
assertions are the exact known answers in Section 3.2 (good: 4/4/3/0.625/false/false/3;
bad: 0/0/0/0.571/true/true/0; mid: 2/1/0/0.5/false/false/1).
Accept: `pnpm --filter @charisma/core test`

**P0-07. Deterministic score.** deps: P0-06. AUTONOMOUS.
Files: `packages/core/src/score.ts`, `test/score.test.ts`.
Goal: PRD 4.6 formula reading weight/cap/band from the pack's SignalDefs (SD-4); known
answers good=100 (clamped from 119), bad=10, mid=81; property test: score is invariant
under re-run (pure function).
Accept: `pnpm --filter @charisma/core test`

**P0-08. ChatModel + FakeChatModel + scripts.** deps: P0-03. AUTONOMOUS.
Files: `packages/core/src/model.ts`, `fakes/FakeChatModel.ts`, `fakes/scripts.ts`,
`test/fake-chat-model.test.ts`.
Goal: the interface (Section 3.1) and the script-replaying Fake (Section 3.2) with
`good-sam`, `bad-sam`, `fabricated-quote`, and the flat default; tests cover script
selection by first user message, turn indexing, fixed usage numbers, feedback replay.
Accept: `pnpm --filter @charisma/core test`

**P0-09. Engine reducer.** deps: P0-03. AUTONOMOUS.
Files: `packages/core/src/engine.ts`, `test/engine.test.ts`.
Goal: pure state machine per PRD 3.2 (ACTIVE / SESSION_OPEN / CAPPED for Phase 0,
REVIEW_DUE stubbed), caps math from counts + entitlement, streak fold over
`streak_updated`-relevant events with tz-local dates, mastery counter with
`distinct_days`; zero I/O so every transition is table-testable.
Accept: `pnpm --filter @charisma/core test`

**P0-10. Prompt builder.** deps: P0-04. AUTONOMOUS.
Files: `packages/core/src/prompts.ts`, `test/prompts.test.ts`.
Goal: Section 4.5 templates: cacheable system prefix from a Unit, per-turn state
suffix, feedback transcript renderer (the same rendering the evidence check uses);
snapshot test against the Sam unit.
Accept: `pnpm --filter @charisma/core test`

**P0-11. Drizzle schema + migration.** deps: P0-02, P0-03. AUTONOMOUS.
Files: `apps/server/src/db/schema.ts`, `db/client.ts`, `db/migrate.ts`,
`db/migrations/0000_init.sql`, `drizzle.config.ts`.
Goal: Sections 4.2 and 4.3 exactly, including the `charisma_app` role, the append-only
revoke, and `delete_user_data()`.
Accept: `pnpm --filter @charisma/server db:migrate && pnpm --filter @charisma/server db:check`

**P0-12. Server skeleton + composition root.** deps: P0-08, P0-11. AUTONOMOUS.
Files: `apps/server/src/index.ts`, `env.ts`, `composition.ts`, `app.ts`,
`routes/health.ts`, `telemetry/*`, `fakes/NoopErrorTracker.ts`, `Dockerfile`.
Goal: Zod-parsed env (Section 4.4 incl fail-closed production rules), the ONE file
choosing Fake vs real per interface, Fastify app factory taking the composition root,
`/healthz` probing the db.
Accept: `pnpm --filter @charisma/server test` (unit: boots app with Fakes, healthz 200; env fail-closed cases crash)

**P0-13. Auth seam.** deps: P0-12. AUTONOMOUS.
Files: `auth/AuthVerifier.ts`, `auth/ClerkAuthVerifier.ts`, `auth/plugin.ts`,
`fakes/FakeAuthVerifier.ts`, unit tests.
Goal: Section 3.3 exactly: header-minted test users, users-row upsert, tz capture
(SD-6), production fail-closed, ClerkAuthVerifier unit-tested against a stubbed
`@clerk/backend` verifier.
Accept: `pnpm --filter @charisma/server test`

**P0-14. Content loader CLI.** deps: P0-04, P0-11. AUTONOMOUS.
Files: `scripts/content-load.ts`, root script `content:load`, integration test.
Goal: validate then upsert pack/skills/units into Postgres; idempotent re-run; version
bump replaces unit specs without touching progress.
Accept: `pnpm --filter @charisma/server test:integration -- content` (loads everyday pack into charisma_test, asserts rows)

**P0-15. /v1/me + /v1/challenge/today.** deps: P0-09, P0-13, P0-14. AUTONOMOUS.
Files: `routes/me.ts`, `routes/challenge.ts`, `services/router.ts`, `services/streak.ts`,
unit + integration tests.
Goal: MeRes and TodayRes per Section 4.1; Phase 0 router always serves the Sam unit;
client-safe slice only (a test asserts the persona/rubric never appear in any response
body); streak projection wired.
Accept: `pnpm --filter @charisma/server test:integration -- me`

**P0-16. Session create + recover.** deps: P0-15. AUTONOMOUS.
Files: `routes/sessions.ts` (create + get), integration tests.
Goal: `POST /v1/sessions` (opener from persona, transcript row seeded with the opener,
`session_started` + `session_started` analytics event, 409 SESSION_OPEN via the partial
unique index, 409 CAPPED via caps service), `GET /v1/sessions/:id` (SD-1, owner-only 404).
Accept: `pnpm --filter @charisma/server test:integration -- sessions-create`

**P0-17. Chat turn flow.** deps: P0-16, P0-10. AUTONOMOUS.
Files: `services/turn.ts`, `routes/sessions.ts` (messages), integration tests.
Goal: PRD 3.3 exactly: guards (500 chars, 1 msg per 2 s, budget, 12-call cap), prompt
build, `ChatModel.complete` with CharacterTurnOut, one parse retry then neutral
fallback, warmth clamp + trace append, `model_usage` row, `message_exchanged` event
(counts only), reply + remaining to client, warmth never in any response.
Accept: `pnpm --filter @charisma/server test:integration -- turn` (drives good-sam turns, asserts trace [1,2,3,...] and usage rows)

**P0-18. Scoring pipeline.** deps: P0-17, P0-06, P0-07. AUTONOMOUS.
Files: `services/scoring.ts`, `services/evalset.ts`, `routes/sessions.ts` (end), tests.
Goal: PRD 3.5 with SD-7's 2-call cap: on end (explicit or 10th message), state ->
`scoring`, ONE feedback call, validator recompute + evidence check, one regeneration,
template fallback, results row (expires_at + 60 d), events
`attempt_submitted` + `unit_passed|unit_failed` + `streak_updated`, mastery counter
(server-only), eval_transcripts writer (SD-9, rolling 200), state -> `scored`.
Accept: `pnpm --filter @charisma/server test:integration -- scoring` (good=100 pass, bad=10 fail, fabricated-quote lands template_fallback=true with unchanged score)

**P0-19. Result + streak surface.** deps: P0-18. AUTONOMOUS.
Files: `routes/sessions.ts` (result), streak assertions in integration tests.
Goal: SD-2 semantics (202 scoring, 200 ResultRes with signals), `result_viewed`
analytics event, streak increments once per local day and survives a second same-day
scored session without double-count.
Accept: `pnpm --filter @charisma/server test:integration -- result`

**P0-20. Caps + circuit breaker.** deps: P0-16. AUTONOMOUS.
Files: `services/caps.ts`, `jobs/scheduler.ts` (breaker), integration tests.
Goal: PRD 3.10: free = 1 scored/day (tz-local), `daily_usage` increments at session
start of a scored session, 409 CAPPED with next-open time; breaker sums today's
`model_usage` cost at Haiku pricing every 60 s and blocks NEW sessions past
`DAILY_MODEL_BUDGET_USD` while letting open ones finish (testable because
FakeChatModel's usage numbers are fixed; the test lowers the budget env to cross it
deterministically).
Accept: `pnpm --filter @charisma/server test:integration -- caps`

**P0-21. Retention + deletion + Clerk webhook.** deps: P0-18. AUTONOMOUS.
Files: `services/retention.ts`, `services/deletion.ts`, `routes/webhooks.ts` (clerk),
`jobs/scheduler.ts` (sweep), integration tests.
Goal: sweep hard-deletes expired transcripts/results and auto-ends stale open sessions
(SD-3); `DELETE /v1/me/data` calls `delete_user_data()` in one transaction and returns
204 (SD-8); Clerk `user.created` upserts users, `user.deleted` triggers the same hard
delete; unsigned bodies accepted only in fake/test mode.
Accept: `pnpm --filter @charisma/server test:integration -- retention`

**P0-22. Analytics (content-free by construction).** deps: P0-15. AUTONOMOUS.
Files: `services/analytics.ts`, wiring across routes, unit tests.
Goal: insert function accepts only the allowlisted names (Section 4.3 CHECK list) and a
per-name Zod-closed props schema with no free-text fields (enums and numbers only); a
type-level test proves a string prop fails compilation, a runtime test proves it throws;
`d1_return` derived server-side on first event of a new local day.
Accept: `pnpm --filter @charisma/server test`

**P0-23. Integration suite: the loop proof.** deps: P0-18..P0-22. AUTONOMOUS.
Files: `test/integration/loop.test.ts`, `test/integration/setup.ts`.
Goal: full HTTP round trips against the app factory + charisma_test db + Fakes: good
run (8 messages, end, poll result: score 100, passed, WIN quote matches U3), bad run
(score 10, failed, brag label honored), fabricated-quote run (template fallback), plus
the caps/retention/webhook suites green together.
Accept: `pnpm --filter @charisma/server test:integration`

**P0-24. E2E smoke.** deps: P0-23. AUTONOMOUS.
Files: `apps/server/test/e2e/smoke.ts`, root script `e2e:smoke`.
Goal: boots the REAL server process (`index.ts`, mock env), waits on `/healthz`, drives
the good run over the wire with fetch, asserts deterministic score 100, exits nonzero
on any mismatch; this is the one command a human can also run to see the whole system
work offline.
Accept: `pnpm e2e:smoke`

**P0-25. CI pipeline.** deps: P0-24. AUTONOMOUS.
Files: `.github/workflows/ci.yml`, root script `ci:local`.
Goal: PR gate running exactly the Section 3.6 list (postgres as a service container);
`ci:local` mirrors it so agents verify without pushing.
Accept: `pnpm ci:local`

**P0-26. AnthropicChatModel.** deps: P0-08, P0-12. AUTONOMOUS (build + unit),
GATED G-01 (live smoke only).
Files: `model/AnthropicChatModel.ts`, `scripts/smoke-anthropic.ts`, unit tests with an
injected fake Anthropic client asserting model id, cache_control on the system block,
temperatures by tag, maxTokens, JSON retry, usage mapping.
Goal: the real ChatModel, fully built offline; `smoke:anthropic` is the deferred live
check that runs the moment G-01 lands.
Accept: `pnpm --filter @charisma/server test` (live: `pnpm --filter @charisma/server smoke:anthropic` after G-01)

**P0-27. Expo app.** deps: P0-16..P0-19. AUTONOMOUS.
Files: everything under `apps/mobile/src`, `app.json`, jest config, tests.
Goal: the three surfaces (entry, chat with typing delay + remaining counter, result
card) plus profile (sign out, delete my data), typed api client, dev fake-auth mode
(`EXPO_PUBLIC_DEV_FAKE_AUTH=true` sends `x-test-user`), Clerk code paths present but
inert without a publishable key.
Accept: `pnpm --filter @charisma/mobile typecheck && pnpm --filter @charisma/mobile test`

**P0-28. Share card.** deps: P0-27. AUTONOMOUS.
Files: `lib/share.ts`, `components/ScoreCard.tsx`, component test.
Goal: view-shot capture of the score card, share sheet invocation, `share_tapped`
analytics event; renders score, streak, and the paradox tagline, never transcript text.
Accept: `pnpm --filter @charisma/mobile test`

**P0-29. Deploy artifacts.** deps: P0-25. AUTONOMOUS (author), GATED G-04, G-05, G-09
(execute).
Files: `Caddyfile`, prod profile in `docker-compose.yml`, `.github/workflows/deploy.yml`,
`README.md` ops section (restic setup, Uptime Kuma, secret placement).
Goal: complete deploy path needing only real secrets; deploy.yml no-ops with a clear
message when secrets are absent.
Accept: `docker compose --profile prod config` (validates) and `pnpm ci:local` still green

**P0-30. Live auth wiring.** deps: P0-27. GATED G-02.
Goal: flip `AUTH_PROVIDER=clerk` on the box, real keys in mobile + server, verify
sign-in on device; no code beyond config.
Accept: manual: sign in on device, `GET /v1/me` 200 with a fresh Clerk JWT.

**P0-31. Store distribution.** deps: P0-28, P0-30. GATED G-06 (TestFlight), G-07 (Play
internal).
Goal: EAS builds submitted to both internal tracks.
Accept: manual: build installable from TestFlight and Play internal testing.

**P0-32. Live persona tuning loop.** deps: P0-26, P0-18. GATED G-01 (run), G-14 (judge).
Files: `scripts/tune-sam.ts`.
Goal: replays scripted good/bad user lines against the LIVE model N times, logs warmth
traces and reply text so the human can tune persona/feedback prompts to the PRD 5
target (bad flat and good warm in >= 9 of 10) before the aha gate.
Accept: `pnpm --filter @charisma/server tune:sam -- --runs 10` completes and prints the trace table (pass/fail judgment is G-14's).

### Phase 1: engine complete (sketch)

New interfaces this phase introduces: `SpeechProvider`, `VoiceProvider` (core/speech.ts).

- P1-01. Full everyday pack: 8 skills, one unit each, PRD 6.1 prerequisites; per-unit
  fixture transcripts with known signals. AUTONOMOUS.
  Accept: `pnpm --filter @charisma/content validate && pnpm --filter @charisma/core test`
- P1-02. Router: reviews due, then in-progress, then next unlocked in canonical order;
  INV-7 preserved. deps P1-01. AUTONOMOUS.
  Accept: `pnpm --filter @charisma/server test:integration -- router`
- P1-03. Spaced review: boxes 2/7/21 d, failed review requeues box 1 and blocks new
  material (INV-6); REVIEW_DUE state live. deps P1-02. AUTONOMOUS.
  Accept: `pnpm --filter @charisma/server test:integration -- review` (time injected via a clock seam)
- P1-04. Disguised diagnostic + placement: first three sessions emit signals, fold sets
  `placement_set`, router respects it. deps P1-02. AUTONOMOUS.
  Accept: `pnpm --filter @charisma/server test:integration -- placement` (a scripted strong user skips root skills)
- P1-05. Progress screen (read-only skill nodes) + REVIEW_DUE entry-card variant.
  deps P1-03. AUTONOMOUS. Accept: `pnpm --filter @charisma/mobile test`
- P1-06. DORMANT VOICE SEAM (PRD 8.5): `core/src/speech.ts` interfaces verbatim from
  PRD 8.1, `FakeSpeechProvider` + `FakeVoiceProvider`, `routes/voice.ts` implementing
  `POST /v1/sessions/:id/voice-message` as audio -> transcribe -> the SAME turn.ts flow
  -> synthesize -> `VoiceMessageRes`; 404 when `VOICE_ENABLED=false`; composition root
  wires providers by env. Enabling later = env change + one client screen. AUTONOMOUS.
  Accept: `pnpm --filter @charisma/server test:integration -- voice` (enabled-flag test posts fixture WAV, asserts transcript hit the validator path and audio bytes returned; disabled test asserts 404)
- P1-07. Eval-set review CLI: dump/inspect `eval_transcripts` for the Phase 5 harness.
  AUTONOMOUS. Accept: `pnpm --filter @charisma/server test`
- Phase gate: G-14 (persona quality across 8 units, human taste).

### Phase 2: money (sketch)

New interfaces live: `BillingWebhookVerifier` goes real.

- P2-01. Web app: marketing one-pager + `/account` (Clerk sign-in, subscribe button,
  manage plan); static-first. AUTONOMOUS (renders with empty keys).
  Accept: `pnpm --filter @charisma/web build`
- P2-02. Paddle webhook handler: raw-body route, verifier interface, `paddle_events`
  idempotency, entitlement upserts, 7-day past_due grace; built entirely against
  `FakeBillingWebhookVerifier` + the fixture replay set. AUTONOMOUS.
  Accept: `pnpm --filter @charisma/server test:integration -- webhooks` (replays all fixtures incl the duplicate, asserts entitlement states and idempotency)
- P2-03. Real `PaddleWebhookVerifier` + overlay checkout with
  `custom_data={clerk_user_id}`. AUTONOMOUS (unit-tested HMAC), GATED G-03 (sandbox
  verify). Accept: `pnpm --filter @charisma/server test`; live: sandbox subscribe flips `/v1/me` inside 60 s.
- P2-04. Paywall moment ("One more" after result), paid caps (10/day), PAID_ONLY
  history endpoint + screen. AUTONOMOUS.
  Accept: `pnpm --filter @charisma/server test:integration -- paywall && pnpm --filter @charisma/mobile test`
- Phase gates: G-03 (Paddle live), G-05 (domain), G-10 + G-18 (payout entity, revenue
  on), G-12 (TOS before public checkout).

### Phase 3: retention and trust (sketch)

- P3-01. Incognito: in-process Map (TTL 30 min), only DB write
  `daily_usage.incognito_count`; integration test asserts ZERO other rows. AUTONOMOUS.
  Accept: `pnpm --filter @charisma/server test:integration -- incognito`
- P3-02. Character packs 2 + 3 (coworker back from a trip; guarded
  friend-of-a-friend) with fixtures. AUTONOMOUS. Accept: content validate + core test.
- P3-03. Streak freeze (paid, entitlement-gated). AUTONOMOUS.
  Accept: `pnpm --filter @charisma/server test:integration -- streak-freeze`
- P3-04. Settings/account polish + store-review reader-model notes + submission
  assets checklist. AUTONOMOUS (authoring), GATED G-15/G-19/G-20 (submission).
- P3-05. `ReceiptValidator` stays interface + Fake; no work unless a store forces IAP
  (then the pre-made PRD 7.5 decision applies). GATED G-15.
- Phase gate: G-15 (store approval or IAP fallback decision).

### Phase 4: growth loop (sketch)

- P4-01. Share-card polish + variants. AUTONOMOUS. Accept: mobile tests.
- P4-02. Cohort SQL pack (D1/D7/D30, free-to-paid) as checked-in `.sql` + a runner
  script with fixture-seeded expected outputs. AUTONOMOUS.
  Accept: `pnpm --filter @charisma/server test:integration -- cohorts`
- P4-03. Content cadence tooling: `content:new-unit` scaffolder emitting a valid unit
  skeleton + fixture template. AUTONOMOUS. Accept: scaffold then `content validate`.
- P4-04. UGC creator brief document. AUTONOMOUS (draft), GATED G-21 (hire/spend).
- Phase gate: G-17 (D7 >= 20% and free-to-paid >= 2% before distribution spend).

### Phase 5: model swap (sketch, only at the named trigger)

- P5-01. `OpenWeightsChatModel`: OpenAI-compatible client, same interface, env-selected.
  AUTONOMOUS (tested against a local stub server). Accept: `pnpm --filter @charisma/server test`
- P5-02. Eval replay harness: replays `eval_transcripts` through a candidate ChatModel,
  reports warmth-trajectory agreement and quote validity vs baseline (PRD 7.3 5% gate).
  AUTONOMOUS against FakeChatModel-as-candidate. Accept: `pnpm --filter @charisma/server test -- evalharness`
- P5-03. Canary: env-weighted 5% session split by provider, per-provider score/warmth
  dashboards from model_usage + results. AUTONOMOUS. Accept: integration test of the split.
- Phase gates: G-16 (trigger confirmation + blind side-by-side judgment).

---

## 6. Human-gate register

Default posture everywhere: agents build the gated surface against the named Fake, get
it green, then STOP and emit the copy-pasteable request in the last column. No agent
ever invents a credential, marks a gated task done, or "temporarily" hardcodes a real
value. Gates never sit on the Phase 0 critical path (P0-01..P0-25).

### (a) External accounts and secrets

| ID | Human must produce (the exact deliverable) | Gates | Agents proceed meanwhile via | Copy-pasteable request the agent emits when blocked |
|---|---|---|---|---|
| G-01 | Anthropic API key from an org with zero-data-retention enabled; paste as `ANTHROPIC_API_KEY`, set `MODEL_PROVIDER=anthropic` | P0-26 live smoke, P0-32, aha-gate sessions | `MODEL_PROVIDER=fake` (FakeChatModel) | "Create an Anthropic org, enable zero data retention in org settings, create an API key, add ANTHROPIC_API_KEY to the server .env and to GitHub secret ANTHROPIC_API_KEY. Then run: pnpm --filter @charisma/server smoke:anthropic" |
| G-02 | Clerk application (Apple, Google, email enabled); `CLERK_SECRET_KEY`, publishable keys for mobile + web, `CLERK_WEBHOOK_SECRET`, webhook endpoint pointed at https://api.DOMAIN/v1/webhooks/clerk | P0-30, P2-01 live sign-in | `AUTH_PROVIDER=fake` (x-test-user) | "Create a Clerk app with Apple/Google/email sign-in. Provide CLERK_SECRET_KEY, EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY, NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_WEBHOOK_SECRET, and add a webhook for user.created + user.deleted to https://api.DOMAIN/v1/webhooks/clerk" |
| G-03 | Paddle account: business + tax verification complete, products/prices created ($9.99 mo, $59.99 yr), sandbox + live API key, webhook secret, webhook destination configured | P2-03 live, P2 phase exit | `BILLING_PROVIDER=fake` + webhook fixture replay | "Create a Paddle Billing account, complete business and tax verification, create products: monthly $9.99, annual $59.99. Provide PADDLE_API_KEY, PADDLE_WEBHOOK_SECRET, NEXT_PUBLIC_PADDLE_CLIENT_TOKEN, and point the webhook at https://api.DOMAIN/v1/webhooks/paddle" |
| G-04 | Hetzner CPX31 with Docker installed, SSH deploy key, Hetzner Storage Box credentials for restic | P0-29 execute, first deploy | prod compose validated locally, deploy.yml no-ops without secrets | "Provision a Hetzner CPX31 (Docker + compose), add the deploy public key, provide SSH_HOST/SSH_USER/SSH_KEY as GitHub secrets, and a Storage Box + RESTIC_PASSWORD for nightly backups" |
| G-05 | Domain purchased; DNS A records for DOMAIN and api.DOMAIN to the VPS | P0-29 TLS, P2-01 public site | localhost URLs | "Buy the domain, create A records for @ and api pointing at the VPS IP, and tell me the domain so I can fill Caddyfile and EXPO_PUBLIC_API_URL" |
| G-06 | Apple Developer Program membership, App Store Connect app record, certificates via EAS, APNs key if push is added, TestFlight internal group | P0-31 iOS | Expo dev builds + simulators | "Enroll in the Apple Developer Program, create the app record in App Store Connect, run eas credentials for iOS, and add EXPO_ASC_* secrets so eas submit can push to TestFlight" |
| G-07 | Google Play Console account, app created, signing configured, internal testing track | P0-31 Android | local APK builds | "Create the Play Console app, accept signing by Google Play, create an internal testing track, and provide the service-account JSON as a GitHub secret for eas submit" |
| G-08 | Sentry project DSN (free tier) | production error visibility only | `SENTRY_DSN=` empty (NoopErrorTracker) | "Create a Sentry project and provide SENTRY_DSN for the server .env" |
| G-09 | GitHub repo + Actions secrets populated (everything above that CI/CD consumes) | deploy.yml, live-key CI jobs | ci.yml runs fully with no secrets | "Add these GitHub Actions secrets: ANTHROPIC_API_KEY, SSH_HOST, SSH_USER, SSH_KEY, plus the Clerk/Paddle/Sentry values above as they arrive" |

### (b) Business and legal

| ID | Human must produce | Gates | Agents proceed meanwhile via |
|---|---|---|---|
| G-10 | Korean young-entrepreneur SME incorporation + business bank account (Paddle payout prerequisite) | Any real revenue; final Paddle payout config in G-03 | Everything: sandbox billing, fake entitlements; revenue stays off |
| G-11 | Product-name trademark search + final name decision | Store listings (P0-31 names can use a working title), domain choice in G-05 | Working title "Charisma" internally; no public branding shipped |
| G-12 | TOS, privacy policy, content IP sign-off before public launch | Public store release, public checkout (P2) | Placeholder legal pages marked DRAFT, not linked publicly |

### (c) Judgment gates (go/no-go, taste)

| ID | Human judgment required | Gates | Agents proceed meanwhile via |
|---|---|---|---|
| G-13 | THE AHA GATE (PRD Phase 0 exit): run 20 self-sessions and recruit 10 outside TestFlight testers; judge against the metrics in Section 7 below; decide iterate vs advance | Start of Phase 1 | Nothing: agents fully finish Phase 0, then stop and present the aha-gate checklist with the analytics queries pre-written |
| G-14 | Persona and feedback prompt tuning to taste (does Sam feel human, does feedback feel sharp) using P0-32 tune:sam output | Prompt freeze for aha gate; P1 pack quality | Agents ship the PRD prompts verbatim as v1 and log traces for review |
| G-15 | App-store submission call: submit, answer review, and if rejected invoke the pre-made PRD 7.5 IAP fallback ($12.99 IAP vs $9.99 web) | Public release (P3) | Reader-model notes and the IAP-fallback branch plan are pre-written by P3-04 |
| G-16 | Model-swap trigger confirmation ($8k/mo twice) + blind 30-session side-by-side quality judgment | Phase 5 cutover | Harness (P5-02) runs and reports; no cutover without sign-off |
| G-17 | Growth spend go/no-go at D7 >= 20% and free-to-paid >= 2% | Phase 4 distribution spend | Cohort SQL (P4-02) computes the numbers; agents never spend |
| G-18 | Revenue-on decision (flip Paddle from sandbox to live once G-10 clears) | Live charges | Sandbox end to end |

### (d) Assets and people

| ID | Human must produce | Gates | Agents proceed meanwhile via |
|---|---|---|---|
| G-19 | Scenario card illustration(s) (one per unit style) | Store-quality polish (P3) | Shipped placeholder gradient + typography card, clearly fine for TestFlight |
| G-20 | App Store / Play screenshots + listing copy approval | P0-31 listings, P3 submission | Agents draft copy and generate screenshots from the running app; human approves |
| G-21 | UGC creator selection + budget | P4 distribution | Brief written (P4-04), nothing spent |
| G-22 | (Contingent) Apple/Google server credentials for receipt validation, only if G-15 forces IAP | P3-05 real implementation | `RECEIPT_VALIDATOR=fake`, interface frozen |

---

## 7. Per-phase agent runbook

Common loop for every task: pick the lowest-id unblocked task in the current phase,
build, run its acceptance command, run `pnpm ci:local`, open the PR (one task, one PR),
mark done only on green, move on. On hitting a GATED task: verify against the Fake,
stop, emit the G-xx request string from Section 6 verbatim.

### Phase 0

Order: P0-01, P0-02, P0-03, P0-04, P0-05, P0-06, P0-07, P0-08, P0-09, P0-10, P0-11,
P0-12, P0-13, P0-14, P0-15, P0-16, P0-17, P0-18, P0-19, P0-20, P0-21, P0-22, P0-23,
P0-24, P0-25, P0-26, P0-27, P0-28, P0-29 (P0-30, P0-31, P0-32 as gates clear).
Parallelizable lanes after P0-04: {P0-05..07}, {P0-08}, {P0-09}, {P0-10}, {P0-11..14};
after P0-19: {P0-20}, {P0-21}, {P0-22}, {P0-27, P0-28}.

Definition of done (agent-verifiable part): every P0 acceptance command green, and the
full self-check passes offline:

```
docker compose up -d postgres
pnpm install
pnpm -r typecheck
pnpm --filter @charisma/core test
pnpm --filter @charisma/content validate
pnpm --filter @charisma/server db:migrate && pnpm --filter @charisma/server db:check
pnpm --filter @charisma/server test
pnpm --filter @charisma/server test:integration
pnpm --filter @charisma/mobile test
pnpm e2e:smoke
pnpm ci:local
```

Phase ends with human checkpoint G-13, the aha gate, reproduced verbatim from PRD
Phase 0 exit criteria:
- 20 self-run sessions: bad runs stay flat, good runs surface the sailing story, in at
  least 9 of 10 tries each.
- 10 outside testers (TestFlight): >= 6 replay voluntarily the same day, >= 5 return
  next day unprompted; ask nothing, watch `d1_return`.
- Validator fixture suite green; zero fabricated-quote passes in 50 logged sessions.
- Measured cost per challenge <= $0.02 from `model_usage`.
If the gate fails: iterate persona/feedback prompts (pennies) via P0-32, not product
code. Gates that must clear before Phase 1 starts: G-13 (and G-01, G-02, G-06 already
cleared to have run it).

### Phase 1

Order: P1-01, P1-02, P1-03, P1-04, P1-05, P1-06, P1-07 (P1-06 parallel to P1-02..05).
DoD: all P1 acceptance commands green; placement lands a scripted experienced tester
past root skills; a due review interrupts new material on schedule; the everyday pack
loads via `content:load` with zero code edits; voice endpoint fully tested against
Fakes and returns 404 with `VOICE_ENABLED=false`.
Self-check: the Phase 0 block plus `pnpm --filter @charisma/server test:integration`
(now including router, review, placement, voice).
Human gate before Phase 2: G-14 (pack persona quality).

### Phase 2

Order: P2-01, P2-02, P2-03, P2-04.
DoD: webhook fixture replay drives every entitlement state incl idempotent duplicates;
sandbox Paddle subscribe/cancel/past_due end to end; entitlement flips in app within
60 s of webhook; the wall never blocks the free daily challenge (integration-asserted).
Self-check: Phase 1 block plus `test:integration -- webhooks|paywall` and
`pnpm --filter @charisma/web build`.
Human gates: G-03, G-05 before live checkout; G-10 + G-18 before real money; G-12
before public pages.

### Phase 3

Order: P3-01, P3-02, P3-03, P3-04 (P3-05 only if triggered).
DoD: incognito leaves zero DB rows except the counter (integration-asserted); packs 2
and 3 pass their fixture suites; streak freeze consumes entitlement correctly;
submission packages prepared.
Human gates: G-15 (submission + outcome), G-19, G-20, G-12.

### Phase 4

Order: P4-01..P4-04, continuous.
DoD: cohort queries return known answers on seeded fixtures; weekly numbers produced
without manual SQL.
Human gate: G-17 before any distribution spend; G-21 for creators.

### Phase 5 (only when the trigger fires)

Order: P5-01, P5-02, P5-03.
DoD: harness reports agreement metrics on the rolling eval set; canary split verified.
Human gate: G-16 for cutover; canary 5% before 100%.

---

## 8. Verification harness and autonomy protocol

### 8.1 Test strategy (what lets agents self-verify without a human)

Layer 1: unit tests (fast, pure, the moat's proof).
- The validator fixture suite is the centerpiece: `good-run.json`, `bad-run.json`,
  `mid-run.json` with exact known-answer signal counts and scores (Section 3.2), plus
  the per-classifier known-answer table covering every heuristic branch. Any change to
  validator behavior is a red diff in these numbers, never a silent drift.
- Score determinism: same fixture, same score, asserted; clamp and each weight tested.
- Engine reducer: every state transition and cap in a table test.
- FakeChatModel: replay correctness so every downstream test can trust it.

Layer 2: integration tests (server + ephemeral Postgres + Fakes).
- Real Fastify app factory, real migrations into `charisma_test`, FakeChatModel +
  FakeAuthVerifier + FakeBillingWebhookVerifier wired through the real composition
  root. Truncate between tests. Covers the loop proof, caps, breaker, retention,
  deletion, webhooks, and later router/review/placement/voice/incognito.

Layer 3: e2e smoke (`pnpm e2e:smoke`).
- Boots the real server process with mock env, drives the scripted good run over HTTP,
  asserts the deterministic score 100 and a complete result card. One command, offline,
  proves the whole Phase 0 system.

CI runs all three layers on every PR (Section 3.6 list). A task is done when its
acceptance command AND `pnpm ci:local` are green.

### 8.2 The loop proof (what P0-23 must assert, exactly)

Good run: create session (opener matches the Sam unit), send the 8 `good-sam` user
lines (each reply matches the script, remaining decrements 10 to 2), end, poll result
until 200: score = 100, passed = true, win.quote = U3's line, signals equal the
known-answer object, warmth trace = [1,2,3,3,3,3,3,3], `model_usage` has 8 character
rows + 1 feedback row, progress events contain session_started, 8 message_exchanged,
attempt_submitted, unit_passed, streak_updated.
Bad run: score = 10, passed = false, brag label present, warmth trace all zeros,
unit_failed event.
Fabricated run: result 200 with `template_fallback = true`, score unchanged by the
fallback, exactly 2 feedback rows in `model_usage` (SD-7).

### 8.3 Agent operating rules (binding)

1. Never invent, hardcode, or commit a real secret. Real values arrive only via env on
   the box or GitHub secrets, placed by the human. If a task seems to need one, use the
   Fake and emit the G-xx request; that IS completing your part of the task.
2. Never mark a task done with a red acceptance criterion. No skipped tests, no
   `.only`, no commented-out assertions, no lowering a threshold to pass.
3. Never fake your way past a human gate. Simulating a gate's outcome (fabricating an
   aha-gate metric, self-approving store submission, flipping a provider env to a
   guessed value) is a protocol violation, not initiative.
4. One task = one PR, small diffs, PR title = task id. Do not fold neighboring tasks in.
5. When blocked on a gate, stop and surface the precise copy-pasteable request from
   Section 6, plus the exact command the human should run after providing it. Never
   guess and continue past the boundary.
6. The PRD and this plan are the spec. A real contradiction discovered mid-build goes
   into a PR comment proposing a one-line spec delta; do not silently redesign.
7. Determinism discipline: FakeChatModel scripts, fixtures, and known-answer numbers in
   this plan are load-bearing test oracles. Changing any of them requires updating
   Section 3.2's numbers in the same PR with the reason stated.
8. Time and randomness are injected (clock seam, seeded ids in tests) so every suite is
   reproducible; no test may depend on wall-clock date or network.
9. Composition root is the only file that reads provider env vars. A PR that imports a
   concrete provider class anywhere else is wrong by construction.
10. Warmth, personas, rubrics, and prompts never appear in any client-facing response.
    A leak test guards this; keep it green.

End state this plan guarantees: task P0-01 is pickable by a Sonnet agent right now with
zero questions, the fleet reaches a green, offline, self-verifying Phase 0 core server
without a single human touch, and the human's entire job is the register in Section 6:
keys, accounts, legal, and the judgment call on whether Sam is addictive.

