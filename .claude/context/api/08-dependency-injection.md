# Dependency Injection Pattern

> **NestJS modules** with factory pattern for wiring dependencies.

## Overview

Dependency injection in NestJS modules uses the factory pattern to explicitly wire dependencies, making the dependency graph visible and type-safe. All UseCases, repositories, queries, and shared services are registered as providers with explicit `useFactory` functions that show exactly what gets injected where.

## Core Principles

1. **Factory Pattern Always**: Use `useFactory` with explicit dependencies, never implicit class injection
2. **Explicit Dependencies**: All dependencies listed in `inject` array - no hidden imports
3. **Type-Safe Wiring**: Factory parameters are typed, compile-time verification
4. **Shared Services**: Use common services (ID generator, date provider, SQL connection)
5. **Module Imports**: Import required modules (SqlConnectionModule, EventPublisherModule)
6. **Visible Dependency Graph**: Anyone can read module and understand wiring

## NestJS Module Structure

All modules follow the same structure:

```typescript
// adapters/primary/example.module.ts
import { Module } from "@nestjs/common";
import type { Knex } from "knex";

import { SqlExampleRepository } from "@/examples/adapters/secondary/example-repository/SqlExampleRepository";
import { SqlExamplesQuery } from "@/examples/adapters/secondary/examples-query/SqlExamplesQuery";
import { CreateExampleUseCase } from "@/examples/core/usecases/createExample.usecase";
import { GetExampleByIdUseCase } from "@/examples/core/usecases/getExampleById.usecase";
import { RandomUuidGenerator } from "@/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { SQL_CONNECTION } from "@/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SqlConnectionModule } from "@/shared-kernel/adapters/sql-knex/sqlConnection.module";

import { ExampleController } from "./example.controller";

@Module({
  imports: [SqlConnectionModule],  // Import required modules
  controllers: [ExampleController],
  providers: [
    // UseCases
    {
      provide: CreateExampleUseCase,
      useFactory: (repository: SqlExampleRepository, idGenerator: RandomUuidGenerator) =>
        new CreateExampleUseCase(repository, idGenerator),
      inject: [SqlExampleRepository, RandomUuidGenerator],
    },
    {
      provide: GetExampleByIdUseCase,
      useFactory: (query: SqlExamplesQuery) =>
        new GetExampleByIdUseCase(query),
      inject: [SqlExamplesQuery],
    },

    // Repositories & Queries
    {
      provide: SqlExampleRepository,
      useFactory: (sqlConnection: Knex) =>
        new SqlExampleRepository(sqlConnection),
      inject: [SQL_CONNECTION],
    },
    {
      provide: SqlExamplesQuery,
      useFactory: (sqlConnection: Knex) =>
        new SqlExamplesQuery(sqlConnection),
      inject: [SQL_CONNECTION],
    },

    // Shared services
    RandomUuidGenerator,
  ],
  exports: [CreateExampleUseCase, GetExampleByIdUseCase],  // Export if used by other modules
})
export class ExampleModule {}
```

## Factory Pattern

**CRITICAL**: Always use factory pattern with `useFactory` for explicit dependency wiring.

### Why Factory Pattern?

- ✅ Explicit dependencies visible in code
- ✅ Type-safe dependency injection
- ✅ Easy to understand dependency graph
- ✅ Easier to test (clear what's injected where)

### Basic Factory

```typescript
{
  provide: CreateExampleUseCase,
  useFactory: (repository: SqlExampleRepository) =>
    new CreateExampleUseCase(repository),
  inject: [SqlExampleRepository],
}
```

### Multiple Dependencies

```typescript
{
  provide: CreateExampleUseCase,
  useFactory: (
    repository: SqlExampleRepository,
    idGenerator: RandomUuidGenerator,
    dateProvider: RealDateProvider,
  ) => new CreateExampleUseCase(repository, idGenerator, dateProvider),
  inject: [SqlExampleRepository, RandomUuidGenerator, RealDateProvider],
}
```

## Shared Services

### Common Shared Services

| Service | Import | Purpose | When to Use |
|---------|--------|---------|-------------|
| **RandomUuidGenerator** | `@/shared-kernel/adapters/id-generator/RandomUuidGenerator` | Generate random UUIDs | Production (default) |
| **DeterministicIdGenerator** | `@/shared-kernel/adapters/id-generator/DeterministicIdGenerator` | Predictable IDs | Testing only |
| **RealDateProvider** | `@/shared-kernel/adapters/date/RealDateProvider` | Current date/time | Production (default) |
| **DeterministicDateProvider** | `@/shared-kernel/adapters/date/DeterministicDateProvider` | Fixed date | Testing only |
| **SQL_CONNECTION** | `@/shared-kernel/adapters/sql-knex/sqlConnection.module` | Knex database connection | All repositories/queries |
| **DomainEventPublisher** | `@/shared-kernel/domainEventPublisher` | Publish domain events | Event-driven usecases |
| **DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN** | `@/shared-kernel/adapters/events/eventPublisher.module` | Event publisher token | For controller injection |

### SQL Connection

```typescript
import { SqlConnectionModule, SQL_CONNECTION } from "@/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { Knex } from "knex";

@Module({
  imports: [SqlConnectionModule],  // Import module
  providers: [
    {
      provide: SqlExampleRepository,
      useFactory: (sqlConnection: Knex) =>
        new SqlExampleRepository(sqlConnection),
      inject: [SQL_CONNECTION],  // Inject connection
    },
  ],
})
```

### ID Generator

```typescript
import { RandomUuidGenerator } from "@/shared-kernel/adapters/id-generator/RandomUuidGenerator";

@Module({
  providers: [
    {
      provide: CreateExampleUseCase,
      useFactory: (repository: SqlExampleRepository, idGenerator: RandomUuidGenerator) =>
        new CreateExampleUseCase(repository, idGenerator),
      inject: [SqlExampleRepository, RandomUuidGenerator],
    },
    RandomUuidGenerator,  // Provide service
  ],
})
```

### Date Provider

```typescript
import { RealDateProvider } from "@/shared-kernel/adapters/date/RealDateProvider";

@Module({
  providers: [
    {
      provide: CreateExampleUseCase,
      useFactory: (repository: SqlExampleRepository, dateProvider: RealDateProvider) =>
        new CreateExampleUseCase(repository, dateProvider),
      inject: [SqlExampleRepository, RealDateProvider],
    },
    RealDateProvider,  // Provide service
  ],
})
```

### Domain Event Publisher

```typescript
import { EventPublisherModule } from "@/shared-kernel/adapters/events/eventPublisher.module";
import type { DomainEventPublisher } from "@/shared-kernel/domainEventPublisher";

@Module({
  imports: [EventPublisherModule],  // Import module
  providers: [
    {
      provide: CreateExampleUseCase,
      useFactory: (
        repository: SqlExampleRepository,
        eventPublisher: DomainEventPublisher,
      ) => new CreateExampleUseCase(repository, eventPublisher),
      inject: [SqlExampleRepository, DomainEventPublisher],
    },
  ],
})
```

## Controller Injection

Controllers receive UseCases via constructor injection:

```typescript
@Controller("examples")
export class ExampleController {
  constructor(
    private readonly createExampleUseCase: CreateExampleUseCase,
    private readonly getExampleByIdUseCase: GetExampleByIdUseCase,
  ) {}

  @Post()
  async create(@Body() dto: CreateExampleDto) {
    const result = await this.createExampleUseCase.execute(dto);
    // ...
  }
}
```

### Special Injection Tokens

For services that need injection tokens:

```typescript
import { DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN } from "@/shared-kernel/adapters/events/eventPublisher.module";
import type { DomainEventPublisher } from "@/shared-kernel/domainEventPublisher";
import { Inject } from "@nestjs/common";

@Controller("examples")
export class ExampleController {
  constructor(
    private readonly createExampleUseCase: CreateExampleUseCase,
    @Inject(DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN)
    private readonly eventPublisher: DomainEventPublisher,
  ) {}
}
```

## Module Imports & Exports

### Importing Modules

Import modules that provide services you need:

```typescript
@Module({
  imports: [
    SqlConnectionModule,     // Provides SQL_CONNECTION
    EventPublisherModule,    // Provides DomainEventPublisher
  ],
})
```

### Exporting Services

Export UseCases if other modules need them:

```typescript
@Module({
  providers: [CreateExampleUseCase, GetExampleByIdUseCase],
  exports: [CreateExampleUseCase, GetExampleByIdUseCase],
})
export class ExampleModule {}
```

Then import in other modules:

```typescript
@Module({
  imports: [ExampleModule],  // Can now inject CreateExampleUseCase
  providers: [
    {
      provide: SomeOtherUseCase,
      useFactory: (createExample: CreateExampleUseCase) =>
        new SomeOtherUseCase(createExample),
      inject: [CreateExampleUseCase],
    },
  ],
})
```

## Complete Module Example

```typescript
// adapters/primary/examples.module.ts
import { Module } from "@nestjs/common";
import type { Knex } from "knex";

import { SqlExampleRepository } from "@/examples/adapters/secondary/example-repository/SqlExampleRepository";
import { SqlExamplesQuery } from "@/examples/adapters/secondary/examples-query/SqlExamplesQuery";
import { CreateExampleUseCase } from "@/examples/core/usecases/createExample.usecase";
import { DeleteExampleUseCase } from "@/examples/core/usecases/deleteExample.usecase";
import { GetExampleByIdUseCase } from "@/examples/core/usecases/getExampleById.usecase";
import { GetExamplesListUseCase } from "@/examples/core/usecases/getExamplesList.usecase";
import { UpdateExampleUseCase } from "@/examples/core/usecases/updateExample.usecase";
import { RealDateProvider } from "@/shared-kernel/adapters/date/RealDateProvider";
import { EventPublisherModule } from "@/shared-kernel/adapters/events/eventPublisher.module";
import { RandomUuidGenerator } from "@/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { SQL_CONNECTION, SqlConnectionModule } from "@/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { DomainEventPublisher } from "@/shared-kernel/domainEventPublisher";

import { ExamplesController } from "./examples.controller";

@Module({
  imports: [SqlConnectionModule, EventPublisherModule],
  controllers: [ExamplesController],
  providers: [
    // Create UseCase (write with events)
    {
      provide: CreateExampleUseCase,
      useFactory: (
        repository: SqlExampleRepository,
        idGenerator: RandomUuidGenerator,
        dateProvider: RealDateProvider,
        eventPublisher: DomainEventPublisher,
      ) => new CreateExampleUseCase(repository, idGenerator, dateProvider, eventPublisher),
      inject: [SqlExampleRepository, RandomUuidGenerator, RealDateProvider, DomainEventPublisher],
    },

    // Update UseCase (write)
    {
      provide: UpdateExampleUseCase,
      useFactory: (repository: SqlExampleRepository, dateProvider: RealDateProvider) =>
        new UpdateExampleUseCase(repository, dateProvider),
      inject: [SqlExampleRepository, RealDateProvider],
    },

    // Delete UseCase (write)
    {
      provide: DeleteExampleUseCase,
      useFactory: (repository: SqlExampleRepository) =>
        new DeleteExampleUseCase(repository),
      inject: [SqlExampleRepository],
    },

    // Read UseCases (query)
    {
      provide: GetExampleByIdUseCase,
      useFactory: (query: SqlExamplesQuery) =>
        new GetExampleByIdUseCase(query),
      inject: [SqlExamplesQuery],
    },
    {
      provide: GetExamplesListUseCase,
      useFactory: (query: SqlExamplesQuery) =>
        new GetExamplesListUseCase(query),
      inject: [SqlExamplesQuery],
    },

    // Repository (for write operations)
    {
      provide: SqlExampleRepository,
      useFactory: (sqlConnection: Knex) =>
        new SqlExampleRepository(sqlConnection),
      inject: [SQL_CONNECTION],
    },

    // Query (for read operations)
    {
      provide: SqlExamplesQuery,
      useFactory: (sqlConnection: Knex) =>
        new SqlExamplesQuery(sqlConnection),
      inject: [SQL_CONNECTION],
    },

    // Shared services
    RandomUuidGenerator,
    RealDateProvider,
  ],
})
export class ExamplesModule {}
```

## Registering in AppModule

Add new module to `app.module.ts`:

```typescript
// src/app.module.ts
import { ExamplesModule } from "@/examples/adapters/primary/examples.module";

@Module({
  imports: [
    // ... other modules
    ExamplesModule,  // Add new module
  ],
})
export class AppModule {}
```

## Best Practices

### DO:
- ✅ Use factory pattern for all providers
- ✅ Explicitly list all dependencies in `inject` array
- ✅ Import required modules (SqlConnectionModule, EventPublisherModule)
- ✅ Use shared services (RandomUuidGenerator, RealDateProvider)
- ✅ Export UseCases if needed by other modules
- ✅ Type factory parameters

### DON'T:
- ❌ Don't use class-based providers for UseCases
- ❌ Don't forget to import required modules
- ❌ Don't inject concrete classes in UseCases (use interfaces)
- ❌ Don't skip `inject` array in factories

## Related Patterns

- **UseCase**: [01-usecase-pattern.md](01-usecase-pattern.md) (what gets injected)
- **Repository**: [03-repository-pattern.md](03-repository-pattern.md) (injectable implementations)
- **Query**: [04-query-pattern.md](04-query-pattern.md) (injectable implementations)
- **Controller**: [02-controller-pattern.md](02-controller-pattern.md) (receives injected UseCases)
- **Domain Events**: [10-domain-events-pattern.md](10-domain-events-pattern.md) (event publisher injection)