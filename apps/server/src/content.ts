// Loads the one Phase-0 content pack (Sam/housewarming) and validates it
// against packages/core's own schemas, so a JSON edit that drifts from what
// the validator/score functions expect fails fast at import time.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { SignalDefSchema, UnitSchema } from '@charisma/core/schemas';

const PackSchema = z.object({
  pack_id: z.string().min(1),
  version: z.string().min(1),
  signals: z.array(SignalDefSchema),
  unit: UnitSchema,
});

const __dirname = dirname(fileURLToPath(import.meta.url));
const raw: unknown = JSON.parse(
  readFileSync(
    join(__dirname, '../../../packages/core/content/everyday.housewarming-sam.json'),
    'utf-8',
  ),
);

export const SAM_PACK = PackSchema.parse(raw);
export const SAM_UNIT_ID = SAM_PACK.unit.id;
