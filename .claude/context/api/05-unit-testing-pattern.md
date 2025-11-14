# Unit Testing Pattern

> **UseCase unit testing** with InMemory implementations and Result pattern assertions.

## Overview

Unit tests verify UseCase business logic in isolation without external dependencies (database, HTTP, filesystem). They use InMemory implementations of repositories and queries, providing fast feedback on core domain logic. Tests validate both success and failure paths through the Result pattern.

## Core Principles

1. **Isolation**: Test business logic without database, HTTP, or external services
2. **Fast Execution**: Tests run in milliseconds with InMemory implementations
3. **Explicit Setup**: Instantiate UseCase in each test, not in `beforeEach()`
4. **Exhaustive Assertions**: Use `toEqual()` for complete object matching, not partial
5. **Both Paths**: Test success cases AND all failure scenarios
6. **Deterministic Services**: Use fixed IDs, dates for predictable, reproducible tests

## Test Structure

**IMPORTANT**: Instantiate UseCase in each `it()`, not in `beforeEach()`. This makes tests more explicit and easier to understand.

```typescript
// core/usecases/createExample.usecase.spec.ts
import { InMemoryExampleRepository } from "@/examples/adapters/secondary/example-repository/InMemoryExampleRepository";
import { DeterministicIdGenerator } from "@/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import type { SuccessResult, FailureResult } from "@/shared-kernel/result";
import { describe, it, expect } from "vitest";

import { CreateExampleUseCase } from "./createExample.usecase";

describe("CreateExample UseCase", () => {
  it("should create example and return id", async () => {
    // Arrange
    const repository = new InMemoryExampleRepository();
    const idGenerator = new DeterministicIdGenerator();
    const usecase = new CreateExampleUseCase(repository, idGenerator);

    // Act
    const result = await usecase.execute({ name: "Test Example" });

    // Assert - multiple assertions in same test
    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult).getData()).toEqual({
      exampleId: "1",
    });
    expect(repository._getExamples()).toHaveLength(1);
    expect(repository._getExamples()).toEqual([
      {
        id: "1",
        name: "Test Example",
        createdAt: expect.any(Date),
      },
    ]);
  });
});
```

## Result Pattern Testing

### Type Assertion Pattern (Recommended)

Use type assertions for cleaner test code after checking success/failure:

```typescript
it("should return success with example id", async () => {
  const repository = new InMemoryExampleRepository();
  const idGenerator = new DeterministicIdGenerator();
  const usecase = new CreateExampleUseCase(repository, idGenerator);

  const result = await usecase.execute({ name: "Test Example" });

  // Check result type first
  expect(result.isSuccess()).toBe(true);

  // Then use type assertion for direct access
  expect((result as SuccessResult).getData()).toEqual({
    exampleId: "1",
  });
});
```

**Why type assertions**:
- ✅ Cleaner, more direct code
- ✅ Less boilerplate after already asserting with `expect(result.isSuccess())`
- ✅ Full type safety - TypeScript knows exact method signatures

## Exhaustive Assertions

**IMPORTANT**: Prefer `toEqual()` over `toMatchObject()` for exhaustive assertions.

```typescript
// ✅ PREFERRED - Exhaustive assertion (exact match)
expect(repository._getExamples()).toEqual([
  {
    id: "1",
    name: "Test",
    description: "Description",
    createdAt: new Date("2024-01-01"),
  },
]);

// ⚠️ USE SPARINGLY - Partial match (only when object has many fields)
expect(complexObject).toMatchObject({
  importantField1: "value1",
  importantField2: "value2",
  // ... ignoring 20 other fields
});
```

**Why exhaustive assertions**:
- Catch unexpected fields or missing fields
- More robust against regressions
- Clearer test intent

## Testing Success Paths

```typescript
describe("CreateExample UseCase - Success", () => {
  it("should create example with correct data", async () => {
    const repository = new InMemoryExampleRepository();
    const dateProvider = new DeterministicDateProvider(new Date("2024-01-01"));
    const usecase = new CreateExampleUseCase(repository, dateProvider);

    const result = await usecase.execute({
      name: "Test",
      description: "Description",
    });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult).getData()).toEqual({
      exampleId: expect.any(String),
    });
    expect(repository._getExamples()).toEqual([
      {
        id: expect.any(String),
        name: "Test",
        description: "Description",
        createdAt: new Date("2024-01-01"),
      },
    ]);
  });
});
```

## Testing Failure Paths

```typescript
describe("CreateExample UseCase - Failures", () => {
  it("should fail when example name already exists", async () => {
    const repository = new InMemoryExampleRepository();
    repository._setExamples([
      {
        id: "existing",
        name: "Test",
        createdAt: new Date(),
      },
    ]);
    const usecase = new CreateExampleUseCase(repository);

    const result = await usecase.execute({ name: "Test" });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"ExampleAlreadyExists">).getError()).toBe(
      "ExampleAlreadyExists"
    );

    // Verify no side effects (still only 1 example)
    expect(repository._getExamples()).toHaveLength(1);
  });

  it("should fail with validation error for empty name", async () => {
    const repository = new InMemoryExampleRepository();
    const usecase = new CreateExampleUseCase(repository);

    const result = await usecase.execute({ name: "" });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"ValidationFailed">).getError()).toBe("ValidationFailed");
    expect(repository._getExamples()).toHaveLength(0);
  });
});
```

## Testing Validation with Structured Issues

For validation errors with field-level details:

```typescript
it("should return validation error with field-level details", async () => {
  const repository = new InMemoryExampleRepository();
  const usecase = new CreateExampleUseCase(repository);

  const result = await usecase.execute({
    name: "ab",
    email: "invalid",
  });

  expect(result.isFailure()).toBe(true);

  const failureResult = result as FailureResult<
    "ValidationFailed",
    { fieldErrors: Record<string, string[]> }
  >;

  expect(failureResult.getError()).toBe("ValidationFailed");
  expect(failureResult.getIssues()?.fieldErrors).toEqual({
    name: ["Name must be at least 3 characters"],
    email: ["Invalid email format"],
  });
});
```

## Testing Authorization

```typescript
it("should fail when user is not authorized", async () => {
  const repository = new InMemoryExampleRepository();
  repository._setExamples([
    {
      id: "example-1",
      name: "Test",
      ownerId: "user-1",
      createdAt: new Date(),
    },
  ]);
  const usecase = new UpdateExampleUseCase(repository);

  const result = await usecase.execute({
    exampleId: "example-1",
    userId: "unauthorized-user",
    name: "Updated",
  });

  expect(result.isFailure()).toBe(true);
  expect((result as FailureResult<"UserNotAuthorized">).getError()).toBe(
    "UserNotAuthorized"
  );

  // Verify example was not modified
  const examples = repository._getExamples();
  expect(examples[0].name).toBe("Test");
});
```

## Testing Multiple Gateways

When UseCases depend on multiple gateways:

```typescript
describe("CreateReconversionProject UseCase", () => {
  it("should fail when site does not exist", async () => {
    const siteRepository = new InMemorySiteRepository();
    const projectRepository = new InMemoryProjectRepository();
    const usecase = new CreateReconversionProjectUseCase(
      siteRepository,
      projectRepository
    );

    const result = await usecase.execute({
      siteId: "non-existent",
      projectName: "Test",
    });

    expect(result.isFailure()).toBe(true);
    expect((result as FailureResult<"SiteNotFound">).getError()).toBe("SiteNotFound");
    expect(projectRepository._getProjects()).toHaveLength(0);
  });

  it("should create project and associate with site", async () => {
    const siteRepository = new InMemorySiteRepository();
    siteRepository._setSites([
      {
        id: "site-1",
        name: "Test Site",
        createdAt: new Date("2024-01-01"),
      },
    ]);
    const projectRepository = new InMemoryProjectRepository();
    const idGenerator = new DeterministicIdGenerator();
    const dateProvider = new DeterministicDateProvider(new Date("2024-01-01"));
    const usecase = new CreateReconversionProjectUseCase(
      siteRepository,
      projectRepository,
      idGenerator,
      dateProvider
    );

    const result = await usecase.execute({
      siteId: "site-1",
      projectName: "Test Project",
    });

    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult).getData()).toEqual({
      projectId: "1",
    });
    expect(projectRepository._getProjects()).toEqual([
      {
        id: "1",
        siteId: "site-1",
        name: "Test Project",
        createdAt: new Date("2024-01-01"),
      },
    ]);
  });
});
```

## InMemory Implementations

### Shared Test Services

Use deterministic services for predictable tests:

```typescript
import { DeterministicIdGenerator } from "@/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import { DeterministicDateProvider } from "@/shared-kernel/adapters/date/DeterministicDateProvider";

it("should use deterministic services", async () => {
  const idGenerator = new DeterministicIdGenerator();
  const dateProvider = new DeterministicDateProvider(new Date("2024-01-01"));

  // IDs will be: "1", "2", "3"...
  // Dates will be: fixed date from constructor
});
```

### Repository Test Helpers

InMemory repositories should provide test helpers (prefix with `_`):

```typescript
export class InMemoryExampleRepository implements ExampleRepository {
  private examples = new Map<string, Example>();

  // Test helpers
  _setExamples(examples: Example[]): void {
    this.examples = new Map(examples.map((e) => [e.id, e]));
  }

  _getExamples(): Example[] {
    return Array.from(this.examples.values());
  }

  _clear(): void {
    this.examples.clear();
  }

  // Interface implementation
  async save(example: Example): Promise<void> {
    this.examples.set(example.id, example);
  }
}
```

## Test Organization

```
module/
└── core/
    └── usecases/
        ├── createExample.usecase.ts
        └── createExample.usecase.spec.ts    # Co-located with UseCase
```

## Running Tests

```bash
# Run all unit tests
pnpm --filter api test:unit

# Run specific test file
pnpm --filter api test:unit path/to/file.spec.ts

# Watch mode
pnpm --filter api test:unit -- --watch

# Coverage
pnpm --filter api test:unit -- --coverage
```

## Best Practices

### DO:
- ✅ Instantiate UseCase in each `it()`, not `beforeEach()`
- ✅ Use `toEqual()` for exhaustive assertions (not `toMatchObject()`)
- ✅ Test both success and failure paths
- ✅ Verify side effects (data saved, not saved on failure)
- ✅ Use InMemory implementations for all gateways
- ✅ Use deterministic services (ID generator, date provider)
- ✅ Use type assertions after checking `isSuccess()` / `isFailure()`

### DON'T:
- ❌ Don't use `beforeEach()` for UseCase instantiation
- ❌ Don't use `toMatchObject()` when `toEqual()` is possible
- ❌ Don't access database in unit tests
- ❌ Don't skip failure path tests
- ❌ Don't forget to verify side effects
- ❌ Don't use real services (random IDs, current dates)

## Real-World Examples

| Test File | UseCase | Patterns Demonstrated |
|-----------|---------|----------------------|
| [createUser.usecase.spec.ts](../../../apps/api/src/auth/core/createUser.usecase.spec.ts) | CreateUserUseCase | Basic Result pattern testing |
| [authenticateWithToken.usecase.spec.ts](../../../apps/api/src/auth/core/authenticateWithToken.usecase.spec.ts) | AuthenticateWithTokenUseCase | Authorization failures |

## Related Patterns

- **UseCase**: [01-usecase-pattern.md](01-usecase-pattern.md) (Result pattern)
- **Repository**: [03-repository-pattern.md](03-repository-pattern.md) (InMemory implementations)
- **Integration Tests**: [06-integration-testing-pattern.md](06-integration-testing-pattern.md) (SQL testing)