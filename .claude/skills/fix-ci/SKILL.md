---
name: fix-ci
effort: high
description: >
  Diagnose and fix a failed GitHub Actions job run. Given a run URL/ID (or the latest
  failed run on the current branch), pulls the failure via the gh CLI, reproduces it in
  an isolated worktree off the exact failing commit, fixes it, and verifies locally.
  Use when the user says "fix the failing CI", "the GitHub Action failed", invokes
  "/fix-ci", or points at a failed GitHub Actions run.
allowed-tools: Bash, Read, Edit, Write, Grep, Glob, Skill
user-invocable: true
---

# Fix CI — diagnose and fix a failed GitHub Actions job run

Take a failed GitHub Actions run, deterministically identify what failed, reproduce it in
an isolated worktree based on the exact failing commit, fix it, and verify green locally.
Integration (commit/push/merge) is left to the user.

## Determinism rule (non-negotiable)

All GitHub access goes through the **fixed `gh` CLI commands documented below**, with the
flags shown. Do **not** use the browser MCP, do **not** hand-craft REST calls, and do
**not** improvise alternative `gh` invocations. This keeps data-gathering reproducible.

Prerequisite: `gh auth status` must succeed. If not, stop and tell the user to run
`gh auth login`.

## Procedure

### 1. Resolve the run

- If the user passed an argument, extract the run ID (and job ID if present):
  - From a URL like `https://github.com/<owner>/<repo>/actions/runs/<id>` → take `<id>`.
  - From `.../runs/<id>/job/<jobId>` → take `<id>` **and** `<jobId>`. A job URL names the
    exact job the user cares about, so carry `<jobId>` into step 2 to skip job selection.
  - From a bare number → use it directly.
- If no argument, pick the latest failed run on the current branch:
  ```bash
  gh run list --branch "$(git branch --show-current)" --status failure --limit 1 \
    --json databaseId,headSha,headBranch,workflowName
  ```
  Take the first result. If none, report "no failed run found for this branch" and stop.
- Fetch run metadata (single deterministic call):
  ```bash
  gh run view <id> --json databaseId,workflowName,headBranch,headSha,conclusion,jobs
  ```

### 2. Select the failed job

- If a `<jobId>` came from a job URL (step 1), use that job.
- Otherwise, from `.jobs` keep those with `conclusion == "failure"` and take the **first**
  one — picking deterministically (rather than asking) keeps the skill non-interactive. If
  more than one job failed, note in your final report that the others exist so the user can
  re-run `/fix-ci` for them.
- Record the selected job's numeric id (`.jobs[].databaseId`) as `<jobId>` — step 3 uses it
  to scope the logs.
- **Classify — bail early on deploy/infra:** if the job name matches deploy / scalingo /
  production / staging, this is not a code fix. Print a diagnosis from the logs (step 3)
  and **stop** — do not create a worktree or edit anything.

### 3. Pull the failure logs (deterministic)

Scope the log to the selected job so steps from other jobs don't muddy the diagnosis:

```bash
gh run view --job <jobId> --log-failed
```

Identify the **failed step name** and capture the error lines (the relevant excerpt, not
the whole log). You'll show this in the report.

### 4. Map the failed step → local command (read the workflow YAML)

Resolve the command generally rather than from a hardcoded table:

- Find the workflow file under `.github/workflows/` (use `.workflowName` / the job name to
  locate it; jobs may live in a reusable workflow invoked via `uses:`).
- Locate the job and the failed step; extract that step's `run:` command. That is the
  local reproduction command.
- **e2e special case:** if the failed job/step is the end-to-end / Playwright job, the
  `run:` alone (docker + `pnpm --filter e2e-tests test:headless`) needs the full stack.
  Delegate stack lifecycle to the **`run-e2e-tests`** skill instead of raw docker
  commands, using the YAML test command as the target.

### 5. Create an isolated worktree at the failing commit

`scripts/create-worktree.sh` only branches off current HEAD, so **do not use it here.**
Base the worktree on the run's exact `headSha`:

```bash
git fetch origin <headSha>        # ensure the commit is present locally
git worktree add -b fix/ci-<runId> ../benefriches-fix-ci-<runId> <headSha>
```

Prime the worktree with only what the mapped command actually needs — a lint or
`format:check` failure needs neither a full build nor a shared rebuild, so skipping them
saves minutes:
```bash
cd ../benefriches-fix-ci-<runId>
pnpm install                      # always: a fresh worktree has no node_modules
pnpm --filter shared build        # only for typecheck / test / build / e2e (they consume shared)
```

### 6. Reproduce

Run the mapped command in the worktree.

- **Reproduced (command fails):** go to step 7.
- **Not reproduced (command passes) — likely flaky / environment-specific:**
  1. Trigger a remote rerun of the failed jobs: `gh run rerun --failed <id>`
  2. Watch to completion: `gh run watch <id>`
  3. If the rerun **passes** → flaky; report that and stop. The worktree from step 5 is
     now unused, so tell the user they can drop it with
     `git worktree remove ../benefriches-fix-ci-<runId>`.
  4. If the rerun **fails again** → escalate: analyze the failed logs and attempt a
     targeted, log-based fix in the worktree (step 7), being explicit that it's inferred
     from logs, not from a local repro.

### 7. Fix and verify

- State the **root cause** and the **intended fix** before editing.
- Apply the edits in the worktree.
- Re-run the mapped command until green. For e2e, re-verify through `run-e2e-tests`.

### 8. Hand off (no commit/push)

Report:
- Run + job identified (and any other failed jobs left for a follow-up run).
- Root cause + the failed-log excerpt.
- Files changed and the local verification result (green).
- Worktree path and branch (`fix/ci-<runId>`).

Tell the user to integrate via the existing **`worktree-merge`** skill. This skill does
**not** commit, push, or merge.

## Scope

| Class | Behavior |
|-------|----------|
| typecheck / lint / format / test / build | Reproduce + fix + verify locally |
| e2e (Playwright) | Reproduce via `run-e2e-tests`, fix, re-verify |
| deploy / infra / secrets (Scalingo, staging, production) | Diagnose from logs and **stop** — not a code fix |

## Deterministic gh command reference

| Purpose | Command |
|---------|---------|
| Latest failed run on branch | `gh run list --branch <branch> --status failure --limit 1 --json databaseId,headSha,headBranch,workflowName` |
| Run metadata | `gh run view <id> --json databaseId,workflowName,headBranch,headSha,conclusion,jobs` |
| Failed-step logs (job-scoped) | `gh run view --job <jobId> --log-failed` |
| Rerun failed jobs | `gh run rerun --failed <id>` |
| Watch a run | `gh run watch <id>` |
