# DECISION BRIEF: which go-to-market for Cadence

Instruction to the reader (Fable): You are an experienced, skeptical startup advisor.
This is a self-contained brief. You have no prior context, and none is needed. Reason
independently from first principles. Do NOT assume any prior recommendation exists; one
was deliberately withheld so you are not anchored. At the end, make a CLEAR decision (not
"it depends"), justify it, state the strongest argument against your own choice, and name
the cheap test that would confirm or kill it. No em-dashes in your answer (owner rule).

---

## 1. The product

Cadence is a voice-first communication-coaching concept. Core loop: tap one button, get
into a live spoken roleplay with an AI partner, hang up, receive a short result (one
strength, one fix, a progress indicator). Three modes on one shared engine: SALES (AI =
resistant prospect), PUBLIC SPEAKING (AI = audience/host), EVERYDAY (AI = a new
acquaintance who warms up only if you reciprocate).

Two proprietary assets already exist and are reusable across every option below:
- A mastery-learning "constraint engine": diagnostic placement, prerequisite skill tree,
  serves exactly one drill at a time, mastery gate before advancing, spaced review,
  per-user event-sourced state.
- A deterministic scoring validator: the LLM plays the partner and proposes a score with
  evidence quotes; a backend recomputes countable signals (talk ratio, open-question
  count, monologue length, etc.), substring-verifies the quotes, and owns the pass/fail.
  The model can flatter but cannot mint an unearned pass.
- A clean-room-authored pedagogy corpus for all three modes (skill trees + rubric
  signals), sourced from public canon, IP-audited as clean on copyright.

Design and a full build spec are DONE. Nothing is built. Nothing is validated.

## 2. The strategic options to decide between

**Option A: Consumer battle game.** A freemium mobile game. Two players get the same
scenario, each has their own private ~5-minute call with the AI, the validator scores
both, higher score wins ("versus" is on the scoreboard, no human-to-human contact, so no
moderation/safety problem). Single-player training (vs AI) plus a ranked battle arena.
One free battle to hook, then a subscription. Growth is meant to come from shareable
head-to-head result cards (viral, near-zero-cash acquisition). Retention via competition
and ranked ladder.
- Case for: it is the only option with a built-in distribution engine (shareable by
  construction); a free battle costs ~$0.15, so acquisition is cheap; it keeps the
  scoring engine intact; competition is a stronger consumer retention hook than solo
  progress.
- Case against: whether a conversation SCORE-race reveal is as viscerally shareable as,
  say, a face-off is unproven; it is a bigger, different build; virality is not a skill
  the founder has (see profile); consumer willingness-to-pay for conversation "practice"
  (vs "do it for me") is unproven, especially in the everyday/dating niche.

**Option B: B2B / SMB sales-team coaching.** The same engine sold to sales teams as
seats (~$49-99/seat/month). Managers assign reps AI roleplay practice against resistant
prospects, with scored progress.
- Case for: this is where proven demand and money already sit (see competitors);
  strongest unit economics (~$44 contribution/seat); lower churn than consumer; fits the
  founder's actual strength (selling via outbound); clear ROI story (faster rep ramp =
  revenue).
- Case against: crowded and funded (Hyperbound, Second Nature, Yoodli enterprise);
  longer sales cycles; less differentiated; less exciting to the founder; enterprise
  procurement and integration expectations.

**Option C: Consumer individual coaching.** The original vision: rigorous curriculum sold
to individuals at $15/month, no game layer.
- Case for: cleanest expression of the pedagogy moat; simplest build (spec is done).
- Case against: enforced-mastery rigor is a weak fit for consumer dopamine; consumer
  self-improvement retention is historically brutal; no built-in distribution and $15
  cannot fund paid acquisition, so growth is a slow organic grind.

**Also decide the structure question:** one focused product, two products in parallel,
or one product that tries to serve both consumer and B2B. (The engine is shared across
all options; the question is whether shared infrastructure justifies running more than
one go-to-market at once.)

## 3. Founder profile and hard constraints

- Solo founder, AI-assisted, roughly full-time capacity.
- Core edge: sales ability (comfortable with outbound and direct selling). Not a proven
  consumer-virality or content operator.
- On an F-1 visa: operating a revenue business requires CPT/OPT work authorization.
  Until cleared by immigration counsel, any test must run in intent-capture mode (measure
  willingness to pay without operating a revenue business).
- Pre-revenue, pre-validation. Limited cash (validation budget is a few hundred dollars,
  not a paid-acquisition war chest).

## 4. Economics (already modeled)

Consumer plan (locked): $15/month, weekly cap of 40 voice-minutes, ~5-minute drills.
- AI cost ~$0.036/voice-minute (self-hosted voice loop at scale, 90% prompt-cache).
- Per-user monthly profit: ~$8.22 realistic user, ~$6.66 worst-case heavy user; ~58%
  margin. No user loses money.
- Steady-state scenarios (subscriber count is the only real variable; margin is stable
  ~55-61%): BEAR 4,000 subs ~ $31k/mo profit; REALISTIC 32,000 subs ~ $264k/mo; BULL
  300,000 subs ~ $2.6M/mo (pre-headcount).
- Free-battle acquisition: ~$0.15 per trial; break-even conversion is under 1% against an
  LTV of ~$55-60. At $15, paid ads are almost certainly unprofitable (consumer CAC
  typically $40-80+), so consumer growth must be organic/viral.

B2B alternative: ~$49-99/seat, similar ~$5 AI cost, so ~$44 contribution/seat, roughly
5-9x the consumer per-user contribution, with lower churn. 4,000 seats at $49 ~ $170k/mo
vs ~$31k/mo for 4,000 consumer subs.

## 5. Competitive landscape (current)

- Yoodli: $40M+ raised, Toastmasters distribution. Consumer tiers $8-20/mo (mostly async
  analysis), plus custom enterprise.
- Hyperbound: ~$15k/yr enterprise, hit $1M ARR fast, $18M raised. Live sales roleplay.
- Second Nature: ~$30-40/seat, $38M raised. Enterprise sales roleplay.
- Orai / Poised: consumer public-speaking, $12-19/mo, largely async.
- Pattern: the proven money in live AI roleplay is B2B/enterprise-priced. Consumer-priced
  players mostly do cheaper async analysis, not the live two-way loop Cadence is built on.
- Everyday/connection consumer lane: fragmented, mostly reply-generators; practice-sim is
  thin and its willingness-to-pay is least proven, but it is the most viral/least
  contested lane for attention.

## 6. Key risks (consensus from prior analysis)

- The #1 risk across all options is DISTRIBUTION plus RETENTION, not technology and not
  pedagogy. The voice tech and the engine are considered buildable.
- Consumer self-improvement apps have a notoriously bad daily-habit retention profile.
- Battle's entire consumer thesis rests on one unproven thing: does the head-to-head
  reveal make people share and come back.
- B2B has proven demand and founder-fit but is crowded and slower to sell.

## 7. What is already decided vs still open

Decided: the tech stack, the engine design, the pricing/cap ($15, 40 min/week), the
clean-room pedagogy corpus (IP-clean on copyright).
Open gates (independent of this decision): (1) F-1 work authorization before any revenue;
(2) a cheap validation test before building; (3) real IP-counsel sign-off, including a
check that the source courses' terms of service do not prohibit a competing product.

## 8. The decision I need from you

1. Which primary go-to-market should the founder commit to FIRST: A (consumer battle),
   B (B2B sales coaching), or C (consumer coaching)?
2. One focused product, two in parallel, or one combined consumer+B2B product? Justify.
3. Given the shared engine, is there a smart SEQUENCE (test one cheaply, fall back to
   another) or should the founder commit outright?
4. What is the cheapest validation test to run first, and what pass/fail thresholds
   should be set in advance?

## 9. How to answer

Give: (a) a clear decision for each of the four questions; (b) your reasoning; (c) the
single strongest argument AGAINST your own recommendation; (d) the specific evidence that
would flip your decision; (e) the concrete validation test and its numeric thresholds.
Weigh founder-fit and the F-1/cash constraints as first-class factors, not footnotes. Be
willing to disagree with what the founder seems to want. Decide.
