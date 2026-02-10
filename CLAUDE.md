# Benefriches - Monorepo Guide

> **Purpose**: Context for AI assistants and developers. For app-specific patterns, see individual CLAUDE.md files.

---

## Quick Lookup

| I need to...                 | Go to...                                               |
| ---------------------------- | ------------------------------------------------------ |
| Add API feature              | [apps/api/CLAUDE.md](apps/api/CLAUDE.md)               |
| Add Web feature              | [apps/web/CLAUDE.md](apps/web/CLAUDE.md)               |
| Add E2E test                 | [apps/e2e-tests/CLAUDE.md](apps/e2e-tests/CLAUDE.md)   |
| Add shared type/DTO          | [packages/shared/CLAUDE.md](packages/shared/CLAUDE.md) |
| See complete feature example | [docs/feature-example.md](docs/feature-example.md)     |
| Run quality checks           | [Standard Commands](#standard-commands)                |
| Decide where code goes       | [Decision Trees](#decision-trees)                      |

---

## Critical DON'Ts

1. **Don't use `npm`** - Always use `pnpm`
2. **Don't skip reinstalling `shared`** - Always reinstall in dependent apps after changes (see [Shared Package Workflow](#shared-package-workflow))
3. **Don't add framework deps to `shared`** - Keep it pure TypeScript only
4. **Don't skip cross-app testing** - Changes to `shared` can break both `api` and `web`
5. **Don't commit without quality checks** - Husky pre-commit hooks enforce these
6. **Don't use relative imports across apps** - Use workspace protocol: `import from "shared"`
7. **Don't modify database without migration** - Create a Knex migration for all schema changes
8. **Don't skip tests** - Tests are required before commit and merge

---

## Monorepo Structure

```
benefriches/
├── apps/api/         # NestJS REST API (PostgreSQL + Clean Architecture)
├── apps/web/         # React SPA (Vite + Redux + Clean Architecture)
├── apps/e2e-tests/   # Playwright end-to-end tests
├── packages/shared/  # Shared TypeScript types and utilities (framework-agnostic)
└── README.md         # Full setup instructions (French)
```

**Getting Started**: See [README.md](README.md) for installation and setup.

---

## Essential pnpm Commands

```bash
# Run in ALL workspaces
pnpm -r build && pnpm -r typecheck && pnpm -r test

# Run in specific app
pnpm --filter api <command>
pnpm --filter web <command>
pnpm --filter shared <command>

# Common commands
pnpm --filter api start:dev     # Start API dev server
pnpm --filter web dev           # Start web dev server
pnpm --filter shared build      # Build shared package (required after changes!)
```

---

## Shared Package Workflow

**CRITICAL**: Changes to `shared` types can break both `api` and `web`. Always reinstall and verify both apps after modifying shared.

```bash
# After modifying shared:
pnpm --filter shared build                              # Rebuild shared package
pnpm --filter api install && pnpm --filter web install  # Reinstall in dependent apps
pnpm -r typecheck && pnpm -r test

# When actively developing shared (rebuilds on every change):
pnpm --filter shared dev
```

Note: We don't use monorepo dependency solutions (nx, turborepo). You must manually run `pnpm --filter shared build` after modifying the shared package, or use `pnpm --filter shared dev` for watch mode.

---

## Database Migrations

- Always use the `/create-database-migration` skill when creating database migrations. Never create migration files manually.
- Use the project's `pnpm` commands for migration generation, not raw SQL files.

---

## Testing Strategy

### Test Types

- **Unit tests** (`.spec.ts` in `core/`): Core logic with InMemory mocks - no database, no HTTP
- **Integration tests** (`.integration-spec.ts` in `adapters/`): Real database or HTTP calls
- **E2E tests** (`.spec.ts` in `e2e-tests/tests/`): Full user flows with Playwright against running stack

### Testing Principles

Each test should verify a **distinct behavior** not covered by other tests:
- Ask: "If test A passes, would test B always pass?" - If yes, test B is redundant
- Ask: "What unique failure mode does this test catch?"
- Avoid redundant tests (e.g., "response validation" covered by happy path)

### Required Tests by Change Type

| Change                        | Required Tests                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------- |
| **Modified `shared` package** | `pnpm --filter shared test` + `pnpm --filter api test` + `pnpm --filter web test` |
| **Modified `api` code**       | `pnpm --filter api test` (unit + integration)                                     |
| **Modified `web` code**       | `pnpm --filter web test`                                                          |

### Running Tests

```bash
# Test specific file
pnpm --filter api test:unit path/to/file.spec.ts # for unit tests
pnpm --filter api test:integration path/to/file.integration-spec.ts # for integration tests
pnpm --filter web test path/to/file.spec.ts

# E2E tests (requires docker-compose.e2e.yml running)
docker compose --env-file .env.e2e -f docker-compose.e2e.yml up # Start full stack on port 3001
pnpm --filter e2e-tests test:e2e                 # Run all E2E tests in headless mode
pnpm --filter e2e-tests test:headed              # Run with browser visible
```

---

## Code Quality Standards

### TypeScript Rules

- **Strict mode**: `strict: true` in all tsconfig files
- **No `any` types**: Use `unknown` when type is truly unknown
- **Explicit return types**: Required for public functions/methods
- **Type imports**: Use `import type { }` for type-only imports
- **Use type alias**: Prefer `type` over `interface` unless extending
- **Use Zod for enums**

### Library Preferences

- **Date manipulation**: Always use `date-fns` for date operations
- **Validation/parsing**: Use `zod` for schema validation and parsing

### Node.js Compatibility (CRITICAL)

All code must be erasable (valid when type annotations are stripped with `--strip-types`).

**Forbidden patterns**:
- TypeScript enums: `enum Color { Red = "red" }`
- Namespaces: `namespace User { }`
- Class parameter properties in new code

**Use instead**:

```typescript
// WRONG - Not erasable
enum SiteNature {
  FRICHE = "FRICHE",
  AGRICULTURAL = "AGRICULTURAL",
}

// RIGHT - Erasable
const siteNatureSchema = z.enum(["FRICHE", "AGRICULTURAL"]);
export type SiteNature = z.infer<typeof siteNatureSchema>;
// for values: use siteNatureSchema.options
```

```typescript
// AVOID - Class parameter properties
export class User {
  constructor(readonly id: string, readonly name: string) {}
}

// PREFER - Explicit properties
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
pnpm test          # Run all tests (required before commit)
pnpm build         # Build for production
```

---

## Git Workflow

### Branch Naming

```bash
git checkout -b feat/add-new-feature     # New feature
git checkout -b fix/resolve-bug          # Bug fix
git checkout -b refactor/improve-code    # Code refactoring
git checkout -b chore/update-deps        # Chores, config updates
```

### CI/CD

Trunk-based development: every push to `main` triggers CI checks and auto-deploys to staging. Production deploy is manual.

---

## Decision Trees

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

## For AI Assistants

1. **Follow patterns** from app-specific CLAUDE.md files:
   - Backend: @apps/api/CLAUDE.md
   - Frontend: @apps/web/CLAUDE.md
   - E2E Tests: @apps/e2e-tests/CLAUDE.md
   - Shared: @packages/shared/CLAUDE.md
2. **Reference real examples** in the codebase (use file links in responses)
3. **Run checks after coding**: `typecheck` -> `lint` -> `format` -> `test`
4. **For `shared` changes**: Reinstall in dependent apps, then verify both `api` and `web` pass checks

---

**END OF MONOREPO GUIDE** - For implementation details, refer to app-specific CLAUDE.md files.
