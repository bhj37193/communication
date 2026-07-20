// packages/core/validator-problem.ts
// Problem-Solving pack validator (CONTENT-ROADMAP-4-SKILLS.md §1.2, §2.2).
// Additive sibling to validator.ts: reuses its classifiers/helpers, adds only
// what's genuinely new for this pack. validator.ts's own exports are untouched.
import type { ChatMessage } from './schemas';
import type { ProblemSignals } from './schemas';
import { isFollowup, isQuestion } from './validator';

// Pack-level curated marker lists (§1.2, the OPEN_STARTERS pattern): shipped
// constants, mirrored in the pack JSON, test-asserted identical.
export const FIX_MARKERS: readonly string[] = [
  'you should',
  'have you tried',
  'try ',
  'just do',
  'the fix',
  "why don't you",
];
export const TEST_MARKERS: readonly string[] = [
  'for a month',
  'for a few weeks',
  'compare',
  'check whether',
  'before you cut',
  'measure',
];
export const HYPOTHESIS_MARKERS: readonly string[] = [
  'my guess is',
  "i think it's because",
  'it might be that',
];
// ponytail: exact stage-2 marker text was garbled in the source excerpt;
// this is a reasonable reading of "so the problem is" / "so what's really
// going on" restatement phrasing, upgrade if real transcripts miss it.
export const RESTATED_MARKERS: readonly string[] = [
  'so the problem is',
  "so what's really going on",
  "so what's actually going on",
];

function containsAny(lower: string, markers: readonly string[]): boolean {
  return markers.some((m) => {
    const escaped = m.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`).test(lower);
  });
}

export interface ProblemUnitKeywords {
  root_cause_keywords: readonly string[];
  change_keywords: readonly string[];
}

export function computeSignals(
  transcript: ChatMessage[],
  warmthTrace: number[],
  unit: ProblemUnitKeywords,
): ProblemSignals {
  let clarifying_questions = 0;
  let premature_fix = 0;
  let hypothesis_stated = 0;
  let restated_problem = false;
  let test_proposed = 0;
  let root_cause_named = 0;
  let followups = 0;
  let prevCharacter: string | undefined;

  transcript.forEach((m) => {
    if (m.role === 'character') {
      prevCharacter = m.content;
      return;
    }
    const lower = m.content.toLowerCase();
    const hasFixMarker = containsAny(lower, FIX_MARKERS);

    if (isQuestion(m.content) && !hasFixMarker) clarifying_questions += 1;
    if (hasFixMarker) premature_fix += 1;
    if (containsAny(lower, HYPOTHESIS_MARKERS)) hypothesis_stated += 1;
    if (
      containsAny(lower, RESTATED_MARKERS) &&
      isFollowup(m.content, prevCharacter)
    ) {
      restated_problem = true;
    }
    if (containsAny(lower, TEST_MARKERS)) {
      const changeHits = unit.change_keywords.filter((k) => lower.includes(k.toLowerCase()));
      if (changeHits.length === 1) test_proposed += 1;
    }
    if (unit.root_cause_keywords.some((k) => lower.includes(k.toLowerCase()))) {
      root_cause_named += 1;
    }
    if (isFollowup(m.content, prevCharacter)) followups += 1;
  });

  return {
    clarifying_questions,
    premature_fix,
    hypothesis_stated,
    restated_problem,
    test_proposed,
    root_cause_named,
    followups,
    final_warmth: warmthTrace.length === 0 ? 0 : warmthTrace[warmthTrace.length - 1]!,
  };
}

export function signalValue(s: ProblemSignals, id: string): number {
  switch (id) {
    case 'clarifying_questions':
      return s.clarifying_questions;
    case 'premature_fix':
      return s.premature_fix;
    case 'hypothesis_stated':
      return s.hypothesis_stated;
    case 'restated_problem':
      return s.restated_problem ? 1 : 0;
    case 'test_proposed':
      return s.test_proposed;
    case 'root_cause_named':
      return s.root_cause_named;
    case 'followups':
      return s.followups;
    case 'final_warmth':
      return s.final_warmth;
    default:
      throw new Error(`unknown problem signal: ${id}`);
  }
}

// Same band-check shape as validator.ts's passes(); duplicated per pack
// rather than generalized, matching the existing per-pack pattern (§2.2).
export function passes(
  s: ProblemSignals,
  rubric: Array<{ signal_id: string; band: { min?: number; max?: number }; hard: boolean }>,
): boolean {
  return rubric
    .filter((line) => line.hard)
    .every((line) => {
      const v = signalValue(s, line.signal_id);
      return (
        (line.band.min === undefined || v >= line.band.min) &&
        (line.band.max === undefined || v <= line.band.max)
      );
    });
}
