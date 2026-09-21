---
name: run-e2e-tests
effort: medium
model: sonnet
description: "Run Benefriches end-to-end tests with automatic Docker stack lifecycle management. Starts the e2e docker-compose stack, waits for readiness, runs Playwright tests, and tears down the stack on success. Use when the user asks to run e2e tests, end-to-end tests, or invokes /run-e2e-tests. Accepts an optional argument to focus on specific tests (e.g., tests/create-site/ or a specific spec file)."
allowed-tools: Bash
---

# Run E2E Tests

Run the full e2e test lifecycle: start stack, run tests, stop stack.

## Arguments

- `$ARGUMENTS` (optional): Test path filter passed to `playwright test` (e.g., `tests/create-site/`, `tests/create-project/create-photovoltaic-project.spec.ts`)

## Procedure

Execute these steps sequentially. Stop and report on failure at any step.

### 1. Build Docker images, start the stack, and wait for readiness

```bash
cd $PROJECT_ROOT
make e2e-up-build
```

This builds quietly and blocks until every service (including `web`) reports healthy via its Docker healthcheck. If it fails or times out, run `docker compose --env-file .env.e2e -f docker-compose.e2e.yml logs --tail=50` to show recent logs, then stop.

### 2. Run the tests

If `$ARGUMENTS` is provided:

```bash
pnpm --filter e2e-tests test:headless $ARGUMENTS
```

Otherwise:

```bash
pnpm --filter e2e-tests test:headless
```

### 3. Tear down the stack

Only if tests passed:

```bash
docker compose --env-file .env.e2e -f docker-compose.e2e.yml down
```

If tests failed, keep the stack running and inform the user so they can investigate. Mention they can manually stop it with `docker compose --env-file .env.e2e -f docker-compose.e2e.yml down`.
