# Naming Conventions

> **Consistent naming patterns** across the API codebase.

## Code Elements

| Element | Convention | Examples |
|---------|------------|----------|
| **Classes** | `PascalCase` | `CreateSiteUseCase`, `SqlSiteRepository`, `RandomUuidGenerator` |
| **Variables/Functions** | `camelCase` | `siteRepository`, `getUserSites`, `result` |
| **Constants** | `UPPER_SNAKE_CASE` | `SITE_CREATED`, `SQL_CONNECTION`, `EXAMPLE_CREATED` |
| **Types/Interfaces** | `PascalCase` | `SitesRepository`, `SiteViewModel`, `Example` |
| **Error Types** | `PascalCase` (noun-based) | `"UserNotFound"`, `"ValidationFailed"`, `"AlreadyExists"`, `"Unauthorized"` |

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

| Pattern | Resolves To | Usage |
|---------|-------------|-------|
| `@/` | `apps/api/src/` | Cross-module imports within API |
| `"shared"` | `packages/shared` | Shared package types/utilities |
| `./` or `../` | Relative | Same feature module only |

### Examples

```typescript
// ✅ CORRECT - Cross-module with @/
import { UseCase } from "@/shared-kernel/usecase";
import { CreateSiteUseCase } from "@/sites/core/usecases/createSite.usecase";

// ✅ CORRECT - Shared package
import type { Site } from "shared";
import { validateEmail } from "shared";

// ✅ CORRECT - Same module with relative
import type { SitesRepository } from "../gateways/SitesRepository";
import type { Site } from "../models/site";

// ❌ WRONG - Using @/ for shared package
import type { Site } from "@/shared";

// ❌ WRONG - Long relative paths for cross-module
import { CreateSiteUseCase } from "../../../../sites/core/usecases/createSite.usecase";
```

**Rules**:
- ✅ Use `@/` for any cross-module import within API
- ✅ Use `"shared"` for shared package imports
- ✅ Use relative `./` or `../` **only** within same feature module
- ❌ Never use `../../../` chains (use `@/` instead)

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

Avoid patterns not compatible with Node.js `--strip-types`:

```typescript
// ❌ AVOID - Enums (not erasable)
enum SiteNature {
  FRICHE = "FRICHE",
  AGRICULTURAL = "AGRICULTURAL"
}

// ✅ USE - const object with type
const SITE_NATURE = {
  FRICHE: "FRICHE",
  AGRICULTURAL: "AGRICULTURAL",
} as const;
export type SiteNature = typeof SITE_NATURE[keyof typeof SITE_NATURE];

// ❌ AVOID - Namespaces
namespace User { }

// ✅ USE - const objects
const User = { /* ... */ };

// ❌ AVOID (deprecated) - Class parameter properties in new code
export class User {
  constructor(
    readonly id: string,
    readonly name: string
  ) {}
}

// ✅ PREFER - Explicit properties
export class User {
  readonly id: string;
  readonly name: string;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
```

**See**: [Root CLAUDE.md → Node.js Compatibility](../../CLAUDE.md#nodejs-compatibility)

## Summary

### Key Patterns

- **Classes**: `PascalCase`
- **Files**: Descriptive with type suffix (`.usecase.ts`, `.repository.ts`)
- **Database**: `snake_case` → map to `camelCase` in app
- **Imports**: `@/` for cross-module, `"shared"` for shared package
- **Routes**: Intent-driven, not strictly REST
- **Errors**: Describe state, not action

### Related Documentation

- **Root CLAUDE.md**: [Monorepo patterns](../../CLAUDE.md)
- **UseCase Pattern**: [01-usecase-pattern.md](01-usecase-pattern.md)
- **Controller Pattern**: [02-controller-pattern.md](02-controller-pattern.md)
- **Repository Pattern**: [03-repository-pattern.md](03-repository-pattern.md)
- **Database Patterns**: [07-database-patterns.md](07-database-patterns.md)