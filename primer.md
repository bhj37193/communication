# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.

## STATUS
FABLE-PROMPT-EMPIRE.md Parts 1-3 done/reconciled. Taxonomy locked
2026-07-19: Communication / Problem-Solving / Critical Thinking /
Decision-Making, all 4 built (no merge/defer). This session: user asked
about `lifeops/ICM` (60/30/10 AI-minimization framework) and whether this
app should minimize AI calls to only where necessary. Verified against
actual code: app already matches the framework. Also cancelled a stale
autopilot state (this session's work is discussion/docs, not code build).
No repo files changed this session besides this primer.
Last updated 2026-07-19.

## COMPLETED THIS SESSION
- Read `/Users/main/Desktop/Archive/projects/lifeops/ICM/{master.md,
  CONTEXT.md,primer.md}` (external project, not this repo) — the ICM/
  SkillOpt/60-30-10 folder-structure-as-agent-architecture synthesis.
- Verified this repo against it: `packages/core/score.ts`/`validator.ts`
  are pure deterministic functions (zero I/O, zero inference, marker/
  regex-based signal extraction). Grepped apps/server/src + apps/mobile/src
  for anthropic/generateText/streamText: only ONE call site exists,
  `AnthropicChatModel`, used for the roleplay conversation itself.
  Mastery gating + event-sourced progress already rule-based.
- Told user: app is already ~95/5 (AI only in the roleplay turn), matching
  ICM's "AI as smallest swappable layer" thesis. No code change needed.
  Flagged (not actioned): validator markers (open_questions/followups/
  reciprocity/spotlight_share/warmth) are a fixed heuristic with a real
  accuracy ceiling — periodically audit against real transcripts. Also:
  keep future features (feedback summaries, onboarding, scenario
  selection) templated/deterministic by default, add AI only if a rule
  can't do it.
- Cancelled stale autopilot state (state_write active:false + skill-active
  cleared) since no code-build phases were actually running.

## EXACT NEXT STEP
No open decisions or pending edits. Waiting on user for what's next —
could be: acting on the validator-audit watch-item above, running
FABLE-PROMPT-PROVEN-PROGRESS.md (still explicitly deferred, "not yet"),
or a new topic. Nothing queued.

## LOCKED DECISIONS
- Repurpose current app/folder, no new app.
- Keep existing engine (mastery gating, deterministic validator/score,
  event-sourced progress) shared across all subjects; do not redesign
  schemas.ts/score.ts/validator.ts contracts.
- Pricing anchors: $14.99/mo avatar, 120-min cap, $119/yr, ~$0.03/min COGS,
  15-min trial at ~$0.45, Paddle ~5%+$0.50, ~4% refund reserve.
- Final skill taxonomy: Communication / Problem-Solving / Critical Thinking
  / Decision-Making — all 4 built, no merge/defer.
- AI-minimization is already the de facto architecture (verified, not just
  aspirational): one LLM call site (roleplay), everything else
  deterministic. No action required to "make this happen" — it's done.

## OUTSTANDING OPS
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) still user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md (HOW-TO-RUN-FABLE.md section 4) queued,
  not run; user said "not yet" — confirm with user before running.

## DOC REFS
FINANCIAL-MODEL-20YR.md | CONTENT-ROADMAP-4-SKILLS.md | FABLE-PROMPT-EMPIRE.md
| HOW-TO-RUN-FABLE.md | PRD-CHARISMA-CHAT.md |
packages/core/{schemas,validator,score}.ts | apps/server/src/model/AnthropicChatModel.ts
| external ref (not this repo): /Users/main/Desktop/Archive/projects/lifeops/ICM/master.md
