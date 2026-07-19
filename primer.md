# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.
_Last touched: 2026-07-19 (checkpoint)._

## STATUS
Autopilot Phase 2 done and verified (prior session). Phase 4 validation:
architect APPROVE (x2), security-reviewer APPROVE Risk-LOW (x2).
code-reviewer (agent id `ac9a7eb575e9ea495`) verdict still not landed as
of last check - unresolved blocker, unrelated to this session's work.

Separate, unrelated side task this session: built a literature-fetch
script (arXiv API + Semantic Scholar API, stdlib-only, no scraping
needed) at `research/fetch_literature.py` to ground the 4-skill
curriculum + behavior science in academic sources. Script ran but
returned 0 results for all 5 topics - root cause found: local Python
3.10 (python.org build) has no CA cert bundle, so every HTTPS/HTTP
request throws `SSLCertVerificationError: unable to get local issuer
certificate`. Not a sandbox/network block - a known python.org-installer
gap.

## EXACT NEXT STEP
Autopilot thread (higher priority, pre-existing blocker):
1. Collect code-reviewer's explicit verdict (do NOT `TaskOutput` it -
   dumps full transcript). If still nothing after 1-2 more checks,
   dispatch one fresh code-reviewer agent against the same diff (2/3
   reviewers already clean APPROVE).
2. On all-3 APPROVE: Phase 5 - delete `.omc/state/{autopilot,ralph,
   ultrawork,ultraqa}-state.json`, run `/oh-my-claudecode:cancel`.
3. On reject: fix file:line issues, re-run affected suite, re-validate
   only that reviewer (max 3 rounds).

Literature research thread (side task, resume when convenient):
1. Fix SSL certs: `/Applications/Python 3.10/Install Certificates.command`
   (or `uv pip install --system certifi` + set `SSL_CERT_FILE` env var to
   `certifi.where()`).
2. Re-run `python3 research/fetch_literature.py` from repo root.
3. Check `research/literature/INDEX.md` + per-topic `.json` files got
   populated (non-empty); if Semantic Scholar 429s, the script already
   retries 3x with backoff - just re-run if it still fails.

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
