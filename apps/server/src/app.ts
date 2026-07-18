import Fastify from 'fastify';

export function buildApp() {
  const app = Fastify({ logger: false });
  app.get('/healthz', async () => ({ ok: true }));
  return app;
}
