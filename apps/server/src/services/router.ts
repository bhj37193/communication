// Picks the single next unit to serve (PRD INV-7: no catalog/list endpoint,
// client never specifies a unit). PRD 3.2 order is reviews-due -> in-progress
// skill -> next-unlocked-in-canonical-order, but only one skill/unit is ever
// seeded right now (apps/server/src/db/seed.ts), so this degenerates to
// "return the single seeded unit" until more content exists.
import { eq } from 'drizzle-orm';
import type { Deps } from '../composition.js';
import { skills, units } from '../db/schema.js';
import { type Unit, UnitSchema } from '@charisma/core/schemas';

export async function routeNextUnit(deps: Deps, userId: string): Promise<{ unitId: string; skillId: string }> {
  // ponytail: reviews-due branch intentionally absent this phase (foldProgress
  // never sets review_box/review_due_at yet, so there's nothing to query).
  //
  // Independent of user_skill_state on purpose: a user with zero rows there
  // must still be eligible, not locked. With only one unit ever seeded, every
  // user gets that same unit regardless of prior state.
  const [row] = await deps.db.select().from(units).innerJoin(skills, eq(units.skillId, skills.id));
  if (!row) throw new Error('no unit available');
  // Mastered users get the same unit back too (edge case): nothing else to serve while reviews are deferred.
  return { unitId: row.units.id, skillId: row.skills.id };
}

export async function loadUnitSpec(deps: Deps, unitId: string): Promise<Unit> {
  const [row] = await deps.db.select().from(units).where(eq(units.id, unitId));
  if (!row) throw new Error(`unit not found: ${unitId}`);
  return UnitSchema.parse(row.spec);
}
