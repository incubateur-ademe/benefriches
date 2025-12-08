# Multi-stage build for production-like Node API

# Base stage with Node.js and pnpm
FROM node:24-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
WORKDIR /app

# Dependencies stage - install all dependencies
FROM base AS dev-deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# needed for base tsconfig used in shared package postinstall
COPY .tooling ./.tooling/
COPY packages/shared ./packages/shared/
COPY apps/api/ ./apps/api
# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage - build shared package and API
FROM base AS build
COPY --from=dev-deps /app/node_modules ./node_modules
COPY --from=dev-deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=dev-deps /app/apps/api/node_modules ./apps/api/node_modules
# Copy built shared package from deps stage
COPY --from=dev-deps /app/packages/shared/dist ./packages/shared/dist
COPY --from=dev-deps /app/.tooling ./.tooling/
COPY apps/api ./apps/api
COPY packages/shared ./packages/shared
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Build API
RUN pnpm --filter=api build

# Runtime stage
FROM base AS runtime

WORKDIR /app

# Copy node_modules from deps stage
COPY --from=dev-deps /app/node_modules ./node_modules
COPY --from=dev-deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=dev-deps /app/apps/api/node_modules ./apps/api/node_modules

# Copy built shared package
COPY --from=build /app/packages/shared/dist ./packages/shared/dist
COPY --from=build /app/packages/shared/package.json ./packages/shared/

# Copy built API
COPY --from=build /app/apps/api/dist ./apps/api/dist

# Copy data files for seed
COPY --from=build /app/apps/api/data ./apps/api/dist

# Copy API package.json for workspace resolution
COPY --from=build /app/apps/api/package.json ./apps/api/

# Copy workspace files
COPY --from=dev-deps /app/package.json /app/pnpm-workspace.yaml ./

# Copy and make executable the entrypoint script
COPY apps/api/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Set working directory to API
WORKDIR /app/apps/api

# Expose API port
EXPOSE 4001

# Use custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
