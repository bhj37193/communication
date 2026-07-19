# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.

## STATUS
2026-07-19 session: user gave full vision (democratize top-class
education in the 4 locked skills, Alpha School model, no teachers/school,
AI-minimized). Ran /deep-interview to turn it into a spec, then handed off
to /plan --consensus --direct (RALPLAN-DR, non-interactive). Consensus
loop is IN PROGRESS, not done. Stale autopilot state from this session's
earlier interrupted /autopilot invocation was cleared (autopilot never
actually ran any phase; superseded by deep-interview -> plan pivot).
`ralplan` state is the only one still legitimately active. No production
code changed; only .omc/specs/, .omc/state/, and this primer touched.

## EXACT NEXT STEP
Resume the ralplan consensus loop (state: .omc/state/ralplan-state.json,
phase="planner"). Background agent `aa0818c48d89d8df1` (Planner, opus)
was asked to produce the full RALPLAN-DR plan text (it twice returned a
bare "Done." stub instead of content; resumed via SendMessage asking for
the actual plan) — check for its notification/output first. Once the
Planner's real plan text lands: run Architect review
(Task subagent_type="oh-my-claudecode:architect", sequential, wait for
completion), then Critic (subagent_type="oh-my-claudecode:critic"),
loop up to 5 iterations on rejection, then write final plan + ADR to
`.omc/plans/`, mark `pending approval`, call
`state_write(mode="ralplan", active=false)`, stop (non-interactive mode:
no auto-execution). NOTE: subagents in this session have repeatedly
returned stub confirmations ("Done.", "Research complete") instead of
real output — if it recurs, resume via SendMessage to the agentId, or do
the step inline instead of delegating.

## LOCKED DECISIONS (this session, from deep-interview spec)
Spec: `.omc/specs/deep-interview-curriculum-sourcing-ai-minimization.md`
(ambiguity 17%, PASSED). New ground locked:
- Non-AI drill unit type (new, alongside existing AI-chat unit type):
  pass = self-attested completion, reusing existing mastery gate
  (passes_required + distinct_days) unchanged.
- Drill format: structured timed written response + self-check answer
  key, standardized across all 4 skills; Communication may also use a
  recording variant (e.g. 5-min speech off a random-word prompt).
- Per mastery stage: several non-AI drills first, then ONE AI-scored
  scenario chat as capstone check before the gate opens (produces the
  ~90/10 non-AI/AI split as an emergent property, not an enforced quota).
- Expert sourcing: Fable researches (web search, no scraper/API) and
  proposes 1-3 named public figures per skill as credibility anchors;
  actual content stays canon-based/clean-room (generalizes
  EXTRACTION-META-PROMPT.md's pattern, currently public-speaking-only,
  across all 4 skills). No single-guru dependency.
- No business-model content in the new FABLE-PROMPT; no all-ages rollout
  design (deferred); no cheat-resistance for self-attested drills (v1
  accepted limitation).
- Prior locks unchanged: repurpose existing app, keep engine/schemas as
  locked contracts (extend never redesign), 4-skill taxonomy final, AI
  already minimized to one call site (roleplay), pricing anchors from
  AVATAR-TIER-PRICING.md.

## OUTSTANDING OPS
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) still user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md still deferred ("not yet"), unrelated to
  this thread.

## DOC REFS
.omc/specs/deep-interview-curriculum-sourcing-ai-minimization.md |
CONTENT-ROADMAP-4-SKILLS.md | FABLE-PROMPT-EMPIRE.md |
EXTRACTION-META-PROMPT.md | RESEARCH-METHODOLOGY.md |
ALPHA-MODEL-ANALYSIS.md | packages/core/{schemas,validator,score}.ts
