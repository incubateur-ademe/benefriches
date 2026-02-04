#!/usr/bin/env bash

# Create folder to package the API production code
mkdir .tmp-build/

# Copy monorepo root files
cp -v pnpm-lock.yaml package.json pnpm-workspace.yaml .tmp-build/
cp -vr .tooling .tmp-build/.tooling

# Copy shared package sources (buildpack will build it — skip node_modules and dist)
mkdir -p .tmp-build/packages/shared
cp -rv packages/shared/src packages/shared/package.json packages/shared/tsconfig.json packages/shared/tsdown.config.ts .tmp-build/packages/shared/

# Copy api app sources (buildpack will build it)
mkdir -p .tmp-build/apps/api
cp -rv apps/api/src apps/api/package.json apps/api/tsconfig.json apps/api/tsconfig.build.json apps/api/nest-cli.json .tmp-build/apps/api/

# Copy data files needed for seed
cp -rv apps/api/data .tmp-build/apps/api/

# Copy scalingo specific files
cp -v apps/api/scalingo/.buildpacks apps/api/scalingo/Procfile .tmp-build/

# Make archive to upload the packaged built api
tar -czf api-scalingo.tar.gz .tmp-build
