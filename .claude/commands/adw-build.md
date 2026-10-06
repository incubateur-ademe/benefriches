---
description: Implement an ADW spec on the current branch, verify it and commit (ADW build step)
argument-hint: <spec-path>
model: opus
---

Implement the spec at `$ARGUMENTS` on the current branch, in the current worktree. If the spec starts with `BLOCKED`, stop and report it unchanged.

1. Read the spec, then the AGENTS.md files and rules for every file listed under Files. The spec says what to build; they say how it is done in this repo.
2. Invoke a project skill with the Skill tool before doing the work it covers, every time it applies, even when you think you know how:
   - database schema or data change: `create-database-migration`
   - new or changed e2e test: `create-e2e-test`, then `run-e2e-tests` to run it
   - multi-step form flow or step: `wizard-form`
   - React components, hooks or Redux: `react-best-practices`
   - an architectural decision or new pattern: `adr`
3. Implement the spec. When the spec is wrong or incomplete, prefer what the code and rules require, and note the deviation in your report.
4. Run the spec's Validation commands and `pnpm verify`. Fix every failure and rerun until all are green. Never weaken, skip or delete a test or a check to make it pass; if a check fails for a reason outside the spec (environment, an unrelated flaky test), keep its full output and report it rather than working around it.
5. Commit as you go, one small commit per coherent step, with a conventional commit message (the `generate-commit-message` skill writes one when it is available). Leave no uncommitted changes.

The runner may resume this session with the failing output of its acceptance check, or with a JSON list of review `blockers`. Fix each one as in steps 3 to 5, then end with the same report.

Never push, merge, rebase onto another branch or open a pull request: the branch leaves the machine through the runner and a human.

If a required input is missing (user-facing copy, a design, a business rule, an endpoint) and neither the spec nor the code provides it, do not guess: commit only what is complete and verified, then start your final message with the line `BLOCKED` followed by one bullet per missing input.

Otherwise end with a short report: commits made (`git log --oneline` since you started), skills invoked, the result of each Validation command and of `pnpm verify`, and any deviation from the spec.
