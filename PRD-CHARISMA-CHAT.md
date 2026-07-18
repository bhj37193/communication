# CHARISMA CHAT TRAINER: build-ready plan (v1, 2026-07-18)

Produced by Fable 5 against FABLE-PROMPT-CHARISMA-CHAT.md. Supersedes prd.md (the
voice/three-mode spec) for everything except the engine logic and clean corpus it
inherited. Every decision below is made, not proposed. No em-dashes anywhere.

---

## 1. PRD

### 1.1 Product overview
A consumer, text-chat, daily-challenge charisma trainer. Open the app, get ONE short
chat challenge with an AI character (a stranger at a party, a new coworker, a guarded
friend-of-a-friend). You text them. The character warms up if you make them feel
interesting; it goes flat if you perform, brag, or monologue. At the end you get
instant feedback (one win quoted, one fix), a charisma score computed from real
conversational signals, and a streak. The whole loop is 3 to 5 minutes. There is no
lesson menu and no browsing: the engine serves exactly one challenge.

Positioning (locked): "Charisma is a skill. Train it." Category: conversation trainer
("Duolingo for talking to people"). The hero paradox the product proves in the user's
own transcript: the most interesting person in the room is the one who makes everyone
else feel interesting.

### 1.2 Target user
English-first, global, both genders, the self-improvement / social-confidence identity.
NOT dating-coded (dating is a later scenario pack). Age 18 to 35 core. Acquisition:
organic short-form video plus the shareable score card.

### 1.3 The daily-challenge loop (the whole product)
1. Open app. One card: today's scenario, one button ("Start").
2. Chat: the character opens with a flat, polite line that gives the user almost
   nothing. User has 10 messages. A subtle counter shows messages remaining.
3. The character warms (or stays flat) per the warmth engine (Section 4.4). Warmth is
   never shown during the chat; the user feels it in the replies.
4. Session ends at 10 user messages or a natural close. Result card renders:
   - WIN: one thing done well, user's exact line quoted.
   - FIX: the single highest-leverage change, phrased as an instruction, anchored to a
     quote or a number.
   - THE MOMENT: where the character warmed up or stayed flat, tied to what the user
     did, naming the paradox out loud.
   - SCORE: 0 to 100, computed deterministically by the server (Section 4.6), plus the
     one skill to train next.
5. Streak ticks. Share button renders the score card as an image for the share sheet.

### 1.4 Onboarding
Install, Clerk sign-in (Apple / Google / email), two swipe screens max ("Charisma is a
skill. Train it." and "One 3-minute challenge a day. A character who only warms up if
you earn it."), then straight into challenge #1. No form, no quiz screens: in Phase 1
the first three challenges ARE the diagnostic, disguised as normal play (Section 1.5).

### 1.5 Diagnostic and placement (Phase 1, not Phase 0)
No visible test. The first three daily challenges run standard scenarios spanning the
skill tree's first three tiers. The validator's signal output from those sessions
places the user: a user who already asks open questions and follows up skips the root
skills and starts at reciprocity/balance. Placement is a server-side event
(placement_set); the user just sees challenges that feel right-sized.

### 1.6 Score, streak, progress
- Score: per-session 0 to 100, deterministic (Section 4.6), so identical transcripts
  always score identically. Shareable and defensible.
- Streak: one scored challenge per local-calendar day maintains it. Timezone from
  device at signup, changeable once per 30 days (anti-gaming). Streak freeze is a paid
  perk in Phase 3, not v1.
- Progress: skill nodes light up as mastered. One screen, read-only, no navigation
  into content (INV-7: the corpus is never enumerable).

### 1.7 Incognito (product feature, Phase 3 design pinned now)
A toggle on any challenge. Processed in memory, retained nowhere: no stored transcript,
no history, no progress, no streak, no review credit. Result shown once, then gone. The
only persisted artifact is a transient, content-free, daily-reset counter so incognito
still respects the per-day cost cap. Copy is honest: "retained nowhere on our side"
still means the model processed it transiently; we configure zero data retention with
the provider and never claim nobody ever saw it.

### 1.8 Freemium wall and subscription
- Free forever: ONE daily challenge, streak, current score, THE MOMENT feedback.
- Paid ($9.99/month or $59.99/year, annual pushed at the paywall): unlimited challenges
  (hard-capped at 10 scored sessions per day for cost and pedagogy), score history and
  trends, extra character packs, unlimited incognito (free tier gets 1 incognito/day),
  streak freeze (Phase 3).
- The wall appears at the exact moment of desire: user taps "One more" after a result
  card. Never interrupts the free daily loop.
- Purchase happens ONLY on the website via Paddle (Merchant of Record). The app is
  login-only, reader model. No purchase links or price mentions inside the iOS app
  binary; the paywall screen in-app says "Manage your plan at [product].com" per
  guideline 3.1.3(a) constraints, adjusted at store-review time if required.

### 1.9 The three surfaces (limit the details, make the details perfect)
1. Entry: today's scenario card. One illustration, two lines of setup, Start button,
   streak flame. Nothing else.
2. Chat: standard messaging UI, character typing indicator with human-feeling delay
   (600 to 1800 ms plus length-proportional), messages-remaining counter.
3. Result card: WIN / FIX / THE MOMENT / SCORE in that order, one screen, share button.
Everything else (settings, progress, paywall) hides behind a single profile icon.

### 1.10 Explicit non-goals (v1)
No voice, no STT/TTS. No sales or public-speaking modes. No Apple/Google IAP. No web
chat client (web is marketing + checkout + account only). No social features beyond
the share card. No user-generated scenarios. No Android-vs-iOS staggering: Expo ships
both.

---

## 2. Tech stack (each choice, one line why)

| Layer | Choice | Why |
|---|---|---|
| Mobile app | React Native + Expo (TypeScript), Expo Router, EAS Build | Pinned; one codebase for iOS+Android, Clerk first-class |
| Web (marketing/signup/account) | Next.js 15, static-first, one page + /account | Clerk and Paddle both have first-class Next integrations; served by Caddy |
| Backend | Node 22 + TypeScript + Fastify | One language across app/server/web; shared Zod schemas end to end; the validator is string logic, no Python advantage |
| Shared code | pnpm monorepo: `apps/mobile`, `apps/web`, `apps/server`, `packages/core` (engine+validator+schemas), `packages/content` (skill packs) | Validator and schemas are imported by server and testable in isolation |
| Validation/schemas | Zod everywhere | Same schema validates API payloads, model JSON output, and content packs |
| DB | Postgres 16 (single instance, Docker volume) | Event log, projections, content, entitlements, counters: one boring store |
| ORM/migrations | Drizzle ORM + drizzle-kit | Lightweight, TypeScript-native, plain SQL underneath |
| Cache/queues | None in v1: Postgres does counters and the expiry job | ponytail: Redis added only when a measured hot path needs it |
| Reasoning model | Anthropic `claude-haiku-4-5` behind `ChatModel` interface (Section 3.4), zero-data-retention configured | Pinned; swappable to self-hosted open weights at the named trigger |
| Auth | Clerk (Expo SDK + Next SDK + backend JWT verification) | Pinned; shared user identity across app and web; kept, no swap justified |
| Payments | Paddle Billing (MoR) on web only | Pinned; Stripe unavailable to Korea-based businesses; Paddle handles global VAT/sales tax as seller of record |
| Analytics | Own `analytics_events` table (content-free rows) + SQL; Plausible on the marketing site | Zero third-party product-analytics dependency; day-7/day-30 and conversion are simple SQL; content can never leak into a vendor |
| Infra | One Hetzner CPX31 (4 vCPU/8 GB), Docker Compose, Caddy (TLS), Uptime Kuma, restic nightly to Hetzner Storage Box | Pinned class; Compose+Caddy is the assumed baseline and nothing here needs more |
| Error tracking | Sentry (free tier), PII/content scrubbed via beforeSend | Cheapest way to see production crashes on day one |
| CI | GitHub Actions: typecheck, unit tests (validator!), docker build, ssh deploy | Solo-dev boring pipeline |

The one deliberate change from the old voice-era spec: backend moves from Python/
FastAPI to TypeScript/Fastify. Rationale: nothing is built yet, the voice stack
(LiveKit Agents, Python-only) that justified Python is gone, and a solo developer
shipping an Expo app gains real velocity from one language and shared types. The
engine spec is language-agnostic; nothing is lost.

---

## 3. Architecture

### 3.1 System diagram (prose)
Mobile app (Expo) and web (Next.js) both authenticate with Clerk. All product traffic
goes to `api.[domain]` (Fastify) through Caddy. The server is the only thing that
talks to the model provider, Postgres, and Paddle. Paddle and Clerk call back into the
server via webhooks. One VPS runs it all under Docker Compose: `caddy`, `api`, `web`,
`postgres`, `uptime-kuma`; restic runs on the host via cron.

### 3.2 The engine: server-owned state machine
The server enforces structure by construction (MCP-ENGINE-SPEC invariants INV-1..10
carried over). The client can only do what the current state permits; it can never
advance its own state.

Per-user states and permitted actions:
```
ACTIVE           -> [get_today, start_session, where_am_i]
REVIEW_DUE       -> [get_today(review), start_session, where_am_i]   (review served first)
SESSION_OPEN     -> [send_message, end_session]
CAPPED           -> [where_am_i]   (daily cap hit; returns next-open time)
```
(NEW/DIAGNOSING states arrive in Phase 1; Phase 0 places everyone at the first skill.)

Transitions are server-owned: `start_session` creates a session against the ONE unit
the router chose (reviews due first, then in-progress skill, then next unlocked skill
in canonical order). There is no list-units call. `end_session` (or the 10th user
message) triggers scoring; pass/fail and mastery are computed server-side; the
resulting events advance state.

### 3.3 Chat turn flow (touchpoint 1)
1. Client POSTs user message text.
2. Server appends to the server-held transcript, runs cheap guards (length cap 500
   chars, rate limit, message count).
3. Server calls `ChatModel.complete` with: static character system prompt (cached
   prefix), the unit's persona brief, the CURRENT warmth level (server-held), and the
   transcript. The model returns strict JSON: `{ reply, warmth_delta, reason_code }`
   (Zod-validated, one retry on parse failure, fallback = neutral reply, delta 0).
4. Server clamps warmth to [0,3], stores the per-turn warmth trace, returns only
   `reply` and `remaining` to the client. Warmth never reaches the client during play.
Injecting server-held warmth each turn keeps behavior consistent and makes the server,
not the model's memory, the authority on the meter.

### 3.4 Model-provider abstraction (hard requirement)
```ts
// packages/core/src/model.ts
export interface ChatModel {
  complete(req: {
    system: string;            // cacheable prefix
    messages: ChatMessage[];
    maxTokens: number;
    json?: ZodSchema;          // when set, response is parsed+validated JSON
    tag: 'character' | 'feedback';   // for per-touchpoint cost metering
  }): Promise<{ text: string; json?: unknown; usage: TokenUsage }>;
}
```
Implementations:
- `AnthropicChatModel` (v1): `claude-haiku-4-5`, prompt caching on the system prefix,
  zero-data-retention enabled on the org, temperature 0.7 character / 0.2 feedback.
- `OpenWeightsChatModel` (later): OpenAI-compatible client pointed at a self-hosted
  vLLM endpoint (Llama/Qwen class). Same interface, zero call-site changes.
Every call site imports `ChatModel` only; the concrete class is chosen by env var in
one composition-root file. Usage from every call is written to `model_usage` rows
(tokens, tag, session_id) to drive the cost cap and the swap decision.

Swap trigger (named, decided): migrate when EITHER monthly model spend exceeds $8,000
for two consecutive months, OR a provider policy/pricing change threatens the unit
economics. Swap is gated by the eval harness in Section 7.3; do not build any GPU
infrastructure before the trigger fires.

### 3.5 Scoring flow (touchpoint 2) and the deterministic validator
On session end:
1. Server calls `ChatModel.complete(tag:'feedback')` ONCE with the full transcript and
   the unit's feedback prompt. The model returns strict JSON:
   `{ win: {text, quote}, fix: {text, anchor}, moment: {text, quote}, labels: [...] }`.
   The model proposes prose and labels only. It does NOT produce the score.
2. The validator (`packages/core/src/validator.ts`, pure functions, zero I/O, zero
   inference) recomputes every countable signal itself from the raw transcript
   (Section 4.5), substring-checks every quote the model cited (whitespace-normalized
   exact match against the correct speaker's messages; any fabricated quote rejects
   the feedback and triggers one regeneration, then falls back to template feedback
   built from the validator's own signals).
3. The validator applies the unit's band-threshold pass rule and computes the score
   (Section 4.6). The server appends `attempt_submitted`, `unit_passed|unit_failed`,
   and (when the mastery counter, which only the server owns, reaches threshold)
   `skill_mastered` events. The model can never advance state.

### 3.6 Data model (Postgres, via Drizzle)
```
users              id, clerk_id UNIQUE, tz, created_at
entitlements       id, user_id, source ENUM(paddle, apple, google, promo),
                   product, status ENUM(active, past_due, canceled), expires_at,
                   external_ref, updated_at        -- active = any row active & unexpired
paddle_events      event_id PRIMARY KEY, payload JSONB, processed_at   -- idempotency
skill_packs        pack_id, version, loaded_at
skills             id, pack_id, name, objective, prerequisites TEXT[]
units              id, skill_id, spec JSONB        -- full Unit schema, Section 4.2
progress_events    seq BIGSERIAL, user_id, type, payload JSONB, created_at
                   -- append-only; no UPDATE or DELETE grants on this table
user_skill_state   user_id, skill_id, status, passes, last_pass_at,
                   review_box, review_due_at       -- projection, rebuildable
sessions           id, user_id, unit_id, state, warmth_trace JSONB,
                   started_at, ended_at, incognito BOOL (always false when persisted)
transcripts        session_id, messages JSONB, expires_at   -- TTL, Section 3.8
results            session_id, win, fix, moment, score, signals JSONB, expires_at
daily_usage        user_id, date, scored_count, incognito_count, tokens_in, tokens_out
model_usage        id, session_id, tag, tokens_in, tokens_out, cached_in, created_at
analytics_events   id, user_id, name, props JSONB (content-free by construction:
                   props schema allowlist, no free-text field), created_at
```
Progress is event-sourced: `progress_events` is the source of truth; `user_skill_state`
is a fold over it, rebuildable, so new metrics later need no migration.

### 3.7 API surface (all JSON, Clerk JWT except webhooks)
```
GET  /v1/me                      state, streak, entitlement, caps, current score
GET  /v1/challenge/today         the ONE routed unit's client-safe slice (scenario
                                 text, character name; never rubric or warmth rules)
POST /v1/sessions                start session (409 if capped or one already open)
POST /v1/sessions/:id/messages   {text} -> {reply, remaining}
POST /v1/sessions/:id/end        -> triggers scoring; result at GET result
GET  /v1/sessions/:id/result     WIN/FIX/MOMENT/SCORE + signals
GET  /v1/me/history              score history (paid)
DELETE /v1/me/data               one-tap hard delete (real DELETE, then VACUUM job)
POST /v1/webhooks/paddle         signature-verified; upserts entitlements
POST /v1/webhooks/clerk          user.created -> users row; user.deleted -> hard delete
GET  /healthz
```
Content is never enumerable through the API (INV-7): no list-skills, no list-units.

### 3.8 Privacy, retention, deletion (enforced, not aspirational)
- Transcripts and results carry `expires_at = created_at + 60 days` (chosen inside the
  30 to 90 band). A daily job hard-deletes expired rows. "Save this conversation"
  (paid) nulls `expires_at`.
- `DELETE /v1/me/data` deletes transcripts, results, sessions, progress events, and
  analytics rows for the user in one transaction. Real delete, no soft flag.
- Incognito sessions live only in process memory (a Map keyed by session id, TTL 30
  min); the only DB write is `daily_usage.incognito_count += 1`.
- Analytics rows cannot contain content by construction: the insert function accepts
  only an allowlisted event name and a Zod-closed props object with no string fields
  except enums. Events: `signup, session_started, session_completed, result_viewed,
  share_tapped, paywall_viewed, checkout_started, subscription_activated, d1_return
  (derived), streak_broken`.
- Sentry beforeSend strips request bodies. Model provider set to zero data retention.

### 3.9 Paddle MoR webhook to entitlement flow
1. Web: user signs in with Clerk on [product].com, taps Subscribe. Paddle overlay
   checkout opens with `custom_data = { clerk_user_id }`.
2. Paddle (seller of record) charges, remits VAT/sales tax worldwide, pays out.
3. Webhooks: `subscription.created/updated/canceled`, `transaction.completed` arrive
   at `/v1/webhooks/paddle`; signature verified; `paddle_events.event_id` insert gives
   idempotency; handler upserts `entitlements (source='paddle')`.
4. App calls `GET /v1/me`; entitlement = any active unexpired row, source-agnostic.
5. Later, if store review forces IAP: an Apple/Google receipt-validation worker writes
   `entitlements (source='apple'|'google')` rows. Same table, same read path, zero
   rewrite. Build none of it now.
Grace: `past_due` keeps access 7 days. Cancel keeps access to period end.

### 3.10 Cost control (hard caps, three layers)
1. Per-user: free = 1 scored session + 1 incognito per day; paid = 10 scored per day.
   Enforced from `daily_usage` before any model call.
2. Per-session: character turns capped at 12 model calls, feedback at 2 (one retry);
   maxTokens caps output per call (character 120, feedback 700).
3. Global circuit breaker: a 60-second job sums today's `model_usage`; if projected
   daily spend exceeds the cap (env `DAILY_MODEL_BUDGET_USD`, initial $50), new
   session starts return a friendly "come back tomorrow" and an alert fires. Existing
   sessions finish.
Cost math per challenge (Haiku 4.5 at $1/$5 per MTok): ~15 character calls with a
cached system prefix, ~800 uncached input tokens average and ~60 output each, plus one
feedback call (~2.5k in, 600 out): roughly $0.012 to $0.020 per challenge with prompt
caching. At 100k DAU free-tier ceiling that is ~$1,200 to $2,000/day worst case, which
is why the free tier is exactly one challenge and the breaker exists. Expected blended
(not everyone plays daily) lands in the $5k to $10k/month band the brief targets.

---

## 4. Pedagogy data model (exact schemas)

### 4.1 SkillPack
```ts
SkillPack {
  pack_id: string            // "everyday"
  version: string            // semver; progress keys to stable skill ids, not order
  skills: Skill[]
  units: Unit[]
  signals: SignalDef[]       // pack-level signal definitions
}
Skill { id, name, objective, prerequisites: string[] }
```
Content lives in `packages/content/everyday/*.json`, Zod-validated in CI, loaded into
Postgres by a deploy-time CLI (`pnpm content:load`). New pack = new folder, zero
engine changes.

### 4.2 Unit
```ts
Unit {
  id: string
  skill_id: string
  principle: string             // one sentence the user is actually training
  exemplar: string              // 2-3 line example of the skill done well
  scenario: {                   // client-safe slice
    title, setup_text, character_name, message_budget: 10
  }
  persona: {                    // server-only, never sent to client
    brief: string               // who the character is, setting, baseline demeanor
    hidden_depth: string        // what they reveal only when warmth is earned
    opener: string              // the flat first line
    warmth_rules: {
      increments: string[]      // behaviors that raise warmth (+1 each)
      decrements: string[]      // behaviors that lower warmth (-1 each)
      neutral: string[]         // explicitly does nothing (e.g. bare flattery)
    }
    behavior_by_warmth: { "0": string, "1": string, "2": string, "3": string }
  }
  rubric: RubricLine[]          // Section 4.3
  feedback_prompt: string       // the WIN/FIX/MOMENT generation prompt
  mastery: { passes_required: number, distinct_days: boolean }   // default 2, true
}
RubricLine {
  signal_id: string
  band: { min?: number, max?: number }   // band thresholds, not floors
  hard: boolean                          // hard lines gate the pass; soft lines only move score
}
```

### 4.3 SignalDef (pack-level)
```ts
SignalDef {
  id: string
  kind: 'count' | 'ratio' | 'flag'
  description: string
  weight: number                // score contribution, Section 4.6
}
```
Everyday pack signals (v1, all recomputed server-side):
`open_questions (count)`, `followups (count)`, `reciprocity (count)`,
`spotlight_share (ratio)`, `interview_mode (flag)`, `monologue_brag (flag)`,
`final_warmth (count, 0-3, from the server-held trace)`.

### 4.4 Warmth engine contract
Per character turn the model receives: persona brief, warmth_rules, current warmth
(server-held), behavior_by_warmth for the current level, and the transcript. It must
return `{ reply, warmth_delta (-1|0|1), reason_code }` where reason_code is one of a
closed enum (`open_question, followup, reciprocity, monologue, brag, ignored_content,
neutral`). The server clamps warmth to [0,3] and stores the full trace. Flattery alone
maps to `neutral` and does nothing, by explicit rule in every persona.

### 4.5 Deterministic validator (exact recomputation, zero inference)
Pure TypeScript in `packages/core`, fully unit-tested; the same code runs in CI
against fixture transcripts. Heuristics are versioned with the pack.

Message classifiers (user messages only):
- `is_question`: contains `?`.
- `is_open_question`: question AND matches the curated open-starter list
  (`what, how, why, tell me, describe, walk me through, where did, what's it like,
  which part, who ...`) AND does not match the closed-starter list
  (`do you, did you, are you, is it, was it, have you, would you, can I`). The lists
  ship with the pack and are unit-tested against fixtures.
- `is_followup`: shares at least one content word (>=4 chars, stopword-filtered,
  stemmed) with the character's immediately previous message, or contains an explicit
  back-reference ("you said", "that trip", the character's mentioned nouns).
- `is_self_disclosure`: non-question sentence, first person (`I/my/we`), >=6 words.
- `word_count` per message.

Recomputed signals:
- `open_questions` = count of open-question messages.
- `followups` = count of follow-up messages.
- `reciprocity` = count of self-disclosure messages occurring AFTER the first
  character turn at warmth >=2 (they opened up, did you give something real back).
- `spotlight_share` = (messages that are about the character: any question to them or
  follow-up on their content) / (total user messages).
- `interview_mode` = true if any run of 3+ consecutive user questions contains zero
  self-disclosure.
- `monologue_brag` = true if any user message > 60 words, OR the model flagged a brag
  AND its quoted evidence substring-matches the transcript (a model flag with a
  fabricated quote is discarded).
- `final_warmth` = last value of the server-held warmth trace.

Evidence check: every quote in the feedback JSON (win.quote, moment.quote, any brag
quote) must be an exact substring of the correct speaker's concatenated messages after
whitespace normalization. One failure rejects the whole feedback object: regenerate
once, then fall back to deterministic template feedback assembled from the signals
("You asked 3 open questions; your best was ...") so the user always gets a result.

Pass rule: every `hard` rubric line's signal must land inside its band. Bands, not
floors: too many questions fails as surely as too few (interrogation), too much
self-talk fails like too little. This is the content-coupling principle: the only way
to pass is to actually do the real thing.

Mastery: the server counts passes per skill across distinct local days
(`mastery.distinct_days`). At `passes_required` the skill is mastered, the next skill
unlocks (prerequisites permitting), and a spaced-review item is scheduled (review
boxes at 2, 7, 21 days; a failed review re-queues at box 1 and blocks new material,
INV-6).

### 4.6 Deterministic score (server-computed, model never sees it)
```
score = clamp(0, 100,
    40
  + 8  * min(open_questions, 3)          // cap prevents question-spam
  + 10 * min(followups, 2)
  + 10 * min(reciprocity, 1)
  + 10 * (spotlight_share in [0.4, 0.7] ? 1 : 0)
  + 5  * final_warmth                    // 0..15
  - 20 * interview_mode
  - 20 * monologue_brag)
```
Weights live in the pack's SignalDefs, tunable per unit without code changes. Same
transcript, same score, always: this is the "measurable skill" claim made real, and it
is what makes the shared score card defensible.

### 4.7 Event-sourced progress
Event types (append-only `progress_events`):
```
session_started, message_exchanged(counts only, no content), attempt_submitted,
unit_passed, unit_failed, skill_mastered, review_scheduled, review_passed,
review_failed, placement_set, streak_updated, entitlement_changed
```
`user_skill_state` and the streak are projections (folds) over this log, rebuildable
from scratch; adding a metric later is adding a projection, never a migration of
history.

---

## 5. Build plan: thin slice first

### Phase 0: the thin vertical slice (build this first, ~2 weeks)
One complete daily-challenge loop, end to end, on the real stack, wired from day one.

In scope:
- Monorepo scaffold; Docker Compose (caddy, api, postgres) live on the Hetzner box
  with TLS on day one; GitHub Actions deploy.
- Expo app: Clerk sign-in, entry card, chat surface, result card, streak flame,
  share-as-image (react-native-view-shot + share sheet). iOS TestFlight + Android
  internal track.
- Server: sessions, chat turn flow with warmth engine, feedback call, the FULL
  deterministic validator (this is the moat, it goes in first), deterministic score,
  streak, per-user daily cap (1 free scored session), global circuit breaker,
  transcript TTL job, content-free analytics events, `/healthz`, Sentry.
- Content: ONE unit, the housewarming/Sam scenario (Section 6), hand-tuned until the
  bad run stays flat and the good run warms.
- `ChatModel` interface + AnthropicChatModel with prompt caching and usage metering.

Explicitly out: diagnostic, skill tree (everyone plays the one unit), payments,
paywall, incognito, history, settings beyond sign-out and delete-my-data (delete IS in
scope: it is a privacy promise, not a feature).

Verify before advancing (the aha gate):
- 20 self-run sessions: bad runs stay flat, good runs surface the sailing story, in
  at least 9 of 10 tries each.
- 10 outside testers (TestFlight): >=6 replay voluntarily the same day, >=5 return
  next day unprompted; ask nothing, watch `d1_return`.
- Validator fixture suite green; zero fabricated-quote passes in 50 logged sessions.
- Measured cost per challenge <= $0.02 from `model_usage`.
If the aha gate fails, iterate persona/feedback prompts (pennies) before writing any
more product code.

### Phase 1: engine complete (~2 weeks)
Full everyday skill tree (Section 6.1) as a content pack, router (reviews first, then
in-progress, then next unlocked), disguised 3-challenge diagnostic + placement, spaced
review boxes, progress screen.
Verify: placement lands experienced testers past the root skills; review interrupts
new material on schedule; pack loads via CLI with zero code edits.

### Phase 2: money (~2 weeks)
Marketing one-pager + Clerk signup + Paddle checkout + webhooks -> entitlements;
in-app paywall moment ("One more" after the result card); paid caps; score history.
Verify: sandbox Paddle end to end (subscribe, cancel, past_due grace); entitlement
flips in app within 60 s of webhook; wall never blocks the free daily challenge.

### Phase 3: retention and trust (~2 weeks)
Incognito toggle (memory-only path), second and third character packs (coworker back
from a trip; guarded friend-of-a-friend), streak freeze (paid), account/settings
polish, App Store + Play submission with reader-model notes prepared.
Verify: incognito leaves zero DB rows except the counter (asserted in an integration
test); store review passes or the IAP fallback plan activates (Section 7.5).

### Phase 4: growth loop (ongoing)
Share-card polish, UGC creator brief, weekly cohort SQL (D1/D7/D30, free-to-paid),
content authoring cadence (one new unit per week).
Verify: D7 >= 20% and free-to-paid >= 2% before spending on distribution.

### Phase 5 (only at the named trigger): model swap
When monthly model spend > $8k for two consecutive months: stand up vLLM on one GPU
box, run the eval harness (Section 7.3), swap `ChatModel` implementation behind the
env var, canary 5% of sessions, compare warmth-trace and score distributions. No GPU
work before the trigger. Voice remains a post-launch premium track, out of scope here.

---

## 6. Sample content

### 6.1 Everyday skill tree (pack "everyday" v1)
```
open-questions        (root)            Ask open questions, not yes/no.
followups             req: open-questions   The follow-up, not the first question, signals listening.
reciprocity           req: followups        After they share, give something real back.
blend                 req: followups        Blend questions with sharing; never interview mode.
spotlight             req: reciprocity, blend   Keep 40-70% of the spotlight on them.
yes-and               req: followups        Build on what they said; connect, don't reset.
stories               req: reciprocity      Concrete, vivid, SHORT stories over vague summary.
depth                 req: spotlight, yes-and   Move gracefully from small talk to something that matters.
```

### 6.2 One fully specified unit: "The Housewarming" (skill: followups)
```json
{
  "id": "everyday.followups.housewarming-sam",
  "skill_id": "followups",
  "principle": "The follow-up question, not the first question, is what makes someone feel heard.",
  "exemplar": "Them: 'Just got back from a long trip, actually.' You: 'Back from where? What kind of trip takes someone away that long?' (You built on their answer instead of resetting.)",
  "scenario": {
    "title": "The Housewarming",
    "setup_text": "You're at a friend's housewarming. You end up next to Sam, someone you've never met, by the drinks table. Sam is polite but not giving you much. You have 10 messages to make Sam actually want to keep talking to you.",
    "character_name": "Sam",
    "message_budget": 10
  },
  "persona": {
    "brief": "Sam, any gender, at a friend's housewarming. Pleasant but reserved. Default replies are short, slightly flat, polite (1-2 sentences), like a real person sizing a stranger up. Never a coach, never gives advice, never breaks character.",
    "hidden_depth": "Spent the last five months crewing a sailboat across the Pacific and moved back last week. Never leads with it. Reveals it only in layers, only when made to feel genuinely listened to.",
    "opener": "Hey. Nice place, right? I think I'm mostly here for the snacks.",
    "warmth_rules": {
      "increments": [
        "asks an open question about Sam or Sam's world (not yes/no)",
        "follows up on something Sam just said, referencing the previous answer",
        "after Sam shares something, reciprocates with a real short self-share (not a question)"
      ],
      "decrements": [
        "monologues, brags, or performs",
        "makes it about themselves and stays there",
        "changes subject ignoring what Sam just said"
      ],
      "neutral": [
        "bare flattery ('that's so cool!') with no real follow-up does NOTHING"
      ]
    },
    "behavior_by_warmth": {
      "0": "Short, polite, a little flat. Do NOT mention the sailing. Guarded.",
      "1": "Slightly less guarded. One small real detail about the recent move. Still no sailing.",
      "2": "Warm up noticeably. Volunteer a hint of the sailing trip. More energy, one vivid detail.",
      "3": "Fully engaged and playful. Tell a vivid piece of the Pacific story and ask THEM a genuine question back with real curiosity."
    }
  },
  "rubric": [
    { "signal_id": "followups",       "band": { "min": 2 },              "hard": true },
    { "signal_id": "open_questions",  "band": { "min": 2, "max": 6 },    "hard": true },
    { "signal_id": "interview_mode",  "band": { "max": 0 },              "hard": true },
    { "signal_id": "monologue_brag",  "band": { "max": 0 },              "hard": true },
    { "signal_id": "spotlight_share", "band": { "min": 0.4, "max": 0.7 }, "hard": false },
    { "signal_id": "reciprocity",     "band": { "min": 1 },              "hard": false }
  ],
  "feedback_prompt": "You are a warm, sharp charisma coach. Score ONLY the USER's conversational skill in the transcript, using their actual words as evidence. Return JSON: win {text, quote: user's exact line}, fix {text: one instruction, the single highest-leverage change, anchored to a quote or number}, moment {text, quote}: find where Sam warmed up or stayed flat, tie it directly to what the USER did, and name the paradox out loud: they became more interesting the moment they made Sam feel interesting. If Sam never warmed, name the exact moment that kept Sam flat. Keep it short, specific, encouraging. Quote real lines only. Do not invent anything not in the transcript. Do not output a score.",
  "mastery": { "passes_required": 2, "distinct_days": true }
}
```
The band thresholds encode the trap doors: 7 questions with no self-share fails
(interrogation), one long self-story fails (monologue), pure flattery moves nothing.
The only way through is the real behavior. That is the moat working.

---

## 7. Risks and mitigations

### 7.1 Scoring gaming
Risk: users optimize signals, not skill (question-spam, keyword echo), or the model
mints unearned passes. Mitigation: bands not floors kill spam strategies; the server
recomputes every countable signal and substring-checks every quote, so the model
cannot fabricate a pass; mastery requires passes on distinct days. Residual: a user
pasting LLM-written replies. Accepted: coach, not certifier; you cannot fake your way
into a real conversation later, and the product's value claim survives.

### 7.2 Free-tier cost blowout
Risk: viral spike makes free inference spend spike. Mitigation: three-layer caps
(Section 3.10), prompt caching, 120-token character replies, and the global circuit
breaker that degrades gracefully instead of melting the card. Per-challenge cost is
metered from day one in `model_usage`, so the number is always known, never estimated.

### 7.3 Model swap quality cliff
Risk: the open-weights swap degrades the character (the product IS the character).
Mitigation: from Phase 0, save (until transcript expiry) a rolling eval set of ~200
anonymized fixture transcripts with their warmth traces and scores; the swap gate
replays them through the candidate model and requires warmth-trajectory agreement and
feedback-quote validity within 5% of Haiku baseline, plus blind side-by-side of 30
sessions. Canary 5% before 100%. The interface makes the swap cheap; the eval makes it
safe; the trigger ($8k/month twice) makes it timely.

### 7.4 Privacy failure
Risk: sensitive personal practice conversations leak or outlive their welcome.
Mitigation: 60-day TTL enforced by a tested job, one-tap hard delete, content-free
analytics by construction (closed props schema), provider zero-data-retention, honest
copy, incognito with a genuinely memory-only path asserted by integration test.

### 7.5 MoR / app-store policy vs login-only app
Risk: Apple rejects the login-only app or demands IAP. Mitigation: reader-model
posture (no purchase links, no price in-app), Paddle stays the default rail, and the
entitlement layer is multi-source by design so adding IAP is a bounded worker, not a
rewrite. If review forces IAP for in-app unlock, ship IAP at $12.99/month (tax on top
of the store cut) while web stays $9.99, the Spotify pattern. Decision pre-made so a
rejection costs days, not a pivot.

### 7.6 The real #1 risk: demand and retention
Nothing above matters if the loop is not addictive. That is why Phase 0 is the aha
gate, not an MVP: two weeks to a real-stack slice whose ONLY success metric is
voluntary replay and unprompted D1 return by outside testers, measured by the
analytics that are non-negotiable from day one. If the gate fails, the sunk cost is
two weeks and pennies of inference, and iteration happens in the persona prompts, not
the codebase. The engine, validator, and content model all survive a repositioning;
the thin slice is designed so the expensive thing (the product bet) is tested before
the cheap things (features) are built.

---

A competent solo developer can start Phase 0 tomorrow: scaffold the monorepo, stand up
Compose on the box, implement `ChatModel` + the validator with the fixture suite, wire
the Sam unit from Section 6.2, and put the chat surface on TestFlight by the end of
week one.

---

## 8. Deferred: voice (post-launch premium, design pinned now)

Voice is out of v1 (Section 1.10). It is captured here so the interfaces exist from day
one and adding it later is an implementation, not a rewrite. The 2026 reason it is now
affordable: cost flips from per-minute cloud APIs to fixed self-hosted compute, and open
models are good enough that speech-to-text is effectively free at scale and text-to-
speech runs cheaply.

### 8.1 Two new provider interfaces (mirror `ChatModel`, Section 3.4)
```ts
// packages/core/src/speech.ts
export interface SpeechProvider {                 // STT
  transcribe(req: { audio: ReadableStream; sampleRate: number }):
    AsyncIterable<{ partial?: string; final?: string }>;   // streaming
}
export interface VoiceProvider {                  // TTS
  synthesize(req: { text: string; voiceId: string }):
    AsyncIterable<Uint8Array>;                    // streamed audio chunks
}
```
Same pattern as `ChatModel`: every call site imports the interface only; the concrete
class is chosen in one composition-root file by env var; usage is metered.

### 8.2 Half-duplex first (the cost + complexity lever)
Ship push-to-talk (record a turn, hear a spoken reply) before any full-duplex live
call. A turn-based training loop is already turn-taking, so push-to-talk fits and needs
no SFU, no barge-in, no echo cancellation: it runs over a WebSocket. Full-duplex live
call (interrupt, overlap) is a later, separate track, built only if users demand the
real-time feel. The `SpeechProvider`/`VoiceProvider` interfaces serve both.

### 8.3 Validate managed, then self-host at a trigger (same discipline as the LLM)
- v-Phase A (validate): managed STT + TTS implementations behind the interfaces, billed
  per minute. Proves users want voice before any infra is built.
- v-Phase B (scale): self-hosted implementations. STT = Parakeet TDT (English-only,
  near-instant, one GPU serves very high concurrency) or faster-whisper. TTS = Kokoro or
  Piper (near-CPU, high concurrency) for scale, StyleTTS2/XTTS on GPU where quality
  matters. Transport = self-hosted LiveKit SFU on the VPS. Orchestration via LiveKit
  Agents or Pipecat.
- Named trigger: monthly managed-voice spend exceeds the amortized cost of one GPU box
  for two consecutive months. No GPU work before it fires. Gated by a voice-quality eval
  analogous to Section 7.3.

### 8.4 Cost posture
Self-hosted, a voice session costs approximately the chat LLM cost (unchanged, the model
brain is the same touchpoints) plus a few tenths of a cent of STT/TTS compute on fixed
hardware. The expensive resources are engineering (low-latency streaming, barge-in if
full-duplex) and ops (GPU capacity), not per-minute fees. Inference-box location follows
where users cluster (global-English), not the Korean company location; lean on LiveKit
edge for transport latency.

### 8.5 The seam ships dormant in Phase 1; full enablement is Phase 6
To make voice a near-instant add later, the SERVER-side seam is built early and left
dormant, not deferred wholesale to Phase 6.
- **Phase 1 (build dormant, behind `VOICE_ENABLED=false`):** the `SpeechProvider` and
  `VoiceProvider` interfaces, a `Fake` implementation of each, and a push-to-talk endpoint
  `POST /v1/sessions/:id/voice-message` that pipes audio in -> `SpeechProvider.transcribe`
  -> the SAME `ChatModel` turn flow -> `VoiceProvider.synthesize` -> audio out. Because
  scoring and the validator run on the transcribed text, nothing downstream changes. Built
  and tested with the Fakes, shipped switched off. Cost now: near zero.
- **Enabling voice later (the "add a key" step):** set `VOICE_PROVIDER` to a managed
  adapter (for example Deepgram STT + a hosted Kokoro/Aura TTS), add the key, flip
  `VOICE_ENABLED=true`. The backend is genuinely a one-minute change. The ONE thing that is
  not a key-add: the Expo app needs a push-to-talk screen (mic capture + audio playback),
  roughly a day of client work. Honest ceiling, do not promise "one minute" for the app UI.
- **Phase 6 (scale + polish):** self-host the STT/TTS (Parakeet + Kokoro/Piper) and add
  LiveKit only if full-duplex is demanded; add voice-specific rubric signals (pace, pause,
  filler rate) from COMMUNICATION-PRINCIPLES.md, additive to the pack schema. The engine,
  validator, and content model are untouched throughout: voice only adds the speech-in and
  speech-out surfaces, so the moat never moves.

---

## 9. Moat and privacy (they reinforce each other, they do not conflict)

The moat is NOT stored conversations. Hoarding users' private practice chats would be the
weakest possible moat and the largest liability. The durable moats are three, and none
require keeping transcript content.

### 9.1 The three moats
- **Execution + content.** The deterministic validator, the band-threshold rubrics, and the
  curriculum ordering. Hard to replicate well; lives in code and the content pack, not in
  user data.
- **Habit + distribution.** Streak, the shareable score card, organic reach. Brand and
  behavior lock-in, not data.
- **A privacy-safe efficacy flywheel (9.3).** Compounds on content-free behavioral signal,
  never on conversation content.

### 9.2 The hard line: what is kept vs what is discarded
| Class | Example | Retained? | Why it is safe |
|---|---|---|---|
| Conversation content | the actual transcript of what the user typed | NO. auto-expire 60 days, incognito, one-tap hard delete | sensitive, and NOT the moat |
| Skill state | "mastered followups in 6 reps", mastery counters, streak | yes, per-user, event-sourced | behavioral, not content |
| Efficacy signal | "warmth rose on turn 4", "drill A improves scores 20% faster than B", content-free | yes, aggregate, anonymous, closed-props | no content, no PII |

### 9.3 The flywheel runs on derived signal, not content
At session end the server computes the content-free signals (already in `analytics_events`
and `progress_events`), then the transcript expires. From aggregate anonymous behavior you
tune rubric thresholds, routing, difficulty bands, and review intervals. The transcript is
thrown away; the lesson learned from it stays. This is the Duolingo model: the moat is
learning-efficacy data, not the sentences a user typed. A competitor starting fresh does not
have this signal, and you built it without keeping one private conversation.

### 9.4 Privacy is positioning, not a tax
"Your practice is private and auto-deletes" is a trust claim competitors who train on user
chats cannot make. It is a differentiator, so honor it exactly in copy and in code.

### 9.5 The one landmine (self-host phase)
When self-hosting the model later, do NOT fine-tune on user transcripts. You do not need to:
keep the character model generic and improve it on synthetic roleplay plus the public
corpus. Zero-data-retention with the provider means no training set accumulates by design.
Any future training-data use is an explicit, opt-in, separately-consented decision, never a
silent default.

---

## 10. Abuse and rate limiting (mandatory, independent of the monetization cap)

"Unlimited" text chat is a UX promise, not a technical reality. Free chat is cheap, not free
(per-token Haiku cost), and an unlimited free endpoint is a target. These limits protect
infrastructure and cost and apply on EVERY tier, separately from any product/monetization cap.

### 10.1 Two different limits, never conflate
| Limit | Purpose | Stops |
|---|---|---|
| Product cap (e.g. free challenges/day, if any) | monetization + pedagogy | normal users, to drive upgrades |
| Abuse cap (this section) | protect infra + cost | scripts, bots, farmers, on any tier |

### 10.2 The real threat is cost-farming, not heavy humans
A human doing 20 challenges/day costs ~$0.20. The threats are: (1) LLM-proxy theft (scripting
the endpoint and jailbreaking the character to use subsidized Haiku as a free general LLM),
(2) volume/DoS to run up the bill, (3) bot farms multiplying both.

### 10.3 Layered defense (build with the free tier, not after)
1. **Auth-gate everything.** No anonymous unlimited access; every request tied to a verified
   Clerk account. Raises the cost of farming.
2. **Rate limits, multiple windows,** per account: about 6 messages/min, 60/hour, and a soft
   ~30 challenges/day. Set so high no real human notices; a script trips it in seconds.
3. **Per-user daily inference-cost ceiling** (hard server-side circuit breaker), for example
   ~$0.30/user/day (~30 challenges). This is the real backstop, metered from a usage table,
   never trusted to the client.
4. **Global daily-spend circuit breaker** (already in the design), so one incident cannot run
   up an unbounded bill.
5. **Structural defense (the strongest):** the character only does charisma roleplay, never
   arbitrary Q&A. Harden the system prompt against jailbreaks and off-task requests, so a
   stolen endpoint that only ever plays "Sam at a party" is near-worthless as a free LLM,
   which removes the incentive to farm it.
6. **Bot defense on signup:** email/phone verification, device + payment fingerprint, signup
   anomaly detection; escalate to captcha or shadow-throttle when thresholds trip. No repeat
   free-trial resets (ties to the avatar tier trial in AVATAR-TIER-PRICING.md).
7. **Bound per-call cost:** short `max_tokens` + prompt caching (already specified), capping
   the damage of any single request.

Mental model: a generous soft limit for humans, hard limits for machines. A real user never
feels it; a script hits a wall fast. The avatar tier adds its own per-minute cap and spend
breaker on top (AVATAR-TIER-PRICING.md); this section covers the free text surface.

---

## 11. Trust, memory, and real-world transformation (from competitive research)

Requirements derived from mining 3,700 App Store reviews across 15 competitors
(COMPETITOR-REVIEW-MINING.md, RESEARCH-PLAN.md). Each counters a dominant category failure.

### 11.1 Trust-by-construction billing (counters the #1 category complaint)
Subscription/trial deception was the single largest pain cluster, present in all 15
competitors. Turn it into a differentiator:
- The user experiences real AI feedback BEFORE any card is required (free text needs no card;
  the avatar's 15-minute trial precedes payment).
- A visible in-app cancel path, reachable in at most two taps, honored immediately.
- A pre-charge reminder before any subscription renews (and before a trial converts to paid).
- Transparent price shown plainly; NO forced annual upsell during onboarding, lead with
  monthly (AVATAR-TIER-PRICING.md).

### 11.2 Memory and continuity (counters "the AI forgets me" and "generic/robotic")
Competitors lose users when the AI forgets them or paywalls memory. We already event-source
progress and hold an interest graph, so surface it:
- Feedback and the character reference the user's stated weak points and prior sessions (a
  compact user-memory summary: goals, recurring weak signals, last-session note, fed into the
  feedback prompt).
- Basic memory is never paywalled. Personalized continuity is a default, not an upsell.

### 11.3 Real-world transformation + anti-parasocial stance (counters "no transfer" and "addiction")
The sharpest gap: competitors are practice destinations that never prove real-life transfer,
and companion apps draw self-reported addiction/displacement complaints. Our position:
rehearsal that pushes the user back OUT into real life.
- Measure real-world improvement, not only in-app score: self-reported before/after on a
  concrete situation, and outcome check-ins after named events.
- Reward users for real conversations they report having, not for in-app time.
- New event types: `real_world_report`, `situation_outcome` (append-only, content-free where
  possible), feeding a "real conversations reported" metric. This is the retention and
  word-of-mouth engine, and the honest proof the pedagogy works.

### 11.4 Outcome-tied scenarios (counters generic "practice your charisma")
The features users praise are tied to a real event (an interview, a date, a hard talk).
- Onboarding captures the user's target situation; scenarios carry a real-event tag; the app
  can serve practice tied to a named upcoming event. Higher engagement and willingness-to-pay.

### 11.5 Reliability as P0 for the voice/avatar tier (counters "broken mic/crashes")
Voice competitors bleed 1-stars from unresponsive mics, frozen analysis, and crashes, in
products whose whole value is voice. When the avatar/voice tier ships (Phase 6), mic capture,
audio reliability, and the interrupt/barge-in path are launch-blocking acceptance criteria,
not afterthoughts.
