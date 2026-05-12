---
paths:
  - "apps/api/**/*.ts"
---

# Naming Conventions

> **Consistent naming patterns** across the API codebase.

## Code Elements

See [API CLAUDE.md → Naming & File Conventions](../../../apps/api/CLAUDE.md#-naming--file-conventions) for the quick reference table (Classes, Variables, Constants, Error Types).

### Error Naming Pattern

Error types describe the **error state**, not an action:

```typescript
// ✅ CORRECT - Describes the error state
"UserNotFound"
"ValidationFailed"
"AlreadyExists"
"Unauthorized"
"SiteNotAccessible"

// ❌ WRONG - Action-based or verb-based
"FindUserFailed"
"FailedValidation"
"CannotCreate"
```

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| **UseCase** | `[verb][Noun].usecase.ts` | `createSite.usecase.ts`, `getSiteById.usecase.ts` |
| **UseCase Test** | `[verb][Noun].usecase.spec.ts` | `createSite.usecase.spec.ts` |
| **SQL Repository** | `Sql[Name]Repository.ts` | `SqlSiteRepository.ts`, `SqlUserRepository.ts` |
| **SQL Repository Integration Test** | `Sql[Name]Repository.integration-spec.ts` | `SqlSiteRepository.integration-spec.ts` |
| **SQL Query** | `Sql[Name]Query.ts` | `SqlSitesQuery.ts`, `SqlProjectsQuery.ts` |
| **SQL Query Integration Test** | `Sql[Name]Query.integration-spec.ts` | `SqlSitesQuery.integration-spec.ts` |
| **InMemory Repository** | `InMemory[Name]Repository.ts` | `InMemorySiteRepository.ts` |
| **InMemory Query** | `InMemory[Name]Query.ts` | `InMemorySitesQuery.ts` |
| **Controller** | `[module].controller.ts` | `sites.controller.ts`, `auth.controller.ts` |
| **Controller Integration Test** | `[module].controller.integration-spec.ts` | `sites.controller.integration-spec.ts` |
| **Module** | `[module].module.ts` | `sites.module.ts`, `auth.module.ts` |
| **DTO** | `[module].dto.ts` | `sites.dto.ts` (future - currently in controller) |
| **Mock** | `[entity].mock.ts` | `site.mock.ts`, `user.mock.ts` |
| **Event** | `[eventName].event.ts` | `siteCreated.event.ts`, `userAccountCreated.event.ts` |
| **Domain Model** | `[entity].ts` | `site.ts`, `user.ts`, `carbonStorage.ts` |
| **ViewModel** | `[entity]ViewModel.ts` | `siteViewModel.ts`, `userViewModel.ts` |
| **Gateway Interface** | `[Name]Repository.ts` or `[Name]Query.ts` | `SitesRepository.ts`, `SitesQuery.ts` |

## Database Naming

### Tables and Columns

**CRITICAL**: Database uses `snake_case`, application uses `camelCase`.

| Level | Convention | Examples |
|-------|------------|----------|
| **Tables** | `snake_case` | `sites`, `reconversion_projects`, `user_accounts` |
| **Columns** | `snake_case` | `site_id`, `created_at`, `surface_area`, `full_time_jobs_involved` |
| **App Properties** | `camelCase` | `siteId`, `createdAt`, `surfaceArea`, `fullTimeJobsInvolved` |

### Mapping Example

```typescript
// SQL row type (database)
type SqlSite = {
  site_id: string;              // snake_case
  created_at: Date;
  surface_area: number;
  full_time_jobs_involved: number;
};

// Domain model (application)
type Site = {
  siteId: string;               // camelCase
  createdAt: Date;
  surfaceArea: number;
  fullTimeJobsInvolved: number;
};

// Repository mapping
const row: SqlSite = {
  site_id: site.siteId,
  created_at: site.createdAt,
  surface_area: site.surfaceArea,
  full_time_jobs_involved: site.fullTimeJobsInvolved,
};
```

## Import Aliases

See [API CLAUDE.md → Path Aliases](../../../apps/api/CLAUDE.md#-path-aliases) for complete rules and examples.

## Route Naming

**IMPORTANT**: Routes express **intent**, not strict REST.

```typescript
// ✅ GOOD - Intent-driven
@Post("start-evaluation")
@Post("complete-evaluation")
@Post("add-project-creation")

// ⚠️ LESS CLEAR - REST-based
@Post("evaluations")
@Patch("evaluations/:id")
@Put("evaluations/:id/projects")
```

**Real Example**: [reconversionCompatibility.controller.ts:51](../../../apps/api/src/reconversion-compatibility/adapters/primary/reconversionCompatibility.controller.ts#L51)

## Module Structure Example

```
sites/
├── core/
│   ├── models/
│   │   ├── site.ts                          # Domain model
│   │   ├── site.mock.ts                     # Mock factory
│   │   └── siteViewModel.ts                 # ViewModel
│   ├── gateways/
│   │   ├── SitesRepository.ts               # Write interface
│   │   └── SitesQuery.ts                    # Read interface
│   ├── usecases/
│   │   ├── createSite.usecase.ts            # UseCase
│   │   └── createSite.usecase.spec.ts       # Unit test
│   └── events/
│       └── siteCreated.event.ts             # Domain event
└── adapters/
    ├── primary/
    │   ├── sites.controller.ts              # HTTP controller
    │   ├── sites.controller.integration-spec.ts  # Integration test
    │   └── sites.module.ts                  # NestJS module
    └── secondary/
        ├── site-repository/
        │   ├── SqlSiteRepository.ts
        │   ├── SqlSiteRepository.integration-spec.ts
        │   └── InMemorySiteRepository.ts
        └── sites-query/
            ├── SqlSitesQuery.ts
            ├── SqlSitesQuery.integration-spec.ts
            └── InMemorySitesQuery.ts
```

## TypeScript Type Patterns

See [Root CLAUDE.md → Node.js Compatibility](../../../CLAUDE.md#nodejs-compatibility-critical) for erasable type rules (no enums, no namespaces, no class parameter properties).

## Summary

### Key Patterns

- **Classes**: `PascalCase`
- **Files**: Descriptive with type suffix (`.usecase.ts`, `.repository.ts`)
- **Database**: `snake_case` → map to `camelCase` in app
- **Imports**: See [API CLAUDE.md → Path Aliases](../../../apps/api/CLAUDE.md#-path-aliases)
- **Routes**: Intent-driven, not strictly REST
- **Errors**: Describe state, not action

### Related Documentation

- **Root CLAUDE.md**: [Monorepo patterns](../../../CLAUDE.md)
- **UseCase Pattern**: [api-usecase.md](api-usecase.md)
- **Controller Pattern**: [api-controller.md](api-controller.md)
- **Repository Pattern**: [api-repository.md](api-repository.md)
- **Database Patterns**: [api-migrations.md](api-migrations.md)
