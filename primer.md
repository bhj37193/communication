# Primer: Charisma Trainer -> 5-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
Working tree DIRTY, not yet committed: .gitignore, CONTENT-ROADMAP-4-
SKILLS.md, research/fetch_literature.py, research/literature/*.json,
research/literature/INDEX.md (modified); research/README.md (new).
Ask the user whether to commit before starting new work.

## COMPLETED THIS SESSION
1. Research pipeline expanded: `research/fetch_literature.py` now fetches
   from arXiv + Semantic Scholar + OpenAlex + Europe PMC (was 2 sources).
   Fixed an OpenAlex crash (`.get()` default doesn't cover a present-but-
   None value in venue parsing). Re-runs now merge additively instead of
   overwriting. Corpus grew 106 -> 246 papers across the 5 topics
   (communication 43, problem_solving 35, critical_thinking 60,
   decision_making 54, behavior_science 54). Added `research/README.md`,
   ICM-style, mirroring `content-library/README.md`.
2. Behavior science unlocked as 5th skill, RE-LOCKED as a
   transcript-scorable DRILL (user's explicit choice, asked directly via
   AskUserQuestion, not defaulted). Full spec written into
   CONTENT-ROADMAP-4-SKILLS.md v2: one-paragraph definition (0.1), all 4
   new pairwise separations (0.2, now 10 pairs total), scorability
   mechanism (0.3), full Section 1.5 with 2 worked units ("The 11pm
   Scroll," "The Gym Membership That Never Gets Used"), schema/validator/
   score additions (Section 2.2), build order updated (Section 3: PS ->
   DM -> CT -> BS last, since BS recombines PS's premature-fix gate +
   CT/DM's structured-close machinery rather than inventing anything new).
   Mechanism: diagnose CUE/ROUTINE/REWARD before prescribing, close with
   CUE/ROUTINE/REWARD/TECHNIQUE/PLAN/TRIPWIRE, all string-checked, zero
   LLM judgment, stays inside the deterministic-scoring moat.

## EXACT NEXT STEP
Ask the user whether to commit the dirty tree. Roadmap spec for behavior
science is DONE; NOT yet built in code (packages/core/schemas.ts,
validator.ts, score.ts untouched). Before starting BS implementation,
confirm actual build status of Problem-Solving/Decision-Making/Critical
Thinking in code (the roadmap's sequencing assumes they already shipped;
verify, don't assume).

## LOCKED DECISIONS (do not re-litigate)
5-skill taxonomy (Communication, Problem-Solving, Critical Thinking,
Decision-Making, Behavior Science - all 5 as transcript-scorable drills).
Non-AI drill self-attested pass; 8 drill reps + 1 AI capstone/stage;
expert anchors credibility-only; no pricing content in curriculum; engine
extends never redesigns; connection/clarity north stars parallel. Full
scenario-unit serve-path scope over drill-only slice; spec/plan Non-goals
are locked cuts; `prd.md` obsolete, PRD-CHARISMA-CHAT.md is source of
truth.

## OUTSTANDING OPS
App-store tasks #1-4 user-blocked; FABLE-PROMPT-PROVEN-PROGRESS.md
deferred, unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md | .omc/plans/autopilot-impl.md | apps/server/src/
routes/sessions.ts | apps/server/src/services/{fold,router,profile,
caps}.ts | apps/mobile/app/index.tsx | apps/mobile/lib/api.ts |
CONTENT-ROADMAP-4-SKILLS.md | RESEARCH-METHODOLOGY.md |
research/fetch_literature.py | research/README.md
