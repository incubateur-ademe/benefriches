# Multi-stage build for production-like webapp with nginx
#
# Caching strategy:
# The dependency install is split off from the source copy. We COPY only the
# dependency *manifests* (package.json files + lockfile + workspace config) PLUS
# the minimal web files that the `copy-dsfr-to-public` postinstall hard-requires
# (apps/web/index.html, apps/web/embed.html and the tracked apps/web/public/),
# run `pnpm install`, and ONLY THEN copy the rest of the source. As a result the
# expensive install layer stays cached until a manifest/lockfile/index.html/public
# changes, instead of being invalidated by every src/ edit (the previous behaviour).
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

# Dependencies stage - install all dependencies.
# Manifests + the minimal web inputs the web postinstall needs are copied here so
# this layer is cache-stable across src/ edits.
FROM base AS deps
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
# .tooling holds tsconfig.base.json, extended by packages/shared during its build.
COPY .tooling ./.tooling/
COPY packages/shared/package.json ./packages/shared/package.json
COPY apps/web/package.json ./apps/web/package.json
# Required by web's `copy-dsfr-to-public` postinstall: it asserts an index.html
# exists at the project dir and writes generated assets into apps/web/public/dsfr.
# embed.html is the secondary HTML entry; public/ carries tracked static assets.
COPY apps/web/index.html apps/web/embed.html ./apps/web/
COPY apps/web/public ./apps/web/public/
# Install only the projects present on disk (root + shared + web). The web
# postinstall (copy-dsfr-to-public) runs here and populates apps/web/public/dsfr.
# The cache mount keeps the pnpm store warm for LOCAL rebuilds (no-op on gha;
# the durable CI win is the manifest-first layer ordering being cache-stable).
# `web...`: the trailing `...` selects the web package AND its workspace
# dependencies (shared) — and installs shared's devDeps too, so the build
# stage's `pnpm --filter shared build` has its build tooling.
RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter=web...

# Build stage - build shared package and webapp from source.
FROM deps AS build
# Bring in source on top of the installed node_modules + generated public/dsfr.
# packages/shared is copied whole; apps/web src is layered over the deps stage,
# preserving the generated apps/web/public/dsfr produced by postinstall above.
COPY packages/shared ./packages/shared
COPY apps/web/src ./apps/web/src
COPY apps/web/vite.config.ts apps/web/tsconfig*.json ./apps/web/
# Build shared first (web depends on packages/shared/dist), then the webapp.
# `pnpm --filter web build` self-runs the prebuild `react-dsfr update-icons`,
# which crawls the full web source to patch icons.css (needs source present here).
RUN pnpm --filter shared build && pnpm --filter=web build

# Runtime stage with nginx (no node/pnpm needed).
FROM nginx:alpine AS runtime-nginx

# Built static files (incl. /dsfr assets) to nginx html dir.
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# nginx configurations.
# Main config based on Scalingo's buildpack.
COPY apps/web/nginx.conf /etc/nginx/nginx.conf
# Site config template (from Scalingo). Re-included past the **/scalingo
# .dockerignore rule via the `!apps/web/scalingo/nginx.conf.erb` negation.
COPY apps/web/scalingo/nginx.conf.erb /etc/nginx/templates/site.conf.template

# Env vars generation script.
COPY apps/web/scripts/generateEnvVarsJsFile.sh /scripts/
RUN chmod +x /scripts/generateEnvVarsJsFile.sh

# Entrypoint script.
COPY apps/web/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
