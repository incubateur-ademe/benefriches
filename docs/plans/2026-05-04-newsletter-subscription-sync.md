# Feature: Newsletter Subscription Sync

> Implementation plan derived from [`docs/specs/2026-05-04-newsletter-subscription-sync.md`](../specs/2026-05-04-newsletter-subscription-sync.md). The spec is the source of truth for design decisions; this plan only sequences the work.

## Feature Overview

A daily Scalingo cron job pulls each Bénéfriches user's newsletter subscription status from the ADEME CRM (`GET /api/v1/personnes/mail/{email}`) and reconciles `users.subscribed_to_newsletter`. The work is implemented as a NestJS `syncNewsletterSubscriptions` use case bootstrapped by a one-shot script (`apps/api/src/scripts/syncNewsletterSubscriptions.ts`). A `--dry-run` flag audits drift without writes. A summary log line at the end of each run is the primary observability surface.

## User Story

As the colleague responsible for newsletter targeting and stats, I want `users.subscribed_to_newsletter` to reflect the current ADEME CRM state every day, so that follow-up campaigns and stats are based on accurate data even when users change their subscription via the CRM-hosted page or unsubscribe links.

## Scope

- [x] **API-only** (use case, gateway extensions, query, bootstrap script, cron config, docs)
- [ ] Web-only
- [ ] Full-stack
- [ ] Shared package

## Solution Statement

Add a marketing-module use case `SyncNewsletterSubscriptionsUseCase` that:
1. Lists every user (id, email, current `subscribedToNewsletter`) via a marketing-owned `UsersQuery`.
2. For each user, calls `CRMGateway.findContactByEmail(email)` (new method).
3. Decides per-user action — update / unchanged / missing-in-CRM (write `false`) / errored — and aggregates counters.
4. Calls `UsersRepository.updateSubscriptionStatus(userId, subscribed)` only when not in dry-run.
5. Emits per-user `warn`/`error` logs and a final `info` summary line.

A bootstrap script at `apps/api/src/scripts/syncNewsletterSubscriptions.ts` resolves the use case from `AppModule` and runs it. A `cron.json` at `apps/api/scalingo/cron.json` schedules it daily at 04:00 UTC.

## Relevant Files

### Pattern references (read, don't modify)

| Concern | File |
|---|---|
| Use case + AppLogger pattern | `apps/api/src/sites/core/usecases/createNewExpressSite.usecase.ts` |
| Use case unit test with logger | `apps/api/src/sites/core/usecases/createNewExpressSite.usecase.spec.ts` |
| Gateway interface (existing) | `apps/api/src/marketing/core/CRMGateway.ts` |
| `ConnectCrm` HTTP adapter (extend) | `apps/api/src/marketing/adapters/secondary/ConnectCrm.ts` |
| `FakeCrm` test double (extend) | `apps/api/src/marketing/adapters/secondary/FakeCrm.ts` |
| Marketing module wiring | `apps/api/src/marketing/adapters/primary/marketing.module.ts` |
| Existing user query (separate concern) | `apps/api/src/users/adapters/secondary/user-query/SqlUserQuery.ts` |
| Existing auth `UserRepository` | `apps/api/src/auth/adapters/user-repository/SqlUsersRepository.ts` |
| `AppLogger` interface (extend with `info`) | `apps/api/src/shared-kernel/logger.ts` |
| `NestJsAppLogger` impl (extend) | `apps/api/src/shared-kernel/adapters/logger/NestJsAppLogger.ts` |
| `SilentLogger` test double (extend) | `apps/api/src/shared-kernel/adapters/logger/SilentLogger.ts` |
| Existing main bootstrap | `apps/api/src/main.ts` |
| Existing scalingo config | `apps/api/scalingo/Procfile` |
| README structure | `README.md` |

### Existing use case test using `app.get(...)` from `AppModule`

Bootstrap script test pattern (Phase 4) follows the working-tree convention — script remains thin enough that we don't unit-test it; it's exercised manually via the staging smoke test in the spec.

## Files to Deliver

### Test Files
| File Path | Tests | Verifies |
|---|---|---|
| `apps/api/src/marketing/core/usecases/syncNewsletterSubscriptions.usecase.spec.ts` | Scenarios 1–11 from spec (one `it` per row) | `apps/api/src/marketing/core/usecases/syncNewsletterSubscriptions.usecase.ts` |
| `apps/api/src/marketing/adapters/secondary/ConnectCrm.findContactByEmail.integration-spec.ts` | 200 + `listeAbonnementNewsletter: ["Bénéfriches"]` → subscribed; empty / missing / other-newsletter → not subscribed; envelope `success: false` → null; 404 → null; 5xx → throws | `apps/api/src/marketing/adapters/secondary/ConnectCrm.ts` |

### Production Files
| File Path | Purpose |
|---|---|
| `apps/api/src/shared-kernel/logger.ts` | Add `info(message: string): void` to `AppLogger` interface |
| `apps/api/src/shared-kernel/adapters/logger/NestJsAppLogger.ts` | Implement `info` |
| `apps/api/src/shared-kernel/adapters/logger/SilentLogger.ts` | Implement no-op `info` |
| `apps/api/src/marketing/core/CRMGateway.ts` | Add `findContactByEmail(email): Promise<{ subscribedToNewsletter: boolean } \| null>` |
| `apps/api/src/marketing/adapters/secondary/FakeCrm.ts` | Implement `findContactByEmail` driven by an in-memory `_contacts` map; expose seed/throw helpers used by tests |
| `apps/api/src/marketing/adapters/secondary/ConnectCrm.ts` | Implement `findContactByEmail` calling `GET /api/v1/personnes/mail/{email}`; map 404 → `null`; map response field for `abonnementNewsletter` → `subscribedToNewsletter` |
| `apps/api/src/marketing/core/gateways/UsersQuery.ts` | New interface: `listAll(): Promise<{ id, email, subscribedToNewsletter }[]>` |
| `apps/api/src/marketing/core/gateways/UsersRepository.ts` | New interface: `updateSubscriptionStatus(userId, subscribed): Promise<void>` |
| `apps/api/src/marketing/adapters/secondary/users-query/InMemoryMarketingUsersQuery.ts` | In-memory test double with `_setUsers` |
| `apps/api/src/marketing/adapters/secondary/users-query/SqlMarketingUsersQuery.ts` | SQL impl: `SELECT id, email, subscribed_to_newsletter FROM users` |
| `apps/api/src/marketing/adapters/secondary/users-repository/InMemoryMarketingUsersRepository.ts` | In-memory test double recording calls |
| `apps/api/src/marketing/adapters/secondary/users-repository/SqlMarketingUsersRepository.ts` | SQL impl: `UPDATE users SET subscribed_to_newsletter = ? WHERE id = ?` |
| `apps/api/src/marketing/core/usecases/syncNewsletterSubscriptions.usecase.ts` | The use case (see Step 4) |
| `apps/api/src/marketing/adapters/primary/marketing.module.ts` | Wire new providers via factory pattern; export `SyncNewsletterSubscriptionsUseCase` |
| `apps/api/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.ts` | NestJS standalone bootstrap, lives in the marketing module's primary adapters (see Step 8) |
| `apps/api/scalingo/cron.json` | Daily schedule — command runs `node ./dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js` (see Step 9) |
| `docs/scheduled-tasks.md` | New English-language doc page (see spec §Documentation) |
| `README.md` | Add new top-level **Documentation** section after **Build, lint et formattage** (see spec §README discoverability) |

## Step by Step Tasks

### Step 1 — Extend `AppLogger` with `info`

The use case's summary line is `info`-level; `AppLogger` currently exposes only `warn`/`error`.

- Modify `apps/api/src/shared-kernel/logger.ts` → add `info(message: string): void`.
- Modify `apps/api/src/shared-kernel/adapters/logger/NestJsAppLogger.ts` → forward to `this.logger.log(message)`.
- Modify `apps/api/src/shared-kernel/adapters/logger/SilentLogger.ts` → no-op `info`.
- No new tests required (these are pass-through implementations covered by typecheck).

Run: `pnpm --filter api typecheck`

### Step 2 — Extend `CRMGateway` interface and `FakeCrm`

These have to land before the use case spec compiles.

- Modify `apps/api/src/marketing/core/CRMGateway.ts` → add `findContactByEmail(email: string): Promise<{ subscribedToNewsletter: boolean } | null>`.
- Modify `apps/api/src/marketing/adapters/secondary/FakeCrm.ts` to implement the new method:
  - Add a `_contacts: Map<string, { subscribedToNewsletter: boolean }>` and `_emailsToError: Set<string>`.
  - `findContactByEmail` returns the map entry, `null` if absent, throws if email is in `_emailsToError`.
  - Helpers like `_setContact(email, subscribed)` and `_setEmailError(email, error?)` make tests readable.
- Modify `apps/api/src/marketing/adapters/secondary/ConnectCrm.ts` → add a stub `findContactByEmail` that throws `new Error("not implemented")` for now — real impl lands in Step 6.
- Add `BENEFRICHES_NEWSLETTER_NAME = "Bénéfriches"` constant next to `CONNECT_SOURCE` in `ConnectCrm.ts` (same string today but conceptually different, per spec §CRM API).

Run: `pnpm --filter api typecheck && pnpm --filter api lint`

### Step 3 — Create marketing-owned user gateways with InMemory implementations

The marketing module owns its own ports rather than reusing `auth`'s — keeps clean-architecture boundaries clean.

- Create `apps/api/src/marketing/core/gateways/UsersQuery.ts` (export interface + injection token symbol).
- Create `apps/api/src/marketing/core/gateways/UsersRepository.ts` (export interface + injection token symbol).
- Create `InMemoryMarketingUsersQuery` with `_setUsers` helper.
- Create `InMemoryMarketingUsersRepository` recording calls in a `_updates: { userId, subscribed }[]` array.

Run: `pnpm --filter api typecheck`

### Step 4 — TDD the use case (Scenarios 1–11)

Create skeleton first, then add ONE `it(...)` at a time, RED → GREEN → REFACTOR.

**Files**:
- Create skeleton `apps/api/src/marketing/core/usecases/syncNewsletterSubscriptions.usecase.ts` — class implements `UseCase<{ dryRun: boolean }, TResult<Summary, never>>`, constructor takes `usersQuery`, `usersRepository`, `crm`, `logger`. `execute` returns `success({ totalUsers: 0, updated: 0, unchanged: 0, missingInCrm: 0, errored: 0, dryRun })` initially.
- Create `syncNewsletterSubscriptions.usecase.spec.ts` with a small `setup()` helper wiring `InMemoryMarketingUsersQuery`, `InMemoryMarketingUsersRepository`, `FakeCrm`, `SilentLogger`.

**Test order** (one cycle each — write, fail, implement, refactor):

1. **Scenario 9** — Zero users in DB → no CRM calls; summary `{ totalUsers: 0, updated: 0, unchanged: 0, missingInCrm: 0, errored: 0, dryRun: false }`. *(Trivially passes with skeleton — confirms harness.)*
2. **Scenario 1** — Column `false`, CRM `true` → write `true`, `updated++`. Drives the iteration loop, write call, and counter logic.
3. **Scenario 2** — Column `true`, CRM `false` → write `false`, `updated++`.
4. **Scenario 3** — Column `true`, CRM `true` → no write, `unchanged++`. Drives the "skip-when-equal" branch.
5. **Scenario 4** — Column `false`, CRM `false` → no write, `unchanged++`.
6. **Scenario 5** — Column `true`, CRM not found → write `false`, `missingInCrm++`, `logger.warn` includes email + userId.
7. **Scenario 6** — Column `false`, CRM not found → no write, `missingInCrm++`, `logger.warn` includes email + userId.
8. **Scenario 7** — CRM throws → no write, `errored++`, `logger.error` includes email + userId + error.
9. **Scenario 10** — One user errors, two succeed → counts split correctly; loop never aborts.
10. **Scenario 8** — Final `info` summary log emitted with all counters.
11. **Scenario 11** — `dryRun: true` with drift → counters identical to Scenario 1, `_updates` array empty, summary log prefixed `[DRY RUN]`, `summary.dryRun === true`.

Use a `SpyLogger` (subclass of `SilentLogger` capturing calls) where log-content assertions are needed; `SilentLogger` alone for tests that only check counters/writes.

After each test passes, run:
```
pnpm --filter api test:unit src/marketing/core/usecases/syncNewsletterSubscriptions.usecase.spec.ts
```

After Scenario 11 passes, run the broader marketing unit suite:
```
pnpm --filter api test:unit src/marketing
```

### Step 5 — Implement SQL adapters for `UsersQuery` / `UsersRepository`

No new migration — the `subscribed_to_newsletter` column already exists (added by `20250915091313_add_newsletter_subscription_to_users_table.ts`). Skip the `/create-database-migration` skill — the spec confirms no schema change.

- Create `apps/api/src/marketing/adapters/secondary/users-query/SqlMarketingUsersQuery.integration-spec.ts` — RED:
  - Test 1: `listAll()` returns empty array when no users.
  - Test 2: returns users with `id`, `email`, `subscribedToNewsletter` mapped from `subscribed_to_newsletter`.
- Create `SqlMarketingUsersQuery.ts` — GREEN: `select id, email, subscribed_to_newsletter from users`.
- Create `SqlMarketingUsersRepository.integration-spec.ts` — RED:
  - Test 1: `updateSubscriptionStatus(userId, true)` flips the column to `true`.
  - Test 2: `updateSubscriptionStatus(userId, false)` flips it to `false`.
  - Test 3: no-op when userId does not exist (does not throw).
- Create `SqlMarketingUsersRepository.ts` — GREEN: `update users set subscribed_to_newsletter = ? where id = ?`.

Use existing test fixtures for inserting test users (look at `apps/api/src/auth/adapters/user-repository/SqlUserRepository.integration-spec.ts` for the pattern).

Run after each test: `pnpm --filter api test:integration src/marketing/adapters/secondary/users-query` then `pnpm --filter api test:integration src/marketing/adapters/secondary/users-repository`

### Step 6 — Implement real `ConnectCrm.findContactByEmail` (integration test)

The CRM response shape is documented in spec §CRM API → Response shape. Subscription is derived from `contact.listeAbonnementNewsletter` containing `"Bénéfriches"`.

- Create `apps/api/src/marketing/adapters/secondary/ConnectCrm.findContactByEmail.integration-spec.ts` (mocked HTTP, following existing `ConnectCrm` HTTP-mocking pattern):
  - Test 1: 200 with `{ success: true, contact: { listeAbonnementNewsletter: ["Bénéfriches"] } }` → returns `{ subscribedToNewsletter: true }`.
  - Test 2: 200 with `{ success: true, contact: { listeAbonnementNewsletter: [] } }` → returns `{ subscribedToNewsletter: false }`.
  - Test 3: 200 with `{ success: true, contact: { listeAbonnementNewsletter: ["AutreNewsletter"] } }` → returns `{ subscribedToNewsletter: false }` (subscribed to other newsletters but not Bénéfriches).
  - Test 4: 200 with `contact.listeAbonnementNewsletter` missing/null → returns `{ subscribedToNewsletter: false }`.
  - Test 5: 200 with `{ success: false, ... }` (envelope error) → returns `null`.
  - Test 6: 404 → returns `null`.
  - Test 7: 500 (or other error) → throws.
- Replace stub in `ConnectCrm.ts` with real impl:
  - `GET ${CONNECT_CRM_HOST}/api/v1/personnes/mail/{email}` with auth headers.
  - On 200: if `body.success === false`, return `null`; otherwise return `{ subscribedToNewsletter: body.contact.listeAbonnementNewsletter?.includes(BENEFRICHES_NEWSLETTER_NAME) ?? false }`.
  - On 404: return `null` (catch axios error with `error.response?.status === 404`).
  - Other errors: propagate (caught by the use case's per-user try/catch → Scenario 7).
- Validate the response with a Zod schema (`getCrmContactResponseSchema`) defined in `ConnectCrm.ts` — only model the fields we read (`success`, `contact.listeAbonnementNewsletter`). This makes the mapper resilient to the CRM adding new fields.

Run: `pnpm --filter api test:integration src/marketing`

### Step 7 — Wire dependencies in `MarketingModule`

- Modify `apps/api/src/marketing/adapters/primary/marketing.module.ts`:
  - Add providers (factory pattern): `SyncNewsletterSubscriptionsUseCase`, `SqlMarketingUsersQuery`, `SqlMarketingUsersRepository`, and a `NestJsAppLogger("SyncNewsletterSubscriptions")` instance for the use case.
  - The factory injects `ConnectCrm` for `CRMGateway`, the SQL query/repo, and the logger.
  - Add `SqlMarketingUsersQuery`, `SqlMarketingUsersRepository` to providers.
  - Import `SqlConnectionModule` if not already pulled in (it is via the imports list — verify).
  - Export `SyncNewsletterSubscriptionsUseCase` so the bootstrap script can `app.get(...)` it.

Run: `pnpm --filter api typecheck && pnpm --filter api test:unit && pnpm --filter api test:integration`

### Step 8 — Bootstrap script (marketing primary adapter)

The script is the trigger that drives the use case from outside (the cron container), so it belongs alongside the HTTP handlers in `marketing/adapters/primary/`. The `.script.ts` suffix distinguishes it from event handlers / controllers.

- Create `apps/api/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.ts`:
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
- Verify it compiles:
  ```
  pnpm --filter api build
  test -f apps/api/dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js && echo OK
  ```

### Step 9 — Scalingo cron config

- Create `apps/api/scalingo/cron.json`:
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
  Working-directory pattern mirrors the existing `Procfile` (`cd apps/api && node ./dist/src/main.js`).

### Step 10 — Documentation page

- Create `docs/scheduled-tasks.md` with the sections listed in spec §Documentation:
  1. Overview
  2. File location
  3. Cron format
  4. Entry point convention — note this project's deviation from the spec: each task lives at `apps/api/src/<module>/adapters/primary/<task>.script.ts` (a primary adapter alongside the module's HTTP handlers), not in a top-level `apps/api/src/scripts/` directory. It bootstraps NestJS via `NestFactory.createApplicationContext`, resolves a use case from `AppModule`, and compiles to `apps/api/dist/src/<module>/adapters/primary/<task>.script.js`.
  5. Adding a new scheduled task (5-step checklist) — adjust step 3 to "Create the bootstrap script at `apps/api/src/<module>/adapters/primary/<task>.script.ts`."
  6. Current tasks (table seeded with the newsletter sync row, with the corrected command path)
  7. Running a task manually (incl. dry-run) — `scalingo run cd apps/api && node ./dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js --dry-run`
  8. Observability

### Step 11 — Link from README

- Modify top-level `README.md` — insert new section after `## Build, lint et formattage`:
  ```markdown
  ## Documentation

  - [Architecture Decision Records](./docs/adr/) — décisions d'architecture importantes
  - [Spécifications](./docs/specs/) — spécifications de fonctionnalités
  - [Tâches planifiées](./docs/scheduled-tasks.md) — tâches programmées (cron) exécutées sur Scalingo
  - [Exemple de fonctionnalité de bout en bout](./docs/feature-example.md)
  ```

## Acceptance Criteria

- All 11 scenarios from spec §Use Case have one passing unit test each.
- `ConnectCrm.findContactByEmail` integration test covers 200/200-false/404/error.
- `SqlMarketingUsersQuery` and `SqlMarketingUsersRepository` have integration tests against the real DB.
- `pnpm --filter api build` produces a runnable `dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js`.
- `cron.json` exists at `apps/api/scalingo/cron.json` with the daily 04:00 UTC schedule.
- `docs/scheduled-tasks.md` exists and contains all sections listed in spec §Documentation.
- `README.md` has a top-level **Documentation** section linking to the four entries listed in the spec.
- Use case never aborts mid-run when one user errors (Scenario 10).
- Dry-run never calls `updateSubscriptionStatus` and prefixes the summary log with `[DRY RUN]` (Scenario 11).

## Testing Strategy

### Unit Tests

- Eleven `it(...)` cases in `syncNewsletterSubscriptions.usecase.spec.ts` — one per spec scenario row. Each catches a distinct failure mode (drift directions, missing CRM contact behavior split by current column value, error isolation, summary logging, dry-run write suppression).

### Integration Tests

- `ConnectCrm.findContactByEmail` against mocked HTTP — 200 (true), 200 (false), 404, error.
- `SqlMarketingUsersQuery.listAll` — empty + populated.
- `SqlMarketingUsersRepository.updateSubscriptionStatus` — set true, set false, missing user no-op.

### E2E Tests

None required. This is a backend cron job with no user-facing UI surface. Per the project rule (see `feedback_e2e_vs_integration_test_scope` memory), exhaustive coverage lives in unit + integration tests.

### Edge Cases

Already covered by the 11 unit-test scenarios:
- Zero users (Scenario 9)
- One-user error doesn't abort run (Scenario 10)
- Dry-run suppresses writes but keeps counters (Scenario 11)

No additional edge-case tests needed — adding more would be redundant under the project's "distinct behavior per test" principle.

## Validation Commands

Run in order, narrowest first:

```bash
# 1. Use case unit tests (11 scenarios)
pnpm --filter api test:unit src/marketing/core/usecases/syncNewsletterSubscriptions.usecase.spec.ts

# 2. All marketing unit tests
pnpm --filter api test:unit src/marketing

# 3. Marketing integration tests (ConnectCrm + SQL adapters)
pnpm --filter api test:integration src/marketing

# 4. Full API quality gates
pnpm --filter api typecheck
pnpm --filter api lint
pnpm --filter api test

# 5. Build verification — produces runnable script
pnpm --filter api build
test -f apps/api/dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js && echo OK

# 6. Format check (in case docs/README touched it)
pnpm --filter api format:check
```

Manual smoke test (per spec §Validation, run after merge to staging):
```
scalingo run --app benefriches-staging cd apps/api && node ./dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js --dry-run
```
Verify the `[DRY RUN]` summary log line, then run without `--dry-run` and spot-check a few `users` rows.

## Notes

- **Entry-point location deviates from the spec**: The spec proposes `apps/api/src/scripts/syncNewsletterSubscriptions.ts` as a top-level scripts directory. This plan instead places it at `apps/api/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.ts` — co-located with the module's existing primary adapters (event handlers). Rationale: the script is just another way to drive the use case from outside the process, no different in role from a controller or event handler. Keeping it inside the owning module preserves clean-architecture module boundaries and avoids a top-level `scripts/` directory that would grow into a grab-bag. The `.script.ts` suffix distinguishes it from controllers/handlers. The `docs/scheduled-tasks.md` page documents this as the project's convention. Compiled output lands at `apps/api/dist/src/marketing/adapters/primary/syncNewsletterSubscriptions.script.js` (driven by `tsconfig.json`'s `rootDir: "./"` + `outDir: "dist"`, same shape as `dist/src/main.js`).
- **`AppLogger.info` extension**: The use case needs an `info` log for the summary; `AppLogger` currently has only `warn`/`error`. Step 1 extends the interface and both implementations. This is a small, additive shared-kernel change with no callers to migrate.
- **Marketing-owned user gateways**: The spec says "UsersQuery (new or extended)" / "UsersRepository (existing or extended)". This plan creates **new marketing-module gateways** rather than extending `auth/core/gateways/UsersRepository.ts`, to keep clean-architecture module boundaries clean (auth's repository deals with `User` aggregate + auth concerns; marketing only needs id/email/newsletter status). If the team prefers reuse, swap Step 3+5 to extend the auth interfaces — lower test count but more cross-module coupling.
- **No DB migration needed**: `subscribed_to_newsletter` already exists. Do **not** invoke `/create-database-migration`.
- **CRM 404 detection in `ConnectCrm`**: axios throws on non-2xx by default. The implementation catches `error.response?.status === 404` and returns `null`; everything else propagates and is caught by the use case's per-user try/catch (Scenario 7).
- **CRM response shape (verified)**: Per the staging response captured during planning, subscription state is read from `contact.listeAbonnementNewsletter` (an array of newsletter names) — not from a boolean field. We map `subscribedToNewsletter = listeAbonnementNewsletter.includes("Bénéfriches")`. The 200 response is wrapped in an envelope `{ success, contact }`; `success: false` is treated like a 404 (returns `null`). Add a `BENEFRICHES_NEWSLETTER_NAME` constant separate from the existing `CONNECT_SOURCE` (same string today, different concept).
- **Asymmetric write vs read mapping**: `createContact` writes `abonnementNewsletter: true` + `dateNewsletter` (a single boolean + date), but the read returns `listeAbonnementNewsletter: string[]`. The CRM internally translates the write into the array form. We don't try to unify these — the gateway interface returns `{ subscribedToNewsletter: boolean }` either way.
- **`actif` flag**: ignored for now; spec §CRM API explains why and when we'd revisit.
- **No env vars added**: Re-uses existing `CONNECT_CRM_HOST`, `CONNECT_CRM_CLIENT_ID`, `CONNECT_CRM_CLIENT_SECRET`. No `.env.example` / `.env.e2e` / `docker-compose.e2e.yml` changes needed.
- **Future follow-ups (out of scope, mentioned in spec)**: signup-write additivity verification, removing `subscribed_to_newsletter` in favor of on-demand compute, surfacing stats in the app.
