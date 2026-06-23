---
paths:
  - "apps/api/src/**/*.spec.ts"
---

# Unit Testing Pattern

> **UseCase unit testing** with InMemory implementations and Result pattern assertions.

## Overview

Unit tests verify UseCase business logic in isolation without external dependencies (database, HTTP, filesystem). They use InMemory implementations of repositories and queries, providing fast feedback on core domain logic. Tests validate both success and failure paths through the Result pattern.

**Runner**: `node:test` + `node:assert/strict`. Run with:
```bash
pnpm --filter api test:unit                              # all unit tests
node --require @swc-node/register --test src/path/to/file.spec.ts  # specific file (from apps/api/)
```

## Core Principles

1. **Isolation**: Test business logic without database, HTTP, or external services
2. **Fast Execution**: Tests run in milliseconds with InMemory implementations
3. **Explicit Setup**: Instantiate UseCase in each test, not in `beforeEach()`
4. **Exhaustive Assertions**: Use `assert.deepStrictEqual` for complete object matching
5. **Both Paths**: Test success cases AND all failure scenarios
6. **Deterministic Services**: Use fixed IDs, dates for predictable, reproducible tests

## Imports

```typescript
import assert from "node:assert/strict";
import { describe, it, beforeEach } from "node:test"; // add before/after/afterEach as needed
import type { SuccessResult, FailureResult } from "src/shared-kernel/result";
```

## Test Structure

**IMPORTANT**: Instantiate UseCase in each `it()`, not in `beforeEach()`.

```typescript
// core/usecases/createExample.usecase.spec.ts
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { InMemoryExampleRepository } from "src/examples/adapters/secondary/example-repository/InMemoryExampleRepository";
import { DeterministicIdGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import type { SuccessResult, FailureResult } from "src/shared-kernel/result";

import { CreateExampleUseCase } from "./createExample.usecase";

describe("CreateExample UseCase", () => {
  it("should create example and return id", async () => {
    const repository = new InMemoryExampleRepository();
    const idGenerator = new DeterministicIdGenerator();
    const usecase = new CreateExampleUseCase(repository, idGenerator);

    const result = await usecase.execute({ name: "Test Example" });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult).getData(), { exampleId: "1" });
    assert.strictEqual(repository._getExamples().length, 1);
    assert.deepStrictEqual(repository._getExamples(), [
      { id: "1", name: "Test Example", createdAt: new Date("2024-01-01") },
    ]);
  });
});
```

## Assertion Reference

| Vitest | node:assert equivalent |
|--------|----------------------|
| `expect(a).toEqual(b)` | `assert.deepStrictEqual(a, b)` |
| `expect(a).toBe(b)` | `assert.strictEqual(a, b)` |
| `expect(arr).toHaveLength(n)` | `assert.strictEqual(arr.length, n)` |
| `expect(v).toBeDefined()` | `assert.ok(v !== undefined)` |
| `expect(v).toBeUndefined()` | `assert.strictEqual(v, undefined)` |
| `expect(v).toBeNull()` | `assert.strictEqual(v, null)` |
| `expect(v).toBeTruthy()` | `assert.ok(v)` |
| `expect(v).toBeGreaterThan(n)` | `assert.ok(v > n)` |
| `expect(v).toBeCloseTo(n)` | `assert.ok(Math.abs(v - n) < 0.005)` |
| `expect(arr).toContain(x)` | `assert.ok(arr.includes(x))` |
| `expect(obj).toMatchObject(p)` | `assert.partialDeepStrictEqual(obj, p)` |
| `await expect(fn()).rejects.toThrow()` | `await assert.rejects(() => fn())` |
| `expect<T>(x).toEqual(y)` | `assert.deepStrictEqual(x, y satisfies T)` |

### toContainEqual

```typescript
const found = arr.find((item) => {
  try { assert.deepStrictEqual(item, expected); return true; }
  catch { return false; }
});
assert.ok(found !== undefined);
```

### {k: undefined} quirk

`assert.deepStrictEqual` treats `{k: undefined} ≠ {}` (missing key); Vitest `toEqual` treated them equal. Two cases:
- **Zod strips absent optional field** → omit from expected: `...(v !== undefined ? { k: v } : {})`
- **Code explicitly assigns undefined** (e.g. `cond ? fakeNow : undefined`) → include `k: undefined` in expected

Port naively, run tests, fix each diff the runner surfaces.

## Result Pattern Testing

```typescript
it("should fail when already exists", async () => {
  const repository = new InMemoryExampleRepository();
  repository._setExamples([{ id: "existing", name: "Test", createdAt: new Date() }]);
  const usecase = new CreateExampleUseCase(repository);

  const result = await usecase.execute({ name: "Test" });

  assert.strictEqual(result.isFailure(), true);
  assert.strictEqual(
    (result as FailureResult<"ExampleAlreadyExists">).getError(),
    "ExampleAlreadyExists",
  );
  assert.strictEqual(repository._getExamples().length, 1); // no side effects
});
```

## Testing Event Publishing

### Error paths — assert NO events published

```typescript
/* oxlint-disable typescript-eslint/no-unsafe-assignment */
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";

it("should fail and NOT publish event", async () => {
  const repository = new InMemoryExampleRepository();
  const eventPublisher = new InMemoryEventPublisher();
  const usecase = new CreateExampleUseCase(repository, eventPublisher);

  const result = await usecase.execute({ name: "" });

  assert.strictEqual(result.isFailure(), true);
  assert.strictEqual(eventPublisher.events.length, 0); // CRITICAL
});
```

### Success paths — verify event shape

For non-deterministic event IDs (RandomUuidGenerator), assert the id is a string before the full shape check:

```typescript
/* oxlint-disable typescript-eslint/no-unsafe-assignment */
import { InMemoryEventPublisher } from "src/shared-kernel/adapters/events/publisher/InMemoryEventPublisher";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { EXAMPLE_CREATED, type ExampleCreatedEvent } from "../events/exampleCreated.event";

it("should create and publish typed event", async () => {
  const repository = new InMemoryExampleRepository();
  const eventPublisher = new InMemoryEventPublisher();
  const uuidGenerator = new RandomUuidGenerator();
  const usecase = new CreateExampleUseCase(repository, eventPublisher, uuidGenerator);

  await usecase.execute({ name: "Test", createdBy: "user-123" });

  const exampleId = repository._getExamples()[0]!.id;

  assert.strictEqual(eventPublisher.events.length, 1);
  assert.ok(typeof eventPublisher.events[0]!.id === "string"); // non-deterministic UUID
  assert.deepStrictEqual(eventPublisher.events[0], {
    id: eventPublisher.events[0]!.id,
    name: EXAMPLE_CREATED,
    payload: { exampleId, createdBy: "user-123" },
  } satisfies ExampleCreatedEvent);
});
```

For deterministic IDs (DeterministicUuidGenerator), use the known value directly:

```typescript
uuidGenerator.nextUuids("event-id-1"); // set in beforeEach
// ...
assert.deepStrictEqual(eventPublisher.events[0], {
  id: "event-id-1",
  name: EXAMPLE_CREATED,
  payload: { ... },
} satisfies ExampleCreatedEvent);
```

**Key practices**:
- ✅ Always assert `eventPublisher.events.length` before accessing `events[0]`
- ✅ Use event type constant (`EXAMPLE_CREATED`), not string literal
- ✅ On error paths: assert `eventPublisher.events.length === 0`

## it.each → for..of

```typescript
// BEFORE (Vitest)
it.each(["id", "email"])("cannot create without %s", (field) => { ... });

// AFTER (node:test)
for (const field of ["id", "email"] as const) {
  it(`cannot create without ${field}`, async () => { ... });
}
```

## Mocking (HTTP adapter tests)

When testing adapters that call external HTTP services, use `mock.fn()` from `node:test`:

```typescript
import { mock } from "node:test";

let httpService: { get: ReturnType<typeof mock.fn> };

beforeEach(() => {
  httpService = { get: mock.fn() };
});

// Set return value
httpService.get.mock.mockImplementation(() => of(buildAxiosResponse({ ... })));

// Assert call arguments — note: node:test uses .arguments, NOT array index
assert.deepStrictEqual(httpService.get.mock.calls[0]?.arguments, [
  "https://api.example.com/resource",
  { headers: expectedHeaders },
]);
assert.strictEqual(httpService.get.mock.callCount(), 1);
```

**Vitest → node:test mock translation**:
- `vi.fn()` → `mock.fn()`
- `fn.mockReturnValue(v)` → `fn.mock.mockImplementation(() => v)`
- `fn.mock.calls[i][j]` → `fn.mock.calls[i].arguments[j]`
- `expect(fn).toHaveBeenCalledWith(a, b)` → `assert.deepStrictEqual(fn.mock.calls[0]?.arguments, [a, b])`
- `expect(fn).toHaveBeenCalledTimes(n)` → `assert.strictEqual(fn.mock.callCount(), n)`

## Validation Errors

```typescript
it("should return validation error with field details", async () => {
  const usecase = new CreateExampleUseCase(new InMemoryExampleRepository());

  const result = await usecase.execute({ name: "ab", email: "invalid" });

  assert.strictEqual(result.isFailure(), true);
  const failure = result as FailureResult<"ValidationFailed", { fieldErrors: Record<string, string[]> }>;
  assert.strictEqual(failure.getError(), "ValidationFailed");
  assert.deepStrictEqual(failure.getIssues()?.fieldErrors, {
    name: ["Name must be at least 3 characters"],
    email: ["Invalid email format"],
  });
});
```

## InMemory Implementations

```typescript
export class InMemoryExampleRepository implements ExampleRepository {
  private examples = new Map<string, Example>();

  _setExamples(examples: Example[]): void {
    this.examples = new Map(examples.map((e) => [e.id, e]));
  }

  _getExamples(): Example[] {
    return Array.from(this.examples.values());
  }

  async save(example: Example): Promise<void> {
    this.examples.set(example.id, example);
  }
}
```

## Best Practices

### DO:
- ✅ Instantiate UseCase in each `it()`, not `beforeEach()`
- ✅ Use `assert.deepStrictEqual` for exhaustive shape assertions
- ✅ Test both success and failure paths
- ✅ Verify side effects (data saved, not saved on failure)
- ✅ Use `assert.partialDeepStrictEqual` for intentional partial checks (`toMatchObject` equivalent)
- ✅ Assert `callCount()` before accessing `mock.calls[0]` to get a useful failure message

### DON'T:
- ❌ Don't use `beforeEach()` for UseCase instantiation
- ❌ Don't skip exhaustive shape checks — catching extra/missing fields is the point
- ❌ Don't access database in unit tests
- ❌ Don't add `afterEach(() => mock.restoreAll())` — Vitest auto-restored, node:test unit tests don't need it
- ❌ Don't use `void` prefix on `describe`/`it` (lint rule disabled for `*.spec.ts`)

## Real-World Examples

| Test File | Patterns Demonstrated |
|-----------|----------------------|
| [createUser.usecase.spec.ts](../../../apps/api/src/auth/core/createUser.usecase.spec.ts) | {k:undefined} quirk, assert.rejects for Zod validation |
| [createNewSite.usecase.spec.ts](../../../apps/api/src/sites/core/usecases/createNewSite.usecase.spec.ts) | Event publishing, satisfies EventType |
| [ConnectCrm.spec.ts](../../../apps/api/src/marketing/adapters/secondary/ConnectCrm.spec.ts) | mock.fn, mock.timers, mock.calls[i].arguments |

## Related Patterns

- **UseCase**: [api-usecase.md](api-usecase.md) (Result pattern)
- **Repository**: [api-repository.md](api-repository.md) (InMemory implementations)
- **Integration Tests**: [api-integration-testing.md](api-integration-testing.md) (SQL testing)
