# [ADR-0012] Loader stack for API integration tests under node:test

- **Date**: 2026-06-24
- **Status**: Accepted

> **Revision note (2026-06-24)**: This ADR replaces an earlier version that
> documented a `tsx/esm` + `esm-path-aliases.mjs` loader stack. That stack never
> actually resolved path aliases on Node ≥ 24.12 (it failed with
> `Cannot find module 'test/...'` on every spec) and its rationale was based on an
> incorrect model of how `@swc-node/register` resolves aliases. The mechanism and
> the chosen stack below are the corrected, empirically verified versions.

## Context

As part of the API Vitest → `node:test` migration (see [ADR-0013](0013-migrate-api-test-suite-from-vitest-to-node-test.md)), unit tests migrated cleanly with a single flag:

```
node --require @swc-node/register --test 'src/**/*.spec.ts'
```

Integration tests are harder because they add three constraints that unit tests do not have:

1. **NestJS DI needs `emitDecoratorMetadata`** — `testApp.ts` boots the full `AppModule`. NestJS resolves constructor dependencies via `Reflect.getMetadata('design:paramtypes', …)`, which is only populated when TypeScript is transpiled with `emitDecoratorMetadata`. SWC (via `@swc-node/register`, reading `.swcrc`) emits it; Node's native type-stripping and esbuild (tsx) do **not**.
2. **TypeScript path aliases** — specs import `src/*` and `test/*` (defined in `tsconfig.json` and `.swcrc`). `@swc-node/register` rewrites these to relative paths **at compile time** (it reads `jsc.baseUrl`/`jsc.paths` and emits resolved relative specifiers). It does *not* patch Node's runtime resolver. Any TypeScript that is **not** transpiled by SWC therefore loses alias resolution.
3. **Per-test DB isolation + global Docker setup** — a PostgreSQL testcontainer must start, migrate and seed once before any test (`--test-global-setup`), and every table must be truncated after each test (a global `afterEach`).

The difficulty is that these constraints interact badly with how `node:test` chooses between the CommonJS and ESM loaders. Settling the command required reproducing several failures on Node 24.16.

### Why aliases broke on Node ≥ 24.12

`@swc-node/register@1.11.1` resolves aliases purely at compile time — it does **not** monkey-patch `Module._resolveFilename`. The unit-test command works because every `.ts` it touches is compiled by SWC, so alias imports are already rewritten to relative paths before Node resolves anything.

The previous integration command layered `--import tsx/esm` on top. tsx forces `.ts` spec files onto the CommonJS loader but transpiles them **itself** (esbuild), without alias rewriting and without decorator metadata. The bare `src/*`/`test/*` specifiers then reached Node's stock CJS resolver and failed. The `--import ./test/esm-path-aliases.mjs` hook that was supposed to fix this never ran: **a module that only `export`s a `resolve` function and is loaded via `--import` does not install a loader hook** — `--import` merely *executes* the module. Hooks must be registered explicitly (`module.register()` / `module.registerHooks()`) or supplied via `--loader`.

Node 24.12.0 ([nodejs/node#60380](https://github.com/nodejs/node/pull/60380)) made main-thread ESM resolution fully synchronous, removing incidental fallbacks that had previously masked this gap — which is why the breakage surfaced specifically on Node ≥ 24.12.

## Decision

Run integration tests with:

```
node
  --require @swc-node/register
  --import ./test/force-ts-commonjs.mjs
  --import ./test/integration-per-test-hooks.ts
  --test-global-setup=./test/integration-global-setup.mts
  --test-concurrency=1
  --test 'src/**/*.integration-spec.ts'
```

`tsx/esm` and the custom ESM path-alias hook are gone. The only new file is `test/force-ts-commonjs.mjs` (~5 functional lines), which registers a synchronous resolve hook (`module.registerHooks()`) that forces every `.ts` URL to `format: "commonjs"`, routing all TypeScript through `@swc-node/register` (decorator metadata + compile-time alias rewriting).

### The constraints, established empirically (Node 24.16)

- **(A) Specs must load as CommonJS via swc-node.** That is the only path that gives both decorator metadata and alias resolution. Node 24's native type-stripping (default) gives neither.
- **(B) The per-test `afterEach` hook must be an `--import` preload.** When the hook is a `--require` preload, registering `node:test` hooks at module-load time makes the runner begin executing tests *before* `--test-global-setup` resolves (reproduced with one and with multiple spec files; independent of the hook's file type).
- **(C) The mere presence of any `--import` preload flips `node:test` to load `.ts` test files via the ESM loader** (native strip) — off the swc-node CJS path, breaking (A). Reproduced with a no-op `.mjs` *and* a `.cjs` preload, so it is not specific to TypeScript or to a particular loader.

(A) and (C) directly conflict: the hook forces an `--import`, which forces specs to ESM, which loses aliases + metadata. `force-ts-commonjs.mjs` resolves the conflict by forcing `.ts` back onto the CJS loader.

## Options Considered

### Option 1 — `--require @swc-node/register` only (like unit tests)

- **Pros**: identical to the unit-test command.
- **Cons**: provides no way to run the global `afterEach` with correct ordering. Loading the hook via `--require` triggers constraint (B): tests start before global setup finishes.

### Option 2 — `tsx` CLI (`tsx --test …`) or `--import tsx/esm`

- **Cons**: tsx uses esbuild, which emits no decorator metadata (NestJS DI fails with HTTP 500s) and does not resolve tsconfig paths in its ESM/CJS-interop path (the `Cannot find module 'test/...'` failure). This was the previously-shipped, non-functional stack.

### Option 3 — `@swc-node/register/esm-register` as the ESM loader

- **Cons**: empirically broken for this use case on Node 24.16 — it cannot resolve a relative `--import ./path.ts` entrypoint, throws `ERR_REQUIRE_CYCLE_MODULE` for an absolute `.ts` entrypoint, and forces imported `.ts` modules to `commonjs` so ESM named imports fail with *"does not provide an export named …"*.

### Option 4 — `ts-node/esm`

- **Cons**: does not resolve tsconfig path aliases in hook mode and is markedly slower (full `tsc`, not SWC/esbuild).

### Option 5 — write the per-test hook and/or global setup in plain JS

- The **per-test hook** in JS does not help: it must still be `--import` (constraint B), which still flips specs to ESM (constraint C), so `force-ts-commonjs.mjs` is still required; and as `.ts` it stays type-checked and is compiled by swc-node anyway.
- The **global setup** in JS *is* viable (it has no alias imports), but it loses type-safety on the testcontainers/Docker orchestration and trips a type-aware lint rule (`no-unsafe-call`) on the untyped instance. Keeping it as TypeScript-but-ESM-explicit (`.mts`) achieves the same goal (no `MODULE_TYPELESS_PACKAGE_JSON` warning) with no downside — so the global setup is `.mts`, not `.mjs`.

### Option 6 — `--require @swc-node/register` + `--import ./test/force-ts-commonjs.mjs` + `--import` hook (chosen)

- **Pros**: every concern is handled by a supported public API. swc-node does TS compilation (metadata + aliases); a one-rule `registerHooks` resolve hook keeps specs on the CJS path; the per-test hook gets correct ordering via `--import`. No tsx, no monkey-patching of Node internals, no reliance on the resolver fallbacks removed by #60380.
- **Cons**: one small custom loader file (`force-ts-commonjs.mjs`) must exist; the CJS/ESM-loader interaction it works around is subtle and undocumented, so the command needs care when upgrading Node.

## Consequences

### Why each flag is necessary

**`--require @swc-node/register`** — installs the CJS TypeScript compiler hook. Every `.ts` (specs, source, the per-test hook) is transpiled by SWC, giving `emitDecoratorMetadata` and compile-time `src/*`/`test/*` alias rewriting.

**`--import ./test/force-ts-commonjs.mjs`** — registers, via the synchronous in-thread `module.registerHooks()` API, a `resolve` hook that returns `format: "commonjs"` for any URL ending in `.ts`. This sends spec files (and the `.ts` per-test hook) back to the CommonJS loader — i.e. to swc-node — even though the presence of `--import` would otherwise make `node:test` load them as ESM via native type-stripping (constraint C). It must register the hook explicitly; merely exporting `resolve` would do nothing.

**`--import ./test/integration-per-test-hooks.ts`** — registers the global `afterEach` that truncates all tables and restores mocks. Must be `--import`, not `--require`, for correct ordering against `--test-global-setup` (constraint B). It is forced to CommonJS by `force-ts-commonjs.mjs`, so its `knexConfig` import (which uses the CJS `__dirname`) and its relative `.ts` imports resolve through swc-node.

**`--test-global-setup=./test/integration-global-setup.mts`** — starts the PostgreSQL testcontainer, runs Knex migrations and seeds before any test. It has no alias imports and needs no decorator metadata, so it loads as ESM via Node's native type-stripping. The `.mts` extension makes it unambiguously ESM (no `MODULE_TYPELESS_PACKAGE_JSON` warning). Knex migrations run in a child process via `spawn("pnpm", ["knex:migrate-latest"])` because the Knex JS API is unreliable with TypeScript/ESM migration files (see [knex/knex#5323](https://github.com/knex/knex/issues/5323)).

**`--test-concurrency=1`** — tests share one database and truncate it between runs, so they must not run concurrently.

### Positive

- Integration tests pass on Node 24.16 (and the whole 24.x line): 290 tests, 96 suites, 0 failures.
- One fewer `--import` flag than the previous stack, and `tsx` is removed from the test loader (it remains a devDependency only for standalone utility scripts under `ademe-csv-import/` and `sql-knex/scripts/`).
- Every mechanism is a supported public API; nothing depends on the resolver fallbacks removed by Node 24.12.
- All TypeScript flows through swc-node; the only file relying on native type-stripping is the alias-free global setup.
- No changes to application source imports.

### Negative

- `force-ts-commonjs.mjs` is a custom loader file that encodes a subtle, undocumented CJS/ESM-loader interaction; it needs review on Node major/minor upgrades.
- The `--require`-vs-`--import` ordering constraint for hooks (B) and the `--import`-flips-specs behaviour (C) are both undocumented and were found empirically; they may change in future Node versions.

## Links

- Related ADRs: [ADR-0011](0011-use-node-test-for-shared-package-unit-tests.md), [ADR-0013](0013-migrate-api-test-suite-from-vitest-to-node-test.md)
- Node.js PR making main-thread ESM resolution synchronous (broke incidental CJS-resolver fallbacks): [nodejs/node#60380](https://github.com/nodejs/node/pull/60380) (shipped in v24.12.0)
- `module.registerHooks()` (synchronous, in-thread loader hooks): [nodejs.org/api/module.html#moduleregisterhooksoptions](https://nodejs.org/api/module.html#moduleregisterhooksoptions)
- Knex TypeScript/ESM migration file issue: [knex/knex#5323](https://github.com/knex/knex/issues/5323)
