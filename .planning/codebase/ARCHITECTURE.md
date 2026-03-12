# Architecture

**Analysis Date:** 2026-03-12

## Pattern Overview

**Overall:** Monorepo with **Clean/Hexagonal Architecture** (API) and **Clean Architecture + Redux Event-Based** (Web)

**Key Characteristics:**
- Core logic strictly separated from infrastructure (API and Web)
- Dependency rule enforced: infrastructure and views depend on core, never reverse
- API uses Command-Query Separation (CQS) with Result pattern for error handling
- Web uses Redux Toolkit with event-based actions (passive tense) and step handler pattern for wizards
- Shared package contains framework-agnostic types and utilities
- Domain-driven folder structure aligned with business concepts

## Layers

**API: Core Layer**
- Purpose: Business logic, domain models, use cases
- Location: `apps/api/src/[feature]/core/`
- Contains: UseCase implementations, domain models, gateway interfaces, business rules
- Depends on: `shared-kernel/` (Result, UseCase, DateProvider, UuidGenerator), `shared` package
- Used by: Adapters layer (secondary and primary)

**API: Adapters Layer - Secondary (Infrastructure)**
- Purpose: Data access, external service integrations
- Location: `apps/api/src/[feature]/adapters/secondary/`
- Contains: SQL repositories, queries, InMemory implementations, HTTP clients
- Depends on: Core layer, `shared-kernel/adapters/` (database connection, ID generation)
- Used by: Core layer (injected as gateway implementations)

**API: Adapters Layer - Primary (HTTP)**
- Purpose: HTTP request/response handling and routing
- Location: `apps/api/src/[feature]/adapters/primary/`
- Contains: NestJS controllers, modules (factory pattern), DTOs
- Depends on: Core layer, `shared` package (DTOs), NestJS framework
- Used by: HTTP clients (web, external apps)

**Web: Core Layer**
- Purpose: Business logic, state management, domain rules
- Location: `apps/web/src/features/[feature]/core/` or `src/shared/core/`
- Contains: Reducers, selectors (including ViewData), action creators, step handlers, gateway interfaces
- Depends on: `shared` package, Redux toolkit types
- Used by: Infrastructure and view layers

**Web: Infrastructure Layer**
- Purpose: External service integrations, HTTP calls
- Location: `apps/web/src/features/[feature]/infrastructure/` or `src/shared/infrastructure/`
- Contains: HTTP service implementations, InMemory mocks, third-party SDK wrappers
- Depends on: Core layer, `shared` package, external libraries (API client, Crisp SDK, Matomo)
- Used by: Redux thunks (via `extra` argument)

**Web: Views Layer**
- Purpose: React components for user interface
- Location: `apps/web/src/features/[feature]/views/`
- Contains: Container components (Redux-connected) and presentational components
- Depends on: Core layer (selectors, actions), DSFR components, internal shared components
- Used by: Route handlers, other containers

**Shared Package: Core**
- Purpose: Domain types, DTOs, validation schemas
- Location: `packages/shared/src/`
- Contains: Zod schemas, type definitions, utility types, value objects (SoilType, SiteNature)
- Depends on: Zod library only
- Used by: All apps (API, Web)

## Data Flow

**API: Command Flow (Create Site)**

1. HTTP Request arrives at controller (`sites.controller.ts`)
2. Controller validates DTO using ZodValidationPipe with schema from `shared` package
3. Controller instantiates UseCase (injected via NestJS factory)
4. Controller calls `useCase.execute(request)` with validated input
5. UseCase executes business logic, calls repository/query methods
6. Repository persists to SQL database via Knex query builder
7. UseCase returns `TResult<Data, Error, Issues>` to controller
8. Controller maps Result → HTTP response (200, 400, 500)
9. Domain event published via `eventPublisher.publish()` (if creation succeeded)
10. Domain event listener saves to `domain_events` table

**Web: User Interaction → Redux → View**

1. User interacts with component (clicks button, fills form)
2. Container component dispatches action (e.g., `stepCompleted({ stepId, answers })`)
3. Reducer processes action, updates Redux state slice
4. ViewData selector recomposes derived data from state slices
5. Container component re-renders with new ViewData
6. Presentational component receives ViewData via props and displays update

**Web: Async Thunk (Fetch from API)**

1. Container dispatches async thunk (e.g., `fetchSiteById(siteId)`)
2. Thunk calls `extra.siteService.fetchById()` (HTTP service from infrastructure layer)
3. HTTP service makes GET request to API, validates response with Zod
4. On success: thunk dispatches dataFetched action with response payload
5. On error: thunk dispatches error action with error details
6. Reducer handles both actions, updating state
7. ViewData selector refreshes, container re-renders

**State Management:**
- Redux store holds all application state (single source of truth)
- Reducers use `createReducer` for new features (`createSlice` is legacy)
- Actions follow passive/event naming: `stepCompleted`, `siteCreated` (not `completeStep`)
- Selectors compose state into ViewData objects for consumption by containers
- Listener middleware handles cross-cutting side effects (e.g., analytics on page view)

## Key Abstractions

**UseCase (API)**
- Purpose: Encapsulate a single business operation with clear input/output
- Examples: `CreateNewCustomSiteUseCase`, `GetSiteByIdUseCase`
- Pattern: Implement `UseCase<Request, TResult<Data, Error, Issues>>` interface
- Depends on gateway interfaces, never concrete implementations
- Returns `TResult` (discriminated union of success/failure)

**Result Type (API)**
- Purpose: Type-safe error handling without exceptions
- Pattern: `TResult<Data, ErrorType, IssuesType>` where `IssuesType` defaults to `undefined`
- Usage: `success(data)` for success path, `fail("ErrorType", issues?)` for failure
- Benefits: Compiler forces error handling at call site, no hidden exceptions

**Gateway Interface (API & Web)**
- Purpose: Define contract for external dependencies
- Examples: `SitesRepository`, `SitesQuery`, `RealEstateValuationGateway`
- Implementation: Concrete classes in secondary adapters (SQL repositories, HTTP clients)
- Testing: InMemory mocks required for all gateways

**Step Handler (Web)**
- Purpose: Encapsulate logic for a single step in multi-step wizard
- Types: `AnswerStepHandler<T>` for data-entry, `InfoStepHandler` for navigation
- Pattern: Registry maps step IDs to handler objects
- Files: Colocated `*.handler.ts`, `*.schema.ts`, `*.selectors.ts`, `*.stepperConfig.ts`
- Examples:
  - Renewable Energy: `src/features/create-project/core/renewable-energy/step-handlers/`
  - Urban Project: `src/shared/core/reducers/project-form/urban-project/step-handlers/`

**ViewData Selector (Web)**
- Purpose: Compose state into single object for container component consumption
- Pattern: One selector per container component, returns typed `{Feature}ViewData` object
- Benefits: Single `useAppSelector()` call per container, no prop drilling
- Example: `selectProjectSuggestionsViewData` in `src/features/create-project/core/createProject.selectors.ts`

**Domain Event (API)**
- Purpose: Record significant business events for audit and cross-module communication
- Pattern: Published by UseCase via `eventPublisher.publish()`, saved to `domain_events` table
- Examples: `SiteCreatedEvent`, `ProjectFinalized`
- Consumption: Event listeners (e.g., `@OnEvent("**")` in NestJS modules)

## Entry Points

**API: HTTP Server**
- Location: `apps/api/src/main.ts`
- Triggers: Application startup
- Responsibilities: Initialize NestJS application, load AppModule, start listening on port

**API: AppModule**
- Location: `apps/api/src/app.module.ts`
- Triggers: Application initialization
- Responsibilities: Import all feature modules, configure global pipes (ZodValidationPipe), setup event emitter

**Web: Root Application**
- Location: `apps/web/src/main.tsx`
- Triggers: Page load (Vite entry point)
- Responsibilities: Mount React app to DOM, initialize Redux store with middleware

**Web: App Component**
- Location: `apps/web/src/app/App.tsx`
- Triggers: Application mount
- Responsibilities: Route selection (public vs authenticated), dispatch app initialization (initCurrentUser, analytics)

**Web: Router**
- Location: `apps/web/src/app/router.ts`
- Triggers: Browser navigation
- Responsibilities: Define all routes using type-route, map routes to container components

## Error Handling

**Strategy:**
- API: Result pattern (no exceptions) with discriminated unions for type-safe error handling
- Web: Async thunks dispatch error actions, selectors expose error state to views

**Patterns:**
- API UseCase: Return `fail("ErrorType", issues)` for domain errors; throw NestJS exceptions only for infrastructure failures
- API Controller: Map Result error cases to HTTP status codes (400 for validation, 404 for not found, 500 for infrastructure)
- Web Thunk: Catch errors from HTTP service, dispatch error action with error details
- Web Reducer: Store error in state slice, selector exposes to container for display

## Cross-Cutting Concerns

**Logging:**
- API: `console.log` (later collected by container orchestration)
- Web: No centralized logging (can dispatch to analytics service if needed)

**Validation:**
- API: ZodValidationPipe globally applied to all controllers; DTO schemas in `shared/src/api-dtos/`
- Web: Zod schemas in step handlers; HTTP services validate responses from API

**Authentication:**
- API: JWT + OpenID Connect guards on protected routes
- Web: Token stored in localStorage, passed in Authorization header, current user fetched on app init

**Domain Events:**
- API: Published from UseCases via `eventPublisher.publish()`; saved to database via global listener
- Web: Actions are immutable events; selectors compute state from event history
