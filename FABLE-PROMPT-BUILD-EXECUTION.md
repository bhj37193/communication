# FABLE PROMPT: build-execution plan for autonomous agents (charisma chat trainer)

Paste everything below into Fable 5. It takes the LOCKED design (PRD-CHARISMA-CHAT.md,
including its voice appendix Section 8) and produces the execution layer that lets
autonomous Sonnet coding agents build the system to each human gate. If Fable has
filesystem access, PRD-CHARISMA-CHAT.md, MCP-ENGINE-SPEC.md, and COMMUNICATION-PRINCIPLES.md
are in the same folder; everything load-bearing is restated inline.

---

You are Fable 5, acting as principal engineer and build orchestrator. A complete,
build-ready design already exists in PRD-CHARISMA-CHAT.md. **That PRD is LOCKED. Do not
redesign it.** Your job is to turn it into a BUILD-EXECUTION PLAN that a fleet of
autonomous Sonnet coding agents can follow to build the product to each human gate with no
further design input. **Make every remaining decision yourself. Do not ask questions.** Be
concrete to the file, the schema, the command, and the acceptance test. No em-dashes
anywhere in your output (use commas, colons, periods, parentheses).

If you find a genuine defect or contradiction in the PRD while planning, do NOT silently
change the design: collect them in a short "Spec deltas" section at the top with a one-line
fix each, and otherwise treat the PRD as fixed.

## The locked design in one paragraph (context, do not re-derive)

A consumer, text-chat, daily-challenge charisma trainer. Expo (iOS+Android) + Next.js
marketing/checkout, one Node 22 + TypeScript + Fastify backend, Postgres 16 via Drizzle, no
Redis. pnpm monorepo: `apps/mobile`, `apps/web`, `apps/server`, `packages/core`
(engine+validator+schemas), `packages/content` (skill packs). Anthropic `claude-haiku-4-5`
behind a `ChatModel` interface (swappable to self-hosted at a named trigger). Clerk auth.
Paddle Billing (Merchant of Record) on web only, app is login-only. The moat is a
server-owned constraint engine plus a DETERMINISTIC validator that recomputes every signal
and substring-checks every model quote, so the model can flatter prose but never mint a
pass or a score. Freemium (1 free challenge/day). Build order is thin-slice-first: Phase 0
is one complete loop (the "Sam housewarming" unit) on the real stack, gated on whether the
aha is addictive, before any breadth. Full schemas, the score formula, the API surface, the
phases, and the sample unit are already specified in the PRD.

## The core requirement: an autonomy-first plan built on a MOCK BOUNDARY

Autonomous agents cannot create accounts, hold real secrets, submit to app stores, or judge
whether a loop is fun. Your plan must be structured so agents are NEVER blocked waiting on a
human. Achieve this with a strict mock boundary:

- **Every external dependency sits behind an interface with a Fake implementation**, not
  just the model. At minimum: `ChatModel` (Fake returns scripted `{reply, warmth_delta,
  reason_code}` and scripted feedback JSON), auth (a Fake auth verifier that mints a test
  user from a header), Paddle (a Fake billing client + a local webhook-replay fixture),
  Sentry (no-op), and the future Apple/Google receipt validators (interface only). The real
  implementation and the Fake implement the same interface; the composition root picks by
  env var; tests always use the Fake.
- **The entire system is buildable and test-passing OFFLINE** against Fakes plus a local
  Postgres (Docker). An agent with zero real credentials can scaffold the monorepo,
  implement `packages/core` (validator, score, schemas, interfaces) with its full fixture
  suite, build every server endpoint and the state machine and both model touchpoints
  against `FakeChatModel`, run Drizzle migrations against local Postgres, build the Expo
  screens against a mock API, load the content pack, and get green typecheck + unit +
  integration + e2e-smoke. The `FakeChatModel` driving a scripted good-run and bad-run
  through the real validator is what makes Phase 0's whole server verifiable with no API key.
- **Humans enter only at deploy checkpoints and judgment gates**, never mid-build. A human
  swaps real credentials in at the end of a phase; agents keep the build green against Fakes
  until then.

## Depth priority (this is a one-shot run)

The plan's primary job is to carry autonomous agents from task 1 to the FIRST human gate: a
green, offline, self-verifying Phase 0 core and server. Spend your depth there. Phase 0 gets
exhaustive, immediately-actionable detail: every task with its exact acceptance command,
every contract it touches, the full fixture suite, the complete mock boundary. Phases 1 to 5
are a lighter forward sketch that proves the architecture holds (key tasks, the new
interfaces each phase introduces, the phase gate), NOT task-level granularity. It is better
to fully finish Phase 0 than to evenly thin all six phases.

## Produce ONE structured document with these sections

**1. Spec deltas (if any).** Defects found in the PRD, one-line fix each. Empty is fine.

**2. Repo scaffold.** The exact monorepo file tree, every file with a one-line
responsibility, matching the PRD's pnpm layout. Include `packages/core` module split
(`model.ts`, `speech.ts`, `validator.ts`, `score.ts`, `schemas.ts`, `engine.ts`),
`packages/content/everyday/*`, the three apps, `docker-compose.yml`, `Caddyfile`, the
GitHub Actions workflows, and the test folders. Name the Fake files explicitly
(`fakes/FakeChatModel.ts`, etc.).

**3. The mock boundary.** For each external dependency: the interface (TypeScript), the real
implementation class, the Fake implementation and exactly what it returns, and the env var
that selects between them. Include the scripted transcripts the `FakeChatModel` replays
(one good run that warms Sam to 3, one bad run that stays flat) so the validator and scoring
are exercisable end to end offline.

**4. Exact contracts.** For every endpoint in the PRD's API surface: the Zod request and
response schema. The full Drizzle schema and the initial migration SQL for every table in
the PRD data model. The complete env-var manifest as a table (name, purpose, who provides it
[agent-default mock vs human-only real], example/mock value). The verbatim character
system-prompt TEMPLATE (the wrapper around the unit persona that injects server-held warmth
and demands the strict `{reply, warmth_delta, reason_code}` JSON); the feedback prompt is
already in the unit spec, reference it.

**5. Task DAG.** A dependency-ordered list of tasks, each sized for ONE agent in one
session. Each task has: an id, its dependency ids, the files it creates/edits, a one-line
goal, and an explicit MACHINE-CHECKABLE acceptance criterion (the exact command that must
pass, e.g. `pnpm --filter core test` green, or an integration assertion). Group tasks by
phase (PRD Phases 0 to 5). Per PRD Section 8.5, include a Phase 1 task that builds the
DORMANT voice seam (the `SpeechProvider`/`VoiceProvider` interfaces, their Fakes, and the
`POST /v1/sessions/:id/voice-message` push-to-talk endpoint) behind `VOICE_ENABLED=false`,
tested against the Fakes, so enabling voice later is an env key plus one client screen, not
a rewrite. Mark each task AUTONOMOUS (buildable against Fakes) or
GATED (needs a specific human gate cleared first, name which). The critical path to a
green, offline, self-verifying Phase 0 server + validator must be entirely AUTONOMOUS tasks.

**6. Human-gate register.** A table of every human-only action, covering: (a) external
accounts and secrets (Anthropic key + zero-retention org setting, Clerk app + keys, Paddle
account + business/tax verification + products + webhook secret, Hetzner box + SSH + Storage
Box, domain + DNS, Apple Developer + App Store Connect + certs + APNs + TestFlight, Google
Play Console + signing, Sentry DSN, GitHub Actions secrets); (b) business and legal (Korean
young-entrepreneur SME incorporation + business bank account, which gates Paddle payout and
any revenue; product-name trademark check; content/TOS IP sign-off before public launch);
(c) judgment go/no-go gates (the Phase 0 aha gate with cold testers, persona/feedback prompt
tuning to taste, app-store submission and review responses, the model-swap trigger and its
blind quality judgment, the growth gate D7 >= 20% and free-to-paid >= 2%, the decision to
turn revenue on after entity + tax clearance); (d) manual assets (scenario-card
illustration, App Store screenshots and copy, UGC creator hire and brief). For each row:
which DAG task or phase it gates, exactly what the human must produce (the specific key,
asset, or decision), and how agents proceed without it (which Fake, which stub, which
"stop and flag" point). The default posture is: agents build to the gate against the Fake,
then STOP and surface a precise, copy-pasteable request for what the human must provide.

**7. Per-phase agent runbook.** For each PRD phase: the ordered task ids, the phase's
definition-of-done (all acceptance criteria green plus the human checkpoint that ends the
phase), the exact verification commands an agent runs to self-check, and the human gate(s)
that must clear before the next phase starts. Reproduce the PRD's Phase 0 aha-gate metrics
as the Phase 0 exit criteria.

**8. Verification harness and autonomy protocol.** The test strategy agents rely on to
self-verify without a human: unit tests (the validator fixture suite is the centerpiece,
including at least the good-run and bad-run scripted transcripts and known-answer signal
counts), integration tests (server + ephemeral Postgres + Fakes), and an e2e smoke
(scripted FakeChatModel through the full loop asserting the deterministic score). Then the
agent operating rules: never invent or hardcode a real secret (use the Fake and flag the
gate), never mark a task done with a red acceptance criterion, never fake past a human gate,
keep diffs small (one task equals one PR), and when blocked at a gate emit the exact human
request rather than guessing.

Decide everything. The output must be concrete enough that a Sonnet agent can pick up task 1
and build, and that a human reading the gate register knows exactly which accounts, secrets,
legal steps, and judgment calls they must supply and when.
