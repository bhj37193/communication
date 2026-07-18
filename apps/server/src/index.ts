import { buildApp } from './app.js';
import { buildDeps } from './composition.js';
import { createDb } from './db/client.js';
import { ensureContentSeeded } from './db/seed.js';
import { loadEnv } from './env.js';

const env = loadEnv();
const { db } = createDb(env.DATABASE_URL);
const deps = buildDeps(env, db);
const app = buildApp(deps);

await ensureContentSeeded(db);

app.listen({ port: env.PORT, host: '0.0.0.0' }).catch((err) => {
  app.log.error(err);
  process.exit(1);
});
