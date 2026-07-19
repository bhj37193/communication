# FABLE PROMPT: Platform build strategy (4 skills, mobile+web synced, one VPS)

Paste this whole file into ONE fresh Fable session. Unlike FABLE-PROMPT-FINANCIAL-V2.md,
this is NOT a clean-room run: read every file listed in Section 0 before writing anything.
Anchoring on the existing product is the point here, not a risk to avoid. Write the full
document to /Users/main/Desktop/Active Projects/communication/PLATFORM-STRATEGY.md
Make every decision yourself. Do not ask questions. No em-dashes anywhere.

## 0. Required reading (read all of these first, in this order)

1. `PRD-CHARISMA-CHAT.md`: the locked product spec. Note the infra baseline already
   decided: one Hetzner CPX31-class VPS, Docker Compose (`caddy`, `api`, `web`,
   `postgres`), self-hosted LiveKit SFU for the avatar/voice transport. Do not
   re-derive infra from scratch; extend this.
2. `ALPHA-MODEL-ANALYSIS.md`: where the mastery-gated, 2-hour adaptive model comes
   from and why it transfers to adults without a physical school.
3. `CONTENT-ROADMAP-4-SKILLS.md`: the 4 skills (Communication, Problem-Solving,
   Critical Thinking, Decision-Making), their entry points, mastery tiers, and worked
   units. Notice what it does NOT say: it never mentions a live avatar for the three
   non-Communication skills. Its structured closes (CLAIM/EVIDENCE/GAP/VERDICT for
   Critical Thinking; OPTIONS/CHOICE/COST/UNKNOWN/TRIPWIRE for Decision-Making) are
   text-native by design, built for a deterministic string-scoring validator.
4. `packages/core/schemas.ts`, `model.ts`, `validator.ts`, `score.ts`, `assemble.ts`:
   the actual engine. It is event-sourced (progress state is a log of scored attempts,
   not a mutable row) and the LLM never scores or advances state; it only plays a
   persona and drafts prose. This is what makes cross-device sync tractable: the
   source of truth is an append-only event stream, not client-held state.
5. `content-library/README.md` and `content-library/CONTEXT.md`: the author/serve
   split, so you don't propose restructuring content that already has a working
   pipeline.
6. `FINANCIAL-MODEL-20YR-V2.md`: the locked business model this platform serves:
   paid only, no free tier, 30-day money-back guarantee, one VPS, fixed-cost bias.
   Treat its pricing and refund mechanics as given; your job is the technical strategy
   that makes them real, not re-picking numbers.
7. `BUILD-EXECUTION-PLAN.md`: the existing Phase 0-N build plan for the single-skill
   (Communication-only) app. Do not re-derive its task DAG. Where your platform-layer
   work (web app, sync, payment/refund plumbing) slots into or extends those phases,
   say so explicitly by phase number; where it's genuinely new work those phases never
   covered, say that too.
8. `apps/mobile/`: read `package.json` and `app.json`. The mobile app already exists
   (Expo, Clerk auth, AsyncStorage). This is not a greenfield mobile build; it's a
   platform build around an app that's partway done. There is currently no `apps/web`.

## 1. The actual question

The founder does not want a checklist satisfied. The three constraints below are
hard boundaries, not the goal:

- Single VPS (Hetzner CPX31-class, Docker Compose), no managed-cloud sprawl.
- One product, two synced surfaces: the existing mobile app and a new web app,
  same account, same mastery-gated progress, continuable on either.
- Paid only, 30-day money-back guarantee, no free tier (per FINANCIAL-MODEL-20YR-V2.md).

The goal INSIDE those boundaries is the best possible adult-education product across
all 4 skills. Optimize for that. If a constraint and education quality trade off in a
specific technical decision, say so explicitly and pick education quality unless the
constraint is truly load-bearing (e.g. "yes this costs more compute" is fine to eat;
"this requires a second VPS" is not, because that constraint is hard).

## 2. Per-skill modality: decide, don't assume

The current build treats live avatar (lip-synced video, push-to-talk voice, LiveKit
transport) as core to Communication. Do NOT assume it is core to the other three
skills just because it exists in the codebase. For EACH of the 4 skills, decide and
defend, using evidence from `CONTENT-ROADMAP-4-SKILLS.md` and the engine's scoring
constraints:

- Does this skill's mastery practice require synchronous, real-time, nonverbal or
  paralinguistic signal (tone, timing, hesitation, interruption) that only a live
  avatar session can produce? Or is the skill's actual practice unit a structured
  written artifact (a claim-evidence chain, a decision brief) that a text interface
  scores just as well, or better, because the deterministic validator can parse
  labeled lines but cannot parse spoken audio at all?
- State a working hypothesis before you decide: Communication is the one skill built
  around live conversational exchange, so it plausibly needs the avatar; the other
  three are built around structured written reasoning artifacts, so they plausibly
  don't. Test this hypothesis against the actual unit designs in
  `CONTENT-ROADMAP-4-SKILLS.md` rather than accepting or rejecting it by default.
  You may conclude a skill needs voice without needing the full lip-synced avatar
  (e.g. push-to-talk audio without rendered video), or that a skill benefits from an
  OPTIONAL avatar session as a higher tier rather than a required one. Justify
  whatever mix you land on per skill, in one paragraph each.
- State the COGS and engineering-cost consequence of your per-skill decision: every
  skill that needs live avatar adds LiveKit/render/TTS/STT cost and UI surface: every
  skill that stays text-only is close to free to run at scale on the one VPS. This
  is a real lever on the numbers in `FINANCIAL-MODEL-20YR-V2.md`, not just a UX call.

## 3. Mobile + web sync architecture

Design the actual mechanism, on the one VPS, for a user to start a challenge on
mobile and finish it on web (or vice versa) with no data loss and no double-counting
of mastery progress. Cover:

- What the shared source of truth is (the event-sourced attempt log already in
  `packages/core`) and why client-held state on either surface is a cache, never
  authoritative.
- The sync API surface: what the web app and mobile app both call, and whether it's
  the same `api` container already in the Compose stack or a new service. Prefer
  reusing `api` unless you have a specific reason not to.
- Mobile offline behavior: the mobile app can be used with a spotty connection; decide
  what queues locally (AsyncStorage already present) versus what requires a live
  connection (e.g. a live avatar session structurally cannot be offline; a text
  challenge attempt can be composed offline and synced on reconnect). State the
  conflict-resolution rule for an attempt composed offline against progress state
  that advanced elsewhere in the meantime (last-write-wins is likely wrong for a
  mastery gate; say what the actual rule is and why).
- Auth: Clerk is already wired into mobile; decide whether web reuses the same Clerk
  project/session or needs its own configuration, and how a single logged-in identity
  maps to the one paying account across both surfaces.
- What genuinely needs real-time (a live avatar session, obviously) versus what is
  fine as ordinary request/response with no websocket (nearly everything else,
  including progress sync). Do not add real-time infrastructure where polling or a
  simple fetch-on-focus is sufficient; this is a one-VPS budget product.

## 4. Paid-only and the 30-day guarantee, made real

`FINANCIAL-MODEL-20YR-V2.md` specifies the business terms; your job is the technical
mechanism. Cover:

- Where the paywall actually sits (before first session, not after a trial) and how
  both mobile and web enforce it identically off the same account state, so a user
  can't get a free session by switching surfaces.
- How the 30-day refund window is tracked and enforced server-side (start timestamp,
  once-per-person via identity plus payment fingerprint per the V2 model), and what
  happens to account/progress state on refund: does access end immediately, does
  progress data get retained or deleted, is there a support-side manual override path.
- Payment provider integration point (Paddle-class merchant of record) and where in
  the Compose stack it lives (webhook receiver on `api` is the obvious answer; confirm
  or reject).

## 5. Build sequencing

Produce a phased build-step sequence for the PLATFORM layer specifically (web app,
sync, payment/refund plumbing, and any modality changes from Section 2). Do not
restate `BUILD-EXECUTION-PLAN.md`'s existing phases for the core app; reference them
by number where this work extends one, and mark clearly where this is new work with
no existing phase. For each step: what gets built, what it depends on, and a concrete
acceptance check (a command, a test, or an observable behavior), in the same spirit as
`BUILD-EXECUTION-PLAN.md`'s per-task acceptance commands. Order by what unblocks the
most subsequent work first, not by what's easiest.

## 6. Output

Write the full document to
/Users/main/Desktop/Active Projects/communication/PLATFORM-STRATEGY.md

Structure: (1) per-skill modality decision table with the one-paragraph justification
for each skill, (2) sync architecture section, (3) paid/refund enforcement section,
(4) phased build sequence with acceptance checks, (5) a short risks section: the one
or two ways this platform strategy could be wrong, and what would have to be true for
you to revise it. No em-dashes anywhere.
