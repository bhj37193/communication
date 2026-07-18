// packages/core/score.ts
// Deterministic score, exactly PRD-CHARISMA-CHAT.md Section 4.6:
// score = clamp(0, 100,
//   40
//   + 8  * min(open_questions, 3)
//   + 10 * min(followups, 2)
//   + 10 * min(reciprocity, 1)
//   + 10 * (spotlight_share in [0.4, 0.7] ? 1 : 0)
//   + 5  * final_warmth
//   - 20 * interview_mode
//   - 20 * monologue_brag)
// Weights live in the pack's SignalDefs (penalties carry negative weights);
// when defs are omitted the PRD defaults apply. Same transcript, same score.
import type { SignalDef, Signals } from './schemas';

export function clamp(min: number, max: number, v: number): number {
  return Math.min(max, Math.max(min, v));
}

const DEFAULT_WEIGHTS: Record<string, number> = {
  open_questions: 8,
  followups: 10,
  reciprocity: 10,
  spotlight_share: 10,
  final_warmth: 5,
  interview_mode: -20,
  monologue_brag: -20,
};

export function score(signals: Signals, defs?: SignalDef[]): number {
  const w = (id: string): number =>
    defs?.find((d) => d.id === id)?.weight ?? DEFAULT_WEIGHTS[id] ?? 0;
  // Band is inclusive on both edges (stricter reading of "in [0.4, 0.7]").
  const spotlightInBand =
    signals.spotlight_share >= 0.4 && signals.spotlight_share <= 0.7 ? 1 : 0;
  return clamp(
    0,
    100,
    40 +
      w('open_questions') * Math.min(signals.open_questions, 3) +
      w('followups') * Math.min(signals.followups, 2) +
      w('reciprocity') * Math.min(signals.reciprocity, 1) +
      w('spotlight_share') * spotlightInBand +
      w('final_warmth') * signals.final_warmth +
      w('interview_mode') * (signals.interview_mode ? 1 : 0) +
      w('monologue_brag') * (signals.monologue_brag ? 1 : 0),
  );
}
