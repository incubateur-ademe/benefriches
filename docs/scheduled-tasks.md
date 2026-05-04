# Scheduled Tasks

## Overview

Bénéfriches runs scheduled background tasks on Scalingo via the platform's `cron.json` mechanism. Each scheduled task is executed in a one-shot container — there is no long-running worker process. The container starts, runs the script, and exits.

## File location

`apps/api/scalingo/cron.json` — sibling to the existing `apps/api/scalingo/Procfile`.

## Cron format

Each entry in `cron.json` has a `command` field that combines a standard 5-field cron schedule with the shell command to execute, both as a single string:

```
0 4 * * * cd apps/api && node ./dist/src/<module>/adapters/primary/<task>.script.js
```

Schedules use **UTC** unless the `TZ` environment variable is set on the Scalingo app.

## Entry point convention

Each scheduled task lives **inside the owning module as a primary adapter**:

```
apps/api/src/<module>/adapters/primary/<task>.script.ts
```

The script bootstraps NestJS via `NestFactory.createApplicationContext`, resolves a use case from `AppModule`, executes it, and closes the app. It compiles to:

```
apps/api/dist/src/<module>/adapters/primary/<task>.script.js
```

The script sits alongside the module's controllers and event handlers — it is just another primary-adapter way to drive a use case from outside the process. The `.script.ts` suffix distinguishes scripts from controllers and event handlers.

We deliberately do not use a top-level `apps/api/src/scripts/` directory: keeping each script inside its owning module preserves Clean Architecture module boundaries and avoids a grab-bag of unrelated entry points.

## Adding a new scheduled task

1. Write a use case in the relevant module's `core/usecases/`, with unit tests using InMemory gateways.
2. Register the use case as a provider in the module (using the factory pattern), and `export` it from the module so the bootstrap script can resolve it.
3. Create the bootstrap script at `apps/api/src/<module>/adapters/primary/<task>.script.ts`. It should call `NestFactory.createApplicationContext(AppModule)`, `app.get(<UseCase>)`, `useCase.execute(...)`, and finally `app.close()`.
4. Add a job entry to `apps/api/scalingo/cron.json` with the schedule and command.
5. Append a row to the **Current tasks** table on this page.

## Current tasks

| Task                         | Schedule (UTC)            | Command                                                                                           | Purpose                                                                                       |
| ---------------------------- | ------------------------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Newsletter subscription sync | `0 4 * * *` (daily 04:00) | `cd apps/api && node ./dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js` | Pulls newsletter subscription status from the ADEME CRM into `users.subscribed_to_newsletter` |

## Running a task manually (incl. dry-run)

Scheduled tasks can be run on demand via Scalingo one-off containers using `scalingo run`. The newsletter-sync script accepts a `--dry-run` flag that performs all reads and decisions but skips the write step — the canonical example of a manual invocation:

```bash
scalingo run --app benefriches-staging cd apps/api && node ./dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js --dry-run
```

Without `--dry-run`, the same command performs the real run.

## Observability

Output from each run goes to the Scalingo logs, viewable in the Scalingo dashboard or via `scalingo logs --app <app-name>`.

The recommended pattern is to emit a single summary `info` log line at the end of each task with the key counters for the run (e.g., total processed, updated, errored). This makes it easy to spot anomalies (an unexpected spike in errors, zero processed, etc.) without paging through per-record logs.
