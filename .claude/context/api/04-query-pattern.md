# Query Pattern (Read Operations)

> **Read-only operations pattern** for returning ViewModels to clients.

## Overview

Queries provide the interface between UseCases and data retrieval for read-only operations. They return ViewModels optimized for client consumption, using SQL joins and aggregations for efficient data retrieval. In hexagonal architecture, they are **secondary adapters** (outbound) that implement **gateway interfaces** (ports) defined by the domain.

## Core Principles

1. **Read-Only**: Queries NEVER write data - only retrieve and transform
2. **ViewModel Returns**: Return API-friendly ViewModels, not domain entities
3. **Optimized Reads**: Use SQL joins, aggregations, and JSON functions for efficiency
4. **Multiple Implementations**: SQL (production) + InMemory (testing)
5. **Client-Focused**: Shape data for client needs (flatten, aggregate, format)
6. **API Contract Control**: ViewModels define what clients see, decoupled from domain

## Query vs Repository

**Query** is for UseCases that **only read data** for display:

```
Query:
- Used by UseCases that ONLY read data (return views)
- NEVER writes data
- Returns ViewModels (API-friendly format)
- Focus on optimized reads, aggregations, joins

Repository:
- Used by UseCases that write data
- Can include reads when needed (checking duplicates, etc.)
- Returns domain entities
```

**Key difference**: Query = "I'm just reading for display", Repository = "I'm going to write data".

## Gateway Interface

Define interface in `core/gateways/`:

```typescript
// core/gateways/ExamplesQuery.ts
import type { ExampleViewModel } from "../models/exampleViewModel";

export interface ExamplesQuery {
  getById(id: string): Promise<ExampleViewModel | undefined>;
  getAll(): Promise<ExampleViewModel[]>;
  getByUserId(userId: string): Promise<ExampleViewModel[]>;
}
```

**Rules**:
- ✅ Return `ViewModels` (not domain entities)
- ✅ Only read methods
- ✅ Optimize for display needs (joins, aggregations)

## ViewModel Definition

ViewModels define the **API contract** - what clients see:

```typescript
// core/models/exampleViewModel.ts
export type ExampleViewModel = {
  id: string;
  name: string;
  description: string;
  createdAt: string;  // ISO string for JSON serialization
  owner: {
    id: string;
    name: string;
  };
  // NEVER include sensitive fields (passwords, tokens, etc.)
};
```

**Why ViewModels**:
- Control API contract (what clients see)
- Domain models can change without breaking API
- Optimize for client needs (flatten, aggregate, format)

## SQL Implementation

### Basic Query

```typescript
// adapters/secondary/examples-query/SqlExamplesQuery.ts
import type { ExamplesQuery } from "@/examples/core/gateways/ExamplesQuery";
import type { ExampleViewModel } from "@/examples/core/models/exampleViewModel";
import type { SqlExample } from "@/shared-kernel/adapters/sql-knex/tableTypes";
import type { Knex } from "knex";

export class SqlExamplesQuery implements ExamplesQuery {
  constructor(private readonly sqlConnection: Knex) {}

  async getById(id: string): Promise<ExampleViewModel | undefined> {
    const row = await this.sqlConnection<SqlExample>("examples")
      .where("id", id)
      .select("id", "name", "description", "created_at")
      .first();

    if (!row) return undefined;

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at.toISOString(),  // Date → ISO string
    };
  }

  async getAll(): Promise<ExampleViewModel[]> {
    const rows = await this.sqlConnection<SqlExample>("examples")
      .select("id", "name", "description", "created_at")
      .orderBy("created_at", "desc");

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      createdAt: row.created_at.toISOString(),
    }));
  }
}
```

### Query with Joins

```typescript
async getById(id: string): Promise<ExampleViewModel | undefined> {
  const result = await this.sqlConnection("examples")
    .where("examples.id", id)
    .leftJoin("users", "users.id", "examples.owner_id")
    .select(
      "examples.id",
      "examples.name",
      "examples.created_at",
      "users.id as owner_id",
      "users.name as owner_name"
    )
    .first();

  if (!result) return undefined;

  return {
    id: result.id,
    name: result.name,
    createdAt: result.created_at.toISOString(),
    owner: {
      id: result.owner_id,
      name: result.owner_name,
    },
  };
}
```

### JSON Aggregation (Complex Data)

For aggregating related data into arrays/objects:

```typescript
async getById(siteId: string): Promise<SiteViewModel | undefined> {
  const result = await this.sqlConnection("sites")
    .where("sites.id", siteId)
    .leftJoin("addresses", "addresses.site_id", "sites.id")
    .select(
      "sites.*",
      // Aggregate address as JSON object
      this.sqlConnection.raw(`
        json_build_object(
          'street', addresses.street,
          'city', addresses.city,
          'postalCode', addresses.postal_code
        ) as address
      `),
      // Aggregate soils as JSON array
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
      `)
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

**JSON Aggregation Patterns**:
- `json_build_object()` - Create single JSON object
- `json_agg()` - Aggregate rows into JSON array
- `FILTER (WHERE ... IS NOT NULL)` - Exclude null rows
- `COALESCE(..., '[]'::json)` - Default to empty array

## Mapping: SQL → ViewModel

```typescript
// SQL row (snake_case, Date objects)
type SqlExample = {
  id: string;
  name: string;
  created_at: Date;  // Knex deserializes to Date
  owner_id: string;
};

// ViewModel (camelCase, ISO strings)
type ExampleViewModel = {
  id: string;
  name: string;
  createdAt: string;  // ISO string for JSON
  ownerId: string;
};

// Mapping
return {
  id: row.id,
  name: row.name,
  createdAt: row.created_at.toISOString(),  // Date → ISO string
  ownerId: row.owner_id,
};
```

## InMemory Implementation (Testing)

**CRITICAL**: Every query MUST have an InMemory implementation for unit tests.

```typescript
// adapters/secondary/examples-query/InMemoryExamplesQuery.ts
import type { ExamplesQuery } from "@/examples/core/gateways/ExamplesQuery";
import type { ExampleViewModel } from "@/examples/core/models/exampleViewModel";

export class InMemoryExamplesQuery implements ExamplesQuery {
  private examples: ExampleViewModel[] = [];

  // Test helpers (prefix with _)
  _setExamples(examples: ExampleViewModel[]): void {
    this.examples = examples;
  }

  _getExamples(): ExampleViewModel[] {
    return this.examples;
  }

  // Interface implementation
  async getById(id: string): Promise<ExampleViewModel | undefined> {
    return this.examples.find((e) => e.id === id);
  }

  async getAll(): Promise<ExampleViewModel[]> {
    return this.examples;
  }

  async getByUserId(userId: string): Promise<ExampleViewModel[]> {
    return this.examples.filter((e) => e.ownerId === userId);
  }
}
```

## File Organization

```
module/
└── adapters/
    └── secondary/
        └── examples-query/
            ├── SqlExamplesQuery.ts
            ├── SqlExamplesQuery.integration-spec.ts
            └── InMemoryExamplesQuery.ts
```

## Testing

- **Unit tests**: Use InMemory implementation (see [05-unit-testing-pattern.md](05-unit-testing-pattern.md))
- **Integration tests**: Test SQL implementation against real database (see [06-integration-testing-pattern.md](06-integration-testing-pattern.md#sql-query-integration-tests))

## Related Patterns

- **Repository Pattern**: [03-repository-pattern.md](03-repository-pattern.md) (write operations)
- **UseCase**: [01-usecase-pattern.md](01-usecase-pattern.md) (using queries in read-only UseCases)
- **Database**: [07-database-patterns.md](07-database-patterns.md) (table types, SQL patterns)
- **Integration Testing**: [06-integration-testing-pattern.md](06-integration-testing-pattern.md) (testing SQL queries)