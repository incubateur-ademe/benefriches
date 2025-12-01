# Benefriches Web App - Quick Reference

> **Purpose**: Quick reference for web app patterns. For monorepo-wide conventions, see [/CLAUDE.md](../../CLAUDE.md). For detailed pattern documentation, see [Pattern Files](../../.claude/context/web/).

---

## 📋 Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [Project Structure](#-project-structure)
3. [Redux Event-Based Architecture](#-redux-event-based-architecture)
4. [Component Patterns](#-component-patterns)
5. [API Integration (Gateway Pattern)](#-api-integration-gateway-pattern)
6. [Testing Strategy](#-testing-strategy)
7. [Routing & Styling](#-routing--styling)
8. [Development Workflow](#-development-workflow)
9. [AI Assistant Workflow](#-ai-assistant-workflow)

---

## ✅ Code Quality Standards

**For complete TypeScript rules and standards, see [root CLAUDE.md → Code Quality Standards](../../CLAUDE.md#-code-quality-standards).**

All code must pass:

- `pnpm --filter web typecheck` - TypeScript strict mode
- `pnpm --filter web lint` - oxlint with type checking
- `pnpm --filter web test` - Tests must pass

---

## 🏗️ Architecture Overview

This web app follows **Clean/Hexagonal Architecture** with **Redux as an event-based state management system**. The architecture enforces strict **dependency rules**: Core has NO dependencies on infrastructure or views. Infrastructure and views depend on core.

**Key Principle**: Redux is an **event-based architecture** where actions represent domain events. This is established and should not be refactored.

For detailed architecture guidance, layering, and dependency principles, see [00-overview.md](../../.claude/context/web/00-overview.md).

---

## 📁 Project Structure

```
apps/web/src/
├── features/                    # Feature modules (domain-driven)
│   ├── create-site/
│   │   ├── core/               # Business logic (Pure TypeScript)
│   │   ├── infrastructure/     # External adapters (HTTP, InMemory)
│   │   └── views/              # React components
│   └── ...
├── shared/                      # Shared across features
│   ├── core/store-config/       # Redux store setup
│   ├── infrastructure/          # Shared services
│   └── views/                   # Shared UI components
└── test/                        # Test utilities & builders
```

**Feature Structure** (Standard for new features):

```
feature-name/
├── core/
│   ├── feature.types.ts                  # Type definitions (single source of truth)
│   ├── featureName.reducer.ts            # Reducer logic
│   ├── featureName.gateway.ts            # Gateway interface
│   ├── actions/
│   │   └── *.actions.ts                  # Action creators (passive tense)
│   ├── selectors/
│   │   └── featureName.selectors.ts      # Memoized selectors
│   └── __tests__/
│       └── featureName.spec.ts           # Reducer/selector tests
├── infrastructure/
│   └── feature-service/
│       ├── HttpFeatureApi.ts             # HTTP implementation
│       └── InMemoryFeatureService.ts     # Test mock (required)
└── views/
    ├── index.tsx                         # Container (Redux-connected)
    ├── [FeatureName]Page.tsx             # Top-level presentational
    └── components/
        └── *.tsx                         # Presentational components
```

See [00-overview.md](../../.claude/context/web/00-overview.md) for complete structure details.

---

## 🔄 Redux Event-Based Architecture

Redux manages state through **domain events** (actions in passive tense: `stepCompleted`, not `completeStep`). Actions dispatched to reducers update state through immutable updates.

**Key patterns**:

- **Actions**: Use `createAction` (sync) or `createAppAsyncThunk` (async) with passive tense naming
- **Reducers**: Use `createReducer` for new features (`createSlice` is legacy)
- **Selectors**: Use `createSelector` with **ViewData pattern** - naming: `select{FeatureName}ViewData`
- **Side Effects**: Handle local UI concerns in components with `useEffect`; use listener middleware sparingly for specific Redux action side effects
- **Dependency Injection**: Services injected via store's `extraArgument`, accessed as `extra` in thunks

For complete Redux patterns, see [01-redux-architecture.md](../../.claude/context/web/01-redux-architecture.md).

---

## 🧩 Component Patterns

**Always separate containers (Redux-connected) from presentational components**. Containers use Redux hooks and dispatch actions; presentational components receive all data via props.

**Composed Type Props Pattern**: When passing data to components, compose related domain types into single props (e.g., `siteView: SiteView`) instead of scattering across multiple props. This keeps component contracts clear and type-safe.

**Typed Hooks**: Always use `useAppSelector` and `useAppDispatch` from `src/shared/views/hooks/store.hooks.ts` for full type safety. Never use untyped Redux hooks from `react-redux` directly.

For detailed component patterns, form handling, and composed types, see [02-component-patterns.md](../../.claude/context/web/02-component-patterns.md).

---

## 🌐 API Integration (Gateway Pattern)

Follow **Ports & Adapters**: Define gateway interfaces in `core/`, implement HTTP client in infrastructure, implement InMemory mock for tests, inject via store's `appDependencies`.

### Using Backend DTOs for Type Safety

**Key**: Import request/response DTOs from the `shared` package to enable type-safe HTTP calls:

```typescript
// core/sites.gateway.ts
import type { CreateCustomSiteDto, GetSiteViewResponseDto } from "shared";

export interface SitesGateway {
  createSite(request: CreateCustomSiteDto): Promise<GetSiteViewResponseDto>;
}

// infrastructure/sites-service/HttpSitesApi.ts
export class HttpSitesApi implements SitesGateway {
  async createSite(request: CreateCustomSiteDto): Promise<GetSiteViewResponseDto> {
    const response = await fetch("/api/sites", {
      /* ... */
    });
    return response.json();
  }
}
```

This ensures frontend and backend share the exact same type definitions for API contracts.

### Standard Gateway Flow

1. **Gateway interface** in `core/` (e.g., `core/sites.gateway.ts`): `export interface SitesGateway { getSite(id: string): Promise<Site> }`
2. **HTTP implementation** in `infrastructure/sites-service/HttpSitesApi.ts`: `export class HttpSitesApi implements SitesGateway { ... }`
3. **InMemory mock** in `infrastructure/sites-service/InMemorySitesService.ts`: `export class InMemorySitesService implements SitesGateway { ... }`
4. **Inject** via store config and use in async thunks via `extra` parameter (e.g., `extra.sitesService.getSite(id)`)

For complete gateway pattern examples and testing with InMemory services, see [03-api-integration.md](../../.claude/context/web/03-api-integration.md).

---

## 🧪 Testing Strategy

**Builder Pattern**: Use builder classes to set up test state in a readable, maintainable way. Example: `new StoreBuilder().withSiteData({ isFriche: true }).build()`.

**InMemory Services**: All gateways must have InMemory implementations for unit testing. Tests use InMemory services injected via store config.

**Test Organization**:

- Reducer tests: `core/__tests__/featureName.spec.ts`
- Component tests: `views/ComponentName.spec.tsx`

**Testing Stack**: Vitest + @testing-library/react + @testing-library/jest-dom

For detailed testing patterns, builder examples, and test utilities, see [04-testing-strategy.md](../../.claude/context/web/04-testing-strategy.md).

---

## 🚦 Routing & Styling

**Routing**: `type-route` provides type-safe routing. Routes defined once, used everywhere with compile-time parameter validation.

**Styling**: Tailwind CSS (v4+) for utilities + DSFR components for French Government-compliant UI.

For type-route setup, component navigation patterns, and styling examples, see [05-routing-styling.md](../../.claude/context/web/05-routing-styling.md).

---

## 🔧 Development Workflow

### Common Commands

```bash
pnpm --filter web dev              # Start dev server
pnpm --filter web test             # Run all tests
pnpm --filter web test -- --watch  # Watch mode
pnpm --filter web typecheck        # Type check
pnpm --filter web lint             # Lint
pnpm --filter web build            # Production build
```

### Quality Checklist (After Code Changes)

**ALWAYS run in this order**:

1. `pnpm --filter web typecheck`
2. `pnpm --filter web lint`
3. `pnpm --filter web test path/to/modified/file.spec.ts`

**If modifying `shared` package**: Run `pnpm --filter shared build` first, then web checks.

---

## 🤖 AI Assistant Workflow

### Pattern Discovery: Load Patterns as Needed

Use these pattern files for specific tasks:

| Task                  | Load These Patterns                                                                                                                                                                                                                                                                                                                                                              |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **New Feature**       | [00-overview.md](../../.claude/context/web/00-overview.md), [01-redux-architecture.md](../../.claude/context/web/01-redux-architecture.md), [02-component-patterns.md](../../.claude/context/web/02-component-patterns.md), [03-api-integration.md](../../.claude/context/web/03-api-integration.md), [04-testing-strategy.md](../../.claude/context/web/04-testing-strategy.md) |
| **Redux State**       | [01-redux-architecture.md](../../.claude/context/web/01-redux-architecture.md)                                                                                                                                                                                                                                                                                                   |
| **Components**        | [02-component-patterns.md](../../.claude/context/web/02-component-patterns.md)                                                                                                                                                                                                                                                                                                   |
| **API / Gateway**     | [03-api-integration.md](../../.claude/context/web/03-api-integration.md)                                                                                                                                                                                                                                                                                                         |
| **Testing**           | [04-testing-strategy.md](../../.claude/context/web/04-testing-strategy.md)                                                                                                                                                                                                                                                                                                       |
| **Routing / Styling** | [05-routing-styling.md](../../.claude/context/web/05-routing-styling.md)                                                                                                                                                                                                                                                                                                         |

### Feature Creation Checklist

When creating a new feature, follow these steps:

1. Create feature folder structure: `core/`, `infrastructure/`, `views/`
2. Define types in `core/feature.types.ts`
3. Create gateway interface: `core/feature.gateway.ts`
4. Create actions (passive tense) and reducer using `createReducer`
5. Create selector with ViewData pattern: `select{FeatureName}ViewData`
6. Implement HTTP and InMemory gateways in `infrastructure/feature-service/`
7. Create container (`index.tsx`) and presentational components
8. Write tests with Builder pattern (test state + InMemory services)
9. Register reducer in `rootReducer.ts`
10. Inject services in `appDependencies.ts` and `testAppDependencies.ts`
11. Run quality checks: `typecheck` → `lint` → `test`

---

## ✅ Patterns for New Features

**Core Standards**:

- ✅ Use `createReducer` for reducers (not `createSlice` - that's legacy)
- ✅ Name actions in passive tense: `stepCompleted`, `dataFetched`, not `completeStep`
- ✅ Use ViewData selector pattern: `select{FeatureName}ViewData` - single composed selector per container
- ✅ Separate container (Redux-connected) from presentational components
- ✅ Define gateway interfaces in `core/`, implement in `infrastructure/`
- ✅ Create InMemory service implementations for all gateways (required for testing)
- ✅ Use Builder pattern for test state setup
- ✅ Always use typed hooks: `useAppSelector`, `useAppDispatch`
- ✅ Inject services via store's `extraArgument` and access in thunks as `extra`

**Avoid in New Code**:

- Refactoring Redux to other state management (it's established)
- Multiple selector calls in containers (compose into single ViewData selector)
- Importing infrastructure code in core (violates Clean Architecture)
- Untyped Redux hooks from `react-redux` (use typed wrappers)
- Skipping InMemory test implementations

---

## 📚 Related Documentation

- **Monorepo Guide**: [/CLAUDE.md](../../CLAUDE.md) - Workspace, dependencies, quality standards
- **API Guide**: [apps/api/CLAUDE.md](../api/CLAUDE.md) - Backend patterns, database
- **Pattern Files**: [.claude/context/web/](../../.claude/context/web/) - Detailed pattern documentation

---

**Current versions**: React 18+, Redux Toolkit 2+, Vite 6+, TypeScript 5+
