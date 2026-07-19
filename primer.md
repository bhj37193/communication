# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Everything is DONE, VALIDATED, and COMMITTED. Working tree is clean
(`git status` = nothing to commit) and `state_list_active` reports no
active OMC modes. Nothing is in flight.

Full scenario-unit serve-path feature (fold.ts, router.ts, generalized
sessions.ts, GET /v1/challenge/today, mobile getChallenge()): Phase 4
validation cleared (architect APPROVE, security-reviewer APPROVE
Risk-LOW, code-reviewer APPROVE Risk-LOW). Implementation-complete.

Side task DONE + committed: `research/fetch_literature.py` - fixed the
arXiv query URL percent-encoding bug (only `query` was quoted, not the
full assembled string incl. category filter, which left raw spaces ->
`InvalidURL` on every arXiv call). Non-clobber guard added so a 0-result
run (e.g. Semantic Scholar 429) doesn't overwrite good existing data.
All 5 topics have real papers; exact per-topic counts drifted slightly
across reruns from concurrent sessions hitting live APIs - re-run the
script if you need a fresh authoritative count. `research/*` is
committed, not a pending working-tree change.

⚠ CONCURRENCY: this repo had 3 autopilot sessions racing on this exact
task/primer.md simultaneously earlier today (session ids started
3689665d/4d32b76a/7b90af06). If more than one Claude Code tab is still
open on this project, `/clear` the extras to stop duplicate work.

## EXACT NEXT STEP
No autopilot work in flight - nothing to resume. Ask the user what
feature/task to work on next.

## LOCKED DECISIONS (do not re-litigate)
4-skill taxonomy final; non-AI drill self-attested pass; 8 drill reps +
1 AI capstone/stage; expert anchors credibility-only; no pricing
content in curriculum; engine extends never redesigns; connection/
clarity north stars parallel. Full scenario-unit serve-path scope over
drill-only slice; spec/plan Non-goals are locked cuts; `prd.md`
obsolete, PRD-CHARISMA-CHAT.md is source of truth.

## OUTSTANDING OPS
App-store tasks #1-4 user-blocked; FABLE-PROMPT-PROVEN-PROGRESS.md
deferred, unrelated.

## DOC REFS
PRD-CHARISMA-CHAT.md | .omc/plans/autopilot-impl.md | apps/server/src/
routes/sessions.ts | apps/server/src/services/{fold,router,profile,
caps}.ts | apps/mobile/app/index.tsx | apps/mobile/lib/api.ts |
CONTENT-ROADMAP-4-SKILLS.md | RESEARCH-METHODOLOGY.md |
research/fetch_literature.py
