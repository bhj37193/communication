// packages/core/mastery.test.ts
import { describe, expect, it } from 'vitest';
import { masteryLevel } from './mastery';

const stages = ['s1', 's2', 's3', 's4', 's5', 's6'];

describe('masteryLevel', () => {
  it('0 when nothing mastered yet', () => {
    expect(masteryLevel(stages, new Set())).toBe(0);
  });
  it('counts the sequential run of mastered stages', () => {
    expect(masteryLevel(stages, new Set(['s1', 's2', 's3']))).toBe(3);
  });
  it('a gap stops the count, does not skip ahead to a later stage', () => {
    expect(masteryLevel(stages, new Set(['s1', 's3']))).toBe(1);
  });
  it('caps at 6 even if more stage ids were somehow passed in', () => {
    expect(masteryLevel([...stages, 's7', 's8'], new Set([...stages, 's7', 's8']))).toBe(6);
  });
  it('is per-skill: an unrelated skill id mastered does not count', () => {
    expect(masteryLevel(stages, new Set(['other-skill.stage1']))).toBe(0);
  });
});
