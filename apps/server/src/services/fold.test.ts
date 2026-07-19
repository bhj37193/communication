import { describe, expect, it } from 'vitest';
import { foldProgress } from './fold.js';
import type { progressEvents } from '../db/schema.js';

type Event = typeof progressEvents.$inferSelect;

function passEvent(seq: number, createdAt: string): Event {
  return { seq, userId: 'u1', type: 'unit_passed', payload: {}, createdAt: new Date(createdAt) };
}

const mastery = { passes_required: 2, distinct_days: true };
const tz = 'America/New_York';
const now = new Date('2026-07-19T00:00:00Z');

describe('foldProgress', () => {
  it('one pass is in_progress, not mastered', () => {
    const events = [passEvent(1, '2026-07-18T14:00:00Z')];
    expect(foldProgress(events, mastery, tz, now)).toEqual({
      status: 'in_progress',
      passes: 1,
      lastPassDate: '2026-07-18',
    });
  });

  it('two passes on the same local day stay in_progress (passes alone is not sufficient)', () => {
    const events = [passEvent(1, '2026-07-18T14:00:00Z'), passEvent(2, '2026-07-18T20:00:00Z')];
    const result = foldProgress(events, mastery, tz, now);
    expect(result.passes).toBe(2);
    expect(result.status).toBe('in_progress');
  });

  it('two passes on distinct local days become mastered', () => {
    const events = [passEvent(1, '2026-07-18T14:00:00Z'), passEvent(2, '2026-07-19T14:00:00Z')];
    const result = foldProgress(events, mastery, tz, now);
    expect(result.passes).toBe(2);
    expect(result.status).toBe('mastered');
    expect(result.lastPassDate).toBe('2026-07-19');
  });

  it('distinct UTC dates that share the same NY local date count as one day', () => {
    const events = [passEvent(1, '2026-07-19T03:00:00Z'), passEvent(2, '2026-07-18T23:00:00Z')];
    const result = foldProgress(events, mastery, tz, now);
    expect(result.passes).toBe(2);
    expect(result.status).toBe('in_progress');
  });
});
