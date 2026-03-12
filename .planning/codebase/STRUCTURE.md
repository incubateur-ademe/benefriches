# Codebase Structure

**Analysis Date:** 2026-03-12

## Directory Layout

```
benefriches/
├── .planning/               # GSD planning artifacts
├── .claude/                 # Claude workspace config, skills, context docs
│   ├── context/api/         # API architecture guidance files
│   ├── skills/              # Reusable skill templates
│   └── session-summaries/   # Conversation history
├── apps/                    # Application packages
│   ├── api/                 # NestJS REST API
│   │   ├── src/
│   │   │   ├── [feature]/
│   │   │   │   ├── core/               # Business logic
│   │   │   │   │   ├── usecases/
│   │   │   │   │   ├── gateways/
│   │   │   │   │   ├── models/
│   │   │   │   │   ├── events/
│   │   │   │   │   └── [name].spec.ts
│   │   │   │   └── adapters/
│   │   │   │       ├── primary/        # HTTP controllers & NestJS modules
│   │   │   │       └── secondary/      # SQL repositories, queries, HTTP clients
│   │   │   ├── shared-kernel/          # Reusable API infrastructure
│   │   │   │   ├── adapters/
│   │   │   │   │   ├── sql-knex/
│   │   │   │   │   ├── date/
│   │   │   │   │   └── id-generator/
│   │   │   │   ├── result.ts
│   │   │   │   ├── usecase.ts
│   │   │   │   └── domainEvent.ts
│   │   │   ├── app.module.ts
│   │   │   └── main.ts
│   │   ├── migrations/                 # Knex database migrations
│   │   ├── test/
│   │   │   └── integration-tests-global-hooks.ts
│   │   └── package.json
│   ├── web/                 # React SPA (Vite)
│   │   ├── src/
│   │   │   ├── app/                    # Composition root
│   │   │   │   ├── store/
│   │   │   │   │   ├── store.ts        # Redux setup
│   │   │   │   │   ├── rootReducer.ts
│   │   │   │   │   ├── appDependencies.ts
│   │   │   │   │   └── listenerMiddleware.ts
│   │   │   │   ├── router.ts
│   │   │   │   ├── hooks/
│   │   │   │   ├── App.tsx
│   │   │   │   └── envVars.ts
│   │   │   ├── features/               # Feature modules
│   │   │   │   ├── [feature]/
│   │   │   │   │   ├── core/           # Redux reducers, selectors, actions
│   │   │   │   │   ├── infrastructure/ # HTTP services, InMemory mocks
│   │   │   │   │   └── views/          # React components
│   │   │   │   ├── create-site/
│   │   │   │   ├── create-project/
│   │   │   │   ├── sites/
│   │   │   │   ├── projects/
│   │   │   │   ├── onboarding/
│   │   │   │   ├── support/
│   │   │   │   └── ...
│   │   │   ├── shared/                 # Shared across features
│   │   │   │   ├── core/               # Shared Redux logic
│   │   │   │   │   └── reducers/       # Common state slices
│   │   │   │   ├── infrastructure/     # Shared services
│   │   │   │   └── views/              # Shared components
│   │   │   ├── main.tsx
│   │   │   └── main.css
│   │   ├── public/
│   │   └── package.json
│   └── e2e-tests/           # Playwright end-to-end tests
│       ├── pages/           # Page Objects
│       ├── fixtures/        # Test fixtures & helpers
│       ├── tests/
│       │   └── [feature]/
│       │       ├── [feature].fixtures.ts
│       │       └── [feature].spec.ts
│       └── package.json
├── packages/                # Shared code
│   └── shared/              # Framework-agnostic types & utilities
│       ├── src/
│       │   ├── api-dtos/            # Request/response DTOs
│       │   ├── site/                # Site domain types
│       │   ├── soils/               # Soil type definitions
│       │   ├── reconversion-projects/ # Project domain types
│       │   ├── financial/           # Financial calculation types
│       │   ├── services/            # Utility functions
│       │   ├── adapters/            # Port interfaces (IDateProvider)
│       │   └── index.ts
│       ├── dist/            # Built output (gitignored)
│       └── package.json
├── docs/                    # Documentation
│   ├── adr/                 # Architecture Decision Records
│   ├── plans/               # Feature plans
│   └── feature-example.md   # Complete feature walkthrough
├── scripts/                 # Utility scripts
├── CLAUDE.md                # Monorepo guide for AI assistants
├── package.json             # Root workspace
└── README.md                # French setup guide
```

## Directory Purposes

**apps/**
- Root container for all applications
- Each app is independently deployable with own `package.json`, build config, tests
- Shared dependencies managed at monorepo level via pnpm workspaces

**apps/api/src/**
- NestJS application source code
- Module-per-feature structure with clean separation of core and adapters
- All features follow identical pattern (core → adapters/primary + secondary)

**apps/api/src/[feature]/core/**
- Pure business logic with no framework dependencies
- Gateway interfaces define contracts (never concrete classes)
- Models contain domain validation logic
- UseCases orchestrate business operations
- Cannot import from `adapters/` (dependency rule violation)

**apps/api/src/[feature]/adapters/secondary/**
- Data access implementations (SQL repositories, queries)
- External service integrations (HTTP clients, third-party SDKs)
- InMemory implementations for testing (required)
- Implements gateway interfaces from core layer

**apps/api/src/[feature]/adapters/primary/**
- NestJS controllers handle HTTP routing
- Modules wire dependencies using factory pattern
- DTOs for validation imported from `shared` package
- Maps between HTTP and UseCase layers

**apps/api/src/shared-kernel/**
- Reusable infrastructure for all API features
- `result.ts`: Result<Data, Error, Issues> type for error handling
- `usecase.ts`: UseCase interface all use cases implement
- `adapters/sql-knex/`: Database connection, table types registry
- `adapters/date/`: DateProvider interface and implementations
- `adapters/id-generator/`: UuidGenerator interface and implementations

**apps/api/migrations/**
- Knex database migrations in chronological order
- Naming: `[timestamp]_description.ts`
- Must run `pnpm --filter api knex:migrate-latest` after adding migration
- Update `tableTypes.d.ts` after creating table

**apps/web/src/app/**
- Application bootstrap and composition root
- `store.ts`: Redux store creation with middleware and types
- `rootReducer.ts`: Combines all feature reducers
- `appDependencies.ts`: Production dependency injection (HTTP services)
- `router.ts`: All route definitions using type-route
- `App.tsx`: Root component, route dispatch, app initialization

**apps/web/src/features/[feature]/**
- Feature module with independent business logic
- `core/`: Redux reducers, selectors (including ViewData), action creators
- `infrastructure/`: HTTP services (HttpFeatureService, InMemoryFeatureService)
- `views/`: React components (container in index.tsx, presentational siblings)

**apps/web/src/features/create-site/core/urban-zone/**
- Complex multi-step form for urban zone site creation
- `step-handlers/`: Step handler registry and per-step definitions
- `steps/`: Step-specific logic (schemas, handlers, selectors, config)
- Each step has colocated files: `*.handler.ts`, `*.schema.ts`, `*.selectors.ts`, `*.stepperConfig.ts`

**apps/web/src/shared/core/reducers/project-form/urban-project/**
- Shared urban project form logic used by both create and update features
- `step-handlers/`: Complex handlers with dependency rules, shortcuts, recomputation
- Shared between `features/create-project` and `features/update-project`

**apps/web/src/shared/views/components/**
- Internal shared components (RadioButtons, CheckableTile, BackNextButtons, Dialog, Spinner)
- Do NOT duplicate DSFR components from `@codegouvfr/react-dsfr`
- Check here before creating new UI component

**packages/shared/src/api-dtos/**
- Request and response DTOs for all API endpoints
- Zod schemas for runtime validation (used in API controllers and Web HTTP services)
- Naming: `[operation][Entity].dto.ts` (e.g., `createSite.dto.ts`, `getSiteView.dto.ts`)
- TypeScript types inferred from Zod schemas with `z.infer<typeof schema>`

**packages/shared/src/[domain]/**
- Domain types shared between API and Web
- `site/`: Site-related types (SiteEntity, SiteView, SiteFeatures)
- `soils/`: Soil type definitions (ORDERED_SOIL_TYPES, soilTypeSchema)
- `reconversion-projects/`: Project domain types and generators
- `financial/`: Cost, revenue types and calculations
- Must avoid framework-specific code; use pure TypeScript only

## Key File Locations

**Entry Points:**
- `apps/api/src/main.ts`: API HTTP server startup
- `apps/web/src/main.tsx`: React app bootstrap (Vite entry)
- `apps/e2e-tests/pages/`: Page Object definitions

**Configuration:**
- `apps/api/tsconfig.json`: TypeScript strict mode for API
- `apps/web/tsconfig.json`: TypeScript strict mode for Web
- `apps/api/src/app.module.ts`: Global NestJS module configuration
- `apps/web/src/app/store.ts`: Redux store setup with middleware

**Core Logic:**
- `apps/api/src/shared-kernel/`: Reusable Result type, UseCase interface, DateProvider, UuidGenerator
- `apps/web/src/app/store/`: Redux configuration (store, rootReducer, appDependencies)
- `packages/shared/src/api-dtos/`: All request/response DTO schemas

**Testing:**
- `apps/api/test/integration-tests-global-hooks.ts`: Auto-cleanup after integration tests
- `apps/web/src/[feature]/core/__tests__/_testStoreHelpers.ts`: StoreBuilder for unit tests
- `apps/e2e-tests/fixtures/`: Test fixtures and helpers

## Naming Conventions

**Files:**
- UseCase: `[verb][Noun].usecase.ts` → `createSite.usecase.ts`
- Repository: `Sql[Name]Repository.ts` → `SqlSiteRepository.ts`
- Query: `Sql[Name]Query.ts` → `SqlSitesQuery.ts`
- Controller: `[module].controller.ts` → `sites.controller.ts`
- NestJS Module: `[module].module.ts` → `sites.module.ts`
- HTTP Service: `Http[Name]Service.ts` → `HttpSiteService.ts`
- InMemory Mock: `InMemory[Name]Service.ts` → `InMemorySiteService.ts`
- Redux Reducer: `[feature].reducer.ts` → `createSite.reducer.ts`
- Selector: `[feature].selectors.ts` with `select{Feature}ViewData` function
- Action: `[event].action.ts` (passive tense) → `stepCompleted.action.ts`
- Step Handler: `[stepId].handler.ts`, `[stepId].schema.ts`, `[stepId].selectors.ts`, `[stepId].stepperConfig.ts`
- DTO: `[operation][Entity].dto.ts` → `createSite.dto.ts`, `getSiteView.dto.ts`

**Directories:**
- Features: `[feature-name]/` (kebab-case) → `create-site/`, `create-project/`
- Modules: `[domain]/` (kebab-case) → `sites/`, `reconversion-projects/`
- Core: `core/` (always, no variations)
- Infrastructure: `infrastructure/` (Web) or `adapters/secondary/` (API)
- Views: `views/` (Web only)

## Where to Add New Code

**New Feature:**
- Create `apps/web/src/features/[feature-name]/` with `core/`, `infrastructure/`, `views/` subdirectories
- Create `apps/api/src/[feature-name]/` with `core/` and `adapters/` subdirectories
- Register in root reducer (`apps/web/src/app/store/rootReducer.ts`) and AppModule (`apps/api/src/app.module.ts`)

**New Component/Module:**
- Check `apps/web/src/shared/views/components/` first (reuse if exists)
- Check `@codegouvfr/react-dsfr` library (reuse DSFR components)
- If not found, create in feature's `views/` subdirectory or `src/shared/views/components/` if shared

**Shared Types:**
- API DTO: `packages/shared/src/api-dtos/[feature]/[operation][Entity].dto.ts`
- Domain type: `packages/shared/src/[domain]/index.ts`
- Utility function: `packages/shared/src/services/`

**Database Changes:**
- Always use `/create-database-migration` skill (never create migration files manually)
- After migration created, update `src/shared-kernel/adapters/sql-knex/tableTypes.d.ts`
- Run `pnpm --filter api knex:migrate-latest` to apply

**Tests:**
- API unit test: `[path]/[file].spec.ts` (colocated with source)
- API integration test: `[path]/[file].integration-spec.ts`
- Web test: `[path]/[file].spec.ts` or `[path]/[file].spec.tsx`
- E2E test: `apps/e2e-tests/tests/[feature]/[feature].spec.ts`

## Special Directories

**apps/api/migrations/**
- Purpose: Database schema versioning
- Generated: By `/create-database-migration` skill
- Committed: Yes, to version control
- Pattern: Chronological timestamp prefix, each migration idempotent

**apps/web/coverage/**
- Purpose: Test coverage reports (not applicable for architecture)
- Generated: Yes, by test runner
- Committed: No (in .gitignore)

**packages/shared/dist/**
- Purpose: Compiled shared package output
- Generated: Yes, by `pnpm --filter shared build`
- Committed: No (in .gitignore)
- When to rebuild: After any changes to `src/`; must manually run `pnpm --filter shared build`

**apps/web/public/**
- Purpose: Static assets (images, icons, fonts)
- Contains: DSFR design system assets, custom app images and pictograms
- Generated: No
- Committed: Yes

**docs/adr/**
- Purpose: Architecture Decision Records
- Pattern: `[number]-[title].md` → `0004-colocate-urban-project-step-definitions.md`
- Committed: Yes, for historical reference
