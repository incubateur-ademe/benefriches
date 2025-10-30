# Code Templates - Benefriches API

> **Purpose**: Detailed code templates and examples referenced from main [CLAUDE.md](./CLAUDE.md). See main guide for architectural overview and critical rules.

---

## 📝 Code Templates

### 1. Domain Model

Domain models can be implemented as types, classes, or Zod schemas depending on the use case.

**When to use each approach:**

- **Type-based**: When extending types from `shared` package or creating simple DTOs without logic
- **Class-based**: When you need business logic, validation methods, or transformation (e.g., `toDatabaseFormat()`)
- **Zod schema**: When you need runtime validation for external data (API input, file parsing)

**A) Type-based (extending shared types):**

```typescript
// core/models/siteEntity.ts
import { Site } from "shared";

export type SiteEntity = Site & {
  createdAt: Date;
  createdBy: string;
  creationMode: "express" | "custom";
};
```

**B) Class-based (with business logic):**

```typescript
// core/models/carbonStorage.ts
export class CarbonStorage {
  private constructor(
    readonly reservoir: ReservoirType,
    readonly soilCategory: string,
    readonly carbonStorageInTonByHectare: number,
  ) {}

  static create(props: CarbonStorageProps): CarbonStorage {
    return new CarbonStorage(
      props.reservoir,
      props.soil_category,
      parseFloat(props.stock_tC_by_ha),
    );
  }

  toDatabaseFormat() {
    return {
      reservoir: this.reservoir,
      soil_category: this.soilCategory,
      stock_tC_by_ha: this.carbonStorageInTonByHectare.toString(),
    };
  }
}
```

**C) Zod schema (with validation):**

```typescript
// core/models/example.ts
import { z } from "zod";

export const exampleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  createdAt: z.date(),
});

export type Example = z.infer<typeof exampleSchema>;
```

**Mock factories** (for all model types):

```typescript
// core/models/example.mock.ts
export function exampleMock(overrides: Partial<Example> = {}): Example {
  return {
    id: "example-id",
    name: "Test Example",
    createdAt: new Date("2024-01-01"),
    ...overrides,
  };
}
```

### 1b. ViewModel (for API Responses)

ViewModels define the shape of data returned by controllers (separate from domain models):

```typescript
// core/models/exampleViewModel.ts
export type ExampleViewModel = {
  id: string;
  name: string;
  createdAt: string; // ISO string for JSON serialization
  // NEVER include sensitive fields like passwords, internal IDs, etc.
};

// Map domain model to ViewModel (in Query or UseCase)
function toViewModel(example: Example): ExampleViewModel {
  return {
    id: example.id,
    name: example.name,
    createdAt: example.createdAt.toISOString(),
  };
}
```

**When to use:**

- Controllers MUST return ViewModels, never domain entities (Critical Rule #9)
- ViewModels control API contract (what clients see)
- Domain models can change without breaking API

### 2. Gateway Interfaces (CQS)

```typescript
// core/gateways/ExampleRepository.ts (WRITE)
export interface ExampleRepository {
  save(example: Example): Promise<void>;
  delete(id: string): Promise<void>;
}

// core/gateways/ExampleQuery.ts (READ)
export interface ExampleQuery {
  getById(id: string): Promise<ExampleViewModel | undefined>;
  getAll(): Promise<ExampleViewModel[]>;
}
```

### 3. UseCase (Result Pattern)

**For core Result Pattern concepts, see [CLAUDE.md → Result Pattern section](./CLAUDE.md#-result-pattern-core-to-api-design).**

This section shows **advanced patterns** and **real-world examples**. The `UseCase<TRequest, TResultType>` interface enforces the Result pattern at the type-system level - the second generic parameter MUST be a `TResult` type.

**Request Type Validation Strategy:**

- **Simple types**: Plain TypeScript for internal data: `type Request = { name: string; age: number };`
- **Complex validation**: Zod schema for external input: `type Request = z.infer<typeof createExampleRequestSchema>;`
- **Validation responsibility**:
  - **Controller**: Validates HTTP input shape (use `ZodValidationPipe`)
  - **UseCase**: Validates business rules (use Result pattern failures)
  - Don't duplicate validation in both layers

**Advanced: Type-Safe Validation Issues** (optional third generic parameter):

```typescript
// When validation errors need structured field-level details
type CreateExampleResult = TResult<
  { exampleId: string },
  "ValidationFailed",
  { fieldErrors: Record<string, string[]> }
>;

return fail("ValidationFailed", { fieldErrors: { email: ["Invalid format"] } });
```

**Real Examples from Codebase**:

- Auth Module: [CreateUserUseCase](apps/api/src/auth/core/createUser.usecase.ts), [AuthenticateWithTokenUseCase](apps/api/src/auth/core/authenticateWithToken.usecase.ts)
- Sites Module: [CreateNewExpressSiteUseCase](apps/api/src/sites/core/usecases/createNewExpressSite.usecase.ts), [GetSiteByIdUseCase](apps/api/src/sites/core/usecases/getSiteById.usecase.ts)
- Reconversion Projects: [CreateReconversionProjectUseCase](apps/api/src/reconversion-projects/core/usecases/createReconversionProject.usecase.ts)

---

## 🧪 Test Templates

### 4. UseCase Unit Test (Result Pattern)

**Key Pattern**: Use `isSuccess()` / `isFailure()` type guards for control flow, then **type assertions** for direct method access in assertions.

#### 4a. Happy Path Test

```typescript
// core/usecases/createExample.usecase.spec.ts
import { InMemoryExampleRepository } from "@/examples/adapters/secondary/example-repository/InMemoryExampleRepository";
import { DeterministicIdGenerator } from "@/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import type { SuccessResult, FailureResult } from "@/shared-kernel/result";
import { describe, it, expect, beforeEach } from "vitest";

import { CreateExampleUseCase } from "./createExample.usecase";

describe("CreateExample UseCase", () => {
  let repository: InMemoryExampleRepository;
  let idGenerator: DeterministicIdGenerator;
  let usecase: CreateExampleUseCase;

  beforeEach(() => {
    repository = new InMemoryExampleRepository();
    idGenerator = new DeterministicIdGenerator();
    usecase = new CreateExampleUseCase(repository, idGenerator);
  });

  it("should return success with example id when creation succeeds", async () => {
    const result = await usecase.execute({ name: "Test Example" });

    expect(result.isSuccess()).toBe(true);
    // Use type assertion for cleaner access to success data
    expect((result as SuccessResult).getData()).toEqual({ exampleId: expect.any(String) });
    expect(repository._getExamples()).toHaveLength(1);
  });
});
```

**Type Assertion Advantages**:

- ✅ Cleaner, more direct code (no nested if blocks)
- ✅ Less boilerplate after already asserting with `expect(result.isSuccess()).toBe(true)`
- ✅ Full type safety - TypeScript knows the exact method signatures available
- ✅ Methods completely unavailable on wrong branch at compile-time (not even returning `never`)

#### 4b. Failure Case Tests

Test failure scenarios with Result pattern type assertions:

```typescript
// Simple error type test
it("should return error when example name already exists", async () => {
  repository._setExamples([{ id: "existing-id", name: "Test Example" }]);

  const result = await usecase.execute({ name: "Test Example" });

  expect(result.isFailure()).toBe(true);
  expect((result as FailureResult<"ExampleAlreadyExists">).getError()).toBe("ExampleAlreadyExists");
  expect(repository._getExamples()).toHaveLength(1); // Verify no side effects
});

// Structured validation errors with field details
it("should return validation error with field-level details", async () => {
  const result = await usecase.execute({ name: "ab", email: "invalid" });

  expect(result.isFailure()).toBe(true);
  const failureResult = result as FailureResult<
    "ValidationFailed",
    { fieldErrors: Record<string, string[]> }
  >;
  expect(failureResult.getError()).toBe("ValidationFailed");
  expect(failureResult.getIssues()?.fieldErrors.email).toContain("Invalid email format");
});

// Authorization failure test
it("should fail when user is not authorized", async () => {
  const result = await usecase.execute({
    exampleId: "example-1",
    userId: "unauthorized-user",
  });

  expect(result.isFailure()).toBe(true);
  expect((result as FailureResult<"UserNotAuthorized">).getError()).toBe("UserNotAuthorized");
});
```

**Key patterns:**

- Always check `isFailure()` first, then type-assert to specific `FailureResult<ErrorType>`
- Verify side effects (business logic didn't execute)
- For validation errors with details, use 3rd generic: `FailureResult<"ValidationFailed", { fieldErrors: {...} }>`

---

## 🗄️ Adapter Templates

### 5. SQL Repository

```typescript
// adapters/secondary/example-repository/SqlExampleRepository.ts
import type { ExampleRepository } from "@/examples/core/gateways/ExampleRepository";
import type { Example } from "@/examples/core/models/example";
import type { SqlExample } from "@/shared-kernel/adapters/sql-knex/tableTypes";
import type { Knex } from "knex";

export class SqlExampleRepository implements ExampleRepository {
  constructor(private readonly sqlConnection: Knex) {}

  async save(example: Example): Promise<void> {
    // Map domain model to SQL row type for type safety
    const row: SqlExample = {
      id: example.id,
      name: example.name,
      created_at: example.createdAt, // snake_case for DB
    };
    await this.sqlConnection("examples").insert(row);
  }

  async delete(id: string): Promise<void> {
    await this.sqlConnection("examples").where("id", id).delete();
  }
}
```

**Important:** Always import and use the `Sql[TableName]` type from `tableTypes.d.ts` for type-safe row mapping.

### 6. SQL Query

```typescript
// adapters/secondary/example-query/SqlExampleQuery.ts
import type { ExampleQuery } from "@/examples/core/gateways/ExampleQuery";
import type { ExampleViewModel } from "@/examples/core/models/exampleViewModel";
import type { Knex } from "knex";

export class SqlExampleQuery implements ExampleQuery {
  constructor(private readonly sqlConnection: Knex) {}

  async getById(id: string): Promise<ExampleViewModel | undefined> {
    const result = await this.sqlConnection("examples")
      .where("id", id)
      .select("id", "name", "created_at")
      .first();

    if (!result) return undefined;

    return {
      id: result.id,
      name: result.name,
      createdAt: result.created_at, // camelCase for app
    };
  }
}
```

### 7. In-Memory Implementation

```typescript
// adapters/secondary/example-repository/InMemoryExampleRepository.ts
import type { ExampleRepository } from "@/examples/core/gateways/ExampleRepository";
import type { Example } from "@/examples/core/models/example";

export class InMemoryExampleRepository implements ExampleRepository {
  private examples = new Map<string, Example>();

  // Test helpers (prefix with _)
  _setExamples(examples: Example[]): void {
    this.examples = new Map(examples.map((e) => [e.id, e]));
  }

  _getExamples(): Example[] {
    return Array.from(this.examples.values());
  }

  // Interface implementation
  async save(example: Example): Promise<void> {
    this.examples.set(example.id, example);
  }

  async delete(id: string): Promise<void> {
    this.examples.delete(id);
  }
}
```

### 8. Controller (Result Pattern Handling)

```typescript
// adapters/primary/example.controller.ts
import { JwtAuthGuard } from "@/auth/adapters/primary/guards/jwt-auth.guard";
import { CreateExampleUseCase } from "@/examples/core/usecases/createExample.usecase";
import type { FailureResult, SuccessResult } from "@/shared-kernel/result";
import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";

@Controller("examples")
export class ExampleController {
  constructor(
    private readonly createExampleUseCase: CreateExampleUseCase,
    private readonly getExampleByIdUseCase: GetExampleByIdUseCase,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body(new ZodValidationPipe(createExampleSchema)) dto: CreateExampleDto) {
    const result = await this.createExampleUseCase.execute(dto);

    // Use type guard to check failure, then pattern match on error
    if (result.isFailure()) {
      switch ((result as FailureResult).getError()) {
        case "ExampleAlreadyExists":
          throw new ConflictException("Example with this name already exists");
        case "ValidationFailed":
          throw new BadRequestException("Invalid example data");
      }
    }

    // TypeScript knows result is success here
    return { exampleId: (result as SuccessResult).getData().exampleId };
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async getById(@Param("id") id: string) {
    const result = await this.getExampleByIdUseCase.execute({ exampleId: id });

    if (result.isFailure()) {
      switch ((result as FailureResult).getError()) {
        case "ExampleNotFound":
          throw new NotFoundException("Example not found");
      }
    }

    return (result as SuccessResult).getData();
  }
}
```

### 9. NestJS Module (Factory Pattern)

```typescript
// adapters/primary/example.module.ts
import { SqlExampleQuery } from "@/examples/adapters/secondary/example-query/SqlExampleQuery";
import { SqlExampleRepository } from "@/examples/adapters/secondary/example-repository/SqlExampleRepository";
import { CreateExampleUseCase } from "@/examples/core/usecases/createExample.usecase";
import { RandomUuidGenerator } from "@/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { SqlConnectionModule } from "@/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SQL_CONNECTION } from "@/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { Module } from "@nestjs/common";
import type { Knex } from "knex";

import { ExampleController } from "./example.controller";

@Module({
  imports: [SqlConnectionModule],
  controllers: [ExampleController],
  providers: [
    // UseCases
    {
      provide: CreateExampleUseCase,
      useFactory: (repository: SqlExampleRepository, idGenerator: RandomUuidGenerator) =>
        new CreateExampleUseCase(repository, idGenerator),
      inject: [SqlExampleRepository, RandomUuidGenerator],
    },

    // Repositories & Queries
    {
      provide: SqlExampleRepository,
      useFactory: (sqlConnection: Knex) => new SqlExampleRepository(sqlConnection),
      inject: [SQL_CONNECTION],
    },
    {
      provide: SqlExampleQuery,
      useFactory: (sqlConnection: Knex) => new SqlExampleQuery(sqlConnection),
      inject: [SQL_CONNECTION],
    },

    // Shared services
    RandomUuidGenerator,
  ],
})
export class ExampleModule {}
```

### 10. Error Handling Pattern

**STANDARD: Use Result type with helper functions (no custom error classes needed)**

```typescript
// Define Result type at top of usecase file
import { failure, success, type Result } from "@/shared-kernel/result";

type CreateExampleResult = Result<
  { exampleId: string },
  "ExampleNotFound" | "ValidationFailed"
>;

// Use helper functions to create results
return success({ exampleId: "123" });
return failure("ExampleNotFound");

// No custom error classes needed!
```

---

## 📋 Database & Event Templates

### 11. Domain Event

```typescript
// core/events/exampleCreated.event.ts
import type { DomainEvent } from "@/shared-kernel/domainEvent";

export const EXAMPLE_CREATED = "example.created";

export type ExampleCreatedEvent = DomainEvent<
  typeof EXAMPLE_CREATED,
  {
    exampleId: string;
    name: string;
    createdAt: Date;
  }
>;

// Publish in usecase
await this.eventPublisher.publish<ExampleCreatedEvent>({
  id: randomUUID(),
  name: EXAMPLE_CREATED,
  occurredAt: new Date(),
  payload: { exampleId: example.id, name: example.name, createdAt: example.createdAt },
});
```

### 12. Knex Migration

```typescript
// migrations/20240315120000_create_table_examples.ts
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("examples", (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());

    table.index("created_at");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("examples");
}
```

### 13. Transaction Pattern (Multi-table)

```typescript
async save(site: Site): Promise<void> {
  await this.sqlConnection.transaction(async (trx) => {
    // Insert main entity
    await trx("sites").insert({
      id: site.id,
      name: site.name,
    });

    // Insert related entities
    if (site.address) {
      await trx("addresses").insert({
        site_id: site.id,
        street: site.address.street,
        city: site.address.city,
      });
    }

    // Insert arrays
    if (site.soils.length > 0) {
      await trx("site_soils").insert(
        site.soils.map(soil => ({
          site_id: site.id,
          type: soil.type,
          surface_area: soil.surfaceArea,
        }))
      );
    }
  });
}
```

### 14. JSON Aggregation Query

```typescript
async getById(siteId: string): Promise<SiteViewModel | undefined> {
  const result = await this.sqlConnection("sites")
    .where("sites.id", siteId)
    .leftJoin("addresses", "addresses.site_id", "sites.id")
    .select(
      "sites.*",
      this.sqlConnection.raw(`
        json_build_object(
          'street', addresses.street,
          'city', addresses.city,
          'postalCode', addresses.postal_code
        ) as address
      `),
      this.sqlConnection.raw(`
        COALESCE(
          json_agg(
            json_build_object(
              'type', site_soils.type,
              'surfaceArea', site_soils.surface_area
            )
          ) FILTER (WHERE site_soils.id IS NOT NULL),
          '[]'::json
        ) as soils
      `),
    )
    .leftJoin("site_soils", "site_soils.site_id", "sites.id")
    .groupBy("sites.id", "addresses.id")
    .first();

  if (!result) return undefined;

  return {
    id: result.id,
    name: result.name,
    address: result.address,
    soils: result.soils,
  };
}
```

---

**For architectural patterns, critical rules, and workflow guidance, see [CLAUDE.md](./CLAUDE.md).**
