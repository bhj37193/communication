// setInterval runner(s). Started by index.ts only, never by tests (tests
// call the retention service functions directly against a fixed `now`).
import type { Db } from '../db/client.js';
import { runRetentionSweep } from '../services/retention.js';

const SWEEP_INTERVAL_MS = 60 * 60 * 1000;

export function startScheduler(db: Db): NodeJS.Timeout {
  return setInterval(() => {
    runRetentionSweep(db, new Date()).catch((err: unknown) => {
      console.error('retention sweep failed', err);
    });
  }, SWEEP_INTERVAL_MS);
}
