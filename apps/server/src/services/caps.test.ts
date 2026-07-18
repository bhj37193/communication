import { describe, expect, it } from 'vitest';
import { computeSpendUsd, dailyCapExceeded, localDate } from './caps.js';

describe('localDate', () => {
  it('renders an ISO date in the given timezone', () => {
    expect(localDate('UTC', new Date('2026-07-18T12:00:00Z'))).toBe('2026-07-18');
  });
  it('rolls over to the previous day west of UTC near midnight', () => {
    expect(localDate('America/Los_Angeles', new Date('2026-07-18T03:00:00Z'))).toBe('2026-07-17');
  });
});

describe('dailyCapExceeded', () => {
  it('free tier allows exactly one scored session per day', () => {
    expect(dailyCapExceeded(0)).toBe(false);
    expect(dailyCapExceeded(1)).toBe(true);
  });
});

describe('computeSpendUsd', () => {
  it('prices tokens at Haiku input/output rates', () => {
    expect(computeSpendUsd([{ tokensIn: 1_000_000, tokensOut: 1_000_000 }])).toBeCloseTo(6, 6);
  });
  it('sums across multiple rows', () => {
    const usd = computeSpendUsd([
      { tokensIn: 500_000, tokensOut: 0 },
      { tokensIn: 500_000, tokensOut: 200_000 },
    ]);
    expect(usd).toBeCloseTo(2, 6);
  });
});
