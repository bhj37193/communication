# FABLE PROMPT: Financial model V2 (paid-only, money-back guarantee, fresh eyes)

Paste this whole file into ONE fresh Fable session. It is deliberately
self-contained: every fact you need is inlined below. This is a clean-room second
opinion, so the fresh perspective is the point. Write the full document to
/Users/main/Desktop/Active Projects/communication/FINANCIAL-MODEL-20YR-V2.md
Do NOT modify FINANCIAL-MODEL-20YR.md (v1 stays as the free-tier counterfactual).
Make every decision yourself. Do not ask questions. No em-dashes anywhere.

## 0. Forbidden inputs (this is a clean-room run)

Do NOT read FINANCIAL-MODEL-20YR.md, BUSINESS-MODEL-CONVERSION.md,
AVATAR-TIER-PRICING.md, POSITIONING.md, or PRD-CHARISMA-CHAT.md. Those documents
carry a freemium business model (free text tier, free avatar trial) that the
founder has explicitly rejected for this version, and reading them would anchor
you. Everything true and still-relevant from them is restated below as raw facts.
If you catch yourself wanting a number from those files, it is either already
inlined here or it is yours to decide fresh.

## 1. What the product is (inlined, sufficient, do not re-research)

An app-only, adult skills-training product: 4 trained skills (working names:
Communication, Problem-Solving, Critical Thinking, Decision-Making), mastery-gated
progression modeled loosely on Alpha School's 2-hour adaptive-mastery model, but
for adults, no physical school, no teachers. Two interaction surfaces:

- Text chat challenges: 3-5 minute daily sessions with an AI character; a
  deterministic, LLM-free validator scores the transcript (string analysis, zero
  LLM judgment in the score path). The LLM only plays the character and drafts
  feedback prose; it never scores and can never advance user state.
- Live avatar sessions: lip-synced talking avatar, push-to-talk voice practice.

The scoring engine is the moat. The LLM is a commodity, swappable component behind
a provider interface: treat it as a text generator you rent or host, not as the
product's intelligence. Any model that can roleplay a persona and emit strict JSON
is adequate; quality is verified by an eval harness, not by model brand.

## 2. Business model constraints (locked by the founder, non-negotiable)

- PAID ONLY. There is no free tier, no freemium funnel, no free trial. Every user
  pays before their first session.
- The risk reversal is a 30-day money-back guarantee: full refund, no questions,
  within 30 days of first purchase, once per person (identity-verified account +
  payment fingerprint, so it cannot be farmed).
- The founder's thesis, model it honestly rather than flattering it: paying up
  front makes people commit to the learning, and the money-back guarantee bounds
  the acquisition risk, because the worst case per bad-fit customer is a known,
  fixed refund cost instead of an unbounded free-rider subsidy.
- The business must work LONG TERM: 20-year horizon, durable margins, costs that
  trend fixed rather than per-use where possible.
- Infrastructure posture: one VPS (Hetzner CPX31-class, $30-60/month, scales in
  steps of the same order) for app/API/DB, plus model serving per Section 3. No
  managed-cloud sprawl.
- Payment rail: Paddle-class merchant of record, ~5% + $0.50 per transaction.
  Assume processing fees are NOT recovered when you refund.

Pricing is YOUR decision: pick monthly and annual price points and defend them.
Note the constraint that paid-only products must carry their own acquisition cost
in the price, and that a money-back guarantee supports a higher price than a
freemium tier would. State comparables from your own knowledge (subscription
learning/self-improvement apps) with the caveat they are from memory, not fresh
research. Consider whether a single all-4-skills price beats per-skill pricing,
decide, and justify in two sentences.

## 3. Raw cost primitives (2026 figures, confirm live rates before launch)

Per-use (API / managed-vendor path):
- Text challenge, Haiku-class API with prompt caching: $0.012-0.020 per 3-5 min
  challenge. Use $0.02 for safety.
- Avatar minute, managed vendors, all-in: ~$0.03/min ($0.009 render + $0.010 TTS
  + $0.002 STT + $0.003 LLM). Per-minute cost means any uncapped avatar offer has
  unbounded COGS, so if you include avatar time, cap the minutes per month and
  price the cap.

Fixed (self-hosted open-weights path), the founder specifically wants this
evaluated:
- GPU rental: RTX 4090-class (24 GB) $0.35-0.70/hr, so $250-500/month running
  24/7. A100 80GB $1.50-2.50/hr. H100 $2.50-4.00/hr.
- One 24 GB GPU running vLLM serves a 7-8B open-weights model (Llama/Qwen class)
  at high concurrency: comfortably thousands of short chat turns per hour. That
  replaces the ENTIRE per-challenge text LLM cost with one fixed monthly number.
- Fine-tuning (LoRA/QLoRA) a 7-8B model on a few thousand curated persona/feedback
  examples: single-GPU job, hours, $20-150 per run; a full experimentation program
  is $1,000-2,000 one-time capex. A 70B LoRA run is $300-1,500 if 8B quality is
  insufficient. Training a model from scratch costs millions and is pointless
  here; never model it.
- Self-hosted voice on the same or one extra GPU: Parakeet-class STT and
  Kokoro-class TTS reduce the $0.012/min voice portion toward zero. Avatar RENDER
  (~$0.009/min) has no cheap self-host path today; keep it managed per-minute and
  capped.
- The self-host quality gate: an eval set of ~200 fixture transcripts replayed
  through the candidate model, requiring warmth-trajectory and JSON-validity
  agreement within 5% of the API baseline. Model the eval work as founder time,
  not a dollar line.

Required analysis in your output: a named crossover point. At what paying-user
count does fixed-cost self-hosting (GPU rent + the one-time fine-tune capex,
amortized over 24 months) beat per-use API pricing? Below the crossover use API,
above it switch; build the switch into the COGS lines of your 20-year table at
the year each scenario crosses it, and show the arithmetic.

## 4. The one rule that matters

Every number in every year in every case (bear / conservative / realistic) must
trace back to a named assumption variable through shown arithmetic. If a number
cannot be traced to an assumption line, delete it and derive it properly.

## 5. Assumption block (write FIRST, explicit table, before any output table)

Declare, per scenario, named values for at least: TAM (stated estimation method,
not a bare guess), monthly site/store visitors reachable by an organic-first
launch and their YoY growth, visitor-to-purchase conversion (this replaces
trial conversion; paid-only with a money-back guarantee converts cold traffic at
well under 1% to low single digits, be honest per scenario), REFUND_RATE (share
of buyers who invoke the 30-day guarantee; this is the load-bearing number of
this whole model, make the three scenarios genuinely differ on it), monthly
churn of retained (post-guarantee) subscribers, plan mix monthly vs annual, net
ARPU after Paddle fees, COST_PER_REFUND (derived, shown: lost processing fees +
up to 30 days of served COGS + support minutes), CAC by channel, COGS per
subscriber per month on BOTH the API path and the self-hosted path with the
crossover year marked, fixed opex (VPS steps, GPU rent when active, founder pay
floor, variable opex as % of revenue), one-time fine-tune capex, and an
effective tax rate (state it, mark "confirm with a tax professional," use it
consistently). The three scenarios must differ structurally (different refund
rates, conversion, churn), not by one multiplier.

## 6. Output tables

Three cases, per year: total subscribers, new purchases, refunds, retained
paying users, price(s) in effect, monthly revenue, monthly COGS, monthly gross
margin $ and %, monthly opex, monthly EBIT, monthly after-tax profit, plus
yearly rollups of each. Full annual detail years 1-5; milestone rows only for
years 10, 15, 20, with a one-line note above them that past year 5 these are
directional illustrations of compounding assumptions, not forecasts. Show the
full arithmetic chain for year 3 as a worked example beneath the table:
visitors -> purchases -> refunds -> retained payers -> revenue -> COGS -> gross
margin -> opex -> EBIT -> tax -> after-tax, every intermediate labeled by its
assumption.

## 7. Sanity checks (short section, do not skip)

- Is the realistic year-1 purchase count achievable for an unfunded app with no
  free tier, where every first dollar requires trusting a paywall? If not,
  revise the assumption, not the arithmetic.
- Refund-rate stress line: state at what REFUND_RATE the realistic case stops
  covering its own acquisition cost, and how far that is from your assumed rate.
- Does the self-host crossover actually save money after fine-tune capex and
  GPU rent, or is the API cheaper for longer than intuition suggests? State the
  break-even user count plainly.
- One line: the single assumption this model is most sensitive to.
- One honest paragraph: what the paid-only model gives up versus a freemium
  funnel (top-of-funnel volume, word-of-mouth surface, shareable-artifact reach)
  and what it gains (commitment, revenue per user from day one, bounded
  acquisition loss, no free-rider COGS). No cheerleading; state both sides so
  the founder is choosing with open eyes.

Write the full document to
/Users/main/Desktop/Active Projects/communication/FINANCIAL-MODEL-20YR-V2.md
