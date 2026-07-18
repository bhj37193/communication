import { describe, expect, it } from 'vitest';
import { buildApp } from './app';
import { buildDeps } from './composition';
import { createDb } from './db/client';
import { loadEnv } from './env';

describe('GET /healthz', () => {
  it('returns ok', async () => {
    const env = loadEnv();
    const { db } = createDb(env.DATABASE_URL);
    const app = buildApp(buildDeps(env, db));
    const res = await app.inject({ method: 'GET', url: '/healthz' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toEqual({ ok: true });
  });
});
