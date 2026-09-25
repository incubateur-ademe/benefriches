# Benefriches Web

React SPA (Vite, Redux Toolkit, DSFR) in Clean Architecture. Each feature lives in `src/features/<feature>/` with three layers: `core/` (state, events, selectors, gateway interfaces), `infrastructure/` (gateway implementations) and `views/` (React). Cross-feature code has the same layers in `src/shared/`, and `src/app/` is the composition root (store, router, production dependencies). Imports between layers are checked by the `architecture-boundaries` lint rule ([.oxlintrc.json](.oxlintrc.json)).

`my-evaluations` and `projects` still name part of their core layer `application/` (they also have `core/`): legacy naming, use `core/` in new code. Most features use `infrastructure/`; `sites` and `reconversion-compatibility` use `infra/` instead (lint accepts both) — use `infrastructure/` in new code.

## Checks

Before handing work back, run `pnpm --filter web typecheck && pnpm --filter web lint && pnpm --filter web test && pnpm --filter web format:check`. `format:check` covers every `.md` under `apps/web`, this file included.

## Redux: events, not commands

Redux stays the state manager ([ADR-0002](../../docs/adr/0002-redux-event-based-state-management.md)): don't move state to Zustand, Jotai or React context.

- Name actions and thunks after what happened: `createModeCompleted`, `siteUpdateSaved`, `authLinkRequested`, not `completeCreateMode`. Older thunks such as `fetchSiteView` or `saveReconversionProject` predate the rule; don't copy their names.
- Use `useAppSelector` / `useAppDispatch` from [store.hooks.ts](src/app/hooks/store.hooks.ts), not the untyped `react-redux` hooks.
- Listener middleware is for effects triggered by another action, e.g. fetching the resale price when a step is answered "unknown" ([projectCreationListeners.ts](src/features/create-project/core/listeners/projectCreationListeners.ts)). Keep it for those.

## Containers and ViewData

- A container (`views/**/index.tsx`) reads the store through one selector, `select{Feature}ViewData`, which returns everything the view needs. It dispatches events and passes data and callbacks to a presentational component, which never touches Redux.
- ViewData selectors live in `core/`, never in `views/`.
- Simplest pair: `selectUseCaseCreateModeViewData` in [useCaseSelection.selectors.ts](src/features/create-project/core/usecase-selection/useCaseSelection.selectors.ts) and its container [create-mode-selection/index.tsx](src/features/create-project/views/usecase-selection/create-mode-selection/index.tsx). Wizard step containers get their selectors from the form hook instead (`useProjectForm()`, `useRenewableEnergyForm()`, `useCustomSiteForm()`, `useUrbanZoneSiteForm()`).

## Multi-step forms

The project and site forms run on one engine, `src/shared/core/wizard-form/` ([ADR-0015](../../docs/adr/0015-extract-wizard-form-engine-via-injected-lens.md)): urban and photovoltaic project creation and update, and site creation/update (`features/create-site/core/{custom,urban-zone,demo}`, `features/update-site/core`). Two flows are exceptions with their own small step reducers, not the engine: `create-project/core/usecase-selection` and `create-project/core/demo`. Before adding or changing a step or a flow, use the `wizard-form` skill: it explains the engine, the handler contract, the create/update lens, and how to add a step or a form.

## Gateways and external services

Everything the app calls outside itself goes through a gateway:

1. An interface in `core/` with only the methods the domain needs, e.g. [RealEstateValuationGateway.ts](src/shared/core/gateways/RealEstateValuationGateway.ts).
2. An `Http*Service` in `infrastructure/<service>/`. New services validate the request and response bodies with the shared Zod schemas (`safeParse()`), as [HttpCreateUserService.ts](src/features/onboarding/infrastructure/create-user-service/HttpCreateUserService.ts) and [HttpCurrentUserService.ts](src/features/onboarding/infrastructure/current-user-service/HttpCurrentUserService.ts) do; most older services don't yet.
3. An `InMemory*Service` next to it for tests, e.g. [InMemoryRealEstateValuationService.ts](src/shared/infrastructure/real-estate-valuation-service/InMemoryRealEstateValuationService.ts).
4. A key in `AppDependencies` ([store.ts](src/app/store/store.ts)), the real service in [appDependencies.ts](src/app/store/appDependencies.ts), the InMemory one in [testAppDependencies.ts](src/test/testAppDependencies.ts). Thunks (`createAppAsyncThunk`) reach it as `extra.<service>`, as in [fetchEstimatedSiteResalePrice.action.ts](src/features/create-project/core/urban-project/fetchEstimatedSiteResalePrice.action.ts).

Third-party browser SDKs (Crisp in `features/support/`, Matomo in `features/analytics/`) follow the same shape ([ADR-0005](../../docs/adr/0005-gateway-pattern-for-third-party-browser-sdks.md)), not React components or context:

- The SDK is used only in `infrastructure/`, next to a `Noop*` implementation that `appDependencies.ts` picks when the service is disabled by env.
- Views dispatch a thunk that calls the gateway, e.g. [authLinkNotReceivedHelpRequested.action.ts](src/features/support/core/authLinkNotReceivedHelpRequested.action.ts), instead of calling the SDK.
- Lint rejects `crisp-sdk-web` outside `infrastructure/`; give a new npm SDK the same `no-restricted-imports` entry in [.oxlintrc.json](.oxlintrc.json).

## Components and styling

- Before creating a component, look in `src/shared/views/components/` (e.g. `RadioButtons`, `CheckableTile`, `BackNextButtons`, `Dialog`, `form/MonthYearInput`), then in `@codegouvfr/react-dsfr`. Create one only if neither has it.
- Keep a component's internal representation out of its props: if every consumer would write the same conversion, it belongs inside the component. [MonthYearInput](src/shared/views/components/form/MonthYearInput/MonthYearInput.tsx) takes and returns the stored date string and keeps the month/year display to itself.
- Styling is DSFR plus Tailwind CSS v4, which loads with `@import "tailwindcss/…"` ([main.css](src/main.css)), not the v3 `@tailwind` directives.
- Imports: `@/…` across features, relative paths only inside a feature, `"shared"` for the shared package.

## Tests

Test design is in [.claude/rules/testing.md](../../.claude/rules/testing.md). Tests run on Vitest with jsdom ([setupTestEnv.ts](src/test/setupTestEnv.ts)).

- Core specs (`*.spec.ts`) build a real store with the feature's `StoreBuilder` (e.g. [urban-project `_testStoreHelpers.ts`](src/features/create-project/core/urban-project/__tests__/_testStoreHelpers.ts)), which wires `getTestAppDependencies()`; they dispatch events and assert selector output. Pass an override to swap one service: `getTestAppDependencies({ realEstateValuationService: … })`.
- Component specs (`*.spec.tsx`) render with `@testing-library/react`. A component that reads the store gets `<Provider store={createStore(getTestAppDependencies())}>` (plus `RouteProvider` if it reads the route), as in [SiteUpdateView.spec.tsx](src/features/update-site/views/SiteUpdateView.spec.tsx).
- `@testing-library/user-event` isn't installed: drive inputs with `fireEvent`.
