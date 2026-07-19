# Primer: Charisma Trainer -> 5-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
Working tree DIRTY: CONTENT-ROADMAP-4-SKILLS.md (modified this session,
not yet committed). Prior session's changes (.gitignore, research/*,
research/README.md) were already committed via checkpoint commits before
this session started; do not re-ask about those.

## COMPLETED THIS SESSION
Added a "Research grounding" subsection to CONTENT-ROADMAP-4-SKILLS.md
§1.5 (Behavior Science), citing 4 papers from the 54-paper
research/literature/behavior_science.json corpus against specific design
claims (named source + access date, per RESEARCH-METHODOLOGY.md §4):
- Gardner & Rebar 2019 (habit = context-cued, willpower-detached) grounds
  the premature_advice hard-fail gate.
- Michie et al. 2011 "Behaviour Change Wheel" grounds the closed 5-term
  TECHNIQUE taxonomy.
- Sheeran et al. 2023 "Activation Versus Change" grounds the if/then PLAN
  format + environmental redesign as a technique.
- Ma et al. 2023 meta-regression (social-reward beta=-0.40, problem-solving
  beta=+0.36) grounds the technique_matched gate restricting accountability
  check-in to social loops -- cited as an honest caution, not just support.
Verified the Unit B claim (habit stacking + accountability check-in gated
to Theo/Sam's social loop) against the actual doc before citing it -- matches.
This closes the earlier finding that CONTENT-ROADMAP-4-SKILLS.md had zero
citations back to the 246-paper research corpus despite the corpus existing.

## EXACT NEXT STEP
User was offered, not yet confirmed: run the same grounding-citation pass
on the other 4 skills (Communication, Problem-Solving, Critical Thinking,
Decision-Making), each citing its own topic's JSON in research/literature/
against its own §1.x design claims in CONTENT-ROADMAP-4-SKILLS.md. Ask
before starting if not already confirmed. Behavior Science implementation
in code (packages/core/schemas.ts, validator.ts, score.ts) is still NOT
started -- roadmap spec is grounded but unbuilt.

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
