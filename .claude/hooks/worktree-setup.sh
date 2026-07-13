#!/bin/bash
# WorktreeCreate hook. Registering this hook replaces Claude Code's default
# worktree creation entirely: the input has no path, only {name, cwd} - this
# script must create the git worktree itself and echo the resulting path to
# stdout on success. Setup failures (pnpm install/build) are logged but never
# block: they're a convenience, not a precondition for the worktree existing.

set -euo pipefail

INPUT=$(cat)
NAME=$(node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).name))" <<< "$INPUT")
REPO_ROOT=$(node -e "process.stdin.on('data',d=>console.log(JSON.parse(d).cwd))" <<< "$INPUT")

if [[ -z "$NAME" || -z "$REPO_ROOT" ]]; then
  echo "worktree-setup: missing name/cwd in hook input: $INPUT" >&2
  exit 1
fi

WORKTREE_PATH="$REPO_ROOT/.claude/worktrees/$NAME"
BRANCH="worktree-$NAME"

# Mirrors worktree.baseRef: "fresh" - branch from origin/HEAD, falling back
# to local HEAD when there's no origin remote.
BASE_REF=$(git -C "$REPO_ROOT" rev-parse --verify origin/HEAD 2>/dev/null || git -C "$REPO_ROOT" rev-parse HEAD)

if ! git -C "$REPO_ROOT" worktree add --lock -b "$BRANCH" "$WORKTREE_PATH" "$BASE_REF" 2>&1; then
  echo "worktree-setup: git worktree add failed for $WORKTREE_PATH" >&2
  exit 1
fi

"$REPO_ROOT/scripts/prime-worktree.sh" "$WORKTREE_PATH" || true

echo "$WORKTREE_PATH"
