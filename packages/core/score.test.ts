// packages/core/score.test.ts
// Known-answer assertions for the deterministic score (PRD 4.6).
import { describe, expect, it } from 'vitest';
import { SignalDefSchema, type ClaritySignals, type Signals } from './schemas';
import { clarityScore, score } from './score';
import pack from './content/everyday.housewarming-sam.json';

const packDefs = SignalDefSchema.array().parse(pack.signals);

const GOOD: Signals = {
  open_questions: 3,
  followups: 2,
  reciprocity: 2,
  spotlight_share: 0.6,
  interview_mode: false,
  monologue_brag: false,
  final_warmth: 3,
};

const BAD: Signals = {
  open_questions: 0,
  followups: 0,
  reciprocity: 0,
  spotlight_share: 0.2,
  interview_mode: false,
  monologue_brag: true,
  final_warmth: 0,
};

const ZERO: Signals = {
  open_questions: 0,
  followups: 0,
  reciprocity: 0,
  spotlight_share: 0,
  interview_mode: false,
  monologue_brag: false,
  final_warmth: 0,
};

describe('score known answers', () => {
  it('good run: raw 119 clamps to 100', () => {
    expect(score(GOOD)).toBe(100);
  });
  it('bad run: 40 - 20 monologue = 20', () => {
    expect(score(BAD)).toBe(20);
  });
  it('mid-range spot check: 40 + 8 + 10 + 10 + 10 = 78', () => {
    expect(
      score({
        open_questions: 1,
        followups: 1,
        reciprocity: 0,
        spotlight_share: 0.5,
        interview_mode: false,
        monologue_brag: false,
        final_warmth: 2,
      }),
    ).toBe(78);
  });
  it('floor clamps at 0 when both penalties fire on an empty run', () => {
    expect(score({ ...ZERO, interview_mode: true, monologue_brag: true })).toBe(0);
  });
});

describe('caps prevent signal spam', () => {
  it('7 open questions score no more than 3 (question-spam cap)', () => {
    expect(score({ ...ZERO, open_questions: 7 })).toBe(score({ ...ZERO, open_questions: 3 }));
    expect(score({ ...ZERO, open_questions: 3 })).toBe(64);
  });
  it('follow-ups cap at 2, reciprocity caps at 1', () => {
    expect(score({ ...ZERO, followups: 5 })).toBe(score({ ...ZERO, followups: 2 }));
    expect(score({ ...ZERO, reciprocity: 4 })).toBe(score({ ...ZERO, reciprocity: 1 }));
  });
});

describe('spotlight band edges (inclusive)', () => {
  it('0.4 and 0.7 are in band, 0.39 and 0.71 are out', () => {
    expect(score({ ...ZERO, spotlight_share: 0.4 })).toBe(50);
    expect(score({ ...ZERO, spotlight_share: 0.7 })).toBe(50);
    expect(score({ ...ZERO, spotlight_share: 0.39 })).toBe(40);
    expect(score({ ...ZERO, spotlight_share: 0.71 })).toBe(40);
  });
});

describe('weights from pack SignalDefs', () => {
  it('pack weights equal the PRD defaults, so scores agree', () => {
    expect(score(GOOD, packDefs)).toBe(score(GOOD));
    expect(score(BAD, packDefs)).toBe(score(BAD));
  });
  it('overriding one weight moves the score without code changes', () => {
    const tuned = packDefs.map((d) =>
      d.id === 'open_questions' ? { ...d, weight: 0 } : d,
    );
    // Good raw becomes 119 - 24 = 95, below the clamp.
    expect(score(GOOD, tuned)).toBe(95);
  });
});

describe('determinism', () => {
  it('same signals always yield the same score', () => {
    expect(score(GOOD)).toBe(score(GOOD));
    expect(score(BAD)).toBe(score(BAD));
  });
});

// Clarity score known answers (content-library/constraints/clarity-northstar.md).
describe('clarity score known answers', () => {
  const CLARITY_ZERO: ClaritySignals = {
    key_points_share: 0,
    filler_ratio: 0,
    avg_sentence_length: 0,
    hedge_count: 0,
    rambling: false,
    off_topic: false,
  };
  const CLARITY_GOOD: ClaritySignals = {
    key_points_share: 1,
    filler_ratio: 0,
    avg_sentence_length: 15,
    hedge_count: 0,
    rambling: false,
    off_topic: false,
  };
  const CLARITY_BAD: ClaritySignals = {
    key_points_share: 0,
    filler_ratio: 1,
    avg_sentence_length: 40,
    hedge_count: 5,
    rambling: true,
    off_topic: true,
  };

  it('good run: 40 + 35 + 10 = 85', () => {
    expect(clarityScore(CLARITY_GOOD)).toBe(85);
  });

  it('bad run: 40 - 20 - 9 - 15 - 15 clamps to 0', () => {
    expect(clarityScore(CLARITY_BAD)).toBe(0);
  });

  it('mid-range spot check: 40 + 17.5 + 10 - 2 - 3 = 62.5', () => {
    expect(
      clarityScore({
        key_points_share: 0.5,
        filler_ratio: 0.1,
        avg_sentence_length: 15,
        hedge_count: 1,
        rambling: false,
        off_topic: false,
      }),
    ).toBe(62.5);
  });

  it('zero signals score the base 40', () => {
    expect(clarityScore(CLARITY_ZERO)).toBe(40);
  });

  it('hedge_count caps at 3: 5 and 3 score the same', () => {
    expect(clarityScore({ ...CLARITY_ZERO, hedge_count: 5 })).toBe(
      clarityScore({ ...CLARITY_ZERO, hedge_count: 3 }),
    );
    expect(clarityScore({ ...CLARITY_ZERO, hedge_count: 3 })).toBe(31);
  });
});

describe('clarity sentence-length band edges (inclusive)', () => {
  const base: ClaritySignals = {
    key_points_share: 0,
    filler_ratio: 0,
    avg_sentence_length: 0,
    hedge_count: 0,
    rambling: false,
    off_topic: false,
  };
  it('8 and 25 are in band, 7.99 and 25.01 are out', () => {
    expect(clarityScore({ ...base, avg_sentence_length: 8 })).toBe(50);
    expect(clarityScore({ ...base, avg_sentence_length: 25 })).toBe(50);
    expect(clarityScore({ ...base, avg_sentence_length: 7.99 })).toBe(40);
    expect(clarityScore({ ...base, avg_sentence_length: 25.01 })).toBe(40);
  });
});

describe('clarity weights from pack SignalDefs', () => {
  it('overriding one weight moves the score without code changes', () => {
    const defs = SignalDefSchema.array().parse([
      { id: 'key_points_share', kind: 'ratio', description: 'x', weight: 0 },
    ]);
    expect(
      clarityScore(
        { key_points_share: 1, filler_ratio: 0, avg_sentence_length: 15, hedge_count: 0, rambling: false, off_topic: false },
        defs,
      ),
    ).toBe(50);
  });
});

describe('clarity determinism', () => {
  it('same signals always yield the same score', () => {
    const s: ClaritySignals = {
      key_points_share: 0.5,
      filler_ratio: 0.2,
      avg_sentence_length: 12,
      hedge_count: 1,
      rambling: false,
      off_topic: false,
    };
    expect(clarityScore(s)).toBe(clarityScore(s));
  });
});
