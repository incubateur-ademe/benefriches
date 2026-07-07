# Cross-Cutting Review Lenses (all apps)

Read this file for **every** review — these lenses apply regardless of which app changed.

## Contents
- Security (CRITICAL)
- TypeScript & Node.js compatibility (CRITICAL)
- Test design antipatterns (HIGH)
- Code quality (HIGH)
- Performance (MEDIUM)
- Best practices (MEDIUM)

## Security (CRITICAL)

- ❌ Hardcoded credentials (API keys, passwords, tokens)
- ❌ SQL injection risks (string concatenation in queries — use Knex parameterized queries)
- ❌ XSS (unescaped user input in responses)
- ❌ Missing input validation (DTOs should use Zod schemas)
- ❌ Authentication bypasses (missing `@UseGuards(JwtAuthGuard)`)
- ❌ Path traversal (user-controlled file paths)
- ❌ CSRF vulnerabilities
- ❌ Insecure/outdated dependencies

## TypeScript & Node.js compatibility (CRITICAL)

**Erasable types** (must be valid when annotations are stripped):
- ❌ TypeScript `enum` (use Zod `z.enum()` or a const object)
- ❌ `namespace` declarations
- ❌ Class parameter properties: `constructor(private x: T) {}` (lint-enforced by `typescript/parameter-properties`; hoist to explicit fields)
- ✅ `type` over `interface` unless extending; Zod schemas for enum-like types

**Type safety**:
- ❌ `any` (use `unknown` when truly unknown)
- ❌ Missing explicit return types on public functions/methods
- ❌ Not using `import type { }` for type-only imports
- ✅ `strict: true` compliance

## Test design antipatterns (HIGH — all apps)

Smells in *how a test is designed*, independent of runner mechanics. Full rationale: [`.claude/rules/testing.md`](../../../rules/testing.md). Report a test only when the smell is clearly visible in the diff.

**Coupling to implementation** (highest-value smell — a test that breaks on a behaviour-preserving refactor, or stays green when behaviour breaks):
- ❌ Asserting on private methods, internal fields, or intermediate state instead of the public outcome (return value, emitted event, rendered output, persisted state).
- ❌ Web: querying by CSS class, `container.querySelector`, or `getByTestId` when a role/label/text query works; asserting a reducer's internal shape instead of a selector's output; asserting a child "was called with props X".
- ❌ Web: shallow rendering; `fireEvent` where `user-event` models the real interaction.
- ❌ Over-mocking: asserting interactions (`toHaveBeenCalledWith`, spies) when an outcome/state assertion would do. Reserve interaction assertions for cases where the call *is* the observable effect (event published, gateway notified).
- ❌ Test structure mirroring code structure (one test file per class, tests named after methods) rather than after behaviours.

**Flakiness & isolation:**
- ❌ Non-determinism: real clock (`Date.now()`/`new Date()`), `sleep`/arbitrary timeouts, real network, random IDs — use deterministic providers/generators.
- ❌ Order-dependent tests or shared mutable state leaking between `it()` blocks.

**Readability & diagnosis:**
- ❌ Assertion roulette: many unlabeled assertions where a failure can't be traced to a cause. Prefer one exhaustive shape assertion or split into distinct-behaviour tests.
- ❌ Eager test: one `it()` exercising several behaviours at once.
- ❌ Mystery guest / hidden setup: preconditions pulled from shared fixtures or external data instead of being explicit in the test.
- ❌ Deep `describe`/`beforeEach` nesting with mutable shared variables the reader must trace across scopes.
- ❌ Conditional logic (`if`/loops around assertions) — parameterise with `for..of` over explicit cases instead.

**Scope & value:**
- ❌ Tests for impossible states / dead defensive branches that upstream invariants prevent.
- ❌ Redundant tests: if test A passing guarantees test B passes, B adds no coverage.
- ❌ E2E used for edge cases or exhaustive permutations (E2E = 2–4 nominal flows; exhaustive coverage belongs in unit/integration).

## Code quality (HIGH)

- Large functions (>50 lines) — consider breaking down
- Large files (>800 lines) — consider splitting by responsibility
- Deep nesting (>4 levels) — refactor for readability
- Missing error handling in async operations
- `console.log` left in production code (use proper logging)
- Swallowing errors without logging
- Mutation of shared state; missing immutability in domain models

## Performance (MEDIUM)

- Inefficient algorithms (O(n²) when O(n log n) possible)
- N+1 query patterns (use joins or batch queries)
- Missing DB indexes on frequently queried columns
- Unnecessary re-renders / missing memoization in React
- Large bundle size additions

## Best practices (MEDIUM)

- TODO/FIXME without tickets or context
- Missing JSDoc for complex public APIs
- Poor variable naming (`x`, `tmp`, `data`, `result` without context)
- Magic numbers without explanation
- Inconsistent formatting (run `pnpm format`)
