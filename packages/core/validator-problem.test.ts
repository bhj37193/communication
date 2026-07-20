// packages/core/validator-problem.test.ts
// Known-answer fixture suite for the Problem-Solving pack, mirroring
// validator.test.ts's style: every signal value asserted explicitly.
import { describe, expect, it } from 'vitest';
import {
  FIX_MARKERS,
  HYPOTHESIS_MARKERS,
  RESTATED_MARKERS,
  TEST_MARKERS,
  computeSignals,
  passes,
  signalValue,
} from './validator-problem';
import { scoreProblem } from './score';
import { ProblemUnitSchema, RubricLineSchema, type ChatMessage } from './schemas';
import pack from './content/problem-solving.dying-plants.json';

const unit = ProblemUnitSchema.parse(pack.unit);
const rubric = RubricLineSchema.array().parse(pack.unit.rubric);

const c = (content: string): ChatMessage => ({ role: 'character', content });
const q = (content: string): ChatMessage => ({ role: 'user', content });

describe('marker lists match content pack conventions', () => {
  it('are non-empty curated constants', () => {
    expect(FIX_MARKERS.length).toBeGreaterThan(0);
    expect(TEST_MARKERS.length).toBeGreaterThan(0);
    expect(HYPOTHESIS_MARKERS.length).toBeGreaterThan(0);
    expect(RESTATED_MARKERS.length).toBeGreaterThan(0);
  });
});

describe('GOOD run: ask before answering, diagnose, name the cause', () => {
  const transcript: ChatMessage[] = [
    c(unit.persona.opener),
    q('When did you first notice your plants starting to look bad?'),
    c('I guess it started sometime after I moved apartments this spring.'),
    q('What changed about your watering after the apartment move?'),
    c("I got new pots because the old ones were ugly, and I've been watering every day to be safe."),
    q("So the problem is you're watering daily into pots with no drainage holes?"),
    c("Yes, exactly! No drainage at all, I've been drowning them."),
    q('My guess is it is because there is no drainage and the water has nowhere to go.'),
  ];
  const warmthTrace = [0, 1, 2, 3];

  it('computes exact known signals', () => {
    const signals = computeSignals(transcript, warmthTrace, unit);
    expect(signals).toEqual({
      clarifying_questions: 3,
      premature_fix: 0,
      hypothesis_stated: 1,
      restated_problem: true,
      test_proposed: 0,
      root_cause_named: 2,
      followups: 4,
      final_warmth: 3,
    });
  });

  it('passes the hard rubric (clarifying_questions >= 3, premature_fix <= 0)', () => {
    const signals = computeSignals(transcript, warmthTrace, unit);
    expect(passes(signals, rubric)).toBe(true);
  });

  it('scores above the base 40', () => {
    const signals = computeSignals(transcript, warmthTrace, unit);
    expect(scoreProblem(signals)).toBeGreaterThan(40);
  });
});

describe('BAD run: fix before facts', () => {
  const transcript: ChatMessage[] = [
    c(unit.persona.opener),
    q('Have you tried giving them more sunlight?'),
  ];
  const warmthTrace = [0];

  it('trips premature_fix and fails the hard gate', () => {
    const signals = computeSignals(transcript, warmthTrace, unit);
    expect(signals.premature_fix).toBe(1);
    expect(signals.clarifying_questions).toBe(0); // fix-marker question doesn't count
    expect(passes(signals, rubric)).toBe(false);
  });
});

describe('test_proposed requires exactly one change_keyword match', () => {
  const unitWithChanges = { ...unit, change_keywords: ['rates', 'tracker'] };

  it('one match counts', () => {
    const transcript: ChatMessage[] = [
      q('Can we compare the weeks before and after you changed your rates?'),
    ];
    expect(computeSignals(transcript, [], unitWithChanges).test_proposed).toBe(1);
  });

  it('two matches in the same message does not count (not isolated)', () => {
    const transcript: ChatMessage[] = [
      q('Can we compare the rates change and the tracker change at once?'),
    ];
    expect(computeSignals(transcript, [], unitWithChanges).test_proposed).toBe(0);
  });
});

describe('signalValue', () => {
  it('maps every ProblemSignals field', () => {
    const s = {
      clarifying_questions: 1,
      premature_fix: 2,
      hypothesis_stated: 3,
      restated_problem: true,
      test_proposed: 4,
      root_cause_named: 5,
      followups: 6,
      final_warmth: 2,
    };
    expect(signalValue(s, 'clarifying_questions')).toBe(1);
    expect(signalValue(s, 'restated_problem')).toBe(1);
    expect(signalValue({ ...s, restated_problem: false }, 'restated_problem')).toBe(0);
    expect(() => signalValue(s, 'nonsense')).toThrow('unknown problem signal');
  });
});
