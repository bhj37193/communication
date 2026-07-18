# FABLE PROMPT: charisma chat trainer (v2, chat + freemium + Korea/global)

Paste everything below into Fable 5. It supersedes BUILD-BRIEF-FOR-FABLE.md (which
was voice, three modes, Stripe, paid-only). If Fable has filesystem access, the sibling
files named here (COMMUNICATION-PRINCIPLES.md, MCP-ENGINE-SPEC.md, PROTOTYPE-SESSION-ONE.md,
primer.md) give extra grounding; everything strictly needed is restated inline.

---

You are Fable 5, acting as principal engineer and product architect. Produce a complete,
build-ready plan for the app described below: a PRD, the full tech stack, the architecture
and data model, the pedagogy engine, and a phased build plan whose FIRST phase is a thin
vertical slice a solo developer can start building tomorrow. **Make every decision yourself.
Do not ask me questions. Where anything is ambiguous, choose the best option and briefly say
why.** Be concrete and build-ready, not abstract. No em-dashes anywhere in your output (use
commas, colons, periods, or parentheses).

## What changed from any earlier brief (read this first)

This is a CONSUMER, TEXT-CHAT charisma trainer. It is NOT voice, NOT three modes, NOT paid-
only, and NOT on Stripe. Earlier drafts of this product were voice-first with three modes
(sales / public speaking / everyday) on Stripe, paid-only. All of that is superseded. The
constraint engine, the deterministic validator, and the clean pedagogy corpus carry over
unchanged. The medium, the go-to-market, and the payment rail do not.

## Hard constraints (do not change these)

- **Medium: TEXT CHAT only in v1.** The user types; an AI character texts back. No voice,
  no STT, no TTS in v1. Design the system so a self-hosted voice loop can be added later as
  a premium tier, but build none of it now.
- **Platform: iOS and Android from one codebase (React Native + Expo)**, plus a one-page
  marketing and signup website. The app is **login-only**: no purchasing happens inside the
  app.
- **Hosting: self-hosted VPS. No managed cloud or PaaS** (no Vercel, Supabase, Railway,
  Render, serverless). Self-host the app server, database, workers, reverse proxy, TLS,
  and monitoring. Hetzner-class Linux box, Docker Compose, Caddy for TLS is the assumed
  baseline; justify any change.
- **Reasoning model: Claude Haiku (`claude-haiku-4-5`), BUT accessed only through a
  swappable model-provider interface.** This is a hard architectural requirement, not a
  nice-to-have. Every model call goes through one internal interface (for example
  `ChatModel.complete(...)`) with Haiku as the current implementation, so a self-hosted
  open-weights model (Llama / Qwen / Mistral on a GPU) can be dropped in later at a defined
  scale trigger without touching call sites. Configure zero data retention with the provider.
- **Payments: a Merchant-of-Record on the WEB. Use Paddle (FastSpring is an acceptable
  alternative). Do NOT use Stripe: it is not available to Korea-based businesses.** Do NOT
  use Apple or Google in-app purchase in v1. The MoR is the legal seller of record, handles
  worldwide card acceptance and VAT/sales-tax, and pays out to the operating company. Users
  subscribe on the website (the reader / multiplatform model, like Spotify or Netflix), then
  log into the app. Keep MoR as the default rail, but design the entitlement layer so Apple
  or Google IAP can be added later as an ALTERNATIVE entitlement source without a rewrite:
  the reader-model exception (guideline 3.1.3(a)) is narrow and store review may require IAP
  to unlock in-app functionality at the paywall phase. Build no IAP in the Phase 0 slice.
- **Auth: Clerk**, shared across the mobile app and the web signup page. Justify briefly if
  you would swap it; otherwise keep it.
- **Cost posture: bounded and cheap, enforced by a hard per-day cap.** There are TWO model
  touchpoints per session: the character's chat turns (about 15 short turns), and one
  feedback/scoring call that ingests the full transcript at the end. "Deterministic" governs
  the PASS decision, the signal recomputation, the evidence substring-check, and the mastery
  counter, NOT the feedback prose or the proposed score (those are model-generated, then
  validated). Budget both touchpoints: target roughly $0.01 to $0.02 per challenge and
  roughly $5,000 to $10,000 per month in AI cost at 100,000 users. Cost is not literally
  fixed on API (it scales slowly with users); the swappable model layer above is what makes
  a true-fixed self-hosted future possible without a rewrite. Do NOT design a GPU fleet now.

Context (informational, not a build constraint): the company is operated from a Korean
young-entrepreneur SME entity; the product ships globally in English.

## The product

Open the app and get ONE short daily chat challenge with an AI character (a stranger at a
party, a new coworker back from a trip, a guarded friend-of-a-friend). You text with them.
The character **warms up if you make them feel interesting** and **goes flat if you perform,
brag, or monologue**. At the end you get instant feedback (one win quoted, one fix), a
charisma **score** on real conversational signals, and a **streak**. The whole thing is
3 to 5 minutes. There is no lesson menu and no browsing.

Positioning (locked): "Charisma is a skill. Train it." Category: conversation trainer
("Duolingo for talking to people"). The hero paradox the product must prove: the most
interesting person in the room is the one who makes everyone else feel interesting.

UI principle: "limit the details, make the details perfect." The three surfaces to get
perfect are the daily-challenge entry, the chat itself, and the result card. Hide
everything else.

## The pedagogy engine (the moat)

A mastery-learning constraint engine (modeled on Alpha School), enforced as structure, not
suggestion. Full spec in MCP-ENGINE-SPEC.md; the essentials you must implement:

- A short **diagnostic** places the user by skill level.
- A **prerequisite skill tree** gates progression.
- The engine serves **exactly one challenge at a time**, chosen from the user's state.
  There is no "list challenges" or "jump to X." The user cannot browse or skip.
- The user must clear a **mastery bar** before a skill unlocks the next.
- **Spaced review is forced**: due reviews are served before new material.
- **Per-user progress is event-sourced** (append-only event log; current state is a
  projection), so nothing is lost and new metrics can be added later without migration.

Enforce this by construction: the server owns state transitions and only exposes the tool /
endpoint for the current valid action. The client can never advance its own state.

## The chat loop and the scoring model

The daily loop, concretely (this is the thing to build first, see PROTOTYPE-SESSION-ONE.md):

1. The character opens with a flat, polite line that gives the user little to work with.
2. The character (played by Haiku through the model interface) runs a silent **warmth meter**
   (0 to 3). It rises when the user asks a genuine open question, follows up on what the
   character just said, or reciprocates with a real short share; it falls when the user
   monologues, brags, performs, or ignores what was said. Flattery alone does nothing.
   The character reveals hidden depth only in layers, and only when warmth is earned.
3. After about 10 user messages or a natural close, the session ends.
4. Feedback is generated and then **validated deterministically**: WIN (one thing done well,
   with the user's exact line quoted), FIX (the single highest-leverage change, as an
   instruction anchored to a quote or number), THE MOMENT (where the character warmed up or
   stayed flat, tied to what the user did, naming the paradox), SCORE (0 to 100 for this rep
   plus the one skill to train next).

**Scoring keeps cost low and the mastery gate hard to game.** The model plays the character
and proposes a score. A backend service holds all per-user state and **validates with zero
inference**:

- It parses the labeled transcript and **recomputes the countable signals itself**:
  open-question count, follow-up count (a user message that references the character's prior
  message), reciprocity (did the user share something real after the character opened up),
  spotlight balance (share of user messages about the character's world, target 40 to 70
  percent), interview-mode flag (3+ consecutive user questions with zero self-disclosure),
  and monologue/brag flag.
- It **substring-checks** that every evidence quote the model cites actually appears in the
  transcript, and rejects any pass built on a fabricated quote.
- It applies the deterministic **pass rule** and **owns the mastery counter**. The model
  judges a single attempt only and can never advance state.

Use **band thresholds, not floors**: overdoing a behavior fails as surely as underdoing it
(too many questions is interrogation and fails; too much self-talk fails). This is the
"content-couple every skill" principle: a technique only counts when it lands on real
meaning, so faking it requires doing the real thing.

## Content model (the pedagogy data)

Content is a **skill pack** = a skill graph (nodes with prerequisite edges) + units. A
**unit** contains: a principle, a short exemplar, challenge instructions, an **AI-character
persona and resistance brief** (how the character behaves, what hidden depth it withholds,
and the warmth rules), a set of **rubric signals with band thresholds**, a feedback prompt,
and a mastery threshold. The engine is subject-agnostic: a new skill pack is a data drop,
not an engineering change.

**Source the v1 content clean-room from the EVERYDAY pack in COMMUNICATION-PRINCIPLES.md**
(authored from public canon and first principles). Do NOT source content from any
copyrighted course or its synthesis. The EVERYDAY skills to encode: open questions over
yes/no, the follow-up that signals real listening, make-it-about-them one level deep, blend
questions with sharing (avoid interview mode), reflect before adding, build on what they
said (yes-and), read the room, tell concrete vivid short stories, reciprocate and call back,
move gracefully from small talk to depth. Cross-cutting countable signals: talk/listen
balance near 50/50, spotlight 40 to 70 percent on them, never 3+ consecutive questions with
zero self-disclosure, concrete over vague, no monologue.

## Data, privacy, and incognito (a product feature, not just compliance)

- Log behavior and progress, expire content, never store more than needed. Store raw
  transcripts short-term only and **auto-expire them after 30 to 90 days** unless the user
  saves one. Private by default; **one-tap hard delete** (a real delete, not a soft flag).
- **Incognito toggle** (available on any challenge): processed in memory, retained nowhere.
  No stored transcript, no history, no progress / streak / review credit, result shown once
  then gone. Keep only a transient, content-free, daily-reset counter so incognito still
  respects the per-day cost cap.
- Analytics is content-free and captures retention and conversion only (session started,
  day-7 / day-30 return, free-to-paid). Log the event, never the content. This is
  non-negotiable even at prototype stage, because the validation experiment needs it.
- Be honest in copy: "retained nowhere on our side" still means the model processes it
  transiently. Configure zero retention with the provider; do not claim nobody ever saw it.

## Business model and platforms

- **Freemium.** ONE free daily challenge forever. Paid tier unlocks unlimited challenges
  plus extras (score history, more character packs). Assume a paid price near $9.99/month or
  $59.99/year; you may refine, but keep the free daily challenge.
- Under a bounded, cheap cost base, free users are near-zero marginal cost, so the free tier
  is the growth engine (organic short-form + the shareable score), not a cost sink. The hard
  per-day cap on the free tier bounds cost and creates upgrade pressure.
- **Payments via a Merchant-of-Record (Paddle) on the website.** The app is login-only. No
  app-store IAP in v1. Design the subscription/webhook flow (checkout, entitlement, renewal,
  cancellation, refund, failed-payment) against the MoR, and gate app features on an
  entitlement the backend derives from MoR webhooks, not on a client flag. Model the
  entitlement so it accepts multiple sources (MoR now, Apple/Google IAP later if store
  review requires it) feeding the same backend entitlement, so a forced pivot is not a
  rewrite.
- Platforms: iOS + Android app (React Native + Expo) plus a one-page marketing/signup site
  with the MoR checkout.

## THE DELIVERABLE

Produce one structured document containing all of the following. The build plan must LEAD
with the thin vertical slice and specify it in enough detail to start building immediately.

1. **PRD:** product overview, target user, the daily-challenge loop, onboarding, the
   diagnostic, results, streak/score, incognito, the freemium wall and subscription, the
   entry/chat/result surfaces in detail, and explicit non-goals (voice, other modes, IAP).

2. **Tech stack:** every choice with a one-line rationale, honoring the pins above (VPS,
   React Native + Expo, Clerk, Haiku-behind-an-interface, Paddle MoR, text-only).

3. **Architecture:** system design, the backend engine (state machine, gating router,
   mastery, deterministic scoring validator), the model-provider abstraction (interface +
   the Haiku implementation + a documented path to swap in a self-hosted open model at a
   named scale trigger), the data model and schema (users, skills, units, progress events,
   entitlements/subscriptions), and the API surface. Include the MoR webhook -> entitlement
   flow.

4. **Pedagogy data model in detail:** the skill-pack schema, the unit schema (including the
   character persona / warmth-rule / resistance brief), the rubric-signal schema with band
   thresholds, the event-sourced progress model, and the deterministic scoring validator
   (exact signals recomputed, the substring evidence check, the pass rule, the mastery
   counter).

5. **Build plan, thin-slice first:**
   - **Phase 0 (the thin vertical slice, build this first):** one complete daily-challenge
     loop end to end on the real stack: React Native app -> backend -> ONE hardcoded
     character (use the "Sam at the housewarming" persona and warmth meter from
     PROTOTYPE-SESSION-ONE.md) -> deterministic score + WIN/FIX/MOMENT/SCORE feedback ->
     streak, shippable to TestFlight and Play internal testing. Analytics (day-7/30
     retention, session events) wired from day one. No diagnostic, no skill tree, no
     payments yet. Goal: prove the aha is addictive.
   - **Later phases:** diagnostic + placement, the full everyday skill tree + spaced review,
     the freemium wall + Paddle subscription, more character packs, account/settings/delete,
     the marketing site. Then, only at the named scale trigger, the self-hosted model swap.
     Voice is a post-launch premium track, out of scope here.
   For each phase say what to build and what to verify before advancing.

6. **Sample content:** one everyday skill tree (nodes + prerequisite edges) plus ONE fully
   specified unit: principle, exemplar, the character persona with its warmth rules and
   hidden depth, the rubric signals with band thresholds, the feedback prompt, and the
   mastery rule. Use the housewarming scenario as the worked example.

7. **Risks and mitigations:** scoring gaming, per-user and free-tier cost control, the model
   swap path and its quality trade-off, privacy, MoR/app-store policy for a login-only app,
   and the real #1 risk (demand / retention), with how the thin slice tests it.

Decide everything. Be concrete enough that a competent solo developer could start building
the Phase 0 slice tomorrow.
