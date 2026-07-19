# FABLE PROMPT: Empire (4-skill pivot)

This file has THREE independent sections. Each is self-contained on purpose: paste
each into its own separate Fable session and run all three in parallel. They do not
depend on each other's output and do not share memory across sessions, so each
repeats the shared context it needs. Each section writes its OWN output file. No
em-dashes in any output, in any section.

Shared context (repeated in each section below, do not skip re-reading it per
section): the product today is a text-chat communication trainer (PRD-CHARISMA-
CHAT.md) with a deterministic, LLM-free scoring engine (packages/core/schemas.ts,
validator.ts, score.ts) and a mastery-gated, event-sourced unit structure
(content-library/, modeled loosely on Alpha School's 2-hour mastery-gated adaptive
learning, but adapted for adults, app-only, no physical school, no teachers). The
pivot: expand from ONE trained skill (communication) to FOUR, on the SAME app and
the SAME engine. The candidate 4 skills, not yet locked, are: Communication,
Problem-Solving, Cognitive [training], Decision-Making. This naming is a working
assumption, not a confirmed taxonomy; treat it as a starting point you may sharpen,
but flag your sharpened version clearly rather than silently substituting different
names.

---

## PART 1 -> paste into Fable session 1, writes FINANCIAL-MODEL-20YR.md

Instruction to the reader (Fable 5): You are building a financial model for a
4-skill, app-only, adult skills-training product (an "Alpha School for adults,"
mastery-gated, no physical location, no teachers, subscription SaaS). Read
PRD-CHARISMA-CHAT.md, AVATAR-TIER-PRICING.md, and BUSINESS-MODEL-CONVERSION.md as
locked input for real unit economics already decided for the communication-only
product; you are extending that model to 4 skills, not inventing pricing from
scratch. Make every decision yourself. Do not ask questions. No em-dashes.

### 0. The one rule that matters here

An LLM asked for a 20-year financial table will default to typing plausible-looking
numbers with no derivation. That is worthless and you must not do it. Every number
in every year in every case (bear/conservative/realistic) must be traceable back to
a named assumption variable through shown arithmetic. If a number in your output
cannot be traced to an assumption line, delete it and derive it properly instead.

### 1. Known anchors, do not re-derive these, inherit them

From AVATAR-TIER-PRICING.md (locked, already-decided pricing/cost for the existing
communication product, the base you are extending):
- Text-chat core: free, unlimited, fixed-cost (Haiku LLM calls, ~$0.02-0.03 per
  challenge/session).
- Avatar tier: $14.99/month, capped 120 avatar-minutes/month, ~$0.03/min all-in
  COGS (render + TTS + STT + LLM), ~76% gross margin at the cap. Annual $119/year.
- 15-minute free trial, ~$0.45 COGS per trial user, assume 10-15% trial-to-paid
  conversion unless BUSINESS-MODEL-CONVERSION.md gives you a sharper number, in
  which case use that instead and cite it.
- Paddle-class payment processing fees ~5% + $0.50/transaction, ~4% refund reserve.

Read BUSINESS-MODEL-CONVERSION.md for any additional locked numbers (churn,
existing user base if any, prior projections) and inherit those too rather than
re-deriving. If it conflicts with the AVATAR-TIER-PRICING numbers above, the more
recent/specific document wins; say which you used and why in one line.

### 2. Assumption block (write this FIRST, as an explicit table, before any output
table)

Declare, per scenario (bear / conservative / realistic), a named value for each of:
TAM (total addressable adults for a 4-skill self-improvement app, derive from a
named source or a stated estimation method, not a bare guess), initial addressable
share reachable by launch channel, monthly organic + paid signup rate and its
year-over-year growth curve, free-to-paid conversion rate (anchor to the 10-15%
avatar-trial number above; a 4-skill product may convert differently, justify any
deviation), monthly logo/subscriber churn, blended ARPU (weighted across the free
text tier revenue-share-none reality and the $14.99-$119 avatar tier, adjusted if
you introduce per-skill or bundle pricing, your call, justify it), CAC by channel,
COGS/user/month (LLM + avatar costs scaled to 4 skills' worth of usage, not just 1,
show the scaling assumption), fixed opex (team size by year, infra, and how opex
headcount scales with user count), and an effective tax rate (state a rate, mark it
"confirm with a tax professional," and still use it consistently in the after-tax
line).

These three assumption sets must actually differ from each other (different TAM
capture, different churn, different conversion), not just be the same table with a
smaller/bigger multiplier slapped on at the end.

### 3. The output table

One table (or three, one per case, your call on layout, but all three cases must be
present) covering, per year: total users, paying users, monthly price(s) in effect,
monthly revenue, monthly COGS, monthly gross margin $, monthly gross margin %,
monthly opex, monthly EBIT, monthly after-tax profit, then the yearly rollups of
each of those. Do this in full annual detail for years 1 through 5. For years 10,
15, and 20, give milestone rows only (not month-by-month), and add an explicit
one-line note above those milestone rows stating that past year 5 these are
directional scenario illustrations built on compounding assumptions, not forecasts,
since no assumption set survives 20 years of unmodeled market change untouched.

Show the arithmetic chain for at least one full year (pick year 3) as a worked
example directly beneath the table: users -> paying users -> revenue -> COGS ->
gross margin -> opex -> EBIT -> tax -> after-tax profit, with every intermediate
number labeled by which assumption produced it.

### 4. Sanity checks (include as a short section)

- Does the realistic case's year-1 paying-user count imply a signup rate that is
  actually achievable for an unfunded/lightly-funded app launch? If not, revise the
  assumption, do not just accept an implausible number because the arithmetic is
  internally consistent.
- Does gross margin at scale exceed the avatar tier's ~76% ceiling from the existing
  product? If your blended margin is higher than that, explain why (e.g. higher
  text-only mix), do not silently assume a better margin than the locked unit
  economics support.
- State the single biggest assumption the whole model is most sensitive to (likely
  conversion rate or churn) in one line.

Write the full document to
/Users/main/Desktop/Active Projects/communication/FINANCIAL-MODEL-20YR.md

---

## PART 2 -> paste into Fable session 2, writes CONTENT-ROADMAP-4-SKILLS.md

Instruction to the reader (Fable 5): You are designing the curriculum direction for
a 4-skill adult training app. Read PRD-CHARISMA-CHAT.md, POSITIONING.md,
ALPHA-MODEL-ANALYSIS.md, and content-library/README.md + CONTEXT.md as locked
input. The product's existing engine (mastery-gated units, deterministic
validator/score, event-sourced progress, the author-vs-serve content split
described in content-library/README.md) is the ONLY engine you may design content
for. Do not propose new schemas, new scoring mechanisms, or new infrastructure;
packages/core/schemas.ts, validator.ts, and score.ts are locked contracts, extend
never redesign. Make every decision yourself. Do not ask questions. No em-dashes.

### 0. Do this first: define and differentiate the 4 skills

"Communication," "Problem-Solving," "Cognitive [training]," and "Decision-Making"
is a working assumption, not a confirmed taxonomy, and the four names as given
overlap badly (problem-solving, cognitive training, and decision-making are not
obviously distinct skills to a user or to a content designer). Before writing any
curriculum, write a short section that:
- Gives each of the 4 a crisp, one-paragraph definition stated in terms of an
  observable adult behavior it trains (the way Communication already means
  "connect with another person in conversation," per content-library/README.md's
  north star).
- States explicitly, for every pair of the 4, what stops them from overlapping. If
  you cannot cleanly separate two of them, say so and propose a merged or renamed
  skill instead of forcing a fake distinction. Your revised skill list, if you
  change it, is the one the rest of this document uses; state the final list
  plainly at the top so it is easy to spot if it differs from the working
  assumption.
- Confirms each skill can be trained and scored the way Communication is today:
  through a validator that extracts objective signals from a transcript/response,
  not through subjective LLM judgment of "good thinking." If one of the 4 cannot be
  reduced to objectively-extractable signals from user-generated text, say so
  plainly and propose the closest workable adaptation (e.g. structured
  multi-step response formats that make reasoning steps machine-checkable) rather
  than quietly building an LLM-vibes scorer that breaks the product's actual moat
  (validator.ts is currently 100% deterministic string analysis, zero LLM judgment
  in the score path; preserve that property for every skill you design).

### 1. Per-skill curriculum, zero-knowledge to mastery

For each of the 4 (final, possibly-renamed list from section 0), using ONLY this
app (no external content, no video, no physical materials):

- A stated entry point: what a true beginner with zero prior exposure sees in
  their very first unit.
- A mastery-gated progression: name 4-8 concrete stages/tiers from beginner to
  advanced, each with a one-line description of what the user demonstrates to pass
  (mirroring the existing Unit.mastery.passes_required / distinct_days gate
  pattern), not a vague "gets better over time."
- At least 2 fully worked example units per skill, in the same shape as
  content-library's existing author-layer files (a scenario/prompt, a persona if
  the skill format uses one, and a rubric/signals list a validator could plausibly
  extract), concrete enough that a human author could turn them into real
  content-library files without further invention.
- What "connection" or the equivalent north-star concept means for this skill (per
  content-library/README.md, Communication's north star is DID THEY CONNECT; state
  the analogous one-sentence north star for each of the other 3, do not leave them
  without one).

### 2. Shared engine, not 4 separate apps

Per ALPHA-MODEL-ANALYSIS.md's "one engine, many skill packs" framing: name the
concrete pieces of the existing engine each skill reuses unchanged (mastery gate
logic, event-sourced progress storage, the static-prefix/variable-suffix prompt
assembly split, the strict-JSON character/feedback output contracts) and the
concrete pieces that are genuinely new per skill (content-library files, a
per-skill Signals shape if the skill needs different objective signals than
Communication's open_questions/followups/reciprocity/etc., a per-skill scoring
weight set in score.ts as new named exports, not a rewrite of the existing
Communication weights).

### 3. Sequencing recommendation

State, in one short section, which of the 4 skills to build first after
Communication (which already exists) and why, considering: reuse of existing
validator infrastructure (closest to Communication's signal-extraction shape wins),
market demand signal if you have one from prior research in this repo, and
implementation risk. Do not recommend building all 4 simultaneously; state a build
order.

### 4. Explicit scope note (one sentence, do not omit)

State plainly that this 4-skill expansion is a broader scope than the product's
current positioning (POSITIONING.md's stated year-one discipline is to hold a
single, narrow identity rather than diversify early), so the reader building this
knows they are consciously trading positioning discipline for surface area, not
discovering that tradeoff later.

Write the full document to
/Users/main/Desktop/Active Projects/communication/CONTENT-ROADMAP-4-SKILLS.md

---

## PART 3 -> paste into Fable session 3, writes RESEARCH-METHODOLOGY.md

Instruction to the reader (Fable 5): You are recommending a research methodology
and tooling for gathering the market/competitor/pedagogy data that the financial
model and content roadmap in this repo depend on (edtech/adult-learning market
sizing, competitor pricing, comparable-company data like Alpha School's public
business model). Make every decision yourself. Do not ask questions. No em-dashes.

### 0. What already worked, use this as your baseline

A prior research pass on Alpha School's business model (scale, pricing, funding,
governance, spinoffs, charter-application outcomes) was completed successfully
using only plain web search and page fetches (no scraping platform, no paid API):
it found tuition ranges, campus count, founding/backing details, spinoff brands,
and public credibility red flags (regulatory rejections, no independent
validation) entirely from public web pages and news coverage. Treat this as
evidence that ad hoc web search + fetch is sufficient for one-time, qualitative,
named-source competitive research, and do not recommend a scraper platform or a
paid data API to replace something that already worked for that class of question.

### 1. What you are actually deciding

Answer separately for each of these three research needs, since they have
different shapes and may have different right answers:
- One-time qualitative comp research (how Alpha School and similar
  self-improvement/edtech products price, position, and structure themselves):
  recommend web search + fetch (as already proven above) unless you can name a
  concrete gap it leaves, in which case name the gap precisely.
- Structured market-sizing numbers (TAM/SAM for adult self-improvement or edtech
  spend, industry report figures): name specific, ideally free or low-cost sources
  (named market-research aggregators, government/BLS-style labor and consumer
  spending data, public company 10-Ks of comparable public edtech firms) over a
  generic "use an API" answer. If a paid industry report is genuinely the best
  source, say so and name it, do not avoid naming real sources just because they
  cost money.
- Ongoing/ repeated data needs, if any (e.g. tracking competitor pricing changes
  over time, not a one-time snapshot): only for this category, evaluate whether a
  scraper platform (Apify or equivalent) is justified. State the concrete trigger
  that would justify it (recurring, structured, multi-page extraction at a
  cadence a human/LLM doing it manually could not sustain), and say plainly if
  nothing in this project currently meets that trigger.

### 2. Recommendation

Give one clear recommendation: what Fable (or a future research agent) should
reach for by default for this project's research needs, and the specific
narrow condition under which reaching for Apify or a paid data API would be
justified instead. Do not hedge with "it depends" as the final answer; state the
default and the exception.

Write the full document to
/Users/main/Desktop/Active Projects/communication/RESEARCH-METHODOLOGY.md
