# Integration Testing Pattern

> **Testing with real database** for SQL implementations and full HTTP flows.

## Overview

Integration tests verify that SQL implementations (repositories, queries) and HTTP flows (controllers) work correctly with real infrastructure. They use TestContainers for isolated PostgreSQL instances and supertest for HTTP assertions, ensuring database queries, transactions, and full request-response cycles function as expected in production-like environments.

## Core Principles

1. **Real Infrastructure**: Use actual PostgreSQL database via TestContainers, not mocks
2. **Isolated Tests**: Each test cleans database state in `beforeEach()` for independence
3. **Full Stack Testing**: Controllers test complete HTTP → UseCase → Database flow
4. **Authentication Required**: Test both authenticated and unauthenticated scenarios
5. **Exhaustive Validation**: Verify database state after mutations, test all error cases
6. **Type-Safe HTTP**: Use typed request/response bodies with supertest

## Types of Integration Tests

| Type | What It Tests | Database | HTTP |
|------|--------------|----------|------|
| **SQL Repository** | Repository implementation against real DB | ✅ | ❌ |
| **SQL Query** | Query implementation against real DB | ✅ | ❌ |
| **Controller** | Full flow: HTTP → Controller → UseCase → DB | ✅ | ✅ |

## SQL Repository Integration Tests

Test repository write operations against real database.

**Real Examples**:
- [SqlSiteRepository.integration-spec.ts](../../../apps/api/src/sites/adapters/secondary/site-repository/SqlSiteRepository.integration-spec.ts)
- [SqlReconversionProjectRepository.integration-spec.ts](../../../apps/api/src/reconversion-projects/adapters/secondary/repositories/reconversion-project/SqlReconversionProjectRepository.integration-spec.ts)
- [SqlUserRepository.integration-spec.ts](../../../apps/api/src/auth/adapters/user-repository/SqlUserRepository.integration-spec.ts)

### Test Structure

```typescript
// adapters/secondary/example-repository/SqlExampleRepository.integration-spec.ts
import { Knex } from "knex";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";
import { createTestApp } from "test/testApp";
import { SqlConnection } from "@/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { SqlExampleRepository } from "./SqlExampleRepository";

describe("SqlExampleRepository integration", () => {
  let app: NestExpressApplication;
  let sqlConnection: Knex;
  let repository: SqlExampleRepository;

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    // Clean database before each test
    await sqlConnection("examples").delete();
    repository = new SqlExampleRepository(sqlConnection);
  });

  it("should save example to database", async () => {
    const example = {
      id: "test-id",
      name: "Test Example",
      createdAt: new Date("2024-01-01"),
    };

    await repository.save(example);

    const saved = await sqlConnection("examples")
      .where("id", "test-id")
      .first();

    expect(saved).toEqual({
      id: "test-id",
      name: "Test Example",
      created_at: new Date("2024-01-01"),
    });
  });
});
```

## SQL Query Integration Tests

Test query read operations against real database.

**Real Examples**:
- [SqlSitesQuery.integration-spec.ts](../../../apps/api/src/sites/adapters/secondary/site-query/SqlSitesQuery.integration-spec.ts)
- [SqlReconversionProjectsListQuery.integration-spec.ts](../../../apps/api/src/reconversion-projects/adapters/secondary/queries/reconversion-project-list/SqlReconversionProjectsListQuery.integration-spec.ts)
- [SqlCarbonStorageQuery.integration-spec.ts](../../../apps/api/src/carbon-storage/adapters/secondary/carbon-storage-query/SqlCarbonStorageQuery.integration-spec.ts)

```typescript
// adapters/secondary/examples-query/SqlExamplesQuery.integration-spec.ts
import { Knex } from "knex";
import { beforeAll, afterAll, beforeEach, describe, it, expect } from "vitest";
import { createTestApp } from "test/testApp";
import { SqlConnection } from "@/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { NestExpressApplication } from "@nestjs/platform-express";

import { SqlExamplesQuery } from "./SqlExamplesQuery";

describe("SqlExamplesQuery integration", () => {
  let app: NestExpressApplication;
  let sqlConnection: Knex;
  let query: SqlExamplesQuery;

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    await sqlConnection("examples").delete();
    query = new SqlExamplesQuery(sqlConnection);
  });

  it("should return example by id", async () => {
    await sqlConnection("examples").insert({
      id: "test-id",
      name: "Test Example",
      created_at: new Date("2024-01-01"),
    });

    const result = await query.getById("test-id");

    expect(result).toEqual({
      id: "test-id",
      name: "Test Example",
      createdAt: "2024-01-01T00:00:00.000Z",
    });
  });

  it("should return undefined when not found", async () => {
    const result = await query.getById("non-existent");

    expect(result).toBeUndefined();
  });
});
```

## Controller Integration Tests

Test full HTTP → Controller → UseCase → DB flow.

**Real Examples**:
- [reconversionCompatibility.controller.integration-spec.ts](../../../apps/api/src/reconversion-compatibility/adapters/primary/reconversionCompatibility.controller.integration-spec.ts)
- [sites.controller.integration-spec.ts](../../../apps/api/src/sites/adapters/primary/sites.controller.integration-spec.ts)
- [reconversionProjects.controller.integration-spec.ts](../../../apps/api/src/reconversion-projects/adapters/primary/reconversionProjects.controller.integration-spec.ts)
- [users.controller.integration-spec.ts](../../../apps/api/src/users/adapters/primary/users.controller.integration-spec.ts)
- [auth.controller.integration-spec.ts](../../../apps/api/src/auth/adapters/auth.controller.integration-spec.ts)

### Test Structure

```typescript
// adapters/primary/examples.controller.integration-spec.ts
import { NestExpressApplication } from "@nestjs/platform-express";
import { Knex } from "knex";
import supertest from "supertest";
import { authenticateUser, createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { ACCESS_TOKEN_COOKIE_KEY } from "@/auth/adapters/access-token/accessTokenCookie";
import { SqlConnection } from "@/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserBuilder } from "@/users/core/model/user.mock";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("Examples controller", () => {
  let app: NestExpressApplication;
  let sqlConnection: Knex;

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  describe("POST /examples", () => {
    it("responds with 401 if not authenticated", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/api/examples")
        .send({ name: "Test" });

      expect(response.status).toEqual(401);
    });

    it("can't create example without mandatory field 'name'", async () => {
      const user = new UserBuilder().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/examples")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({});

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty("errors");

      const responseErrors = (response.body as BadRequestResponseBody).errors;
      expect(responseErrors).toHaveLength(1);
      expect(responseErrors[0]?.path).toContain("name");
    });

    it("creates example and saves it to database", async () => {
      const user = new UserBuilder().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/examples")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ name: "Test Example" });

      expect(response.status).toEqual(201);
      expect(response.body).toEqual({
        exampleId: expect.any(String),
      });

      const examplesInDb = await sqlConnection("examples")
        .select("*")
        .where("id", response.body.exampleId);

      expect(examplesInDb).toHaveLength(1);
      expect(examplesInDb[0]).toEqual({
        id: response.body.exampleId,
        name: "Test Example",
        // oxlint-disable-next-line typescript/no-unsafe-assignment
        created_at: expect.any(Date),
      });
    });

    it("returns conflict error when example name already exists", async () => {
      const user = new UserBuilder().build();
      const { accessToken } = await authenticateUser(app)(user);

      await sqlConnection("examples").insert({
        id: uuid(),
        name: "Test",
        created_at: new Date(),
      });

      const response = await supertest(app.getHttpServer())
        .post("/api/examples")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ name: "Test" });

      expect(response.status).toEqual(409);
    });
  });

  describe("GET /examples/:id", () => {
    it("responds with 401 if not authenticated", async () => {
      const response = await supertest(app.getHttpServer())
        .get("/api/examples/test-id");

      expect(response.status).toEqual(401);
    });

    it("returns example from database", async () => {
      const user = new UserBuilder().build();
      const { accessToken } = await authenticateUser(app)(user);

      const exampleId = uuid();
      await sqlConnection("examples").insert({
        id: exampleId,
        name: "Test Example",
        created_at: new Date("2024-01-01"),
      });

      const response = await supertest(app.getHttpServer())
        .get(`/api/examples/${exampleId}`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: exampleId,
        name: "Test Example",
        createdAt: "2024-01-01T00:00:00.000Z",
      });
    });

    it("returns 404 when example not found", async () => {
      const user = new UserBuilder().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .get("/api/examples/non-existent")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`);

      expect(response.status).toEqual(404);
    });
  });
});
```

### Testing Multiple Required Fields

Use `it.each()` for testing multiple required fields:

```typescript
it.each(["name", "email"] as const)(
  "can't create example without mandatory field '%s'",
  async (mandatoryField) => {
    const user = new UserBuilder().build();
    const { accessToken } = await authenticateUser(app)(user);

    // oxlint-disable-next-line typescript/no-unused-vars
    const { [mandatoryField]: _, ...body } = {
      name: "Test",
      email: "test@example.com",
    };

    const response = await supertest(app.getHttpServer())
      .post("/api/examples")
      .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
      .send(body);

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty("errors");

    const responseErrors = (response.body as BadRequestResponseBody).errors;
    expect(responseErrors).toHaveLength(1);
    expect(responseErrors[0]?.path).toContain(mandatoryField);
  }
);
```

### Testing JSONB Arrays

When testing JSONB arrays, use raw SQL for inserts:

```typescript
it("updates jsonb array in database", async () => {
  const user = new UserBuilder().build();
  const { accessToken } = await authenticateUser(app)(user);

  const exampleId = uuid();

  // Use raw SQL for JSONB inserts
  await sqlConnection.raw(
    `INSERT INTO examples (id, name, items, created_at)
     VALUES (?, ?, ?::jsonb, ?)`,
    [exampleId, "Test", JSON.stringify([]), new Date()]
  );

  const response = await supertest(app.getHttpServer())
    .post(`/api/examples/${exampleId}/add-item`)
    .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
    .send({ itemId: "item-1" });

  expect(response.status).toEqual(201);

  const examplesInDb = await sqlConnection("examples")
    .select("*")
    .where({ id: exampleId });

  expect(examplesInDb[0]?.items).toEqual([
    {
      itemId: "item-1",
      // oxlint-disable-next-line typescript/no-unsafe-assignment
      createdAt: expect.any(String), // stored as ISO string in JSONB
    },
  ]);
});
```

## Test Utilities

### Authentication Helper

```typescript
import { authenticateUser } from "test/testApp";
import { UserBuilder } from "@/users/core/model/user.mock";

const user = new UserBuilder().asLocalAuthority().build();
const { accessToken } = await authenticateUser(app)(user);
```

### Cookie Authentication

```typescript
import { ACCESS_TOKEN_COOKIE_KEY } from "@/auth/adapters/access-token/accessTokenCookie";

const response = await supertest(app.getHttpServer())
  .post("/api/examples")
  .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
  .send({ name: "Test" });
```

## Running Integration Tests

```bash
# Run all integration tests
pnpm --filter api test:integration

# Run specific test file
pnpm --filter api test:integration path/to/file.integration-spec.ts

# Watch mode
pnpm --filter api test:integration -- --watch
```

## Best Practices

### DO:
- ✅ Use `createTestApp()` from `test/testApp`
- ✅ Get `sqlConnection` via `app.get(SqlConnection)`
- ✅ Clean database in `beforeEach` (per-test isolation)
- ✅ Close app and destroy connection in `afterAll`
- ✅ Test authentication (401 responses)
- ✅ Test validation errors (400 responses with field paths)
- ✅ Use `it.each()` for testing multiple required fields
- ✅ Use raw SQL for JSONB array inserts
- ✅ Verify data in database after mutations
- ✅ Use `expect.any(Date)` for date comparisons
- ✅ Use `toEqual()` for exhaustive assertions

### DON'T:
- ❌ Don't share state between tests
- ❌ Don't forget to test authentication
- ❌ Don't forget to clean database
- ❌ Don't skip error cases (404, 409, 400)
- ❌ Don't leave connections open

## Common HTTP Status Codes

| Status | When to Use | Example Test |
|--------|-------------|--------------|
| **200** | Successful GET | `expect(response.status).toEqual(200)` |
| **201** | Successful POST/creation | `expect(response.status).toEqual(201)` |
| **400** | Validation error | Test missing required fields |
| **401** | Not authenticated | Test without access token |
| **403** | Not authorized | Test accessing other user's resource |
| **404** | Resource not found | Test with non-existent ID |
| **409** | Conflict | Test duplicate creation |
| **500** | Server error | Test business logic errors |

## Related Patterns

- **Unit Testing**: [05-unit-testing-pattern.md](05-unit-testing-pattern.md) (testing with InMemory)
- **Controller**: [02-controller-pattern.md](02-controller-pattern.md) (HTTP layer)
- **Repository**: [03-repository-pattern.md](03-repository-pattern.md) (SQL implementation)
- **Query**: [04-query-pattern.md](04-query-pattern.md) (SQL queries)
