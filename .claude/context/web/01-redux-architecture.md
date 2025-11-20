# Redux Event-Based Architecture

> **Purpose**: Detailed Redux patterns for state management, actions, reducers, selectors, and side effects.

---

## 🔄 Redux Event-Based Architecture

**IMPORTANT**: Redux is the established state management pattern. This is an **event-based architecture** where actions represent domain events. Do NOT attempt to change this architecture.

---

## 🏪 Store Setup with Dependency Injection

**Location**: [shared/core/store-config/store.ts](../../src/shared/core/store-config/store.ts)

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

---

## ✉️ Actions

### Action Naming Convention (CRITICAL)

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

### Sync Actions with `createAction`

```typescript
import { createAction } from "@reduxjs/toolkit";

export const introductionStepCompleted = createAction("siteCreation/introduction/completed");

export const namingStepCompleted = createAction<{
  name: string;
  description?: string;
}>("siteCreation/naming/completed");
```

### Async Actions with `createAppAsyncThunk`

Use `createAppAsyncThunk` for async actions with typed dependencies:

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

**Example**: [create-site/core/actions](../../src/features/create-site/core/actions/)

---

## 🔄 Reducers

### Use `createReducer` for New Features (PREFERRED)

**IMPORTANT**: Use `createReducer` for all **new features**. `createSlice` is **legacy** and should only be used for maintaining existing code.

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

### Legacy `createSlice` (Maintenance Only)

Only use when maintaining existing features that already use it. Example: [projects/core/reconversionProjectsList.reducer.ts](../../src/features/projects/core/reconversionProjectsList.reducer.ts)

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

### Loading State Pattern

Standard loading state management:

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

### State Shape Patterns

There are two approaches for managing state with async data:

#### Simple Loading States (Current Standard)

Keep `loadingState` separate from data:

```typescript
type State = {
  evaluationResults: EvaluationResults | undefined;
  evaluationLoadingState: LoadingState; // "idle" | "loading" | "success" | "error"
  error: string | undefined;
};

// In reducer
.addCase(evaluationStarted.pending, (state) => {
  state.evaluationLoadingState = "loading";
})
.addCase(evaluationStarted.fulfilled, (state, action) => {
  state.evaluationLoadingState = "success";
  state.evaluationResults = action.payload;
})
```

**Current practice in**: [reconversion-compatibility](../../src/features/reconversion-compatibility/core/reconversionCompatibilityEvaluation.reducer.ts)

#### Discriminated Union State (Objective Standard)

Use discriminated unions where `loadingState` discriminates the entire state shape:

```typescript
// OBJECTIVE: Move toward this pattern for better type safety
type SiteViewState = {
  byId: Record<
    string,
    | { loadingState: "idle" | "loading" | "error"; data: SiteView | undefined }
    | { loadingState: "success"; data: SiteView }
  >;
};
```

**Benefits**:
- TypeScript guarantees: when `loadingState === 'success'`, `data` is **always** defined (never undefined)
- Prevents bugs where you check loading state but access potentially undefined data
- Useful for caching per-ID data (e.g., `byId` records for multiple resources)

**Current use**: [site-features/core/siteView.reducer.ts](../../src/features/site-features/core/siteView.reducer.ts)

**Recommendation**: Discriminated unions are the objective standard for type safety. Simple loading states are acceptable for now, but prefer discriminated unions in new code when managing multiple resources by ID.

---

## 🔍 Selectors

### Basic Selector with `createSelector`

Use `createSelector` for memoization:

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
```

### Selector with Parameter

```typescript
export const selectReconversionProjectById = createSelector(
  [selectSelf, (_state: RootState, projectId: string) => projectId],
  (state, projectId) => {
    return state.reconversionProjects
      .flatMap((group) => group.reconversionProjects)
      .find((project) => project.id === projectId);
  },
);
```

### Composed Selectors (Reuse Existing Selectors)

```typescript
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

---

## 📊 ViewData Pattern for Container Components (STANDARD)

**Container components should access state through a single selector** that exposes a composed `ViewData` object. This pattern:

- Centralizes all data transformations in one place
- Makes containers simpler and more performant (one selector call vs. many)
- Enables better memoization and prevents unnecessary re-renders
- Provides clear contract between state and UI

### Naming Convention

Selectors should be named: **`select{FeatureName}ViewData`**

Examples:
- `selectReconversionCompatibilityViewData`
- `selectSiteYearlyExpensesViewData`
- `selectProjectDetailsViewData`

### Pattern

```typescript
// 1. Define the ViewData type
type ReconversionCompatibilityViewData = {
  evaluationResults: ReconversionCompatibilityEvaluationResults | undefined;
  isAnalysisComplete: boolean;
  evaluationError: string | undefined;
  evaluationResultsLoadingState: LoadingState;
  // ... all data needed by the page
};

// 2. Create ViewData selector by composing other selectors
export const selectReconversionCompatibilityViewData = createSelector(
  [
    selectEvaluationResults,
    selectIsAnalysisComplete,
    selectEvaluationError,
    selectEvaluationLoadingState,
  ],
  (results, isComplete, error, loadingState): ReconversionCompatibilityViewData => ({
    evaluationResults: results,
    isAnalysisComplete: isComplete,
    evaluationError: error,
    evaluationResultsLoadingState: loadingState,
  }),
);
```

### Usage in Container

```typescript
// Container component
function ReconversionCompatibilityPageContainer() {
  const dispatch = useAppDispatch();

  // ✅ CORRECT - Single ViewData selector
  const viewData = useAppSelector(selectReconversionCompatibilityViewData);

  return (
    <ReconversionCompatibilityPage
      viewData={viewData}
      onEvaluate={(data) => dispatch(evaluationRequested(data))}
    />
  );
}

// ❌ AVOID - Multiple selector calls in container
function ReconversionCompatibilityPageContainer() {
  const results = useAppSelector(selectEvaluationResults);
  const isComplete = useAppSelector(selectIsAnalysisComplete);
  const error = useAppSelector(selectEvaluationError);
  // ... more selectors - causes extra re-renders!
}
```

**Real Example**: [reconversion-compatibility/core/selectors](../../src/features/reconversion-compatibility/core/reconversionCompatibilityEvaluation.selectors.ts) - `selectReconversionCompatibilityViewData`

---

## 🎯 Side Effects: useEffect vs Listener Middleware

### Component-Level Side Effects (`useEffect`)

Most side effects should be handled in components with `useEffect`. This is appropriate for:
- Local UI concerns (scroll positioning, focus, animations)
- Event handling (window events, element listeners)
- Dispatching actions on component mount or when data changes
- Cleanup operations (timers, subscriptions)

**Example**: Handling iframe messages and dispatching Redux actions

```typescript
function EvaluatePageContainer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      dispatch(evaluationCompleted(event.data));
    };

    window.addEventListener("message", handleMessage);
    void dispatch(evaluationStarted()); // Dispatch on mount

    return () => window.removeEventListener("message", handleMessage); // Cleanup
  }, [dispatch]);

  // ... render component
}
```

### Listener Middleware (Redux-Level Side Effects)

Use **sparingly** for specific cases where a Redux action should trigger logic:

```typescript
import { createListenerMiddleware } from "@reduxjs/toolkit";
import type { AppStartListening } from "@/shared/core/store-config/listenerMiddleware";

export function setupSiteCreationListeners(startAppListening: AppStartListening) {
  // Example: Cancel previous listeners when user cancels
  startAppListening({
    actionCreator: stepRevertAttempted,
    effect: async (_action, listenerApi) => {
      listenerApi.cancelActiveListeners();
      listenerApi.dispatch(stepRevertConfirmed());
    },
  });
}
```

**When to use listener middleware:**
- Triggered when a **specific Redux action** is dispatched
- Useful for canceling previous effects or coordinating multiple actions
- **NOT the common pattern** - use component `useEffect` first

**Register listeners in**: [shared/core/store-config/listenerMiddleware.ts](../../src/shared/core/store-config/listenerMiddleware.ts)

---

**Next**: See [02-component-patterns.md](./02-component-patterns.md) for component architecture and [03-api-integration.md](./03-api-integration.md) for gateway patterns.
