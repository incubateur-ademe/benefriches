# Repository Pattern (Write Operations)

> **Write-focused pattern** following Command-Query Separation (CQS).

## Overview

Repositories provide the interface between domain logic and data persistence for write operations. In hexagonal architecture, they are **secondary adapters** (outbound) that implement **gateway interfaces** (ports) defined by the domain.

## Core Principles

1. **Write-Focused**: Used by UseCases that write data (create, update, delete)
2. **Can Include Reads**: May include read methods when needed (checking duplicates, fetching for update)
3. **Domain Types**: Work with domain models, not SQL types
4. **Multiple Implementations**: SQL (production) + InMemory (testing)
5. **Transactions**: Use database transactions for multi-table operations
6. **Type Safety**: Always use SQL table types from `tableTypes.d.ts`

## CQS Principle

**Repository** vs **Query** distinction is based on **intent**, not strict separation:

```
Repository:
- Used by UseCases that WRITE data (create, update, delete)
- Can include reads when needed (e.g., checking existence before insert)
- Example reads: getById() to check duplicates, exists() to validate

Query:
- Used by UseCases that only READ data (return views)
- NEVER writes data
- Focus on optimized reads, ViewModels, aggregations
```

**Key difference**: Repository = "I'm going to write data", Query = "I'm just reading for display".

## Gateway Interface

Define interface in `core/gateways/`:

```typescript
// core/gateways/ExampleRepository.ts
import type { Example } from "../models/example";

export interface ExampleRepository {
  // Write operations
  save(example: Example): Promise<void>;
  update(example: Example): Promise<void>;
  delete(id: string): Promise<void>;

  // Read operations (when needed by write UseCases)
  getById(id: string): Promise<Example | undefined>;
  existsByName(name: string): Promise<boolean>;
}
```

**When to add read methods**:
- Check for duplicates before insert
- Fetch entity for update operations
- Validate references exist

**Return types**:
- Write operations: `Promise<void>`
- Read operations: `Promise<Entity | undefined>` or `Promise<boolean>`

## SQL Implementation

### Basic Repository

```typescript
// adapters/secondary/example-repository/SqlExampleRepository.ts
import type { ExampleRepository } from "src/examples/core/gateways/ExampleRepository";
import type { Example } from "src/examples/core/models/example";
import type { SqlExample } from "src/shared-kernel/adapters/sql-knex/tableTypes";
import type { Knex } from "knex";

export class SqlExampleRepository implements ExampleRepository {
  constructor(private readonly sqlConnection: Knex) {}

  async save(example: Example): Promise<void> {
    // Map domain model → SQL row type
    const row: SqlExample = {
      id: example.id,
      name: example.name,
      created_at: example.createdAt,  // snake_case for DB
    };

    await this.sqlConnection("examples").insert(row);
  }

  async update(example: Example): Promise<void> {
    const row: SqlExample = {
      id: example.id,
      name: example.name,
      created_at: example.createdAt,
    };

    await this.sqlConnection("examples")
      .where("id", example.id)
      .update(row);
  }

  async delete(id: string): Promise<void> {
    await this.sqlConnection("examples")
      .where("id", id)
      .delete();
  }

  // Read method for write UseCase needs
  async getById(id: string): Promise<Example | undefined> {
    const row = await this.sqlConnection<SqlExample>("examples")
      .where("id", id)
      .first();

    if (!row) return undefined;

    return {
      id: row.id,
      name: row.name,
      createdAt: row.created_at,  // snake_case → camelCase
    };
  }

  async existsByName(name: string): Promise<boolean> {
    const result = await this.sqlConnection("examples")
      .where("name", name)
      .first();
    return !!result;
  }
}
```

### Transaction Pattern (Multi-table Operations)

For operations spanning multiple tables, use transactions:

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
        site.soils.map((soil) => ({
          site_id: site.id,
          type: soil.type,
          surface_area: soil.surfaceArea,
        }))
      );
    }
  });
}
```

**When to use transactions**:
- Multiple related inserts/updates
- Ensuring data consistency across tables
- Rollback on any failure

## Domain Model → SQL Row Mapping

### Naming Convention

```typescript
// Domain model (camelCase)
type Example = {
  exampleId: string;
  createdAt: Date;
  userName: string;
};

// SQL row type (snake_case)
type SqlExample = {
  example_id: string;
  created_at: Date;  // Knex auto-converts timestamps to Date
  user_name: string;
};

// Mapping in repository
const row: SqlExample = {
  example_id: example.exampleId,    // camelCase → snake_case
  created_at: example.createdAt,
  user_name: example.userName,
};
```

### Always Use SQL Table Types

**CRITICAL**: Import and use `Sql*` types from `tableTypes.d.ts`:

```typescript
import type { SqlExample } from "src/shared-kernel/adapters/sql-knex/tableTypes";

// ✅ CORRECT - Typed row
const row: SqlExample = { ... };
await this.sqlConnection("examples").insert(row);

// ❌ WRONG - Untyped object
await this.sqlConnection("examples").insert({
  example_id: example.id,  // No type safety!
});
```

**See**: [07-database-patterns.md](07-database-patterns.md#table-types) for table type definitions.

## InMemory Implementation (Testing)

**CRITICAL**: Every repository MUST have an InMemory implementation for unit tests.

```typescript
// adapters/secondary/example-repository/InMemoryExampleRepository.ts
import type { ExampleRepository } from "src/examples/core/gateways/ExampleRepository";
import type { Example } from "src/examples/core/models/example";

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

  async update(example: Example): Promise<void> {
    if (!this.examples.has(example.id)) {
      throw new Error(`Example ${example.id} not found`);
    }
    this.examples.set(example.id, example);
  }

  async delete(id: string): Promise<void> {
    this.examples.delete(id);
  }

  async getById(id: string): Promise<Example | undefined> {
    return this.examples.get(id);
  }

  async existsByName(name: string): Promise<boolean> {
    return Array.from(this.examples.values()).some((e) => e.name === name);
  }
}
```

**Test helper convention**: Prefix with `_` to distinguish from interface methods.

## File Organization

```
module/
└── adapters/
    └── secondary/
        └── example-repository/
            ├── SqlExampleRepository.ts
            ├── SqlExampleRepository.integration-spec.ts
            └── InMemoryExampleRepository.ts
```

## Testing

- **Unit tests**: Use InMemory implementation (see [05-unit-testing-pattern.md](05-unit-testing-pattern.md))
- **Integration tests**: Test SQL implementation against real database (see [06-integration-testing-pattern.md](06-integration-testing-pattern.md#sql-repository-integration-tests))

## Related Patterns

- **Query Pattern**: [04-query-pattern.md](04-query-pattern.md) (read-only operations for views)
- **Database**: [07-database-patterns.md](07-database-patterns.md) (migrations, table types, transactions)
- **Unit Testing**: [05-unit-testing-pattern.md](05-unit-testing-pattern.md) (testing with InMemory)
- **Integration Testing**: [06-integration-testing-pattern.md](06-integration-testing-pattern.md) (testing SQL repositories)