---
paths:
  - "apps/api/src/**/*.spec.ts"
  - "apps/api/src/**/*.integration-spec.ts"
  - "apps/api/test/**/*.ts"
---

# API tests: node:test specifics

How we design tests (what to assert, one `it` per case, fakes over mocks) is in [testing.md](../testing.md). This rule only covers the api's node:test setup and its traps.

## Running

- Tests use `node:test` and `node:assert/strict`, compiled by [swc-esm-loader.mjs](../../../apps/api/test/swc-esm-loader.mjs). Suites: `pnpm --filter api test:unit` (`*.spec.ts`) and `pnpm --filter api test:integration` (`*.integration-spec.ts`); per-file commands are in the root [AGENTS.md](../../../AGENTS.md).
- An integration spec only works through a `test:integration*` script: it preloads [integration-per-test-hooks.ts](../../../apps/api/test/integration-per-test-hooks.ts) and runs [integration-global-setup.mts](../../../apps/api/test/integration-global-setup.mts), which starts Postgres with testcontainers (Docker must be running), then migrates and seeds it. A bare `node --test` has no database.
- `typescript/no-floating-promises` is off in spec files: write `describe(…)` and `it(…)` without a `void` prefix.

## Assertions

- `assert.deepStrictEqual` tells `{ k: undefined }` apart from `{}`. When Zod strips an absent optional field, leave the key out of the expected object (`...(v !== undefined ? { k: v } : {})`); when the code assigns `undefined` itself (`cond ? fakeNow : undefined`), put `k: undefined` in the expected object. Both cases: [createUser.usecase.spec.ts](../../../apps/api/src/auth/core/createUser.usecase.spec.ts).
- For values with non-deterministic fields (a DB-generated `created_at`, a computed cost), use `assertShapeEquals(actual, staticFields, { created_at: isDate })` from [assertShapeEquals.ts](../../../apps/api/test/assertShapeEquals.ts): the predicates (`isDate`, `isNumber`) check the listed keys, every other key is compared by value, and an extra key fails.
- Put `satisfies` on the expected value (`} satisfies SiteCreatedEvent`, `] satisfies SiteEntity[]`) so a renamed field fails the typecheck, not only the run: [createNewSite.usecase.spec.ts](../../../apps/api/src/sites/core/usecases/createNewSite.usecase.spec.ts).
- A node:test mock call is an object: read its arguments with `fn.mock.calls[0]?.arguments` and count with `fn.mock.callCount()`, as in [ConnectCrm.spec.ts](../../../apps/api/src/marketing/adapters/secondary/ConnectCrm.spec.ts), which also freezes `Date` with `mock.timers`.

## Unit tests

- Pass an `InMemoryEventPublisher` and assert its `events` array: the expected events (constant name, full payload) on success, `eventPublisher.events.length === 0` on every error path (createNewSite.usecase.spec.ts).
- `DeterministicUuidGenerator` hands ids out last-first: after `nextUuids("failure-event-id", "attempt-event-id")`, the first `generate()` returns `"attempt-event-id"` ([sendAuthLink.usecase.spec.ts](../../../apps/api/src/auth/core/sendAuthLink.usecase.spec.ts)). It throws once the list is empty, so give it one id per id the use case generates. Dates come from `DeterministicDateProvider(fakeNow)`.
- `test:unit` has no preload hook, so nothing restores mocks between unit tests: only spy on objects created inside the test, like `mock.method(evalutionQuery, …)` in [getUserSiteEvaluations.usecase.spec.ts](../../../apps/api/src/site-evaluations/core/usecases/getUserSiteEvaluations.usecase.spec.ts).

## Integration tests

- After each test the preloaded hook calls `mock.restoreAll()` and empties the tables in [tablesToCleanUp.ts](../../../apps/api/test/tablesToCleanUp.ts) (seeded reference tables such as `cities` keep their rows): don't clean tables or restore mocks in a spec.
- Repository and query specs need no Nest app: open a connection with `knex(knexConfig)` in `before()` and `destroy()` it in `after()`, as in [SqlUserRepository.integration-spec.ts](../../../apps/api/src/auth/adapters/user-repository/SqlUserRepository.integration-spec.ts).
- Controller specs boot the app with `createTestApp()` from [testApp.ts](../../../apps/api/test/testApp.ts), then take the connection with `app.get(SqlConnection)` to seed and read rows: [sites.controller.integration-spec.ts](../../../apps/api/src/sites/adapters/primary/sites.controller.integration-spec.ts). Authenticate with `authenticateUser(app)(user)` (user from `UserBuilder`) and send the token in the `ACCESS_TOKEN_COOKIE_KEY` cookie.
- `createTestApp()` already fakes the outside world: `HttpService` throws on every call, `ConnectCrm` is `FakeCrm`, and the photovoltaic and Mutafriches adapters are fakes. Replace anything else with `providerOverrides: [{ token, useValue }]` (or `useClass`).
- Each guarded route gets a 401 test without the cookie; each validated body or query gets a 400 test that checks the field in `response.body.errors[].path`.
- Event handler specs publish through `app.get(RealEventPublisher)`, the publisher the `@OnEvent` handlers listen to, and override the handler's gateways with fakes through `providerOverrides` (the token is the concrete class the module injects, e.g. `RealDateProvider`): [loginSucceeded.handler.integration-spec.ts](../../../apps/api/src/marketing/adapters/primary/loginSucceeded.handler.integration-spec.ts).
- node-postgres sends a JS array parameter as a Postgres array literal, not JSON. To seed a `jsonb` column, bind `JSON.stringify(value)` and cast it with `?::jsonb` in `sqlConnection.raw(…)`, as in [reconversionCompatibility.controller.integration-spec.ts](../../../apps/api/src/reconversion-compatibility/adapters/primary/reconversionCompatibility.controller.integration-spec.ts).
