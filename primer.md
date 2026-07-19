# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 2 done and verified (prior session). Phase 4 validation:
architect APPROVE (x2), security-reviewer APPROVE Risk-LOW (x2).
code-reviewer verdict (agent id `ac9a7eb575e9ea495`) still not landed as
of last check - unresolved blocker, unrelated to this session's work.

Side task this session: literature-fetch script for the 4-skill
curriculum + behavior science research, `research/fetch_literature.py`
(arXiv API + Semantic Scholar API, stdlib-only, no scraping needed).
First run returned 0 results for all 5 topics: root cause was this
machine's python.org Python 3.10 having no CA cert bundle
(SSLCertVerificationError on every request). Fixed by installing
`certifi` (`uv pip install --system certifi`) and setting
`SSL_CERT_FILE` to `certifi.where()` when invoking the script. Re-run
launched with the fix; NOT YET VERIFIED - background job's output was
still empty at last check, completion/results unconfirmed.

## EXACT NEXT STEP
Literature research (do this first, it's mid-flight):
1. Check `research/literature/*.json` are non-empty and
   `research/literature/INDEX.md` lists real papers per topic. If still
   empty, rerun in foreground: `cd "communication" && SSL_CERT_FILE=$(python3
   -c "import certifi; print(certifi.where())") python3
   research/fetch_literature.py` and read actual stdout/errors (Semantic
   Scholar 429s auto-retry 3x; arXiv has a built-in 3s/request delay so
   full run takes ~30-60s for 5 topics).
2. Report per-topic paper counts back to user.

Autopilot thread (pre-existing blocker, resume after above):
3. Collect code-reviewer's explicit verdict (do NOT `TaskOutput` it -
   dumps full transcript). If still nothing, dispatch one fresh
   code-reviewer agent against the same diff (2/3 reviewers already
   clean APPROVE).
4. On all-3 APPROVE: Phase 5 - delete `.omc/state/{autopilot,ralph,
   ultrawork,ultraqa}-state.json`, run `/oh-my-claudecode:cancel`.
5. On reject: fix file:line issues, re-run affected suite, re-validate
   only that reviewer (max 3 rounds).

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
