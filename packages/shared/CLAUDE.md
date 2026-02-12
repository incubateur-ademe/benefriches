# Shared Package Guide

> **Purpose**: Framework-agnostic TypeScript types and utilities shared between `api` and `web` apps.

---

## What Goes Here

| Category                   | Examples                                        | Notes                                      |
| -------------------------- | ----------------------------------------------- | ------------------------------------------ |
| **API DTOs**               | `CreateSiteDto`, `GetSiteViewResponseDto`       | Request/response schemas for API endpoints |
| **Domain Value Objects**   | `SoilType`, `SiteNature`, `DevelopmentPlanType` | Shared domain vocabulary                   |
| **Zod Schemas**            | `createSiteDtoSchema`, `soilTypeSchema`         | Runtime validation + TypeScript types      |
| **Utility Types**          | `ObjectEntries<T>`, typed `Object.keys()`       | Type-safe object utilities                 |
| **Adapter Interfaces**     | `IDateProvider`                                 | Port interfaces for dependency injection   |
| **Pure Utility Functions** | Date formatting, area calculations              | No side effects, no framework deps         |

---

## What Does NOT Go Here

| Category                    | Where It Goes  | Why                    |
| --------------------------- | -------------- | ---------------------- |
| React components            | `apps/web/`    | Framework-specific     |
| NestJS decorators/modules   | `apps/api/`    | Framework-specific     |
| Database entities           | `apps/api/`    | Infrastructure concern |
| App-specific business logic | Respective app | Not shared             |
| Environment config          | Respective app | App-specific           |

---

## DTO Patterns

### File Naming

```
src/api-dtos/
├── sites/
│   ├── index.ts                    # Re-exports all DTOs
│   ├── createCustomSite.dto.ts     # Request DTO
│   ├── getSiteView.dto.ts          # Response DTO
│   └── getSiteFeatures.dto.ts
└── index.ts                        # Re-exports all modules
```

**Convention**: `{operation}{Entity}.dto.ts` (e.g., `createSite.dto.ts`, `getSiteView.dto.ts`)

### DTO Structure

```typescript
// getSiteView.dto.ts
import z from "zod";

// 1. Define Zod schema (runtime validation)
export const getSiteViewResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  // ... fields
});

// 2. Infer TypeScript type from schema
export type GetSiteViewResponseDto = z.infer<typeof getSiteViewResponseDtoSchema>;
```

### Importing in Apps

```typescript
// In apps/api (controller)
import { getSiteViewResponseDtoSchema, type GetSiteViewResponseDto } from "shared";
// In apps/web (API client)
import type { GetSiteViewResponseDto } from "shared";
```

---

## Domain Value Objects

Use `as const` pattern (no TypeScript enums):

```typescript
// src/soils/soilType.ts
export const SOIL_TYPES = {
  BUILDINGS: "BUILDINGS",
  IMPERMEABLE_SOILS: "IMPERMEABLE_SOILS",
  MINERAL_SOIL: "MINERAL_SOIL",
  // ...
} as const;

export type SoilType = (typeof SOIL_TYPES)[keyof typeof SOIL_TYPES];

// Optional: Zod schema for validation
export const soilTypeSchema = z.enum([
  SOIL_TYPES.BUILDINGS,
  SOIL_TYPES.IMPERMEABLE_SOILS,
  // ...
]);
```

---

## Build Process

### When to Rebuild

Run `pnpm --filter shared build` after:

- Adding/modifying any file in `src/`
- Changing exports in `index.ts`

### No auto-rebuild

There is no lifecycle hook — you must run `pnpm --filter shared build` manually after modifying the shared package.

### Verify Build Worked

```bash
# Check dist/ was updated
ls -la packages/shared/dist/

# Verify types are exported
pnpm --filter api typecheck
pnpm --filter web typecheck
```

---

## Breaking Changes

When modifying shared types that both apps use:

1. **Make the change** in `shared`
2. **Build**: `pnpm --filter shared build`
3. **Check both apps**:
   ```bash
   pnpm --filter api typecheck
   pnpm --filter web typecheck
   ```
4. **Fix type errors** in both apps before committing

### Safe Changes

- Adding optional fields to DTOs
- Adding new exports
- Adding new Zod schema validations

### Breaking Changes (require app updates)

- Renaming fields
- Removing fields
- Changing field types
- Removing exports

---

## Directory Structure

```
packages/shared/
├── src/
│   ├── index.ts                      # Main exports
│   ├── api-dtos/                     # API request/response DTOs
│   │   ├── sites/
│   │   └── index.ts
│   ├── soils/                        # Soil type definitions
│   ├── site/                         # Site domain types
│   ├── reconversion-projects/        # Project domain types
│   ├── surface-area/                 # Area calculation utilities
│   ├── financial/                    # Financial calculation types
│   ├── adapters/                     # Port interfaces (IDateProvider)
│   └── [other-domains]/
├── dist/                             # Built output (gitignored)
├── package.json
└── tsconfig.json
```

---

## Commands

```bash
pnpm --filter shared build        # Build package (required after changes)
pnpm --filter shared typecheck    # Check types
pnpm --filter shared test         # Run tests
pnpm --filter shared lint         # Lint code
```

---

## Decision: Shared vs. App-Specific

**Add to `shared` when**:

- Type is used by both API and Web
- It's a DTO for an API endpoint
- It's a domain value object (SoilType, SiteNature)
- It's a pure utility function with no deps

**Keep app-specific when**:

- Only one app uses it
- It depends on framework features
- It's infrastructure (database, HTTP client)
- It contains business logic specific to one app
