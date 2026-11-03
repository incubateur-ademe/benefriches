#!/bin/bash
# PreToolUse(Bash): AGENTS.md says "Run scripts with pnpm, not npm".
# Blocks npm / npx / yarn when used as a command (start of line or after ; & | ( ).
INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command // ""')

if echo "$COMMAND" | grep -qE '(^|[;&|(`]|\$\()[[:space:]]*([A-Za-z_][A-Za-z0-9_]*=[^[:space:]]*[[:space:]]+)*(npm|npx|yarn)([[:space:]]|$)'; then
  echo "Blocked: this project uses pnpm, not npm/npx/yarn." >&2
  echo "Use 'pnpm <script>', 'pnpm --filter <api|web|shared|e2e-tests> <script>', 'pnpm exec <bin>' or 'pnpm dlx <pkg>'." >&2
  exit 2
fi

exit 0
