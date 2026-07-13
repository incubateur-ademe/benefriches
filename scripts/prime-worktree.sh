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

{
  echo "=== worktree-setup $(date) ==="

  pnpm install && \
  pnpm --filter shared build && \
  { [[ -f apps/web/.env.example ]] && cp -n apps/web/.env.example apps/web/.env; true; } && \
  { [[ -f apps/api/.env.example ]] && cp -n apps/api/.env.example apps/api/.env; true; } && \
  pnpm --filter web setup-env-vars

  echo "=== done, exit=$? ==="
} >> "$LOG_FILE" 2>&1

exit 0
