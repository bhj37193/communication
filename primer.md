# Primer: Charisma Trainer -> 4-skill Alpha-style platform pivot. Name TBD.

## STATUS
2026-07-19 (later session): FABLE-PROMPT-CURRICULUM-V2.md was executed in
this session. All 7 required inputs read in full, expert-sourcing web
research done (plain search + fetch, per RESEARCH-METHODOLOGY.md), and the
deliverable written: `CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md` (repo root,
verified zero em-dashes). **Done.** No production code changed; only that
new doc and this primer touched. Earlier ralplan/consensus thread is
superseded and closed: the deliverable it was chasing now exists.

## COMPLETED THIS SESSION
`CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md` contains:
- Sec 1: worked non-AI drills per skill (timed written response +
  self-check key, self-attested pass reusing passes_required +
  distinct_days): Communication "Follow-Up Ladder" + recording variant
  (5-min speech, random word, on-device only); Problem-Solving "Five
  Questions Before Any Fix" (bread situation, two-changes hidden key);
  Critical Thinking "Four Lines Against the Pitch" (LinguaLeap ad, 4
  planted flaws, CLAIM/EVIDENCE/GAP/VERDICT); Decision-Making "Close It
  in Five Lines" (car dilemma, OPTIONS/CHOICE/COST/UNKNOWN/TRIPWIRE).
- Sec 2: 8 drill reps per stage (4 drill units x 2 passes) then ONE
  AI-scored scenario capstone; ~89/11 split stated as emergent, no quota.
- Sec 3: clean-room two-pass wall + hard corroboration rule generalized
  to all 4 skills; 3 proposed anchors per skill (PENDING USER REVIEW):
  Comm: Duhigg, Headlee, Van Edwards (rigor caveat flagged);
  PS: Polya, Toyoda/Ohno, Kepner-Tregoe; CT: Sagan, Kahneman,
  Paul & Elder (Rosling spare); DM: Duke, Heath brothers, Klein.
- Sec 4: UnitSchema extension FLAGGED not built (unit_type discriminator,
  drill{prompt_text,timer_seconds,variants,self_check,recording_variant},
  attestation boolean; no persona/rubric/warmth_rules on drill units).
- Sec 5: scope confirmed (no pricing, no cheat-resistance, no all-ages,
  no AI-chat redesign).

## EXACT NEXT STEP
1. User reviews/approves the 12 proposed anchor figures in Sec 3 of
   CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md (only open item on that doc).
2. Then start the flagged engine work: extend packages/core/schemas.ts
   UnitSchema per Sec 4 (additive, base schema untouched), plus serve
   path for drill units. Not yet started.

## LOCKED DECISIONS (carry forward, do not re-litigate)
- 4-skill taxonomy final: Communication, Problem-Solving, Critical
  Thinking, Decision-Making (CONTENT-ROADMAP-4-SKILLS.md).
- Non-AI drill: self-attested pass, existing mastery gate unchanged; no
  new verification signal (v1 accepted).
- Per stage: 8 drill reps (band 6-10) then one AI capstone; split is
  emergent, never a quota mechanism.
- Expert anchors are credibility-directional only, never primary content;
  hard corroboration rule (2+ independent public sources per element).
- No business-model/pricing content in curriculum docs; all-ages deferred.
- Engine/schemas are locked contracts: extend, never redesign. AI stays
  minimized to the scenario capstone call site.

## OUTSTANDING OPS
- App-store tasks #1-4 (Apple Developer, EAS, VPS, Clerk) user-blocked.
- FABLE-PROMPT-PROVEN-PROGRESS.md still deferred, unrelated.

## DOC REFS
CURRICULUM-V2-NON-AI-EXPERT-SOURCING.md | FABLE-PROMPT-CURRICULUM-V2.md |
.omc/specs/deep-interview-curriculum-sourcing-ai-minimization.md |
CONTENT-ROADMAP-4-SKILLS.md | EXTRACTION-META-PROMPT.md |
RESEARCH-METHODOLOGY.md | packages/core/{schemas,validator,score}.ts
