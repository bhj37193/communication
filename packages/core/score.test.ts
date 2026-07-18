// packages/core/score.test.ts
// Known-answer assertions for the deterministic score (PRD 4.6).
import { describe, expect, it } from 'vitest';
import { SignalDefSchema, type Signals } from './schemas';
import { score } from './score';
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
