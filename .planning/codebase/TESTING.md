# Testing Patterns

**Analysis Date:** 2026-03-12

## Test Framework

**Runner:**
- Vitest 4.0.18 (unified across API and Web)
- Config: `test/vitest.config.ts` (API), `vite.config.ts` (Web)

**Test Types:**
- **Unit tests** (`.spec.ts`): Pure logic with mocks, no DB/HTTP
- **Integration tests** (`.integration-spec.ts`): Real database or HTTP calls

**Assertion Library:**
- Built-in Vitest assertions (`expect()`)
- Testing Library (`@testing-library/react` for Web components)

**Run Commands:**

API:
```bash
pnpm --filter api test                          # Run all tests (unit + integration)
pnpm --filter api test:unit                     # Unit tests only
pnpm --filter api test:integration              # Integration tests only
pnpm --filter api test:unit path/to/file.spec.ts          # Single unit test
pnpm --filter api test:integration path/to/file.integration-spec.ts # Single integration test
```

Web:
```bash
pnpm --filter web test                          # Run all tests
pnpm --filter web test path/to/file.spec.ts    # Single test file
```

E2E:
```bash
docker compose --env-file .env.e2e -f docker-compose.e2e.yml up  # Start stack
pnpm --filter e2e-tests test:e2e                 # Run all E2E tests (headless)
pnpm --filter e2e-tests test:headed              # Run with browser visible
```

## Test File Organization

**Location (API):**
- Unit tests: Colocated with source → `src/sites/core/usecases/createSite.usecase.spec.ts`
- Integration tests: Colocated with source → `src/sites/adapters/primary/sites.controller.integration-spec.ts`

**Location (Web):**
- Unit tests: Colocated with source → `src/features/sites/core/__tests__/siteView.reducer.spec.ts`
- Component tests: Colocated with component → `src/features/sites/views/SiteList.spec.tsx`

**Naming:**
- Unit: `[feature].spec.ts` → `soilsCo2eqStorage.spec.ts`
- Integration: `[feature].integration-spec.ts` → `sites.controller.integration-spec.ts`
- Web tests: `[feature].spec.ts` or `[feature].spec.tsx` → `siteView.reducer.spec.ts`, `ExportModal.spec.tsx`

**Structure:**
```
apps/api/src/[feature]/
├── core/
│   ├── usecases/
│   │   ├── createSite.usecase.ts
│   │   └── createSite.usecase.spec.ts              # Unit test
│   └── model/
│       └── impacts.spec.ts
├── adapters/
│   ├── primary/
│   │   ├── sites.controller.ts
│   │   └── sites.controller.integration-spec.ts    # Integration test
│   └── secondary/
│       ├── repositories/
│       │   ├── SqlSiteRepository.ts
│       │   └── SqlSiteRepository.integration-spec.ts
│       └── queries/
│           ├── SqlSitesQuery.ts
│           └── SqlSitesQuery.integration-spec.ts
```

## Test Structure

**Unit Test Suite (API UseCase):**

```typescript
import { TResult, fail, success } from "src/shared-kernel/result";
import { GetReconversionProjectFeaturesUseCase } from "./getReconversionProjectFeatures.usecase";

describe("GetReconversionProjectFeaturesUseCase", () => {
  it("returns project features when found", async () => {
    const mockQuery = {
      getFeaturesById: vi.fn().mockResolvedValue({
        id: "proj-123",
        name: "Test Project",
        // ... complete features
      }),
    };
    const useCase = new GetReconversionProjectFeaturesUseCase(mockQuery);

    const result = await useCase.execute({ reconversionProjectId: "proj-123" });

    expect(result.isSuccess()).toBe(true);
    expect(result.getValue()).toEqual({
      id: "proj-123",
      name: "Test Project",
      // ... complete features
    });
  });

  it("fails when project ID is missing", async () => {
    const mockQuery = { getFeaturesById: vi.fn() };
    const useCase = new GetReconversionProjectFeaturesUseCase(mockQuery);

    const result = await useCase.execute({ reconversionProjectId: "" });

    expect(result.isFailure()).toBe(true);
    expect(result.getError()).toBe("ReconversionProjectIdRequired");
  });

  it("fails when project not found", async () => {
    const mockQuery = { getFeaturesById: vi.fn().mockResolvedValue(null) };
    const useCase = new GetReconversionProjectFeaturesUseCase(mockQuery);

    const result = await useCase.execute({ reconversionProjectId: "missing" });

    expect(result.isFailure()).toBe(true);
    expect(result.getError()).toBe("ReconversionProjectNotFound");
  });
});
```

**Integration Test Suite (Controller):**

```typescript
import { NestExpressApplication } from "@nestjs/platform-express";
import { Knex } from "knex";
import supertest from "supertest";
import { createTestApp } from "test/testApp";

describe("ReconversionProjects controller", () => {
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

  describe("POST /reconversion-projects", () => {
    it("responds with 401 when no authentication provided", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-projects")
        .send(buildMinimalReconversionProjectProps());

      expect(response.status).toEqual(401);
    });

    it("creates project with valid authentication and data", async () => {
      const requestBody = buildMinimalReconversionProjectProps();
      const user = new UserBuilder().withId(requestBody.createdBy).build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-projects")
        .set("Cookie", [`access_token=${accessToken}`])
        .send(requestBody);

      expect(response.status).toEqual(201);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: requestBody.name,
        }),
      );
    });
  });
});
```

**Redux Reducer Test (Web):**

```typescript
import { createStore } from "@/app/store/store";
import { getTestAppDependencies } from "@/test/testAppDependencies";
import { fetchSiteView } from "../fetchSiteView.action";
import { selectSitePageViewModel } from "../siteView.reducer";

describe("siteView reducer", () => {
  it("sets loading state during fetch", async () => {
    const store = createStore(getTestAppDependencies());
    const siteId = "site-123";

    const fetchPromise = store.dispatch(fetchSiteView({ siteId }));

    // During fetch, state should be loading
    expect(store.getState().siteView.byId[siteId]?.loadingState).toBe("loading");

    await fetchPromise;

    // After fetch, state should be success
    expect(store.getState().siteView.byId[siteId]?.loadingState).toBe("success");
  });

  it("sets error state when fetch fails", async () => {
    const store = createStore(
      getTestAppDependencies({
        siteService: new InMemorySiteServiceWithError(),
      }),
    );

    await store.dispatch(fetchSiteView({ siteId: "site-456" }));

    expect(store.getState().siteView.byId["site-456"]).toEqual({
      loadingState: "error",
      data: undefined,
    });
  });
});
```

**Selector Test (Web):**

```typescript
import type { RootState } from "@/app/store/store";
import { selectSiteFeaturesViewData } from "../siteFeatures.selectors";

describe("siteFeatures ViewData selectors", () => {
  it("returns site features and loading state", () => {
    const state = {
      // ... other state
      siteFeatures: {
        dataLoadingState: "success",
        siteData: {
          id: "site-123",
          name: "Mon Site",
          nature: "FRICHE",
          isExpressSite: false,
          // ... all properties
        },
      },
    } satisfies RootState;

    const viewData = selectSiteFeaturesViewData(state);

    expect(viewData).toEqual({
      loadingState: "success",
      siteFeatures: {
        id: "site-123",
        name: "Mon Site",
        nature: "FRICHE",
        // ... all properties
      },
    });
  });
});
```

## Mocking

**Framework:** Vitest's `vi` object for all mocking

**Patterns:**

```typescript
import { vi } from "vitest";

// Mock function
const mockQuery = {
  getFeaturesById: vi.fn().mockResolvedValue({ id: "123", name: "Test" }),
};

// Mock with different return values per call
const mockService = {
  fetch: vi
    .fn()
    .mockResolvedValueOnce({ data: "first" })
    .mockResolvedValueOnce({ data: "second" })
    .mockRejectedValueOnce(new Error("failed")),
};

// Restore all mocks after test
afterEach(() => {
  vi.restoreAllMocks();
});
```

**What to Mock:**
- External dependencies (gateways, repositories, queries)
- HTTP calls (HTTP services)
- Date providers (deterministic timestamps)
- ID generators (predictable test data)

**What NOT to Mock:**
- Pure business logic (domain models, value objects)
- Core calculation functions
- State shape (test real reducers, use real state)

**InMemory Implementations (API):**
- Required for all gateway interfaces
- Stored in-memory during test, reset between tests
- Location: `src/[feature]/adapters/secondary/*/InMemory*.ts`
- Pattern: `implements GatewayInterface` with in-memory array storage

```typescript
export class InMemoryReconversionProjectRepository
  implements ReconversionProjectRepository
{
  private reconversionProjects: ReconversionProjectSaveDto[] = [];

  async save(project: ReconversionProjectSaveDto) {
    this.reconversionProjects.push(project);
    await Promise.resolve(); // Simulate async
  }

  async getById(id: string): Promise<ReconversionProjectDataView | null> {
    const found = this.reconversionProjects.find((p) => p.id === id);
    return Promise.resolve(found ?? null);
  }

  _setReconversionProjects(projects: ReconversionProjectSaveDto[]) {
    this.reconversionProjects = projects; // Test helper for state setup
  }
}
```

**InMemory Implementations (Web):**
- Required for all gateway interfaces
- Location: `src/[feature]/infrastructure/*/InMemory*Service.ts`
- Registered in `getTestAppDependencies()` helper

## Test Data & Fixtures

**Test Builders (API):**
- Located in `*.mock.ts` files alongside domain models
- Factory pattern with chainable methods → `new UserBuilder().withId("123").build()`
- Example: `buildMinimalReconversionProjectProps()`, `buildExhaustiveReconversionProjectProps()`

```typescript
// src/reconversion-projects/core/model/reconversionProject.mock.ts
export const buildMinimalReconversionProjectProps = () => ({
  id: uuid(),
  name: "Test Project",
  createdBy: uuid(),
  relatedSiteId: uuid(),
  // ... mandatory fields only
});

export class UrbanProjectBuilder {
  private data: UrbanProjectProps = { /* defaults */ };

  withId(id: string) {
    this.data.id = id;
    return this;
  }

  build(): UrbanProjectProps {
    return this.data;
  }
}
```

**Store Helpers (Web):**
- `StoreBuilder` pattern for Redux tests
- Location: `src/features/[feature]/__tests__/_testStoreHelpers.ts`

```typescript
export class StoreBuilder {
  private state = createDefaultState();

  withSiteData(siteData: SiteFeatures) {
    this.state.siteFeatures.siteData = siteData;
    return this;
  }

  withLoadingState(state: LoadingState) {
    this.state.siteFeatures.dataLoadingState = state;
    return this;
  }

  build() {
    return createStore(getTestAppDependencies(), this.state);
  }
}

// Usage
const store = new StoreBuilder()
  .withSiteData({ id: "site-1", name: "Test" })
  .withLoadingState("success")
  .build();
```

**Mock Providers (Web):**
- `getTestAppDependencies()` injects InMemory services into store
- Located in `src/test/testAppDependencies.ts`

## Database Testing (Integration Tests)

**Automatic Cleanup:**
- Global hook in `test/integration-tests-global-hooks.ts`
- Runs `afterEach()` to clear all 21 API tables
- No manual cleanup needed in test files

**Tables Cleared:**
`reconversion_compatibility_evaluations`, `reconversion_project_*` (all variants), `sites`, `addresses`, `site_*` (expenses, incomes, etc.), `users`, `domain_events`, etc.

**Test App Setup:**
```typescript
import { createTestApp } from "test/testApp";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

beforeAll(async () => {
  app = await createTestApp(); // Creates NestJS app with test DB
  await app.init();
  sqlConnection = app.get(SqlConnection);
});

afterAll(async () => {
  await app.close();
  await sqlConnection.destroy();
});
```

**Authentication in Tests:**
```typescript
import { authenticateUser } from "test/testApp";

const user = new UserBuilder().withId(userId).build();
const { accessToken } = await authenticateUser(app)(user);

await supertest(app.getHttpServer())
  .post("/api/endpoint")
  .set("Cookie", [`access_token=${accessToken}`])
  .send(payload);
```

## Coverage

**Requirements:** No enforced minimum

**View Coverage:**
```bash
# Vitest includes built-in coverage via @vitest/coverage-v8
pnpm --filter api test:unit --coverage     # Unit test coverage
pnpm --filter api test:integration --coverage # Integration test coverage
```

## Assertion Patterns

**Preferred: Single expect() for complete validation**

- Forces thinking about entire data shape upfront
- Catches missing properties multi-assertion approaches miss
- More readable: "function returns exactly this structure"

```typescript
// PREFERRED: Single expect for complete validation
expect(result).toEqual({
  id: siteId,
  features: {
    id: siteId,
    name: "Site Name",
    nature: "FRICHE",
    surfaceArea: 1000,
    // ... all expected properties
  },
  reconversionProjects: [
    {
      id: project1Id,
      name: "Project 1",
      type: "PHOTOVOLTAIC_POWER_PLANT",
    },
    // ... all projects
  ],
});
```

**Exception: Use targeted assertions when**

- Only specific properties matter (partial validation)
- Properties are non-deterministic (UUIDs, timestamps)
- Object is very large (break into logical chunks)

```typescript
// EXCEPTION: Partial when only specific properties matter
expect(result.id).toEqual(siteId);
expect(result.reconversionProjects).toHaveLength(2);

// EXCEPTION: Non-deterministic properties
expect(result).toEqual({
  id: expect.any(String),        // UUID varies
  createdAt: expect.any(Date),   // Timestamp varies
  name: "Exact Site Name",       // But name must be exact
});
```

## Test Types & Scope

**Unit Tests:**
- UseCase with InMemory gateways (no DB)
- Domain models, value objects, pure functions
- Reducers, selectors, utility functions
- Span: Single business logic behavior
- Example: "UseCase returns error when site already exists"

**Integration Tests:**
- SQL Repository/Query against real database
- Controller → UseCase → Repository → DB flow
- Real HTTP requests with authentication
- Span: Feature endpoint with real dependencies
- Example: "POST /sites creates site in DB and returns 201"

**E2E Tests:**
- Full user journeys with Playwright
- Requires running stack (Docker)
- Tests UI interactions, form validation, navigation
- Located: `apps/e2e-tests/tests/`

## Common Test Patterns

**Async Testing:**

```typescript
it("should fetch and update state", async () => {
  const store = createStore(getTestAppDependencies());

  await store.dispatch(fetchSiteView({ siteId: "site-123" }));

  expect(store.getState().siteView.byId["site-123"].loadingState).toBe("success");
});
```

**Error Testing:**

```typescript
it("fails when validation fails", async () => {
  const mockQuery = {
    getFeaturesById: vi.fn().mockRejectedValue(new Error("DB error")),
  };
  const useCase = new GetReconversionProjectFeaturesUseCase(mockQuery);

  const result = await useCase.execute({ reconversionProjectId: "123" });

  expect(result.isFailure()).toBe(true);
  // Handle error gracefully
});
```

**HTTP Request Testing:**

```typescript
it("validates request body with ZodValidationPipe", async () => {
  const invalidPayload = {
    id: "proj-123",
    // missing required 'name' field
  };

  const response = await supertest(app.getHttpServer())
    .post("/api/reconversion-projects")
    .set("Cookie", [`access_token=${accessToken}`])
    .send(invalidPayload);

  expect(response.status).toEqual(400);
  expect(response.body.errors).toContainEqual(
    expect.objectContaining({ path: ["name"] }),
  );
});
```

**Component Testing (Web):**

```typescript
import { render, screen } from "@testing-library/react";

it("renders site features", () => {
  const viewData = {
    loadingState: "success",
    siteFeatures: { id: "site-1", name: "Test Site" },
  };

  render(<SiteDetailsPage viewData={viewData} />);

  expect(screen.getByText("Test Site")).toBeInTheDocument();
});
```

## Test Discipline: TDD

**One Test at a Time:**
- Write failing test → make pass → refactor
- Never write multiple tests before making first one pass
- Applies to **all** test types: unit, integration, E2E

**Example for query with multiple scenarios:**

1. Test: "returns empty array when no projects exist" → Pass → Done
2. Test: "returns projects when exist" → Pass → Done
3. Test: "returns projects filtered by status" → Pass → Done

Each scenario is tested before moving to next, ensuring none are accidentally skipped.

---

*Testing analysis: 2026-03-12*
