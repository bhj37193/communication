# MCP-ENGINE-SPEC: the constraint engine (subject-agnostic, scalable from day one)

How Alpha School's teaching logic becomes **enforced structure** in the MCP server, so that every user who connects follows the same protocol, progress is saved one defined way, and adding subjects is a data operation, not an engineering one. This engine is subject-agnostic. `PEDAGOGY.md` is its first skill pack (public speaking); sales is the next. No em-dashes anywhere.

## 0. The core principle: enforce, do not suggest

The MCP server is a **state machine**. The only actions a user's client can take are the tools the current state permits. You cannot skip ahead because the tool that would return the next unit returns nothing until the current one is mastered. The structure is not a recommendation the user can ignore; it is the shape of the API. This is the difference between a curriculum document and a curriculum engine.

This is also Alpha's own conclusion. Their early failure mode was students "bouncing around," "topic shopping," and "skipping hard lessons." Their fix was curation that makes skipping impossible plus forced focus. We bake that fix into the protocol from day one.

## 1. Alpha's teaching logic, decoded (the parts we encode)

From their public material and independent analysis (sources at end):
1. **Two models per learner.** A **Knowledge Graph** (mastered vs missing concepts) and an **Interest Graph** (themes, hobbies, references) used to personalize. The tutor overlays both.
2. **Diagnostic first, then placement.** An adaptive diagnostic reveals what the learner already knows and places them by knowledge level, not by age or by their own choice.
3. **A router serves exactly one next thing.** Their platform ("Dash") routes each student "to exactly the lesson they need." The student does not browse; the system decides.
4. **Hard mastery gate.** "A kid doesn't move forward until they have full mastery." Repetitions are personalized (some need 5, some 15).
5. **ZPD + cognitive load.** Keep the learner at the challenge sweet spot; cap new concepts so working memory does not short-circuit.
6. **Forced spaced repetition.** Constantly re-quiz past material; route back to prerequisites when a gap appears.
7. **Anti-pattern guardrails.** Focus blocks and curation prevent bouncing and skipping.

Each of these maps to a hard constraint below.

## 2. The invariants (the systematic constraints)

These are enforced by construction. No client prompt, jailbreak, or user action can violate them, because the server, not the client, owns state transitions.

| # | Invariant | Enforced how | Alpha origin |
|---|---|---|---|
| INV-1 | **Gated entry.** Before placement, the ONLY available tool is `start_diagnostic`. No content is reachable. | Tool availability keyed to state `NEW/DIAGNOSING` | diagnostic-first |
| INV-2 | **Single open unit.** At any moment the user has exactly one active unit. There is no "list units" or "jump to unit X" tool. | Server routes; no browse tool exists | Dash router |
| INV-3 | **No skip.** Unit N+1 is unreachable until N is mastered. | `get_current_unit` returns only the routed unit | "no skipping hard lessons" |
| INV-4 | **Prerequisite lock.** A skill is unreachable until all its prerequisites are mastered. | gating checks the skill graph | gap-free progression |
| INV-5 | **Server-owned mastery.** Only the server advances state. The client's verdict is an input, never the authority. Personalized reps allowed (threshold, not fixed count). | mastery counter lives server-side | hard mastery gate |
| INV-6 | **Forced review.** Due spaced-repetition items are served before any new material. | router checks the review queue first | spaced repetition |
| INV-7 | **No bulk read.** No tool returns more than the current unit. The corpus is never enumerable. | contract has no list/dump tool | anti-exfiltration + curation |
| INV-8 | **Append-only history.** Every event is persisted immutably; state is a projection over events. | event-sourced store | daily-visible progress |
| INV-9 | **Focus shaping.** The server can cap units per session and enforce a cooldown, to block binge and topic-shopping. | session counter + timestamps | Pomodoro / anti-patterns |
| INV-10 | **Evidence-bound passes.** Every "pass" must carry a verbatim evidence span the server substring-checks against the submitted attempt. | server re-checks evidence with no inference | anti-cheat (see Section 5) |

## 3. The tool state machine (how "always follow the structure" is enforced)

Each user is always in exactly one state. Tools are enabled per state; calling a disabled tool returns a redirect to the only valid next action.

```
NEW           -> tools: [start_diagnostic]
DIAGNOSING    -> tools: [submit_diagnostic_answer]              (loops until placed)
ACTIVE        -> tools: [get_current_unit, submit_attempt, where_am_i]
REVIEW_DUE    -> tools: [get_current_unit(review), submit_attempt, where_am_i]
BLOCKED_COOLDOWN -> tools: [where_am_i]   (session cap hit; returns next-open time)
```

Transitions (server-owned):
```
NEW --start_diagnostic--> DIAGNOSING
DIAGNOSING --(placement computed)--> ACTIVE
ACTIVE --submit_attempt(pass, mastery met)--> ACTIVE (next unit) | REVIEW_DUE
ACTIVE --submit_attempt(pass, mastery not yet met)--> ACTIVE (same skill, later)
ACTIVE --submit_attempt(fail)--> ACTIVE (retry or prerequisite)
any --review interval elapsed--> REVIEW_DUE
ACTIVE --session cap hit--> BLOCKED_COOLDOWN --(cooldown elapsed)--> ACTIVE
```

The router `next_unit()` (already specified deterministically in `PEDAGOGY.md` Section 4) is the heart: reviews first, then finish in-progress, then next available skill in canonical order, chosen at the ZPD difficulty band.

## 4. Per-user state model and persistence (progress saved one defined way)

**Event-sourced.** The source of truth is an append-only event log. Current state is a deterministic projection (fold) over the log. This gives durability, auditability, replay, and analytics for free, and it scales.

Event types:
```
session_started, diagnostic_started, diagnostic_answered, placement_set,
unit_served, attempt_submitted, unit_passed, unit_failed, skill_mastered,
review_scheduled, review_passed, review_failed, currency_earned,
streak_updated, interest_added
```

Projections (rebuilt from the log, cached in Postgres):
- **Knowledge Graph:** per subject, per skill: `{ status, passes, last_pass_at, review_box, review_due_at }`.
- **Interest Graph:** `{ tags[] }` the user shared, passed to the client so it personalizes examples at $0 (the client, being the user's own Claude, does the personalizing).
- **Motivation:** `{ wallet, streak, session_count_today, last_active }`.

Because state is derived, you can add a new projection (a new metric, a new dashboard) later without migrating history. Nothing is ever lost.

## 4a. Data and retention (privacy is a feature, not overhead)

The one-line rule: **log behavior and progress, expire content, never persist audio.** Keep only what proves the business works and what the product needs to run. The content is unusually sensitive (personal everyday conversations, real sales calls), so minimal retention is both a legal safeguard and a market position: "your practice is private and auto-deletes" is a trust asset, especially for the everyday and sales modes.

| Data | Stored | Retention | User control |
|---|---|---|---|
| Progress / event log (attempts, passes, mastery, streaks) | yes, per-user, append-only | life of account | export + hard delete on account close |
| Product analytics (session_started, day-7/30 return, conversion), content-free | yes, event-level only | rolling / aggregated | standard opt-out |
| Scoring evidence (short quoted spans a verdict cites) | yes, minimal snippets | tied to the unit's mastery window, then pruned | deleted with the session |
| Full conversation transcripts | short-term only | auto-expire 30-90 days unless the user saves | one-tap delete; saved items kept until deleted |
| Raw audio | never persisted | ephemeral: transcribe in-flight, then discard | n/a |
| Operational / error logs | yes, PII- and content-scrubbed | short rolling window | n/a |

Hard rules:
- Audio is never written to disk. It is transcribed in-flight and dropped.
- No transcript content ever enters analytics or operational logs.
- Private by default. Deletion is one tap and is a real hard delete, not a soft flag.
- Analytics is non-negotiable even at prototype stage: without day-7 / day-30 retention and trial-to-paid, the validation experiment cannot run. Log the event, never the content.

### Incognito sessions (off-the-record practice)
A per-session toggle available inside any mode (sales, public speaking, everyday), not a separate mode. An incognito session is processed entirely in memory and retained nowhere:
- The transcript is never written to disk and is discarded the moment the call ends.
- The result is shown once and is not saved to history.
- **No event is appended to the progress log**, so the session earns no mastery, no streak, and no spaced-review credit, and never appears in the user's history.
- Nothing content-related enters analytics.

Trade-off the user accepts: no progress and no record, in exchange for zero footprint. Because it is off-the-record and un-tracked, incognito is the home for **rehearsing a specific real conversation** (a live deal, a hard personal talk): let it free-practice any scenario the user describes, rather than serving the gated next drill. This is the highest-trust use case and the most sensitive content, so the promise has to be technically real.

Two integrity rules:
1. **"Retained nowhere on our side" is not "no computer saw it."** The STT and LLM still process the audio transiently to produce the result. Be honest about that and configure zero-retention with Deepgram and Anthropic. Do not claim nobody ever saw it.
2. **Rate-limit without storing.** Keep a transient, content-free, daily-reset counter tied to the account so incognito cannot be used to run unlimited sessions and blow past the cost cap. You can enforce the cap without storing any content.

## 5. The open-chatbot tension, and why skills survive it

Alpha removes chatbot access to stop cheating. We cannot, because the customer's own Claude IS the tutor and the delivery surface. We compensate structurally, and the domain saves us:

1. **We teach skills and performance, not recall.** A pass artifact is a transcript of a thing the user actually did (a real or roleplayed sales call). You cannot "look up" having run a good discovery call. The evidence is the performance, not an answer a chatbot can supply.
2. **Server owns advancement (INV-5) and re-derives every deterministic check.** The client cannot fabricate mastery: the server recomputes booleans from values and thresholds, recomputes the pass rule, counts passes across distinct sessions, and substring-checks every evidence span (INV-10). A fabricated pass with no real quoted evidence is rejected without any server inference.
3. **Rubric signals target observable behaviors in the artifact,** not knowledge (talk-to-listen ratio, was cost-of-inaction surfaced, discovery-question rate), so the client is scoring what happened, not what is known.
4. **Coach, not certifier.** Residual gaming is tolerated. For sales specifically, the ultimate verifier is the user's real close rate, which makes honest practice self-interested.

This is the honest reason our model works where a knowledge-recall product would leak: skills are proven by doing.

## 6. Scalable from day one (content is data, engine is code)

The engine (invariants, state machine, router, mastery, persistence, scoring contract) is fixed code. A **subject is a data pack.** Adding sales, then public speaking, then negotiation, then interviewing is dropping in a file, with zero engine changes.

**Skill-pack format (the only thing that changes per subject):**
```
SkillPack {
  subject_id: string                 // "sales"
  version: string                    // content versioning, mapped by stable skill_id
  skills: [ { id, name, objective, prerequisites[] } ]     // the graph
  units:  [ Unit ]                    // conforming to PEDAGOGY.md unit schema
  signals:[ Signal ]                  // subject-specific rubric signals
  diagnostic: [ DiagnosticItem ]      // placement probe
}
```

Scaling properties, all true from the first deploy:
- **New subject = new pack.** Same schema, same engine, same tools. Public speaking and sales are two files behind one server.
- **Stateless request handling + Postgres.** The server holds no per-user memory between calls, so you run N instances behind a load balancer. Horizontal scale is trivial.
- **$0 marginal inference.** Scale cost is DB rows and a cheap box, not GPU. A single small VPS serves many users; you scale the box before you scale the bill.
- **Uniform contract.** The tool surface (`start_diagnostic`, `get_current_unit`, `submit_attempt`, `where_am_i`, `get_review_queue`) never changes as subjects are added. The client integration written once works for every subject.
- **Versioned content.** Update a pack without breaking user state by keying progress to stable `skill_id`s, not to content order.

The result is exactly the goal: **you create the MCP server once, and expansion is adding packs.** From day one the architecture does not need to change to scale in users or in subjects.

## 7. What this still cannot replicate (kept honest)

The human guide and the captive environment are not reproducible in software. The waste meter needs eyes we do not have. Retention remains the real risk, which is why sales is the beachhead: real-dollar ROI is the accountability an MCP cannot otherwise provide.

## 8. Next steps

1. Quarantine the Matt Ryder transcripts (private input only), same as Vinh.
2. Author the **sales skill pack** against this engine and the `PEDAGOGY.md` schema: the sales skill graph, sales rubric signals (performance-observable), and the sales diagnostic. Sourced from the operator's own sales expertise plus the public sales canon; Matt course as gap-check only.
3. Add `start_diagnostic` / `submit_diagnostic_answer`, the two-graph state model, and INV-9 focus shaping to `MCP-CONTRACT.md` when Phase 3 begins.

## Sources
- https://alpha.school and https://alpha.school/the-program/
- https://alpha.school/blog/learning-at-the-speed-of-thought-how-ai-tutors-make-every-lesson-personal/
- https://alpha.school/blog/how-ai-and-gamification-transform-learning-at-alpha-school/
- https://www.cognitiverevolution.ai/2-sigma-in-2-hours-how-alpha-schools-are-using-ai-to-revolutionize-education/
