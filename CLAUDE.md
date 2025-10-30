# Benefriches - Monorepo Guide

> **Purpose**: Context for AI assistants and developers working in this pnpm monorepo. For app-specific patterns, see individual CLAUDE.md files in each app.

---

## 📁 Monorepo Structure

```
benefriches/
├── apps/
│   ├── api/         # NestJS REST API (PostgreSQL + Clean Architecture)
│   └── web/         # React SPA (Vite + Redux + Clean Architecture)
├── packages/
│   └── shared/      # Shared TypeScript types and utilities
├── .github/
│   └── workflows/   # CI/CD pipelines (linting, testing, auto-deploy)
├── docker-compose.db.yml  # PostgreSQL container for local development
└── README.md        # French: Installation, setup, build instructions
```

### App Purposes:

- **api** (`apps/api/`): NestJS REST API serving the web app
  - Uses Clean/Hexagonal Architecture + CQS (Command-Query Separation)
  - PostgreSQL database with Knex migrations
  - Detailed patterns in [apps/api/CLAUDE.md](apps/api/CLAUDE.md)

- **web** (`apps/web/`): React SPA for end users
  - Built with Vite + Redux + Clean Architecture
  - App-specific guide: **Not yet created** - See [apps/api/CLAUDE.md](apps/api/CLAUDE.md) as a template for structure when creating

- **shared** (`packages/shared/`): Monorepo-wide types and utilities
  - **Framework-agnostic**: Pure TypeScript only (no React, no NestJS)
  - Used by both `api` and `web`
  - Must be built before use by dependent apps

---

## 🚀 Getting Started (Developer Setup)

### 1. Prerequisites

```bash
# Verify you have the right versions
node --version  # Should be 24+
pnpm --version  # Should be 10.13.1+
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

**IMPORTANT**: This is a **pnpm monorepo**. Always use `pnpm` commands, never `npm`.

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

### When to Use Which Command

| Command | Use Case |
|---------|----------|
| `pnpm -r test` | Before committing, verify all tests pass |
| `pnpm --filter api test` | After modifying API code |
| `pnpm --filter web dev` | Active web development |
| `pnpm --filter api start:dev` | Active API development |
| `pnpm --filter shared build` | After modifying shared package |

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
pnpm --filter api typecheck && pnpm --filter api test
pnpm --filter web typecheck && pnpm --filter web test

# 5. Or verify everything at once
pnpm -r typecheck && pnpm -r test
```

**⚠️ CRITICAL**: Changes to `shared` types can break both `api` and `web`. Always verify both apps pass checks after modifying shared.

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
│   └── web/src/
│       └── [component]/[component].spec.tsx          # Component tests
└── packages/
    └── shared/src/
        └── [module]/[name].spec.ts                   # Utility tests
```

**Test Types:**
- **Unit tests** (`.spec.ts` in `core/`): Core logic with InMemory mocks — no database, no HTTP
- **Integration tests** (`.integration-spec.ts` in `adapters/`): Real database or HTTP calls
  - **SQL Integration**: Test repository/query against real database
  - **HTTP Integration**: Test full flow from HTTP request → UseCase → database

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
```

### When Tests Are Required

**Important**: Always test dependent apps when modifying shared code!

| Change | Required Tests |
|--------|---|
| **Modified `shared` package** | `pnpm --filter shared test` + `pnpm --filter api test` + `pnpm --filter web test` |
| **Modified `api` code** | `pnpm --filter api test` (unit + integration) |
| **Modified `web` code** | `pnpm --filter web test` |
| **Before committing any changes** | Pre-commit hooks enforce all tests pass |

### API Testing Workflow (After Code Generation)

When you finish writing or modifying API code, you MUST run these checks **in this order**:

1. **Typecheck**: `pnpm --filter api typecheck`
2. **Lint**: `pnpm --filter api lint`
3. **Unit Tests**: `pnpm --filter api test:unit path/to/file.spec.ts`
4. **Integration Tests**:
   - **SQL Repository tests**: `pnpm --filter api test:integration path/to/SqlRepository.integration-spec.ts` (when modifying SQL implementation)
   - **Controller tests**: `pnpm --filter api test:integration path/to/controller.integration-spec.ts` (when modifying core, controllers, or repos)

**DO NOT**: Skip tests or batch checks at the end. Run after each logical change.

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
  AGRICULTURAL = "AGRICULTURAL"
}

// ✅ RIGHT - Erasable
const SITE_NATURE = {
  FRICHE: "FRICHE",
  AGRICULTURAL: "AGRICULTURAL",
} as const;
export type SiteNature = typeof SITE_NATURE[keyof typeof SITE_NATURE];
```

```typescript
// ❌ AVOID - Class parameter properties (being removed)
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

| App | Guide | Purpose |
|-----|-------|---------|
| **API** | [apps/api/CLAUDE.md](apps/api/CLAUDE.md) | Clean Architecture, CQS, Result Pattern, NestJS, database patterns |
| **Web** | `apps/web/CLAUDE.md` | To be created (React, Redux, component patterns) |
| **Shared** | (none needed) | Keep pure TypeScript, no framework deps |

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

## 🛠️ Package Manager Details

- **Version**: pnpm 10.13.1 (locked in `packageManager` field)
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

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18+ | UI rendering |
| **Frontend State** | Redux | State management |
| **Frontend Build** | Vite | Fast dev server & production build |
| **Backend** | NestJS 11+ | REST API framework |
| **Backend Architecture** | Clean/Hexagonal + CQS | Maintainability & testability |
| **Database** | PostgreSQL | Persistent data storage |
| **Database Driver** | Knex.js | Query builder & migrations |
| **Language** | TypeScript (strict mode) | Type safety |
| **Testing** | Vitest | Fast unit & integration tests |
| **Linting** | oxlint | Fast, strict linting |
| **Formatting** | Prettier | Consistent code style |
| **CI/CD** | GitHub Actions | Automated testing & deployment |
| **Deployment** | Staging auto-deploy, prod manual | Continuous delivery to staging, manual to production |

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

## 📖 For AI Assistants

When generating code:

1. **Always follow patterns** from [apps/api/CLAUDE.md](apps/api/CLAUDE.md) for backend code
   - For detailed API testing workflow and checklist, see [API CLAUDE.md → AI Assistant Workflow](apps/api/CLAUDE.md#-ai-assistant-workflow)
2. **Reference real examples** in the codebase (use file links in your response)
3. **Run checks after coding**:
   - TypeScript: `pnpm --filter api typecheck`
   - Lint: `pnpm --filter api lint`
   - Tests: `pnpm --filter api test`
4. **For `shared` changes**: Verify both `api` and `web` still pass checks
5. **Use relative paths with markdown**: `[file.ts](apps/api/src/file.ts)` not just `file.ts`

---

**END OF MONOREPO GUIDE** - For implementation details, refer to app-specific CLAUDE.md files.
