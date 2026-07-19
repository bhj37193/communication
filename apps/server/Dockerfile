# Build context is the repo root (pnpm workspace); see docker-compose.yml's
# `build.context: .` for the api service.
FROM node:22-slim

RUN corepack enable && corepack prepare pnpm@11 --activate

WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml tsconfig.base.json ./
COPY packages/core packages/core
COPY apps/server apps/server

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/server
EXPOSE 3000

# ponytail: no compiled build step exists yet (dev/CI both run via tsx). Runs
# straight from source; switch to a compiled dist/index.js if cold-start time
# or image size ever matters.
CMD ["pnpm", "exec", "tsx", "src/index.ts"]
