#!/bin/bash
FILE=$(node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).tool_input.file_path))")

case "$FILE" in
  *.ts|*.tsx|*.js|*.jsx|*.css|*.md|*.json) ;;
  *) exit 0 ;;
esac

# Determine which workspace the file belongs to
case "$FILE" in
  */apps/web/*)     FILTER="web" ;;
  */apps/api/*)     FILTER="api" ;;
  */apps/e2e-tests/*) FILTER="e2e-tests" ;;
  */packages/shared/*) FILTER="shared" ;;
  *) exit 0 ;;
esac

pnpm --filter "$FILTER" exec prettier --write "$FILE" > /dev/null 2>&1
exit 0
