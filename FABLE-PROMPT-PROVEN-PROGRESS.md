# FABLE PROMPT: Proven Progress (the validity layer)

Instruction to the reader (Fable 5): You are authoring the next layer of a text-chat
communication trainer. Read PRD-CHARISMA-CHAT.md, POSITIONING.md, and
content-library/README.md + CONTEXT.md as locked input, plus packages/core/schemas.ts,
validator.ts, and score.ts as locked, working code. Make every decision yourself. Do not
ask questions. Be concrete: real files, real prompt text, real schema diffs, real code.
No em-dashes.

---

## 0. Why this exists

The app already computes a score from a transcript with zero LLM judgment involved:
`validator.ts` extracts signals (open_questions, followups, reciprocity, spotlight_share,
interview_mode, monologue_brag, final_warmth) by pure string analysis, and `score.ts` turns
those signals into a 0-100 number with a fixed formula. Same transcript in, same score out,
every time. That is real and it is done. Do not touch score.ts's formula or weights, and do
not touch validator.ts's signal definitions, unless a genuine defect forces it.

But "the number is computed the same way every time" is not the same claim as "the number
tracks real improvement in the user's communication ability." The first is RELIABILITY. The
second is VALIDITY. The product currently only has the first. This prompt is about building
the parts of the second that can be built without a live user study, and designing the rest.

Treat this as three separate problems. Do not blur them into one "make the score more real"
pass, that is how you end up rebuilding the deterministic engine instead of closing the actual
gap.

1. **Reliability.** Done. Not your job here.
2. **Comparability over time.** A user's score on Tuesday and their score three weeks later
   are only a meaningful delta if the scenario difficulty didn't also change. Right now every
   session can be a different unit/persona, so a score jump could just mean an easier
   conversation, not a better one. This IS your job.
3. **Validity.** Whether the score actually correlates with real-world charisma/connection
   ability. You cannot prove this without real users and a real study. But you CAN design the
   study, and you CAN build the instrumentation now so that when a pilot cohort exists, the
   correlation is checkable on day one instead of requiring a second engineering project. This
   IS your job, scoped to design + instrumentation, not to fabricating a result.

## 1. The tension you must resolve, explicitly, before designing anything

POSITIONING.md's anti-companion-drift rule says: rotate characters, enforce session endings.
Users get variety on purpose, so the app reads as training, not a companion relationship.

A fixed-benchmark retest wants the opposite: the SAME scenario, SAME persona, SAME opener,
replayed identically, so a score delta is attributable to the user and nothing else.

Do not let one silently override the other. The resolution: these are two different modes,
not one mechanic stretched to do both jobs.

- **Daily practice** (existing behavior): rotating characters/personas/units, as today.
  Untouched.
- **Checkpoint** (new): an infrequent, separate, standardized conversation. Same scenario,
  same persona, same opener, same message budget, every single time it is served to any user.
  Not a daily thing. Framed to the user as "a fitness test," not a lesson. Never rotates.

Name it that way in whatever you build (a `checkpoint: boolean` or `kind: 'practice' |
'checkpoint'` field on the unit, your call on the exact shape) so the two modes are visibly
distinct in the schema, not just in prose.

## 2. What "comparability" requires, concretely

Design (and where it is pure data/schema, build) the checkpoint mechanism:

- A cadence. Pick one and justify it in one sentence (e.g. day 1, day 14, then every 30 days).
  Look at how long a daily-practice user plausibly takes to accumulate a meaningful signal
  change before you pick a number; do not just copy a cadence from an unrelated product.
- A fixed checkpoint unit (or small fixed set, e.g. 1 per top-level skill) that never rotates,
  authored the same way existing units are (content-library/personas, skills, scenario), but
  flagged so assemble.ts and the daily-rotation picker both know to exclude it from the normal
  pool and only serve it on schedule.
- Longitudinal storage: a place to persist, per user per checkpoint completion, the full
  Signals object and the resulting score, with a timestamp, so a later query can plot score
  over time for the SAME scenario. Check whether apps/server already has a results/attempts
  table before inventing a new one; extend, don't duplicate.
- A way to show the user the delta (even a plain "checkpoint score: 62 -> 74" line is enough
  for v1; do not over-build a charting UI you were not asked for).

## 3. What "validity" requires: design the roadmap, build the instrumentation

You cannot run a validation study today. You CAN do both of these:

- **Write a short validity roadmap** (a real section in your output, not a TODO comment):
  name one or two validated external instruments or proxies this score could eventually be
  correlated against (for example: a short validated social self-efficacy or communication
  confidence scale administered to a pilot cohort; or a simple behavioral proxy like
  self-reported real-world outcomes after N checkpoints). State plainly that this requires a
  real cohort and is out of scope to fabricate. This is the Alpha School lesson: their
  credibility rests on an external, independently-normed instrument (NWEA MAP), not on their
  internal mastery gate alone. Say this plainly rather than implying the internal score alone
  is sufficient proof.
- **Instrument for it now.** Whatever you persist for the checkpoint (section 2) should already
  be in a shape that a future correlation study can query directly: per-user, per-checkpoint,
  timestamped, with the full Signals breakdown, not just the final 0-100 number. If the
  external-instrument data shows up later, it should join cleanly on user + date. Do not build
  the external-instrument collection itself, just make sure the internal side will not need
  reshaping when it arrives.

## 4. Hard contracts, do not redesign these

- Zod schemas in schemas.ts are the ground truth for shape. Extend (new optional fields, new
  types) rather than break existing ones; a test somewhere may depend on the current shape.
- score.ts's formula and weights: untouched.
- validator.ts's signal extraction: untouched, unless you are adding a genuinely new signal
  for the checkpoint delta itself (e.g. a `score_delta` computed outside the validator, from
  two already-computed scores, is fine and does not touch validator.ts at all).
- Prompt assembly stays split into a static, byte-identical, cache_control:ephemeral system
  prefix and a variable per-turn message suffix, exactly as content-library/CONTEXT.md
  documents. A checkpoint unit's character-system-prompt is still static per unit; nothing
  about "checkpoint" changes this rule.
- Character and feedback model outputs stay strict JSON per CharacterOutputSchema /
  FeedbackOutputSchema. The feedback model still never mints the score.
- No em-dashes anywhere in any file you write.

## 5. What you have full creative freedom over

- The exact schema shape for `checkpoint` units and their storage (propose it, do not ask).
- The exact cadence and how many checkpoint units exist.
- Copy/framing for how the app tells the user "this one's a fitness test, not a lesson."
- The shape of the validity roadmap section and which external instruments you name.
- Any new content-library files needed (a checkpoint persona/scenario, an updated
  CONTEXT.md slice-mapping note) following the existing author-vs-serve split.
- Whether the delta is surfaced as a single line, a small table, or something else, as long as
  you are not inventing a UI framework the app does not already use.

## 6. Deliverables

Write real files. At minimum:
- A schema diff/addition for the checkpoint concept (edit packages/core/schemas.ts directly,
  or hand back the exact diff if you cannot write files).
- At least one real checkpoint unit's content (scenario, persona, rubric) in the
  content-library author layer, folded into the serve-layer JSON the way existing units are.
- The longitudinal storage shape (a schema/table addition, reusing existing infra where it
  exists).
- The validity roadmap section, in prose, as part of your output document.
- A short note on how the checkpoint interacts with the existing mastery gate
  (`Unit.mastery.passes_required` / `distinct_days`), since checkpoints are not something a
  user "passes," they are something a user's score is measured against over time.

If you cannot write files directly, write one document to
/Users/main/Desktop/Active Projects/communication/FABLE-OUT-PROVEN-PROGRESS.md with each file
in a labeled code block, plus the roadmap and interaction notes as prose sections.
