PRECONDITION (check this FIRST, before anything else):
- Run `pwd`. It MUST be exactly /Users/main/Desktop/Active Projects/communication.
- If it is NOT, STOP immediately and tell the user this and nothing else: "Wrong working directory. Relaunch me from the project folder in a dedicated tmux session: tmux new-session -s charisma -c '/Users/main/Desktop/Active Projects/communication' claude . The ralph loop (context-watchdog + primer-resumer) is cwd-relative: if the session cwd is not this folder it will NOT send /clear and will NOT continue from primer.md."
- Do not proceed with any build work until pwd is correct. This one check is what stops the /clear + auto-continue loop from silently breaking.

Continue the charisma communication app build. You have NO prior conversation context; everything you need is on disk. Do not ask me questions; proceed.

READ FIRST (in order):
1. /Users/main/Desktop/Active Projects/communication/primer.md  (the LATEST + STATUS blocks: current state, locked decisions, next action)
2. /Users/main/Desktop/Active Projects/communication/BUILD-PLAN-MAP.md  (phase + task map)
3. /Users/main/Desktop/Active Projects/communication/BUILD-EXECUTION-PLAN.md  (targeted sections ONLY, via Read offset/limit, never the whole file): scaffold 91-255, Drizzle schema+migration 611-924, env 925-959, mock boundary 256-490, API contracts 493-610, character prompt 960-1030, Phase 0 tasks 1031-1278.

ENVIRONMENT FACTS (do not re-discover):
- Native Postgres 18 runs on localhost:5432. Databases `charisma` and `charisma_test` already exist. Superuser is OS user `main` (local trust auth, no password). NO Docker; dev and test use the native Postgres.
- Node 22 + pnpm work. `packages/core` is verified GREEN (63/63 tests + typecheck). Reuse it; never modify its logic or tests.

CONTINUE BUILDING PHASE 0 (the offline backend slice) toward a green, offline, self-verifying challenge loop:
- If not yet scaffolded: root pnpm workspace (including packages/core) + apps/server (Fastify + TS) + Drizzle schema and 0000_init migration applied to `charisma_test` (adapt owner/role to superuser `main`, keep the least-privilege `charisma_app` role + append-only revoke).
- Then the session / chat-turn / submit-scoring endpoints wired to packages/core (validator + score) + FakeChatModel + FakeAuthVerifier + the daily cap and cost circuit breaker.
- Then ONE integration test driving FakeChatModel's scripted GOOD and BAD runs end to end: good passes with its exact deterministic score, bad fails, fabricated-quote feedback is rejected. Tests connect to `charisma_test`, NO real API key.

DOCTRINE (every file):
- Ponytail: least code that works; reuse packages/core; stdlib/native over deps; no interface-with-one-impl, no factory-for-one-product, no config-for-a-constant, no speculative "for later" code; deletion over addition; one runnable check per non-trivial path.
- Security-by-construction (ref /Users/main/Desktop/Reference/sec-skills/Anthropic-Cybersecurity-Skills): Zod-validate input; parameterized Drizzle SQL only; secrets in env only, never in code/logs/bundle; fail-closed env in prod; least-privilege charisma_app role; no PII or conversation content in logs/errors.

WORK STYLE:
- Small steps. After each, run typecheck + the relevant tests and confirm green (redirect verbose output to /tmp/*.log, read only tails, keep context lean). Never fake a test to green. Stop at any human gate (real account/secret) and report it, do not invent credentials.

REFRESH EARLY AND OFTEN (do NOT try to judge your context percentage, you cannot measure it reliably):
- Do AT MOST ONE build task per cycle: one plan task only (e.g. the scaffold, OR the Drizzle migration, OR one endpoint group, OR the integration test). Never chain several tasks in one context.
- As soon as that one task is done and its tests are green (or you hit a blocker or human gate), update primer.md's STATUS block with exactly: what is now done, what is verified green (with the command), and the single next action.
- Then STOP and print this exact line on its own:  PRIMER UPDATED - READY TO CLEAR
- That line is the signal for the driver to /clear and re-send this handoff.
- If a CONTEXT WATCHDOG reminder appears telling you that you are past the threshold, obey it immediately: finish the current step, update primer.md, print the line above, and stop.
