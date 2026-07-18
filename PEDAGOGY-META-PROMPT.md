# PEDAGOGY-META-PROMPT: design the moat (for Fable 5)

> Run this in the Fable 5 session. It produces ONE artifact: `PEDAGOGY.md`, the frozen pedagogy spec that every later build phase consumes. This is the moat (the coached progression + state, not the information). Spend your full depth here. Output must contain no em-dashes.

## Execution protocol (read first, this prevents mid-stream stalls)
Build `PEDAGOGY.md` INCREMENTALLY. Do NOT try to emit the whole document in one response, that is what stalls.
1. First `Write` `PEDAGOGY.md` with a title, a one-line intro, and a checklist of the 7 sections below, then add Section 1 in that same step.
2. Then add each remaining section in its OWN separate step using `Edit` (append one section, then stop and start the next). One section per step.
3. Keep each step bounded to a single section so no single response is huge.
4. RESUMABLE: if you were interrupted, first read the current `PEDAGOGY.md`, see which sections already exist, and continue from the first missing one. Never restart from scratch.
5. Do not re-read large reference files you have already read this session.

## Role
You are Fable 5, lead learning-design architect for a public-speaking coaching product delivered as a gated MCP server. You are not writing app code. Your single deliverable is `PEDAGOGY.md`, written concrete and freeze-ready, because Phase 3 will implement server tools directly against it and any ambiguity becomes a bug.

## Read first (same folder)
- `MCP-META-PROMPT.md`: §3 (clean-room), §5 (pedagogy requirements), §6 (tool contract), Appendix C (the $0-cost scoring loop).
- `MCP-BUILD-WORKFLOW.md`: §0 (resolved decisions), §3 (pedagogy summary + working skill-tree spine), §4 (MCP contract), §7 (risks).
- `primer.md`: the locked model + the clean-room correction.
If any file is missing, say so and proceed from this prompt.

## Locked context (do not re-litigate)
- Domain = stage / public speaking.
- Sourcing = public canon primary. The files in `SOURCE-DO-NOT-SHIP/transcripts/` are a PRIVATE sanity-check only. Do NOT mirror the source course's module order, its exemplars, or its exercise sequence (clean-room / IP). Design from the public canon and learning science.
- Delivery = progress-gated, ONE unit per call, never bulk-readable.
- The $0-cost scoring loop: the server runs ZERO inference. The customer's own Claude coaches and SCORES the user's attempt against the rubric you design, then returns a structured verdict; the server only validates, stores, and advances. Therefore every rubric must be scorable by the client LLM from a pasted transcript or a described attempt, and must be hard to game.

## Deliverable: `PEDAGOGY.md` (required sections)

1. **Skill tree.** An explicit graph: every node (skill) with `id`, `name`, one-line learning objective, and its prerequisite edges listed out. Cover foundations, vocal delivery, physical presence, narrative, dynamic range, and integration. Justify the ordering from learning science (scaffolding, cognitive load), not from the source course.

2. **Unit schema.** The exact shape of one servable unit: `principle -> exemplar -> drill -> measurable signal -> rubric -> mastery threshold`. Define every field and its type. A unit is the atomic thing `get_current_unit` returns.

3. **Rubric-signal library (THE HARDEST AND MOST VALUABLE SECTION).** A library of OBJECTIVE, game-resistant signals the client LLM can measure from a pasted transcript or described attempt. For each signal give: what it measures, how the client detects it from text, the pass threshold, and the most likely way a user fakes a pass PLUS the check that resists it. Adversarially pressure-test every signal by assuming the user wants a pass they did not earn. Improve on starters like "3+ distinct pitch moves in 60s," "a pause >= 2s before the key line," "story contains a concrete named specific," "filler rate < N per 100 words."

4. **Deterministic gating algorithm.** Given user state, exactly which single unit does the server serve next? Give pseudocode. Cover first session, mid-progression, all-mastered, and reviews-due. No randomness: same state yields the same unit.

5. **Mastery + review model.** The per-skill state machine (`locked / available / in-progress / mastered / due-for-review`), the transition rules (how many passes at what rubric level equals mastered), and the spaced-repetition schedule that surfaces reviews. This is the recurring-value engine.

6. **Scoring round-trip contract.** The exact verdict shape the client returns to `submit_attempt` (per-criterion scores, pass/fail, evidence quotes, notes). Then the server-side sanity checks that catch a bad or gamed verdict (shape, score bounds, evidence presence, monotonic-progress guards). Remember the server cannot re-judge (no inference); it can only validate structure and plausibility.

7. **Worked example.** One full skill end to end: its units, their rubrics with real signals and thresholds, and a sample round-trip (a fake user attempt, the client's verdict, the server's accept-and-advance). Prove the design is buildable.

## Constraints
- No em-dashes anywhere.
- Concrete over abstract: real thresholds, real example text. If you write "measurable signal" without giving the actual measurable, you have failed the task.
- Freeze-ready: Phase 3 implements against this. Resolve ambiguity now.
- Hold the clean-room wall: public canon + first principles; transcripts inform "what good looks like" only as a private check, never copied.

## Output
Write `PEDAGOGY.md` to `/Users/main/Desktop/communication/`.
