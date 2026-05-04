# Newsletter Subscription Sync — Design Spec

> Daily scheduled task that pulls newsletter subscription status from the ADEME CRM and updates our `users.subscribed_to_newsletter` column.

## Context

Newsletter subscription status drifts between Bénéfriches and the ADEME CRM. Users can change their state in places we don't control (CRM-hosted subscription page at `https://cloud.contact.ademe.fr/benefriches`, unsubscribe link in newsletters), so our local `subscribed_to_newsletter` column quickly becomes inaccurate.

The colleague consuming this data uses it to:
- Target users for follow-up calls and emails
- Produce subscription stats (their CRM permissions don't allow direct exports)

The data is not critical, so eventual consistency via a daily sync is acceptable. The CRM does not provide webhooks; we will pull on a schedule.

## Scope

### In scope

- New use case `syncNewsletterSubscriptions` in `apps/api/src/marketing/core/usecases/`
- Extension of `CRMGateway` with a read method (`findContactByEmail`) returning the contact's subscription status, plus its `ConnectCrm` and `FakeCrm` implementations
- Users-listing query to feed the use case
- A users-side write to update `subscribed_to_newsletter` (no migration — column already exists)
- NestJS standalone bootstrap entry point as a marketing-module primary adapter: `apps/api/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.ts`
- Scalingo `cron.json` at `apps/api/scalingo/cron.json` running once a day
- Documentation entry on scheduled tasks (see [Documentation](#documentation))

### Out of scope (separate follow-up)

- Fixing the signup write path so it doesn't overwrite an existing CRM subscription — the colleague confirmed this scenario is uncommon, and the CRM API may already do additive-only updates (to verify separately).
- Removing the `subscribed_to_newsletter` column in favor of computing on demand.
- Surfacing subscription stats in the app.

## CRM API

- Endpoint: `GET /api/v1/personnes/mail/{email_address}` — fetches a single contact by email.
- No bulk listing of subscribed contacts is available; we iterate over our users one at a time.
- No documented rate limiting. With ~1200 users, sequential calls are acceptable; concurrency can be revisited if total runtime becomes a problem.

### Response shape (verified against staging)

A 200 response wraps the contact in an envelope with a `success` flag:

```json
{
  "correlationId": "...",
  "success": true,
  "timestamp": "...",
  "message": "Contact recupéré avec succès",
  "email": "stephane.ruhlmann@ext.beta.gouv.fr",
  "contact": {
    "email": "stephane.ruhlmann@ext.beta.gouv.fr",
    "nom": "RUHLMANN",
    "prenom": "Stéphane",
    "actif": true,
    "listeAbonnementNewsletter": ["Bénéfriches"],
    "source": ["Bénéfriches"]
  }
}
```

**Subscription mapping**: `subscribedToNewsletter = contact.listeAbonnementNewsletter?.includes("Bénéfriches") ?? false`.

- The `listeAbonnementNewsletter` field is an array of newsletter names (a contact may be subscribed to multiple newsletters across the ADEME). We only care about `"Bénéfriches"`.
- An empty array, missing key, or `null` value all mean unsubscribed.
- The CRM also exposes `actif` (account-level active flag). For now we treat `actif: false` the same as the absence of `"Bénéfriches"` in `listeAbonnementNewsletter` — i.e. unsubscribed — since an inactive account can't receive mail. If the colleague needs to distinguish "deactivated" from "unsubscribed" later, we can split the counters.

**Newsletter name constant**: introduce `BENEFRICHES_NEWSLETTER_NAME = "Bénéfriches"` next to the existing `CONNECT_SOURCE = "Bénéfriches"` constant in `ConnectCrm.ts` (same string today, but conceptually different — source vs. newsletter name — so name them separately).

**404 vs other errors**: a 404 response means contact-not-found and maps to `null` (Scenario 5/6). The envelope's `success: false` on a 200 response is treated the same as a 404 (also maps to `null`). Other HTTP errors propagate and are caught by the use case's per-user try/catch (Scenario 7).

## Use Case: `syncNewsletterSubscriptions`

The use case takes a `{ dryRun: boolean }` request and returns a summary `TResult`:

```typescript
type Request = { dryRun: boolean };

type Summary = {
  totalUsers: number;
  updated: number;        // column would change / was changed to match CRM
  unchanged: number;      // column already matched CRM
  missingInCrm: number;   // contact not found in CRM (would set / set to false + warning logged)
  errored: number;        // CRM call failed for that user
  dryRun: boolean;        // echoed in the summary
};
type Result = TResult<Summary, never>;
```

Errors per user are caught and logged; the use case never aborts the run partway through. There is no top-level error case (hence `never`) — individual failures appear in the `errored` count.

### Dry-run mode

When `dryRun` is `true`, all reads and decisions happen identically (CRM is queried, drift is detected, counters are incremented the same way) but the users write (`updateSubscriptionStatus`) is **not called**. The start, per-drift, and summary log lines are all prefixed `[DRY RUN]` so they're unambiguous in Scalingo logs.

Dry-run is the way to audit drift before turning the daily cron on, and to investigate suspected drift later without mutating data.

### Logging

The use case emits the following log lines on every run (real or dry-run):

- One `info` line at start: `Newsletter subscription sync started`.
- One `info` line per drifted user (CRM contact found and value differs from DB), including the email and both values: `Drift detected: email=<email>, db=<bool>, crm=<bool>`. Drift logs are the primary signal for auditing what would change in dry-run and what was changed in a real run.
- One `warn` line per user missing in CRM, including the email and userId.
- One `error` line per user whose CRM call failed, including the email, userId, and the original error.
- One final `info` summary line including all counters and the run duration in milliseconds (`durationMs=<n>`).

### Dependencies

- `UsersQuery` (new or extended) — returns `{ id, email, subscribedToNewsletter }[]` for all users
- `UsersRepository` (existing or extended) — exposes `updateSubscriptionStatus(userId, subscribed)`
- `CRMGateway.findContactByEmail(email)` — returns `{ subscribedToNewsletter: boolean } | null`
- `AppLogger` — for per-user warnings and the final summary

### Scenarios (one unit test per row)

| # | User column | CRM contact | CRM subscribed | Expected DB write | Counter incremented | Log |
|---|-------------|-------------|----------------|-------------------|---------------------|-----|
| 1 | `false` | found | `true` | set to `true` | `updated` | `info`: drift detected (email + db + crm) |
| 2 | `true` | found | `false` | set to `false` | `updated` | `info`: drift detected (email + db + crm) |
| 3 | `true` | found | `true` | none | `unchanged` | — |
| 4 | `false` | found | `false` | none | `unchanged` | — |
| 5 | `true` | not found | — | set to `false` | `missingInCrm` | `warn`: contact missing in CRM (email + userId) |
| 6 | `false` | not found | — | none (already false) | `missingInCrm` | `warn`: contact missing in CRM (email + userId) |
| 7 | any | API error | — | none | `errored` | `error`: CRM call failed (email + userId + error) |
| 8 | — | — | — | — | summary at end | `info`: summary with all counters and `durationMs` |

Plus:

| # | Scenario | Expected behavior |
|---|----------|-------------------|
| 9 | Zero users in DB | No CRM calls; summary all zeros |
| 10 | One user errors, others succeed | Run completes; failed user counted in `errored`, others processed normally |
| 11 | `dryRun: true`, drift present | Counters identical to a real run, but `updateSubscriptionStatus` is never called and summary log is prefixed `[DRY RUN]` |

Each row above maps to a single `it(...)` in `syncNewsletterSubscriptions.usecase.spec.ts`, using `InMemoryCRMGateway` (extending `FakeCrm`) and an InMemory users repository/query.

## Entry Point

The bootstrap script lives inside the owning module as a **primary adapter**, alongside the module's existing event handlers — it's just another way to drive the use case from outside the process, no different in role from a controller or event handler. Keeping it inside the module preserves clean-architecture boundaries and avoids a top-level `scripts/` grab-bag. The `.script.ts` suffix distinguishes it from controllers and event handlers.

`apps/api/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.ts`:

```typescript
import { NestFactory } from "@nestjs/core";
import { AppModule } from "src/app.module";
import { SyncNewsletterSubscriptionsUseCase } from "src/marketing/core/usecases/syncNewsletterSubscriptions.usecase";

async function bootstrap() {
  const dryRun = process.argv.includes("--dry-run");
  const app = await NestFactory.createApplicationContext(AppModule);
  try {
    const useCase = app.get(SyncNewsletterSubscriptionsUseCase);
    await useCase.execute({ dryRun });
  } finally {
    await app.close();
  }
}
void bootstrap();
```

The use case is registered as a provider in `marketing.module.ts` so `app.get(...)` resolves it with all real dependencies wired.

The file compiles to `dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js` via the existing API build (the `tsconfig.json` uses `rootDir: "./"` + `outDir: "dist"`, the same shape as `dist/src/main.js`).

Dry-run invocation on Scalingo (one-off container, no cron involvement):

```
scalingo run cd apps/api && node ./dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js --dry-run
```

## Scalingo Cron

`apps/api/scalingo/cron.json`:

```json
{
  "jobs": [
    {
      "command": "0 4 * * * cd apps/api && node ./dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js",
      "size": "S"
    }
  ]
}
```

- `0 4 * * *` — every day at 04:00 UTC (early morning Paris time, off-peak).
- `size: S` — sufficient for a sequential run over ~1200 users.
- Output goes to Scalingo logs. The summary line at the end of the run is the at-a-glance health check; the per-drift `info` lines emitted during the run provide the audit trail of which subscriptions changed.

## Documentation

### New page: `docs/scheduled-tasks.md`

Create a new English-language documentation page covering scheduled tasks. Sections:

- **Overview** — scheduled tasks run on Scalingo via `cron.json`; one-shot containers, no long-running worker.
- **File location** — `apps/api/scalingo/cron.json`, sibling to the existing `Procfile`.
- **Cron format** — standard 5-field schedule prepended to the shell command, both inside the `command` field; timezone is UTC unless `TZ` is set on the Scalingo app.
- **Entry point convention** — each task lives **inside the owning module as a primary adapter**: `apps/api/src/<module>/adapters/primary/<task>.script.ts`. It bootstraps NestJS via `NestFactory.createApplicationContext`, resolves a use case from `AppModule`, and compiles to `apps/api/dist/src/<module>/adapters/primary/<task>.script.js`. The script sits alongside the module's controllers and event handlers — it's another primary-adapter way to drive a use case from outside the process. The `.script.ts` suffix distinguishes scripts from controllers/handlers; we don't use a top-level `apps/api/src/scripts/` directory.
- **Adding a new scheduled task** — step-by-step checklist:
  1. Write a use case in the relevant module's `core/usecases/`, with unit tests using InMemory gateways.
  2. Register the use case as a provider in the module.
  3. Create the bootstrap script at `apps/api/src/<module>/adapters/primary/<task>.script.ts`.
  4. Add a job entry to `apps/api/scalingo/cron.json`.
  5. Append a row to the **Current tasks** table on this page.
- **Current tasks** — table listing each scheduled task, its schedule (UTC), command, and purpose. Seeded with:

  | Task | Schedule (UTC) | Command | Purpose |
  |---|---|---|---|
  | Newsletter subscription sync | `0 4 * * *` (daily 04:00) | `cd apps/api && node ./dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js` | Pulls newsletter subscription status from the ADEME CRM into `users.subscribed_to_newsletter` |

- **Running a task manually (incl. dry-run)** — example using Scalingo one-off containers (`scalingo run ...`); reference the newsletter sync `--dry-run` flag as the canonical example.
- **Observability** — where to find logs in the Scalingo dashboard, and the recommended pattern of emitting a single summary `info` log line at the end of each task with key counters.

### README discoverability

The new page must be reachable from the top-level `README.md`, which currently has no link to `docs/`. Add a new top-level section titled **Documentation** (in French, matching the rest of the README), placed after **Build, lint et formattage**, listing the key technical documentation pages with one-line descriptions:

```markdown
## Documentation

- [Architecture Decision Records](./docs/adr/) — décisions d'architecture importantes
- [Spécifications](./docs/specs/) — spécifications de fonctionnalités
- [Tâches planifiées](./docs/scheduled-tasks.md) — tâches programmées (cron) exécutées sur Scalingo
- [Exemple de fonctionnalité de bout en bout](./docs/feature-example.md)
```

Future docs added to `docs/` should be linked from this section as well, so newcomers find them from the README rather than discovering `docs/` by accident.

## Validation

- `pnpm --filter api typecheck`
- `pnpm --filter api lint`
- `pnpm --filter api test:unit src/marketing` — covers all scenarios above
- `pnpm --filter api test:integration src/marketing` — covers the new `ConnectCrm.findContactByEmail` against the CRM (mocked HTTP, following existing `ConnectCrm` test patterns)
- Manual smoke test in staging: run `node dist/scripts/syncNewsletterSubscriptions.js` once, verify summary log and a few DB rows
