# Web App Architecture Overview

> **Purpose**: High-level architecture guide for the Benefriches web application. For specific patterns and implementation details, see related pattern files.

---

## 🏗️ Architecture Principles

This web app follows **Clean/Hexagonal Architecture** with **Redux as an event-based state management system**.

### Core Principles

1. **Clean Architecture Layers**:
   - **Core** (`core/`): Pure TypeScript - business logic, reducers, actions, selectors
   - **Infrastructure** (`infrastructure/`): External adapters (HTTP API clients, LocalStorage)
   - **Views** (`views/`): React UI components

   **Dependency Rule**: Core has NO dependencies on infrastructure or views. Infrastructure and views depend on core.

2. **Feature-Based Organization**: Each domain feature is self-contained with its own `core/`, `infrastructure/`, `views` folders

3. **Redux Event-Based Architecture**: Redux manages state through events (actions). This is an **established pattern** and should be treated as-is. Do not attempt to refactor to other state management patterns.

4. **Gateway Pattern**: Infrastructure adapters implement interfaces defined in core (Ports & Adapters pattern)

---

## 📁 Project Structure

```
apps/web/src/
├── features/                    # Feature modules (domain-driven)
│   ├── create-site/
│   │   ├── core/               # Business logic (Pure TypeScript)
│   │   │   ├── createSite.reducer.ts
│   │   │   ├── actions/
│   │   │   ├── selectors/
│   │   │   └── listeners/
│   │   ├── infrastructure/     # External adapters
│   │   │   └── create-site-service/
│   │   │       ├── HttpCreateSiteApi.ts
│   │   │       └── InMemoryCreateSiteService.ts
│   │   └── views/              # React components
│   │       ├── introduction/
│   │       └── SiteCreation.tsx
│   ├── create-project/
│   ├── update-project/
│   ├── projects/
│   └── ...
├── shared/                      # Shared across features
│   ├── core/                   # Business utilities
│   │   ├── store-config/       # Redux store setup
│   │   │   ├── store.ts
│   │   │   ├── rootReducer.ts
│   │   │   └── listenerMiddleware.ts
│   │   └── ...
│   ├── infrastructure/         # Shared services
│   └── views/                  # Shared UI components
│       ├── components/
│       ├── hooks/
│       └── router.ts
└── test/                        # Test utilities
    ├── setupTestEnv.ts
    └── builders/
```

---

## 🎯 Feature Structure Pattern

**Standard structure for new features:**

```
feature-name/
├── core/                        # Pure TypeScript - NO React, NO external APIs
│   ├── feature.types.ts        # Type definitions (single source of truth)
│   ├── feature.gateway.ts      # Gateway interface (Ports & Adapters)
│   ├── featureName.reducer.ts  # Reducer logic
│   ├── actions/                # Action creators (passive tense naming)
│   │   └── *.actions.ts
│   ├── selectors/              # Memoized selectors
│   │   └── featureName.selectors.ts  # Contains select{FeatureName}ViewData
│   └── __tests__/              # Unit tests
│       └── featureName.spec.ts
├── infrastructure/             # External world adapters (HTTP, InMemory)
│   └── feature-service/
│       ├── HttpFeatureApi.ts           # Real HTTP implementation
│       └── InMemoryFeatureService.ts   # Test mock (required)
└── views/                      # React UI components
    ├── index.tsx               # Container (Redux-connected)
    ├── [FeatureName]Page.tsx   # Top-level presentational
    └── components/             # Feature-specific presentational
        └── *.tsx
```

### Type Organization

Create a `feature.types.ts` file (e.g., `site.types.ts`) in `core/` as a centralized registry for all domain types. This keeps types accessible to reducers, actions, selectors, and infrastructure adapters, serving as a single source of truth.

**Example**: [create-site](../../src/features/create-site/)

---

## 📚 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Rendering** | React 18+ | Component rendering |
| **State Management** | Redux Toolkit | Event-based state management |
| **Build Tool** | Vite | Fast dev server & production build |
| **Styling** | Tailwind CSS + DSFR | Utility classes + French Gov Design System |
| **Forms** | react-hook-form | Form state management |
| **Routing** | type-route | Type-safe routing |
| **Testing** | Vitest + @testing-library/react | Unit and component tests |
| **Language** | TypeScript (strict mode) | Type safety |

---

## 🔄 Dependency Injection Pattern

Services (API clients, gateways) are injected through the Redux store's `extraArgument`:

```typescript
// Store setup with dependency injection
export const createStore = (
  appDependencies: AppDependencies,
  preloadedState?: PreloadedStateFromReducer<typeof rootReducer>,
) => {
  const store = configureStore({
    reducer: rootReducer,
    middleware(getDefaultMiddleware) {
      return getDefaultMiddleware({
        thunk: {
          extraArgument: appDependencies, // ✅ Inject gateways here
        },
      }).prepend(listener.middleware);
    },
    preloadedState,
  });
  return store;
};
```

**Key Pattern**: Gateways (API clients, services) are accessible in async thunks via `extra` parameter.

---

## 🔗 Pattern Reference

For detailed patterns and implementation guidance:

- **Redux Architecture** → [01-redux-architecture.md](./01-redux-architecture.md)
- **Component Patterns** → [02-component-patterns.md](./02-component-patterns.md)
- **API Integration (Gateway Pattern)** → [03-api-integration.md](./03-api-integration.md)
- **Testing Strategy** → [04-testing-strategy.md](./04-testing-strategy.md)
- **Routing & Styling** → [05-routing-styling.md](./05-routing-styling.md)

---

## ✅ Code Quality Standards

**For complete TypeScript rules and quality standards, see [root CLAUDE.md → Code Quality Standards](../../../CLAUDE.md#-code-quality-standards).**

Key standards for web code:

- **TypeScript strict mode**: `strict: true`
- **No `any` types**: Use `unknown` when type is truly unknown
- **Explicit return types**: Required for public functions/methods
- **Type imports**: Use `import type { }` for type-only imports
- **Code formatting**: Prettier (auto-formatted via pre-commit hooks)
- **Linting**: oxlint with `--type-aware` flag

---

## ✅ Critical Rules

**DO**:
- ✅ Use `createReducer` for all new features (`createSlice` is legacy)
- ✅ Use Builder pattern for test data
- ✅ Name actions in passive tense (e.g., `stepCompleted`, not `completeStep`)
- ✅ Use ViewData pattern: one selector per container exposing a `*ViewData` object
- ✅ Separate container (Redux) from presentational (UI) components
- ✅ Define gateway interfaces in core, implement in infrastructure
- ✅ Use feature-based folder structure
- ✅ Follow Clean Architecture dependency rules (core independent)

**DON'T**:
- ❌ Don't refactor Redux to other state management (it's event-based by design)
- ❌ Don't use `createSlice` for new features (legacy)
- ❌ Don't name actions as commands (use past tense)
- ❌ Don't call multiple selectors in containers (use one ViewData selector)
- ❌ Don't import infrastructure code in core (violates Clean Architecture)
- ❌ Don't access Redux directly from presentational views (use hooks)
- ❌ Don't skip InMemory implementations (needed for tests)

---

**Next**: See specific pattern files for detailed implementation guidance.
