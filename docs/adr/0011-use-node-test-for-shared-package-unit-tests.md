# [ADR-0011] Use node:test for shared package unit tests

- **Date**: 2026-06-18
- **Status**: Accepted

## Context

The `packages/shared` package had its tests running under Vitest (`vitest --globals=true`). As part of reducing toolchain complexity and moving toward Node.js native primitives, we evaluated replacing Vitest with the built-in `node:test` runner for the shared package — the smallest, most self-contained target in the monorepo (17 spec files, pure unit tests, no DOM or framework dependencies).

The migration also surfaced a constraint: Node.js 24's `--experimental-strip-types` flag does not rewrite import specifiers, which means extensionless imports (`from "."`, `from "./index"`) and directory imports fail under the native runner. A TypeScript-aware loader is still required.

## Decision

Replace Vitest with `node:test` + `node:assert/strict` for `packages/shared` tests. Use `tsx` as a loader (`node --import=tsx --test 'src/**/*.spec.ts'`) to handle TypeScript module resolution. Remove `vitest` from `shared`'s devDependencies.

## Options Considered

### Option 1: node:test + --experimental-strip-types (no extra dep)

- **Pros**: Zero new dependencies; fully native Node.js
- **Cons**: `--experimental-strip-types` does not rewrite import specifiers — extensionless and directory imports fail. Would require updating all source file imports to use explicit `.ts` extensions, a large invasive change outside the spec files.

### Option 2: node:test + tsx loader (chosen)

- **Pros**: Handles TypeScript module resolution transparently; `tsx` is already in the monorepo lockfile (used by tsdown); no changes to source file imports
- **Cons**: Adds `tsx` as a direct devDependency of `shared`; one extra process layer at test startup

## Consequences

### Positive

- `packages/shared` has no test framework dependency beyond Node.js itself and `tsx`
- `node:assert/strict` assertions are explicit and produce clear failure messages
- Establishes a pattern for future migrations of `apps/api` and `apps/web` test suites

### Negative

- `node:test` has no `.each()` — parameterised tests must use a `for...of` loop
- `assert.deepStrictEqual` treats `{key: undefined}` differently from `{}` (unlike Vitest's `toEqual`), requiring care when migrating tests that spread objects with removed keys
- `describe`/`it` return Promises in `node:test` (unlike Vitest's synchronous equivalents); `no-floating-promises` lint rule must be disabled for spec files in `.oxlintrc.json`

## Links

- Related ADRs: [ADR-0003](0003-shared-package-for-cross-app-types.md)
