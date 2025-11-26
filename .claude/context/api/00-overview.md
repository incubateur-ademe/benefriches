# API Architecture Overview

> **Quick reference** for understanding the Benefriches API architecture.

## Architecture Pattern

**Clean/Hexagonal Architecture + CQS (Command-Query Separation)**

### Dependency Rule

**CRITICAL**: `core/` NEVER imports from `adapters/`

```
module/
├── core/                        # Domain layer (Pure TypeScript)
│   ├── models/                  # Domain entities, ViewModels
│   ├── gateways/                # Port interfaces (Repository, Query)
│   ├── usecases/                # Business logic
│   └── events/                  # Domain events
└── adapters/                    # Infrastructure layer
    ├── primary/                 # Inbound (Controllers, Modules)
    └── secondary/               # Outbound (SQL, InMemory implementations)
```

## Core Principles

1. **CQS Separation**:
   - Write operations → `Repository` interfaces
   - Read operations → `Query` interfaces
   - NEVER mix reads and writes in same interface

2. **Result Pattern**:
   - All UseCases return `TResult<Data, Error>`
   - Type-safe error handling at compile-time
   - See [01-usecase-pattern.md](01-usecase-pattern.md)

3. **Dependency Injection**:
   - Gateway interfaces defined in core
   - Concrete implementations in adapters
   - NestJS modules wire dependencies with factory pattern
   - See [08-dependency-injection.md](08-dependency-injection.md)

4. **Testing Strategy**:
   - Unit tests with InMemory implementations (no database)
   - Integration tests with real database (SQL repositories/queries)
   - Controller integration tests (full HTTP → UseCase → DB flow)

## Key Patterns

| Pattern | File Reference |
|---------|---------------|
| UseCase + Result Pattern | [01-usecase-pattern.md](01-usecase-pattern.md) |
| Controllers + DTOs | [02-controller-pattern.md](02-controller-pattern.md) |
| SQL Repositories (Write) | [03-repository-pattern.md](03-repository-pattern.md) |
| SQL Queries (Read) | [04-query-pattern.md](04-query-pattern.md) |
| Unit Testing | [05-unit-testing-pattern.md](05-unit-testing-pattern.md) |
| Integration Testing | [06-integration-testing-pattern.md](06-integration-testing-pattern.md) |
| Database (Migrations, Types) | [07-database-patterns.md](07-database-patterns.md) |
| NestJS Modules | [08-dependency-injection.md](08-dependency-injection.md) |
| Naming Conventions | [09-naming-conventions.md](09-naming-conventions.md) |

## Naming Conventions

**IMPORTANT**: These conventions apply to ALL API code.

### Code Elements

| Element | Convention | Examples |
|---------|------------|----------|
| **Classes** | `PascalCase` | `CreateSiteUseCase`, `SqlSiteRepository` |
| **Variables/Functions** | `camelCase` | `siteRepository`, `getUserSites` |
| **Constants** | `UPPER_SNAKE_CASE` | `SITE_CREATED`, `SQL_CONNECTION` |
| **Types/Interfaces** | `PascalCase` | `SitesRepository`, `SiteViewModel` |
| **Error Types** | `PascalCase` (noun-based) | `"UserNotFound"`, `"ValidationFailed"` |

### File Naming

| Type | Pattern | Example |
|------|---------|---------|
| **UseCase** | `[verb][Noun].usecase.ts` | `createSite.usecase.ts` |
| **Controller** | `[module].controller.ts` | `sites.controller.ts` |
| **SQL Repository** | `Sql[Name]Repository.ts` | `SqlSiteRepository.ts` |
| **SQL Query** | `Sql[Name]Query.ts` | `SqlSitesQuery.ts` |
| **InMemory** | `InMemory[Name]Repository.ts` | `InMemorySiteRepository.ts` |

**Full reference**: [09-naming-conventions.md](09-naming-conventions.md)

### Database Naming

**CRITICAL**: Database uses `snake_case`, application uses `camelCase`.

```typescript
// SQL (snake_case)
type SqlSite = {
  site_id: string;
  created_at: Date;
};

// App (camelCase)
type Site = {
  siteId: string;
  createdAt: Date;
};
```

## Import Aliases

- `src/` - Absolute imports within API (`apps/api/src/`)
- `"shared"` - Shared package (`packages/shared`)
- `./` or `../` - Relative (same feature module only)

**See**: [Root CLAUDE.md → Path Aliases](../../CLAUDE.md#-path-aliases)

## Quality Checks

Before committing:
1. `pnpm --filter api typecheck`
2. `pnpm --filter api lint`
3. `pnpm --filter api test`

## Related Documentation

- [Root CLAUDE.md](../../CLAUDE.md) - Monorepo setup, pnpm commands
- [Web CLAUDE.md](../web/00-overview.md) - Frontend patterns