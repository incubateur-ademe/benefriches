#!/bin/bash
# Primes an already-created worktree: pnpm install, shared build, env files.
# Always exits 0 - failures are logged, not blocking, since not every
# worktree (e.g. a research-only subagent) needs a working pnpm environment.
# Shared by .claude/hooks/worktree-setup.sh and scripts/create-worktree.sh.

WORKTREE_PATH="$1"

if [[ -z "$WORKTREE_PATH" || ! -d "$WORKTREE_PATH" ]]; then
  echo "prime-worktree: no such directory: $WORKTREE_PATH" >&2
  exit 0
fi

LOG_FILE="$WORKTREE_PATH/.claude-worktree-setup.log"
cd "$WORKTREE_PATH" || exit 0

# The main checkout's env files are the source of truth: all worktrees share the
# same dev Postgres container/volume (docker-compose.dev.yml has a fixed project
# name), so they must use the same DATABASE_* credentials. Copying .env.example
# instead would give the worktree the placeholder password and break
# `knex:migrate-latest` with "password authentication failed".
MAIN_WORKTREE="$(git worktree list --porcelain 2>/dev/null | head -1 | sed 's/^worktree //')"

# copy_env <app-dir>: prefer the main checkout's .env, fall back to .env.example
copy_env() {
  local app="$1"
  if [[ -f "$app/.env" ]]; then
    return 0
  fi
  if [[ -n "$MAIN_WORKTREE" && "$MAIN_WORKTREE" != "$WORKTREE_PATH" && -f "$MAIN_WORKTREE/$app/.env" ]]; then
    cp "$MAIN_WORKTREE/$app/.env" "$app/.env"
    echo "copied $app/.env from main worktree"
  elif [[ -f "$app/.env.example" ]]; then
    cp "$app/.env.example" "$app/.env"
    echo "copied $app/.env from .env.example (no main worktree .env found)"
  fi
}

{
  echo "=== worktree-setup $(date) ==="

  pnpm install && \
  pnpm --filter shared build && \
  { copy_env apps/web; true; } && \
  { copy_env apps/api; true; } && \
  pnpm --filter web setup-env-vars

  echo "=== done, exit=$? ==="
} >> "$LOG_FILE" 2>&1

exit 0
