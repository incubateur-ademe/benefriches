# Shared Services (NestJS Dependency Injection)

> **Injectable services** available for dependency injection in NestJS modules.

## Overview

The API provides standardized, injectable services through the `shared-kernel` module. These services should be injected into UseCases, Repositories, and Queries rather than instantiated directly.

**Key principle**: Test your code with deterministic services (fixed IDs, fixed dates), then inject real services in production.

---

## Core Services

### ID Generation

**For Production**:

```typescript
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";

export class MyUseCase {
  constructor(private readonly idGenerator: RandomUuidGenerator) {}

  async execute(request: Request): Promise<TResult<Response, Error>> {
    const newId = this.idGenerator.generate(); // Random UUID
    // ...
  }
}
```

**For Testing**:

```typescript
import { DeterministicIdGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";

it("should create item with id", async () => {
  const idGenerator = new DeterministicIdGenerator();
  const usecase = new MyUseCase(idGenerator);

  const result = await usecase.execute({ name: "Test" });

  expect((result as SuccessResult).getData().id).toBe("1"); // Predictable ID
});
```

**Service Details**:

| Service | Import | Purpose | Provides |
|---------|--------|---------|----------|
| **RandomUuidGenerator** | `src/shared-kernel/adapters/id-generator/RandomUuidGenerator` | Production ID generation | Random UUID v4 strings |
| **DeterministicIdGenerator** | `src/shared-kernel/adapters/id-generator/DeterministicIdGenerator` | Testing only (predictable) | Sequential IDs: "1", "2", "3"... |

### Date/Time Providers

**For Production**:

```typescript
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";

export class MyUseCase {
  constructor(private readonly dateProvider: RealDateProvider) {}

  async execute(request: Request): Promise<TResult<Response, Error>> {
    const now = this.dateProvider.now(); // Current Date
    // ...
  }
}
```

**For Testing**:

```typescript
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";

it("should create item with timestamp", async () => {
  const dateProvider = new DeterministicDateProvider(new Date("2024-01-01"));
  const usecase = new MyUseCase(dateProvider);

  const result = await usecase.execute({ name: "Test" });

  expect((result as SuccessResult).getData().createdAt).toEqual(new Date("2024-01-01"));
});
```

**Service Details**:

| Service | Import | Purpose | Provides |
|---------|--------|---------|----------|
| **RealDateProvider** | `src/shared-kernel/adapters/date/RealDateProvider` | Production date/time | `now(): Date` returning current time |
| **DeterministicDateProvider** | `src/shared-kernel/adapters/date/DeterministicDateProvider` | Testing only (fixed) | `now(): Date` returning constructor-supplied fixed date |

---

## Database Connection

### SQL Connection (Knex)

```typescript
import { SQL_CONNECTION } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { Inject } from "@nestjs/common";
import type { Knex } from "knex";

export class MySqlRepository {
  constructor(@Inject(SQL_CONNECTION) private readonly sqlConnection: Knex) {}

  async save(item: Item): Promise<void> {
    await this.sqlConnection("items").insert({ /* ... */ });
  }
}
```

**Service Details**:

| Service | Import | Purpose | Provides |
|---------|--------|---------|----------|
| **SQL_CONNECTION** | `src/shared-kernel/adapters/sql-knex/sqlConnection.module` | Database access | Knex instance for query building |

**Where to Use**:
- SQL Repositories (write operations)
- SQL Queries (read operations)
- **NOT** in UseCases (they depend on Repository/Query interfaces, not the connection directly)

---

## Event Publishing

### Domain Event Publisher

```typescript
import { DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN } from "src/shared-kernel/adapters/events/eventPublisher.module";
import { Inject } from "@nestjs/common";
import type { DomainEventPublisher } from "src/shared-kernel/events/DomainEventPublisher";

export class MyUseCase {
  constructor(
    @Inject(DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN)
    private readonly eventPublisher: DomainEventPublisher,
  ) {}

  async execute(request: Request): Promise<TResult<Response, Error>> {
    // Business logic...

    // Publish event for side effects (emails, notifications, audit logs)
    this.eventPublisher.publish({
      aggregateId: newItemId,
      type: "ItemCreated",
      occurredAt: new Date(),
      data: { /* event payload */ },
    });

    return success({ itemId: newItemId });
  }
}
```

**Service Details**:

| Service | Import | Purpose | When to Use |
|---------|--------|---------|------------|
| **DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN** | `src/shared-kernel/adapters/events/eventPublisher.module` | Cross-module communication, side effects | When UseCase completion should trigger other domain actions (emails, notifications, audit) |

**See also**: [10-domain-events-pattern.md](10-domain-events-pattern.md) for complete event patterns.

---

## Dependency Injection in NestJS Modules

### Factory Pattern (Recommended)

Always inject services through factory pattern in NestJS modules:

```typescript
import { Module } from "@nestjs/common";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { SQL_CONNECTION } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { MyUseCase } from "src/my-module/core/usecases/my.usecase";
import { SqlMyRepository } from "src/my-module/adapters/secondary/my-repository/SqlMyRepository";
import { MyModule as RootMyModule } from "./my.module";

@Module({
  imports: [RootMyModule],
  providers: [
    // Factory pattern for UseCase
    {
      provide: MyUseCase,
      useFactory: (idGenerator: RandomUuidGenerator, dateProvider: RealDateProvider) => {
        return new MyUseCase(idGenerator, dateProvider);
      },
      inject: [RandomUuidGenerator, RealDateProvider],
    },
    // Factory pattern for Repository
    {
      provide: SqlMyRepository,
      useFactory: (sqlConnection: Knex) => {
        return new SqlMyRepository(sqlConnection);
      },
      inject: [SQL_CONNECTION],
    },
    // Register shared services
    RandomUuidGenerator,
    RealDateProvider,
    SQL_CONNECTION,
  ],
})
export class MyModule {}
```

**See also**: [08-dependency-injection.md](08-dependency-injection.md) for complete NestJS wiring patterns.

---

## Testing with InMemory Services

For unit tests, instantiate services directly without NestJS:

```typescript
import { DeterministicIdGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { InMemoryMyRepository } from "src/my-module/adapters/secondary/my-repository/InMemoryMyRepository";

describe("MyUseCase", () => {
  it("should create item", async () => {
    // Arrange: Instantiate services directly for unit test
    const idGenerator = new DeterministicIdGenerator();
    const dateProvider = new DeterministicDateProvider(new Date("2024-01-01"));
    const repository = new InMemoryMyRepository();
    const usecase = new MyUseCase(repository, idGenerator, dateProvider);

    // Act
    const result = await usecase.execute({ name: "Test Item" });

    // Assert
    expect(result.isSuccess()).toBe(true);
    expect((result as SuccessResult).getData()).toEqual({
      itemId: "1", // Deterministic ID
    });
  });
});
```

**Key points**:
- ✅ Use `DeterministicIdGenerator` and `DeterministicDateProvider` in tests
- ✅ Use `InMemory*` implementations for repositories and queries
- ✅ No NestJS `@Module` needed for unit tests
- ✅ Tests run fast with in-memory data (no database)

---

## Service Lifecycle & Best Practices

### DO:

- ✅ Inject services into UseCase constructors
- ✅ Use factory pattern in NestJS modules
- ✅ Use deterministic services in unit tests
- ✅ Use real services in production (automatic via NestJS)
- ✅ Publish domain events for cross-module communication

### DON'T:

- ❌ Instantiate `RandomUuidGenerator` or `RealDateProvider` in code (inject instead)
- ❌ Use `RandomUuidGenerator` in tests (use `DeterministicIdGenerator`)
- ❌ Bypass dependency injection by importing concrete classes directly
- ❌ Access database connection directly in UseCases (use Repository/Query instead)
- ❌ Use event publishing for simple method calls (use direct composition instead)

---

## Summary Table

| Need | Production | Testing | Module Location |
|------|-----------|---------|-----------------|
| Generate IDs | `RandomUuidGenerator` | `DeterministicIdGenerator` | `src/shared-kernel/adapters/id-generator/` |
| Get current time | `RealDateProvider` | `DeterministicDateProvider` | `src/shared-kernel/adapters/date/` |
| Database queries | `SQL_CONNECTION` (Knex) | `InMemory*Repository` | `src/shared-kernel/adapters/sql-knex/` |
| Publish events | `DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN` | Mock publisher | `src/shared-kernel/adapters/events/` |

---

## Related Patterns

- **UseCase Pattern**: [01-usecase-pattern.md](01-usecase-pattern.md) (injection into UseCases)
- **Repository Pattern**: [03-repository-pattern.md](03-repository-pattern.md) (SQL_CONNECTION usage)
- **Unit Testing**: [05-unit-testing-pattern.md](05-unit-testing-pattern.md) (deterministic services in tests)
- **Dependency Injection**: [08-dependency-injection.md](08-dependency-injection.md) (NestJS module wiring)
- **Domain Events**: [10-domain-events-pattern.md](10-domain-events-pattern.md) (event publishing)
