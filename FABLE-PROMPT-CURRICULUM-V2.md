# FABLE PROMPT: Non-AI curriculum + expert sourcing (4-skill AI-minimization)

Paste whole file into ONE fresh Fable session. This is not a clean-room run:
read every file listed in Section 0 before writing anything. You are extending
CONTENT-ROADMAP-4-SKILLS.md, not replacing or re-deriving it. Make every
decision yourself. Do not ask questions. No em-dashes anywhere.

## 0. Required reading (read all first, in order)

1. `CONTENT-ROADMAP-4-SKILLS.md`: locked. Skill definitions (Section 0),
   per-skill curriculum and mastery stages (Section 1), engine reuse (Section
   2), sequencing (Section 3). Its existing units are 100% AI-chat
   (scenario/persona/warmth_rules/rubric, scored from a transcript). You are
   adding a second, non-AI unit type alongside that, not modifying this
   document.
2. `packages/core/schemas.ts`: `UnitSchema` (lines 73-107) is conversational
   only today. There is no non-chat unit type. Do not write TypeScript. Name
   what new optional shape this needs; the actual schema change is separate
   follow-up work in this repo.
3. `packages/core/validator.ts` and `score.ts`: deterministic string-analysis
   scoring, zero LLM judgment. Non-AI drills do not touch this path at all
   (no scoring, self-attested only). The AI-scenario capstone keeps using it
   unchanged.
4. `content-library/README.md`: the author-vs-serve split, and each skill's
   one-sentence north star (Communication's is DID THEY CONNECT). State the
   equivalent north star for whichever skill your drill designs touch, do not
   leave any skill without one.
5. `EXTRACTION-META-PROMPT.md`: the existing clean-room pattern, currently
   scoped to public speaking only. Its two-pass wall (Pass A: canon-only
   technique inventory, hard corroboration rule, no course transcript
   reliance; Pass B: independent authoring, no source access) and its legal
   frame (techniques and facts are free to use, exact wording/examples/
   sequence are not) is the pattern you are generalizing across all 4 skills
   in Section 4 below.
6. `RESEARCH-METHODOLOGY.md`: plain web search plus page fetch is the
   established default for one-time qualitative research on this project. No
   scraper platform, no paid API. Use this posture for the expert-sourcing
   research in Section 4.
7. `ALPHA-MODEL-ANALYSIS.md`: the mastery-gated, "practice, then prove it"
   rationale behind the drills-first, capstone-check-second structure in
   Section 3.

## 1. The actual task

The product is currently ~100% AI-chat: every unit is a scored scenario
conversation. That is too much LLM surface for a curriculum meant to run
mostly without AI. Add a non-AI drill unit type so most practice reps need
zero AI, and reposition the existing AI-scenario mechanic as a capstone
check rather than the only mechanic. Three deliverables, covered in Sections
2 through 4:

1. A concrete non-AI drill design, specified per skill, at the same
   worked-example depth CONTENT-ROADMAP-4-SKILLS.md already used for its
   AI-scenario units.
2. A structural rule for how non-AI drills and the AI-scored capstone relate
   within one mastery stage.
3. An expert-sourcing methodology: 1-3 named, publicly-credible reference
   figures per skill, proposed by you through your own web research, used
   only as credibility anchors, never as primary content source.

## 2. Non-AI drill design, per skill

For each of the 4 skills in CONTENT-ROADMAP-4-SKILLS.md's final list, design
a non-AI drill:

- Format is standardized across all 4 skills: a structured, timed written
  response to a prompt, self-checked by the user against a fixed answer key
  or checklist you author. Communication may additionally use a
  recording-based variant (e.g. a 5-minute speech off a random-word prompt),
  since it is the one performative skill among the 4; the other 3
  (Problem-Solving, Critical Thinking, Decision-Making) are analytical, so
  they use the written-response format only.
- Pass rule is self-attested completion: the user marks a boolean, "I did
  this." Reuse the existing mastery gate exactly as-is (`passes_required` +
  `distinct_days`), scored zero by any validator. Do not design any new
  verification signal, deterministic or otherwise; self-attestation with no
  cheat-resistance is the accepted v1 answer, not a gap to close here.
- For each skill, produce at least one fully worked drill: the prompt or
  template text, the self-check answer key or checklist, and the pass rule
  restated concretely for that drill. Concrete enough that a human author
  could turn it into a real content-library file without further invention,
  matching the depth CONTENT-ROADMAP-4-SKILLS.md already used for its
  AI-scenario worked examples.

## 3. Drills-then-capstone sequencing within a mastery stage

State a concrete number or range (not "some" or "a few") of non-AI drill
reps a user completes before the one AI-scored scenario chat that caps the
stage and opens the mastery gate. Several drills first, one AI scenario
last, per stage. This is a sequencing pattern, not an enforced ratio: say
explicitly that the roughly 90 percent non-AI / 10 percent AI split this
produces is an emergent property of the rep count you choose, not a quota
mechanism you are building. Do not add a counter, ratio check, or gating
logic beyond what the existing mastery gate already does.

## 4. Expert sourcing methodology (generalize EXTRACTION-META-PROMPT.md)

- You (Fable) perform the identification research yourself, using plain web
  search and page fetch only, per RESEARCH-METHODOLOGY.md's posture. Do not
  wait for the user to supply names.
- Propose 1-3 named, publicly-verifiable figures per skill. Each name needs
  a one-line reasoning citing their public credibility basis: books,
  published frameworks, public talks, or comparable canon. No figure without
  a stated public basis. These are directional credibility anchors only
  ("draws on what X and Y teach"), never a primary content source and never
  a single-guru dependency for any one skill.
- Actual drill and unit content stays canon-based and clean-room, applying
  EXTRACTION-META-PROMPT.md's hard corroboration rule across all 4 skills,
  not just public speaking: a technique or drill element enters the content
  only if it traces to a named public source, independent of any one
  figure's proprietary framework. If something only appears in one person's
  material and nowhere else public, drop it.
- The user reviews and approves your proposed figures after you produce
  them; you are not blocked waiting on that approval to finish this
  document, just flag the proposals clearly as pending review.

## 5. Schema extension, flagged not built

Write a short section naming the new optional shape the non-AI unit type
would need alongside the existing conversational `Unit` fields in
`schemas.ts` (for example: a drill prompt/template field, a self-check
answer key field, an attestation boolean, no `rubric` or `warmth_rules`
since nothing is scored). Do not write TypeScript, do not edit
`schemas.ts`. This is input for separate engine work in this repo.

## 6. Explicit scope confirmation (do not omit)

State plainly, in one short section: this document contains no pricing,
monetization, or business-model content; no cheat-resistance or anti-gaming
design for self-attested drills (accepted v1 limitation); no all-ages or
broader-rollout design (deferred, near-term audience is young adults and
adults); and no redesign of the existing AI-chat mechanic, which keeps its
current scenario/persona/warmth_rules/rubric shape exactly as
CONTENT-ROADMAP-4-SKILLS.md defined it, only repositioned as the per-stage
capstone check.

## 7. Output

Write the full document to
/Users/main/Desktop/Active Projects/communication/CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md

Structure: (1) per-skill non-AI drill designs from Section 2, (2) the
drills-then-capstone sequencing rule from Section 3 with its stated rep
count, (3) expert-sourcing proposals from Section 4, one subsection per
skill, (4) the schema extension flag from Section 5, (5) the scope
confirmation from Section 6. No em-dashes anywhere.
