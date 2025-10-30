# AI Coding Guide - Benefriches API

> **Purpose**: Quick reference for AI code generation. Focus on patterns, not explanations.

---

## ✅ Code Quality Standards

**For complete TypeScript rules, linting, formatting, and pre-commit hooks, see [root CLAUDE.md → Code Quality Standards](../../CLAUDE.md#-code-quality-standards).**

All code must pass these checks:

- `pnpm typecheck` - TypeScript strict mode
- `pnpm lint` - oxlint with type checking
- `pnpm format` - Prettier formatting
- Pre-commit hooks enforce these automatically

---

## 🏗️ Architecture Pattern: Clean/Hexagonal + CQS

**Dependency Rule**: `core/` NEVER imports from `adapters/`

```
module/
├── core/
│   ├── models/[entity].ts           # Domain models (types, classes, enums)
│   ├── gateways/[Name]Repository.ts # Write interface
│   ├── gateways/[Name]Query.ts      # Read interface
│   ├── usecases/[verb][Noun].usecase.ts
│   └── events/[event].event.ts
└── adapters/
    ├── primary/
    │   ├── [module].controller.ts
    │   └── [module].module.ts
    └── secondary/
        ├── [name]-repository/
        │   ├── Sql[Name]Repository.ts
        │   └── InMemory[Name]Repository.ts
        └── [name]-query/
            ├── Sql[Name]Query.ts
            └── InMemory[Name]Query.ts
```

---

## 📝 Code Templates

**For detailed code templates and examples, see [CLAUDE-PATTERNS.md](./CLAUDE-PATTERNS.md).**

This includes:

- Domain Models (Type-based, Class-based, Zod schemas)
- ViewModels & Gateway Interfaces
- UseCase implementations
- Unit tests (happy path & failure cases)
- SQL Repository, Query, and In-Memory implementations
- Controllers & NestJS Modules
- Error handling, Domain events, Migrations
- Transactions & JSON aggregation queries

---

## 🎯 Naming & File Conventions

### Code Element Naming

- **Classes**: `PascalCase` → `CreateSiteUseCase`, `SqlSiteRepository`
- **Variables/Functions**: `camelCase` → `siteRepository`, `getUserSites`
- **Constants**: `UPPER_SNAKE_CASE` → `SITE_CREATED`, `SQL_CONNECTION`
- **Types/Interfaces**: `PascalCase` → `SitesRepository`, `SiteViewModel`
- **Error Types**: `PascalCase` (noun-based, describes error state) → `"UserNotFound"`, `"ValidationFailed"`, `"AlreadyExists"`, `"Unauthorized"`

### File Naming

| Type                       | Pattern                                   | Example                                 |
| -------------------------- | ----------------------------------------- | --------------------------------------- |
| UseCase                    | `[verb][Noun].usecase.ts`                 | `createSite.usecase.ts`                 |
| UseCase Test               | `[verb][Noun].usecase.spec.ts`            | `createSite.usecase.spec.ts`            |
| SQL Repository Integration | `Sql[Name]Repository.integration-spec.ts` | `SqlSiteRepository.integration-spec.ts` |
| Controller Integration     | `[module].controller.integration-spec.ts` | `sites.controller.integration-spec.ts`  |
| Controller                 | `[module].controller.ts`                  | `sites.controller.ts`                   |
| Module                     | `[module].module.ts`                      | `sites.module.ts`                       |
| Repository                 | `Sql[Name]Repository.ts`                  | `SqlSiteRepository.ts`                  |
| Query                      | `Sql[Name]Query.ts`                       | `SqlSitesQuery.ts`                      |
| In-Memory                  | `InMemory[Name][Type].ts`                 | `InMemorySiteRepository.ts`             |
| Mock                       | `[entity].mock.ts`                        | `site.mock.ts`                          |
| Event                      | `[eventName].event.ts`                    | `siteCreated.event.ts`                  |

### Database Naming

- **Tables**: `snake_case` → `sites`, `reconversion_projects`
- **Columns**: `snake_case` → `site_id`, `created_at`, `surface_area`
- **App Properties**: `camelCase` → `siteId`, `createdAt`, `surfaceArea`

---

## 🗺️ Path Aliases

Use these consistently for clean, maintainable imports:

### `@/` - Absolute imports within API

Resolves to `apps/api/src/`. Use for any cross-module import.

```typescript
// ✅ CORRECT: Shared kernel imports
import { UseCase } from "@/shared-kernel/usecase";
import type { TResult } from "@/shared-kernel/result";

// ✅ CORRECT: Other module imports
import { CreateSiteUseCase } from "@/sites/core/usecases/createSite.usecase";
import type { SitesRepository } from "@/sites/core/gateways/SitesRepository";

// ❌ WRONG: Using relative paths for cross-module (use @/ instead)
import { CreateSiteUseCase } from "../../../../sites/core/usecases/createSite.usecase";

// ❌ WRONG: Using @/ for shared package (use "shared" instead)
import type { Site } from "@/shared";
```

### `"shared"` - Shared package imports

Resolves to `packages/shared`. Use for monorepo-wide types.

```typescript
// ✅ CORRECT: Shared package types
import type { Site } from "shared";
import type { UserId } from "shared";
import { validateEmail } from "shared";

// ❌ WRONG: Using @/ for shared package
import type { Site } from "@/shared";

// ❌ WRONG: Using relative paths to shared
import type { Site } from "../../../packages/shared/src";
```

### Relative imports (`./` or `../`) - Same feature module only

Use only for files within the same feature module:

```typescript
// File: apps/api/src/sites/core/usecases/createSite.usecase.ts
// ✅ CORRECT: Within same feature (sites module)
// ❌ WRONG: Cross-module relative import (use @/ instead)
import { CreateProjectUseCase } from "../../../reconversion-projects/core/usecases/...";
import type { SitesRepository } from "../gateways/SitesRepository";
import type { Site } from "../models/site";
```

### Rules Summary

- ✅ Use `@/` for any cross-module import within API
- ✅ Use `"shared"` for types/utilities from shared package
- ✅ Use relative `./` or `../` **only** within same feature module
- ❌ Never use `../../../` chains (use `@/` instead)
- ❌ Never use `@/shared` (use `"shared"` instead)

---

## ⬆️ Result Pattern (Core to API Design)

**All usecases MUST implement `UseCase<Request, TResult<Data, Error>>`** - Compiler enforces this.

### Core Concept

Every usecase returns a `TResult<Data, Error>` that is either:

- **Success**: Operation completed successfully, contains data
- **Failure**: Domain error occurred, contains error details

### Quick Usage

```typescript
import { fail, success, type TResult } from "@/shared-kernel/result";

export class MyUseCase implements UseCase<Request, TResult<Response, Error>> {
  async execute(request: Request): Promise<TResult<Response, Error>> {
    if (validRequest) {
      return success({ id: "123", name: "Example" });
    }
    return fail("ValidationFailed");
  }
}
```

### Available Imports

```typescript
import {
  fail,
  // Create failure: fail("ErrorType")
  success,
  // Create success: success(data)
  type TResult,
  // Result<SuccessType, ErrorType>
  type SuccessResult,
  // Success variant only
  type FailureResult, // Failure variant only
} from "@/shared-kernel/result";
```

**For advanced patterns and test examples, see [CLAUDE-PATTERNS.md → UseCase (Result Pattern)](./CLAUDE-PATTERNS.md#3-usecase-result-pattern).**

---

## ✅ Critical Rules

### ALWAYS:

1. **Use Result Pattern**: (See [Result Pattern section](#-result-pattern-core-to-api-design) above) - Compiler enforces
2. **Separate CQS**: Repository (write) ≠ Query (read)
3. **Implement UseCase interface**: `UseCase<Request, TResult<...>>`
4. **Validate domain models**: Use appropriate validation (Zod, classes, types) based on your needs
5. **Map naming**: snake_case (DB) ↔ camelCase (app)
6. **Factory pattern** in NestJS modules
7. **InMemory implementations** for all gateways (testing)
8. **Transactions** for multi-table operations
9. **Type imports** with `import type { }`
10. **Gateway interfaces** for all dependencies

### NEVER:

1. ❌ Import `adapters/` code in `core/`
2. ❌ Use concrete classes in UseCase constructor types
3. ❌ Mix business logic in controllers
4. ❌ Use `any` type (use `unknown`)
5. ❌ Combine reads + writes in same interface
6. ❌ Skip unit tests
7. ❌ Modify DB without migration
8. ❌ Return domain entities from controllers (use ViewModels)

---

## 🚀 Feature Checklist (TDD Approach)

When adding a feature, follow this TDD workflow:

### Phase 1: UseCase Core (TDD Red-Green-Refactor)

1. ✅ **Gateway interfaces**: `core/gateways/[Name]Repository.ts` + `[Name]Query.ts` (minimal, just what UseCase needs)
2. ✅ **Empty UseCase skeleton**: `core/usecases/[verb][Noun].usecase.ts` with minimal structure
3. ✅ **Nominal unit test**: Write the happy path test FIRST → 🔴 **RED** (test fails)
4. ✅ **InMemory implementation**: `adapters/secondary/*/InMemory*.ts` for testing
5. ✅ **Implement UseCase**: Make the nominal test pass → 🟢 **GREEN**
6. ✅ **Add edge case tests**: Failure scenarios, validation errors, boundary conditions
7. ✅ **Refactor**: Clean up implementation while keeping all tests green → 🔵 **REFACTOR**

### Phase 2: Domain Models & Mocks

8. ✅ **Domain model** (if needed): `core/models/[entity].ts` (type, class, or Zod schema)
9. ✅ **Mock factory**: `core/models/[entity].mock.ts`

### Phase 3: SQL Implementation (Test-First)

10. ✅ **Migration**: `migrations/[timestamp]_*.ts` - Create database schema
11. ✅ **Table types**: Update `shared-kernel/adapters/sql-knex/tableTypes.d.ts`
12. ✅ **SQL Repository/Query**: `adapters/secondary/*/Sql*.ts`
13. ✅ **SQL Integration tests**: Test SQL implementation against real database

### Phase 4: HTTP Layer & Wiring

14. ✅ **Controller**: `adapters/primary/[module].controller.ts`
15. ✅ **Controller integration tests**: Test full HTTP → UseCase → DB flow
16. ✅ **Module**: `adapters/primary/[module].module.ts` - Wire all dependencies with factory pattern
17. ✅ **Update AppModule**: Add new module to `app.module.ts` imports

**Key Principle**: Always write tests BEFORE implementation (TDD). Start with usecase unit tests, then SQL integration tests, then controller integration tests.

---

## 🛠️ Common Shared Services

Available for injection in NestJS modules:

| Service                                    | Import                                                           | Purpose                  | When to Use           |
| ------------------------------------------ | ---------------------------------------------------------------- | ------------------------ | --------------------- |
| **RandomUuidGenerator**                    | `@/shared-kernel/adapters/id-generator/RandomUuidGenerator`      | Generate random UUIDs    | Production (default)  |
| **DeterministicIdGenerator**               | `@/shared-kernel/adapters/id-generator/DeterministicIdGenerator` | Generate predictable IDs | Testing only          |
| **RealDateProvider**                       | `@/shared-kernel/adapters/date/RealDateProvider`                 | Get current date/time    | Production (default)  |
| **DeterministicDateProvider**              | `@/shared-kernel/adapters/date/DeterministicDateProvider`        | Fixed date/time          | Testing only          |
| **SQL_CONNECTION**                         | `@/shared-kernel/adapters/sql-knex/sqlConnection.module`         | Knex database connection | All repositories      |
| **DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN** | `@/shared-kernel/adapters/events/eventPublisher.module`          | Publish domain events    | Event-driven usecases |

---

## 🗄️ Database Table Types

All SQL table type definitions are centralized in:
**[tableTypes.d.ts](./src/shared-kernel/adapters/sql-knex/tableTypes.d.ts)** (`src/shared-kernel/adapters/sql-knex/tableTypes.d.ts`)

When creating a new table via migration, **always add the corresponding TypeScript type**:

```typescript
// Example: apps/api/src/shared-kernel/adapters/sql-knex/tableTypes.d.ts
export type SqlExample = {
  id: string;
  name: string;
  created_at: Date; // Knex deserializes timestamps to Date objects
  updated_at: Date | null;
  // Use snake_case for column names (DB convention)
};
```

**Important:**

- ✅ Use `snake_case` for column names (matches database convention)
- ✅ Use `Date` for timestamp/datetime columns - Knex automatically deserializes them from the database
- ✅ These types are used by SQL repositories for type-safe Knex queries
- ✅ Keep in sync with migrations - add type when you create migration
- ✅ Use exact database types (`string`, `number`, `Date`, `boolean`, etc.)
- ✅ Mark nullable columns with `| null`

**Knex Timestamp Handling**: When Knex queries the database, it automatically converts timestamp columns to JavaScript `Date` objects. In your TypeScript type definitions, always use `Date` for these columns, not `string`.

**Example usage in SQL Repository:**

```typescript
import type { SqlExample } from "@/shared-kernel/adapters/sql-knex/tableTypes";

async save(example: Example): Promise<void> {
  const row: SqlExample = {
    id: example.id,
    name: example.name,
    created_at: example.createdAt,
    updated_at: null,
  };
  await this.sqlConnection("examples").insert(row);
}
```

---

## 📦 Tech Stack Quick Ref

See [root CLAUDE.md](../../CLAUDE.md#-tech-stack-summary) for full monorepo tech stack.

**Backend-specific additions:**

- **Validation**: Zod + nestjs-zod (runtime validation)
- **Auth**: JWT + OpenID Connect
- **Events**: @nestjs/event-emitter (domain event publishing)
- **Testing**: Vitest + @testcontainers/postgresql (isolated DB testing)

---

## 🧪 Test Pattern

```typescript
describe("[UseCase/Class Name]", () => {
  let dependency: InMemoryDependency;
  let usecase: MyUseCase;

  beforeEach(() => {
    dependency = new InMemoryDependency();
    usecase = new MyUseCase(dependency);
  });

  it("should [expected behavior]", async () => {
    // Arrange
    dependency._setData([...]);

    // Act
    const result = await usecase.execute({ ... });

    // Assert
    expect(result.isSuccess()).toBe(true);
    expect(result.getData()).toEqual({ ... });
  });
});
```

---

## 📖 Type Patterns

```typescript
// Request/Response types (at top of usecase)
type Request = { siteId: string };
type Response = SiteViewModel;

// ViewModel (for API responses)
export type SiteViewModel = {
  id: string;
  name: string;
  // ... public API shape
};

// Domain type (internal)
export type Site = z.infer<typeof siteSchema>;

// Interface for behavior
export interface SitesRepository {
  save(site: Site): Promise<void>;
}
```

---

## 🤖 AI Assistant Workflow

**See also**:

- [root CLAUDE.md → For AI Assistants](../../CLAUDE.md#-for-ai-assistants) for high-level guidance on code generation across the monorepo
- [root CLAUDE.md → Testing Strategy](../../CLAUDE.md#-testing-strategy) for test organization and workflow after code generation

### After Code Generation - ALWAYS RUN:

Follow the **API Testing Workflow** in [root CLAUDE.md → Testing Strategy → API Testing Workflow](../../CLAUDE.md#api-testing-workflow-after-code-generation).

**Quick checklist**:

1. ✅ `pnpm --filter api typecheck` (must pass)
2. ✅ `pnpm --filter api lint` (must pass)
3. ✅ `pnpm --filter api test:unit` (must pass)
4. ✅ `pnpm --filter api test:integration` (run conditionally based on what changed)

**Never skip tests** or batch checks at the end - run after each logical change.

---

## 📎 APPENDIX: Advanced Topics

For monorepo-wide TypeScript and Node.js compatibility rules (enums, namespaces, class properties), see [root CLAUDE.md → Code Quality Standards → Node.js Compatibility](../../CLAUDE.md#nodejs-compatibility).

---

**END OF GUIDE** - Use this as primary reference when generating code for this project.
