# ALPHA-MODEL-ANALYSIS: Alpha's engine, applied to communication only

Scope note: the product stays focused on **communication**. We are NOT building a K-8 school. Alpha School is studied only for its *mechanics*, which we borrow and apply to communication sub-domains (subjects): **public speaking** and **sales** first, others later (interpersonal, negotiation, interviewing, executive presence). No em-dashes anywhere.

## 1. What Alpha actually is (transferable mechanics only)

Strip the marketing and Alpha is five layers:
1. **Mastery gate.** Must hit ~90% before advancing. No knowledge gaps.
2. **Gap-free progression** on a prerequisite graph, with **diagnostic placement** by knowledge-level (decoupled from age).
3. **ZPD difficulty tuning.** The adaptive engine targets ~80-85% success, the sweet spot of challenge.
4. **Motivation engineering.** Currency ("Alpha Bucks"), Apple-Watch-style progress rings that close at 90% accuracy, a computer-vision "waste meter," and the core lever: **time is the ultimate currency** (finish fast, earn free time).
5. **Human guides** for emotional/motivational support, not instruction.

Honest read: the pedagogy is Bloom (1968); adaptive delivery apps predate Alpha by a decade. Alpha's real additions are motivation engineering + a captive environment + selection. The AI-tutor-alone is the least novel and least independently verified part. Their results come mostly from the layers a piece of software cannot supply.

## 2. The key insight: one engine, many communication subjects

`PEDAGOGY.md` is not a public-speaking document that happens to work. It is a **generic mastery-learning engine** we filled with one subject. Each communication subject is a **skill pack** (skill graph + units + rubric signals) plugged into the same engine.

| Alpha mechanic | Our engine (already built) |
|---|---|
| 90% mastery gate | unit `mastery` + `pass_rule` |
| Gap-free progression | prerequisite skill tree + deterministic gating |
| Adaptive tutor ("Incept") | the $0-cost scoring loop (customer's own Claude is the tutor) |
| Progress tracking (MAP) | mastery/attempt records |
| Streaks / time-back | motivation layer (sketched) |
| **Diagnostic placement** | **NEW, add to engine** |
| **ZPD difficulty tuning** | **NEW, add to engine** |
| Human guides, waste meter | **cannot recreate via MCP** |

So recreating Alpha's *engine* for communication is not a new build. It is: keep the core, add two mechanisms, add the full motivation layer, and author a second skill pack (sales).

## 3. Engine additions needed to match Alpha

1. **Diagnostic placement.** A short adaptive probe per subject that finds the learner's frontier so a skilled salesperson is not forced through beginner units. Tools: `start_diagnostic(subject)`, `submit_diagnostic`. Places the user at the right node in the skill graph.
2. **Difficulty tuning (ZPD).** Serve the next unit targeting ~80-85% predicted success; step difficulty up or down based on recent pass margins. Deterministic, server-side.
3. **Full motivation layer (this is the retention engine, the existential risk).** Currency earned on clean passes, streaks, a progress-ring equivalent surfaced by `where_am_i`, and "effort/time back" framing. Stored server-side at $0.

## 4. The two V1 subjects (skill packs on one engine)

- **Public speaking.** `PEDAGOGY.md` already drafted (skill tree, unit schema, 15 rubric signals, gating, scoring loop).
- **Sales.** A new skill pack. Natural skill graph from the public canon plus the operator's own experience: prospecting and connecting, discovery / the real why, problem framing, cost of inaction, solution presentation, objection handling (money, logistical, partner, fear), gaining commitment / closing, follow-up and referrals.

Why sales fits the model even better than public speaking:
- **A sales-call transcript is naturally text-scorable.** The paste-transcript $0-cost loop fits perfectly. Measurable signals: discovery-question rate, talk-to-listen ratio, whether cost-of-inaction was surfaced, whether the "real why" was reached, objection-handling structure, premature-pitch detection.
- **Clear ROI (closed deals)** is a built-in motivation and retention hook that generic self-improvement lacks. Sales is the domain where "time/effort as currency" maps onto real money.

## 5. Sourcing and clean-room (both subjects)

- **Public speaking:** public canon + operator knowledge. Vinh Giang transcripts quarantined in `SOURCE-DO-NOT-SHIP/`, private input only.
- **Sales:** operator's own sales expertise (the operator did sales) + the public sales canon (SPIN, Sandler, Challenger, Straight Line, etc.). The **Matt Ryder "F The GuRUs" course** transcripts (`~/MEGA downloads/Matt Ryder F The GuRUs 2026 April/`) are copyrighted paid material and get the **same treatment**: quarantine, private gap-check only, never the spine, never shipped. Both courses run through `EXTRACTION-META-PROMPT.md` maximum-safety mode.

## 6. What an MCP cannot recreate (honest limits)

- **Human guides, captive attention, the waste meter** (no eyes, no presence, no one making the user show up).
- **Retention** is the same existential risk, amplified for self-directed adults. Sales partly mitigates it (real-dollar ROI is its own accountability), which is another reason to lead with sales.
- **Content volume** for a full multi-subject platform is large, but scoped to two communication subjects it is tractable, especially with the operator's own sales expertise.

## 7. Competitive note

Alpha just launched **Alpha Anywhere** (at-home version, May 2026). That competes on the *school* angle. Staying in **communication and sales for working adults** sidesteps direct competition with Alpha entirely and plays to the operator's own edge.

## 8. Recommendation and next steps

**Lead with sales, not public speaking, as the V1 beachhead:**
- The operator's own expertise gives the fastest clean content and real credibility.
- Sales has clear ROI, so users pay and stay (retention), and salespeople are a reachable, paying audience (better distribution than diffuse "want to speak better").
- Sales-call transcripts are the most naturally scorable input for the $0-cost loop.
- Public speaking becomes subject #2 on the same engine.

Next steps:
1. Confirm beachhead (recommend sales).
2. Quarantine the Matt Ryder transcripts (copy into `SOURCE-DO-NOT-SHIP/` or leave in place, but mark as private input) before any extraction.
3. Draft the sales skill pack against the `PEDAGOGY.md` engine (a `SALES-PEDAGOGY` section or parallel file).
4. Add diagnostic placement, difficulty tuning, and the motivation layer to the engine spec.
