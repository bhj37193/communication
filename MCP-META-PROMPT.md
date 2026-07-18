# MCP-META-PROMPT: Communication Trainer as a Gated MCP Server (Idea → Deployment)

> **What this file is.** A meta prompt. You hand this to the planning model (Fable 5). Fable 5 reads it and emits a single **`MCP-BUILD-WORKFLOW.md`** master plan. That plan is split across **parallel sub-agents** who build a **remote, subscription-gated MCP server** that a paying customer connects to their **own** AI client. This is a fork of `META-PROMPT.md` (the original full web+mobile app plan), repivoted to the MCP-first, bring-your-own-subscription model locked in the primer.
>
> **The one thing to get right:** the moat is **pedagogy + state, not information.** Spend the plan's depth on §5 (the pedagogy layer) and §6 (the gated MCP contract). Everything else is plumbing. Do **not** over-engineer the corpus/extraction step (§4B), it is the least defensible, most legally exposed, least differentiated part of the stack.
>
> **Read order:** (1) resolve every item in §2 OPEN DECISIONS, (2) honor §1 LOCKED CONSTRAINTS and §3 CLEAN-ROOM DISCIPLINE without exception, (3) produce §9 OUTPUT CONTRACT using the §7 PHASE FRAMEWORK and §8 ORCHESTRATION rules.

---

## 0. Role & Mission (for the planning model)

You are **Fable 5** (`claude-fable-5`), acting as principal architect and program planner. You do not write feature code in this pass. Your single job is to turn this meta prompt into `MCP-BUILD-WORKFLOW.md`: a phased, dependency-ordered, sub-agent-assignable plan to ship a **remote MCP server** that sells a coached communication-training progression as a monthly subscription, where **the customer's own AI subscription pays for all inference.**

Success = a plan so unambiguous that an independent sub-agent, given only its slice, can build, self-verify, and hand off without a human clarifying question, AND a plan whose depth is concentrated on the moat (the pedagogy and the gating), not spread evenly across plumbing.

---

## 1. LOCKED CONSTRAINTS (the model pivot: do not re-litigate)

These are decided in the primer. Do not reopen them in the plan.

| Area | Decision | Notes |
|---|---|---|
| **Product shape** | **A single remote MCP server.** No web app, no mobile app, no custom chat UI, no owner-hosted LLM. | The customer connects the server to **their own** AI client (Claude first-class; ChatGPT/Copilot later, per §2). We ship a server + a one-page landing, nothing more. |
| **Inference cost** | **≈ $0 to the owner.** The customer's own subscription runs all reasoning. | The server never calls an LLM in the hot path. Only recurring owner cost = **VPS hosting**. This is the entire economic thesis; do not design anything that pulls per-user inference cost back onto the owner. |
| **Content delivery** | **Progress-gated TOOLS and PROMPTS. Never bulk-readable resources.** | Serve **one** drill/lesson/rubric at a time, chosen by the user's state. No tool may dump the corpus. This is the anti-exfiltration guarantee: the clean-room content (§3) leaks one unit at a time, by design. |
| **Moat** | **Pedagogy + state.** The coached multi-week progression, and the per-user progress that drives it. | NOT the information. Anyone can list "communication principles." The defensible asset is the sequenced, stateful coaching loop. Plan depth goes here (§5). |
| **Auth + billing** | **OAuth 2.1 Resource Server (per the MCP authorization spec) + Stripe monthly subscription.** | Access tokens are short-lived and **expire unless the Stripe subscription is active**. Verified per-user access gates every tool call. |
| **State** | **Per-user progress store on the VPS** (Postgres). | The recurring-revenue justification: the progression is stateful and multi-week. Storing it costs ~$0 in inference. |
| **Hosting** | **Self-hosted VPS.** No managed cloud / no PaaS. | Self-host Postgres, the MCP server, the auth server, and the landing page. |
| **Corpus STT** | **Deepgram batch (`nova-3`), DONE, internal, one-time.** | 144 course videos are **already transcribed** (see Appendix A). STT is not on the critical path and is never user-facing. Do not plan it as new work. |
| **Planning model** | **Fable 5.** | Output is model-agnostic; Fable 5 runs this planning pass. |

**Launch shape (locked):** ship the **pure connector coach first** to validate the ONE ratio that decides everything: *does the practice loop convert and renew?* Do not fund heavier surfaces until that ratio is proven. See §2 for which of the three directions (A/B/C) to draft.

**Stack, DEFAULT (confirm in §2, then lock):** **TypeScript** on Node, using the official **MCP SDK** (`@modelcontextprotocol/sdk`) over the **Streamable HTTP** transport; **Postgres + Prisma** for state (mirrors the owner's existing `Desktop/camaradery` fluency); **Stripe** SDK for billing; an OAuth 2.1 authorization server (self-hosted or a spec-compliant provider, resolve in §2). Python + the MCP Python SDK is an acceptable alternative if §2 chooses it.

---

## 2. OPEN DECISIONS: resolve BEFORE emitting the plan

> ⚠️ **Do not guess these.** Each changes the architecture. If unresolved when planning starts, stop and ask the user. Sharpest tie-breaker is embedded.

### 2A. Which direction ships first (the primer's three)
- **A: Pure MCP connector coach.** Lives entirely inside the user's Claude; server = tools + prompts + state. Simplest, fastest to validate.
- **B: Connector + installable Skill pack (RECOMMENDED in primer).** The MCP serves data + gating; a shipped Skill shapes the coaching *behavior*. Cleanest path to evolve. **Recommend drafting B**, with A as the strippable MVP inside it.
- **C: Own app + customer BYO API key.** Owns the UX but loses the subscription-cost magic and narrows the funnel. **Fallback only**, do not draft unless the user overrides.
- **TIE-BREAKER:** *Does the coaching behavior need to be guaranteed identical for every customer regardless of their client's system prompt?* If yes → B (ship the Skill). If "good enough via MCP prompts" → A.

### 2B. Live-voice feedback: IN or OUT of v1?
Deepgram **streaming** (live speech → real-time feedback) is the **only** feature that drags inference/infra cost back onto the owner and breaks the ≈$0 thesis.
- **RECOMMEND OUT of v1.** Use a **paste-transcript / describe-your-attempt** flow: the user speaks, their own client transcribes or they paste, the client's LLM scores it against the rubric the MCP returns. Keeps owner cost ≈$0.
- Alternatives if the user insists it is core: companion app, or customer-supplied Deepgram key (cost stays off the owner). Resolve explicitly; it reshapes Phase 4.

### 2C. Target AI clients for v1
Claude is first-class for MCP + OAuth. **Confirm:** Claude-only for v1, or must ChatGPT/Copilot work at launch? Per-client auth and tool-calling support differ; multi-client at launch multiplies auth testing.

### 2D. Pricing + subscription shape
Stripe needs a concrete plan. **Confirm:** monthly price, single tier vs tiers, free trial length (if any), and whether a lapsed subscription **freezes** progress (retained, read-locked) or **revokes** it. Recommend freeze-not-delete (cheaper to win back).

### 2E. Domain scope
Stage / public-speaking only (matches the source material), or broader interpersonal/business communication? Narrow ships faster and coaches better; confirm.

### 2F. Principle sourcing (ties to §3)
**Confirm the sourcing posture:** principles sourced **primarily from the public communication-science canon** (recommended, cleaner IP, broader coverage), with the paid transcripts used at most as a **transient private sanity-check**, never as the spine and never shipped. The alternative (transcripts-as-spine) is not recommended and raises the §3 legal risk sharply.

---

## 3. CLEAN-ROOM DISCIPLINE (corrected + hardened: legal guardrail)

The source is **paid course material** (Vinh Giang / Stage Academy). The primer's "clean-room" framing needs a correction encoded into every content task, because the protection does **not** work the way the original META-PROMPT assumed:

- **A clean room requires a real wall.** Clean-room design protects you only when the people who studied the original (and wrote down only non-protectable facts) are **separated** from the people who build the new thing (who never see the original expression). A single pipeline that transcribes → extracts → authors has **no wall** and gets **no protection**: it is the most traceable possible derivative path. Enforce the wall as a process, or do not claim the protection.
- **Source from the public canon first (§2F).** Communication principles (vocal variety, pacing, pausing, story structure, body language) live in dozens of public books and are not anyone's IP. Build the principle spine from public sources. The paid transcripts are, at most, a **transient sanity-check**: never the spine, never stored as product content, never shipped.
- **Extract ideas, not expression.** Facts, methods, and techniques are not copyrightable; specific **wording, examples, exercise sequences, and the selection/arrangement of the curriculum** can be. Do not mirror the source's module order, its specific exemplars, or its exercise sequence, that is exactly what a "substantially similar" claim targets (compilation copyright).
- **Independent reconstruction.** A separate authoring pass writes fresh content from the principle spine with **no access** to the original phrasing.
- **Get counsel before shipping.** Route the reconstructed corpus past an IP lawyer before it goes live. Treat "clean-room" as a process to be verified, not a label that confers safety.

Any sub-agent task touching source material must carry this block **verbatim** in its brief.

---

## 4. WORK THAT IS ALREADY DONE / DELIBERATELY SMALL

### 4A. Transcription: DONE (do not re-plan)
144 course videos are already transcribed to Markdown via Deepgram `nova-3` (Appendix A). Do not scope STT as new work.

### 4B. Corpus extraction: SMALL, DE-RISKED, NOT the moat
Per the owner's decision, **do not build an elaborate extraction meta-prompt.** Plan the minimum:
- **One direct extraction prompt**, tested on a **single skill** first, then run across the principle spine. No meta-prompt-that-writes-a-prompt.
- Output records conform to the §5 corpus schema (principle → exemplar → drill → measurable signal → rubric → mastery threshold).
- Sourcing follows §2F and §3 (public-canon-primary).
- This is a Phase 2 side-track, **not** a gate on the moat. Keep it lean.

---

## 5. THE PEDAGOGY LAYER: the moat (EXPAND THIS THE MOST)

This is the centerpiece. The plan must make Fable 5 (via a dedicated design sub-agent) produce a **`PEDAGOGY.md`** that specifies, concretely:

1. **The skill tree / progression graph.** The set of communication skills, their prerequisite edges, and the unlock order. What a learner must master before the next thing opens. This graph, not the content, is the product.
2. **The unit schema.** Every servable unit as: `principle → exemplar → drill → measurable signal → rubric → mastery threshold`. Define each field's shape so a tool can return exactly one unit.
3. **The coached multi-week progression.** How a user moves week to week: pacing, spaced repetition / review scheduling, when a skill is considered mastered vs due-for-review, how streaks and lapses behave.
4. **The gating logic.** Given a user's state, which single unit does the server serve next, and why. This is the algorithm behind the progress-gated tools (§6). Make it deterministic and testable.
5. **The $0-cost scoring loop (critical, see Appendix C).** The customer's own AI does the reasoning; the server holds state. Specify the round-trip precisely:
   - A tool returns the current drill **plus its rubric and coaching instructions**.
   - The customer's client (Claude) coaches the user, then **evaluates the user's attempt against the rubric**.
   - The client calls back a `submit_attempt`-style tool with a **structured verdict** (per-criterion scores, pass/fail, notes).
   - The server **validates and stores** the verdict as state, advances the progression, and returns the next gated unit.
   - The server runs **no inference** at any step. Design the rubric so scoring is as objective as possible, and add server-side sanity checks (see §6 and the risk register) because the client is effectively grading its own homework.
6. **Mastery + review model.** State machine for each skill: locked → available → in-progress → mastered → due-for-review. The recurring value lives here.
7. **Anti-exfiltration by pedagogy.** One unit per call; no unit reveals the graph; rate-limit and state-gate so a scraper cannot walk the whole corpus. The drip *is* the product.

`PEDAGOGY.md` is a **hard gate**: no MCP tool, no corpus record, no auth work proceeds until the schema and gating logic are frozen.

---

## 6. MCP SERVER DESIGN (tools, prompts, auth: the contract)

Fable 5 must produce an **`MCP-CONTRACT.md`** specifying:

- **Tools (all progress-gated + subscription-gated), e.g.:**
  - `where_am_i`: the user's current position, next action, and due reviews (state read).
  - `get_current_unit`: returns the single active unit + rubric + coaching prompt.
  - `submit_attempt`: accepts the client's structured verdict; validates, stores, advances.
  - `get_review_queue`: spaced-repetition items due now (one at a time).
  - Each tool: input schema, output schema, the state precondition that gates it, and the subscription check.
- **Prompts (MCP prompts):** the coach-persona system prompt(s) that shape the client LLM into the trainer. In Direction B, these are reinforced by the shipped Skill.
- **Resources:** **none non-trivial.** If any exist, they must be per-user, state-scoped, and non-enumerable. Justify any resource against the anti-exfiltration rule or omit it.
- **Transport:** Streamable HTTP (remote). Note the deprecated SSE transport and do not use it.
- **Authorization (OAuth 2.1 Resource Server, per the MCP auth spec):** the server is a Resource Server; publish Protected Resource Metadata (RFC 9728) pointing at the authorization server; support Dynamic Client Registration; issue **short-lived, audience-bound access tokens** (RFC 8707 resource indicators). **Fable 5 must verify these details against the current MCP authorization spec revision before freezing**: the spec evolves; cite the revision used.
- **Billing coupling:** token issuance and periodic re-validation check **live Stripe subscription status**; a Stripe webhook revokes/expires access on cancellation or payment failure. Lapsed = tokens stop minting; progress is frozen not deleted (per §2D).

---

## 7. PHASE FRAMEWORK: Idea → Deployment

Dependency-ordered. Parallelizable work marked `∥`. **Depth is intentionally uneven: Phase 1 is the deepest.**

**Phase 0: Discovery & Definition.** Close every §2 decision (direction A/B/C, live-voice in/out, clients, pricing, domain, sourcing). Produce: one-paragraph product definition, the core user loop, and a non-goals list. *Gate: nothing downstream starts until §2 is closed.*

**Phase 1: Pedagogy design (THE MOAT: deepest phase).** Produce `PEDAGOGY.md` (§5): skill tree, unit schema, progression, gating logic, the $0-cost scoring loop, mastery/review model. *Hard gate: freezes the schema every later phase consumes.*

**Phase 2: Corpus build (lean side-track, §4B).** One extraction prompt, tested on a single skill, then run to populate unit records against the frozen schema. Clean-room §3, public-canon-primary §2F. Runs `∥` with early Phase 3 scaffolding since it only writes data rows.

**Phase 3: MCP server core (against frozen `MCP-CONTRACT.md`).** Tools + prompts + per-user state store, built and testable **locally, unauthenticated**, with the full gating logic and the scoring round-trip working against a stub client. *Exit: a scripted fake client can complete one skill end to end.*

**Phase 4: Auth + billing.** OAuth 2.1 Resource Server, Protected Resource Metadata, Dynamic Client Registration, short-lived audience-bound tokens; Stripe subscription + webhook; token issuance gated on live subscription. *Exit: only a paying, authorized user can call a gated tool; cancellation expires access within one token lifetime.*

**Phase 5: Landing + connect instructions (∥ with Phase 4).** One page: what it is, price, "connect to your Claude" steps, and (Direction B) the Skill install. No app.

**Phase 6: Integration & hardening.** End-to-end against a **real Claude client**: full loop (auth → get unit → coach → submit verdict → advance → review). Anti-exfiltration verified (no tool walks the corpus), rate limits, scoring-loop abuse checks, security pass (read-only-by-design, authz on every tool, tokens audience-bound), error/empty/lapsed states.

**Phase 7: Deploy to VPS.** Provision VPS, reverse proxy (Caddy/Nginx + TLS), Postgres, the MCP server + auth server as managed processes (systemd/Docker Compose), Stripe webhooks reachable, secrets on the box, backups, logs/monitoring. Runbook. *No managed cloud.*

**Phase 8: Post-deploy: validate the ONE ratio.** Instrument the practice loop and answer the only question that matters: **does it convert and renew?** Canary, rollback procedure, and a cost check confirming owner spend ≈ VPS-only. A "definition of live" checklist signed off.

---

## 8. SUB-AGENT ORCHESTRATION RULES

- **Task brief format** (each item): `id`, `phase`, `objective`, `inputs/deps`, `deliverables`, `interfaces it must honor` (link to `PEDAGOGY.md` / `MCP-CONTRACT.md`), `definition of done`, and the §3 clean-room block if it touches source material.
- **Contract-first:** no MCP/tool/corpus/auth agent starts until `PEDAGOGY.md` (Phase 1) and `MCP-CONTRACT.md` (Phase 3 spec) are frozen. Contracts change only via explicit re-freeze that notifies dependents.
- **Parallelism:** items with no shared dependency and no file collision run `∥`. Serialize anything writing shared files or depending on a frozen contract.
- **Author ≠ verifier:** the agent that writes code never approves it. A separate verifier checks each phase's exit criteria with evidence (test output, logs, a real-client transcript for Phase 6).
- **Definition of Done (every task):** builds clean; tests written and passing; types check; self-verification note with evidence; no secrets committed; no em-dashes; honors the frozen contract; and, for any hot-path code, proves the server ran **zero inference**.
- **Handoff receipt:** each completed task appends a short receipt (what changed, files, how verified, follow-ups).

---

## 9. OUTPUT CONTRACT: what Fable 5 must emit

Produce **`MCP-BUILD-WORKFLOW.md`** in `/Users/main/Desktop/communication/`, containing, in order:

1. **Product definition** (resolved from §2), 1 paragraph + the core loop + non-goals, stating the BYO-subscription / ≈$0-inference thesis explicitly.
2. **Locked stack & constraints** (from §1, with §2 confirmations applied).
3. **Pedagogy summary** + link to `PEDAGOGY.md` (skill tree, unit schema, gating, scoring loop). This section is the longest.
4. **MCP contract summary** + link to `MCP-CONTRACT.md` (tools, prompts, auth, billing coupling).
5. **The phase plan** (§7) fully expanded, each phase with concrete work items, Phase 1 deepest.
6. **The task backlog**, a flat, numbered list of sub-agent-assignable briefs (§8 format), topologically ordered, `∥` groups marked, with a dependency graph.
7. **Risk & cost register**, (a) clean-room/legal (§3) and the wall-enforcement process; (b) the **$0-cost-loop assumptions** and the client-grades-own-homework abuse surface, with mitigations; (c) OAuth/token security; (d) VPS ops; (e) the conversion/renewal risk the whole launch is meant to test.
8. **Definition of live**, the acceptance checklist, culminating in the **one validation metric**: the practice loop converts and renews, at owner cost ≈ VPS-only.

If any §2 OPEN DECISION is unresolved, **do not emit the backlog**, emit only Phase 0 and the exact blocking questions.

---

### Appendix A: Assets already built (do not rebuild)
> **Role boundary.** The transcripts below are a **private extraction input, bounded by §2F and §3**: a transient sanity-check at most. They are **not** the corpus spine and are **never** shipped as product content. "Do not rebuild" means "do not re-transcribe," NOT "build the product from these." The corpus spine comes from the public canon (§2F).
- **`SOURCE-DO-NOT-SHIP/transcripts/`**: 144 per-video Markdown transcripts (Deepgram `nova-3`, timestamped). Private extraction input only, per the role boundary above.
- **`SOURCE-DO-NOT-SHIP/transcripts/_combined/`**: 10 per-module combined files (one per module, with TOC).
- **`transcribe.py`** (single video), **`batch_transcribe.py`** (full tree, resumable), **`combine_modules.py`** (module combiner). The proven, idempotent corpus-input pipeline.
- **`Desktop/camaradery`**: Next.js + Prisma + Postgres + pnpm reference patterns (billing routes, Prisma schema) to mirror for the state store and Stripe wiring.

### Appendix B: Status of decisions
- ✅ Product = remote gated MCP server · ✅ Inference paid by customer's own subscription (owner ≈ $0) · ✅ Content served as progress-gated tools/prompts, never bulk resources · ✅ Moat = pedagogy + state · ✅ Auth = OAuth 2.1 RS + Stripe, expiring tokens · ✅ State = per-user store on VPS · ✅ Host = VPS (no PaaS) · ✅ STT = Deepgram batch (done) · ✅ Planner = Fable 5 · ✅ Launch = pure connector coach, validate the loop first
- ⏳ §2A direction A/B/C (recommend B) · ⏳ §2B live-voice in/out (recommend OUT) · ⏳ §2C client scope · ⏳ §2D pricing/lapse behavior · ⏳ §2E domain scope · ⏳ §2F principle sourcing (recommend public-canon-primary)

### Appendix C: The critical insight: the $0-cost scoring loop
The server is a **state machine and a content dripper, not a brain.** All reasoning (coaching, evaluating an attempt, giving feedback) runs on the **customer's** AI subscription. The server only: (1) returns the next gated unit + its rubric, (2) receives a structured verdict the client produced, (3) stores it and advances state. This is what makes gross margin approach ~95%+ instead of being eaten by inference COGS. **Every design choice must preserve it.** The known weakness: the client grades its own homework and a user could coax a lenient verdict, so rubrics must lean on objective/measurable signals and the server must sanity-check verdicts. This is a coaching product, not a certifier; some gaming is tolerable, silent cost-leakage is not.

### Appendix D: Provenance
Fork of `META-PROMPT.md` (original web+mobile app plan). Diverges deliberately on: product shape (MCP server, not app), cost model (customer pays inference), delivery (gated tools, not a chat client), auth (OAuth 2.1 RS + Stripe, not Clerk), and emphasis (pedagogy as the deepest phase, extraction deliberately shrunk). Companion docs: `primer.md` (locked direction), `projection.html` / `paid-vs-freemium.html` (economics).
