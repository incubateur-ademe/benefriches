---
name: run-e2e-tests
effort: medium
description: "Run Benefriches end-to-end tests with automatic Docker stack lifecycle management. Starts the e2e docker-compose stack, waits for readiness, runs Playwright tests, and tears down the stack on success. Use when the user asks to run e2e tests, end-to-end tests, or invokes /run-e2e-tests. Accepts an optional argument to focus on specific tests (e.g., tests/create-site/ or a specific spec file)."
---

# Run E2E Tests

Run the full e2e test lifecycle: start stack, run tests, stop stack.

## Arguments

- `$ARGUMENTS` (optional): Test path filter passed to `playwright test` (e.g., `tests/create-site/`, `tests/create-project/create-photovoltaic-project.spec.ts`)

## Procedure

Execute these steps sequentially. Stop and report on failure at any step.

### 1. Build Docker images and start the stack

```bash
cd $PROJECT_ROOT
docker compose --env-file .env.e2e -f docker-compose.e2e.yml up -d --build
```

### 2. Wait for the stack to be ready

Run the wait script (max 120s, every second):

```bash
cd $PROJECT_ROOT
node apps/e2e-tests/scripts/wait-for-stack.js
```

If timeout is reached, run `docker compose --env-file .env.e2e -f docker-compose.e2e.yml logs --tail=50` to show recent logs, then stop.

### 3. Run the tests

If `$ARGUMENTS` is provided:

```bash
pnpm --filter e2e-tests test:e2e $ARGUMENTS
```

Otherwise:

```bash
pnpm --filter e2e-tests test:e2e
```

### 4. Tear down the stack

Only if tests passed:

```bash
docker compose --env-file .env.e2e -f docker-compose.e2e.yml down
```

If tests failed, keep the stack running and inform the user so they can investigate. Mention they can manually stop it with `docker compose --env-file .env.e2e -f docker-compose.e2e.yml down`.
