# [ADR-0013] Migrate apps/api test suite from Vitest to node:test

- **Date**: 2026-06-23
- **Status**: Accepted

## Context

The `apps/api` test suite was running under Vitest across two scripts:

```
test:unit        vitest --config test/vitest.config.ts
test:integration vitest --config test/vitest.integration.config.ts
```

Following the pattern established in [ADR-0011](0011-use-node-test-for-shared-package-unit-tests.md) (shared package migration), and for the same underlying reasons — reducing toolchain complexity and moving toward Node.js native primitives — we evaluated migrating `apps/api` to the built-in `node:test` runner.

The API is a larger, more complex target than `packages/shared`: 67 unit spec files, 34 integration spec files, NestJS with full decorator metadata requirements, PostgreSQL via testcontainers, and TypeScript path aliases (`src/*`, `test/*`) used throughout.

## Decision

Replace Vitest with `node:test` + `node:assert/strict` for all `apps/api` tests.

```
test:unit        node --require @swc-node/register --test 'src/**/*.spec.ts'
test:integration node --require @swc-node/register
                      --import ./test/force-ts-commonjs.mjs
                      --import ./test/integration-per-test-hooks.ts
                      --test-global-setup=./test/integration-global-setup.mts
                      --test-concurrency=1
                      --test 'src/**/*.integration-spec.ts'
```

The integration test command is deliberately more involved; its full rationale is documented in [ADR-0012](0012-node-test-loader-stack-for-api-integration-tests.md).

## Options Considered

### Option 1: Keep Vitest

- **Pros**: Zero migration effort; Vitest is familiar and well-supported; excellent DX (watch mode, UI, snapshot support).
- **Cons**: An extra framework dependency that re-implements what Node now provides natively; Vitest's ESM handling introduces its own abstractions on top of the module system (a pain point that already surfaced during the integration test setup). Inconsistent with the direction taken for `packages/shared`.

### Option 2: Migrate to node:test (chosen)

- **Pros**: No test framework dependency; consistent with the shared package; direct control over the module loading chain (important given the NestJS + ESM constraints); `node:test` output is understood by CI without plugins.
- **Cons**: `node:test` is less ergonomic than Vitest in some areas (see Consequences). The integration test setup requires a more complex loader stack (see ADR-0012).

## API migration: Vitest → node:test

The assertion API maps mechanically but has two notable differences:

| Vitest | node:assert/strict |
|---|---|
| `expect(a).toEqual(b)` | `assert.deepStrictEqual(a, b)` |
| `expect(a).toMatchObject(p)` | `assert.partialDeepStrictEqual(a, p)` |
| `expect(a).toBe(b)` | `assert.strictEqual(a, b)` |
| `expect(fn).toHaveBeenCalledWith(a)` | `assert.deepStrictEqual(fn.mock.calls[0]?.arguments, [a])` |
| `vi.fn()` | `mock.fn()` (from `node:test`) |

**`{k: undefined}` strictness**: `assert.deepStrictEqual` treats `{k: undefined}` as distinct from `{}`, unlike Vitest's `toEqual`. Tests that spread objects with omitted optional fields required explicit conditional spreading: `...(v !== undefined ? { k: v } : {})`.

**Mock call access**: `mock.calls[i].arguments[j]`, not `mock.calls[i][j]`.

**`no-non-null-assertion` lint rule**: Vitest's `expect(x).toBeDefined()` acted as a type guard; `assert.ok(x !== undefined)` does not. Spec files use `!` (non-null assertion) more frequently; `.oxlintrc.json` disables this rule globally for `*.spec.ts` files.

**No `it.each`**: Parameterised tests use `for...of` loops.

## Consequences

### Positive

- `apps/api` has no test framework dependency; `node:test` and `node:assert` are built into Node.
- The module loading chain is explicit and auditable — the loader stack documents exactly what transforms run (see ADR-0012).
- Consistent toolchain across the monorepo (`packages/shared` already uses `node:test`).
- `vitest` and its configuration files (`test/vitest.config.ts`, `test/vitest.integration.config.ts`) are removed.

### Negative

- No watch mode equivalent out of the box (Vitest had `vitest --watch`).
- `node:test`'s TAP output is verbose; filtering failures requires `grep` or a reporter plugin.
- The integration test loader stack is non-trivial and will need attention when upgrading Node.js (it works around an `--import`/CJS-loader interaction and a Node 24.12.0 resolution change — see ADR-0012).
- `ts-node` remains in devDependencies (used by the Knex CLI for migration files) and `tsx` remains (used by standalone utility scripts), even though neither is used by the test runner itself.

## Links

- Related ADRs: [ADR-0011](0011-use-node-test-for-shared-package-unit-tests.md), [ADR-0012](0012-node-test-loader-stack-for-api-integration-tests.md)
