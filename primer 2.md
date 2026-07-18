# Primer: Communication Trainer (voice-first, three-mode). "Cadence" (placeholder name)

## What this is
A voice-first mobile app. One screen, one "Call" button. Tap it, you are in a live
spoken roleplay with an AI partner, hang up, get a short result (one win, one fix,
progress ring ticks). Three modes on one shared engine, one brand ("become a better
communicator"), all live at launch:
- **SALES** (discovery, objections, closing; AI = resistant prospect)
- **PUBLIC SPEAKING** (delivery, story, presence; AI = audience/host)
- **EVERYDAY** (everyday conversation/connection: ask good questions, listen, make
  others feel interesting; AI = a new acquaintance who warms up only if you reciprocate)
UI principle: "limit the details, make the details perfect." The 3 surfaces to perfect:
the mode selector, the call, the result card. No lesson menu, no browsing.

## Pedagogy = the moat (Alpha School model, encoded)
A mastery-learning **constraint engine**: diagnostic placement, prerequisite skill
tree, serve exactly ONE drill at a time, mastery gate before advancing, forced spaced
review, per-user event-sourced state. Enforced, not suggested: the engine picks each
call's drill; the user cannot browse or skip. Moat = pedagogy + state (BUT audit says
copyable; real edge = execution + niche + founder-fit). Scoring: the LLM plays the
partner AND scores each attempt against a rubric; a backend validates DETERMINISTICALLY
with zero inference (recompute countable signals by parsing transcript, substring-check
the LLM's evidence quotes, apply pass rule, own the mastery counter). The LLM can flatter
prose but cannot mint an unearned pass or advance state.

## Tech stack (CHOSEN, in prd.md)
- Mobile: React Native + Expo (Clerk + LiveKit both first-class). Web: Next.js (marketing
  + Stripe checkout + account), self-hosted in Docker.
- Voice: self-hosted **LiveKit** (WebRTC SFU + TURN) + **LiveKit Agents (Python)** worker
  with Deepgram STT + Deepgram Aura TTS + Anthropic Haiku plugins. Barge-in native.
  Target voice-to-voice p50 ~1.3s / p95 <=2.5s. NO ElevenLabs.
- Backend: Python 3.12 + FastAPI + SQLAlchemy2/Alembic. Engine + validator + agent share
  one package (`cadence_core`). Postgres 16 (event log + projections + content + subs).
  Redis 7 (live session state, incognito counters, caps, idempotency). arq for jobs.
- Auth: **Clerk** (pinned). Payments: **Stripe** web only (login-only app, reader model).
- Infra: **self-hosted VPS** (Hetzner CPX41-class), Docker Compose, Caddy TLS, Grafana/
  Prometheus/Loki, self-hosted Plausible, restic offsite backups. No PaaS.

## Business model (paid-only, no free tier)
- $12/mo OR annual = 2 months free ($120/yr). 30-day money-back guarantee. ~30% annual
  mix -> blended ARPU ~$11.40/mo; ~20% month-1 refunds.
- Stripe on WEB (app login-only, like Spotify/Netflix); keeps ~97%. Since the 2025 US
  ruling you can also add an in-app external-checkout link commission-free (US). No Apple
  IAP. Confirm current App Store guidelines (reader model = guideline 3.1.3(a)).
- Per-user econ (realistic): ARPU $11.40 - Stripe $0.55 - AI ~$4 = ~$6.85 contribution
  (~60% margin). AI ~$4 assumes owned voice loop at scale (LiveKit self-host) + 90% prompt
  cache hit. Session cap = 3 scored calls / 30 voice-min per day (pedagogy AND cost control).
- COST-INVERSION TENSION (unresolved): a DAILY-habit user (the success case) runs 30+
  calls/mo -> $7-10 COGS, thin/negative at $12. The "$2.50-4.50 realistic" hides this by
  assuming users do NOT form the daily habit the product is built for. Watch blended cost
  as retention rises. Fixes: shorter drills, $19, or SMB seats ($49-99).
- 7-yr net paying-sub scenarios / Y7 monthly profit (pre-tax, after fees+costs): BEAR ~4k
  / ~$23k; REALISTIC ~32k / ~$219k; BULL ~300k / ~$2.35M (bull implies hiring, not modeled).
  Growth is the only real variable; unit econ are stable.

## Competition (researched)
- Sales/speaking = crowded + funded. **Yoodli** ($40M+, closest: sales+interview+speaking
  voice roleplay, $8-20/mo + enterprise, Toastmasters distribution). Yoodli's weakness =
  coaches HOW you speak not WHAT you say + no curriculum = OUR wedge. Also Hyperbound ($18M),
  Second Nature ($38M). Free baseline: ChatGPT voice mode + Kendo free bot.
- Everyday = fragmented, mostly reply-generators (Rizz apps); practice-sim lane thinner
  (Blush, DatingX, Flirtmaxx). Clinical evidence AI social practice cuts anxiety. Higher
  WTP ($7-15/week). Most viral / least contested = best distribution lane.

## Status: design DONE, PRD DONE, not validated, not built
- **prd.md** = Fable's complete build-ready spec (PRD + stack + architecture + data model
  + build plan + sample content for all 3 modes). VERDICT (my review): excellent and
  buildable, faithful to our design. BUT it skips validation (builds full product over 14
  weeks, only checks retention at the very end, never tests distribution) and its last line
  "start Phase 0 tomorrow" should be IGNORED. Other flags: immigration gate absent (I left
  it out of the brief), content authoring under-scoped (the moat + long pole, treated as a
  line item; launch with 1 unit/skill), single-box "50-80 concurrent" claim only tested to
  25, "Cadence" name is crowded (SalesLoft Cadence) so trademark-check.

## Fable audit verdict (earlier)
- Conditional NO-GO as a $12 consumer business / conditional GO as a 30-day experiment.
- #1 killer = distribution against churn (not tech, not pedagogy). $12 can't fund paid CAC;
  organic is a 6-12mo grind; consumer churn 12-18%/mo.
- Suggested pivot: SMB sales teams @ $49-99/seat (budget, lower churn, fits founder's sell
  skill, kills cost inversion). Founder-fit: your edge is SALES ability -> SMB outreach, not
  consumer virality.

## OPEN GATES (resolve BEFORE revenue / before building past validation)
1. ⚠️ IMMIGRATION / F-1: running a revenue business on F-1 needs CPT/OPT authorization.
   Fable says immigration counsel is on the camaradery gate list. VERIFY before any revenue;
   run validation in intent-capture mode until cleared. (Surfaced by Fable, not confirmed here.)
2. DELETE the quarantined transcripts (Vinh Giang + Matt Ryder in SOURCE-DO-NOT-SHIP/).
   Quarantine is a story; deletion is a fact.
3. IP counsel sign-off on any authored corpus before public launch.

## EXACT NEXT STEP (do NOT build the app yet)
Run **VALIDATION-PLAN.md**: one voice demo (Vapi/Retell + prompt) + landing + intent
capture, ONE mode, 30 days of demo content. Decide by pre-set thresholds: 500 trials /
8% would-pay / 20% return. Gate behind the immigration check + delete transcripts first.
Only if it clears, build from prd.md (Phase 1 = the voice loop first, on real LTE).

## Timeline (solo, AI-assisted, ~full-time; part-time ~1.5-2x)
~6 weeks to KNOW if you should build (validation). ~3 months to a chargeable one-mode MVP.
~5-6 months to full 3-mode launch. Long poles: real-time voice reliability (rented early),
content authoring (the moat), last-20% polish. Only the week-6 gate is a real date now.

## Artifacts (this folder)
- prd.md: Fable's full build spec (PRD + stack + architecture + build plan + sample content).
- BUILD-BRIEF-FOR-FABLE.md: the self-contained prompt that generated prd.md.
- BUILD-MANIFEST.md: buy/build/write inventory + timeline + stage gates.
- VALIDATION-PLAN.md: the weekend validation prototype (THE NEXT ACTION).
- MCP-ENGINE-SPEC.md: the constraint engine (invariants, state machine, persistence,
  data/retention + incognito in §4a, scalability). [predates own-app pivot; logic still valid]
- SALES-PEDAGOGY.md / PEDAGOGY.md (public speaking) / EVERYDAY-PEDAGOGY.md: the 3 skill packs
  (skill trees + rubric signals). Sales & everyday red-teamed.
- ALPHA-MODEL-ANALYSIS.md: Alpha model applied to communication.
- AUDIT-PROMPT.md: the Fable audit brief.
- MCP-META-PROMPT.md / MCP-BUILD-WORKFLOW.md / PEDAGOGY-META-PROMPT.md /
  EXTRACTION-META-PROMPT.md / META-PROMPT.md: earlier build/meta docs (superseded by the
  voice-first own-app pivot; keep for reference).
- SOURCE-DO-NOT-SHIP/: quarantined copyrighted source (to DELETE).
- transcribe.py / batch_transcribe.py / combine_modules.py: transcription pipeline (done).

## Working rules
- No em-dashes anywhere (owner rule), in any file or reply.
- The design is done; remaining risk is validation (does anyone want it) + execution (voice
  UX, content authoring), NOT architecture.
