import Fastify from 'fastify';
import type { Deps } from './composition.js';
import { registerSessionRoutes } from './routes/sessions.js';

export function buildApp(deps: Deps) {
  const app = Fastify({ logger: false });
  app.get('/healthz', async () => ({ ok: true }));
  registerSessionRoutes(app, deps);
  return app;
}
