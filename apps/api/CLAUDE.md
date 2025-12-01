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

The API uses **Clean/Hexagonal Architecture + Command-Query Separation (CQS)** to maintain strict separation between business logic (`core/`) and infrastructure (`adapters/`).

**CRITICAL**: `core/` NEVER imports from `adapters/`

**For detailed architecture guidance, examples, and implementation patterns**, see [Architecture Overview](../../.claude/context/api/00-overview.md).

---

## 🎯 Naming & File Conventions

Quick reference - **For complete naming guide with examples, see [09-naming-conventions.md](../../.claude/context/api/09-naming-conventions.md).**

### Code Element Naming

- **Classes**: `PascalCase` → `CreateSiteUseCase`, `SqlSiteRepository`
- **Variables/Functions**: `camelCase` → `siteRepository`, `getUserSites`
- **Constants**: `UPPER_SNAKE_CASE` → `SITE_CREATED`, `SQL_CONNECTION`
- **Error Types**: `PascalCase` (noun-based, no verbs) → `"UserNotFound"`, `"ValidationFailed"`

### File Naming (Quick Ref)

| Type       | Pattern                   | Example                 |
| ---------- | ------------------------- | ----------------------- |
| UseCase    | `[verb][Noun].usecase.ts` | `createSite.usecase.ts` |
| Repository | `Sql[Name]Repository.ts`  | `SqlSiteRepository.ts`  |
| Query      | `Sql[Name]Query.ts`       | `SqlSitesQuery.ts`      |
| Controller | `[module].controller.ts`  | `sites.controller.ts`   |
| Module     | `[module].module.ts`      | `sites.module.ts`       |

### Database Naming

**CRITICAL**: Snake_case (DB) ↔ camelCase (App)

- DB columns: `site_id`, `created_at`, `surface_area`
- App properties: `siteId`, `createdAt`, `surfaceArea`

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

**All usecases MUST implement `UseCase<Request, TResult<Data, Error>>`** - Type-safe error handling.

Every usecase returns `TResult<Data, Error>` (success or failure). Use `fail("ErrorType")` for domain errors, `success(data)` for success:

```typescript
import { fail, success, type TResult } from "@/shared-kernel/result";

export class MyUseCase implements UseCase<Request, TResult<Response, Error>> {
  async execute(request: Request): Promise<TResult<Response, Error>> {
    if (errorCondition) return fail("ValidationFailed");
    return success({ id: "123", name: "Example" });
  }
}
```

**For detailed patterns, advanced usage, and test examples, see [01-usecase-pattern.md](../../.claude/context/api/01-usecase-pattern.md).**

---

## ✅ Critical Rules

### ALWAYS:

1. **Use Result Pattern** - See [01-usecase-pattern.md](../../.claude/context/api/01-usecase-pattern.md)
2. **Separate CQS** - See [03-repository-pattern.md](../../.claude/context/api/03-repository-pattern.md) & [04-query-pattern.md](../../.claude/context/api/04-query-pattern.md)
3. **Implement UseCase interface** - See [01-usecase-pattern.md](../../.claude/context/api/01-usecase-pattern.md)
4. **Gateway interfaces** (not concrete classes) - See [08-dependency-injection.md](../../.claude/context/api/08-dependency-injection.md)
5. **InMemory implementations** for all gateways - See [05-unit-testing-pattern.md](../../.claude/context/api/05-unit-testing-pattern.md)
6. **Map naming**: snake_case (DB) ↔ camelCase (app) - See [09-naming-conventions.md](../../.claude/context/api/09-naming-conventions.md)
7. **Factory pattern** in NestJS modules - See [08-dependency-injection.md](../../.claude/context/api/08-dependency-injection.md)
8. **Type imports** with `import type { }` - See [00-overview.md](../../.claude/context/api/00-overview.md#code-quality-standards)
9. **Validate domain models** - See [02-controller-pattern.md](../../.claude/context/api/02-controller-pattern.md) for controller validation
10. **Transactions** for multi-table operations - See [03-repository-pattern.md](../../.claude/context/api/03-repository-pattern.md)

### NEVER:

1. ❌ Import `adapters/` code in `core/` - See [00-overview.md](../../.claude/context/api/00-overview.md)
2. ❌ Use concrete classes in UseCase constructor types - Use interfaces instead
3. ❌ Mix business logic in controllers - Controllers only map HTTP ↔ UseCase, see [02-controller-pattern.md](../../.claude/context/api/02-controller-pattern.md)
4. ❌ Use `any` type - Use `unknown` instead
5. ❌ Combine reads + writes in same interface - Separate Repository ≠ Query
6. ❌ Skip unit tests - See [05-unit-testing-pattern.md](../../.claude/context/api/05-unit-testing-pattern.md)
7. ❌ Modify DB without migration - See [07-database-patterns.md](../../.claude/context/api/07-database-patterns.md)
8. ❌ Return domain entities from controllers - Use ViewModels instead, see [02-controller-pattern.md](../../.claude/context/api/02-controller-pattern.md)

---

## 🚀 TDD Development Workflow

**CRITICAL**: Always follow Test-Driven Development (TDD) - write tests BEFORE implementation.

### Phase 1: UseCase Core (Red-Green-Refactor Cycle)

**Setup**:

1. ✅ **Gateway interfaces**: `core/gateways/[Name]Repository.ts` + `[Name]Query.ts` (minimal signatures)
2. ✅ **UseCase skeleton**: `core/usecases/[verb][Noun].usecase.ts` (empty `execute()` method)
3. ✅ **InMemory implementations**: `adapters/secondary/*/InMemory*.ts` (for testing)

**TDD Cycle** (repeat for each behavior):

```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR
```

4. ✅ **Write ONE failing unit test** → 🔴 **RED**
   - Start with happy path test
   - Test should fail (UseCase not implemented yet)
   - Example: `it("should create site and return id")`

5. ✅ **Make test pass with minimal code** → 🟢 **GREEN**
   - Implement just enough to make THIS test pass
   - Don't implement features not tested yet
   - Run: `pnpm --filter api test:unit path/to/usecase.spec.ts`

6. ✅ **Refactor if needed** → 🔵 **REFACTOR**
   - Clean up code while keeping test green
   - Extract helper functions, improve naming
   - Tests must still pass

7. ✅ **Repeat cycle for next behavior**
   - Write test for failure case (e.g., "site already exists")
   - Make it pass
   - Refactor
   - Continue until all business logic is covered

**Result**: Fully tested UseCase with InMemory implementations, no database yet.

### Phase 2: SQL Layer (Test-First)

8. ✅ **Migration FIRST**: `migrations/[timestamp]_*.ts`
   - Create database schema
   - Run: `pnpm --filter api knex:migrate-latest`

9. ✅ **Table types**: Update `shared-kernel/adapters/sql-knex/tableTypes.d.ts`

10. ✅ **Write SQL integration test** → 🔴 **RED**
    - Test SQL Repository/Query against real DB
    - Test should fail (SQL implementation doesn't exist)
    - Example: `SqlSiteRepository.integration-spec.ts`

11. ✅ **Implement SQL Repository/Query** → 🟢 **GREEN**
    - Make integration test pass
    - Run: `pnpm --filter api test:integration path/to/Sql*.integration-spec.ts`

12. ✅ **Refactor SQL implementation** → 🔵 **REFACTOR**

### Phase 3: HTTP Layer (Test-First)

13. ✅ **Write controller integration test** → 🔴 **RED**
    - Test full HTTP → Controller → UseCase → DB flow
    - Test authentication, validation, error cases
    - Example: `sites.controller.integration-spec.ts`

14. ✅ **Implement controller** → 🟢 **GREEN**
    - Handle Result → HTTP mapping
    - Add authentication guards
    - Make integration test pass

15. ✅ **Wire dependencies in NestJS module**
    - Create `[module].module.ts` with factory pattern
    - Register all providers (UseCases, Repositories, Queries)

16. ✅ **Update AppModule**: Add new module to `app.module.ts` imports

17. ✅ **Run full test suite**:
    - `pnpm --filter api typecheck`
    - `pnpm --filter api lint`
    - `pnpm --filter api test:unit`
    - `pnpm --filter api test:integration`

### TDD Principles

- **Write test BEFORE code**: Every piece of functionality starts with a failing test
- **Smallest step possible**: Make test pass with minimal implementation
- **One test at a time (ALL test types)**: Don't write multiple tests before making first one pass
  - Applies to **all** unit and integration tests: queries, usecases, repositories, controllers
  - Example: For a query with multiple scenarios, write test for "0 projects" → make pass → test "multiple projects" → make pass → test "not found"
  - Benefit: Ensures each scenario is properly tested before moving forward; prevents skipping untested cases
- **Refactor with confidence**: Tests ensure refactoring doesn't break behavior
- **Red-Green-Refactor rhythm**: Never skip a step in the cycle

**See also**: [05-unit-testing-pattern.md](../../.claude/context/api/05-unit-testing-pattern.md), [06-integration-testing-pattern.md](../../.claude/context/api/06-integration-testing-pattern.md)

---

## 🧪 Testing Infrastructure & Best Practices

### Automatic Database Cleanup

All SQL tables are automatically cleared after each integration test by a global hook configured in [`test/integration-tests-global-hooks.ts`](./test/integration-tests-global-hooks.ts). This ensures complete test isolation without manual cleanup in individual test files.

**Tables cleared**: The hook clears all 30 API tables including `sites`, `reconversion_projects`, `domain_events`, etc.

### Object Assertions: Prefer Single expect()

When asserting object shapes (DTOs, ViewModels, API responses, database results):

**PREFERRED**: Single `expect()` with complete object validation

- Forces thinking about the complete data shape upfront
- Catches missing properties that multi-assertion approaches can accidentally skip
- More readable intent: "function returns exactly this structure"
- Easier to review what's being validated at a glance

```typescript
// PREFERRED: Single expect for complete validation
expect(result).toEqual({
  id: siteId,
  features: {
    id: siteId,
    name: "Site Name",
    nature: "FRICHE",
    // ... all properties
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

**EXCEPTION**: Use targeted assertions when:

- You only care about specific properties (partial validation)
- Properties are non-deterministic (timestamps, UUIDs that vary)
- Object structure is very large (break into multiple assertions for readability)

```typescript
// EXCEPTION: Partial assertion when only specific properties matter
expect(result.id).toEqual(siteId);
expect(result.reconversionProjects).toHaveLength(2);

// EXCEPTION: When properties are non-deterministic
expect(result).toEqual({
  id: expect.any(String), // UUID varies
  createdAt: expect.any(Date), // Timestamp varies
  name: "Site Name", // But name must be exact
});
```

**CRITICAL**: Never skip validating the critical shape of response objects - always assert the essential structure.

---

## 🛠️ Shared Services & Dependency Injection

**For comprehensive reference on injectable services, factory pattern, and testing**, see [11-shared-services.md](../../.claude/context/api/11-shared-services.md).

**Quick summary**:

- **ID Generation**: `RandomUuidGenerator` (prod), `DeterministicIdGenerator` (tests)
- **Date/Time**: `RealDateProvider` (prod), `DeterministicDateProvider` (tests)
- **Database**: Inject `SQL_CONNECTION` into SQL repositories/queries
- **Events**: `DOMAIN_EVENT_PUBLISHER_INJECTION_TOKEN` for cross-module events

Use **factory pattern** in NestJS modules to wire dependencies (see [08-dependency-injection.md](../../.claude/context/api/08-dependency-injection.md)).

---

## 🗄️ Database Table Types

**For complete guidance on table types, migrations, and SQL patterns**, see [07-database-patterns.md](../../.claude/context/api/07-database-patterns.md#table-types).

**Critical rules**:

1. Define types in `src/shared-kernel/adapters/sql-knex/tableTypes.d.ts` (central registry)
2. Use `snake_case` for columns (matching database)
3. Use `Date` for timestamps (Knex auto-converts)
4. Mark nullable columns with `| null` (not optional `?:`)
5. Add type **immediately after creating migration**

**Example**:

```typescript
// Database migration
table.string("name").notNullable();
table.timestamp("created_at").notNullable();

// Type definition
export type SqlExample = {
  name: string;
  created_at: Date; // Knex converts timestamp → Date
};
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

## 🤖 AI Assistant Workflow

**See also**: [root CLAUDE.md → For AI Assistants](../../CLAUDE.md#-for-ai-assistants) for high-level guidance on code generation across the monorepo

### Context Discovery: Granular Pattern Files

**NEW**: Detailed patterns are now in [`.claude/context/api/`](../../.claude/context/api/) for granular, on-demand loading.

#### Always Load First

- **[00-overview.md](../../.claude/context/api/00-overview.md)** - Architecture overview + naming conventions (always applicable)

#### Load Task-Specific Patterns

| Task                   | Load These Patterns                                                                                                                                                              |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Create UseCase**     | [01-usecase-pattern.md](../../.claude/context/api/01-usecase-pattern.md), [05-unit-testing-pattern.md](../../.claude/context/api/05-unit-testing-pattern.md)                     |
| **Add Controller**     | [02-controller-pattern.md](../../.claude/context/api/02-controller-pattern.md), [06-integration-testing-pattern.md](../../.claude/context/api/06-integration-testing-pattern.md) |
| **Write Repository**   | [03-repository-pattern.md](../../.claude/context/api/03-repository-pattern.md), [05-unit-testing-pattern.md](../../.claude/context/api/05-unit-testing-pattern.md)               |
| **Write Query**        | [04-query-pattern.md](../../.claude/context/api/04-query-pattern.md), [06-integration-testing-pattern.md](../../.claude/context/api/06-integration-testing-pattern.md)           |
| **Database Migration** | [07-database-patterns.md](../../.claude/context/api/07-database-patterns.md)                                                                                                     |
| **Wire Dependencies**  | [08-dependency-injection.md](../../.claude/context/api/08-dependency-injection.md)                                                                                               |
| **Domain Events**      | [10-domain-events-pattern.md](../../.claude/context/api/10-domain-events-pattern.md)                                                                                             |
| **Complete Feature**   | Load `00-overview.md` + relevant patterns above                                                                                                                                  |

**Pattern files cross-reference each other** - follow links to related patterns when needed.

### DTO Best Practice: Shared Package Only

**CRITICAL**: All controller route DTOs go in `/packages/shared/src/api-dtos/`.

**Quick pattern**: Create `[feature]/[operation].dto.ts` with both schema and type, import in controller from `"shared"`, validate with `ZodValidationPipe`.

For complete organization structure, naming patterns, and detailed examples, see [02-controller-pattern.md → DTO Pattern](../../.claude/context/api/02-controller-pattern.md#dto-pattern).

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
