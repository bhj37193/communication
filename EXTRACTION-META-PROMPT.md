# EXTRACTION-META-PROMPT: build the corpus without laundering the source (for Fable 5)

> Run this AFTER `PEDAGOGY.md` exists (it defines the unit schema and skill tree). If `PEDAGOGY.md` is missing, stop and run `PEDAGOGY-META-PROMPT.md` first. Output must contain no em-dashes.
>
> This prompt builds the shippable corpus the MCP server serves. Legality is a hard requirement, not a preference. The goal is content that teaches the same public techniques in fully original form, with a real wall between whatever saw the source and whatever authors the product.

## The legal frame (internalize before doing anything)
- **Free to use:** techniques, methods, and facts. Nobody owns "pause before your key line" or "vary your pitch." These are not copyrightable.
- **Not yours:** the source course's exact wording, its specific examples and stories, its coined terms, and its selection and sequence of material (arrangement can be protected as a compilation).
- **Therefore:** author independently from the public canon. Never rewrite, paraphrase, or restructure the source transcripts. Rewording copyrighted expression is still a derivative work.
- The files in `SOURCE-DO-NOT-SHIP/transcripts/` are **not source material to rewrite.** They are off-limits for authoring. See the two-pass wall below for their single, tightly-bounded permitted use.
- **Honest note:** public-speaking technique is not secret. Everything you may legitimately teach is already documented in public books and talks. The transcripts add little to a lawful build and a lot of risk. Lean on the canon; keep Pass A's transcript use minimal, or skip the transcripts entirely.

## Choose a mode

**MAXIMUM-SAFETY MODE (recommended, targets near-zero risk).**
- Do NOT open `SOURCE-DO-NOT-SHIP/transcripts/` at all during authoring. The cleanest wall is the operator's own head: the operator took this course and now knows the techniques, and knowledge in a person's head carries no expression with it. Source only from (a) the operator's own understanding of the techniques and (b) the named public canon.
- Pass A below becomes **canon-only**: build the technique inventory purely from named public sources plus the operator's own expertise. Ignore every mention of transcripts in Pass A.
- After the corpus is authored, the **operator** (a human, not the model) does ONE final private gap-check: skim the transcripts once to confirm no standard technique was missed. If a gap is found, re-derive that technique from a public source in original words. Then **delete or quarantine `SOURCE-DO-NOT-SHIP/transcripts/`**, which removes the last verbatim-copy liability.
- Everything else (Pass B, the self-audit, the prohibitions) applies unchanged.
- This is the version to use unless you have a specific, deliberate reason not to.

**DEFAULT MODE (two-pass wall).** Use only if you have a concrete reason to consult the transcripts. Pass A may glance at them under the strict corroboration rule below. Slightly more convenient, meaningfully higher residual risk. If in doubt, use maximum-safety mode.

## Two-pass wall (mandatory)

### PASS A: Technique inventory (canon-only in maximum-safety mode; may glance at transcripts only in default mode)
Goal: a flat, abstract list of public-speaking techniques worth teaching.
- Build it **primarily from the public canon.** Name your sources (established public speaking, rhetoric, vocal/voice, and communication-science books; widely taught frameworks; public talk analyses).
- You MAY privately consult `SOURCE-DO-NOT-SHIP/transcripts/` for one purpose only: to check "did I miss a technique the field treats as standard?" You may not lift wording, examples, or ordering.
- **Hard corroboration rule:** a technique enters the inventory ONLY if you can cite at least one **named public source** for it. If a technique appears only in the course and nowhere public, DROP it. That is likely his original expression or selection, and it is not yours.
- Each entry = `{ technique_id, one_line_description (your own words), public_sources[] }`. No course phrasing, no course examples, no course sequence, no coined names.
- Output: `corpus/technique-inventory.md`.
- When Pass A ends, the transcripts are DONE. They must not be opened again for the rest of the build.

### PASS B: Independent authoring (NO transcript access)
Precondition: run this where you **cannot read** `SOURCE-DO-NOT-SHIP/transcripts/`. Ideally a fresh session or agent with no file access to that directory. Do not consult the transcripts. Do not rely on any memory of their specific wording or examples.
- Inputs: `corpus/technique-inventory.md` + `PEDAGOGY.md` (unit schema + skill tree) + the public canon.
- For each unit the skill tree requires, author, entirely original: `principle` (your words) -> `exemplar` (freshly invented, or public / your own experience) -> `drill` -> `measurable signal` -> `rubric` -> `mastery threshold`, per the `PEDAGOGY.md` schema.
- Invent your own examples, stories, numbers, and analogies. None may trace to the course.
- Arrange units by the learning-science rationale in `PEDAGOGY.md`, NOT by the course's ordering.
- Output: `corpus/units/*.md`, conforming to the `PEDAGOGY.md` schema.

## Per-unit self-audit (embed as metadata in every unit)
- `source_basis`: the public source or first principle this unit rests on. Never "the course."
- `originality_check`: explicit confirmation of all of the following:
  - no verbatim or near-verbatim course text,
  - no reuse of any course example, story, analogy, or specific number,
  - no mirroring of the course's module order or exercise sequence,
  - no coined/branded course terminology.

## Hard prohibitions (carry on every task)
- No verbatim or lightly-reworded course text, anywhere, ever.
- No reuse of the course's specific stories, examples, analogies, or figures.
- No mirroring the course's module order or exercise sequence.
- No course brand names or coined framework terms.
- No crediting or referencing the course in shipped content. No redistribution of source media.

## Constraints
- No em-dashes anywhere.
- Concrete over abstract: real principles, real drills, real measurable signals with thresholds.
- Conform exactly to the `PEDAGOGY.md` schema so Phase 3 can serve these units directly.
- This process reduces risk; it does not eliminate it. Route the finished `corpus/` past IP counsel before public launch.

## Output summary
1. `corpus/technique-inventory.md` (Pass A).
2. `corpus/units/*.md` (Pass B), schema-conformant, each with its `source_basis` and `originality_check`.
