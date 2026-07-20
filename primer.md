# Primer: Charisma Trainer -> 5-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-20._

## STATUS
Problem-Solving vertical slice DONE and verified by my own pass (full
monorepo test suite green: core 108/108, server 43/43, mobile 26/26; tsc
--noEmit clean core+server). Background code-reviewer agent (task id
ae04e4257c2a4ecc5) still RUNNING across many context rotations. Partial
findings so far, all favorable, none final: schemas.ts and validator.ts
confirmed purely additive vs baseline commit 09ea317 (zero removed/changed
lines); isQuestion/isFollowup bodies in validator.ts unchanged; its own
tsc --noEmit clean. No defects reported yet. IMPORTANT: stop calling
TaskOutput on this agent -- each call dumps hundreds of KB of its sidechain
transcript and is what's spiking context to the watchdog threshold every
rotation. Just wait for its completion notification passively; a
ScheduleWakeup fallback is already set. Source of truth for the 5-skill
design is CONTENT-ROADMAP-4-SKILLS.md (NOT PRD-CHARISMA-CHAT.md).

## COMPLETED THIS SESSION
Unchanged from prior rotations: schemas.ts (Problem*Schema additions),
validator-problem.ts (new), score.ts (PROBLEM_WEIGHTS + scoreProblem),
mastery.ts (new, masteryLevel() per §2.3), content/problem-solving.dying-
plants.json (stage-1 unit), validator-problem.test.ts + mastery.test.ts.
All additive; Communication engine untouched.
NOT done: wiring content.ts/seed.ts/DB routes to serve PS live;
Decision-Making/Critical Thinking/Behavior Science (strictly sequential,
PS was first).

## EXACT NEXT STEP
1. Wait for the code-reviewer agent (ae04e4257c2a4ecc5) completion
   notification (do NOT call TaskOutput on it again -- context cost). If
   findings exist, fix them (small additive diffs), re-run
   `pnpm vitest run` + `tsc --noEmit`. If clean, go to step 2.
2. Ask the user: wire Problem-Solving into content.ts/seed.ts/a route so
   it's playable, OR start Decision-Making's slice next. Do not start it
   unprompted -- sequential build order.

## LOCKED DECISIONS (do not re-litigate)
5-skill taxonomy (Communication done, Problem-Solving code-layer done,
others not started). Build order strictly sequential (§3). mastery_level
0-10 per skill, computed not stored, caps at 6 -- packages/core/mastery.ts.
CONTENT-ROADMAP-4-SKILLS.md is source of truth.

## OUTSTANDING OPS
App-store tasks #1 (name), #2 (icon/screenshots), #4 (Apple Developer
enrollment) user-blocked; #3 (privacy policy) done, live at
https://bhj37193.github.io/communication/. Repo public (GitHub Pages).
FABLE-PROMPT-PROVEN-PROGRESS.md deferred.

## DOC REFS
CONTENT-ROADMAP-4-SKILLS.md (§1.2 PS, §2 shared engine, §2.3 mastery,
§3 sequencing) | packages/core/{schemas,validator,score,mastery,
validator-problem}.ts | packages/core/content/problem-solving.dying-plants.json
