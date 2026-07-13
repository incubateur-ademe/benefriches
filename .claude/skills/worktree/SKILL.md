---
name: worktree
effort: low
model: haiku
description: Create a git worktree and prime the development environment for a new feature or refactor. Use when starting isolated feature work or needing a separate working copy.
allowed-tools: Bash
user-invocable: true
---

# Create Git Worktree

Create a new git worktree for isolated feature development.

## Instructions

1. Parse the branch name from arguments
2. Run the worktree creation script
3. Report the result and next steps

## Execution

The script always creates a new branch from current HEAD, places the worktree under `.claude/worktrees/<name>` (gitignored, so it never pollutes `git status`/diff/search), and primes it (pnpm install, shared build, env files):

```bash
scripts/create-worktree.sh <branch-name>
```

### Branch Naming Convention

If the user provides just a feature name without a prefix, add the appropriate prefix:
- Features: `feat/<name>` (default)
- Refactors: `refactor/<name>` (if user mentions "refactor")
- Fixes: `fix/<name>` (if user mentions "fix" or "bug")
- Chores: `chore/<name>` (if user mentions "chore")

### Examples

| User Input | Branch Name |
|------------|-------------|
| `/worktree new-feature` | `feat/new-feature` |
| `/worktree refactor auth` | `refactor/auth` |
| `/worktree fix/login-bug` | `fix/login-bug` (keep as-is) |
| `/worktree feat/my-thing` | `feat/my-thing` (keep as-is) |

## After Execution

Tell the user:
1. The worktree location
2. How to navigate to it: `cd <worktree-path>`
3. Remind them to start a new Claude Code session in that directory for isolated work

## Arguments

$ARGUMENTS
