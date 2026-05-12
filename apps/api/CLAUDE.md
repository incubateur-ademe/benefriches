# AI Coding Guide - Benefriches API

> **Quick reference** for AI code generation. Detailed patterns auto-load from `.claude/rules/api/` based on the files Claude touches (see [Rules Router](#-rules-router) below).

---

## 🏗️ Architecture (1-liner)

**Clean/Hexagonal Architecture + CQS** — business logic in `core/`, infrastructure in `adapters/`. **`core/` NEVER imports from `adapters/`.**

- **`core/`**: domain layer (models, gateway interfaces, usecases, events) — pure TypeScript
- **`adapters/primary/`**: inbound (controllers, NestJS modules) — drives the domain
- **`adapters/secondary/`**: outbound (SQL, InMemory, HTTP clients) — driven by the domain

**Run locally**: `pnpm --filter api dev` (NestJS watch mode, port 3000)

---

## ✅ ALWAYS / ❌ NEVER (Critical Rules)

### ALWAYS:

1. **Result Pattern** — UseCases return `TResult<Data, Error, Issues?>`; use `fail("ErrorType")` / `success(data)`
2. **CQS separation** — Repository for writes, Query for reads; never combine in one interface
3. **Implement `UseCase<Request, TResult<...>>`** interface
4. **Gateway interfaces** (not concrete classes) in UseCase constructor types
5. **InMemory implementations** for every gateway (required for unit tests)
6. **snake_case (DB) ↔ camelCase (app)** mapping in repositories/queries
7. **Factory pattern** in NestJS modules (`useFactory` + `inject`)
8. **Type imports** with `import type { }` for type-only imports
9. **Validate domain models** in UseCases; controllers only validate HTTP shape (Zod DTOs)
10. **Transactions** for multi-table writes (`sqlConnection.transaction(async (trx) => ...)`)

### NEVER:

1. ❌ Import `adapters/` code in `core/`
2. ❌ Use concrete classes in UseCase constructor types — use interfaces
3. ❌ Put business logic in controllers — controllers only map HTTP ↔ UseCase
4. ❌ Use `any` — use `unknown`
5. ❌ Combine reads + writes in same gateway interface
6. ❌ Skip unit tests for UseCases
7. ❌ Modify DB schema without a Knex migration (use `/create-database-migration` skill)
8. ❌ Return domain entities from controllers — return ViewModels
9. ❌ Use `console.*` for logging — use `AppLogger` in core, NestJS `Logger` in adapters (`no-console` lint rule enforced)

---

## 🎯 Naming & File Conventions (Quick Ref)

- **Classes**: `PascalCase` → `CreateSiteUseCase`, `SqlSiteRepository`
- **Variables/Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Error Types**: `PascalCase` noun-based (no verbs) → `"UserNotFound"`, `"ValidationFailed"`

| File Type  | Pattern                   | Example                 |
| ---------- | ------------------------- | ----------------------- |
| UseCase    | `[verb][Noun].usecase.ts` | `createSite.usecase.ts` |
| Repository | `Sql[Name]Repository.ts`  | `SqlSiteRepository.ts`  |
| Query      | `Sql[Name]Query.ts`       | `SqlSitesQuery.ts`      |
| Controller | `[module].controller.ts`  | `sites.controller.ts`   |
| Module     | `[module].module.ts`      | `sites.module.ts`       |

**DB**: snake_case columns (`site_id`, `created_at`) ↔ camelCase app properties (`siteId`, `createdAt`).

Full naming reference: [.claude/rules/api/api-naming.md](../../.claude/rules/api/api-naming.md) (auto-loads on any `apps/api/**/*.ts` edit).

---

## 🗺️ Path Aliases

- ✅ `src/` for cross-module imports within API (`import { ... } from "src/sites/core/..."`)
- ✅ `"shared"` for shared package imports (`import type { Site } from "shared"`)
- ✅ Relative `./` `../` **only** within same feature module
- ❌ Never `../../../` chains (use `src/`)
- ❌ Never `"src/shared"` (use `"shared"`)

---

## 🧪 Testing — Quality Guards

```bash
pnpm --filter api typecheck         # Required before commit
pnpm --filter api lint              # Required before commit (oxlint --type-aware)
pnpm --filter api format            # Auto-fixes Prettier formatting
pnpm --filter api test:unit         # After UseCase / core changes
pnpm --filter api test:integration  # After SQL / controller changes
```

Run after each logical change, not batched at the end.

**Object assertions**: Prefer a single `expect().toEqual({...})` validating the complete shape over multiple targeted assertions — forces thinking about full data shape, catches missing properties. Exceptions: partial validation, non-deterministic values (`expect.any(String)`).

**Test isolation**: Integration tests auto-clear all 21 SQL tables via a global hook in [`test/integration-tests-global-hooks.ts`](./test/integration-tests-global-hooks.ts). Don't add manual `afterEach()` cleanup.

---

## 📦 Tech Stack

- **Framework**: NestJS
- **Database**: PostgreSQL + Knex
- **Validation**: Zod + nestjs-zod (runtime validation)
- **Auth**: JWT + OpenID Connect
- **Events**: @nestjs/event-emitter
- **Testing**: Vitest + testcontainers (isolated PostgreSQL per test run)

Full monorepo tech stack: [root CLAUDE.md](../../CLAUDE.md).

---

## 🤖 Rules Router

Detailed patterns live in [`.claude/rules/api/`](../../.claude/rules/api/) as **path-scoped rules**. They **auto-load** when Claude reads, edits, or creates a file matching the rule's `paths:` front-matter (defined in each rule's YAML header). No manual lookup needed during edits.

| Task                                 | Auto-loaded rule                                                                                                            |
| ------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Any API file edit                    | [api-architecture.md](../../.claude/rules/api/api-architecture.md) + [api-naming.md](../../.claude/rules/api/api-naming.md) |
| Create / edit UseCase                | [api-usecase.md](../../.claude/rules/api/api-usecase.md)                                                                    |
| Create / edit Controller             | [api-controller.md](../../.claude/rules/api/api-controller.md)                                                              |
| Create / edit Repository             | [api-repository.md](../../.claude/rules/api/api-repository.md)                                                              |
| Create / edit Query                  | [api-query.md](../../.claude/rules/api/api-query.md)                                                                        |
| Write unit test                      | [api-unit-testing.md](../../.claude/rules/api/api-unit-testing.md)                                                          |
| Write integration test               | [api-integration-testing.md](../../.claude/rules/api/api-integration-testing.md)                                            |
| DB migration / table types           | [api-migrations.md](../../.claude/rules/api/api-migrations.md)                                                              |
| NestJS module / DI / shared services | [api-modules-and-di.md](../../.claude/rules/api/api-modules-and-di.md)                                                      |
| Domain event                         | [api-domain-events.md](../../.claude/rules/api/api-domain-events.md)                                                        |

### Cold-start: creating new files

For new files that don't exist yet, the trigger fires when Claude **reads an existing similar file** as a reference — which is the recommended first step anyway. Example: creating a new UseCase → read an existing `*.usecase.ts` first (loads `api-usecase.md`), then write the new one.

### DTO Best Practice

All controller route DTOs go in [`/packages/shared/src/api-dtos/`](../../packages/shared/src/api-dtos/). Create `[feature]/[operation].dto.ts` exporting both Zod schema + type, import in controller from `"shared"`, validate with `ZodValidationPipe`. See [packages/shared/CLAUDE.md](../../packages/shared/CLAUDE.md) and [api-controller.md → DTO Pattern](../../.claude/rules/api/api-controller.md#dto-pattern).

---

## 🚀 TDD Workflow (one-screen summary)

**Phase 1 — UseCase core** (Red-Green-Refactor per behavior):

1. Define gateway interfaces in `core/gateways/`
2. Skeleton UseCase + InMemory implementations
3. **Write ONE failing test** → make it pass with minimal code → refactor
4. Repeat for each behavior (happy path, failure paths, edge cases)

**Phase 2 — SQL layer** (Test-First): 5. Migration + table type in `tableTypes.d.ts` (use `/create-database-migration` skill) 6. Write SQL integration test (red) → implement SQL Repository/Query (green) → refactor

**Phase 3 — HTTP layer** (Test-First): 7. Write controller integration test (red) → implement controller (green) 8. Wire dependencies in NestJS module with factory pattern, register in `AppModule` 9. Run full suite:

```bash
pnpm --filter api typecheck
pnpm --filter api lint
pnpm --filter api test:unit
pnpm --filter api test:integration
```

**One test at a time** — never write multiple failing tests before making the first one pass. Applies to unit AND integration tests.

Full TDD detail (including event-publishing testing patterns): [api-unit-testing.md](../../.claude/rules/api/api-unit-testing.md), [api-integration-testing.md](../../.claude/rules/api/api-integration-testing.md).

---

## 📎 Cross-cutting references

- **TypeScript strict mode, no-`any`, erasable types** (no enums, no namespaces, no class parameter properties): [root CLAUDE.md → Code Quality Standards](../../CLAUDE.md#code-quality-standards)
- **pnpm commands across monorepo**: [root CLAUDE.md](../../CLAUDE.md)
- **After modifying `shared`**: rebuild + reinstall here or types won't update → `pnpm --filter shared build && pnpm --filter api install`
- **Web app patterns**: [apps/web/CLAUDE.md](../web/CLAUDE.md)
- **Shared package** (DTOs, types): [packages/shared/CLAUDE.md](../../packages/shared/CLAUDE.md)
