# Scripts

## Overview

Bénéfriches runs one-off entry-point scripts outside the normal HTTP request flow, on Scalingo one-shot containers — there is no long-running worker process. The container starts, runs the script, and exits. A script is either:

- **Scheduled**: wired into Scalingo's `cron.json`, triggered automatically on a schedule.
- **Manual**: triggered on demand by a human via `scalingo run`, with no cron entry.

Both kinds share the same code shape and conventions below — only how they're triggered differs.

## Entry point convention

Each script lives **inside the owning module as a primary adapter**:

```
apps/api/src/<module>/adapters/primary/<task>.script.ts
```

The script bootstraps NestJS via `NestFactory.createApplicationContext`, resolves a use case from `AppModule`, executes it, and closes the app. It compiles to:

```
apps/api/dist/src/<module>/adapters/primary/<task>.script.js
```

The script sits alongside the module's controllers and event handlers — it is just another primary-adapter way to drive a use case from outside the process. The `.script.ts` suffix distinguishes scripts from controllers and event handlers.

We deliberately do not use a top-level `apps/api/src/scripts/` directory: keeping each script inside its owning module preserves Clean Architecture module boundaries and avoids a grab-bag of unrelated entry points.

## Adding a new script

1. Write a use case in the relevant module's `core/`, with unit tests using InMemory gateways.
2. Register the use case as a provider in the module (using the factory pattern), and `export` it from the module so the bootstrap script can resolve it.
3. Create the bootstrap script at `apps/api/src/<module>/adapters/primary/<task>.script.ts`. It should call `NestFactory.createApplicationContext(AppModule)`, `app.get(<UseCase>)`, `useCase.execute(...)`, and finally `app.close()`.
4. If it should run automatically, add a job entry to `apps/api/scalingo/cron.json` with the schedule and command. Skip this step for a manual-only script.
5. Append a row to the matching table below (**Scheduled** or **Manual**).

## Scheduled

| Task                          | Schedule (UTC)             | Command                                                                                                 | Purpose                                                                                                                                          |
| ----------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Newsletter subscription sync  | `0 4 * * *` (daily 04:00)  | `cd apps/api && node ./dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js`       | Pulls newsletter subscription status from the ADEME CRM into `users.subscribed_to_newsletter`                                                    |
| Lifecycle email retry sweeper | `15 * * * *` (hourly, :15) | `cd apps/api && node ./dist/src/notifications/adapters/primary/retryLifecycleEmailDeliveries.script.js` | Retries failed and stranded pending lifecycle email deliveries (max 5 attempts, then `abandoned`). No-op when `LIFECYCLE_EMAILS_ENABLED` is off. |
| Daily lifecycle reminders | `0 8 * * *` (every day, 08:00 UTC = 10:00 Paris in summer, 09:00 in winter: DST drift accepted) | `cd apps/api && node ./dist/src/notifications/adapters/primary/sendDailyLifecycleReminders.script.js` | Sends the first site reminder (24–72 h after signup, no site) and the first project reminder (one per custom/express active site created 24–72 h ago with no project). Every day, not weekdays only: with the 72 h window, weekday-only runs would never remind people who register between Thursday 08:00 and Friday 08:00. `--dry-run` logs the cohort and sends nothing. No-op when `LIFECYCLE_EMAILS_ENABLED` is off; skips the reminders with a warning when `LIFECYCLE_EMAILS_CONTACT_*` is incomplete. |

To list the cron tasks currently registered for an app:

```bash
scalingo --region <region> --app <app-name> cron-tasks
```

This shows each job's schedule and command, as picked up from `apps/api/scalingo/cron.json` (sibling to the existing `apps/api/scalingo/Procfile`) at deploy time. Each entry's `command` field combines a standard 5-field cron schedule with the shell command to execute, both as a single string:

```
0 4 * * * cd apps/api && node ./dist/src/<module>/adapters/primary/<task>.script.js
```

Schedules use **UTC** unless the `TZ` environment variable is set on the Scalingo app.

## Manual

| Script                     | Command                                                                                 | Purpose                                                                                                                                |
| --------------------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Revoke unused auth tokens  | `cd apps/api && node ./dist/src/auth/adapters/primary/revokeUnusedAuthTokens.script.js`  | Revokes every outstanding (unused, not-yet-revoked) magic-link authentication attempt, stamping its `revoked_at`. Run on demand, e.g. to invalidate all pending login links as a security precaution. |
| Lifecycle email preview | `cd apps/api && node ./dist/src/notifications/adapters/primary/sendLifecycleEmailPreview.script.js --type=welcome --to=prenom.nom@ademe.fr` | Sends one lifecycle email type (`--type=welcome`, `--type=first-site-reminder`, `--type=first-project-reminder` or `--type=project-impacts-summary`), rendered with sample data, to one or more explicitly given addresses so the team can review it in a real mail client. `--type=first-project-reminder` sends two samples to each address, a friche and an agricultural site (the first paragraph depends on the nature); their `Renseigner mon projet` link points at a sample site id that does not exist, so it leads to an error page. `--type=project-impacts-summary` sends two samples to each address, a favourable and an unfavourable evaluation of a sample project (their card links lead to an error page too); with `--project-id=<id>` (only with that type, at most once) it sends one email rendered from that real project instead: its name and results (a real user's data on production, so use team addresses only), still with the sample user's unsubscribe link. Ignores `LIFECYCLE_EMAILS_ENABLED`, bypasses the unsubscribe and suppression checks, and writes no `lifecycle_email_deliveries` row. Its unsubscribe link is signed for a fixed sample user id that matches no account, so clicking it shows the real confirmation page without unsubscribing anyone. Recipients are always explicit — there is no cohort mode. |

## Running a script manually (incl. dry-run)

Any script — scheduled or manual — can be run on demand via Scalingo one-off containers using `scalingo run`:

```bash
scalingo --region <region> run --app <app-name> "cd apps/api && node ./dist/src/<module>/adapters/primary/<task>.script.js"
```

The newsletter-sync script accepts a `--dry-run` flag that performs all reads and decisions but skips the write step:

```bash
scalingo --region <region> run --app <app-name> "cd apps/api && node ./dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js --dry-run"
```

The daily lifecycle reminders job accepts `--dry-run` too: it computes and logs each eligible cohort (one `[DRY RUN] Eligible for first site reminder: …` line per user, then its summary; then one `[DRY RUN] Eligible for first project reminder: siteId=…, siteName=…, siteNature=…, userId=…, email=…, siteCreatedAt=…` line per site, then its summary) and sends nothing and writes no ledger row, whatever `LIFECYCLE_EMAILS_ENABLED` says. Run it against production data before turning the kill switch on:

```bash
scalingo --region <region> run --app <app-name> "cd apps/api && node ./dist/src/notifications/adapters/primary/sendDailyLifecycleReminders.script.js --dry-run"
```

Without `--dry-run`, the same command performs the real run. Not every script supports `--dry-run` — check the script's source.

## Observability

Output from each run goes to the Scalingo logs, viewable in the Scalingo dashboard or via `scalingo --region <region> logs --app <app-name>`.

The recommended pattern is to emit a single summary `info` log line at the end of each script with the key counters for the run (e.g., total processed, updated, errored). This makes it easy to spot anomalies (an unexpected spike in errors, zero processed, etc.) without paging through per-record logs.
