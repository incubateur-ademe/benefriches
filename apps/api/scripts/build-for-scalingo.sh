#!/usr/bin/env bash

# Create folder to package the API production code
mkdir .tmp-build/

# Transpile API Typescript code
pnpm --filter=api build 

# Copy monorepo root files
cp -v pnpm-lock.yaml package.json pnpm-workspace.yaml .tmp-build/

# Create folder to copy api/ production files
mkdir -pv .tmp-build/apps/api/dist

# Copy api files needed for production
cp -v apps/api/package.json .tmp-build/apps/api/
cp -rv apps/api/dist .tmp-build/apps/api/

# Copy scalingo specific files
cp -v apps/api/scalingo/.buildpacks apps/api/scalingo/Procfile .tmp-build/

# The buildpack used to deploy api (see Procfile) runs "pnpm install", "pnpm build" and "pnpm prune --prod"
# Our code is already built and we don't include the source so we skip the "build" in root package.json
# /!\ WARNING /!\ these sed commands are NOT compatible with MacOS (add "" after -i if you want to run it on your laptop)
sed -i 's/pnpm run -r build/echo 1/' .tmp-build/package.json
# We don't need these
sed -i /\"prepare\":/d .tmp-build/package.json
sed -i /\"lint\":/d .tmp-build/package.json
sed -i /\"format\":/d .tmp-build/package.json
sed -i /\"format:check\":/d .tmp-build/package.json
sed -i /\"typecheck\":/d .tmp-build/package.json

# Make archive to upload the packaged built api
tar -czf api-scalingo.tar.gz .tmp-build
