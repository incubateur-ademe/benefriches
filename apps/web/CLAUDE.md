# Benefriches Web App - Quick Reference

> React SPA with Redux event-based architecture + Clean Architecture

**⚠️ Redux is ESTABLISHED**: This codebase uses Redux as an event-based architecture. Do NOT refactor to other state management solutions (Zustand, Jotai, etc.). Work with the existing patterns.

---

## Quality Guards (ALWAYS RUN)

```bash
pnpm --filter web typecheck && pnpm --filter web lint && pnpm --filter web test
```

**If modifying `shared` package**: Run `pnpm --filter web install` first (auto-builds shared), then web checks.

---

## Architecture Rules

- **Clean Architecture**: Core has NO dependencies on infrastructure or views
- **Dependency rule**: Infrastructure and views depend on core, never the reverse

---

## Canonical Pattern Examples

| Pattern                  | Reference File                                                                                                   |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| ViewData Selector        | `src/features/create-project/core/createProject.selectors.ts`                                                    |
| Async Thunk              | `src/features/create-project/core/urban-project/fetchEstimatedSiteResalePrice.action.ts`                         |
| Reducer (createReducer)  | `src/features/create-site/core/createSite.reducer.ts`                                                            |
| Container Component      | `src/features/create-project/views/photovoltaic-power-station/custom-form/stakeholders/site-purchased/index.tsx` |
| Gateway Interface        | `src/shared/core/gateways/RealEstateValuationGateway.ts`                                                         |
| HTTP POST implementation | `src/features/onboarding/infrastructure/create-user-service/HttpCreateUserService.ts`                            |
| HTTP GET implementation  | `src/features/onboarding/infrastructure/current-user-service/HttpCurrentUserService.ts`                          |
| InMemory Mock            | `src/shared/infrastructure/real-estate-valuation-service/InMemoryRealEstateValuationService.ts`                  |
| Test with Store Helper   | `src/features/create-project/core/urban-project/__tests__/steps/site-resale/siteResaleSelection.step.spec.ts`    |
| Test Store Helper        | `src/features/create-project/core/urban-project/__tests__/_testStoreHelpers.ts`                                  |
| Listener Middleware      | `src/features/create-project/core/listeners/projectCreationListeners.ts`                                         |

---

## Naming Conventions

- **Actions**: Passive tense (events): `stepCompleted`, `dataFetched` (NOT `completeStep`, `fetchData`)
- **Selectors**: `select{Feature}ViewData` - one per container returning composed object
- **Reducers**: Use `createReducer` for new code (`createSlice` is legacy - maintenance only)

---

## Key Patterns

### Container/Presentational Separation

- **Container** (`index.tsx`): Connects Redux, uses single ViewData selector, dispatches actions
- **Presentational**: Receives all data via props, no Redux dependencies

### ViewData Pattern

Container components access state through a **single selector** returning a composed `ViewData` object:

```typescript
const dispatch = useAppDispatch();
const viewData = useAppSelector(selectFeatureViewData);
return <FeaturePage viewData={viewData} onAction={(data) => dispatch(actionCompleted(data))} />;
```

### Gateway Pattern

1. **Interface** in `core/gateways/` - defines what domain needs
2. **HTTP implementation** in `infrastructure/*/Http*Service.ts` - real API calls
3. **InMemory mock** in `infrastructure/*/InMemory*Service.ts` - required for tests
4. **Register in store** via `extraArgument` for thunk access

**DTO Validation**: HTTP services should validate request/response bodies using shared Zod schemas from `"shared"` with `safeParse()`. See `src/features/onboarding/infrastructure/create-user-service/HttpCreateUserService.ts` for reference.

### Dependency Injection

Services injected via store's `extraArgument`, accessed in thunks as `extra`:

```typescript
const result = await extra.featureService.doSomething(payload);
```

### Testing

- **Builder pattern** for test state: `new StoreBuilder().withSiteData({...}).build()`
- **InMemory services** for dependencies (no HTTP in unit tests)

### Side Effects

- Use `useEffect` in components for most side effects
- Use listener middleware sparingly for specific Redux action side effects

---

## Creation Checklists

### Container Component Checklist

When creating a new container component:

1. **Create ViewData selector** in the relevant selectors file:
   - Define typed `{Feature}ViewData` type with all data the container needs
   - Create `select{Feature}ViewData` selector composing data from state
   - Export the selector (directly, or via factory function for urban project forms)

2. **Create container** (`index.tsx`):
   - Get selector via direct import or hook (`useProjectForm()` for urban project forms)
   - Use single `useAppSelector(select{Feature}ViewData)` call
   - Destructure ViewData and pass to presentational component
   - Handle actions with `useAppDispatch`

3. **Reference examples** (simplest first):
   - `src/features/create-project/core/createProject.selectors.ts` → `selectProjectSuggestionsViewData`
   - `src/features/create-project/views/project-suggestions/index.tsx`
   - `src/features/create-site/core/selectors/spaces.selectors.ts` → `selectSiteSoilsSummaryViewData`
   - `src/features/create-site/views/custom/spaces-and-soils/soils-summary/index.tsx`
   - Urban project form (factory pattern):
     - `src/shared/core/reducers/project-form/urban-project/urbanProject.selectors.ts` → `selectUsesFootprintSurfaceAreaViewData`
     - `src/shared/views/project-form/urban-project/uses/footprint-surface-area/index.tsx`

### Gateway Checklist

When adding a new external service integration:

1. **Create interface** in `core/gateways/` - define methods the domain needs
2. **Create HTTP implementation** in `infrastructure/*/Http*Service.ts` - real API calls
3. **Create InMemory mock** in `infrastructure/*/InMemory*Service.ts` - required for tests
4. **Register in store** via `extraArgument` for thunk access

---

## Import Conventions

| Import Type             | Pattern       | Example                                                             |
| ----------------------- | ------------- | ------------------------------------------------------------------- |
| **Within web app**      | `@/` alias    | `import { useAppSelector } from "@/shared/views/hooks/store.hooks"` |
| **From shared package** | `shared`      | `import type { GetSiteViewResponseDto } from "shared"`              |
| **Relative**            | `./` or `../` | Only within same feature folder                                     |

---

## Critical DON'Ts

- **Don't use `createSlice`** for new code (legacy - maintenance only)
- **Don't call multiple selectors** in containers (compose into single ViewData selector)
- **Don't import infrastructure in core** (violates Clean Architecture)
- **Don't skip InMemory implementations** (required for tests)
- **Don't use untyped Redux hooks** - always use `useAppSelector`/`useAppDispatch` from `@/shared/views/hooks/store.hooks`

---

## Feature Structure

```
feature-name/
├── core/
│   ├── feature.types.ts           # Type definitions (single source of truth)
│   ├── featureName.reducer.ts     # Reducer using createReducer
│   ├── featureName.selectors.ts   # Selectors including ViewData
│   ├── actions/*.ts               # Action creators (passive tense)
│   └── __tests__/*.spec.ts        # Unit tests
├── infrastructure/
│   └── feature-service/
│       ├── HttpFeatureService.ts      # HTTP implementation
│       └── InMemoryFeatureService.ts  # Test mock (required)
└── views/
    ├── index.tsx                  # Container (Redux-connected)
    └── FeaturePage.tsx            # Presentational component
```

---

## Tech Stack

React 19+, Redux Toolkit 2+, Vite 7+, TypeScript 5+ (strict), Tailwind CSS + DSFR, type-route, react-hook-form

---

## Performance Optimization

For React performance best practices, see the skill: `.claude/skills/react-best-practices/`

**Key areas covered** (31 applicable practices):

- 🔴 **Bundle optimization** - Lazy loading, dynamic imports, avoid barrel files
- 🟠 **Async/waterfall** - Promise.all(), suspense boundaries, conditional module loading
- 🟡 **Array/data** - Use toSorted() for immutability (critical for Redux!)
- 🟢 **Re-render optimization** - React.memo, useTransition, derived state in selectors
- 🔵 **Client data** - Passive listeners, localStorage versioning
- ⚫ **Rendering** - Hoist static JSX, CSS content-visibility for long lists
- ⚪ **JavaScript** - Caching, Set/Map for O(1) lookups, avoid layout thrashing

---

## Related Documentation

- **Monorepo Guide**: @CLAUDE.md
- **API Guide**: @apps/api/CLAUDE.md
- **Feature Example**: @docs/feature-example.md
- **Performance**: @.claude/skills/react-best-practices/SKILL.md
