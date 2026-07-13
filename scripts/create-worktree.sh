#!/usr/bin/env bash
set -euo pipefail

# Git Worktree Setup Script
# Creates a worktree under .claude/worktrees/ (same location convention as
# `claude --worktree`, gitignored so it never pollutes status/diff/search)
# and primes the environment.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

usage() {
    echo "Usage: $0 <branch-name>"
    echo ""
    echo "Creates a new branch from current HEAD, a git worktree for it,"
    echo "and sets up the development environment."
    echo ""
    echo "Arguments:"
    echo "  branch-name    Name of the new branch to create"
    echo ""
    echo "Example:"
    echo "  $0 feat/new-feature"
    echo ""
    echo "The worktree will be created at: .claude/worktrees/<branch-name>"
    exit 1
}

if [[ $# -lt 1 ]]; then
    usage
fi

BRANCH_NAME="$1"

# Sanitize branch name for directory: drop a conventional type prefix
# (feat/, fix/, refactor/, chore/) then replace remaining / with -
DIR_SUFFIX="${BRANCH_NAME#feat/}"
DIR_SUFFIX="${DIR_SUFFIX#fix/}"
DIR_SUFFIX="${DIR_SUFFIX#refactor/}"
DIR_SUFFIX="${DIR_SUFFIX#chore/}"
DIR_SUFFIX="${DIR_SUFFIX//\//-}"
WORKTREE_PATH="$REPO_ROOT/.claude/worktrees/${DIR_SUFFIX}"

echo "=== Git Worktree Setup ==="
echo "Branch:    $BRANCH_NAME"
echo "Worktree:  $WORKTREE_PATH"
echo ""

# Check if worktree already exists
if [[ -d "$WORKTREE_PATH" ]]; then
    echo "Error: Directory already exists: $WORKTREE_PATH"
    exit 1
fi

# Create the worktree
echo "Creating worktree..."
cd "$REPO_ROOT"
mkdir -p "$REPO_ROOT/.claude/worktrees"

git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH"

echo "Worktree created."
echo ""

# git worktree add here runs as a plain shell command, not through Claude
# Code's own worktree-creation paths (--worktree / EnterWorktree / subagent
# isolation), so the WorktreeCreate hook does NOT fire for it. Invoke the
# shared priming script directly so /worktree stays self-contained.
echo "Priming worktree (pnpm install + shared build + env files)..."
"$REPO_ROOT/scripts/prime-worktree.sh" "$WORKTREE_PATH"
echo "  see $WORKTREE_PATH/.claude-worktree-setup.log for details"
echo ""

echo "=== Setup Complete ==="
echo ""
echo "Worktree ready at: $WORKTREE_PATH"
echo ""
echo "Next steps:"
echo "  cd $WORKTREE_PATH"
echo ""
echo "To start the database (Docker):"
echo "  make dev-up"
echo ""
echo "To run migrations:"
echo "  pnpm --filter api knex:migrate-latest"
echo "  pnpm --filter api knex:seed-run"
echo ""
echo "To start development:"
echo "  pnpm --filter api dev"
echo "  pnpm --filter web dev"
