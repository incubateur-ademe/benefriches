#!/usr/bin/env bash
set -euo pipefail

# Git Worktree Removal Script
# Removes a worktree and optionally deletes the branch

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_NAME="$(basename "$REPO_ROOT")"
PARENT_DIR="$(dirname "$REPO_ROOT")"

usage() {
    echo "Usage: $0 <branch-name> [--delete-branch]"
    echo ""
    echo "Removes a git worktree created by create-worktree.sh"
    echo ""
    echo "Arguments:"
    echo "  branch-name      Name of the branch"
    echo "  --delete-branch  Also delete the branch after removing worktree"
    echo ""
    echo "Examples:"
    echo "  $0 feat/new-feature                # Remove worktree, keep branch"
    echo "  $0 feat/new-feature --delete-branch # Remove worktree and branch"
    exit 1
}

list_worktrees() {
    echo "Current worktrees:"
    cd "$REPO_ROOT"
    git worktree list
    exit 0
}

if [[ $# -lt 1 ]]; then
    usage
fi

if [[ "$1" == "--list" || "$1" == "-l" ]]; then
    list_worktrees
fi

BRANCH_NAME="$1"
DELETE_BRANCH=false

if [[ $# -ge 2 && "$2" == "--delete-branch" ]]; then
    DELETE_BRANCH=true
fi

# Sanitize branch name for directory (replace / with -)
DIR_SUFFIX="${BRANCH_NAME//\//-}"
WORKTREE_PATH="$PARENT_DIR/${REPO_NAME}-${DIR_SUFFIX}"

echo "=== Git Worktree Removal ==="
echo "Branch:    $BRANCH_NAME"
echo "Worktree:  $WORKTREE_PATH"
echo ""

# Check if worktree exists
if [[ ! -d "$WORKTREE_PATH" ]]; then
    echo "Error: Worktree directory not found: $WORKTREE_PATH"
    echo ""
    echo "Available worktrees:"
    cd "$REPO_ROOT"
    git worktree list
    exit 1
fi

# Stop any running Docker containers in the worktree
if [[ -f "$WORKTREE_PATH/docker-compose.db.yml" ]]; then
    echo "Stopping Docker containers..."
    cd "$WORKTREE_PATH"
    docker compose --env-file apps/api/.env -f docker-compose.db.yml down 2>/dev/null || true
fi

# Remove the worktree
echo "Removing worktree..."
cd "$REPO_ROOT"
git worktree remove "$WORKTREE_PATH" --force

echo "Worktree removed."

# Optionally delete the branch
if $DELETE_BRANCH; then
    echo "Deleting branch: $BRANCH_NAME"
    git branch -D "$BRANCH_NAME" 2>/dev/null || echo "Branch not found or already deleted"
fi

echo ""
echo "=== Removal Complete ==="
