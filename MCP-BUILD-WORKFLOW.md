# MCP-BUILD-WORKFLOW: Communication Trainer (master build plan)

> Emitted from `MCP-META-PROMPT.md` (§9 OUTPUT CONTRACT), with §2 OPEN DECISIONS resolved provisionally (see §0). Planning pass run by Opus 4.8 standing in for Fable 5 (output is model-agnostic per the meta-prompt §0). Every §2 default here is reversible; changing one re-opens the phases that consume it.
>
> No em-dashes anywhere (owner rule). Clean-room block (meta-prompt §3) is mandatory on every task touching source material.

---

## 0. Resolved decisions (provisional, reversible)

| # | Decision | Value | Blast radius if changed |
|---|---|---|---|
| 2A | Direction | **B: connector + installable Skill pack**, with A (pure connector) as the strippable MVP inside it | Phase 5 (Skill), Phase 3 (prompts) |
| 2B | Live-voice | **OUT of v1.** Paste-transcript / describe-attempt flow | Phase 4/6 (would add streaming + cost) |
| 2C | Clients | **Claude-only for v1** | Phase 4 (auth), Phase 6 (client testing) |
| 2D | Pricing | **PLACEHOLDER: $29/mo, single tier, 7-day trial, freeze-on-lapse** (owner to confirm the number) | Phase 4 config only, not architecture |
| 2E | Domain | **Stage / public-speaking** | Phase 1 skill tree, Phase 2 corpus |
| 2F | Sourcing | **Public-canon-primary.** Transcripts = private sanity-check only, never the spine, never shipped | Phase 2 (all corpus tasks) |

---

## 1. Product definition

A **remote, subscription-gated MCP server** that coaches one skill of public speaking at a time. A paying customer connects it to **their own Claude** (Direction B also ships a Skill that fixes the coaching behavior). The server holds each user's progress and, on each call, hands the client exactly one unit (principle + drill + rubric + coaching prompt). The customer's Claude does all the reasoning: it coaches, watches the user's attempt (pasted or described), scores it against the rubric, and reports a structured verdict back to a tool. The server validates and stores that verdict, advances the progression, and serves the next unit. **The server never runs inference.** Owner recurring cost is VPS-only; the customer's subscription pays for all reasoning.

**Core loop:** `authenticate (OAuth 2.1 + live Stripe check) -> where_am_i -> get_current_unit (returns rubric + coaching prompt) -> client coaches + scores the user's attempt -> submit_attempt (structured verdict) -> server advances state -> next unit or review`.

**Non-goals (v1):** no web/mobile app, no custom chat UI, no owner-hosted LLM, no live-voice streaming, no multi-client support beyond Claude, no bulk-readable corpus, no shipping of source-derived expression.

## 2. Locked stack & constraints

- **Runtime/SDK:** TypeScript on Node, official `@modelcontextprotocol/sdk`, **Streamable HTTP** transport (SSE transport is deprecated, not used).
- **State:** Postgres + Prisma (mirrors `Desktop/camaradery` patterns).
- **Auth:** OAuth 2.1 Resource Server per the MCP authorization spec (Protected Resource Metadata / RFC 9728, Dynamic Client Registration, short-lived audience-bound tokens / RFC 8707). **Verify against the current MCP auth spec revision before Phase 4 freeze; cite the revision.**
- **Billing:** Stripe subscription; token minting gated on live subscription status; webhook revokes on cancel/failure.
- **Hosting:** self-hosted VPS, no PaaS. Reverse proxy (Caddy/Nginx + TLS), processes via systemd or Docker Compose.
- **Discipline:** author != verifier; DoD includes "server ran zero inference" for hot-path code; clean-room block on source-touching tasks; no em-dashes; no secrets committed (`.env` holds `DEEPGRAM_API_KEY` for corpus only, plus `STRIPE_*`, `DATABASE_URL`, OAuth signing keys).

## 3. Pedagogy summary (the moat) -> full spec in `PEDAGOGY.md` (Phase 1 gate)

Sourced from the **public speaking canon** (2F), NOT the source course's arrangement (3, clean-room). Working skill-tree spine (to be finalized in `PEDAGOGY.md`):

```
Foundations (audience contract, nerves, presence)
  -> Vocal delivery (rate, volume, pitch/melody, tonality, pause)
  -> Physical presence (stance/grounding, gesture, eye contact, movement)
  -> Narrative (story spine, tension, specificity, linking)
  -> Dynamic range (adapting delivery to room/intent)   [depends on vocal + physical]
  -> Integration (full-talk assembly + self-review)      [depends on all above]
```

**Unit schema (every servable unit):** `principle -> exemplar -> drill -> measurable signal -> rubric -> mastery threshold`.

**Gating logic:** deterministic. Given user state, the server returns the single next unlocked, non-mastered, or due-for-review unit. No unit reveals the graph.

**The $0-cost scoring loop (critical, meta-prompt Appendix C):** tool returns drill + rubric + coaching prompt; client coaches and scores; client calls `submit_attempt` with per-criterion scores + pass/fail + notes; server validates, stores, advances. Server does zero inference. Weakness: client grades its own homework -> rubrics lean on objective/measurable signals (e.g. "3+ distinct pitch changes," "pause >= 2s before the key line," "story has a concrete named detail"), and the server sanity-checks verdicts (shape, score bounds, monotonic-progress guards).

**Mastery/review model:** per-skill state machine `locked -> available -> in-progress -> mastered -> due-for-review`, with spaced-repetition scheduling driving recurring value.

## 4. MCP contract summary -> full spec in `MCP-CONTRACT.md` (Phase 3 gate)

**Tools (all progress-gated + subscription-gated):**
| Tool | In | Out | Gate |
|---|---|---|---|
| `where_am_i` | none | position, next action, due reviews | valid token |
| `get_current_unit` | none | one unit: principle + drill + rubric + coaching prompt | state has an active/available unit |
| `submit_attempt` | structured verdict (per-criterion scores, pass/fail, notes) | accepted/rejected, advanced state, next pointer | active unit exists; verdict passes sanity checks |
| `get_review_queue` | none | one due review item | reviews due now |

**Prompts:** coach-persona system prompt(s) shaping the client into the trainer (reinforced by the Skill in Direction B).
**Resources:** none non-trivial (anti-exfiltration). Any must be per-user, state-scoped, non-enumerable.
**Auth/billing:** as §2. Lapsed subscription = tokens stop minting, progress frozen not deleted.

## 5. Phase plan (depth intentionally uneven; Phase 1 deepest)

- **Phase 0: Discovery lock.** Ratify §0 decisions (or override). Produce product definition + core loop + non-goals. *Gate: closed here.*
- **Phase 1: Pedagogy design (MOAT, hard gate).** Produce `PEDAGOGY.md`: skill tree, unit schema, gating logic, $0-cost scoring loop, mastery/review model, objective rubric-signal library. *Gate: freezes the schema all later phases consume.*
- **Phase 2: Corpus build (lean side-track, `∥` with Phase 3 scaffold).** One extraction prompt, tested on ONE skill, then run to populate unit records against the frozen schema. Public-canon-primary; clean-room block on every task; transcripts sanity-check only.
- **Phase 3: MCP server core.** Tools + prompts + per-user state store, testable locally + unauthenticated, full gating + scoring round-trip against a stub client. Produce `MCP-CONTRACT.md` first (spec gate), then implement. *Exit: scripted fake client completes one skill end to end.*
- **Phase 4: Auth + billing.** OAuth 2.1 RS, PRM, DCR, short-lived audience-bound tokens; Stripe subscription + webhook; minting gated on live status. *Exit: only a paying authorized user can call a gated tool; cancel expires access within one token lifetime.*
- **Phase 5: Landing + Skill (`∥` with Phase 4).** One-page landing (what/price/connect steps) + the installable coaching Skill (Direction B). No app.
- **Phase 6: Integration + hardening.** End-to-end against a REAL Claude client; anti-exfiltration verified (no tool walks the corpus); rate limits; scoring-abuse checks; security pass (authz on every tool, tokens audience-bound, read-only by design); error/empty/lapsed states.
- **Phase 7: Deploy to VPS.** Provision, reverse proxy + TLS, Postgres, processes, reachable Stripe webhooks, secrets on box, backups, logs/monitoring, runbook. No managed cloud.
- **Phase 8: Validate the ONE ratio.** Instrument the practice loop: does it convert and renew? Canary, rollback, cost check (owner spend ≈ VPS-only), definition-of-live sign-off.

## 6. Task backlog (topologically ordered; `∥` = parallelizable)

**Phase 0**
- T0.1 Ratify or override §0 decisions; write product-definition + non-goals block.

**Phase 1 (gate)**
- T1.1 Draft skill tree + prerequisite edges from the public canon (clean-room block). dep: T0.1
- T1.2 Define unit schema + the objective rubric-signal library. dep: T1.1
- T1.3 Specify deterministic gating logic + mastery/review state machine. dep: T1.2
- T1.4 Specify the $0-cost scoring round-trip + verdict shape + server sanity checks. dep: T1.2
- T1.5 Assemble + freeze `PEDAGOGY.md`; verifier signs off. dep: T1.3, T1.4

**Phase 2 (`∥` with T3.1-T3.2)**
- T2.1 Write ONE extraction prompt; test on ONE skill; human-review output (clean-room block). dep: T1.5
- T2.2 Run extraction to populate all unit records vs frozen schema (clean-room block). dep: T2.1
- T2.3 Content verifier: no verbatim/expression leakage, no mirrored source arrangement. dep: T2.2

**Phase 3**
- T3.1 Write + freeze `MCP-CONTRACT.md` (tool/prompt schemas, gates). dep: T1.5
- T3.2 Scaffold server (SDK, Streamable HTTP, Prisma schema for state). dep: T3.1 `∥` T2.x
- T3.3 Implement tools + gating + scoring round-trip (no inference). dep: T3.2, T2.2
- T3.4 Stub-client e2e: complete one skill end to end. verifier. dep: T3.3

**Phase 4**
- T4.1 OAuth 2.1 RS: PRM, DCR, short-lived audience-bound tokens (verify spec revision). dep: T3.4
- T4.2 Stripe subscription + webhook; mint gated on live status; freeze-on-lapse. dep: T4.1
- T4.3 Security verifier: authz on every tool, token audience binding, cancel-expiry test. dep: T4.2

**Phase 5 (`∥` with Phase 4)**
- T5.1 One-page landing (what/price/connect-to-Claude steps). dep: T3.1
- T5.2 Installable coaching Skill (Direction B) bound to the MCP prompts. dep: T3.1

**Phase 6**
- T6.1 Real-Claude-client e2e of the full loop. dep: T4.3, T5.2
- T6.2 Anti-exfiltration + rate-limit + scoring-abuse hardening. dep: T6.1
- T6.3 Independent security/verification pass. dep: T6.2

**Phase 7**
- T7.1 VPS provision + proxy/TLS + Postgres + processes + secrets + webhooks. dep: T6.3
- T7.2 Backups, logs/monitoring, runbook. dep: T7.1

**Phase 8**
- T8.1 Instrument convert/renew metric; canary; rollback; cost check. dep: T7.2
- T8.2 Definition-of-live sign-off. dep: T8.1

**Dependency graph (spine):**
`T0.1 -> T1.1 -> T1.2 -> {T1.3, T1.4} -> T1.5 -> {T2.1->T2.2->T2.3  ∥  T3.1->T3.2->T3.3->T3.4} -> T4.1->T4.2->T4.3 -> (T5.* ∥ T4.*) -> T6.1->T6.2->T6.3 -> T7.1->T7.2 -> T8.1->T8.2`

## 7. Risk & cost register

| Risk | Severity | Mitigation |
|---|---|---|
| **Clean-room / IP** (source-derived expression leaks into shipped content) | High | Public-canon-primary spine (2F); wall between transcript-readers and authors; no mirrored arrangement; clean-room block on every corpus task; IP counsel before ship. |
| **$0-cost loop breaks** (design sneaks owner-side inference in) | High | DoD requires "zero inference on hot path"; live-voice OUT (2B); verifier checks server never calls an LLM. |
| **Client grades own homework** (user coaxes lenient verdict) | Medium | Objective rubric signals; server-side verdict sanity checks + monotonic-progress guards; it is a coach not a certifier, some gaming tolerable, silent cost-leak is not. |
| **OAuth/token security** (over-broad or long-lived tokens) | High | Short-lived audience-bound tokens; authz on every tool; verify spec revision; cancel-expiry test in T4.3. |
| **Exfiltration** (scraper walks the corpus) | Medium | One unit per call; no graph-revealing tool; rate limits; no bulk resources. |
| **VPS ops** (single box, no PaaS) | Medium | Backups, monitoring, runbook, rollback (T7.2/T8.1). |
| **Conversion/renewal** (the loop does not convert) | Existential | The entire point of Phase 8; ship the thin connector first, measure before funding more. |

**Cost:** owner recurring = VPS + Stripe fees + domain. Corpus build = one-time (transcription already done ~$3-5; extraction is LLM cost on the builder's side, small). No per-user inference COGS by design.

## 8. Definition of live

1. A new user can: install the Skill, connect the MCP to Claude, authenticate, and reach `get_current_unit`.
2. Only a paying (or trialing) user passes the gate; cancellation freezes progress within one token lifetime.
3. The full loop runs end to end against a real Claude client with zero owner-side inference.
4. No tool can enumerate or bulk-read the corpus.
5. Reconstructed content cleared by clean-room review (and, before public launch, IP counsel).
6. **The one metric:** the practice loop is instrumented and shows conversion + renewal, at owner cost ≈ VPS-only. If it does not convert, stop and fix the loop before building more.
