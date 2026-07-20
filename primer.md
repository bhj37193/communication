# Primer: Charisma Trainer -> 5-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19._

## STATUS
Problem-Solving vertical slice DONE and verified: full monorepo test suite
green (packages/core 108/108, apps/server 43/43, apps/mobile 26/26, 0
regressions), tsc --noEmit clean (core + server). An independent
code-reviewer pass was launched (background agent) to check the signal
logic and additivity claims before declaring final-done; it had not yet
reported back at this context rotation -- treat as unconfirmed, re-check
or just re-run a fresh code-reviewer pass on the files listed below if no
result is found. Source of truth for the 5-skill design is
CONTENT-ROADMAP-4-SKILLS.md (NOT PRD-CHARISMA-CHAT.md, which is only 853
lines and covers only the existing single-skill engine, Sections
3.4/4.1-4.7).

## COMPLETED THIS SESSION
Added (all additive, zero existing exports touched, Communication scores
bit-identical before/after): schemas.ts (ProblemSignalsSchema,
ProblemUnitSchema, ProblemReasonCodeSchema, ProblemCharacterOutputSchema);
validator-problem.ts (new, marker lists + computeSignals/signalValue/
passes, reuses isQuestion/isFollowup from validator.ts); score.ts
(PROBLEM_WEIGHTS + scoreProblem, first-pass weights, roadmap doesn't
specify exact numbers); mastery.ts (new, masteryLevel() -- pure §2.3
function); content/problem-solving.dying-plants.json (full stage-1 unit);
validator-problem.test.ts + mastery.test.ts (known-answer style).
NOT done (out of scope for this slice): wiring content.ts/seed.ts/DB
routes to serve PS live; Decision-Making/Critical Thinking/Behavior
Science (roadmap §3: strictly sequential, never parallel -- PS was first).

## EXACT NEXT STEP
1. Check whether the code-reviewer background pass reported findings; if
   findings exist, fix them (all files are additive-only, small diffs).
   If no result recoverable, just re-run code-reviewer on: schemas.ts,
   validator-problem.ts, score.ts, mastery.ts,
   content/problem-solving.dying-plants.json, validator-problem.test.ts,
   mastery.test.ts.
2. Then ask the user: wire Problem-Solving into content.ts/seed.ts/a
   route so it's actually playable, OR start Decision-Making's slice next
   (same pattern just proven for Problem-Solving).

## LOCKED DECISIONS (do not re-litigate)
5-skill taxonomy (Communication done, Problem-Solving code-layer done,
Decision-Making/Critical Thinking/Behavior Science not started). Build
order strictly sequential (§3). mastery_level per-skill 0-10, computed not
stored, caps at 6 -- implemented in packages/core/mastery.ts.
CONTENT-ROADMAP-4-SKILLS.md is source of truth for the 5-skill design.

## OUTSTANDING OPS
App-store tasks #1 (name), #2 (icon/screenshots), #4 (Apple Developer
enrollment) remain user-blocked; #3 (privacy policy) done, live at
https://bhj37193.github.io/communication/. Repo public (GitHub Pages).
FABLE-PROMPT-PROVEN-PROGRESS.md deferred.

## DOC REFS
CONTENT-ROADMAP-4-SKILLS.md (§1.2 PS, §2 shared engine, §2.3 mastery,
§3 sequencing) | packages/core/{schemas,validator,score,mastery,
validator-problem}.ts | packages/core/content/problem-solving.dying-plants.json
