# Charisma Trainer

## Bootstrap (dev)

```
pnpm install
```

Dev and CI use a native Postgres install (no Docker) — create `charisma` and
`charisma_test` databases locally, then:

```
pnpm --filter @charisma/server db:migrate
pnpm --filter @charisma/server dev
```

Server config lives in `apps/server/.env` (gitignored) — see
`apps/server/src/env.ts` for the full schema. For personal/solo use,
`AUTH_PROVIDER=fake` already skips real auth: any `Authorization: Bearer <id>`
header is trusted as your user id.

## Ops (production deploy)

Deploy artifacts (`Caddyfile`, `docker-compose.yml` prod profile,
`.github/workflows/deploy.yml`) are authored and validate locally, but going
live needs the human-gated infra below (see BUILD-EXECUTION-PLAN.md's gates
table, ~line 1380) — `deploy.yml` no-ops with a clear log message until then.

### Secret placement

- **VPS**: real secrets (`DATABASE_URL`, `ANTHROPIC_API_KEY`, `CLERK_SECRET_KEY`,
  etc.) live in `/opt/charisma/.env` on the server only, never committed.
  `docker compose --profile prod up` reads them from that file's shell
  environment at deploy time.
- **GitHub Actions secrets**: `SSH_HOST`, `SSH_USER`, `SSH_KEY` (G-04) are
  what `deploy.yml` needs to reach the VPS at all. Add them under repo
  Settings → Secrets to enable deploys.

### Backups (restic + Hetzner Storage Box)

1. Provision a Hetzner Storage Box (G-04) and get its SFTP host/user/password.
2. On the VPS, install `restic` and initialize a repo against the box:
   ```
   restic -r sftp:user@host:/backups init
   ```
3. Set `RESTIC_PASSWORD` as a VPS-local env var (not in the repo) and add a
   nightly cron job backing up the `postgres_data` volume (or a `pg_dump`
   piped into `restic backup --stdin`), pruning old snapshots.

Provisioning the box is G-04 (human gate); wiring the actual cron job is part
of P0-29's gated execute half, not the authored artifacts here.

### Uptime monitoring

`uptime-kuma` runs as part of the prod compose profile, exposed on port
3001. After the first deploy, open `http://VPS_IP:3001` once to create the
admin account, then add a monitor hitting `https://api.DOMAIN/healthz`.
