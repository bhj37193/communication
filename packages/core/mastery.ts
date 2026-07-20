// packages/core/mastery.ts
// The 0-10 mastery-level display (CONTENT-ROADMAP-4-SKILLS.md §2.3).
// A pure, read-time-computed function over the existing mastery-gate fold
// (Unit.mastery.passes_required/distinct_days, §2.1) -- no new schema field,
// no new event type, no stored column. Per skill, never blended across
// skills (§0.2's no-merge principle).
//
// 0 = no unit_state row yet (before the entry-point unit).
// 1-6 = highest stage whose gate is satisfied, one level per authored stage
//   in that skill's 6-stage progression (Section 1.x), in order.
// 7-10 = declared headroom, not curriculum: no stage 7-10 exists yet for any
//   skill, so this caps at 6 until such content ships.
export function masteryLevel(
  orderedStageSkillIds: readonly string[],
  masteredSkillIds: ReadonlySet<string>,
): number {
  let level = 0;
  for (const id of orderedStageSkillIds) {
    if (!masteredSkillIds.has(id)) break;
    level += 1;
  }
  return Math.min(level, 6);
}
