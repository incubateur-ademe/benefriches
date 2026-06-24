# [ADR-0014] Migrate apps/api to ESM

- **Date**: 2026-06-24
- **Status**: Accepted

## Context

`apps/api` shipped as CommonJS even though `tsconfig.json` used `module: "NodeNext"`: without `"type": "module"` in `package.json`, NodeNext resolves to CJS, `nest build` (tsc) emitted `require(...)`, and `node dist/src/main.js` ran CommonJS.

We want the API to run as native **ESM** to align with modern Node (top-level `await`, `import.meta`, native ESM ecosystem packages) and with the rest of the toolchain (`packages/shared` already publishes ESM; Vite/web is ESM).

Adding `"type": "module"` flips every `.ts` in the package to ESM, which has wide blast radius:

1. **Build** — tsc under NodeNext ESM requires explicit `.js` extensions on all ~520 relative imports and cannot resolve the `src/*`/`test/*` tsconfig path aliases at runtime.
2. **Runtime idioms** — `__dirname` does not exist in ESM; CommonJS named imports of type-only symbols from CJS packages (notably `Knex`) fail at load.
3. **Tests** — this migration landed on top of the just-completed Vitest → `node:test` migration ([ADR-0013](0013-migrate-api-test-suite-from-vitest-to-node-test.md)), whose loader stack ([ADR-0012](0012-node-test-loader-stack-for-api-integration-tests.md)) was designed for a **CommonJS** package: it runs `.ts` through `@swc-node/register` (a CJS loader hook) to get `emitDecoratorMetadata` (NestJS DI) and path-alias rewriting. With `"type": "module"`, `.ts` defaults to ESM and bypasses that CJS hook entirely.

## Decision

Make `apps/api` a native ESM package (`"type": "module"`), keeping the `src/*`/`test/*` alias convention, by splitting compilation cleanly:

- **Build = SWC** (not tsc). `nest build` uses the SWC builder pointed at `swc.config.json` (`nest-cli.json` `builder: { type: "swc", options: { swcrcPath: "swc.config.json" } }`). That config emits ESM (`module.type: "es6"`), resolves the aliases (`jsc.baseUrl` + `jsc.paths`), appends real `.js` extensions (`module.resolveFully`), and emits decorator metadata (`legacyDecorator` + `decoratorMetadata`). So **source imports are unchanged** — no `.js` extensions and no alias rewrites in source; SWC does both at emit. The config carries an `exclude` so `nest build` skips `*.spec`/`*.integration-spec` files — no compiled test code in `dist/`, and no post-build cleanup step.
  - It is named `swc.config.json` (not `.swcrc`) for one reason: the test loader `import`s it as JSON, and Node rejects JSON import attributes on a `.swcrc` extension. nest's SWC builder reads it as a JSON file (deep-merged with tsconfig-derived defaults) and cannot consume a JS/TS config — so the config must stay JSON.
- **DI needs value imports, NOT `import type`.** NestJS resolves constructor dependencies from `design:paramtypes` metadata, which references the imported class. **SWC strictly elides `import type`** — unlike `tsc` and `@swc-node/register`, which retain such imports for decorator metadata — so a DI-injected class imported as `import type` compiles to `Object` metadata and silently breaks injection at runtime (type-check and lint pass; only booting catches it). Therefore every DI-injected **class** (use-cases + NestJS built-ins like `ConfigService`/`EventEmitter2`/`HttpService`) must be a value import, and oxlint's `typescript/consistent-type-imports` — which forces them to `import type` and is not decorator-aware — is **disabled**. Interfaces injected via `@Inject` tokens stay `import type` (their metadata is `Object` either way). The rebased node:test migration had converted these injected classes to `import type` (works under its tsc/swc-node stack); this migration converts them back to value imports.
- **Type-check = tsc, emit-free.** `tsconfig.json` uses `module: "esnext"` + `moduleResolution: "bundler"` + `noEmit: true`, so aliases resolve and relative imports need no `.js` at type-check time. `isolatedModules: true` is enabled to guarantee every file is safe for per-file (SWC) transpilation; this surfaced ~30 type-only symbols used in decorated signatures that are now `import type` (DI-safe — all are interfaces injected via `@Inject` tokens, so their metadata was always `Object`).
- **Runtime tooling = `tsx`.** The Knex CLI (dev `.ts` knexfile + migrations) and standalone scripts run via `tsx` (ESM TypeScript). `start:prod` is `node dist/src/main.js`; the Docker `:js` path runs the compiled ESM knexfile.
- **Source fixes.** `__dirname` → `import.meta.dirname` (8 sites); `Knex` and other genuinely type-only named imports from CJS packages → `import type`; seed files converted from CJS `exports.seed = …` to ESM `export async function seed`; DI-injected classes → value imports (see above).
- **Tests = a custom SWC ESM loader** (`test/swc-esm-loader.mjs`), replacing ADR-0012's `@swc-node/register` + `force-ts-commonjs.mjs` CJS stack. It is `nest build` run just-in-time, via synchronous in-thread hooks (`module.registerHooks`):
  - a **load** hook compiles each `.ts` with the **same `swc.config.json` the production build uses** — imported via a JSON import attribute (one SWC-config source of truth) — so `src/*`/`test/*` alias resolution (`jsc.paths`) and `emitDecoratorMetadata` (NestJS DI) are identical to production. Node's native `.ts` support only strips types — it does neither — so it cannot run this codebase. The loader drops the build-only `exclude` field so it still compiles the spec files the runner asks for.
  - a **resolve** hook makes the one test-only hop: SWC emits relative `.js` specifiers (alias resolved + extension appended by `module.resolveFully`, the `.ts`→`.js` convention); those `.js` files exist in `dist/` for production, but tests run from un-built source where only the `.ts` exists, so the hook maps `./x.js` → `./x.ts`. This is the standard "run TypeScript ESM from source" bridge (the same hop `tsx` / `ts-node` ESM perform).

  Tests now run as real ESM, transpiled identically to production.

```
test:unit         node --import ./test/swc-esm-loader.mjs --test 'src/**/*.spec.ts'
test:integration  node --import ./test/swc-esm-loader.mjs
                       --import ./test/integration-per-test-hooks.ts
                       --test-global-setup=./test/integration-global-setup.mts
                       --test-concurrency=1
                       --test 'src/**/*.integration-spec.ts'
```

This supersedes the loader stack of [ADR-0012](0012-node-test-loader-stack-for-api-integration-tests.md): `@swc-node/register` and `force-ts-commonjs.mjs` are removed.

## Options Considered

### Module resolution: SWC builder keeping the `src/*` alias (chosen)

- **Pros**: smallest source diff (aliases + extensionless imports untouched); SWC is already a dependency and is NestJS's officially recommended ESM compiler; vitest already used SWC for these files, so the runtime semantics were pre-validated.
- **Cons**: production compiler changes from tsc to SWC; type-check and emit are now two tools (mitigated: tsc stays for type-check only).

### Module resolution: pure tsc, drop alias, relative imports + `.js` everywhere

- **Cons**: a ~750-line mechanical codemod across ~250 files; abandons the established `src/*` convention. Rejected for churn and convention loss.

### Module resolution: keep alias via Node `#imports` subpath map

- **Cons**: requires renaming `src/*` → `#src/*` everywhere and still needs `.js` on every relative import; less conventional. Rejected.

### Tests: keep ADR-0012's CJS stack (`@swc-node/register` + `force-ts-commonjs.mjs`)

- **Pros**: zero test-stack change; already green.
- **Cons**: test compilation (CJS) would no longer match production (ESM), so ESM-only bugs slip through. This is not hypothetical — the `Knex` named-import failure and the seed `exports.seed` failure both pass under CJS tests and only crash under real ESM. `"type": "module"` also forces `force-ts-commonjs.mjs` onto the **unit** command too (a CJS package didn't need it), increasing the very complexity the ADR-0012 stack was trying to contain.

### Tests: `@swc-node/register/esm-register`

- **Cons**: empirically broken on Node 24 (documented in ADR-0012, Option 3) — it forces imported `.ts` to `commonjs`, causing `ERR_REQUIRE_CYCLE_MODULE` and breaking ESM named imports.

### Tests: custom SWC ESM loader (chosen)

- **Pros**: tests run as real ESM, identical to production, so ESM-only bugs surface in tests. The loader reads the **same `swc.config.json` as the build** (imported as JSON), so there is a single SWC-config source of truth and tests transpile exactly like production. It is not `esm-register`: it emits ESM (never forces CommonJS), so the `ERR_REQUIRE_CYCLE_MODULE` / broken-named-import failures of Option 3 do not apply. Removes `@swc-node/register` and `force-ts-commonjs.mjs`.
- **Cons**: one custom loader file (~70 lines) to maintain; it encodes Node 24 ESM-hook behaviour, so it needs review on Node upgrades. The unit command now needs the `--import` loader (a CJS package did not).

## Consequences

### Positive

- `apps/api` is native ESM end to end: `nest build` emits ESM, `node dist/src/main.js` and all `tsx`-run tooling are ESM, and tests run as ESM too.
- Full suite green as real ESM: **621 unit + 291 integration tests, 0 failures**; the app boots the entire NestJS DI graph (24 modules) under `node dist/src/main.js`.
- Tests now exercise the same module system as production, so ESM-only regressions are caught by CI rather than at runtime.
- One SWC-config source of truth: both `nest build` and the test loader read the same `swc.config.json`, so tests transpile identically to production.
- `@swc-node/register` and `force-ts-commonjs.mjs` are removed.

### Negative

- Two compilers in play: SWC (emit) and tsc (type-check only). Type-check correctness and runtime emit are validated by different tools; they agree today but could drift (mitigated by `isolatedModules` + the SWC build being the single source of emitted JS).
- **`consistent-type-imports` is disabled.** DI-injected classes must be value imports for SWC's decorator metadata, which is incompatible with that lint rule. The codebase loses automated enforcement of `import type` for type-only imports; the trade-off is that the rule would otherwise silently break DI under SWC.
- A DI-injected class accidentally imported as `import type` now fails only at runtime (boot / integration tests), not at type-check or lint — so app-booting integration coverage is the guard.
- The custom test loader is project-maintained code tied to Node 24's `module.registerHooks` semantics.
- `tsx` and `ts-node` remain devDependencies for standalone `sql-knex/scripts` and `ademe-csv-import` utilities, even though neither is used by the build or test runner.

## Links

- Supersedes: [ADR-0012](0012-node-test-loader-stack-for-api-integration-tests.md) (loader stack for API integration tests)
- Related ADRs: [ADR-0013](0013-migrate-api-test-suite-from-vitest-to-node-test.md), [ADR-0011](0011-use-node-test-for-shared-package-unit-tests.md)
- `module.registerHooks()` (synchronous, in-thread loader hooks): [nodejs.org/api/module.html#moduleregisterhooksoptions](https://nodejs.org/api/module.html#moduleregisterhooksoptions)
- NestJS SWC recipe: [docs.nestjs.com/recipes/swc](https://docs.nestjs.com/recipes/swc)
- SWC `module.resolveFully`: [swc.rs/docs/configuration/modules](https://swc.rs/docs/configuration/modules)
