---
name: run-e2e-tests
effort: medium
model: sonnet
description: "Run Benefriches end-to-end tests with automatic Docker stack lifecycle management. Brings up an isolated e2e stack for a port slot (or reuses the one described by .e2e-stack), runs Playwright tests against it, and tears it down on success. Use when the user asks to run e2e tests, end-to-end tests, or invokes /run-e2e-tests. Accepts an optional argument to focus on specific tests (e.g., tests/create-site/ or a specific spec file)."
allowed-tools: Bash
---

# Run E2E Tests

Run Playwright against an isolated e2e stack. A stack belongs to a **port slot** (0-99): the slot sets every host port and the compose project name, so stacks of different worktrees run side by side. `node adws/env.ts up <slot>` writes `.e2e-stack` at the repository root (web, API and mail catcher URLs, ports, `DATABASE_URL`, `COMPOSE_PROJECT_NAME`); Playwright reads it, so the tests hit that stack.

## Arguments

- `$ARGUMENTS` (optional): Test path filter passed to `playwright test` (e.g., `tests/create-site/`, `tests/create-project/create-photovoltaic-project.spec.ts`)

## Procedure

Run every command from the repository root (the worktree root). Stop and report on failure at any step.

### 1. Get a stack

If `.e2e-stack` exists, a stack is already up for this worktree (for example started by the ADW runner): `cat .e2e-stack`, use it, and **skip step 3**: its owner tears it down.

Otherwise bring one up. Pick a slot no other worktree uses (`docker ps --format '{{.Names}}' | grep benefriches-e2e-` lists the slots in use); default to `$E2E_SLOT`, else 1. Slot 0 uses the same ports as `make e2e-up`.

```bash
node adws/env.ts up <slot>
```

It installs dependencies, builds `shared`, builds and starts the stack with a fresh database, health-checks the web app, API, database and mail catcher, then prints JSON:

- `"outcome": "ready"`: the stack is up and `.e2e-stack` is written.
- `"outcome": "env-failed"`: `step`, `command` and `output` say what failed (service logs are appended for compose and health-check failures); the half-started stack has already been removed. Report it and stop: this is an environment problem, not a test failure. If a port is taken, retry with another slot. The full output of every step is in `.e2e-stack.log`.

### 2. Run the tests

```bash
pnpm --filter e2e-tests test:headless $ARGUMENTS
```

To watch a failing test, rerun it with the browser visible: `pnpm --filter e2e-tests test:headed <path>` (append `--debug` for the Playwright inspector). The stack must still be up.

For logs or a shell on the stack, pass `.e2e-stack` to compose after the defaults:

```bash
docker compose --env-file .env.e2e --env-file .e2e-stack -f docker-compose.e2e.yml logs --tail=50 api
```

The database is reachable from the host at the `DATABASE_URL` of `.e2e-stack`.

### 3. Tear down the stack

Only if you brought the stack up in step 1 and tests passed:

```bash
node adws/env.ts down
```

It removes the containers and the database volume, and deletes `.e2e-stack`; the next `up` starts from an empty database. If tests failed, keep the stack running and tell the user so they can investigate; they stop it with `node adws/env.ts down` from the repository root.
