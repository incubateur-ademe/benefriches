# Coding Conventions

**Analysis Date:** 2026-03-12

## Naming Patterns

**Files:**
- **UseCase classes**: `[Verb][Noun].usecase.ts` → `createSite.usecase.ts`, `computeReconversionProjectImpacts.usecase.ts`
- **Repository interfaces**: `[Name]Repository.ts` → `ReconversionProjectRepository.ts`
- **SQL Repository implementations**: `Sql[Name]Repository.ts` → `SqlReconversionProjectRepository.ts`
- **InMemory implementations**: `InMemory[Name]Repository.ts`, `InMemory[Name]Service.ts`
- **Query interfaces**: `[Name]Query.ts` → `SiteImpactsQuery.ts`
- **SQL Query implementations**: `Sql[Name]Query.ts` → `SqlReconversionProjectsListQuery.ts`
- **Controllers**: `[module].controller.ts` → `sites.controller.ts`, `reconversionProjects.controller.ts`
- **NestJS modules**: `[module].module.ts` → `sites.module.ts`
- **Reducers**: `[feature].reducer.ts` → `createSite.reducer.ts`, `siteView.reducer.ts`
- **Selectors**: `[feature].selectors.ts` → `createProject.selectors.ts`, `siteView.reducer.ts`
- **Actions**: `[actionName].action.ts` → `fetchSiteView.action.ts`, `reconversionProjectCreationInitiated.action.ts`
- **Test files**: `*.spec.ts` (unit tests), `*.integration-spec.ts` (integration tests)

**Functions:**
- `camelCase` for all functions and variables → `createMockSiteView()`, `siteRepository`
- Actions (Redux): Passive tense → `stepCompleted`, `dataFetched`, NOT `completeStep` or `fetchData`
- Selectors: `select{Feature}ViewData` → `selectProjectFeaturesViewData`, `selectSiteFeaturesViewData`
- Queries: `get{EntityName}ById()`, `getFeaturesById()`, `existsWithId()`

**Variables:**
- `camelCase` for all local variables and properties → `siteId`, `createdAt`, `ownerName`
- Database columns: `snake_case` → `site_id`, `created_at`, `owner_name` (see Database Naming below)
- Constants: `UPPER_SNAKE_CASE` → `ACCESS_TOKEN_COOKIE_KEY`, `SqlDevelopmentPlan`

**Types:**
- `PascalCase` for all types and interfaces → `SiteView`, `CreateCustomSiteDto`, `ReconversionProjectFeaturesView`
- Error discriminant values: `PascalCase` noun-based (no verbs) → `"ValidationError"`, `"SiteAlreadyExists"`, `"ReconversionProjectNotFound"`
- React components: `PascalCase` → `SitesController`, `CreateProjectPage`

## Database Naming Convention

**Critical**: Snake_case in database ↔ camelCase in application code

- DB columns: `site_id`, `created_at`, `surface_area`, `owner_name`
- App properties: `siteId`, `createdAt`, `surfaceArea`, `ownerName`
- DB tables: `sites`, `reconversion_projects`, `site_expenses`, `development_plans`
- Type names in code: PascalCase `SqlSite`, `SqlReconversionProject`
- Column type mapping in `src/shared-kernel/adapters/sql-knex/tableTypes.d.ts`: Define as `snake_case` (matching DB), Knex auto-converts `timestamp` to `Date`

## Code Style

**Formatting:**
- Tool: Prettier 3.8.1 (configured globally for monorepo)
- Format command: `pnpm format`
- Check command: `pnpm format:check`
- Applies to: `.ts`, `.tsx`, `.js`, `.jsx`, `.css`, `.md`, `.json`

**Linting:**
- Tool: oxlint 1.43.0 with type-aware checking
- Lint command: `oxlint --type-aware` (API: `pnpm lint`, Web: `pnpm lint`)
- Suppression: Use `/* oxlint-disable rule-name */` or `// oxlint-disable-next-line rule-name` when necessary (rarely)
- Example suppression in tests: `/* oxlint-disable typescript/no-non-null-assertion */` for `!` operator in test setup

**TypeScript Configuration:**
- **Strict mode**: Enabled globally (`strict: true` in `tsconfig.base.json`)
- **Type checking**: `noImplicitAny`, `strictNullChecks`, `noImplicitOverride` all enabled
- **No unused variables**: `noUnusedLocals: true`, `noUnusedParameters: true`
- **Indexed access safety**: `noUncheckedIndexedAccess: true`
- **Switch fallthrough protection**: `noFallthroughCasesInSwitch: true`

## Import Organization

**Order (observed in codebase):**
1. Framework imports (`@nestjs/*`, React, Redux)
2. Third-party libraries (`zod`, `uuid`, `date-fns`, `knex`)
3. Absolute path imports from monorepo
   - API: `src/*` paths first, then `"shared"`
   - Web: `@/` alias paths first, then `"shared"`
4. Relative imports (same module only): `./` or `../`

**Path Aliases:**
- **API**: `src/*` → `apps/api/src/` (cross-module imports), `"shared"` → `packages/shared` (monorepo types)
- **Web**: `@/` → `apps/web/src/` (within app), `"shared"` → `packages/shared` (monorepo types)
- **E2E**: Standard relative paths

**Rules:**
- Use absolute paths for cross-module imports (don't chain `../../../`)
- Use `import type { }` for type-only imports
- Avoid `../../../` chains; use `src/` path alias instead

## Error Handling

**Pattern: Result Type**
- All UseCases return `TResult<TData, TError, TIssues?>` from `src/shared-kernel/result`
- Success: `return success(data)`
- Failure: `return fail("ErrorType")` with string discriminant
- Optional context: Third param `TIssues` carries validation issues (e.g., `{ path: string[] }[]` for Zod errors)

**Controller error mapping (API):**
- `TResult.isFailure()` check followed by switch on `result.getError()`
- Map to NestJS exceptions: `BadRequestException`, `ConflictException`, `NotFoundException`
- Response structure: `{ error: "ERROR_CODE", message: "User-friendly message" }`

**Redux error handling (Web):**
- Store state includes `loadingState: "loading" | "success" | "error"`
- Thunks dispatch actions with payload (data or error)
- Selectors compose loading state with data in ViewData object

## Logging

**Framework:** `console` or no explicit logging (errors thrown and handled)

**Patterns:**
- Errors: Thrown and caught at boundary (controller, async thunk)
- Test cleanup errors: Logged to console with `console.error()`
- Example: `console.error("Error while clearing database in tests", err)`

**Database operations:**
- Errors from SQL queries propagate up to service layer
- InMemory mocks throw `new Error("message")` for consistency

## Comments

**When to Comment:**
- Explain **why** not **what** (code reads like documentation)
- Non-obvious business logic
- Workarounds with links to issues/ADRs
- Example: `// TODO: quartier V2 créer une méthode de calcul pour ce paramètre` (known limitation)

**JSDoc/TSDoc:**
- Not consistently enforced
- Used for public gateway interfaces and UseCase signatures
- Minimal style (no elaborate documentation)

**Disable comments:**
- `/* oxlint-disable ... */` for linting exceptions
- `// eslint-disable-next-line rule` style not observed (oxlint preferred)

## Function Design

**Size:**
- Most functions < 50 lines (readable at a glance)
- UseCase execute methods typically 20-40 lines
- Complex impact calculations in separate service classes

**Parameters:**
- Prefer object destructuring for > 2 params
- UseCase execute: Single `Request` type parameter
- Repository/Query methods: Named params or typed object
- Example: `async execute({ siteId, evaluationPeriodInYears }: Request)`

**Return Values:**
- UseCase: Always `Promise<TResult<TData, TError, TIssues?>>`
- Repository/Query: Typed promise → `Promise<Entity | null>`, `Promise<Entity[]>`, `Promise<boolean>`
- Reducer: Returns new state (Redux Toolkit via `createReducer`)
- Selector: Composed object (ViewData) with all data for view
- Example selector return: `{ loadingState: "success", siteFeatures: {...} }`

**Async/await:**
- Preferred over `.then()` chains
- Test helpers use `await` for promise resolution

## Module Design

**Exports:**
- NestJS modules export `@Module()` decorated class
- Gateway interfaces exported from `core/gateways/`
- InMemory implementations exported from `adapters/secondary/`
- Services/repositories exported by default from `index.ts` barrel

**Barrel Files:**
- `src/[module]/index.ts` re-exports public API
- Used for DRY imports across monorepo
- Example: `export { SiteView, SiteFeatures } from "./types"`

**NestJS Providers:**
- Factory pattern via `@Module({ providers: [{ ... factory ... }] })`
- Inject dependencies in factory function, return instance
- Register InMemory or production implementations at module level

## Clean Architecture Rules

**Dependency Flow:**
- `core/` (business logic) → `adapters/` (infrastructure)
- Never `adapters/` → `core/` (strict violation)
- Web: `core/` → `infrastructure/` → `views/`
- Redux: Core reducers/selectors > UI components (views depend on core, never reverse)

**Layers (API/NestJS):**
- `core/gateways/`: Interface definitions
- `core/usecases/`: Business logic (Result pattern, no framework deps)
- `core/model/`: Domain entities, value objects
- `adapters/primary/`: Controllers, NestJS decorators
- `adapters/secondary/`: Repositories, Queries, HTTP clients, InMemory mocks

**Layers (Web/React):**
- `core/`: Reducers, selectors, actions, types (no React imports)
- `infrastructure/`: Gateway implementations (HTTP, InMemory)
- `views/`: React components (container + presentational)

## Redux Specific Conventions

**Actions:**
- Passive voice (events that happened) → `stepCompleted`, `dataFetched`
- Thunks dispatch actions with payload containing success/error

**Reducers:**
- Use `createReducer` for new code (RTK)
- Legacy `createSlice` in maintenance mode only
- Handle loading states: `"loading" | "success" | "error"`
- Immutable updates (Immer handles mutations transparently)

**Selectors:**
- One per feature/container: `selectFeatureViewData`
- Return composed ViewData object with all data container needs
- Example: `{ loadingState: "success", siteFeatures: {...}, actions: [...] }`

**Testing Store Helpers:**
- `StoreBuilder` with `new StoreBuilder().withSiteData({...}).build()`
- InMemory services injected via `getTestAppDependencies()`
- Deterministic ID/date providers for reproducible tests

## Zod Schema Conventions

**Pattern:**
- Define `const soilTypeSchema = z.enum(ORDERED_SOIL_TYPES)` (no TypeScript enums)
- Export type: `export type SoilType = z.infer<typeof soilTypeSchema>`
- DTOs: Define schema first, infer type → `export type CreateSiteDto = z.infer<typeof createSiteDtoSchema>`
- Validation: `ZodValidationPipe` in controller, `safeParse()` in HTTP services

**Values:**
- Access enum values: `soilTypeSchema.options` (array of enum values)
- No runtime TypeScript enums (`enum Color {}`) - not erasable

---

*Convention analysis: 2026-03-12*
