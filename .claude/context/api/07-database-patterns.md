# Database Patterns

> **Database management** with Knex migrations, table types, and SQL patterns.

## Overview

Database patterns ensure type-safe, maintainable database operations using Knex migrations for schema changes and TypeScript table types for compile-time safety. All schema changes are tracked through versioned migrations, and SQL operations use strongly-typed interfaces to prevent runtime errors.

## Core Principles

1. **Migration-Driven Schema**: All schema changes via migrations - never manual SQL
2. **Type Safety**: Every table has a TypeScript type in `tableTypes.d.ts`
3. **Reversible Changes**: Every migration has `up` and `down` functions
4. **snake_case Database**: Database uses `snake_case`, application uses `camelCase`
5. **Transactions for Consistency**: Multi-table operations wrapped in transactions
6. **PostgreSQL Features**: Leverage JSON aggregation, JSONB columns, advanced indexing

## Migrations

### Creating a Migration

```bash
# Create new migration
pnpm --filter api knex:migrate-make migration_name

# Example: Create sites table
pnpm --filter api knex:migrate-make create_table_sites
```

### Migration Structure

```typescript
// migrations/20240315120000_create_table_examples.ts
import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("examples", (table) => {
    table.uuid("id").primary();
    table.string("name").notNullable();
    table.text("description");
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at");

    // Indexes
    table.index("created_at");
    table.index("name");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("examples");
}
```

### Common Column Types

```typescript
// UUID (primary key)
table.uuid("id").primary();

// Strings
table.string("name").notNullable();          // VARCHAR(255)
table.text("description");                   // TEXT (unlimited)

// Numbers
table.integer("count").notNullable();        // INTEGER
table.decimal("price", 10, 2);               // DECIMAL(10,2)
table.float("percentage");                   // FLOAT

// Booleans
table.boolean("is_active").defaultTo(false);

// Timestamps
table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
table.timestamp("updated_at");

// JSON/JSONB
table.jsonb("metadata");                     // JSONB (PostgreSQL)

// Foreign keys
table.uuid("user_id").notNullable()
  .references("id")
  .inTable("users")
  .onDelete("CASCADE");

// Indexes
table.index("user_id");
table.index(["user_id", "created_at"]);
table.unique("email");
```

### Migration with Foreign Keys

```typescript
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("site_soils", (table) => {
    table.uuid("id").primary();
    table.uuid("site_id").notNullable()
      .references("id")
      .inTable("sites")
      .onDelete("CASCADE");  // Delete soils when site is deleted
    table.string("type").notNullable();
    table.integer("surface_area").notNullable();

    table.index("site_id");
  });
}
```

### Running Migrations

```bash
# Run all pending migrations
pnpm --filter api knex:migrate-latest

# Rollback last migration
pnpm --filter api knex:migrate-rollback

# Check migration status
pnpm --filter api knex:migrate-status
```

## Table Types

**CRITICAL**: Always define TypeScript types for SQL tables in `tableTypes.d.ts`.

### Location

**[src/shared-kernel/adapters/sql-knex/tableTypes.d.ts](../../../apps/api/src/shared-kernel/adapters/sql-knex/tableTypes.d.ts)**

### Type Definition Pattern

```typescript
// src/shared-kernel/adapters/sql-knex/tableTypes.d.ts

export type SqlExample = {
  id: string;
  name: string;
  description: string | null;
  created_at: Date;  // Knex auto-converts timestamps to Date
  updated_at: Date | null;
};

export type SqlSiteSoil = {
  id: string;
  site_id: string;
  type: string;
  surface_area: number;
};
```

### Rules for Table Types

- ✅ Use `snake_case` for column names (matches database)
- ✅ Use `Date` for timestamp columns (Knex auto-converts)
- ✅ Mark nullable columns with `| null`
- ✅ Use exact database types (`string`, `number`, `boolean`, `Date`)
- ✅ Add type immediately after creating migration

### Knex Timestamp Handling

**IMPORTANT**: Knex automatically converts timestamp columns to JavaScript `Date` objects.

```typescript
// ✅ CORRECT - Use Date in type definition
export type SqlExample = {
  created_at: Date;  // Knex converts timestamp → Date
};

// ❌ WRONG - Don't use string for timestamps
export type SqlExample = {
  created_at: string;  // Wrong!
};
```

## SQL Patterns

### Basic Insert

```typescript
const row: SqlExample = {
  id: example.id,
  name: example.name,
  description: example.description,
  created_at: new Date(),
  updated_at: null,
};

await this.sqlConnection("examples").insert(row);
```

### Update

```typescript
const row: Partial<SqlExample> = {
  name: example.name,
  updated_at: new Date(),
};

await this.sqlConnection("examples")
  .where("id", example.id)
  .update(row);
```

### Select with Type Safety

```typescript
const row = await this.sqlConnection<SqlExample>("examples")
  .where("id", id)
  .first();

if (!row) return undefined;

// row is typed as SqlExample
```

### Transactions

For operations spanning multiple tables:

```typescript
async save(site: Site): Promise<void> {
  await this.sqlConnection.transaction(async (trx) => {
    // Insert main entity
    await trx("sites").insert({
      id: site.id,
      name: site.name,
      created_at: new Date(),
    });

    // Insert related entities
    if (site.address) {
      await trx("addresses").insert({
        id: uuid(),
        site_id: site.id,
        street: site.address.street,
        city: site.address.city,
      });
    }

    // Insert arrays
    if (site.soils.length > 0) {
      await trx("site_soils").insert(
        site.soils.map((soil) => ({
          id: uuid(),
          site_id: site.id,
          type: soil.type,
          surface_area: soil.surfaceArea,
        }))
      );
    }

    // All inserts succeed or all fail (rollback)
  });
}
```

### JSON Aggregation (PostgreSQL)

Aggregate related data into JSON:

```typescript
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
```

**JSON Functions**:
- `json_build_object()` - Create single JSON object
- `json_agg()` - Aggregate rows into JSON array
- `FILTER (WHERE ... IS NOT NULL)` - Exclude null rows from aggregation
- `COALESCE(..., '[]'::json)` - Default to empty array if no rows

### JSONB Column Operations

Insert JSONB data:

```typescript
// Use raw SQL for JSONB inserts in integration tests
await sqlConnection.raw(
  `INSERT INTO examples (id, items, created_at)
   VALUES (?, ?::jsonb, ?)`,
  [id, JSON.stringify([]), new Date()]
);
```

Query JSONB data:

```typescript
// Query JSONB column
const rows = await sqlConnection("examples")
  .select("*")
  .where("items", "@>", JSON.stringify([{ type: "test" }]));
```

## Naming Conventions

### Database → Application Mapping

```typescript
// Database (snake_case)
type SqlSite = {
  site_id: string;
  full_time_jobs_involved: number;
  created_at: Date;
};

// Application (camelCase)
type Site = {
  siteId: string;
  fullTimeJobsInvolved: number;
  createdAt: Date;
};

// Mapping in Repository
const row: SqlSite = {
  site_id: site.siteId,
  full_time_jobs_involved: site.fullTimeJobsInvolved,
  created_at: site.createdAt,
};
```

## Seeds (Test Data)

### Creating a Seed

```bash
pnpm --filter api knex:seed-make seed_name
```

### Seed Structure

```typescript
// seeds/01_examples.ts
import type { Knex } from "knex";
import { v4 as uuid } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Clear existing data
  await knex("examples").del();

  // Insert seed data
  await knex("examples").insert([
    {
      id: uuid(),
      name: "Example 1",
      created_at: new Date(),
    },
    {
      id: uuid(),
      name: "Example 2",
      created_at: new Date(),
    },
  ]);
}
```

### Running Seeds

```bash
# Run all seeds
pnpm --filter api knex:seed-run
```

## Best Practices

### DO:
- ✅ Create migration for every schema change
- ✅ Add table types to `tableTypes.d.ts` immediately
- ✅ Use transactions for multi-table operations
- ✅ Use indexes for frequently queried columns
- ✅ Use foreign keys with `onDelete` cascade when appropriate
- ✅ Use `snake_case` for database names
- ✅ Test migrations (up and down)

### DON'T:
- ❌ Don't modify database schema without migration
- ❌ Don't skip table type definitions
- ❌ Don't forget to add indexes
- ❌ Don't use `any` types for SQL operations
- ❌ Don't forget rollback strategy (`down` function)

## Common Knex Operations

```typescript
// Insert
await knex("table").insert(row);

// Update
await knex("table").where("id", id).update(row);

// Delete
await knex("table").where("id", id).delete();

// Select one
const row = await knex("table").where("id", id).first();

// Select many
const rows = await knex("table").where("active", true);

// Join
const rows = await knex("table1")
  .join("table2", "table1.id", "table2.table1_id")
  .select("table1.*", "table2.name");

// Count
const [{ count }] = await knex("table").count("* as count");

// Transaction
await knex.transaction(async (trx) => {
  await trx("table1").insert(...);
  await trx("table2").insert(...);
});
```

## Related Patterns

- **Repository**: [03-repository-pattern.md](03-repository-pattern.md) (using table types)
- **Query**: [04-query-pattern.md](04-query-pattern.md) (JSON aggregation, queries)
- **Integration Testing**: [06-integration-testing-pattern.md](06-integration-testing-pattern.md) (testing SQL)
- **Naming Conventions**: [09-naming-conventions.md](09-naming-conventions.md) (snake_case ↔ camelCase)