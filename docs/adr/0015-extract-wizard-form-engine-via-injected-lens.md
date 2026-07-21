# [ADR-0015] Extract a generic wizard-form engine via injected lens, defer slice normalization

- **Date**: 2026-07-13
- **Status**: Accepted — **Implemented** (see [Outcome](#outcome))

## Context

Two multi-step form flows exist in the web app with near-identical mechanics but separate code:

- **Urban project** — the richer engine, at `src/shared/core/reducers/project-form/urban-project/`. Powers **both** creation and update. Supports cascading dependency rules, shortcuts, recomputation, and confirmation dialogs (ADR-0004, ADR-0006).
- **Photovoltaic** — creation-only, at `src/features/create-project/core/renewable-energy/step-handlers/`. Independent steps, no cascade. Its handler contract is a strict subset of urban's.

We want to (1) let users **update** photovoltaic projects the way they already update urban ones, and (2) extract a **generic engine** shared by both — and, ultimately, by site creation too.

The engine logic already lives in `shared/` but is nominally welded to urban: `ProjectFormState` hardcodes a literal `urbanProject:` sub-key and binds every type to `UrbanProjectCreationStep`, and the reducer reaches straight into `state.urbanProject` (`urbanProject.reducer.ts`). That coupling — not any missing capability — is what blocks reuse. Create and update are already **separate slice instances** distinguished by action prefix (`"projectCreation"` / `"projectUpdate"`), both sharing one handler registry.

The main risk is test fragility: ~55 `.step.spec.ts` across both flows assert on the internal per-step state shape (`state.<flow>.steps[STEP_ID]` equals `{ completed, payload }`). A naive extraction that reshapes state would fail all of them for the wrong reason, masking real regressions.

## Decision

Extract the engine to **`src/shared/core/wizard-form/`** and make it project-agnostic **without reshaping state yet**, using two seams:

1. **Injected lens.** Each consumer supplies `selectForm(sliceState) → wizardFormSubState` and `buildContext(sliceState) → context`. The engine's case-adder and helpers operate on the returned sub-state draft instead of a hardcoded `state.urbanProject`. Each consumer keeps its own sub-key, so **every existing test's accessor path stays valid**.

2. **Pure handler contract.** Handlers are pure over `StepHandlerParams = { context, answers }`:
   - `context` — eager, guaranteed-loaded situational data (the site). Non-optional.
   - `answers` — accumulated user answers.
   - **No `mode`.** Create vs. update is a purely structural distinction (initial state + reducer config + actions), matching how urban already works; no handler branches on it.
   - **Lazy, step-scoped fetched data never enters the handler context.** It lives in slice state, is fetched by consumer-owned thunks, and is read only by view selectors.
   - Cascade hooks (`getDependencyRules?`, `getShortcut?`, `getRecomputedStepAnswers?`) are **optional**; photovoltaic omits them and runs the **same** `computeStepChanges` path in its degenerate (zero-rules → direct-apply) form.

The engine is a higher-order **open case-adder** — `addWizardFormCases(builder, actions, definition)` on `createReducer` (not `createSlice`, per web conventions) — so each consumer adds its own extra thunk cases. Actions come from `createWizardFormActions(prefix)`, where a **unique prefix per instance** keeps action types from colliding across slices mounted in the same store.

`WizardFormDefinition<StepId, TContext, TAnswers> = { prefix, registry, initialStep, config, selectForm, buildContext }`.

**Slice normalization is deferred, not abandoned.** The end state is a self-contained engine slice composed via `combineReducers`; we will get there in a later phase, decoupled from the extraction, because handlers never see the slice layout regardless.

### Migration sequence

| Phase | Work | Commit shape |
|---|---|---|
| 0 | Behavior-net (`getCurrentStep` + final DTO via `getProjectData`) for urban + PV creation | additive |
| 1a | Rename `project-form` → `wizard-form` | pure move, separate commit |
| 1b | Generalize engine in place (lens, optional hooks, generic types); urban stays sole consumer | refactor |
| 2 | Rehome PV creation onto the engine | refactor |
| 3 | PV **update**: `convertProjectDataToSteps` PV case + hydrate + route out of `UnavailableFeatureView` | feature |
| 4 | **Normalize** the slice; retire/rewrite the ~55 shape tests (behavior-net makes many redundant) | refactor |

## Options Considered

### Sub-state access

- **Injected lens (chosen)** — keeps per-consumer sub-keys, so the ~55 shape tests stay green through extraction; decouples the risky engine change from the risky state-reshape.
- **Fixed conventional key** (`state.form` everywhere) — simpler engine, but renames the sub-key now, breaking all ~55 tests' accessor paths and coupling the two risks.
- **Full normalization now** — cleanest end state, but couples engine extraction to state reshape and churns tests + the `siteData`-beside-`urbanProject` assumption in one big diff.

### Cascade path for no-rules consumers

- **Unified degenerate path (chosen)** — one algorithm, tested once; PV gains cascade for free if a step ever grows a dependency.
- **Lighter bypass for no-cascade consumers** — avoids inert machinery in PV's slice, but splits the engine into two behaviors, doubling the surface to reason about.

### `mode` on handler params

- **Omit (chosen)** — urban already runs both modes through mode-blind handlers; YAGNI.
- **Include** — pre-emptive; no current handler needs it.

## Consequences

### Positive

- The ~55 shape-coupled tests survive extraction untouched; a selector-based behavior-net (Phase 0) is the true regression oracle across every phase.
- Handlers stay pure functions of `{ context, answers }` — trivial to unit-test without a store, which also fills PV's missing `.handler.spec.ts` coverage.
- PV **update** becomes cheap: the engine already supports update (urban proves it), so PV supplies a `convertProjectDataToSteps` case and reuses the rest.
- Engine extraction and state normalization are independent, sequenced changes rather than one high-risk diff.

### Negative

- The injected lens is deliberate interim indirection; a reader may wonder why the slice isn't normalized (this ADR is the answer).
- Until Phase 4, PV's slice carries urban-shaped fields it never uses (`pendingStepCompletion`; inert `stepCompletionConfirmed`/`Cancelled` cases).
- The ~55 shape tests must still be confronted at normalize (Phase 4) — deferred, not eliminated.

## Outcome

Fully implemented (tickets 01–10, all shipped to `main`). The delivery followed the injected-lens decision above and went one phase further than the original table: the slice **was** normalized, the concrete `ProjectFormState`/`WizardFormState` were **deleted**, and urban's slice is now composed via `combineReducers` over the generic `WizardFormSubState` (`features/create-project/core/urban-project/urbanProject.state.ts`). The `mode`-free pure handler contract and the unified degenerate cascade path both landed as decided; PV omits the cascade hooks and runs the same `computeStepChanges`.

Final three-layer structure:

- **L1 — generic engine** (domain-free; no project/urban/site tokens, no `features/*` imports): `apps/web/src/shared/core/wizard-form/` — `wizardForm.reducer.ts` (`WizardFormDefinition`, `WizardFormSubState`), `wizardForm.actions.ts`, `stepHandler.type.ts`, and `helpers/` (`navigateToStep`, `applyStepChanges`, `mutateState`, …).
- **L2 — project-form base**: `features/create-project/core/project-form/` — the project/site domain (project name, site, stakeholders, local authorities) evicted out of the generic engine.
- **L3 — per-type**: `features/create-project/core/{urban-project,renewable-energy}/`.

Two deliverables beyond the original phase list:

- **10a — view/context relocation.** The concrete VIEWS and the view-context machinery moved **out of** `shared/views/project-form/` (that directory is gone) **into** `features/create-project/views/`: `urban-project/**`, `photovoltaic-power-station/**`, and `project-form/` (context/provider/hook — `ProjectFormProvider`, `useProjectForm`). `features/update-project` consumes these via an accepted feature→feature import.
- **10b — PV convergence.** PV creation and editing share one lens-injected selector/container set (`createRenewableEnergyFormSelectors(prefix)`, `useRenewableEnergyForm`); the separate update-side PV mirror was deleted. Step-id→component maps are shared across create/update per type (`stepToComponent.tsx`), and stateful thunks are split out of the pure action factories.

## Links

- Related: [ADR-0004 — Colocate urban project step definitions](0004-colocate-urban-project-step-definitions.md)
- Related: [ADR-0006 — Step-handler pattern for renewable-energy wizard](0006-step-handler-pattern-for-renewable-energy-wizard.md)
- Related: [ADR-0009 — Align urban project engine typing with urban zone patterns](0009-align-urban-project-engine-typing-with-urban-zone-patterns.md)
- Glossary: `apps/web/CONTEXT.md` — Wizard form, Context, Answers
