# FABLE PROMPT: full venture dossier (charisma chat trainer)

Paste into Fable 5 as its own run. It produces the complete venture document: architecture,
data, logic, technical decisions, tax, business model and pricing, unit economics and
projections, the motivation loop, security, privacy and data handling, risk, and unknown
unknowns. The deep technical design already exists in PRD-CHARISMA-CHAT.md and is LOCKED;
this run wraps it into a full business-and-operations plan. Sibling files in the same folder:
PRD-CHARISMA-CHAT.md, PRICING-AND-ECONOMICS.md, CASE-STUDIES.md, COMMUNICATION-PRINCIPLES.md,
MCP-ENGINE-SPEC.md.

---

You are Fable 5, acting as founding engineer, head of product, and CFO for one venture.
Produce a single, complete VENTURE DOSSIER for the app described below. **Make every decision
yourself. Do not ask questions. Where anything is ambiguous, choose the best option and
briefly say why.** Be concrete: real schemas, real numbers, real thresholds, real decisions.
Show your arithmetic on every financial figure. No em-dashes anywhere (use commas, colons,
periods, parentheses). Where a figure depends on a fact you cannot verify (a tax rate, a
store fee), state the assumption explicitly and mark it as needing human confirmation, do not
silently guess.

## The locked foundation (do not redesign, restate at summary level, build on top)

A consumer, text-chat, daily-challenge charisma trainer. "Charisma is a skill. Train it."
Open the app, get one short daily chat challenge with an AI character who warms up only if
you make them feel interesting and goes flat if you perform. Instant feedback, a deterministic
charisma score, a streak. 3 to 5 minutes. Full design, schemas, the deterministic validator,
the score formula, the phased build plan, the voice seam (dormant Phase 1, enabled later by
an API key), and the moat-and-privacy model are in PRD-CHARISMA-CHAT.md. Treat all of it as
fixed. Your dossier references it and does not contradict it.

## Hard constraints (do not change)

- **Hosting: self-hosted VIRTUAL PRIVATE SERVER. No managed cloud, no PaaS, no serverless**
  (no Vercel, Supabase, Railway, Render, Lambda). Self-host the app server, Postgres, workers,
  reverse proxy, TLS, monitoring, and backups on a Hetzner-class VPS with Docker Compose and
  Caddy. Every architecture and cost figure must assume this. State the exact VPS tier and
  monthly euro cost at each scale band (launch, 10k users, 100k users) and how you scale (one
  box, then vertical, then a second box + managed-nothing horizontal split).
- **Stack:** Expo (iOS+Android), Next.js marketing/checkout, Node 22 + TypeScript + Fastify,
  Postgres 16 via Drizzle, no Redis, Claude `claude-haiku-4-5` behind a swappable `ChatModel`,
  Clerk auth, Paddle Billing (Merchant of Record) on web, app login-only.
- **Company:** operated from a Korean young-entrepreneur SME entity; product ships globally in
  English. F-1 immigration is moot (founder resident in Korea).
- **No em-dashes. Privacy-first is non-negotiable** (see PRD Section 9): the moat runs on
  content-free efficacy signal, never on stored conversations.

## Produce ONE structured dossier with these sections

**1. Executive summary.** One page: what it is, who it is for, the wedge (charisma as a
measurable trainable skill), the business in three numbers (price, contribution margin,
break-even subscriber count), and the single biggest risk.

**2. Architecture and technical decisions (summary + the decisions, not a re-derivation).**
Summarize the system from the PRD, then present a decisions table: each major choice (VPS over
PaaS, TS over Python, no-Redis, deterministic validator, MoR over Stripe, Haiku behind an
interface, freemium), the alternative rejected, and the one-line reason. Include the VPS
topology diagram in text and the scale-band plan above.

**3. Data schema and logic.** Reference the PRD data model; do not reprint every table.
Instead give: the entity-relationship overview, the event-sourcing model, the deterministic
validator and score formula restated exactly, and the data-classification table (which fields
are content, skill-state, or content-free efficacy signal, per PRD Section 9.2). This section
must make the privacy architecture legible.

**4. User-data handling and privacy.** The full data lifecycle: what is collected, why, where
it lives, how long, and how it dies. Retention and expiry (transcripts auto-expire 60 days,
incognito, one-tap hard delete), zero-data-retention configuration with the model provider,
the content-free analytics schema, and a GDPR + Korean PIPA (Personal Information Protection
Act) compliance checklist (lawful basis, DSAR/export, deletion, minors, cross-border transfer
given a Korean entity serving global users). Name what needs a privacy counsel review.

**5. Security.** A concrete security plan, using the Anthropic Cybersecurity Skills repo
(https://github.com/mukul975/Anthropic-Cybersecurity-Skills) as the reference library, citing
the specific skills that apply: `conducting-api-security-testing`,
`configuring-oauth2-authorization-flow`, `configuring-tls-1-3-for-secure-communications`,
`auditing-terraform-infrastructure-for-security` (adapt to Docker/Compose),
`configuring-host-based-intrusion-detection`, `analyzing-linux-audit-logs-for-intrusion`, and
`building-incident-response-playbook`. Cover: a STRIDE threat model of the app, OWASP Top 10
for the API, Clerk auth hardening and session/JWT handling, Paddle webhook signature
verification and replay protection, abuse and cost-control (the incognito cost-abuse vector,
rate limits, the global daily-budget circuit breaker), secrets management on a VPS, VPS
hardening (SSH keys only, firewall, fail2ban, host IDS, least-privilege Docker), TLS 1.3,
audit logging, encrypted offsite backups + a tested restore, a one-page incident-response
playbook, and mobile app hardening (no secrets in the bundle, secure token storage,
certificate pinning). Give each item a priority (launch-blocking vs later).

**6. Business model and pricing (decide the numbers).** Recommend the model (freemium) and
the exact prices, with the reasoning and the competitor anchors. State: the free tier (1
challenge/day) and precisely what it includes and withholds; the paid tier monthly price and
annual price and why (name the figure, for example $X.99/month and $Y.99/year, and justify
against Yoodli/Orai/Duolingo-tier anchors and willingness-to-pay); what paid unlocks
(unlimited challenges, score history, character packs); whether to run a trial and which kind;
and a 3-experiment price-testing plan to find the real number post-launch. Do not hedge, pick
the launch price.

**7. Unit economics (show every calculation).** Per active user per month: the two model
touchpoints (about 15 character turns + one feedback/scoring call) with token and cost
math at Haiku pricing and 90% prompt-cache, MoR fees (Paddle percentage + fixed), refund and
failed-payment reserve, and infra allocation (the fixed VPS cost divided across users at each
scale band). Produce: cost per FREE user, cost per PAID user, gross revenue per paid user,
contribution margin per paid user and percentage, LTV at an assumed consumer churn (state it),
and the maximum sustainable CAC for a 1:3 LTV:CAC. Show the free-tier cost as a growth
investment, not a loss, and give the free:paid ratio at which the whole system breaks even.

**8. Financial projection (bear / realistic / bull, 5 years).** For each scenario: paying
subscribers, free users, monthly gross revenue, monthly AI cost, monthly MoR fees, monthly
fixed VPS + infra, monthly net profit, and margin, at years 1, 3, and 5. State the growth
assumption behind each scenario explicitly (organic-only vs some paid vs viral). Include the
Korean corporate-tax line AFTER the young-entrepreneur exemption (Section 9). Make clear which
single variable (subscriber growth) moves the outcome and that margins are structurally stable.

**9. Tax spec (Korea entity, global revenue via a Merchant of Record).** Structure, not
legal advice, with the specific questions for a Korean tax accountant (세무사) flagged as a
human gate. Cover: the young-entrepreneur SME corporate-tax reduction (first-time founders 15
to 34, five years, 100% outside the Seoul over-concentration zone / 50% inside it, so where to
register matters), how a Merchant of Record changes tax handling (Paddle is the seller of
record and remits global VAT/sales tax, so the founder's entity receives B2B-style payouts and
does not chase per-country VAT), Korean VAT/부가가치세 treatment of those payouts and the
registration threshold, corporate registration + business bank account as the gate to any
payout and revenue, and the bookkeeping the entity must keep. Mark every rate and rule as
"confirm with 세무사" rather than asserting it as settled.

**10. The motivation and retention loop (the behavior design).** How the product keeps a user
coming back daily without dark patterns (privacy-first brand forbids manipulation). Design:
the session-one aha, onboarding to first win, the daily loop (challenge -> warmth arc ->
WIN/FIX/MOMENT feedback -> score -> streak), the variable-reward and loss-aversion mechanics
that are honest (streak, score progression, mastery unlocks), the shareable score card as the
viral loop, ethical notification/re-engagement design, and the long-arc progression (skill
tree, spaced review) that gives months of runway. Ground it in CASE-STUDIES.md (Duolingo,
Speak, Character.AI). Explicitly list dark patterns you REFUSE to use and why.

**11. Content safety and age policy (do not skip).** Users will type anything to the AI
character. Define: a safety policy for abusive, sexual, or self-harm user input and the
character's escalation/de-escalation behavior, a crisis-resource response for self-harm
signals, the minimum age and age-gating approach (COPPA and GDPR/PIPA implications for minors),
and how moderation runs WITHOUT breaking the privacy promise (classify transiently, do not
retain content).

**12. Risk register and pre-mortem.** A table of risks (technical, market/distribution,
financial, legal/regulatory, platform-dependency, key-person) with likelihood, impact, and
mitigation. Then a pre-mortem: assume it failed in 18 months, write the three most likely
autopsies and what would have prevented each.

**13. Unknown unknowns.** A deliberate hunt for what the plan has not considered: model-
provider dependency and price/policy shifts, App Store and Play policy risk for an AI chat app
and a login-only reader-model app, content-liability and defamation from AI output, trademark
on the product name, virality assumptions that may not hold, competitor fast-follow, Korean
regulatory surprises, and anything else you surface. For each, the early signal that would tell
you it is becoming real.

**14. Human-gate callouts.** A short list of everything in this dossier that requires a human
or a professional (accountant, privacy counsel, entity incorporation, store accounts, the
go/no-go judgment gates), cross-referenced to the execution plan's gate register.

Decide everything. This dossier plus PRD-CHARISMA-CHAT.md and the execution plan should be a
complete, coherent package: the PRD is HOW it is built, the execution plan is WHO builds what
to which gate, and this dossier is WHAT the business is, what it costs, what it earns, how it
is secured, and how it stays legal and private.
