#!/bin/sh
set -e

pnpm knex:migrate-latest:js

echo "Starting NestJS API..."
exec node dist/src/main.js
