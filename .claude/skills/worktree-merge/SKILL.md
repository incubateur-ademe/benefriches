---
name: worktree-merge
effort: low
description: Merge a worktree branch into main, remove the worktree, and delete the branch. Lists active worktrees for selection.
user-invocable: true
---

# Worktree Cleanup

Merge a completed worktree branch into main, remove the worktree directory, and delete the branch.

## Instructions

### Step 1: List active worktrees

Run `git worktree list` and parse the output to find all worktrees **except** the main one.

If there are no worktrees to clean up, tell the user and stop.

### Step 2: Ask user which worktree to clean up

Use the `AskUserQuestion` tool to present the list of active worktrees as options. Show the branch name and directory path in each option.

### Step 3: Confirm merge strategy

Use `AskUserQuestion` to ask whether to:
1. **Merge into main** — merge the branch into main before cleanup
2. **Remove only** — just remove the worktree and branch without merging (for abandoned work)

### Step 4: Execute cleanup

#### If merging:

```bash
# 1. Ensure we're on main and up to date
git checkout main

# 2. Merge the branch
git merge --ff-only <branch-name>

# 3. Remove worktree and delete branch
scripts/remove-worktree.sh <branch-name> --delete-branch
```

#### If removing without merge:

```bash
# Remove worktree and delete branch
scripts/remove-worktree.sh <branch-name> --delete-branch
```

### Step 5: Report result

Show what was done: merged (if applicable), worktree removed, branch deleted.

## Arguments

$ARGUMENTS
