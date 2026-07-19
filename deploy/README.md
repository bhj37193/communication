# Deploying apps/server to a plain Ubuntu VPS

No Docker, no build step - the server runs via `tsx` in production exactly
like it does in dev, because this repo has no `build` script (only
`typecheck`). Native Postgres 18, matching local dev/CI convention (see
root `primer.md`).

## Known blocker - read this first

`apps/server/src/composition.ts:26-31` throws at startup if
`NODE_ENV=production` and `AUTH_PROVIDER=fake`, and *also* throws if
`AUTH_PROVIDER=clerk` because `ClerkAuthVerifier` doesn't exist yet (only
`FakeAuthVerifier` is implemented). **The server cannot boot with
`NODE_ENV=production` until real Clerk auth ships.** Steps below still get
everything else (Postgres, systemd unit, Caddy/TLS) ready to go; you'll hit
this the moment you `systemctl start charisma-server` with
`NODE_ENV=production`. Either finish `ClerkAuthVerifier` first, or knowingly
run with `NODE_ENV=development` in the meantime (this also disables the
`CORS_ORIGINS` allowlist - dev mode reflects any origin).

## 1. Install Node

No `.nvmrc` / `engines` field is pinned in this repo; `@types/node` is
`^22.10.0` and the machine this was authored on runs Node v22.14.0 (LTS) -
assumption: install Node 22.x. Use NodeSource so `node` is on the system
PATH (the systemd unit needs this, not an nvm-only path):

```
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
```

## 2. Install pnpm

```
sudo corepack enable
corepack prepare pnpm@latest --activate
pnpm --version
```

## 3. Install Postgres 18 natively

Ubuntu's own repos lag upstream Postgres releases; use the PGDG apt repo:

```
sudo apt-get install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh -y
sudo apt-get install -y postgresql-18
sudo systemctl enable --now postgresql
```

## 4. Create the database and app role

The migration itself creates the `charisma_app` role (see
`apps/server/src/db/migrations/0000_init.sql`), so you only need to create
the database first, then run the migration as a superuser via the local
peer-auth socket (no TCP/password setup needed for this one-time step):

```
sudo -u postgres createdb charisma
sudo -u postgres psql -d charisma -f /opt/charisma/apps/server/src/db/migrations/0000_init.sql
```

(Run this after step 6, once the repo is cloned to `/opt/charisma`.)

The app connects over TCP (`node-postgres` doesn't use unix sockets), as
`charisma_app`, which has no password. Default Ubuntu Postgres rejects that
over TCP (`scram-sha-256`). Add a `trust` line for local-only connections in
`/etc/postgresql/18/main/pg_hba.conf` (above the existing `host` lines),
matching local dev convention - Postgres already only listens on
`localhost` by default and step 8's firewall keeps 5432 off the public
interface, so this is local-only, not internet-facing:

```
host    charisma    charisma_app    127.0.0.1/32    trust
```

Then: `sudo systemctl restart postgresql`.

## 5. Create a dedicated service user

```
sudo useradd --system --no-create-home --shell /usr/sbin/nologin charisma
sudo mkdir -p /opt/charisma
sudo chown charisma:charisma /opt/charisma
```

## 6. Clone the repo and install dependencies

```
sudo -u charisma git clone <your-repo-url> /opt/charisma
cd /opt/charisma
sudo -u charisma pnpm install
```

Full `pnpm install`, not `--prod` - `tsx` is a devDependency and is what
actually runs the server (see the blocker note above re: no build step).
Pruning devDependencies breaks the systemd unit's `ExecStart`.

Now go back and run step 4's migration command.

## 7. Configure environment

```
sudo cp deploy/.env.example /opt/charisma/apps/server/.env
sudo chown charisma:charisma /opt/charisma/apps/server/.env
sudo chmod 600 /opt/charisma/apps/server/.env
sudo -u charisma nano /opt/charisma/apps/server/.env
```

Fill in `ANTHROPIC_API_KEY`, `CLERK_WEBHOOK_SECRET`, `CORS_ORIGINS`, and
resolve the known blocker above before setting `NODE_ENV=production`. Var
names are documented in `deploy/.env.example`.

## 8. Install the systemd unit

```
sudo cp deploy/charisma-server.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now charisma-server
sudo systemctl status charisma-server
```

## 9. Install Caddy and the reverse proxy

```
sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https curl
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt-get update
sudo apt-get install -y caddy
```

Edit `deploy/Caddyfile` to replace `api.YOURDOMAIN.com` with the real
subdomain, then:

```
sudo cp deploy/Caddyfile /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

DNS for that subdomain must point at the VPS before Caddy can get a TLS
cert - it requests one automatically on first request.

## 10. Open the firewall

Only 80/443 should be public - the app binds `0.0.0.0:3000` directly
(hardcoded in `apps/server/src/index.ts`), so the firewall, not app config,
is what keeps port 3000 off the public interface.

```
sudo ufw allow OpenSSH   # do this before enabling ufw, or you'll lock yourself out
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Verify

```
curl https://api.YOURDOMAIN.com/healthz
```
