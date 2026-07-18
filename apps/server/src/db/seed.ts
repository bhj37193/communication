// Idempotent seed for the FK chain sessions.unit_id -> units.id -> skills.id
// -> skill_packs.pack_id. No content-loader pipeline exists yet (out of scope
// here); this just inserts the one Phase-0 pack/skill/unit row on boot.
import type { Db } from './client.js';
import { skillPacks, skills, units } from './schema.js';
import { SAM_PACK } from '../content.js';

export async function ensureContentSeeded(db: Db): Promise<void> {
  await db.insert(skillPacks)
    .values({ packId: SAM_PACK.pack_id, version: SAM_PACK.version })
    .onConflictDoNothing();
  await db.insert(skills)
    .values({
      id: SAM_PACK.unit.skill_id,
      packId: SAM_PACK.pack_id,
      name: SAM_PACK.unit.skill_id,
      objective: SAM_PACK.unit.principle,
    })
    .onConflictDoNothing();
  await db.insert(units)
    .values({ id: SAM_PACK.unit.id, skillId: SAM_PACK.unit.skill_id, spec: SAM_PACK.unit })
    .onConflictDoNothing();
}
