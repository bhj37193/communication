import Fastify from 'fastify';
import type { Deps } from './composition.js';
import { registerMeRoutes } from './routes/me.js';
import { registerSessionRoutes } from './routes/sessions.js';
import { registerWebhookRoutes } from './routes/webhooks.js';

export function buildApp(deps: Deps) {
  const app = Fastify({ logger: false });
  app.get('/healthz', async () => ({ ok: true }));
  registerSessionRoutes(app, deps);
  registerMeRoutes(app, deps);
  registerWebhookRoutes(app, deps);
  return app;
}
