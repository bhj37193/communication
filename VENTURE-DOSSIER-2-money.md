# VENTURE DOSSIER, PART 2: MONEY (sections 6 to 9)

Charisma chat trainer. Produced by Fable 5 against FABLE-PROMPT-VENTURE-DOSSIER.md,
sections 6 through 9 only. Builds on PRD-CHARISMA-CHAT.md (locked). No em-dashes.

Currency assumptions used throughout (state once, apply everywhere):
- EUR to USD: 1 EUR = 1.08 USD (assumption, confirm at time of budgeting)
- USD to KRW: 1 USD = 1,350 KRW (assumption, confirm at time of filing)
- Haiku 4.5 API pricing: $1.00 per MTok input, $5.00 per MTok output, prompt-cache
  read $0.10 per MTok (10% of input), cache write $1.25 per MTok (125% of input).
  Assumption based on published Anthropic pricing; confirm current rates before
  budgeting (a provider price change is a named risk and swap trigger, PRD 3.4).
- Paddle Billing MoR fee: 5% + $0.50 per transaction. Assumption based on Paddle's
  published standard rate; confirm the actual contracted rate at Paddle onboarding.

---

## 6. Business model and pricing

### 6.1 The model: freemium, decided

Freemium, one paid tier, no ads, no consumables, no lifetime deal.

Why freemium and not the alternatives:
- Paid-only (paywall at install) is wrong for a habit product whose aha moment is the
  first session. The user must feel the character warm up before money is mentioned.
  Paid-only also kills the shareable score card loop: the viral artifact must be
  generatable by free users.
- Ads are disqualified twice over: they poison a premium self-improvement brand, and
  ad SDKs are data-hungry, which collides with the privacy positioning (PRD 9.4).
  Not negotiable.
- Lifetime deals sell the best users once. A daily-habit product with months of
  content runway (skill tree, spaced review) is structurally a subscription.
- Consumable credits ("buy 10 challenges") reintroduce a spending decision at the
  exact moment the loop should feel frictionless, and they make revenue lumpy and
  churn invisible. Rejected.

The free tier is deliberately generous on the loop and stingy on volume: the daily
habit is free forever, more-than-daily is paid. This matches the pedagogy (one
challenge a day is the intended dose) and caps free-tier cost at exactly one scored
session per user per day (PRD 3.10 layer 1).

### 6.2 The exact tiers (restating the locked PRD 1.8 wall, with the reasoning)

FREE (forever):
- 1 scored challenge per day
- Streak and current score
- Full result card: WIN, FIX, THE MOMENT
- 1 incognito session per day
- Progress screen (skill nodes)

Withheld from free:
- Additional scored challenges (the "One more" button after the result card)
- Score history and trend charts (free sees only the current score)
- Extra character packs (coworker, guarded friend-of-a-friend, later packs)
- Unlimited incognito
- Streak freeze (Phase 3)
- "Save this conversation" (nulls the 60-day expiry, PRD 3.8)

PAID ("Charisma Plus"):
- Unlimited challenges, hard-capped at 10 scored sessions per day (cost and pedagogy)
- Score history and trends
- All character packs
- Unlimited incognito
- Streak freeze (when it ships in Phase 3)
- Save conversations

The wall placement is locked (PRD 1.8): it appears only when the user taps "One more"
after a result card. It never blocks the daily free loop. This is both ethics (the
habit is never held hostage) and conversion craft (the paywall shows up at the exact
moment of demonstrated desire).

### 6.3 The prices: $9.99/month, $59.99/year, decided

These are the launch prices (already pinned in PRD 1.8; this section carries the
justification and the anchors).

Competitor anchors (prices as generally listed at knowledge time; confirm current
prices before launch copy quotes any of them):

| Product | Category | Monthly | Annual | Note |
|---|---|---|---|---|
| Duolingo Super | language habit app | ~$12.99 | ~$59.99 to $83.99 | the closest habit-loop analog |
| Duolingo Max | + AI conversation | ~$29.99 | ~$167.99 | proves AI convo commands premium |
| Speak | AI speaking tutor | ~$19.99 | ~$99 | AI conversation practice, voice |
| Yoodli | AI speech coach | ~$15 to $20 | ~$120 | B2B-leaning, presentation-coded |
| Orai | speech practice | ~$9.99 | ~$59.99 | direct price twin |
| Character.AI c.ai+ | AI chat | $9.99 | ~$120 | proves $9.99 chat subscriptions convert at scale |
| Replika Pro | AI companion | ~$19.99 | ~$69.99 | companion-coded, not skill-coded |

Reasoning for $9.99/month:
- $9.99 is the consumer impulse ceiling: below Speak/Yoodli/Replika, at parity with
  Character.AI and Orai, below Duolingo Super. The product is a 3-to-5-minute daily
  habit, not a course; pricing above the habit-app band would demand outcome proof
  the brand does not yet have.
- The unit economics clear comfortably at $9.99 (Section 7: contribution margin 78%),
  so there is no cost pressure to price higher; the constraint is willingness to pay,
  not margin.
- Charm pricing at .99 is standard in every anchor; deviating buys nothing.

Reasoning for $59.99/year:
- $59.99/12 = $5.00/month, a 50% saving versus monthly. The paywall pushes annual
  (PRD 1.8) because annual buys 12 months of committed practice for a habit product
  whose value compounds, and it front-loads cash for a bootstrapped solo founder.
- $59.99 sits exactly on the Duolingo Super and Orai annual anchor, the two most
  comparable consumer price points.
- A steeper discount (for example $49.99, 58% off) undertrains price perception and
  costs 17% of annual revenue; a shallower one (for example $79.99, 33% off) does not
  flip fence-sitters. 50% off is the proven consumer-app annual frame.

If Apple review ever forces IAP for in-app unlock, the pre-made decision holds
(PRD 7.5): IAP at $12.99/month while web stays $9.99, the Spotify pattern.

### 6.4 Trial: 7-day free trial on the annual plan only, decided

- Monthly plan: no trial. The free tier IS the perpetual trial of the core loop; a
  trial on a $9.99 monthly plan mostly harvests refund-adjacent churn.
- Annual plan: 7-day free trial, card required, via Paddle's native trial support.
  Reasoning: the annual push (PRD 1.8) needs a fence-sitter flipper; "try Plus free
  for 7 days, then $59.99/year" converts users who want unlimited play but balk at a
  $59.99 upfront charge. Card-up-front trials convert at several times the rate of
  no-card trials into actual revenue, and Paddle handles the trial-to-paid charge and
  the reminder email (a reminder before the charge is also the ethical choice and
  reduces refunds and chargebacks).
- Trial abuse is bounded: trial requires a Clerk account, one trial per Paddle
  customer, and the paid daily cap (10 scored sessions) applies during trial, so the
  worst-case model cost of a trial abuser is 7 days x 10 sessions x $0.019 = $1.33.

### 6.5 Post-launch price testing: the 3-experiment plan

Because checkout is 100% web via Paddle (app is login-only), price testing is a
web A/B problem: no app-store price tiers, no store review, and no visible
in-app prices to contradict. Test on the web paywall and checkout only.

Guardrails for all three experiments: existing subscribers are always grandfathered;
one experiment at a time; minimum 4 full weeks or the stated conversion count per
arm, whichever is later; the metric is revenue per unique paywall viewer (not raw
conversion rate, which a lower price trivially wins).

Experiment 1: monthly price point. $9.99 (control) vs $12.99 (test), annual held at
$59.99 in both arms. 50/50 split on first paywall view, sticky per user. Run until
each arm has at least 300 paid conversions. Decision rule: adopt $12.99 only if
revenue per paywall viewer is at least 15% higher AND 60-day retention of the
$12.99 cohort is not worse by more than 2 points (a price that converts but churns
is a loss on LTV). Hypothesis being tested: the Duolingo Super anchor means $12.99
is inside willingness to pay.

Experiment 2: annual anchor and framing. $59.99 (control) vs $49.99 (test), and in
parallel the paywall layout variant annual-first vs monthly-first. Metric: blended
expected revenue per paywall viewer at 12-month horizon (annual counted at face
value, monthly at price x expected months from the churn table in Section 7.6).
Run: 300 conversions per arm. Decision rule: keep the price and layout that
maximizes the 12-month blended figure; annual share of new subs is the secondary
readout (target: 50% or higher annual mix).

Experiment 3: trial structure. 7-day annual trial (control) vs 14-day (test A) vs
no trial (test B). Metric: paid-start rate x trial-to-paid conversion x (1 minus
refund rate within 30 days), that is, net paid subscribers per paywall viewer.
Run: 8 weeks (trials need the conversion tail). Decision rule: adopt the arm with
the highest net paid subscribers per viewer; kill any arm whose refund rate exceeds
5% of gross (Section 7.4 reserve assumption breaks above that).

Deferred (not one of the three, run after 5,000 subscribers): purchasing-power-parity
regional pricing via Paddle's per-country price overrides. Worth real money at scale,
noise at launch volumes.

### 6.6 The business in three numbers (feeds the executive summary)

- Price: $9.99/month, $59.99/year, blended gross $7.50 per paid user per month
  (arithmetic in 7.4).
- Contribution margin per paid user: $5.85/month, 78% (arithmetic in 7.5).
- Break-even: 13 subscribers cover the launch infrastructure; roughly 700 subscribers
  cover infrastructure plus a modest founder salary (arithmetic in 7.8).

---

## 7. Unit economics (every calculation shown)

### 7.1 The per-challenge model cost (the atom of all cost math)

Reconciliation note: the dossier prompt says "about 15 character turns"; the locked
PRD gives users 10 messages per session and hard-caps character model calls at 12 and
feedback calls at 2 (PRD 3.10 layer 2). The PRD is locked and wins: expected case is
10 character calls (one per user message), worst case 12, plus one feedback call
(worst case 2, one retry).

Token assumptions per character call (PRD 3.3, 3.10):
- Static cacheable prefix (character system prompt + persona brief + warmth rules):
  1,500 tokens
- Uncached input per call (growing transcript + current warmth injection), session
  average: 800 tokens
- Output per call: 60 tokens (maxTokens 120 cap, average below cap)

Cache economics on the prefix at the prompt-cache hit rate of 90% (the dossier
prompt's stated assumption; misses are TTL expiries and first-turn writes):
- Effective prefix price per MTok = 0.90 x $0.10 (read) + 0.10 x $1.25 (write)
  = $0.09 + $0.125 = $0.215 per MTok

Per character call:
- Prefix: 1,500 tokens x $0.215 / 1,000,000 = $0.0003225
- Uncached input: 800 tokens x $1.00 / 1,000,000 = $0.0008000
- Output: 60 tokens x $5.00 / 1,000,000 = $0.0003000
- Total per call: $0.0014225, round $0.00142

Ten character calls (expected session): 10 x $0.00142 = $0.0142

Feedback call (PRD 3.5), one per session:
- Cacheable feedback-prompt prefix: 1,000 tokens x $0.215 / 1,000,000 = $0.000215
- Uncached input (full transcript): 1,500 tokens x $1.00 / 1,000,000 = $0.001500
- Output: 600 tokens x $5.00 / 1,000,000 = $0.003000
- Total: $0.004715, round $0.0047

Per-challenge total, expected: $0.0142 + $0.0047 = $0.0189, round to $0.019.

Bounds:
- Best case (short session, everything cache-warm): ~$0.012
- Worst case (12 character calls + one feedback retry):
  12 x $0.00142 + 2 x $0.0047 = $0.0170 + $0.0094 = $0.0264
- Planning figure used everywhere below: $0.019 expected, $0.02 budget line.

This matches the locked PRD 3.10 band ($0.012 to $0.020 per challenge) with the
worst-case retry tail slightly above it, which is exactly what the per-session call
caps and the global circuit breaker exist to contain. The figure is metered, not
estimated, from day one via `model_usage` rows, so this table gets replaced by
measured reality in week one of Phase 0.

### 7.2 Cost per FREE user per month

Free users can play at most 1 scored + 1 incognito session per day, but the blended
average is far below the cap. Assumption (aligned with the locked PRD 3.10 blended
estimate, which prices 100k free users at $5k to $10k/month, implying roughly 4
sessions per user per month): the average free monthly-active user plays 4 scored
sessions and a negligible number of incognito sessions per month.

- AI cost per free MAU: 4 x $0.019 = $0.076, round $0.08/month
- Infra allocation per free user: by scale band (7.7): $0.04 at launch, $0.007 at
  10k users, $0.02 at 100k users (Clerk-dominated, see 7.7)
- Cost per FREE user per month, base case: $0.08 + ~$0.01 to $0.04 = $0.09 to $0.12,
  planning figure $0.10

Sensitivity (this assumption moves the whole system, so state the band):
- High engagement (8 scored + 1 incognito = 9 sessions/month): 9 x $0.019 = $0.171
- Cap abuse (a daily player: 30 scored + 30 incognito = 60 sessions):
  60 x $0.019 = $1.14/month, the per-user worst case the caps make possible and the
  reason the free cap is exactly one scored session per day.

### 7.3 Cost per PAID user per month

Assumption: a paid user plays on 22 days per month, averaging 1.8 scored sessions per
active day = 40 sessions/month (stated assumption; measured from `daily_usage` after
launch).

- AI cost per paid user: 40 x $0.019 = $0.76/month
- Worst case (daily cap abuser: 10 scored x 30 days = 300 sessions):
  300 x $0.019 = $5.70/month, still below the $9.99 monthly price and far below the
  $59.99 annual's monthly-equivalent margin. The cap guarantees no paid user can be
  contribution-negative on AI cost alone. This is why the cap is 10, not unlimited.
- Infra allocation: same per-user bands as 7.2 (roughly $0.01, negligible)
- Cost per PAID user per month, base case: $0.76 + $0.01 = $0.77

### 7.4 Gross revenue and MoR fees per paid user

Plan mix assumption: 50% monthly, 50% annual at launch (the paywall pushes annual;
Experiment 2 in 6.5 measures the real mix; every point of annual mix shift moves
blended revenue by about $0.05).

Gross revenue per paid user per month:
- Monthly plan: $9.99
- Annual plan: $59.99 / 12 = $4.9992, round $5.00
- Blended: 0.5 x $9.99 + 0.5 x $5.00 = $4.995 + $2.500 = $7.495, round $7.50

Paddle MoR fees (5% + $0.50 per transaction; confirm contracted rate):
- Monthly plan: 0.05 x $9.99 + $0.50 = $0.4995 + $0.50 = $0.9995 per month,
  round $1.00 (10.0% effective take)
- Annual plan: 0.05 x $59.99 + $0.50 = $2.9995 + $0.50 = $3.4995 per year
  = $3.50 / 12 = $0.29 per month (5.8% effective take; annual halves the fixed-fee
  drag, another reason to push annual)
- Blended: 0.5 x $1.00 + 0.5 x $0.29 = $0.645, round $0.65 per month

Refund and failed-payment reserve: 3% of gross (assumption; consumer app norm is
1 to 3%, Paddle handles the mechanics as MoR; Experiment 3's kill rule triggers
above 5%):
- Blended: 0.03 x $7.50 = $0.225, round $0.23 per month

### 7.5 Contribution margin per paid user

At the 10k-user scale band (infra per user $0.01):

| Line | $/month | Arithmetic |
|---|---|---|
| Gross revenue | 7.50 | 7.4 |
| Paddle MoR fee | (0.65) | 7.4 |
| Refund reserve | (0.23) | 0.03 x 7.50 |
| AI cost | (0.76) | 40 x 0.019 |
| Infra allocation | (0.01) | 7.7, 10k band |
| Contribution | 5.85 | 7.50 - 0.65 - 0.23 - 0.76 - 0.01 |

Contribution margin percentage: 5.85 / 7.50 = 78%.

This is the structural fact of the business: gross margin is software-class despite
paying per-token AI costs, because the validator is deterministic (free), replies are
capped at 120 tokens, and the free tier is capped at one session per day.

### 7.6 LTV and maximum CAC

Churn assumption (stated, to be replaced by cohort data): monthly-plan subscribers
churn at 10%/month (consumer habit-app norm); annual subscribers effectively churn at
6%/month-equivalent (12-month commitment, ~50% renewal). Blended at the 50/50 mix:
0.5 x 10% + 0.5 x 6% = 8.0% blended monthly churn.

- Expected subscriber lifetime: 1 / 0.08 = 12.5 months
- LTV (contribution basis): $5.85 x 12.5 = $73.13, round $73
- Maximum sustainable CAC at 1:3 CAC:LTV: $73 / 3 = $24.38, round $24

Any paid acquisition channel must land a subscriber below $24 blended, fully loaded.
Organic (short-form video + share card) is the plan of record; $24 is the ceiling
that tells you when a paid experiment is failing.

### 7.7 Infra allocation by scale band (the fixed-cost denominators)

VPS and fixed monthly costs (Hetzner prices approximate, confirm current pricing):

| Band | Boxes | EUR/mo | USD/mo | Other fixed | Total fixed USD/mo |
|---|---|---|---|---|---|
| Launch (~1k users) | 1x CPX31 (4 vCPU/8GB) ~EUR 16 + Storage Box ~EUR 4 + domain | ~22 | ~24 | Clerk free tier $0, Sentry free $0, misc ~$16 | ~$40 |
| 10k users | 1x CPX41 (8 vCPU/16GB) ~EUR 29 + storage ~EUR 6 | ~35 | ~38 | Clerk Pro $25 | ~$65 |
| 100k users | app box CPX51 ~EUR 65 + db box CCX33 ~EUR 60 + storage ~EUR 10 | ~135 | ~146 | Clerk $25 + 90,000 x $0.02 = $1,825 | ~$1,975 |

Per-user allocation:
- Launch: $40 / 1,000 = $0.040 per user-month
- 10k: $65 / 10,000 = $0.0065, round $0.007
- 100k: $1,975 / 100,000 = $0.0198, round $0.02

The finding worth stating out loud: from 10k users onward the VPS is a rounding
error; the dominant "infra" line at scale is Clerk's per-MAU pricing, not compute.
At 100k users Clerk at list price ($0.02/MAU past 10k, confirm current pricing) costs
12x the servers. Flag: renegotiate Clerk at volume or budget an auth migration as a
Year-2+ decision. The hard constraint (self-hosted VPS, no PaaS) is comfortably
satisfied by one to two boxes through 100k users because the workload per user is a
handful of short JSON requests per day and Postgres does counters, not analytics.

### 7.8 The free tier as growth investment, and system break-even

Cost to carry a free user: $0.10/month base case (7.2). Average free-user active
lifetime assumption: 3 months of MAU status before churning out or converting.
Lifetime carry cost per free signup: 3 x $0.10 = $0.30.

At a 2% eventual free-to-paid conversion (the locked Phase 4 gate floor, PRD 5),
the free tier's cost per acquired subscriber is $0.30 / 0.02 = $15.00, which is 62%
of the $24 maximum CAC. So even at the gate-floor conversion rate the free tier is a
cheaper acquisition channel than the paid-CAC ceiling, and every point of conversion
above 2% improves it. That is the precise sense in which free-tier spend is CAC, not
loss.

Break-even free:paid ratio (variable costs only):
- One paid user contributes $5.85/month (7.5)
- One free MAU costs $0.08/month in AI (7.2, base) plus ~$0.01 infra = $0.09
- Break-even ratio: 5.85 / 0.09 = 65 free users per paid user
- As a conversion rate: 1 / (65 + 1) = 1.5%. Above 1.5% conversion the whole system
  is variable-cost positive; below it, free users burn cash.

Sensitivity on the free-engagement assumption (the one number that moves this):
- High engagement ($0.171 + $0.01 = $0.18 per free MAU): ratio 5.85 / 0.18 = 32:1,
  break-even conversion 1 / 33 = 3.0%
- Base ($0.09): 65:1, break-even conversion 1.5%

Read on the locked gates: the Phase 4 gate (free-to-paid >= 2% before spending on
distribution) sits between the base-case break-even (1.5%) and the high-engagement
break-even (3.0%). That is the correct place for the gate: at 2% conversion the
system is profitable if free engagement is at the PRD's blended assumption and
roughly break-even if free users are unusually heavy players, and `daily_usage`
tells you which world you are in within weeks.

Fixed-cost break-even (subscriber counts, using contribution net of the free-user
load at 3% conversion, ratio 32 free per paid at the conservative $0.09 carry:
32 x $0.09 = $2.88 load, net contribution 5.85 - 2.88 = $2.97 per paid user):
- Cover launch infra ($40/month): 40 / 2.97 = 13.5, so 14 subscribers
- Cover infra + modest founder draw ($2,200/month, roughly KRW 3.0M):
  2,240 / 2.97 = 754, so roughly 700 to 800 subscribers
- At the base-case free load (65:1 ratio at 1.5% conversion is the floor; at 3%
  conversion the ratio is 32:1 regardless of which engagement case holds, because
  ratio is set by conversion, not cost): the number that matters is conversion.
  At 5% conversion (ratio 19:1, load 19 x 0.09 = $1.71, net $4.14): founder-salary
  break-even = 2,240 / 4.14 = 541, so roughly 550 subscribers.

---

## 8. Financial projection: bear / realistic / bull, 5 years

### 8.1 Method and shared assumptions

All scenarios use the unit rates derived in Section 7 (held constant, conservative):
- Blended gross per paid user: $7.50/month (7.4)
- Paddle fees: $0.65 per paid user/month; refund reserve $0.23 (7.4)
- AI cost: $0.76 per paid user/month, $0.08 per free MAU/month (7.2, 7.3)
- Fixed infra by total-MAU band per 7.7, extended above 100k as noted per cell
- Figures are monthly run-rates AT the stated year mark (not annual averages)

Deliberate conservatisms, stated:
1. AI costs are held at Haiku list pricing forever. In reality the locked swap
   trigger (PRD 3.4: model spend over $8,000/month for two consecutive months) fires
   during Year 2 to 3 of the realistic scenario and Year 1 of bull, and self-hosted
   open weights at those volumes should cut the AI line by half or more, at the cost
   of GPU boxes moving some spend into fixed infra. The projection ignores this
   upside entirely.
2. Plan mix held at 50/50; every shift toward annual raises cash flow and lowers
   effective Paddle take.
3. No price increases in 5 years.
Clerk is carried at list price through 100k+ MAU with a flagged assumption of a
negotiated volume rate at bull scale (marked in the cells); if no deal materializes,
the correct move is an auth migration, budgeted as a one-time engineering cost, not
a permanent margin hit.

Growth assumptions behind each scenario (the single variable that moves everything
is subscriber growth; costs are linear followers):
- BEAR: organic only, the share-card loop never takes off, no paid acquisition ever
  clears the $24 CAC bar. Growth is app-store search plus word of mouth. Conversion
  sits at the 2% gate floor.
- REALISTIC: the share card works modestly (each new cohort brings a fraction of the
  next), plus small paid tests inside the CAC ceiling. Conversion improves from 3%
  toward 5% as history/trends and packs deepen the paid offer.
- BULL: short-form virality hits (a handful of breakout videos, the Duolingo path),
  compounding word of mouth, conversion at 3 to 6%. This is the only scenario where
  the Clerk renegotiation and the model swap become urgent in Year 1 to 2.

### 8.2 BEAR (organic only, gate-floor conversion)

| Monthly run-rate at | Year 1 | Year 3 | Year 5 |
|---|---|---|---|
| Paying subscribers | 300 | 1,200 | 2,000 |
| Free MAU | 15,000 | 45,000 | 60,000 |
| Gross revenue | 300 x 7.50 = $2,250 | 1,200 x 7.50 = $9,000 | 2,000 x 7.50 = $15,000 |
| AI cost | 300 x .76 + 15,000 x .08 = 228 + 1,200 = $1,428 | 912 + 3,600 = $4,512 | 1,520 + 4,800 = $6,320 |
| Paddle fees | 300 x .65 = $195 | 1,200 x .65 = $780 | 2,000 x .65 = $1,300 |
| Refund reserve | 300 x .23 = $69 | $276 | $460 |
| Fixed VPS + infra | $171 (VPS 40 + Clerk 25 + 5,300 x .02 = 106) | $899 (VPS 150 + Clerk 25 + 36,200 x .02 = 724) | $1,215 (VPS 150 + Clerk 25 + 52,000 x .02 = 1,040) |
| Net profit (pre-tax) | 2,250 - 1,428 - 195 - 69 - 171 = $387 | 9,000 - 4,512 - 780 - 276 - 899 = $2,533 | 15,000 - 6,320 - 1,300 - 460 - 1,215 = $5,705 |
| Margin | 387 / 2,250 = 17% | 2,533 / 9,000 = 28% | 5,705 / 15,000 = 38% |
| Korean corporate tax (8.5) | $0 assumed under exemption, confirm with 세무사 | $0 assumed, confirm | $0 assumed, confirm |

Bear is a profitable lifestyle business that never pays a full salary until Year 3+
(Year 3 run-rate $2,533/month ~ KRW 3.4M/month pre-founder-pay). It never dies of
costs; it just stays small. The correct bear-case response is repositioning or a
second wedge, not cost-cutting: there is nothing material to cut.

### 8.3 REALISTIC (share loop works, small paid inside CAC ceiling)

| Monthly run-rate at | Year 1 | Year 3 | Year 5 |
|---|---|---|---|
| Paying subscribers | 1,000 | 8,000 | 20,000 |
| Free MAU | 30,000 | 200,000 | 400,000 |
| Gross revenue | 1,000 x 7.50 = $7,500 | 8,000 x 7.50 = $60,000 | 20,000 x 7.50 = $150,000 |
| AI cost | 760 + 30,000 x .08 = 760 + 2,400 = $3,160 | 6,080 + 16,000 = $22,080 | 15,200 + 32,000 = $47,200 |
| Paddle fees | $650 | $5,200 | $13,000 |
| Refund reserve | $230 | $1,840 | $4,600 |
| Fixed VPS + infra | $595 (VPS 150 + Clerk 25 + 21,000 x .02 = 420) | $4,385 (VPS cluster 400 + Clerk 25 + 198,000 x .02 = 3,960) | $9,025 (VPS cluster 800 + Clerk 25 + 410,000 x .02 = 8,200) |
| Net profit (pre-tax) | 7,500 - 3,160 - 650 - 230 - 595 = $2,865 | 60,000 - 22,080 - 5,200 - 1,840 - 4,385 = $26,495 | 150,000 - 47,200 - 13,000 - 4,600 - 9,025 = $76,175 |
| Margin | 2,865 / 7,500 = 38% | 26,495 / 60,000 = 44% | 76,175 / 150,000 = 51% |
| Korean corporate tax (8.5) | $0 assumed under exemption, confirm | $0 assumed, confirm (without exemption ~ KRW 67.7M/yr, see 8.5) | $0 assumed while exemption window lasts, confirm; standard rates begin after year 5 |

Notes: the AI line crosses the $8k/month swap trigger during Year 2; the table
ignores the resulting cost reduction (stated conservatism 1). The Clerk line at
Year 3+ assumes list price and is the flagged renegotiate-or-migrate item.

### 8.4 BULL (virality, the Duolingo path)

| Monthly run-rate at | Year 1 | Year 3 | Year 5 |
|---|---|---|---|
| Paying subscribers | 4,000 | 40,000 | 100,000 |
| Free MAU | 120,000 | 800,000 | 1,500,000 |
| Gross revenue | $30,000 | $300,000 | $750,000 |
| AI cost | 3,040 + 9,600 = $12,640 | 30,400 + 64,000 = $94,400 | 76,000 + 120,000 = $196,000 |
| Paddle fees | $2,600 | $26,000 | $65,000 |
| Refund reserve | $920 | $9,200 | $23,000 |
| Fixed VPS + infra | $2,705 (VPS 400 + Clerk 25 + 114,000 x .02 = 2,280) | $9,900 (VPS cluster 1,500 + Clerk at assumed negotiated $0.01/MAU = 8,400; flagged assumption) | $15,800 (VPS cluster 3,000 + Clerk at assumed negotiated $0.008/MAU = 12,800; flagged assumption) |
| Net profit (pre-tax) | 30,000 - 12,640 - 2,600 - 920 - 2,705 = $11,135 | 300,000 - 94,400 - 26,000 - 9,200 - 9,900 = $160,500 | 750,000 - 196,000 - 65,000 - 23,000 - 15,800 = $450,200 |
| Margin | 11,135 / 30,000 = 37% | 160,500 / 300,000 = 54% | 450,200 / 750,000 = 60% |
| Korean corporate tax (8.5) | $0 assumed under exemption, confirm | $0 assumed, confirm (without exemption ~ KRW 521M/yr, see 8.5) | $0 during window, then standard rates, confirm |

Bull-scale notes: the model swap fires in Year 1 (AI line $12.6k/month); Clerk at
list price would cost ~$16k to $30k/month at these MAU counts, hence the flagged
negotiated-rate assumption or migration. Both are execution chores, not
economics-breakers: even at fully-listed prices bull Year 3 margin only drops from
54% to roughly 49%.

### 8.5 The Korean corporate tax line (after the young-entrepreneur exemption)

Working assumption used in every table above: the entity qualifies for the
young-entrepreneur startup SME reduction (창업중소기업 세액감면, Section 9.2) at
100% (registered outside the over-concentration zone), so corporate income tax
during the 5-year window is KRW 0. Every element of that sentence must be confirmed
with a 세무사 before it is relied on: eligibility, the 100% vs 50% zone question,
whether the minimum tax (최저한세) claws any of it back, whether any cap applies,
and the treatment of local income tax (지방소득세, normally 10% of corporate tax).

What the tax WOULD be without the exemption, for scale (standard SME corporate tax
brackets assumed at 9% up to KRW 200M of taxable income and 19% above, plus 10%
local income tax on the corporate tax amount; confirm current brackets with 세무사):

- Realistic Year 3: pre-tax $26,495/month x 12 = $317,940/year
  x 1,350 = KRW 429.2M taxable (assuming book profit ~ taxable income, confirm).
  Tax: 200M x 9% = 18.0M; (429.2M - 200M) x 19% = 229.2M x 0.19 = 43.5M;
  corporate tax = 61.5M; local income tax = 6.2M; total ~ KRW 67.7M (~$50,100).
  The exemption is therefore worth roughly $50k/year at realistic Year 3 scale.
- Bull Year 3: pre-tax $160,500 x 12 = $1,926,000/year x 1,350 = KRW 2,600M.
  Tax: 18.0M + (2,600M - 200M) x 0.19 = 18.0M + 456.0M = 474.0M; local 47.4M;
  total ~ KRW 521M (~$386,000/year). Confirm brackets and computation with 세무사.
- The 100% vs 50% registration-location decision (9.2) is therefore worth, at
  realistic Year 3, roughly KRW 33.9M (~$25,000) per year: half of 67.7M. Register
  outside the zone if operationally possible.

After the 5-year window closes, the standard brackets apply to whatever the Year 6+
profit is; the projection window here ends at Year 5, so every tax cell above is $0
by assumption, marked confirm.

### 8.6 What moves the outcome, and what does not

One variable dominates: paying-subscriber count, which is conversion x free-user
growth. Between bear and bull at Year 3 the subscriber count differs 33x and net
profit differs 63x, while every unit rate in the table is identical. Margins are
structurally stable (37 to 60% across all nine profitable cells) because every major
cost is either per-user-linear (AI, Paddle, Clerk) or a step function that lags
revenue (VPS boxes). There is no scale at which the model inverts: costs never grow
faster than users, and the two flagged super-linear threats (Clerk list pricing,
Haiku list pricing) both have named, pre-decided exits (negotiate-or-migrate auth;
the PRD 3.4 model swap trigger). The business cannot be cost-collapsed; it can only
fail to grow, which is why the locked Phase 0 aha gate and Phase 4 distribution gate
(PRD 5) are the real financial controls in this document.

---

## 9. Tax spec (Korean entity, global revenue via a Merchant of Record)

Structure, not legal or tax advice. Every rate, threshold, zone boundary, and
eligibility rule in this section is marked "confirm with 세무사" (Korean tax
accountant) and the flagged items form the engagement agenda for that professional.
Nothing here should be relied on until a 세무사 signs off. This is a named human
gate (dossier Section 14 cross-reference).

### 9.1 Entity form and the revenue gate

Decision: incorporate a 주식회사 (corporation) rather than operate as a 개인사업자
(sole proprietor). Reasons: the young-entrepreneur reduction applies in corporate
form to corporate income tax (clean 5-year window against the projection tables);
Paddle vendor onboarding and a corporate bank account are cleaner with a legal
entity; liability separation for a consumer AI product is worth having; and investor
optionality later requires it anyway. Counterpoint to confirm with the 세무사: at
bear-case profits a sole proprietor with the same reduction (applied to income tax)
can be simpler and cheaper to run; ask the 세무사 to compare both forms at the
Year 1 bear and realistic profit levels before incorporating. Confirm with 세무사.

The hard sequence gate (no revenue can flow before this chain completes):
1. Incorporate the 주식회사 (registered office decision in 9.2 comes FIRST, it
   determines the exemption percentage).
2. Business registration (사업자등록) with the tax office, within 20 days of
   commencing business (confirm deadline with 세무사).
3. Corporate bank account at a Korean bank (banks require the registration
   documents; expect enhanced checks for a new entity receiving foreign payouts).
4. Paddle vendor onboarding with the entity's legal name, business registration
   number, and the corporate account for payouts.
5. Only then: checkout goes live. TestFlight and free-tier launch do NOT require
   this chain (no revenue), so Phases 0 and 1 can run while incorporation is in
   progress; Phase 2 (money) is blocked on it. This ordering is the practical
   takeaway: start incorporation when Phase 0 starts.

Also register: 통신판매업 신고 (mail-order/online sales business report) may be
required for selling digital subscriptions online, even with Paddle as the seller of
record; whether the MoR structure exempts the Korean entity is exactly the kind of
question that needs professional judgment. Confirm with 세무사.

### 9.2 The young-entrepreneur SME reduction (창업중소기업 세액감면)

The single largest tax lever in the plan. Statutory basis: 조세특례제한법 (Special
Tax Treatment Control Act) Article 6 (confirm article and current text with 세무사).

Understood shape of the rule (every clause: confirm with 세무사):
- Who: a first-time founder aged 15 to 34 at incorporation. Military service can
  extend the age ceiling by up to 6 years of served time. "First-time" excludes
  re-founding, converting, or renaming an existing business; it must be a genuinely
  new business.
- What: reduction of corporate income tax on income from the qualifying business
  for 5 years from the first income-generating year.
- How much: 100% if the startup is established OUTSIDE the Seoul metropolitan
  over-concentration zone (수도권 과밀억제권역); 50% if inside it. The zone covers
  Seoul and much of the surrounding metro area; the exact municipal boundaries are
  defined by decree and change. Where to register the company therefore directly
  halves or zeroes the tax line: at realistic Year 3 the difference is roughly
  KRW 33.9M (~$25,000) per year (arithmetic in 8.5).
- Sector: the business must fall in a qualifying industry. Software / information
  and communications (정보통신업) is understood to qualify; the exact KSIC code the
  entity registers under matters. Confirm the code choice with 세무사 BEFORE
  registration.

Decision, subject to confirmation: register the entity outside the
over-concentration zone. The founder is a solo developer shipping a global product;
the office can be anywhere. Critical caveat to confirm: the registered office must
reflect real business operations. A paper address inside a virtual-office arrangement
purely to harvest the 100% rate is an audit risk; ask the 세무사 what substance
(actual workplace, lease, where the founder actually works) the exemption requires,
and whether later relocating INTO the zone during the 5-year window claws back the
benefit. Confirm with 세무사.

Flagged interactions the 세무사 must resolve (do not assume):
- 최저한세 (alternative minimum tax): whether this particular reduction is subject
  to or excluded from the minimum tax, which would turn "100%" into something less.
  Confirm with 세무사.
- 지방소득세 (local income tax, normally 10% of the corporate tax amount): whether
  it follows the reduction to zero. Confirm with 세무사.
- Any annual cap on the reduction amount, and any employment or other conditions
  attached at higher benefit levels. Confirm with 세무사.
- Interaction with other regimes (벤처기업 확인, other startup reductions): whether
  stacking or choosing applies. Confirm with 세무사.

### 9.3 What the Merchant of Record changes (and what it does not)

With Paddle Billing as Merchant of Record, Paddle (its UK/US entities) is the SELLER
of record to every end customer. Consequences:

What it removes:
- The entity never registers for, collects, or remits consumer VAT/GST/sales tax in
  any customer country. EU VAT, UK VAT, US state sales tax, Australian GST, and the
  rest are Paddle's legal problem as seller. This is the entire reason Paddle was
  locked over Stripe (which is also unavailable to Korea-based businesses, PRD
  Section 2), and it is what makes a solo Korean founder serving 100+ countries
  administratively possible.
- No per-country invoicing, no OSS registration, no US nexus tracking.

What it creates instead:
- The entity's revenue is NOT thousands of consumer sales; it is periodic payouts
  from one foreign counterparty (Paddle) under a reseller/agency agreement. For
  Korean bookkeeping the revenue line is "sales of services to a foreign entity,
  settled in foreign currency", documented by Paddle's statements, not by consumer
  receipts.
- Tax characterization question for the 세무사: is the Paddle relationship a supply
  of services to a nonresident (the common MoR reading) and what documentation
  (contract, payout statements) must be retained to support it. Confirm with 세무사.
- Withholding question: whether any withholding applies on Paddle payouts under the
  relevant treaty (UK/US to Korea), and if Paddle issues any tax documents the
  entity needs (for example a US W-8BEN-E request). Confirm with 세무사.

What it does not change: Korean corporate income tax on the entity's profit (Section
9.2 handles that), Korean VAT filing obligations (9.4), and all domestic payroll and
bookkeeping duties (9.5).

### 9.4 Korean VAT (부가가치세) on the Paddle payouts

Understood shape (every clause: confirm with 세무사):
- A corporation is automatically a general VAT taxpayer (일반과세자); the simplified
  regime (간이과세) is not available to corporations, so there is no revenue
  threshold below which VAT filing can be skipped. Registration happens with
  사업자등록 regardless of revenue level. Confirm with 세무사.
- Services supplied to a nonresident foreign entity and paid in foreign currency
  are understood to be zero-rated (영세율) as foreign-currency-earning services,
  meaning: 0% output VAT on the Paddle revenue, but the returns must still be filed
  showing the zero-rated sales, with the Paddle contract and foreign-exchange
  receipts as supporting evidence. Whether the MoR payout structure fits the
  zero-rating categories exactly (국외 제공 용역 / 외화획득 용역) is a specific
  question for the 세무사, and the answer determines whether 10% output VAT is due
  on payouts. This is the highest-stakes VAT question in the plan. Confirm with
  세무사.
- Zero-rated does not mean out of scope: input VAT on domestic expenses (Korean
  accountant fees, domestic equipment, a Korean office) is refundable against
  zero-rated sales. Foreign invoices (Hetzner, Clerk, Anthropic, Sentry, Paddle's
  own fee) carry no Korean input VAT; note that imported services can trigger
  reverse-charge VAT (대리납부) in some cases; whether any of these vendor
  relationships do is another 세무사 question. Confirm with 세무사.
- Filing cadence for a corporation: VAT periods are half-yearly with quarterly
  preliminary returns, in effect four filings per year (January, April, July,
  October). Confirm cadence and e-filing setup (홈택스) with 세무사.

### 9.5 Bookkeeping, payroll, and compliance calendar

The entity must keep (confirm scope with 세무사):
- Double-entry books (복식부기), mandatory for corporations, with external tax
  adjustment (세무조정) by a 세무사 at year end. Typical retainer for a small
  entity: roughly KRW 100,000 to 200,000/month plus a year-end filing fee
  (assumption from market norms; confirm actual quotes).
- Revenue evidence: Paddle payout statements and the reseller agreement, mapped to
  bank credits on the corporate account, monthly.
- Expense evidence: foreign invoices (Hetzner, Anthropic, Clerk, Sentry, Apple and
  Google developer fees), card statements, and 적격증빙 (qualified evidence) rules
  for domestic spend. Confirm evidence standards with 세무사.
- Corporate tax return: within 3 months of fiscal year end; interim prepayment
  (중간예납) obligations begin in the second year. Confirm with 세무사.
- Payroll: the founder-employee's salary triggers monthly withholding (원천징수)
  and 4대보험 (four major social insurances) enrollment. Founder compensation
  design (salary vs retained earnings vs eventual dividends) changes personal tax,
  insurance cost, AND the value of the corporate-tax exemption (profit left in the
  company is what the exemption shelters); ask the 세무사 to model a low-salary /
  retain-earnings strategy during the exemption window. Confirm with 세무사.
- Foreign accounts: if the entity ever holds foreign financial accounts (for
  example a foreign-currency payout account abroad) aggregating over the reporting
  threshold (understood to be KRW 500M), 해외금융계좌 신고 (foreign financial
  account reporting) applies. Simplest posture: have Paddle pay out directly to the
  Korean corporate account and hold no foreign accounts. Confirm threshold and
  whether any Paddle balance itself counts. Confirm with 세무사.

### 9.6 Adjacent items the 세무사 or other professionals should sweep

- If the Apple IAP fallback (PRD 7.5) ever activates, Apple functions as a
  commissionaire with different documentation (App Store proceeds, Apple's tax
  treatment per country) and the revenue mapping changes; flag it the day IAP ships.
  Confirm with 세무사.
- R&D tax credit (연구인력개발비 세액공제): a solo dev writing novel software may
  have creditable R&D spend; interaction with the 100% exemption may make it moot
  during the window but valuable after. Confirm with 세무사.
- 벤처기업 확인 (venture enterprise certification) and other startup programs
  (young-entrepreneur loans, TIPS): non-tax benefits that stack with the entity
  choice; a startup-support advisor question rather than purely 세무사.
- Data/privacy law (PIPA) counsel is a separate professional gate handled in
  dossier Section 4, not by the 세무사.

### 9.7 The engagement agenda: questions to put to the 세무사, verbatim

1. Given age {founder's age}, first-time founding, and KSIC code for a consumer
   software subscription service, does the entity qualify for 창업중소기업
   세액감면 at 100%, and which registered-office locations preserve the 100% rate?
   What operational substance must the registered office have?
2. Does 최저한세 (minimum tax) limit the reduction? Does 지방소득세 follow it to
   zero? Is there any cap or employment condition?
3. Corporation vs sole proprietor at projected Year 1 profit of roughly KRW 5M to
   40M/year: which form nets better after all taxes and insurance, given the
   reduction applies to both forms?
4. Are Paddle MoR payouts zero-rated (영세율) for 부가가치세? What evidence chain
   (contract, statements, FX receipts) must be kept? Any reverse-charge (대리납부)
   exposure on foreign SaaS vendors (Anthropic, Clerk, Hetzner)?
5. Any withholding on Paddle payouts under the UK/US treaties, and what forms will
   Paddle request from the entity?
6. Is 통신판매업 신고 required when Paddle is the seller of record?
7. Optimal founder compensation during the exemption window (salary level vs
   retained earnings), including 4대보험 cost at each level.
8. Full compliance calendar for year one: VAT filings, withholding, corporate tax,
   중간예납, and what the monthly retainer covers.
9. If the business relocates or the founder moves during the 5-year window, what
   events claw back the exemption?
10. What changes the day monthly revenue exceeds KRW 10M, 50M, 100M: any new
    obligations, audit thresholds, or external-audit triggers?

Every figure and rule in Section 9, and the tax lines in Section 8, are working
assumptions pending this engagement: confirm with professional.
