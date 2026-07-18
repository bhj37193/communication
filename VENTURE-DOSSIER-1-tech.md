# VENTURE DOSSIER, PART 1: TECHNICAL (Sections 1 to 5)

Charisma chat trainer. Produced 2026-07-18 against FABLE-PROMPT-VENTURE-DOSSIER.md,
building on the locked PRD-CHARISMA-CHAT.md (v1, 2026-07-18). Scope of this file:
Executive summary, Architecture and technical decisions, Data schema and logic,
User-data handling and privacy, Security. Sections 6 to 13 live in later parts.
All decisions are made, not proposed. Figures that depend on unverifiable external
facts are marked ASSUMPTION and listed for human confirmation. No em-dashes anywhere.

---

## 1. Executive summary

**What it is.** A consumer mobile app (iOS and Android, one Expo codebase) that
trains charisma the way Duolingo trains Spanish: one short daily chat challenge with
an AI character who warms up only if you make them feel interesting, and goes flat
if you perform, brag, or monologue. The session ends with instant feedback (one WIN
quoted from your own words, one FIX, THE MOMENT the character warmed or stayed flat),
a deterministic 0 to 100 charisma score, and a streak. The whole loop is 3 to 5
minutes. Positioning: "Charisma is a skill. Train it."

**Who it is for.** English-first, global, ages 18 to 35, the self-improvement and
social-confidence identity. Not dating-coded (dating is a later scenario pack).
Acquisition is organic: short-form video plus a shareable score-card image.

**The wedge.** Everyone believes charisma is fixed; the product proves in the user's
own transcript that it is a measurable, trainable skill. The score is computed by a
deterministic server-side validator from countable conversational signals (open
questions, follow-ups, reciprocity, spotlight share), not by model vibes: identical
transcripts always score identically. That determinism is what makes the score
shareable, defensible, and coachable, and it is the technical moat (Section 3).

**The business in three numbers.** Full derivation in later sections; arithmetic here.

1. **Price: $9.99/month, $59.99/year** (locked in the PRD; web checkout only,
   Paddle as Merchant of Record).
2. **Contribution margin per paid monthly subscriber: about $7.67, roughly 77%.**
   - Gross: $9.99.
   - Paddle MoR fee: 5% + $0.50 (ASSUMPTION: Paddle's standard published rate,
     confirm contract) = 0.05 x 9.99 + 0.50 = $1.00.
   - AI cost: a challenge costs about $0.019 (arithmetic in Section 2.4); a typical
     paid user plays about 2.5 scored sessions/day on about 20 active days/month
     (ASSUMPTION) = 50 challenges x $0.019 = $0.95.
   - Refund and failed-payment reserve: 3% of gross (ASSUMPTION) = $0.30.
   - Infra allocation: about $0.07/user at the 10k-user band (Section 2.5).
   - Contribution = 9.99 - 1.00 - 0.95 - 0.30 - 0.07 = **$7.67 (76.8%)**.
   - Worst-case whale (hits the 10 scored/day cap every day): 300 x $0.019 = $5.70
     of AI cost, still profitable at 9.99 - 1.00 - 5.70 - 0.30 - 0.07 = $2.92.
3. **Break-even subscriber count: about 8 subscribers for infrastructure, about 480
   including a modest founder salary.**
   - Fixed monthly costs at launch: VPS about $19 (EUR 17, Section 2.5) + backup
     storage $4 + domain $1.25 + Apple Developer $8.25 ($99/year / 12) = about $33.
     Clerk and Sentry free tiers cover launch scale.
   - Each paid user carries free users. At an assumed 20:1 free-to-paid ratio, with
     a free user averaging 8 play-days/month (ASSUMPTION): 20 x 8 x $0.019 = $3.04
     of free-tier AI cost per paid user.
   - Net contribution after free subsidy = 7.67 - 3.04 = $4.63.
   - Infrastructure break-even: 33 / 4.63 = 7.1, so **8 subscribers**.
   - Founder-salary break-even at KRW 3,000,000/month drawn (about $2,200 at 1,360
     KRW/USD, ASSUMPTION on rate and draw): (2,200 + 33) / 4.63 = 482, so **about
     480 subscribers**.

**The single biggest risk.** Demand and retention, not technology (PRD Section 7.6).
The engine, validator, cost caps, and privacy architecture all work regardless of
whether users come back; nothing matters if the daily loop is not voluntarily
replayed. That is why Phase 0 is a two-week real-stack slice whose only success
metric is unprompted next-day return by outside testers, measured before any further
product code is written. If the aha gate fails, the sunk cost is two weeks and
pennies of inference, and iteration happens in persona prompts, not the codebase.

---

## 2. Architecture and technical decisions

### 2.1 System summary (from the PRD, not re-derived)

One Hetzner-class VPS runs everything under Docker Compose: Caddy (TLS termination,
reverse proxy), the Fastify API (Node 22, TypeScript), the Next.js marketing and
checkout site, Postgres 16, and Uptime Kuma. restic runs on the host via cron for
nightly encrypted backups to a Hetzner Storage Box. The mobile app (Expo) and the
web app authenticate with Clerk. The API server is the only component that talks to
the model provider (Anthropic `claude-haiku-4-5` behind a swappable `ChatModel`
interface), Postgres, and Paddle. Paddle and Clerk call back into the server via
signature-verified webhooks.

The server owns all state. The engine is a server-side state machine (ACTIVE,
REVIEW_DUE, SESSION_OPEN, CAPPED); the client can only take the actions the current
state permits and can never advance its own state. Warmth (0 to 3) is held
server-side and injected into each character turn; it never reaches the client
during play. On session end, one feedback model call proposes prose and labels only;
the deterministic validator recomputes every countable signal from the raw
transcript, substring-checks every quote the model cited, applies band-threshold
pass rules, and computes the score. The model can never mint a pass or a score.

### 2.2 Decisions table

| # | Decision | Alternative rejected | One-line reason |
|---|---|---|---|
| 1 | Self-hosted VPS (Hetzner + Docker Compose + Caddy) | Vercel / Supabase / Railway / Render / Lambda | Fixed EUR 17 to 155/month at every scale band versus usage-billed PaaS that punishes exactly the free-tier traffic the business model depends on; no platform lock-in. |
| 2 | TypeScript + Fastify backend | Python + FastAPI | The voice stack that justified Python is gone; one language and shared Zod schemas across app, server, and web is real solo-dev velocity, and the validator is string logic with no Python advantage. |
| 3 | No Redis in v1 | Redis for counters, queues, cache | Postgres handles daily counters and the expiry job at this scale; one boring store, one backup, one failure mode; add Redis only when a measured hot path demands it. |
| 4 | Deterministic server-side validator computes the score | Model-graded scoring | Identical transcripts must score identically for the score to be shareable and defensible; the model fabricates, the validator recomputes and evidence-checks every quote. |
| 5 | Paddle Billing (Merchant of Record), web checkout only | Stripe | Stripe is unavailable to Korea-based businesses, and MoR means Paddle is seller of record remitting global VAT and sales tax, so the Korean entity receives B2B-style payouts and never chases per-country tax. |
| 6 | `claude-haiku-4-5` behind a `ChatModel` interface | Direct SDK calls, or self-hosted weights now | Cheapest capable character model today with prompt caching; the interface plus a named swap trigger ($8k/month spend twice in a row) keeps the exit cheap without building GPU infra prematurely. |
| 7 | Freemium (1 free scored challenge/day forever) | Paid-only, or trial-then-wall | The free daily loop is the growth engine and costs about $0.15/month per average free user (arithmetic in 2.4); the wall appears only at the moment of desire ("One more"). |
| 8 | Clerk for auth | Self-rolled JWT auth | Login across Expo and Next.js with Apple/Google/email, session management, and JWKS verification is undifferentiated heavy lifting; free to 10k MAU. |
| 9 | Own content-free `analytics_events` table + SQL | PostHog / Amplitude / Mixpanel | Content can never leak to a vendor if there is no vendor; a closed Zod props schema with no free-text fields makes the analytics content-free by construction. |
| 10 | Event-sourced progress (append-only log + rebuildable projections) | Mutable state tables | New metrics later are new folds, never migrations of history; the log also gives a free audit trail of every pass, fail, and entitlement change. |

### 2.3 VPS topology (text diagram)

```
                         Internet
                            |
                     [Hetzner VPS]
                            |
              Caddy :443  (TLS 1.3, HSTS, reverse proxy)
               /                          \
    api.[domain]                      [domain], www
         |                                 |
   api (Fastify, Node 22)           web (Next.js, static-first)
         |
         +--> postgres:5432 (Docker volume, not exposed to host network)
         |
         +--> HTTPS out: Anthropic API (ChatModel), Clerk JWKS, Sentry
         |
         <-- HTTPS in via Caddy: Paddle webhooks, Clerk webhooks
         |
   uptime-kuma (status + alerting, own subdomain, basic-auth)

   Host (outside Docker): sshd (keys only), ufw, fail2ban, auditd, AIDE,
   restic cron --> Hetzner Storage Box (encrypted offsite backups)
```

### 2.4 Cost per challenge (the number everything else leans on)

Haiku 4.5 at $1/MTok input, $5/MTok output, cache reads at $0.10/MTok (ASSUMPTION:
current published pricing, confirm before launch). Typical challenge: 10 character
calls (cap 12) and 1 feedback call.

- Character calls, cached system prefix ~2,000 tokens each:
  10 x 2,000 = 20,000 cache-read tokens x $0.10/MTok = $0.002.
- Character calls, uncached input (growing transcript), ~800 tokens average:
  10 x 800 = 8,000 tokens x $1/MTok = $0.008.
- Character output, capped 120 tokens, ~60 average:
  10 x 60 = 600 tokens x $5/MTok = $0.003.
- Feedback call: 2,500 in x $1/MTok = $0.0025; 600 out x $5/MTok = $0.003.
- **Typical total: 0.002 + 0.008 + 0.003 + 0.0025 + 0.003 = $0.0185, call it $0.019.**
- Worst case (12 calls, one feedback retry): 0.0024 + 0.0096 + 0.0036 + 0.011 =
  $0.027. Planning budget stays $0.02 blended, and the Phase 0 gate requires the
  measured number from `model_usage` to be at or under $0.02 before advancing.

### 2.5 Scale-band plan (one box, vertical, then a two-box split)

All prices are ASSUMPTIONS pinned to Hetzner's published list (confirm current
pricing and VAT treatment at order time).

| Band | Users (registered) | Hardware | Est. monthly | What changes |
|---|---|---|---|---|
| Launch | 0 to ~2,000 | 1x CPX31 (4 vCPU, 8 GB, 160 GB NVMe) + Storage Box BX11 (1 TB) | ~EUR 17 + EUR 4 = **EUR 21** | Nothing. Everything from Section 2.3 on one box. |
| 10k | ~10,000 | Vertical resize to 1x CPX51 (16 vCPU, 32 GB) + same Storage Box | ~EUR 65 + EUR 4 = **EUR 69** | One resize, minutes of downtime in a low-traffic window. Same Compose file. |
| 100k | ~100,000 | 2x dedicated-vCPU boxes on a Hetzner private network: app box CCX33 (8 vCPU, 32 GB) + Postgres box CCX33, + larger Storage Box | ~EUR 48 + EUR 48 + EUR 10 = **EUR 106 to 155** | Split Postgres onto its own box (change one DATABASE_URL). Caddy and both apps stay on the app box. Still managed-nothing. |

Why this holds, arithmetic: at 100k registered users, assume 30% daily actives each
playing one challenge of ~12 API round-trips: 30,000 x 12 = 360,000 requests/day =
4.2 requests/second average, maybe 40 to 80 rps at evening peak. The API is
I/O-bound on the model provider, not CPU-bound; a 4 vCPU box is bored at launch and
a 16 vCPU box is bored at 10k. Storage: transcripts live 60 days; 30,000
sessions/day x ~2 KB = 60 MB/day x 60 days = **3.6 GB of hot transcript data at
100k users**, which is nothing. The real cost at scale is the model bill (30,000 x
$0.019 = $570/day = ~$17k/month worst case if every DAU played daily; the PRD's
blended expectation is $5k to $10k/month), which is exactly why the free tier is one
challenge, the circuit breaker exists, and the model-swap trigger is $8k/month twice
in a row. Infrastructure is noise; inference is the cost line.

Scaling past 100k (not built now, path named): add a second app box behind Caddy's
load balancing or a EUR 6 Hetzner LB, keep one Postgres writer, add a read replica
only if measured. No Kubernetes at any band.

---

## 3. Data schema and logic

The full table DDL lives in PRD Section 3.6 and is not reprinted. This section gives
the shape, the event-sourcing model, the exact validator and score logic, and the
data classification that makes the privacy architecture legible.

### 3.1 Entity-relationship overview

- `users` (keyed to `clerk_id`) is the root. One user has:
  - many `sessions`; each session has exactly one `transcripts` row and one
    `results` row (both TTL'd, Section 4), plus a `warmth_trace` on the session.
  - many `progress_events` (append-only log, the source of truth for progress).
  - one `user_skill_state` row per skill (a projection, rebuildable from the log).
  - many `entitlements` rows (multi-source by design: paddle, apple, google, promo;
    "subscribed" = any active unexpired row, source-agnostic).
  - one `daily_usage` row per day (scored count, incognito count, token totals).
  - many `analytics_events` rows (content-free by construction).
- Content: `skill_packs` 1-N `skills` 1-N `units`; a unit's full spec (persona,
  warmth rules, rubric) is server-only JSONB, never sent to the client (INV-7: the
  corpus is never enumerable through the API).
- `model_usage` rows hang off sessions (tokens per call, tagged character or
  feedback) and drive the cost cap and the swap decision.
- `paddle_events` stands alone: `event_id` primary key gives webhook idempotency.

### 3.2 The event-sourcing model

`progress_events` is an append-only log (`seq BIGSERIAL`, `user_id`, `type`,
`payload JSONB`, `created_at`) with no UPDATE or DELETE grants for the application
role. Event types: `session_started`, `message_exchanged` (counts only, never
content), `attempt_submitted`, `unit_passed`, `unit_failed`, `skill_mastered`,
`review_scheduled`, `review_passed`, `review_failed`, `placement_set`,
`streak_updated`, `entitlement_changed`.

`user_skill_state` and the streak are folds over this log, rebuildable from scratch.
Adding a metric later means adding a projection, never migrating history. Two
deliberate exceptions to append-only: (1) the GDPR/PIPA hard delete removes a user's
rows via a privileged role in one transaction, because the right to erasure
outranks the log; (2) nothing else. The mastery counter lives only in the fold, so
the model, the client, and even a buggy handler cannot advance mastery except
through validated `unit_passed` events.

### 3.3 The deterministic validator (restated exactly, from PRD 4.5)

Pure TypeScript in `packages/core`, zero I/O, zero inference, fully unit-tested
against fixture transcripts in CI. Heuristics are versioned with the content pack.

Message classifiers (user messages only):
- `is_question`: contains `?`.
- `is_open_question`: question AND matches the curated open-starter list (`what,
  how, why, tell me, describe, walk me through, where did, what's it like, which
  part, who ...`) AND does not match the closed-starter list (`do you, did you, are
  you, is it, was it, have you, would you, can I`). Lists ship with the pack.
- `is_followup`: shares at least one content word (>= 4 chars, stopword-filtered,
  stemmed) with the character's immediately previous message, or contains an
  explicit back-reference ("you said", "that trip", the character's mentioned nouns).
- `is_self_disclosure`: non-question sentence, first person (`I/my/we`), >= 6 words.
- `word_count` per message.

Recomputed signals:
- `open_questions` = count of open-question messages.
- `followups` = count of follow-up messages.
- `reciprocity` = count of self-disclosure messages occurring AFTER the first
  character turn at warmth >= 2.
- `spotlight_share` = (messages about the character: any question to them or
  follow-up on their content) / (total user messages).
- `interview_mode` = true if any run of 3+ consecutive user questions contains zero
  self-disclosure.
- `monologue_brag` = true if any user message > 60 words, OR the model flagged a
  brag AND its quoted evidence substring-matches the transcript.
- `final_warmth` = last value of the server-held warmth trace (0 to 3).

Evidence check: every quote in the feedback JSON (win.quote, moment.quote, any brag
quote) must be an exact substring of the correct speaker's concatenated messages
after whitespace normalization. One failure rejects the whole feedback object:
regenerate once, then fall back to deterministic template feedback assembled from
the validator's own signals, so the user always gets a result and a fabricated
quote can never reach a user or mint a pass.

Pass rule: every `hard` rubric line's signal must land inside its band. Bands, not
floors: too many questions fails as surely as too few (interrogation); too much
self-talk fails like too little. The only way to pass is to actually do the thing.

Mastery: passes are counted per skill across distinct local days; at
`passes_required` (default 2) the skill is mastered, the next unlocks per
prerequisites, and spaced review is scheduled at 2, 7, 21 days; a failed review
re-queues at box 1 and blocks new material.

### 3.4 The score formula (restated exactly, from PRD 4.6)

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

Weights live in the pack's SignalDefs, tunable per unit without code changes.
Server-computed; the model never sees or produces the score. Same transcript, same
score, always.

### 3.5 Data classification (per PRD 9.2, extended to every table)

Three classes. The privacy architecture is exactly this: class A dies fast, class B
is behavioral and per-user, class C is the moat and contains no content.

| Class | Definition | Tables / fields | Retained? |
|---|---|---|---|
| **A. Conversation content** | What the user actually typed, and prose derived from it | `transcripts.messages`; `results.win/fix/moment` (contain quoted user lines); `sessions.warmth_trace` reason codes tied to a session | NO as a durable asset: auto-expire at 60 days, never persisted at all in incognito, one-tap hard delete, excluded from analytics by construction |
| **B. Skill state** | What the user can do, not what they said | `progress_events` (payloads are counts, ids, and enums, never content), `user_skill_state`, streak, `daily_usage`, `entitlements`, `users` (clerk_id, timezone) | Yes, per-user, event-sourced; deleted on account deletion |
| **C. Content-free efficacy signal** | Aggregate behavioral signal that tunes the product | `analytics_events` (allowlisted names, closed Zod props, no free-text fields), `model_usage` (token counts and tags only), aggregated signal distributions | Yes, indefinitely; contains no content and no message text by construction |

Class A is deliberately NOT the moat (PRD Section 9): the flywheel runs on class C.
At session end the server computes the content-free signals, and the transcript is
on a countdown. The lesson learned from a conversation outlives the conversation.

---

## 4. User-data handling and privacy

### 4.1 The full data lifecycle: collected, why, where, how long, how it dies

| Data | Why collected | Where it lives | How long | How it dies |
|---|---|---|---|---|
| Chat transcript | Run the session, score it, show WIN/FIX/MOMENT | `transcripts` (Postgres, Docker volume, EU datacenter) | `expires_at = created_at + 60 days`; "Save this conversation" (paid) nulls the expiry | Daily hard-delete job on `expires_at`; or hard delete; or never written (incognito) |
| Result card (WIN/FIX/MOMENT, score, signals) | Show the result and (paid) history | `results` | Same 60-day TTL; score history (paid) keeps numeric scores only after prose expires | Same daily job; hard delete |
| Warmth trace | Server-authoritative meter, eval fixtures | `sessions.warmth_trace` | Life of the session row | Deleted with session on hard delete; sessions pruned with transcripts |
| Incognito session | The feature is the absence of data | Process memory only (Map keyed by session id, TTL 30 min) | Minutes | Process memory reclaim; only DB write is `daily_usage.incognito_count += 1` |
| Progress events, skill state, streak | The product's memory of ability | `progress_events`, `user_skill_state` | Life of the account | Hard delete in one transaction |
| Identity | Auth | Clerk (processor); `users` stores clerk_id + timezone only | Life of the account | Clerk `user.deleted` webhook triggers our hard delete; we never store email or name in our DB |
| Payment data | Billing | Paddle (Merchant of Record; card data never touches our systems) | Per Paddle's retention as seller of record | Paddle's obligation; our `entitlements` rows die with the account |
| Analytics events | Retention and conversion measurement | `analytics_events`, content-free by construction | Indefinite in aggregate; per-user rows deleted on hard delete | Hard delete removes the user's rows; aggregates keep no user key |
| Model usage (tokens, tags) | Cost cap, swap decision | `model_usage` | Indefinite | No content; session linkage dies with sessions |
| Model provider processing | Generate replies and feedback | Anthropic API, zero-data-retention configured at the org level | Transient processing only, no training, no retention (contractual) | ZDR: nothing stored to die. Copy stays honest: "retained nowhere on our side" still means the model processed it transiently |
| Error reports | Fix crashes | Sentry, `beforeSend` strips request bodies and PII | Sentry default (90 days) | Scrubbed at source; no content ever sent |
| Server logs | Ops and security | Caddy access logs + auditd on host (no message bodies logged, ever) | 90 days, logrotate | Rotation |
| Backups | Disaster recovery | restic, encrypted, Hetzner Storage Box | 7 daily, 4 weekly, 3 monthly (about 90 days max) | Snapshot rotation; see 4.4 for the deletion gap |

### 4.2 Retention and deletion mechanics (enforced, not aspirational)

- **60-day transcript TTL**: a daily job hard-deletes expired `transcripts` and
  `results` rows. The job is tested in CI with fixture rows and its last-run
  timestamp is monitored (Uptime Kuma heartbeat); a TTL job that silently stops is
  a privacy incident, not a bug.
- **One-tap hard delete** (`DELETE /v1/me/data`): deletes transcripts, results,
  sessions, progress events, and analytics rows for the user in ONE transaction.
  Real DELETE, no soft flag, followed by a scheduled VACUUM. Account deletion via
  Clerk cascades through the `user.deleted` webhook to the same path.
- **Incognito**: memory-only by construction, asserted by an integration test that
  runs an incognito session and then proves zero DB rows exist except the daily
  counter increment.
- **Deletion log**: a `deletion_requests` table stores a salted hash of the deleted
  clerk_id plus the date, retained 12 months, so deletions can be replayed against
  a restored backup (4.4). It stores no identity in the clear. (Counsel item 4.6.)

### 4.3 Zero-data-retention with the model provider

Anthropic org configured for zero data retention: inputs and outputs are not
retained or used for training (ASSUMPTION: ZDR remains available on the account
tier used; confirm in writing before launch and keep the confirmation on file).
Consequences honored in product copy: incognito's promise is "retained nowhere on
our side"; the model still processes text transiently and the copy never claims
"nobody ever saw it". If the provider swap fires (self-hosted weights), retention
goes to zero by locality and the PRD's landmine rule applies: never fine-tune on
user transcripts; any future training use is explicit, opt-in, separately consented,
never a silent default.

### 4.4 The backup-deletion gap (named, bounded, documented)

Backups are point-in-time encrypted snapshots; a hard-deleted user's data persists
in old snapshots until rotation (at most ~90 days). Policy: (1) backup retention is
capped at the schedule above, so deletion is complete everywhere within 90 days of
the request; (2) any restore from backup is followed, before the system returns to
service, by replaying `deletion_requests` so restored data of deleted users is
re-deleted; (3) the privacy policy states the 90-day backup window plainly. This is
the standard, defensible pattern; counsel confirms the disclosure wording (4.6).

### 4.5 GDPR + Korean PIPA compliance checklist

The entity is a Korean SME serving global users in English. PIPA applies to the
controller entity; GDPR applies because EU users are served. Helpful fact: the EU
adequacy decision for Korea (2021) eases EU-to-Korea data flows.

| Item | GDPR | PIPA | Status / decision |
|---|---|---|---|
| Lawful basis | Contract (Art 6(1)(b)) for account, sessions, scoring, entitlements; legitimate interest (6(1)(f)) for security logs, rate limiting, cost caps; consent (6(1)(a)) only for optional marketing email (none at launch) | PIPA is consent-centric: collect consent at signup for the minimum item set (identifier, timezone, session content for the stated purpose), with separate optional consents kept unbundled | Map each table to a basis in the privacy policy; no optional consent bundled with signup |
| Data minimization | We store clerk_id + timezone; no name, email, birthdate, or location in our DB | Same posture satisfies PIPA's minimum-collection principle | Done by design |
| DSAR / access + export | Art 15/20: export = JSON dump of the user's rows (transcripts not yet expired, progress, scores) via a support flow at launch, self-serve later | PIPA access/correction rights: same mechanism | Manual within 30 days at launch is acceptable; automate when volume demands |
| Deletion | Art 17: `DELETE /v1/me/data` + account deletion cascade, plus the backup replay (4.4) | PIPA destruction duty: same mechanism; PIPA also requires destruction when the retention purpose ends, which the 60-day TTL implements | Built in Phase 0 |
| Retention schedule | Documented per the lifecycle table (4.1) | PIPA requires stating retention periods in the privacy policy | The 4.1 table IS the schedule; publish it |
| Minors | Consent age for information-society services is 13 to 16 depending on member state | Under-14s require legal-guardian consent | Decision: terms set minimum age 16 globally, signup self-attestation, no child-directed marketing, store rating 12+/Teen; no birthdate collected (minimization) so enforcement is attestation-based. Counsel item |
| Cross-border transfer | Our processors are non-EU: Anthropic (US), Clerk (US), Sentry (US), Paddle (UK), Hetzner (DE/FI, in-EU). Use each processor's DPA with SCCs or EU-US Data Privacy Framework certification | PIPA Art 28-8: overseas transfer of Korean users' data requires disclosure (or consent): name each recipient, items, purpose, retention, country, in the privacy policy | Execute DPAs with all five; add the PIPA overseas-transfer disclosure block to the Korean-language policy |
| Representatives | Art 27 EU representative likely required (services offered to EU, no EU establishment); same question for a UK rep | Domestic entity, no agent needed; designate the mandatory CPO (개인정보 보호책임자): the founder | Counsel item: appoint low-cost Art-27 rep service pre-launch or confirm exemption |
| Breach notification | Art 33: notify supervisory authority within 72 hours where risk | PIPA: notify affected users and report to PIPC without undue delay (thresholds apply) | Wired into the incident-response playbook (5.10) |
| Privacy policy | English, plain-language, mirroring 4.1 | Korean-language version with PIPA-mandated items (CPO contact, overseas transfer, retention, destruction procedure) | Publish both at launch |
| Processor inventory | Anthropic, Clerk, Paddle, Sentry, Hetzner, GitHub (code only, no user data) | Same list disclosed | Maintain in the policy; adding a processor is a policy change |

### 4.6 Named items for privacy counsel review (human gate, do not launch past these silently)

1. PIPA Art 28-8 overseas-transfer wording: disclosure versus consent for each of
   the five processors, in the Korean policy.
2. GDPR Art 27 EU representative (and UK equivalent): required or exempt, and the
   cheapest compliant provider.
3. Minimum-age decision (16 global, attestation-only, no birthdate collected):
   confirm this satisfies both PIPA under-14 rules and member-state consent ages.
4. The backup-deletion gap disclosure (90-day window) and the salted-hash
   `deletion_requests` table (is a hash of a deleted user's id itself acceptable).
5. Anthropic ZDR contractual confirmation and DPA scope; Paddle DPA scope as MoR
   (controller for payment data) versus processor for the clerk_user_id we pass in
   `custom_data`.
6. Whether practice-conversation content could be deemed sensitive-category data
   when users volunteer sensitive facts, and whether the 60-day TTL plus incognito
   plus no-content-analytics posture is sufficient mitigation (we believe yes; get
   it in writing).

---

## 5. Security

Reference library: the Anthropic Cybersecurity Skills repo
(https://github.com/mukul975/Anthropic-Cybersecurity-Skills). Skills applied, and
where:

| Skill | Applied to |
|---|---|
| `conducting-api-security-testing` | Pre-launch test pass over the 10-route API surface (5.3), repeated each phase gate |
| `configuring-oauth2-authorization-flow` | Clerk OAuth (Apple/Google) flow review, JWT verification, token lifetimes (5.4) |
| `configuring-tls-1-3-for-secure-communications` | Caddy TLS policy, HSTS, protocol floor (5.8) |
| `auditing-terraform-infrastructure-for-security` | Adapted to Docker Compose: audit the Compose file as infrastructure-as-code (5.7) |
| `configuring-host-based-intrusion-detection` | AIDE + auditd + fail2ban on the VPS host (5.7) |
| `analyzing-linux-audit-logs-for-intrusion` | auditd ruleset and the weekly log review habit (5.9) |
| `building-incident-response-playbook` | The one-page playbook (5.10) |

Priorities: **[LAUNCH]** = blocking, ships before public availability.
**[LATER]** = scheduled, with the phase named.

### 5.1 STRIDE threat model

| Threat | Vector | Mitigation | Priority |
|---|---|---|---|
| Spoofing | Stolen/forged Clerk JWT used against the API | Verify signature against Clerk JWKS on every request, check `exp`, `aud`/`azp`; short-lived session tokens (Clerk default ~60 s, refreshed by SDK) | [LAUNCH] |
| Spoofing | Forged Paddle or Clerk webhook grants entitlements | HMAC signature verification on both; reject on failure before any parsing side effects (5.5) | [LAUNCH] |
| Tampering | Client tries to advance state, submit a score, or replay `end_session` | Server-owned state machine; the client cannot advance state by construction; score computed only server-side; idempotent session end | [LAUNCH] (already the architecture) |
| Tampering | Prompt injection: user text tries to make the character raise warmth or leak the persona | Warmth is server-clamped to [-1,0,+1] per turn from a Zod-validated closed enum; fabricated quotes are substring-rejected; persona/rubric never leave the server (INV-7); the validator, not the model, gates passes | [LAUNCH] |
| Repudiation | "I never bought / never deleted / never played" | Append-only `progress_events`, `paddle_events` with event ids, `deletion_requests` log, auditd on host | [LAUNCH] |
| Information disclosure | Transcript leak (DB theft, backup theft, log leak) | 60-day TTL shrinks the blast radius; encrypted backups; no content in logs, analytics, or Sentry; Postgres not exposed off the Docker network | [LAUNCH] |
| Information disclosure | Corpus/persona extraction via API enumeration | No list endpoints exist (INV-7); `challenge/today` returns only the client-safe slice | [LAUNCH] (already the architecture) |
| Denial of service | Cost-DoS: scripted accounts burning model spend (the incognito vector, 5.6) | Three-layer caps + global circuit breaker; worst-case daily model loss is bounded at DAILY_MODEL_BUDGET_USD ($50 initial) plus in-flight sessions | [LAUNCH] |
| Denial of service | Plain traffic flood | Caddy rate limiting per IP, fail2ban on auth endpoints, Hetzner's network-level DDoS mitigation | [LAUNCH] basic; tune [LATER, Phase 2] |
| Elevation of privilege | Container escape, or app compromise reaching the host | Least-privilege Docker (5.7): non-root containers, no docker.sock mounts, read-only filesystems where possible, no privileged flags | [LAUNCH] |
| Elevation of privilege | SQL injection | Drizzle parameterized queries only; no string-built SQL; CI grep forbids raw interpolation | [LAUNCH] |

### 5.2 OWASP API Security Top 10 (2023) mapping

| Risk | Exposure here | Control | Priority |
|---|---|---|---|
| API1 Broken object level authorization | `GET /v1/sessions/:id/result`, `:id/messages`, `:id/end` | Every session query is `WHERE id = $1 AND user_id = $2` with user_id from the verified JWT, never from the request; integration test asserts cross-user 404 | [LAUNCH] |
| API2 Broken authentication | All routes except webhooks and /healthz | Clerk JWT verified per request (5.4); webhooks HMAC-verified (5.5) | [LAUNCH] |
| API3 Object property level authorization | Unit spec leaking rubric/persona | Explicit client-safe DTO for `challenge/today`; Zod output schema strips everything not allowlisted | [LAUNCH] |
| API4 Unrestricted resource consumption | Model spend, message length, request rate | 500-char message cap, 12-call session cap, maxTokens caps, per-user daily caps, global budget breaker, per-IP rate limits | [LAUNCH] |
| API5 Broken function level authorization | Paid-only routes (`/v1/me/history`) | Entitlement check middleware reads `entitlements`, not a client claim | [LAUNCH, Phase 2 when the route ships] |
| API6 Unrestricted access to sensitive business flows | Free-tier abuse via mass signup | Per-IP and per-device signup rate limits, Clerk bot detection, incognito counted pre-call (5.6) | [LAUNCH] |
| API7 SSRF | No user-supplied URLs anywhere in the API | Keep it that way; any future webhook/URL feature gets an allowlist | n/a by design |
| API8 Security misconfiguration | Compose, Caddy, Postgres defaults | The 5.7 hardening list; Compose file audited as IaC per the adapted terraform-audit skill | [LAUNCH] |
| API9 Improper inventory | Stale routes, forgotten debug endpoints | The API surface is 10 routes in one Fastify plugin file; CI fails if a route lacks an auth annotation | [LAUNCH] |
| API10 Unsafe consumption of third-party APIs | Anthropic, Clerk, Paddle responses | Zod-validate every external response (model JSON already is); treat webhook payloads as hostile until signature-verified | [LAUNCH] |

### 5.3 API security testing [LAUNCH, repeat each phase gate]

Per `conducting-api-security-testing`: a scripted pass (not a one-off) that runs
against staging: auth bypass attempts on all 10 routes, cross-user object access
(API1), oversized payloads, malformed JSON, replayed webhooks, expired/none-alg
JWTs, rate-limit verification, and the incognito zero-persistence assertion. Lives
in the repo as an integration-test suite; green suite is a phase-gate requirement.

### 5.4 Clerk auth hardening and session/JWT handling [LAUNCH]

Per `configuring-oauth2-authorization-flow`:
- Backend verifies every request's session token against Clerk's JWKS (cached with
  rotation handling); checks `exp`, `nbf`, `aud`/`azp` against the known frontend
  origins. No "decode without verify" anywhere; CI greps for it.
- Short-lived session tokens (Clerk default), refresh handled by the SDKs; no
  long-lived custom tokens minted by us.
- Clerk webhook (`user.created`, `user.deleted`) verified via its Svix signature
  headers before any handler logic.
- Sign-in methods: Apple, Google, email code. No passwords stored by us, ever.
- Clerk dashboard: bot protection on, allowed redirect origins pinned to the app
  scheme and the web domain.

### 5.5 Paddle webhook signature verification and replay protection [LAUNCH]

- Verify the `Paddle-Signature` header (HMAC of timestamp + raw body with the
  endpoint secret) on the RAW request body, before JSON parsing.
- Reject timestamps older than 5 minutes (replay window).
- Idempotency: `INSERT INTO paddle_events (event_id, ...) ON CONFLICT DO NOTHING`;
  a conflict means the event was already processed, return 200 and stop. A replayed
  or duplicated webhook can therefore never double-apply an entitlement.
- Entitlement writes are upserts keyed on the subscription id, so out-of-order
  delivery converges on the latest state (`updated_at` guard).

### 5.6 Abuse and cost control [LAUNCH]

The incognito cost-abuse vector, named: incognito leaves no transcript, so it is
the attractive lane for scripted free spend. Controls, in order:
1. The incognito counter is persisted (`daily_usage.incognito_count`) and checked
   BEFORE any model call; free tier gets exactly 1/day. The privacy promise covers
   content, not the count.
2. Per-IP and per-device signup and session-start rate limits at Caddy and Fastify.
3. Per-session caps: 12 character calls, 2 feedback calls, maxTokens 120/700,
   500-char user messages.
4. Global circuit breaker: a 60-second job sums today's `model_usage`; when
   projected spend exceeds `DAILY_MODEL_BUDGET_USD` ($50 initial), new sessions get
   a friendly "come back tomorrow" and an alert fires; in-flight sessions finish.
   Bounded worst case, arithmetic: $50 cap + in-flight tail (at most a few hundred
   concurrent sessions x ~$0.02 = a few dollars), so a scripted attack costs the
   business roughly $55/day at absolute worst, and the alert fires within 60
   seconds of the threshold.

### 5.7 VPS and Docker hardening [LAUNCH]

Per `configuring-host-based-intrusion-detection` and the Compose-adapted
`auditing-terraform-infrastructure-for-security`:
- SSH: keys only (`PasswordAuthentication no`), root login disabled, non-standard
  port optional (keys are the control, the port is cosmetic).
- Firewall: ufw default-deny inbound; allow 22, 80, 443 only. Postgres and
  uptime-kuma are never published on host ports; they live on the Docker network.
- fail2ban on sshd and on Caddy auth-failure logs.
- Host IDS: AIDE file-integrity baseline (weekly check, alert on drift) + auditd
  with rules on /etc, Docker configs, cron, and auth events.
- Docker least privilege: containers run as non-root users, `no-new-privileges`,
  no `docker.sock` mounted into any container, read-only root filesystems where the
  app allows, resource limits (memory) per service, images pinned by digest.
- Unattended security upgrades for the host OS; Watchtower explicitly NOT used
  (deploys are deliberate, via CI).
- The Compose file is reviewed against the IaC-audit skill's checklist at each
  phase gate: no privileged containers, no host network mode, no secrets in the
  file itself.

### 5.8 TLS 1.3 [LAUNCH]

Per `configuring-tls-1-3-for-secure-communications`: Caddy terminates TLS with
Let's Encrypt, protocol floor set to TLS 1.3 (`protocols tls1.3`), HSTS with a
6-month max-age (preload after store launch settles), OCSP stapling (Caddy
default). All internal service-to-service traffic stays on the private Docker
network; nothing plaintext crosses the host boundary.

### 5.9 Secrets management and audit logging [LAUNCH]

Secrets: age-encrypted env files (sops-age) in the private repo, decrypted at
deploy time by CI onto the box as root-owned `.env` files with 0600 permissions,
injected via Compose `env_file`. No secrets in images, in the Compose file, or in
client bundles. Inventory: Anthropic key, Clerk secret + webhook secret, Paddle API
key + webhook secret, Postgres password, Sentry DSN, restic repo password. Rotation:
on any incident, and routinely every 6 months; the restic password is additionally
printed once and stored offline (losing it loses the backups).

Audit logging, per `analyzing-linux-audit-logs-for-intrusion`: auditd rules on
authentication events, sudo, changes to /etc and Docker configs; app-level audit
events (auth failures, entitlement changes, data deletions, webhook rejections,
circuit-breaker trips) written as structured logs; Caddy access logs WITHOUT
request bodies. Retention 90 days via logrotate. Habit, not tooling: a 15-minute
weekly review of fail2ban bans, auditd anomalies, and webhook rejection counts,
following the skill's triage order. No message content in any log, ever.

### 5.10 Encrypted backups, tested restore, and the incident-response playbook

Backups [LAUNCH]: restic (AES-256, authenticated) nightly to a Hetzner Storage Box:
Postgres dump + Compose configs + Caddy state. Retention 7 daily, 4 weekly, 3
monthly. A restore is TESTED quarterly onto a scratch VPS: restore, boot Compose,
run the smoke suite, tear down, log the result. An untested backup is a hope, not
a control. After any production restore, replay `deletion_requests` (Section 4.4)
before returning to service.

One-page incident-response playbook [LAUNCH], per `building-incident-response-playbook`:
1. **Detect**: Uptime Kuma alert, Sentry spike, circuit-breaker trip, fail2ban
   surge, AIDE drift, or a user report.
2. **Contain**: `ufw deny` inbound except SSH from the founder's IP;
   `docker compose stop api web` if the app layer is suspect. The kill order is
   written down so it is executed, not invented, at 3am.
3. **Assess**: what data classes were reachable (use the Section 3.5 table); check
   auditd and access logs; snapshot the disk before touching anything else.
4. **Rotate**: all secrets in the 5.9 inventory; revoke Clerk sessions; roll the
   Paddle webhook secret.
5. **Notify**: if personal data was breached: GDPR supervisory authority within 72
   hours; PIPA: report to PIPC and notify affected users without undue delay;
   users get plain-language email. Thresholds and wording pre-drafted with counsel.
6. **Restore**: from the last clean restic snapshot; replay deletion log; smoke
   suite green before reopening the firewall.
7. **Post-mortem**: blameless write-up within 7 days; every action item lands in
   the tracker with a date.

### 5.11 Mobile app hardening

- No secrets in the bundle [LAUNCH]: the app holds zero API keys; all model,
  Paddle, and DB access is server-side by architecture. CI greps the built bundle
  for known secret prefixes as a tripwire.
- Secure token storage [LAUNCH]: Clerk session material in expo-secure-store
  (Keychain / Android Keystore), never AsyncStorage.
- Certificate pinning [LATER, Phase 3]: pin to the ISRG Root X1 / Let's Encrypt
  intermediate SPKI rather than the leaf (Caddy rotates leaf certs every 60 to 90
  days, so leaf pinning would brick the app). Shipped alongside store submission,
  with a remote kill-switch config flag so a pinning mistake is recoverable without
  a store review cycle.
- Jailbreak/root detection: NOT built. It adds friction, defeats no motivated
  attacker, and protects nothing here the server does not already protect.

### 5.12 Priority rollup

Launch-blocking: JWT verification, webhook signatures + replay protection, the
server-owned state machine and validator (already the architecture), BOLA tests,
cost caps + circuit breaker, VPS hardening, TLS 1.3 + HSTS, secrets management,
audit logging, encrypted backups + first tested restore, the IR playbook, secure
token storage, no-secrets-in-bundle tripwire, API security test suite.

Later, scheduled: certificate pinning (Phase 3), rate-limit tuning under real
traffic (Phase 2), HSTS preload (post store launch), routine secret rotation
cadence (first rotation at month 6), quarterly restore drills (recurring).

---

End of Part 1 (Sections 1 to 5). Part 2 continues with Section 6 (business model
and pricing) using the $0.019 per-challenge figure and fee assumptions derived here.
