# [ADR-0010] Scheduled tasks as primary adapters within their owning module

- **Date**: 2026-05-04
- **Status**: Accepted

## Context

We needed to run a recurring background job (daily newsletter subscription sync between the ADEME CRM and our `users` table). Bénéfriches has had no scheduled tasks until now, so we had to choose:

1. Where the entry-point script lives in the API codebase
2. How it bootstraps the application
3. How it is scheduled in production

Scalingo (our hosting platform) supports scheduled jobs natively via a `cron.json` file: each entry is a cron expression + shell command that runs in a one-shot container. There is no persistent worker process — the container starts, runs, and exits. We wanted a convention that scales to future tasks (e.g., periodic data exports, cache refreshes) without becoming a grab-bag.

## Decision

Scheduled tasks are implemented as **primary adapters within the owning module**, alongside controllers and event handlers:

```
apps/api/src/<module>/adapters/primary/<task>.script.ts
```

Each script:
1. Bootstraps NestJS via `NestFactory.createApplicationContext(AppModule)` (no HTTP server)
2. Resolves a use case from the container with `app.get(<UseCase>)`
3. Calls `useCase.execute(...)`
4. Closes the app

Scheduling lives in `apps/api/scalingo/cron.json`, sibling to the existing `Procfile`. The convention and current task inventory are documented in `docs/scheduled-tasks.md`.

The first instance is the newsletter sync: `apps/api/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.ts`, scheduled daily at 04:00 UTC.

## Options Considered

### Option 1: Top-level `apps/api/src/scripts/` directory

A dedicated folder for all scheduled scripts, regardless of domain.

- **Pros**: All scripts discoverable in one place; shallow path.
- **Cons**: Breaks Clean Architecture module boundaries — scripts would import use cases across module lines from a neutral location, becoming a grab-bag of unrelated entry points. Also splits a feature's code (use case in module, script outside) for no real benefit.

### Option 2: Primary adapter inside the owning module (chosen)

Each script lives next to the module's controllers and event handlers, with a `.script.ts` suffix.

- **Pros**: Preserves module boundaries; treats the script as just another way to drive a use case from outside the process (HTTP, event, cron — all primary adapters); collocated with the use case it invokes.
- **Cons**: Slightly less discoverable — to find all scheduled tasks you must consult `docs/scheduled-tasks.md` rather than `ls` a single folder. Mitigated by maintaining the table in that doc.

### Option 3: Long-running worker with `@nestjs/schedule`

Run a persistent process that schedules itself in-app via cron decorators.

- **Pros**: No platform-specific config; everything in one place.
- **Cons**: Requires running and paying for a second always-on process on Scalingo; harder to invoke ad hoc (e.g. dry-run); duplicates work the platform already does well; risk of overlap/missed runs across deploys/restarts.

## Consequences

### Positive

- New scheduled tasks have a clear, low-ceremony path: write a use case (with InMemory tests), register it as an exported provider, add a script and a `cron.json` entry.
- Use cases remain the single unit of business logic — testable in isolation, drivable from HTTP, events, or cron.
- One-shot containers are cheap, isolated, and observable via standard Scalingo logs.
- Scripts can accept flags (e.g. `--dry-run`) to support manual invocations via `scalingo run`.

### Negative

- Scheduling logic is platform-specific (Scalingo `cron.json`); a future migration would require porting the schedule definitions.
- Discovering all scheduled tasks requires reading `docs/scheduled-tasks.md` rather than browsing a single folder — the doc must be kept in sync.
- Each task pays the cost of bootstrapping an `AppModule` context on every run (acceptable for infrequent jobs, would not scale to high-frequency ones).

## Links

- Related ADRs: [ADR-0001](0001-clean-hexagonal-architecture.md)
- Convention doc: [`docs/scheduled-tasks.md`](../scheduled-tasks.md)
- First instance: `apps/api/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.ts`
