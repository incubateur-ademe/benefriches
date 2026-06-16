# Multi-stage build for production-like Node API
#
# Caching strategy:
# The dependency install is split off from the source copy. We COPY only the
# dependency *manifests* (package.json files + lockfile + workspace config),
# run `pnpm install`, and ONLY THEN copy application source. As a result the
# expensive install layer stays cached until a manifest or the lockfile changes,
# instead of being invalidated by every source edit (the previous behaviour).
#
# pnpm version is NOT pinned here: corepack activates the version declared in the
# root package.json `packageManager` field, matching CI/local

# Base stage with Node.js and pnpm (via corepack, version from packageManager)
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Enable corepack; the pnpm version is resolved from package.json `packageManager`
RUN corepack enable
WORKDIR /app
COPY package.json ./
RUN corepack install

# Dependencies stage - install all (dev+prod) dependencies.
# Only manifests are copied here so this layer is cache-stable across source edits.
FROM base AS dev-deps
# Workspace manifests + lockfile + workspace config (pnpm needs every workspace
# package.json present to satisfy --frozen-lockfile).
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
# .tooling holds tsconfig.base.json, extended by packages/shared during its build.
COPY .tooling ./.tooling/
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/api/package.json ./apps/api/package.json
# Install only the projects present on disk (root + shared + api). Absent
# importer dirs (apps/web, apps/e2e-tests) are simply not enumerated by pnpm,
# so --frozen-lockfile validates fine against the superset lockfile.
# The cache mount keeps the pnpm content-addressable store warm across LOCAL
# rebuilds (no-op on GitHub Actions runners; the durable CI win is the
# manifest-first layer ordering staying cache-stable across source edits).
# `api...`: the trailing `...` selects the api package AND its workspace
# dependencies (shared) — and installs shared's devDeps (tsdown) too, so the
# build stage's `pnpm --filter shared build` has its build tooling.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=api...

# Build stage - build shared package and API from source.
FROM dev-deps AS build
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api
# Build shared first (api depends on packages/shared/dist), then the API.
RUN pnpm --filter shared build && pnpm --filter=api build

# Runtime stage
FROM base AS runtime

WORKDIR /app

# node_modules (incl. the shared workspace symlink) come from the deps stage.
COPY --from=dev-deps /app/node_modules ./node_modules
COPY --from=dev-deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=dev-deps /app/apps/api/node_modules ./apps/api/node_modules

# Built shared package (resolved at runtime via apps/api/node_modules/shared symlink).
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/

# Built API.
COPY --from=build /app/apps/api/dist ./apps/api/dist

# Data files (CSV) consumed by seeds + carbon-storage/city-stats features.
COPY apps/api/data ./apps/api/dist/data

# API package.json for workspace + script (pnpm knex:migrate-latest:js) resolution.
COPY --from=build /app/apps/api/package.json ./apps/api/

# Workspace files for pnpm script resolution at runtime.
COPY package.json pnpm-workspace.yaml ./

# Entrypoint runs `pnpm knex:migrate-latest:js` (knex/pg/dotenv are prod deps;
# the compiled knexfile.js is used, so no ts-node/tsx needed) then `node dist/src/main.js`.
COPY apps/api/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

WORKDIR /app/apps/api

EXPOSE 4001

ENTRYPOINT ["/docker-entrypoint.sh"]
