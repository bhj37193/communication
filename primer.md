# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 2 (full scenario-unit serve path) implemented and
verified in a prior session. Phase 4 validation: architect APPROVE (x2),
security-reviewer APPROVE Risk-LOW (x2). Prior code-reviewer verdict
(agent id `ac9a7eb575e9ea495`) was untraceable this session (no
`.omc/state/{autopilot,ralph,ultrawork,ultraqa}-state.json`, no tracked
Task, no saved verdict) - treated as lost. A fresh code-reviewer agent
(worktree-isolated, background, agent id `ae3c693954390d110`) was
dispatched against the Phase 1 plan scope - IN FLIGHT, verdict not yet
collected as of this checkpoint.

Side task (DONE this session): `research/fetch_literature.py`
(arXiv API + Semantic Scholar API, stdlib-only). Root cause of earlier
all-zero results was two stacked bugs: (1) machine's Python had no CA
cert bundle (fixed via `certifi` + `SSL_CERT_FILE`, prior session), (2)
arXiv query URL wasn't fully percent-encoded, throwing `InvalidURL` on
every request (fixed: encode the whole `search_query` incl. category
filter via `urlencode`, not just the term string). Also added a
non-clobber guard (don't overwrite a non-empty topic JSON with an empty
result on re-run) since Semantic Scholar's unauthenticated API 429s
intermittently per-topic. Re-ran clean: all 5 topics have real, on-topic
papers (communication 17, problem_solving 15, critical_thinking 30,
decision_making 15, behavior_science 29). Changes uncommitted:
`research/fetch_literature.py`, `research/literature/*`.

## EXACT NEXT STEP
1. Collect code-reviewer agent `ae3c693954390d110`'s verdict (do NOT
   `TaskOutput`/read its transcript file directly - wait for the
   completion notification, or `SendMessage` it if it seems stuck).
2. On APPROVE (all 3 reviewers clean): Phase 5 - confirm
   `.omc/state/{autopilot,ralph,ultrawork,ultraqa}-state.json` don't
   exist (they didn't as of this checkpoint - likely a no-op), then run
   `/oh-my-claudecode:cancel`.
3. On REJECT: fix file:line issues, re-run affected suite, re-validate
   only that reviewer (max 3 rounds).
4. Ask user whether to commit the literature-fetch changes - not yet
   committed, sitting alongside the autopilot work.

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
