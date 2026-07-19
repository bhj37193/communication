// Pure fold over progress_events into per-skill mastery status (SD-8: rebuildable
// from the append-only event log, no DB access here).
import { localDate } from './caps.js';
import type { progressEvents } from '../db/schema.js';

export function foldProgress(
  events: (typeof progressEvents.$inferSelect)[],
  mastery: { passes_required: number; distinct_days: boolean },
  userTz: string,
  now: Date, // eslint-disable-line @typescript-eslint/no-unused-vars -- unused in Phase 1; review-scheduling (out of scope) will need it
): { status: 'unlocked' | 'in_progress' | 'mastered'; passes: number; lastPassDate: string | null } {
  const passEvents = events.filter((ev) => ev.type === 'unit_passed');
  const passes = passEvents.length;
  const passDates = passEvents.map((ev) => localDate(userTz, ev.createdAt));
  const distinctPassDates = new Set(passDates);
  const lastPassDate = passDates.length > 0 ? passDates.reduce((max, d) => (d > max ? d : max)) : null;

  const mastered = mastery.distinct_days
    ? distinctPassDates.size >= mastery.passes_required
    : passes >= mastery.passes_required;

  const status = mastered ? 'mastered' : passes >= 1 ? 'in_progress' : 'unlocked';

  return { status, passes, lastPassDate };
}
