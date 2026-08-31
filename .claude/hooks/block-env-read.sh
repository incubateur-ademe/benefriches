#!/usr/bin/env bash
# PreToolUse(Bash): block shell commands that touch untracked .env secret files.
#
# The Read/Edit deny rules in settings.json only cover the file tools; Bash can
# reach the same files through cat, grep, sed, node -e, source, etc. Rather than
# enumerating readers (a losing game), inspect the command string for .env paths.
#
# Committed env files are fine to read - they are in the repo already:
#   .env.example, .env.e2e, apps/api/.env.test
# Everything else matching .env* is blocked, so new secret files fail safe.

set -euo pipefail

cmd=$(jq -r '.tool_input.command // ""')

# Neutralize the allowlisted, committed filenames before scanning.
sanitized=$(printf '%s' "$cmd" | sed -E 's/\.env\.(example|e2e|test)/__ENVOK__/g')

# Match a .env token: ".env" not followed by another name character.
# Catches .env, .env.local, .env.production, ".env", .env' - but not .environment
if printf '%s' "$sanitized" | grep -qE '\.env($|[^a-zA-Z0-9])'; then
  echo "Blocked: this command references a .env secret file." >&2
  echo "Secrets must not enter the transcript. Ask the user to paste the specific" >&2
  echo "values needed, or read .env.example for the list of variable names." >&2
  exit 2
fi

exit 0
