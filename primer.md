# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 4 validation COMPLETE and CLEARED: architect APPROVE
(x2), security-reviewer APPROVE Risk-LOW (x2), fresh code-reviewer
APPROVE Risk-LOW (dispatched this session after the prior verdict went
untraceable). All 3 reviewers clean. Phase 5 cleanup done: 3 stale
autopilot session states (all `awaiting_confirmation` leftovers from
earlier `/clear` checkpoints today) cleared via `state_clear`; no ralph/
ultrawork/ultraqa states existed. `state_list_active` now reports no
active modes. The Phase 1 "full scenario-unit serve path" feature
(fold.ts, router.ts, generalized sessions.ts + GET /v1/challenge/today,
mobile getChallenge()) is implementation-complete and validated -
autopilot cycle for this feature is DONE.

Side task (DONE this session): `research/fetch_literature.py` fixed and
verified - all 5 topics have real, on-topic papers (communication 17,
problem_solving 15, critical_thinking 30, decision_making 15,
behavior_science 29). Fixed a CA-cert issue (prior session) and an
arXiv URL percent-encoding bug (`InvalidURL` on every request); added a
non-clobber guard against Semantic Scholar's intermittent per-topic
429s overwriting good data. Uncommitted:
`research/fetch_literature.py`, `research/literature/*`.

## EXACT NEXT STEP
No autopilot work in flight. Next session should:
1. Ask user whether to commit the literature-fetch changes (uncommitted
   working-tree changes in `research/`).
2. Ask user for the next feature/task - this cycle's scope
   (`.omc/plans/autopilot-impl.md`, full scenario-unit serve path) is
   fully shipped and validated. No known blockers remain.

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
