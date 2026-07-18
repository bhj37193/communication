import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.js';

export type Db = ReturnType<typeof drizzle<typeof schema>>;

export function createDb(databaseUrl: string): { db: Db; pool: Pool } {
  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool, { schema });
  return { db, pool };
}
