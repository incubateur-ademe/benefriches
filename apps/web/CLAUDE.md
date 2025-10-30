# Benefriches Web App - Architecture Guide

> **Purpose**: Guide for AI assistants and developers working on the React/Redux web application. This guide covers web-specific patterns. For monorepo-wide conventions, see [/CLAUDE.md](../../CLAUDE.md).

---

## 📋 Table of Contents

1. [Architecture Overview](#-architecture-overview)
2. [Project Structure](#-project-structure)
3. [Redux Event-Based Architecture](#-redux-event-based-architecture)
4. [Component Patterns](#-component-patterns)
5. [API Integration (Gateway Pattern)](#-api-integration-gateway-pattern)
6. [Testing Strategy](#-testing-strategy)
7. [Routing](#-routing)
8. [Styling](#-styling)
9. [Development Workflow](#-development-workflow)
10. [AI Assistant Workflow](#-ai-assistant-workflow)

---

## 🏗️ Architecture Overview

This web app follows **Clean/Hexagonal Architecture** with **Redux as an event-based state management system**.

### Core Principles

1. **Clean Architecture Layers**:
   - **Core** (`core/`): Pure TypeScript - business logic, reducers, actions, selectors
   - **Infrastructure** (`infrastructure/`): External adapters (HTTP API clients, LocalStorage)
   - **Views** (`views/`): React UI components

   **Dependency Rule**: Core has NO dependencies on infrastructure or views. Infrastructure and views depend on core.

2. **Feature-Based Organization**: Each domain feature is self-contained with its own core/infrastructure/views

3. **Redux Event-Based Architecture**: Redux manages state through events (actions). This architecture is **established and should be treated as-is**. Do not attempt to refactor to other state management patterns.

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

### Feature Structure Pattern

**ALWAYS follow this structure when creating new features:**

```
feature-name/
├── core/                        # Pure TypeScript - NO React, NO external APIs
│   ├── featureName.reducer.ts  # State logic
│   ├── actions/                # Action creators
│   │   └── *.actions.ts
│   ├── selectors/              # Memoized selectors
│   │   └── *.selectors.ts
│   └── listeners/              # Side effect listeners (optional)
│       └── *.listener.ts
├── infrastructure/              # External world adapters
│   └── feature-service/
│       ├── HttpFeatureApi.ts           # Real HTTP client
│       └── InMemoryFeatureService.ts   # Test mock
└── views/                       # React UI components
    ├── FeaturePage.tsx          # Main page/container
    └── components/              # Feature-specific components
        └── *.tsx
```

**Example**: [create-site](src/features/create-site/)

---

## 🔄 Redux Event-Based Architecture

**IMPORTANT**: Redux is the established state management pattern. This is an **event-based architecture** where actions represent domain events. Do NOT attempt to change this architecture.

### Store Setup with Dependency Injection

**Location**: [shared/core/store-config/store.ts](src/shared/core/store-config/store.ts)

```typescript
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

**Key Pattern**: Gateways (API clients, services) are injected via `extraArgument`, accessible in thunks as `extra`.

### Actions

**IMPORTANT: Action Naming Convention**

Actions should be named like **events in passive tense** (past tense), representing what happened, not what should happen. This follows event-based architecture principles.

```typescript
// ✅ CORRECT - Past tense (event that happened)
export const introductionStepCompleted = createAction("siteCreation/introduction/completed");
export const siteDataFetched = createAction("siteCreation/dataFetched");
export const namingStepReverted = createAction("siteCreation/naming/reverted");

// ❌ WRONG - Imperative/present tense (command)
export const completeIntroductionStep = createAction("...");
export const fetchSiteData = createAction("...");
export const revertNamingStep = createAction("...");
```

**Note**: This convention is not yet applied everywhere in the codebase, but should be followed for all new actions.

**Use `createAppAsyncThunk` for async actions** with typed dependencies:

```typescript
// Typed thunk creator
export const createAppAsyncThunk = createAsyncThunk.withTypes<{
  state: RootState;
  dispatch: AppDispatch;
  extra: AppDependencies; // ✅ Access injected gateways
}>();

// Example: Fetching data
export const fetchReconversionProjects = createAppAsyncThunk<
  ReconversionProjectsGroupedBySite, // Return type
  { userId: string } // Argument type
>("projects/fetchList", async ({ userId }, { extra }) => {
  const result = await extra.reconversionProjectsListService.getGroupedBySite({
    userId,
  });
  return result;
});
```

**Use `createAction` for sync actions**:

```typescript
import { createAction } from "@reduxjs/toolkit";

export const introductionStepCompleted = createAction("siteCreation/introduction/completed");

export const namingStepCompleted = createAction<{
  name: string;
  description?: string;
}>("siteCreation/naming/completed");
```

**Example**: [create-site/core/actions](src/features/create-site/core/actions/)

### Reducers

**IMPORTANT**: Use `createReducer` for all **new features**. `createSlice` is **legacy** and should only be used for maintaining existing code.

**Pattern: createReducer (PREFERRED for new code)**

```typescript
import { createReducer } from "@reduxjs/toolkit";

type State = {
  stepsHistory: SiteCreationStep[];
  siteData: SiteCreationData;
  saveLoadingState: LoadingState;
};

const getInitialState = (): State => ({
  stepsHistory: ["INTRODUCTION"],
  siteData: {},
  saveLoadingState: "idle",
});

export const siteCreationReducer = createReducer(getInitialState(), (builder) => {
  builder
    .addCase(introductionStepCompleted, (state) => {
      state.stepsHistory.push("IS_FRICHE");
    })
    .addCase(isFricheCompleted, (state, action) => {
      state.siteData.isFriche = action.payload.isFriche;
      if (action.payload.isFriche) {
        state.stepsHistory.push("CREATE_MODE_SELECTION");
      } else {
        state.stepsHistory.push("ADDRESS");
      }
    })
    .addCase(fetchSiteData.pending, (state) => {
      state.saveLoadingState = "loading";
    })
    .addCase(fetchSiteData.fulfilled, (state, action) => {
      state.saveLoadingState = "success";
      state.siteData = action.payload;
    });
});
```

**When to use createSlice (LEGACY)**:

Only when maintaining existing features that already use it. Example: [projects/core/reconversionProjectsList.reducer.ts](src/features/projects/core/reconversionProjectsList.reducer.ts)

```typescript
// ⚠️ LEGACY - Only for existing code
const reconversionProjectsList = createSlice({
  name: "reconversionProjectsList",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchReconversionProjects.fulfilled, (state, action) => {
      state.reconversionProjects = action.payload;
    });
  },
});

export const reconversionProjectsListReducer = reconversionProjectsList.reducer;
```

**Loading State Pattern**:

```typescript
type LoadingState = "idle" | "loading" | "success" | "error";

// In reducer
.addCase(fetchData.pending, (state) => {
  state.loadingState = "loading";
})
.addCase(fetchData.fulfilled, (state, action) => {
  state.loadingState = "success";
  state.data = action.payload;
})
.addCase(fetchData.rejected, (state) => {
  state.loadingState = "error";
})
```

**Example**: [create-site/core/createSite.reducer.ts](src/features/create-site/core/createSite.reducer.ts)

### Selectors

**Use `createSelector` for memoization**:

```typescript
import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/shared/core/store-config/store";

// Base selector
const selectSelf = (state: RootState) => state.siteCreation;

// Derived selector
export const selectSiteAddress = createSelector(
  selectSelf,
  (state): Address | undefined => state.siteData.address,
);

// Selector with parameter
export const selectReconversionProjectById = createSelector(
  [selectSelf, (_state: RootState, projectId: string) => projectId],
  (state, projectId) => {
    return state.reconversionProjects
      .flatMap((group) => group.reconversionProjects)
      .find((project) => project.id === projectId);
  },
);

// Composed selectors (reuse existing selectors)
export const selectComparableProjects = createSelector(
  [selectSelf, selectReconversionProjectById],
  (state, project) => {
    if (!project) return [];
    return (
      state.reconversionProjects
        .find((group) => group.siteId === project.site.id)
        ?.reconversionProjects.filter((p) => p.id !== project.id) ?? []
    );
  },
);
```

#### ViewData Pattern for Container Components

**IMPORTANT**: Container components should access state through **a single selector** that exposes a `ViewData` object. This pattern:

- Centralizes all data transformations in one place
- Makes containers simpler (one selector call)
- Enables better memoization
- Provides clear contract between state and UI

**Pattern**:

```typescript
// Define ViewData type
type SiteYearlyExpensesViewData = {
  siteNature: SiteNature;
  hasTenant: boolean;
  estimatedAmounts: EstimatedSiteYearlyExpensesAmounts;
  managementExpensesConfig: SiteManagementYearlyExpensesConfig;
  securityExpensesConfig: FricheSecurityYearlyExpensesConfig;
};

// Create ViewData selector composing other selectors
export const selectSiteYearlyExpensesViewData = createSelector(
  [
    selectSiteData,
    selectEstimatedYearlyExpensesForSite,
    selectSiteManagementExpensesConfig,
    selectSiteSecurityExpensesConfig,
  ],
  (
    siteData,
    estimatedYearlyExpenses,
    managementExpensesConfig,
    securityExpensesConfig,
  ): SiteYearlyExpensesViewData => {
    return {
      siteNature: siteData.nature!,
      hasTenant: !!siteData.tenant,
      estimatedAmounts: estimatedYearlyExpenses,
      managementExpensesConfig,
      securityExpensesConfig,
    };
  },
);
```

**Usage in Container**:

```typescript
// Container component
function SiteYearlyExpensesFormContainer() {
  const dispatch = useAppDispatch();

  // ✅ CORRECT - Single ViewData selector
  const viewData = useAppSelector(selectSiteYearlyExpensesViewData);

  return (
    <SiteYearlyExpensesForm
      siteNature={viewData.siteNature}
      hasTenant={viewData.hasTenant}
      estimatedAmounts={viewData.estimatedAmounts}
      managementExpensesConfig={viewData.managementExpensesConfig}
      securityExpensesConfig={viewData.securityExpensesConfig}
      onSubmit={(data) => dispatch(yearlyExpensesCompleted(data))}
    />
  );
}

// ❌ WRONG - Multiple selector calls
function SiteYearlyExpensesFormContainer() {
  const siteData = useAppSelector(selectSiteData);
  const estimatedAmounts = useAppSelector(selectEstimatedYearlyExpensesForSite);
  const managementConfig = useAppSelector(selectSiteManagementExpensesConfig);
  // ... more selectors
}
```

**Real Examples**:

- [create-site/core/selectors/expenses.selectors.ts](src/features/create-site/core/selectors/expenses.selectors.ts) - `selectSiteYearlyExpensesViewData`
- [create-site/core/selectors/spaces.selectors.ts](src/features/create-site/core/selectors/spaces.selectors.ts) - `selectSiteSoilsDistributionViewData`

**Example**: [create-site/core/selectors](src/features/create-site/core/selectors/)

### Listener Middleware (Side Effects)

**Use for cross-cutting concerns**: analytics, logging, navigation, etc.

```typescript
import { createListenerMiddleware } from "@reduxjs/toolkit";

import type { AppStartListening } from "@/shared/core/store-config/listenerMiddleware";

export function setupSiteCreationListeners(startAppListening: AppStartListening) {
  // Example: Navigate on successful save
  startAppListening({
    actionCreator: customSiteSaved.fulfilled,
    effect: async (action, listenerApi) => {
      const { siteId } = action.payload;
      listenerApi.extra.navigationService.navigate(`/sites/${siteId}`);
    },
  });

  // Example: Track analytics event
  startAppListening({
    actionCreator: introductionStepCompleted,
    effect: async (action, listenerApi) => {
      listenerApi.extra.analyticsService.trackEvent("site_creation_started");
    },
  });
}
```

**Register in**: [shared/core/store-config/listenerMiddleware.ts](src/shared/core/store-config/listenerMiddleware.ts)

---

## 🧩 Component Patterns

### Container/Presentational Pattern

**ALWAYS separate containers (smart) from presentational (dumb) components**.

**Container Component** (connects to Redux):

- Location: `views/feature-name/index.tsx`
- Uses `useAppSelector` (single ViewData selector), `useAppDispatch`
- Fetches state, dispatches actions, passes props to presentational

**Presentational Component** (pure React):

- Location: `views/feature-name/ComponentName.tsx`
- No Redux dependencies, receives all data via props

```typescript
// Container
function FormContainer() {
  const dispatch = useAppDispatch();
  const viewData = useAppSelector(selectFormViewData); // ✅ Single ViewData selector

  return <Form {...viewData} onSubmit={(data) => dispatch(stepCompleted(data))} />;
}

// Presentational
export function Form({ initialValues, onSubmit }: Props) {
  const { register, handleSubmit } = useForm({ defaultValues: initialValues });
  return <form onSubmit={handleSubmit(onSubmit)}>{/* ... */}</form>;
}
```

**Full example**: [create-site/views](src/features/create-site/views/)

### Typed Redux Hooks

**ALWAYS use typed hooks** from [shared/views/hooks/store.hooks.ts](src/shared/views/hooks/store.hooks.ts):

```typescript
import { useAppDispatch, useAppSelector } from "@/shared/views/hooks/store.hooks";

// ✅ CORRECT - Fully typed
const dispatch = useAppDispatch();
const siteData = useAppSelector((state) => state.siteCreation.siteData);

// ❌ WRONG - Untyped
import { useDispatch, useSelector } from "react-redux";
const dispatch = useDispatch(); // Not typed with AppDispatch
```

### Form Handling

**Library**: `react-hook-form` with DSFR `Input` components

```typescript
function MyForm({ initialValues, onSubmit }: Props) {
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: initialValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Nom"
        state={formState.errors.name ? "error" : "default"}
        stateRelatedMessage={formState.errors.name?.message}
        nativeInputProps={register("name", { required: "Ce champ est requis" })}
      />
      <Button type="submit">Valider</Button>
    </form>
  );
}
```

---

## 🌐 API Integration (Gateway Pattern)

**Follow Ports & Adapters**: Define interface in core, implement HTTP + InMemory in infrastructure, inject via store.

```typescript
// 1. Define interface in core
export interface FeatureGateway {
  save(data: Payload): Promise<void>;
}

// 2. Implement in infrastructure
export class HttpFeatureApi implements FeatureGateway {
  async save(data: Payload): Promise<void> {
    const response = await fetch(`/api${API_ROUTES.path}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Save failed");
  }
}

export class InMemoryFeatureService implements FeatureGateway {
  private items: Payload[] = [];
  async save(data: Payload): Promise<void> {
    this.items.push(data);
  }
}

// 3. Inject & use
const appDependencies = { featureService: new HttpFeatureApi() };
const store = createStore(appDependencies);

export const dataSaved = createAppAsyncThunk(
  "feature/saved",
  async (_, { extra }) => await extra.featureService.save(payload),
);
```

**Example**: [create-site/infrastructure/create-site-service](src/features/create-site/infrastructure/create-site-service/)

---

## 🧪 Testing Strategy

### Test Organization

```
feature/
├── core/
│   ├── __tests__/                   # Reducer/selector tests
│   │   └── featureName.spec.ts
│   └── featureName.reducer.ts
└── views/
    └── ComponentName.spec.tsx       # Component tests
```

### Testing Stack

- **Framework**: Vitest
- **React Testing**: `@testing-library/react` + `@testing-library/jest-dom`
- **Setup**: [test/setupTestEnv.ts](src/test/setupTestEnv.ts)

### Builder Pattern for Test Data

**IMPORTANT**: Use **Builder pattern** for test data - more readable and maintainable.

```typescript
// test/builders/StoreBuilder.ts
export class StoreBuilder {
  private stepsHistory: SiteCreationStep[] = ["INTRODUCTION"];
  private siteData: Partial<SiteCreationData> = {};

  withStepsHistory(steps: SiteCreationStep[]): this {
    this.stepsHistory = steps;
    return this;
  }

  withSiteData(data: Partial<SiteCreationData>): this {
    this.siteData = data;
    return this;
  }

  build() {
    return createStore(getTestAppDependencies(), {
      siteCreation: { stepsHistory: this.stepsHistory, siteData: this.siteData },
    });
  }
}

// Usage
const store = new StoreBuilder()
  .withStepsHistory(["INTRODUCTION"])
  .withSiteData({ isFriche: true })
  .build();

store.dispatch(stepCompleted());
expect(store.getState().siteCreation.stepsHistory).toEqual(["INTRODUCTION", "IS_FRICHE"]);
```

### Test Utilities & Patterns

```typescript
// Test dependencies with InMemory services
export const getTestAppDependencies = (overrides = {}) => ({
  featureService: new InMemoryFeatureService(),
  ...overrides, // ✅ Override specific services
});

// Reducer test
describe("Feature reducer", () => {
  it("handles action correctly", () => {
    const store = new StoreBuilder().withStepsHistory(["STEP_1"]).build();
    store.dispatch(actionCompleted({ payload: "data" }));
    expect(store.getState().feature.someProperty).toBe("data");
  });
});

// Component test
describe("MyForm", () => {
  it("calls onSubmit with form data", async () => {
    const onSubmit = vi.fn();
    render(<MyForm initialValues={{ name: "" }} onSubmit={onSubmit} />);

    fireEvent.change(screen.getByLabelText(/nom/i), { target: { value: "Test" } });
    fireEvent.click(screen.getByRole("button", { name: /valider/i }));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ name: "Test" }));
  });
});
```

**Examples**: [create-site/core/**tests**](src/features/create-site/core/__tests__/)

---

## 🚦 Routing

**Library**: `type-route` (type-safe routing). See [shared/views/router.ts](src/shared/views/router.ts)

```typescript
const { RouteProvider, useRoute, routes } = createRouter({
  home: defineRoute("/"),
  projectImpacts: defineRoute(
    { projectId: param.path.string },
    (params) => `/mes-projets/${params.projectId}/impacts`
  ),
});

function App() {
  const route = useRoute();
  return (
    <RouteProvider>
      {route.name === routes.home.name && <HomePage />}
      {route.name === routes.projectImpacts.name && (
        <ProjectImpactsPage projectId={route.params.projectId} />
      )}
    </RouteProvider>
  );
}

// Lazy loading
const Page = lazy(() => import("@/features/..."));
<Suspense fallback={<LoadingSpinner />}><Page /></Suspense>
```

---

## 🎨 Styling

- **Tailwind CSS** (v4+): Utility classes in JSX - `className="flex flex-col gap-4"`
- **DSFR** (`@codegouvfr/react-dsfr`): French Government Design System components - `Input`, `Button`, `Select`, `Alert`

---

## 🔧 Development Workflow

### Common Commands

```bash
# Start dev server (port 3000)
pnpm --filter web dev

# Run all tests
pnpm --filter web test

# Run tests in watch mode
pnpm --filter web test -- --watch

# Run specific test file
pnpm --filter web test path/to/file.spec.ts

# Type check
pnpm --filter web typecheck

# Lint
pnpm --filter web lint

# Build for production
pnpm --filter web build
```

### Quality Checklist (After Code Changes)

When you modify web app code, **ALWAYS run these checks in order**:

1. **Type check**: `pnpm --filter web typecheck`
2. **Lint**: `pnpm --filter web lint`
3. **Tests**: `pnpm --filter web test path/to/modified/file.spec.ts`

**If you modified `shared` package**: Also run `pnpm --filter shared build` first, then run web checks.

---

## 🤖 AI Assistant Workflow

### When Creating a New Feature

**Follow these steps** (all patterns detailed in sections above):

1. **Create feature structure**: `core/`, `infrastructure/`, `views/` folders
2. **Define actions** (passive tense) & reducer (use `createReducer`)
3. **Define gateway interface** in core
4. **Implement HTTP & InMemory** adapters in infrastructure
5. **Create ViewData selector** (single selector for container)
6. **Create container + presentational** components
7. **Write tests** with Builder pattern
8. **Register reducer** in `rootReducer.ts`
9. **Inject services** in `appDependencies.ts` and `testAppDependencies.ts`
10. **Run quality checks**: `typecheck`, `lint`, `test`

---

### Key Patterns Summary

**DO**:

- ✅ Use `createReducer` for all new features (createSlice is legacy)
- ✅ Use Builder pattern for test data
- ✅ Name actions in passive tense (e.g., `stepCompleted`, not `completeStep`)
- ✅ Use ViewData pattern: one selector per container exposing a `*ViewData` object
- ✅ Separate container (Redux) from presentational (UI) components
- ✅ Define gateway interfaces in core, implement in infrastructure
- ✅ Use `createAppAsyncThunk` for async actions
- ✅ Use `createSelector` for derived state
- ✅ Inject services via `extraArgument` in store config
- ✅ Use typed hooks: `useAppSelector`, `useAppDispatch`
- ✅ Follow feature-based folder structure

**DON'T**:

- ❌ Don't refactor Redux to other state management (it's event-based by design)
- ❌ Don't use `createSlice` for new features (legacy pattern)
- ❌ Don't name actions as commands (e.g., `fetchData`) - use past tense (`dataFetched`)
- ❌ Don't call multiple selectors in containers - use one ViewData selector
- ❌ Don't access Redux store directly in views (use hooks)
- ❌ Don't import infrastructure in core (violates Clean Architecture)
- ❌ Don't skip InMemory implementations (needed for tests)
- ❌ Don't create tests without Builder pattern

---

## 📚 Related Documentation

- **Monorepo Guide**: [/CLAUDE.md](../../CLAUDE.md) - Workspace commands, quality standards, Git workflow
- **API Guide**: [apps/api/CLAUDE.md](../api/CLAUDE.md) - Backend patterns, database migrations
- **Shared Package**: `packages/shared/` - Domain types, API routes, utilities

---

## 🔄 Maintaining This Guide

Update this guide when:

- New architectural patterns are introduced
- Redux patterns evolve
- New testing utilities are added
- Component patterns change
- Major library updates (React, Redux Toolkit)

**Current versions**: React 18+, Redux Toolkit 2+, Vite 6+, TypeScript 5+
