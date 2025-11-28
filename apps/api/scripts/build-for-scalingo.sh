#!/usr/bin/env bash

# Create folder to package the API production code
mkdir .tmp-build/

# Transpile API Typescript code
pnpm --filter=api build 

# Copy monorepo root files
cp -vr pnpm-lock.yaml package.json pnpm-workspace.yaml .tooling/ .tmp-build/ 

# Copy shared packages
pnpm --filter=shared build
cp -vr packages/ ./.tmp-build/packages/

# Create folder to copy api/ production files
mkdir -pv .tmp-build/apps/api/dist

# Copy api files needed for production
cp -v apps/api/package.json .tmp-build/apps/api/
cp -rv apps/api/dist .tmp-build/apps/api/

# Copy data files needed for seed
cp -rv apps/api/data .tmp-build/apps/api/dist

# Copy scalingo specific files
cp -v apps/api/scalingo/.buildpacks apps/api/scalingo/Procfile .tmp-build/

# The buildpack used to deploy api (see Procfile) runs "pnpm install", "pnpm build" and "pnpm prune --prod"
# Our code is already built and we don't include the source so we skip "build", "prepare", "test" etc... in root package.json
# /!\ WARNING /!\ these sed commands are NOT compatible with MacOS (add '' after -i if you want to run it on your laptop)
sed -i /\"build\":/d .tmp-build/package.json
sed -i /\"test\":/d .tmp-build/package.json
sed -i /\"prepare\":/d .tmp-build/package.json
sed -i /\"lint\":/d .tmp-build/package.json
sed -i /\"format\":/d .tmp-build/package.json
sed -i /\"format:check\":/d .tmp-build/package.json
sed -i /\"typecheck\":/d .tmp-build/package.json

# Replace knexfile path with build (now located in dist/ folder) and use .js extension since it's transpiled
sed -i 's/src\/shared-kernel\/adapters\/sql-knex\/knexfile.ts/dist\/src\/shared-kernel\/adapters\/sql-knex\/knexfile.js/' .tmp-build/apps/api/package.json

# Make archive to upload the packaged built api
tar -czf api-scalingo.tar.gz .tmp-build
