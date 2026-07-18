# META-PROMPT — Communication Training Software (Idea → Deployment)

> **What this file is.** A meta prompt. You hand this to the planning model (Fable 5). Fable 5 reads it and emits a single **`BUILD-WORKFLOW.md`** master plan. That master plan is then split across **parallel sub-agents** who build the entire software from scratch, from idea to deployment, following the exact phase workflow defined here.
>
> **Read order for the planning model:** (1) resolve every item in §2 OPEN DECISIONS, (2) honor §1 LOCKED CONSTRAINTS and §3 CLEAN-ROOM DISCIPLINE without exception, (3) produce the deliverable specified in §7 OUTPUT CONTRACT using the §5 PHASE FRAMEWORK and §6 SUB-AGENT ORCHESTRATION rules.

---

## 0. Role & Mission (for the planning model)

You are **Fable 5**, acting as principal architect and program planner. You do not write feature code in this pass. Your single job is to turn this meta prompt into `BUILD-WORKFLOW.md`: a phased, dependency-ordered, sub-agent-assignable build plan that another fleet of agents can execute autonomously to ship a **web + mobile communication-training product** end to end.

Success = a plan so unambiguous that a parallel sub-agent, given only its slice, can build, self-verify, and hand off without asking a human a clarifying question.

---

## 1. LOCKED CONSTRAINTS (evidence-backed — do not change)

These are decided. Do not re-litigate them in the plan.

| Area | Decision | Notes |
|---|---|---|
| **Mobile** | **Expo (React Native)** | One codebase, native iOS + Android. Use Clerk's first-class Expo SDK. Share types/logic with web. |
| **Auth** | **Clerk** | Web (`@clerk/nextjs`) + mobile (`@clerk/clerk-expo`). Single Clerk instance across both. No custom auth. |
| **Hosting** | **Self-hosted VPS** | Everything runs on the VPS. **No managed cloud / no PaaS (no Supabase, Vercel, Railway, etc.).** Self-host Postgres, app, and any workers on the VPS. |
| **Speech-to-text** | **Deepgram** — two modes | **Batch (`nova-2`)** for the corpus build (reuse `deepgram.py`: `POST https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true&punctuate=true&language=en&diarize=true`). **Streaming (WebSocket, real-time)** for the live practice loop, so feedback arrives while the user is speaking. Free tier = $200 signup credits. Historically chained **Deepgram (STT) → Claude → ElevenLabs (TTS)** at ~$0.12/min. |
| **Planning model** | **Fable 5** | This meta prompt is model-agnostic in output; Fable 5 runs the planning pass. |

**Stack — DEFAULT (confirm in §2, then lock):**
Web + API: **Next.js + Prisma + Postgres + pnpm**, mirroring patterns from the existing `Desktop/camaradery` project (the user is already fluent in this). Mobile: **Expo**. If §2 confirms greenfield, use the same stack but a clean slate (do not import camaradery code, only conventions).

---

## 2. OPEN DECISIONS — resolve BEFORE emitting the plan

> ⚠️ **Do not guess these.** They change the product's architecture. If unresolved when planning starts, stop and ask the user. Each has the sharpest tie-breaking question embedded.

### 2A. Product definition & the MCP server (the core of the moat)
The user's stated direction: *"There will be an MCP server I will create which will be read-only. The user would have full access to the MCP server, which is why the UI will be very simple, almost identical to Claude — our moat."*

Working interpretation (VERIFY): the product is a **thin, Claude-like chat client (web via Next.js, mobile via Expo)** where an LLM is wired to a **read-only MCP server** that serves the clean-room communication-training corpus. The moat = the curated corpus behind MCP; the UI is deliberately commoditized/minimal.

Resolve, explicitly, before planning:
1. **Who builds the MCP server?** The user says "I will create" it. If so, the MCP server (and possibly the Deepgram→corpus feed) is **out of scope** for the sub-agents; the sub-agents build the **consuming client + the integration contract** against it. Confirm the scope boundary and get the MCP server's tool/resource schema (or a stub contract) before building the client.
2. **"Full access to the MCP server" — who is "the user"?** In a plain chat app the *LLM* holds MCP access, not the end user. Clarify: is the end user directly browsing/querying MCP resources (a knowledge-explorer UX), or is it a chat UX where the LLM calls MCP tools on the user's behalf? These are different builds.
3. **TIE-BREAKER (answers most of the above):** *Is recording / Deepgram transcription a **user-facing** feature (user records themselves → gets AI feedback), or **purely internal** (transcription only builds the corpus, never surfaced to end users)?* One answer collapses the product's core loop.

### 2B. Scope of the workflow
Confirm one:
- **Build + content pipeline** — sub-agents build the app AND the clean-room pipeline (video → Deepgram → markdown → corpus/MCP feed).
- **Software build only** — sub-agents build the app; user runs the content pipeline separately with existing `deepgram.py`.
- **Content pipeline only** — corpus first, app later.

### 2C. Codebase lineage
- **Reuse camaradery** (copy proven patterns) **vs. greenfield** (new folder = clean slate, conventions only). This is a *new* `communication` folder, so confirm intent rather than assuming.

---

## 3. CLEAN-ROOM DISCIPLINE (mandatory — legal guardrail)

The source is **paid course material** (Vin Gang / Stage Academy). "Turn his lessons into markdown" must **never** mean paraphrase-and-store. Encode this into every content-pipeline task:

- **Extract ideas, not expression.** Capture non-copyrightable **principles, frameworks, and techniques** (facts and methods are not protected); reconstruct them **independently in original wording**.
- **Reproduce nothing verbatim.** No copied sentences, no close paraphrase, no lightly-reworded transcripts stored as product content. Transcripts, if used at all, are **transient inputs for principle-extraction**, then discarded — not shipped.
- **Independent reconstruction.** A separate authoring pass writes fresh lesson content from the extracted principle list, with no access to the original phrasing.
- **Attribution & ToS.** Respect the course platform's terms; do not redistribute source media. When unsure, prefer generic communication-science sourcing over the specific course.

Any sub-agent task touching source material must carry this block verbatim in its brief.

---

## 4. GLOBAL ENGINEERING CONVENTIONS

- **Monorepo** (pnpm workspaces): `apps/web` (Next.js), `apps/mobile` (Expo), `packages/*` (shared types, API client, config), plus `services/*` for any workers (transcription, corpus build) and the MCP client integration.
- **One source of truth for types** (`packages/types` or Prisma-generated) shared web ↔ mobile ↔ API.
- **Env & secrets:** `.env.example` committed, real `.env` never committed. Keys needed: `CLERK_*`, `DATABASE_URL`, `DEEPGRAM_API_KEY`, LLM provider key(s), `ELEVENLABS_API_KEY` (if TTS), MCP endpoint/credentials.
- **Prose rule:** no em-dashes anywhere in code, docs, or commits.
- **Every PR/agent handoff** ships with tests + a self-verification note (see §6 DoD).

---

## 5. PHASE FRAMEWORK — Idea → Deployment

The plan must be organized into these phases. Each phase lists: objective, inputs, work items (each sub-agent-assignable), exit criteria, and the artifact(s) it produces. Phases are dependency-ordered; parallelizable work within a phase is marked `∥`.

**Phase 0 — Discovery & Definition**
Lock §2 OPEN DECISIONS. Produce: one-paragraph product definition, the core user loop, the MCP integration contract (or confirmation it's user-owned), and a non-goals list. *Gate: no downstream phase starts until 2A/2B/2C are closed.*

**Phase 1 — Architecture & Contracts**
System diagram, data model (Prisma schema), API surface (shared client contract), MCP tool/resource contract, auth flows (Clerk on web + Expo), and the corpus schema. Produce `ARCHITECTURE.md` + `openapi`/typed client stub. Everything below depends on these frozen contracts.

**Phase 2 — Foundations (∥ heavy)**
- ∥ Repo/monorepo scaffold, CI, lint/format, env plumbing.
- ∥ Clerk integration (web + mobile) with a protected route smoke test.
- ∥ Database + Prisma migrations + seed.
- ∥ Shared `packages/*` (types, API client, design tokens).
*Exit: a signed-in user can load an empty web page and an empty Expo screen against the real DB.*

**Phase 3 — Content / Corpus Pipeline** (only if §2B includes it)
Video → Deepgram (`nova-2`, diarized) → transcript → **principle extraction (clean-room, §3)** → independent lesson authoring → corpus records / MCP-served resources. Reuse `deepgram.py`. Each step is a separate, testable stage with intermediate artifacts in a dedicated folder.

**Phase 4 — Core Product Build (∥ by surface, against frozen contracts)**
- ∥ MCP client integration + LLM orchestration (the chat/knowledge core).
- ∥ Web UI (thin, Claude-like) — minimal by design.
- ∥ Mobile UI (Expo) — parity with web core loop.
- ∥ Any user-facing recording/feedback flow (only if §2A tie-breaker = user-facing).
*All surfaces consume the Phase 1 contracts; no surface invents its own API.*

**Phase 5 — Integration & Hardening**
Wire surfaces together, end-to-end flows, error/empty/loading states, rate limits, cost guards on Deepgram/LLM/TTS, security pass (authz on every route, MCP is read-only enforced), accessibility.

**Phase 6 — Test & Verify**
Unit + integration + e2e (web e2e, Expo e2e), MCP contract tests, a full "signed-in user completes the core loop on web and mobile" acceptance test. Independent verifier agent, separate from authors.

**Phase 7 — Deploy to VPS**
Provision VPS, reverse proxy (Caddy/Nginx + TLS), Postgres, app process manager (systemd/PM2/Docker Compose), Expo build/submit (EAS or self-hosted), zero-downtime deploy script, backups, monitoring/logs, secrets on the box. Produce a runbook. *No managed cloud anywhere.*

**Phase 8 — Post-deploy**
Smoke/canary on production, rollback procedure, cost dashboard, and a "definition of live" checklist signed off.

---

## 6. SUB-AGENT ORCHESTRATION RULES

The plan must make every work item executable by an independent agent.

- **Task brief format** (each item): `id`, `phase`, `objective`, `inputs/deps` (other task ids or artifacts), `deliverables`, `interfaces it must honor` (link to Phase 1 contracts), `definition of done`, and `clean-room block` if it touches source material.
- **Parallelism:** items with no shared dependency and no file-collision run concurrently. Mark them `∥`. Serialize anything that writes the same files or depends on a frozen contract.
- **Contract-first:** no surface-level agent starts until the contracts it consumes (Phase 1) are frozen. Contracts change only via an explicit re-freeze that notifies dependents.
- **Author ≠ verifier:** the agent that writes code never approves it. A separate verifier agent checks each phase's exit criteria with evidence (test output, screenshots, logs).
- **Definition of Done (every task):** builds clean; tests written and passing; types check; self-verification note with evidence; no secrets committed; no em-dashes; honors the frozen contract.
- **Handoff artifact:** each completed task appends a short receipt (what changed, files, how verified, follow-ups) so the next agent has context without re-reading everything.

---

## 7. OUTPUT CONTRACT — what Fable 5 must emit

Produce **`BUILD-WORKFLOW.md`** in `/Users/main/Desktop/communication/` containing, in order:

1. **Product definition** (resolved from §2) — 1 paragraph + core loop + non-goals.
2. **Locked stack & constraints** (from §1, with §2 confirmations applied).
3. **Architecture summary** + link to `ARCHITECTURE.md` (data model, API contract, MCP contract, auth flows).
4. **The phase plan** (§5) fully expanded, every phase with concrete work items.
5. **The task backlog** — a flat, numbered list of sub-agent-assignable task briefs (§6 format), topologically ordered, with `∥` parallel groups marked and a dependency graph.
6. **Risk & cost register** — clean-room/legal (§3), API cost guards (Deepgram/LLM/TTS), VPS ops risks, with mitigations.
7. **Definition of live** — the acceptance checklist that means "shipped."

If any §2 OPEN DECISION is still unresolved, **do not emit the backlog**; instead emit only Phase 0 and the exact questions blocking progress.

---

### Appendix A — Known assets to reuse
- **`deepgram.py`** (in this Desktop project's history): batch transcription, `nova-2`, `smart_format`, `punctuate`, `diarize`. The proven video→markdown STT step.
- **`Desktop/camaradery`**: Next.js + Prisma + Postgres + pnpm reference patterns (RBAC in `src/lib/rbac.ts`, billing routes, Prisma schema). Conventions to mirror if §2C = reuse.

### Appendix B — Status of decisions
- ✅ Mobile = Expo · ✅ Auth = Clerk · ✅ Host = VPS (no PaaS) · ✅ STT = Deepgram (batch + streaming) · ✅ Planner = Fable 5
- ✅ **Core loop = real-time record → AI feedback** (user-facing, live; Deepgram streaming). The corpus (via MCP) tells the AI what "good" looks like; the live transcript is what the user did; the gap is the lesson.
- ✅ **First user = the owner, dogfooding** what they learned from Vin Gang / Stage Academy.
- ✅ **Workflow scope = build + content pipeline** (course videos → Deepgram batch → exact markdown → clean-room principle extraction → corpus/MCP).
- ⏳ MCP server (§2A) — to be **built together, after the corpus exists**; scope/schema TBD.
- ⏳ Communication domain (stage/public-speaking vs broader) · ⏳ Codebase lineage (§2C)

### Appendix C — Immediate next step (blocked on user)
1. **User**: finish gathering all course videos, run Deepgram batch → exact 1:1 transcripts into a folder on the Desktop.
2. **Then Claude**: read that folder's structure and design the canonical **markdown file structure** that mirrors it (the corpus schema: principle → exemplar → drill → measurable signal, per §5 Phase 3 and the skill-tree decomposition).
3. **Then together**: design + build the read-only MCP server over that corpus.
*Verbatim transcripts are private extraction material; clean-room (§3) applies only to shipped product content.*
