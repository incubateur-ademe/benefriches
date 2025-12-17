# Benefriches - Monorepo Guide

> **Purpose**: Context for AI assistants and developers working in this pnpm monorepo. For app-specific patterns, see individual CLAUDE.md files in each app.

---

## 🔍 Quick Lookup

| I need to...                 | Go to...                                               |
| ---------------------------- | ------------------------------------------------------ |
| Add API feature              | [apps/api/CLAUDE.md](apps/api/CLAUDE.md)               |
| Add Web feature              | [apps/web/CLAUDE.md](apps/web/CLAUDE.md)               |
| Add shared type/DTO          | [packages/shared/CLAUDE.md](packages/shared/CLAUDE.md) |
| Debug test failures          | [Troubleshooting](#-troubleshooting)                   |
| Run quality checks           | [Standard Commands](#standard-commands)                |
| Decide where code goes       | [Decision Trees](#-decision-trees)                     |
| See complete feature example | [E2E Feature Example](#-end-to-end-feature-example)    |

---

## ❌ Critical DON'Ts

1. ❌ **Don't use `npm`** → Always use `pnpm`
2. ❌ **Don't skip building `shared`** → Always run `pnpm build` after changes
3. ❌ **Don't add framework deps to `shared`** → Keep it pure TypeScript only
4. ❌ **Don't skip cross-app testing** → Changes to `shared` can break both `api` and `web`
5. ❌ **Don't commit without quality checks** → Husky pre-commit hooks enforce these for a reason
6. ❌ **Don't use relative imports across apps** → Use workspace protocol: `import from "shared"`
7. ❌ **Don't modify database without migration** → Create a Knex migration for all schema changes
8. ❌ **Don't skip tests** → Tests are required before commit and merge

---

## 📁 Monorepo Structure

```
benefriches/
├── apps/
│   ├── api/         # NestJS REST API (PostgreSQL + Clean Architecture)
│   ├── web/         # React SPA (Vite + Redux + Clean Architecture)
│   └── e2e-tests/   # Playwright end-to-end tests
├── packages/
│   └── shared/      # Shared TypeScript types and utilities
├── .github/
│   └── workflows/   # CI/CD pipelines (linting, testing, auto-deploy)
├── docker-compose.db.yml  # PostgreSQL container for local development
├── docker-compose.e2e.yml # Full stack for E2E testing (port 3001)
└── README.md        # French: Installation, setup, build instructions
```

### App Purposes:

- **api** (`apps/api/`): NestJS REST API serving the web app
  - Uses Clean/Hexagonal Architecture + CQS (Command-Query Separation)
  - PostgreSQL database with Knex migrations
  - Detailed patterns in [apps/api/CLAUDE.md](apps/api/CLAUDE.md)

- **web** (`apps/web/`): React SPA for end users
  - Built with Vite + Redux + Clean Architecture
  - Detailed patterns in [apps/web/CLAUDE.md](apps/web/CLAUDE.md)

- **shared** (`packages/shared/`): Monorepo-wide types and utilities
  - **Framework-agnostic**: Pure TypeScript only (no React, no NestJS)
  - Used by both `api` and `web`
  - Must be built before use by dependent apps
  - Detailed patterns in [packages/shared/CLAUDE.md](packages/shared/CLAUDE.md)

- **e2e-tests** (`apps/e2e-tests/`): End-to-end tests with Playwright
  - Tests full user flows against running app (API + Web)
  - Uses Page Object pattern (`pages/`)
  - Runs against `docker-compose.e2e.yml` stack on port 3001

---

## 🚀 Getting Started (Developer Setup)

### 1. Prerequisites

```bash
# Verify you have the right versions
node --version  # Should be 24+
pnpm --version  # Should be 10.24.0+
docker --version  # Optional (for containerized PostgreSQL)
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Environment Variables

Copy example files and customize:

```bash
cp apps/web/.env.example apps/web/.env
cp apps/api/.env.example apps/api/.env
```

**Database credentials**: For Docker setup, use:

- `DATABASE_USER=postgres`
- `DATABASE_PASSWORD=secret`

### 4. Start PostgreSQL

**Option A: Docker (Recommended)**

```bash
docker compose --env-file apps/api/.env -f docker-compose.db.yml up -d
```

**Option B: Local PostgreSQL**

```bash
postgres=# CREATE USER <USERNAME> WITH ENCRYPTED PASSWORD '<YOUR_PASSWORD>';
postgres=# CREATE DATABASE benefriches_db WITH OWNER <USERNAME>;
```

### 5. Initialize Database

```bash
pnpm --filter api knex:migrate-latest  # Run migrations
pnpm --filter api knex:seed-run        # Load seed data
```

### 6. Start Development Servers

Open **multiple terminal tabs** (one per app):

**Terminal 1 - API Server**:

```bash
pnpm --filter api start:dev
# Runs on http://localhost:3000 (default)
```

**Terminal 2 - Web App**:

```bash
pnpm --filter web setup-env-vars
pnpm --filter web dev
# Runs on http://localhost:5173 (Vite default)
```

---

## 🔧 Working with pnpm Workspace

### Workspace Commands

```bash
# Run command in ALL workspaces (root + all apps + shared)
pnpm -r <command>

# Examples:
pnpm -r build              # Build all
pnpm -r test               # Test all
pnpm -r typecheck          # Typecheck all
pnpm -r lint               # Lint all
pnpm -r format             # Format all

# Run in specific app/package only
pnpm --filter api <command>
pnpm --filter web <command>
pnpm --filter shared <command>

# Examples:
pnpm --filter api start:dev     # Start API dev server
pnpm --filter web dev           # Start web dev server
pnpm --filter shared build      # Build shared package
pnpm --filter api test          # Test API only
```

---

## 📦 Shared Package Workflow

The `packages/shared` package is critical because both `api` and `web` depend on it.

### Important Rules:

1. **Framework-agnostic**: No React, no NestJS - pure TypeScript only
2. **Build required**: Must run `pnpm build` after making changes
3. **Auto-rebuild**: `postinstall` hook rebuilds automatically on `pnpm install`

### When You Modify Shared:

```bash
# 1. Make your changes
cd packages/shared
# Edit files...

# 2. Build the package
pnpm build

# 3. Typecheck and test shared
pnpm typecheck
pnpm test

# 4. Verify dependent apps still work
pnpm --filter api install && pnpm --filter api typecheck && pnpm --filter api test
pnpm --filter web install && pnpm --filter web typecheck && pnpm --filter web test

# 5. Or verify everything at once
pnpm -r install && pnpm -r typecheck && pnpm -r test
```

**⚠️ CRITICAL**: Changes to `shared` types can break both `api` and `web`. Always install shared package and verify both apps pass checks after modifying shared.

---

## 🧪 Testing Strategy

### Test Organization

```
├── apps/
│   ├── api/src/
│   │   └── [module]/
│   │       ├── core/
│   │       │   └── usecases/[name].usecase.spec.ts                  # Unit tests
│   │       └── adapters/
│   │           ├── secondary/
│   │           │   ├── [name]-repository/
│   │           │   │   └── Sql[Name]Repository.integration-spec.ts   # SQL integration tests
│   │           │   └── [name]-query/
│   │           │       └── Sql[Name]Query.integration-spec.ts
│   │           └── primary/
│   │               └── [module].controller.integration-spec.ts       # HTTP integration tests
│   ├── web/src/
│   │   └── [component]/[component].spec.tsx          # Component tests
│   └── e2e-tests/
│       ├── tests/[feature].spec.ts                   # E2E test specs
│       └── pages/[PageName]Page.ts                   # Page Objects
└── packages/
    └── shared/src/
        └── [module]/[name].spec.ts                   # Utility tests
```

**Test Types:**

- **Unit tests** (`.spec.ts` in `core/`): Core logic with InMemory mocks — no database, no HTTP
- **Integration tests** (`.integration-spec.ts` in `adapters/`): Real database or HTTP calls
  - **SQL Integration**: Test repository/query against real database
  - **HTTP Integration**: Test full flow from HTTP request → UseCase → database
- **E2E tests** (`.spec.ts` in `e2e-tests/tests/`): Full user flows with Playwright against running stack

### Testing Principles

Each test should verify a **distinct behavior** not covered by other tests:
- Ask: "If test A passes, would test B always pass?" → If yes, test B is redundant
- Ask: "What unique failure mode does this test catch?"
- Avoid redundant tests (e.g., "response validation" covered by happy path)

### Running Tests

```bash
# Test all workspaces
pnpm -r test

# Test specific app
pnpm --filter api test
pnpm --filter web test

# Test specific file
pnpm --filter api test path/to/file.spec.ts

# Watch mode (for development)
pnpm --filter api test -- --watch
pnpm --filter web test -- --watch

# Test coverage
pnpm --filter api test -- --coverage
pnpm --filter web test -- --coverage

# E2E tests (requires docker-compose.e2e.yml running)
docker compose -f docker-compose.e2e.yml up -d  # Start full stack on port 3001
pnpm --filter e2e-tests test:e2e                # Run all E2E tests
pnpm --filter e2e-tests test:headed             # Run with browser visible
pnpm --filter e2e-tests test:ui                 # Playwright UI mode
```

### When Tests Are Required

**Important**: Always test dependent apps when modifying shared code!

| Change                            | Required Tests                                                                    |
| --------------------------------- | --------------------------------------------------------------------------------- |
| **Modified `shared` package**     | `pnpm --filter shared test` + `pnpm --filter api test` + `pnpm --filter web test` |
| **Modified `api` code**           | `pnpm --filter api test` (unit + integration)                                     |
| **Modified `web` code**           | `pnpm --filter web test`                                                          |
| **Before committing any changes** | Pre-commit hooks enforce all tests pass                                           |

**For detailed API testing workflow**, see [apps/api/CLAUDE.md → AI Assistant Workflow](apps/api/CLAUDE.md#-ai-assistant-workflow).

---

## ✅ Code Quality Standards

These standards apply across the entire monorepo.

### TypeScript Rules:

- **Strict mode**: `strict: true` in all tsconfig files
- **No `any` types**: Use `unknown` when type is truly unknown
- **Explicit return types**: Required for public functions/methods
- **Type imports**: Use `import type { }` for type-only imports

### Code Style:

- **Formatter**: Prettier (configured at root)
- **Linter**: oxlint with `--type-aware` flag
- **Import sorting**: `@trivago/prettier-plugin-sort-imports`

### Library Preferences:

- **Date manipulation**: Always use `date-fns` for date operations (formatting, parsing, arithmetic, comparisons). Avoid native `Date` methods for complex operations.

### Node.js Compatibility

**CRITICAL**: All code must be erasable (valid when type annotations are stripped with `--strip-types`).

**Forbidden patterns** (not compatible with `--strip-types`):

- ❌ TypeScript enums: `enum Color { Red = "red" }`
- ❌ Namespaces: `namespace User { }`
- ❌ Class parameter properties in new code (deprecated, being removed)

**Use instead**:

- ✅ `as const` discriminated unions for constants
- ✅ `const` objects instead of namespaces
- ✅ Explicit class properties with constructor parameters

```typescript
// ❌ WRONG - Not erasable
enum SiteNature {
  FRICHE = "FRICHE",
  AGRICULTURAL = "AGRICULTURAL",
}

// ✅ RIGHT - Erasable
const SITE_NATURE = {
  FRICHE: "FRICHE",
  AGRICULTURAL: "AGRICULTURAL",
} as const;
export type SiteNature = (typeof SITE_NATURE)[keyof typeof SITE_NATURE];
```

```typescript
// ❌ AVOID - Class parameter properties (being removed)
export class User {
  constructor(
    readonly id: string,
    readonly name: string,
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

### Standard Commands

```bash
pnpm typecheck     # TypeScript type checking (required before commit)
pnpm lint          # Linting with oxlint (required before commit)
pnpm format        # Auto-format code with Prettier
pnpm format:check  # Check formatting without writing
pnpm test          # Run all tests (required before commit)
pnpm build         # Build for production
```

### Pre-Commit Hook

Husky automatically runs quality checks before commit:

- `pnpm typecheck`
- `pnpm lint`
- `pnpm format` (auto-fixes formatting)

If pre-commit fails, fix the issues and commit again.

---

## 🔄 Git Workflow & Continuous Delivery

### Branch Naming Convention

Follow conventional prefixes:

```bash
git checkout -b feat/add-new-feature           # New feature
git checkout -b fix/resolve-bug                # Bug fix
git checkout -b refactor/improve-code          # Code refactoring
git checkout -b chore/update-dependencies      # Chores, config updates
```

### Deployment Pipeline

This project follows **trunk-based development**. Every push to `main` triggers:

1. **CI Checks** (`.github/workflows/integration-checks.yml`):
   - TypeScript typecheck
   - Linting
   - Unit tests
   - Integration tests

2. **Build Artifacts** (`.github/workflows/build-and-upload-*.yml`):
   - Build API
   - Build Web

3. **Auto-Deploy to Staging** (`.github/workflows/continuous-delivery.yml`):
   - Automatically deploys to staging after every successful push to `main`

4. **Production Deploy** (`.github/workflows/deploy-production.yml`):
   - Manual trigger (not automatic)
   - Promotes tested staging to production

**⚠️ Important**: All checks must pass before merge. The CI pipeline is strict about code quality.

---

## 🚀 Workflow for Cross-App Changes

### Example: Adding a Shared Type

When you need to modify code that affects multiple apps:

1. **Update `shared` package**:

   ```bash
   cd packages/shared
   # Edit src/index.ts or create new file
   pnpm typecheck && pnpm test
   pnpm build
   ```

2. **Update API if needed**:

   ```bash
   pnpm --filter api typecheck
   pnpm --filter api test
   ```

3. **Update Web if needed**:

   ```bash
   pnpm --filter web typecheck
   pnpm --filter web test
   ```

4. **Verify everything passes**:
   ```bash
   pnpm -r typecheck && pnpm -r lint && pnpm -r test
   ```

---

## 📋 App-Specific Guides

For detailed coding patterns and architecture, see:

| App           | Guide                                                  | Purpose                                                            |
| ------------- | ------------------------------------------------------ | ------------------------------------------------------------------ |
| **API**       | [apps/api/CLAUDE.md](apps/api/CLAUDE.md)               | Clean Architecture, CQS, Result Pattern, NestJS, database patterns |
| **Web**       | [apps/web/CLAUDE.md](apps/web/CLAUDE.md)               | React, Redux, Clean Architecture, component patterns               |
| **Shared**    | [packages/shared/CLAUDE.md](packages/shared/CLAUDE.md) | DTOs, domain types, shared utilities                               |
| **E2E Tests** | `apps/e2e-tests/`                                      | Playwright tests, Page Objects, user flow testing                  |

---

## 🛠️ Package Manager Details

- **Version**: pnpm 10.24.0 (locked in `packageManager` field)
- **Node version**: 24.x (locked in `engines` field)
- **Workspace protocol**: `workspace:*` for internal dependencies
- **Lock file**: `pnpm-lock.yaml` (commit this!)

### Adding Dependencies

```bash
# Add to current workspace
pnpm add <package-name>

# Add to root workspace (devDependencies)
pnpm -w add -D <package-name>

# Add to specific app
pnpm --filter api add <package-name>
pnpm --filter web add <package-name>
pnpm --filter shared add <package-name>

# Remove a dependency
pnpm remove <package-name>
```

---

## 📚 Tech Stack Summary

| Layer                        | Technology                       | Purpose                                              |
| ---------------------------- | -------------------------------- | ---------------------------------------------------- |
| **Frontend**                 | React 19+                        | UI rendering                                         |
| **Frontend State**           | Redux Toolkit 2+                 | State management                                     |
| **Frontend Build**           | Vite 7+                          | Fast dev server & production build                   |
| **Backend**                  | NestJS 11+                       | REST API framework                                   |
| **Backend Architecture**     | Clean/Hexagonal + CQS            | Maintainability & testability                        |
| **Database**                 | PostgreSQL                       | Persistent data storage                              |
| **Database Driver**          | Knex.js                          | Query builder & migrations                           |
| **Language**                 | TypeScript 5+ (strict mode)      | Type safety                                          |
| **Unit/Integration Testing** | Vitest                           | Fast unit & integration tests                        |
| **E2E Testing**              | Playwright                       | Browser-based end-to-end tests                       |
| **Linting**                  | oxlint                           | Fast, strict linting                                 |
| **Formatting**               | Prettier                         | Consistent code style                                |
| **CI/CD**                    | GitHub Actions                   | Automated testing & deployment                       |
| **Deployment**               | Staging auto-deploy, prod manual | Continuous delivery to staging, manual to production |

_Note: Check `package.json` files for exact versions._

---

## 🔄 Maintaining This Guide

This CLAUDE.md evolves with your project. Review and update in these scenarios:

- **Architecture changes**: New patterns, significant refactoring
- **Dependency updates**: Major version bumps (NestJS, React, TypeScript)
- **New tooling**: Added linters, formatters, or CI/CD workflows
- **Workflow improvements**: Discovered better practices, simplified processes
- **Feature checklists**: Add learnings from completed features

**Frequency**: Review quarterly or after major milestones. Keep tech stack section current with locked versions.

---

## 🌳 Decision Trees

### Where Should This Code Go?

```
Is it used by both API and Web?
├── YES → Is it a DTO for an API endpoint?
│         ├── YES → packages/shared/src/api-dtos/
│         └── NO → Is it a domain value object (SoilType, SiteNature)?
│                  ├── YES → packages/shared/src/[domain]/
│                  └── NO → Is it a pure utility function?
│                           ├── YES → packages/shared/src/
│                           └── NO → Keep in respective app
└── NO → Which app uses it?
         ├── API → apps/api/src/
         └── Web → apps/web/src/
```

### New Module vs. Existing Module?

```
Is this a new domain concept?
├── YES → Create new module: apps/api/src/[new-module]/
└── NO → Does an existing module own this concept?
         ├── YES → Add to existing module
         └── UNCLEAR → Ask: "Which module should own [feature]?"
```

---

## 📘 End-to-End Feature Example

This example shows a complete "Get Site by ID" feature across all layers.

### 1. Shared Package: DTO

```typescript
// packages/shared/src/api-dtos/sites/getSite.dto.ts
import z from "zod";

export const getSiteResponseDtoSchema = z.object({
  id: z.string(),
  name: z.string(),
  nature: z.enum(["FRICHE", "AGRICULTURAL", "NATURAL"]),
  surfaceArea: z.number(),
});

export type GetSiteResponseDto = z.infer<typeof getSiteResponseDtoSchema>;
```

### 2. API Core: Gateway Interface

```typescript
// apps/api/src/sites/core/gateways/SitesQuery.ts
import type { GetSiteResponseDto } from "shared";

export interface SitesQuery {
  getById(id: string): Promise<GetSiteResponseDto | undefined>;
}
```

### 3. API Core: UseCase

```typescript
// apps/api/src/sites/core/usecases/getSite.usecase.ts
import { fail, success, type TResult } from "@/shared-kernel/result";
import type { UseCase } from "@/shared-kernel/usecase";
import type { GetSiteResponseDto } from "shared";
import type { SitesQuery } from "../gateways/SitesQuery";

type Request = { id: string };
type Response = TResult<GetSiteResponseDto, "SiteNotFound">;

export class GetSiteUseCase implements UseCase<Request, Response> {
  constructor(private readonly sitesQuery: SitesQuery) {}

  async execute({ id }: Request): Promise<Response> {
    const site = await this.sitesQuery.getById(id);
    if (!site) return fail("SiteNotFound");
    return success(site);
  }
}
```

### 4. API Core: Unit Test

```typescript
// apps/api/src/sites/core/usecases/getSite.usecase.spec.ts
import { GetSiteUseCase } from "./getSite.usecase";
import { InMemorySitesQuery } from "../../adapters/secondary/sites-query/InMemorySitesQuery";

describe("GetSiteUseCase", () => {
  it("should return site when found", async () => {
    const sitesQuery = new InMemorySitesQuery();
    sitesQuery._setSites([
      { id: "site-1", name: "My Site", nature: "FRICHE", surfaceArea: 1000 },
    ]);

    const useCase = new GetSiteUseCase(sitesQuery);
    const result = await useCase.execute({ id: "site-1" });

    expect(result.isSuccess).toBe(true);
    expect(result.value).toEqual({
      id: "site-1",
      name: "My Site",
      nature: "FRICHE",
      surfaceArea: 1000,
    });
  });

  it("should return SiteNotFound when site does not exist", async () => {
    const sitesQuery = new InMemorySitesQuery();
    const useCase = new GetSiteUseCase(sitesQuery);

    const result = await useCase.execute({ id: "nonexistent" });

    expect(result.isSuccess).toBe(false);
    expect(result.error).toBe("SiteNotFound");
  });
});
```

### 5. API Adapter: InMemory Implementation

```typescript
// apps/api/src/sites/adapters/secondary/sites-query/InMemorySitesQuery.ts
import type { GetSiteResponseDto } from "shared";
import type { SitesQuery } from "../../../core/gateways/SitesQuery";

export class InMemorySitesQuery implements SitesQuery {
  private sites: GetSiteResponseDto[] = [];

  async getById(id: string): Promise<GetSiteResponseDto | undefined> {
    return this.sites.find((s) => s.id === id);
  }

  // Test helper
  _setSites(sites: GetSiteResponseDto[]): void {
    this.sites = sites;
  }
}
```

### 6. API Adapter: SQL Implementation

```typescript
// apps/api/src/sites/adapters/secondary/sites-query/SqlSitesQuery.ts
import type { Knex } from "knex";
import type { GetSiteResponseDto } from "shared";
import type { SitesQuery } from "../../../core/gateways/SitesQuery";

export class SqlSitesQuery implements SitesQuery {
  constructor(private readonly sqlConnection: Knex) {}

  async getById(id: string): Promise<GetSiteResponseDto | undefined> {
    const row = await this.sqlConnection("sites").where({ id }).first();
    if (!row) return undefined;
    return {
      id: row.id,
      name: row.name,
      nature: row.nature,
      surfaceArea: row.surface_area, // snake_case → camelCase
    };
  }
}
```

### 7. API Controller

```typescript
// apps/api/src/sites/adapters/primary/sites.controller.ts
import { Controller, Get, Param, NotFoundException } from "@nestjs/common";
import { GetSiteUseCase } from "../../core/usecases/getSite.usecase";

@Controller("sites")
export class SitesController {
  constructor(private readonly getSiteUseCase: GetSiteUseCase) {}

  @Get(":id")
  async getSite(@Param("id") id: string) {
    const result = await this.getSiteUseCase.execute({ id });
    if (!result.isSuccess) {
      throw new NotFoundException("Site not found");
    }
    return result.value;
  }
}
```

### Success Criteria

After implementing a feature like this:

- [ ] `pnpm --filter shared build` - Shared package builds
- [ ] `pnpm --filter api typecheck` - No type errors
- [ ] `pnpm --filter api lint` - No lint errors
- [ ] `pnpm --filter api test:unit` - Unit tests pass
- [ ] `pnpm --filter api test:integration` - Integration tests pass

---

## 📖 For AI Assistants

When generating code:

1. **Always follow patterns** from app-specific CLAUDE.md files:
   - Backend code: [apps/api/CLAUDE.md](apps/api/CLAUDE.md)
   - Frontend code: [apps/web/CLAUDE.md](apps/web/CLAUDE.md)
   - Shared types/DTOs: [packages/shared/CLAUDE.md](packages/shared/CLAUDE.md)
   - For detailed API testing workflow, see [API CLAUDE.md → AI Assistant Workflow](apps/api/CLAUDE.md#-ai-assistant-workflow)
2. **Reference real examples** in the codebase (use file links in your response)
3. **Run checks after coding**:
   - TypeScript: `pnpm --filter <app> typecheck`
   - Lint: `pnpm --filter <app> lint`
   - Tests: `pnpm --filter <app> test`
4. **For `shared` changes**: Verify both `api` and `web` still pass checks
5. **Use relative paths with markdown**: `[file.ts](apps/api/src/file.ts)` not just `file.ts`

---

**END OF MONOREPO GUIDE** - For implementation details, refer to app-specific CLAUDE.md files.
