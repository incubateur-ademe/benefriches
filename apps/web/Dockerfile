# Multi-stage build for production-like webapp with nginx

# Base stage with Node.js and pnpm
FROM node:24-slim AS base
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
WORKDIR /app

# Dependencies stage - install all dependencies
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# needed for base tsconfig used in shared package postinstall
COPY .tooling ./.tooling/
COPY packages/shared ./packages/shared/
COPY apps/web ./apps/web
# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage - build shared package and webapp
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
# Copy built shared package from deps stage
COPY --from=deps /app/packages/shared/dist ./packages/shared/dist
COPY --from=deps /app/.tooling ./.tooling/
COPY apps/web ./apps/web
COPY packages/shared ./packages/shared
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Build webapp
RUN pnpm --filter=web build

# Runtime stage with nginx
FROM nginx:alpine AS runtime-nginx

# Copy built static files to nginx html directory
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

# Copy nginx configurations
# Main config based on Scalingo's buildpack
COPY apps/web/nginx.conf /etc/nginx/nginx.conf
# Site config template (from Scalingo)
COPY apps/web/scalingo/nginx.conf.erb /etc/nginx/templates/site.conf.template

# Copy and make executable the env vars generation script
COPY apps/web/scripts/generateEnvVarsJsFile.sh /scripts/
RUN chmod +x /scripts/generateEnvVarsJsFile.sh

# Copy and make executable the entrypoint script
COPY apps/web/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose HTTP port
EXPOSE 80

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
