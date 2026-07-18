You are Fable 5, acting as principal engineer and product architect. Produce a complete, build-ready plan for the app described below: a full PRD, the entire tech stack, the architecture and data model, and a phased build plan. **Make every decision yourself. Do not ask me questions. Where anything is ambiguous, choose the best option and briefly say why.** Be concrete and build-ready, not abstract. No em-dashes anywhere in your output.

## Hard constraints (do not change these)
- **Hosting: self-hosted VPS. No managed cloud or PaaS** (no Vercel, Supabase, Railway, Render, serverless). Self-host everything: app server, database, any real-time voice infrastructure, workers, reverse proxy, TLS.
- **Auth: Clerk** (shared across the mobile app and the web).
- **These external services are already chosen (product decisions):** Deepgram for speech-to-text and text-to-speech; Claude Haiku (`claude-haiku-4-5`) as the reasoning model; Stripe for payments. Do not swap these.
- **Everything else is your decision:** mobile framework, backend language and framework, database, the real-time voice orchestration approach (self-hosted on the VPS), deployment tooling, etc. Choose and justify.

## The product

A voice-first mobile communication-coaching app. The entire interface is essentially one screen with one big "Call" button. The user taps it and is instantly in a **live spoken voice roleplay** with an AI partner. They talk like a real conversation or call. They hang up and get a short result: one thing they did well, one thing to fix, and a progress ring that ticks. They do this daily. There is no lesson menu and no browsing.

**Three modes, one shared engine, one brand ("become a better communicator"), all live at launch:**
- **SALES:** persuasion, discovery, objection handling, closing. The AI plays a resistant prospect.
- **PUBLIC SPEAKING:** delivery, storytelling, presence. The AI plays an audience or gives a scenario.
- **EVERYDAY:** everyday conversation and connection. Ask good questions, listen, make the other person feel interesting so they want to keep talking. The AI plays a new acquaintance who warms up only when the user shows genuine interest and reciprocates.

UI principle: "limit the details, make the details perfect." The three surfaces to get perfect are the mode selector, the call itself, and the result card. Keep everything else hidden.

## The pedagogy engine (the moat)

A mastery-learning constraint engine (modeled on Alpha School). It is **enforced structure, not suggestions**:
- A short **diagnostic** places the user by skill level per mode.
- A **prerequisite skill tree** gates progression.
- The engine serves **exactly one drill at a time**, chosen from the user's state. There is no "list lessons" or "jump to X." The user cannot browse or skip.
- The user must hit a **mastery bar** before a skill unlocks the next.
- **Spaced review is forced**: due reviews are served before new material.
- **Per-user progress is event-sourced** (append-only event log; current state is a projection), so nothing is lost and analytics/projections can be added later without migration.

## The voice loop and the scoring model

Real-time voice-to-voice: user speaks, Deepgram streaming STT transcribes, Claude Haiku plays the AI partner and coaches, Deepgram Aura TTS speaks the reply, the user hears it. You design the self-hosted real-time orchestration on the VPS (for example LiveKit or Pipecat or your own pipeline). Target a conversational latency that feels like a slightly laggy but real call. Do not use ElevenLabs (too expensive).

**Scoring (this keeps cost low and the mastery gate hard to game):** Claude Haiku plays the partner and, at the end, scores the attempt against a rubric of objective signals. A backend service holds all per-user state and **validates the score deterministically with zero inference**:
- It parses the labeled transcript and **recomputes the countable signals itself** (talk-to-listen ratio, open-question counts, turn order, monologue length).
- It **substring-checks** that any evidence the LLM cites actually appears in the transcript (rejects fabricated passes).
- It applies the deterministic **pass rule** and **owns the mastery counter**. The LLM judges a single attempt only; it can never advance state.

The customer will practice through the app, so the LLM plays the partner in a live roleplay (the user cannot fabricate a compliant partner). Higher-mastery drills may accept a real recorded conversation.

## Content model (the pedagogy data)

Each mode is a **skill pack** = a skill graph (nodes with prerequisite edges) + units. A **unit** contains: a principle, a short exemplar, drill instructions, an **AI-partner persona and resistance brief** (how the partner behaves and what it withholds), a set of **rubric signals with thresholds**, a coaching prompt, and a mastery threshold. Content is authored from the **public communication canon** (public-speaking canon, public sales methodology such as SPIN and Sandler, and conversation/connection research), not from any copyrighted course. Build the system to store and serve these units through the engine, and include one concrete sample unit per mode.

## Data, privacy, and incognito (a product feature, not just compliance)

- Log behavior and progress. **Never persist audio** (transcribe in-flight, then discard). Store raw transcripts only short-term and **auto-expire them after 30 to 90 days** unless the user saves one. Private by default; **one-tap hard delete**.
- **Incognito toggle** (available in any mode): the session is processed entirely in memory and retained nowhere. No stored transcript, no history, no progress or streak credit, result shown once then gone. Keep only a transient, content-free, daily-reset counter to enforce a per-day session cap so incognito cannot run up cost.
- Analytics is content-free and captures retention and conversion only.
- Be honest in copy: "retained nowhere on our side" still means the STT and LLM process it transiently; configure zero-retention with the providers.

## Business model and platforms

- **Paid only, no free tier.** $12/month, or annual with 2 months free ($120/year). **30-day money-back guarantee.**
- **Payments via Stripe on the WEB.** The mobile app is **login-only** (the reader / multiplatform model, like Spotify or Netflix): users subscribe on your website, then log into the app. **Do not use Apple in-app purchase.** This keeps ~97% of revenue and is allowed by Apple for this model.
- Cost budget to respect in your design: aim for roughly $4 per active user per month in variable AI cost (Deepgram + Haiku), and design a per-day session cap so heavy users cannot destroy the margin. Assume you will self-host the voice loop at scale to avoid per-minute platform markups.
- Platforms: iOS and Android app (you pick the framework), plus a one-page marketing and signup site with Stripe checkout.

## Deliverable (produce all of this, in one structured document)

1. **PRD:** product overview, target users, the three modes, the core flows (onboarding, diagnostic, the practice-call loop, results, progress, incognito, subscription), the one-button UX in detail, and explicit non-goals.
2. **Tech stack:** every choice with a one-line rationale, honoring the VPS and Clerk pins and the fixed external services.
3. **Architecture:** the system design, the real-time voice pipeline, the backend engine (state machine, gating router, mastery, deterministic scoring validator), the data model and schema (users, skills, units, progress events, subscriptions), and the API surface.
4. **Pedagogy data model in detail:** the skill-pack schema, the unit schema, the rubric-signal schema, the event-sourced progress model, and the deterministic scoring validator.
5. **Build plan:** phased from a thin validation prototype through one-mode MVP to full three-mode launch, with what to build and what to verify in each phase, and the plan for self-hosting the real-time voice loop on the VPS.
6. **Sample content:** one skill tree plus one fully specified unit (persona, rubric signals, thresholds, mastery rule) for each of the three modes.
7. **Risks and mitigations:** real-time voice reliability, scoring gaming, per-user cost, privacy, and App Store approval for a login-only app.

Decide everything. Be concrete enough that a competent solo developer could start building from your output tomorrow.
