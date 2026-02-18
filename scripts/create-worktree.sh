#!/usr/bin/env bash
set -euo pipefail

# Git Worktree Setup Script
# Creates a new worktree as a sibling directory and primes the environment

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_NAME="$(basename "$REPO_ROOT")"
PARENT_DIR="$(dirname "$REPO_ROOT")"

usage() {
    echo "Usage: $0 <branch-name> [--new-branch]"
    echo ""
    echo "Creates a git worktree and sets up the development environment."
    echo ""
    echo "Arguments:"
    echo "  branch-name    Name of the branch (existing or new)"
    echo "  --new-branch   Create a new branch from current HEAD (optional)"
    echo ""
    echo "Examples:"
    echo "  $0 feat/new-feature --new-branch   # Create new branch and worktree"
    echo "  $0 existing-branch                  # Create worktree for existing branch"
    echo ""
    echo "The worktree will be created at: $PARENT_DIR/${REPO_NAME}-<branch-name>"
    exit 1
}

if [[ $# -lt 1 ]]; then
    usage
fi

BRANCH_NAME="$1"
NEW_BRANCH=false

if [[ $# -ge 2 && "$2" == "--new-branch" ]]; then
    NEW_BRANCH=true
fi

# Sanitize branch name for directory (replace / with -)
DIR_SUFFIX="${BRANCH_NAME//\//-}"
WORKTREE_PATH="$PARENT_DIR/${REPO_NAME}-${DIR_SUFFIX}"

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

if $NEW_BRANCH; then
    git worktree add -b "$BRANCH_NAME" "$WORKTREE_PATH"
else
    git worktree add "$WORKTREE_PATH" "$BRANCH_NAME"
fi

echo "Worktree created."
echo ""

# Change to worktree directory
cd "$WORKTREE_PATH"

# Install dependencies
echo "Installing dependencies..."
pnpm install -r
echo "Dependencies installed."
echo ""

# Copy environment files
echo "Setting up environment files..."

if [[ -f "apps/web/.env.example" && ! -f "apps/web/.env" ]]; then
    cp apps/web/.env.example apps/web/.env
    echo "  Created apps/web/.env"
fi

if [[ -f "apps/api/.env.example" && ! -f "apps/api/.env" ]]; then
    cp apps/api/.env.example apps/api/.env
    echo "  Created apps/api/.env"
fi

echo ""
echo "=== Setup Complete ==="
echo ""
echo "Worktree ready at: $WORKTREE_PATH"
echo ""
echo "Next steps:"
echo "  cd $WORKTREE_PATH"
echo ""
echo "To start the database (Docker):"
echo "  docker compose --env-file apps/api/.env -f docker-compose.db.yml up -d"
echo ""
echo "To run migrations:"
echo "  pnpm --filter api knex:migrate-latest"
echo "  pnpm --filter api knex:seed-run"
echo ""
echo "To start development:"
echo "  pnpm --filter api start:dev"
echo "  pnpm --filter web setup-env-vars && pnpm --filter web dev"
