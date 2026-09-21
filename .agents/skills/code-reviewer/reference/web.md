# Web Review Lenses

Applies to changes under `apps/web/**`. Full patterns live in [`apps/web/CLAUDE.md`](../../../../apps/web/CLAUDE.md) (auto-loads when you Read the changed file). This file is the review checklist.

## Contents
- Clean Architecture (CRITICAL)
- Redux architecture (CRITICAL)
- Container / Presentational (HIGH)
- Redux hooks (HIGH)
- Gateway (HIGH)
- Naming (HIGH)
- Testing mechanics (HIGH)

## Clean Architecture (CRITICAL)
*Why:* keeping business logic out of `infrastructure/` and `views/` is what lets `core/` be unit-tested without a DOM or network.
- ❌ `core/` importing from `infrastructure/` or `views/`
- ❌ Presentational components containing business logic
- ✅ Core imports only from `core/` or `"shared"`

## Redux architecture (CRITICAL — ESTABLISHED pattern)
*Why:* the event-based `createReducer` + passive-action pattern is established project-wide; mixing in `createSlice` or imperative actions fragments the store's mental model and blocks refactors.
- ❌ Refactoring Redux to another state manager (Zustand, Jotai, MobX)
- ❌ `createSlice` in new code (legacy — maintenance only)
- ❌ Imperative action names (`completeStep`, `fetchData`)
- ✅ Event-based Redux with `createReducer`; passive action names (`stepCompleted`, `dataFetched`)

## Container / Presentational (HIGH)
- ❌ Multiple `useAppSelector` calls in a container
- ❌ Selectors not following `select{Feature}ViewData`
- ❌ Presentational components using Redux hooks
- ✅ Single ViewData selector per container; presentational components receive all data via props

## Redux hooks (HIGH)
- ❌ Untyped `useSelector`/`useDispatch` from `react-redux`
- ✅ `useAppSelector`/`useAppDispatch` from `@/shared/views/hooks/store.hooks`

## Gateway (HIGH)
- ❌ HTTP service without an InMemory mock implementation
- ❌ Not validating request/response DTOs with Zod `safeParse()` (shared schemas)
- ❌ Service not registered in the store's `extraArgument`; thunks not accessing services via `extra`
- Reference: `src/features/onboarding/infrastructure/create-user-service/HttpCreateUserService.ts`

## Naming (HIGH)
- ❌ Imperative actions (use passive: `stepCompleted`); selectors not `select{Feature}ViewData`; `createSlice` in new code
- ❌ Relative `../../../` for cross-feature imports (use `@/`); `@/` for shared package (use `"shared"`)
- ✅ `@/` within web app; `"shared"` for the package; relative `./`/`../` only within the same feature folder

## Testing mechanics (HIGH)
For design smells (behaviour vs implementation) see [`reference/cross-cutting.md`](cross-cutting.md).
- ❌ Unit tests using HTTP services (use InMemory)
- ❌ Not using the builder pattern for test state; hardcoded test state
- ✅ `StoreBuilder` for setup; InMemory services for all external dependencies
- Reference: `src/features/create-project/core/urban-project/__tests__/_testStoreHelpers.ts`
