// Wraps the SECURITY DEFINER delete_user_data(uuid) fn (SD-8): atomic
// hard-delete across results/transcripts/sessions/progress_events/
// analytics_events/daily_usage/user_skill_state/entitlements/users.
import { sql } from 'drizzle-orm';
import type { Db } from '../db/client.js';

export async function deleteUserData(db: Db, userId: string): Promise<void> {
  await db.execute(sql`select delete_user_data(${userId}::uuid)`);
}
