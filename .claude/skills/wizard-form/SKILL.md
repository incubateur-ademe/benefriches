---
name: wizard-form
description: How the apps/web wizard-form engine works and how to extend it — the generic multi-step form engine (ADR-0015) behind urban & photovoltaic project creation and editing. Use when working on any guided multi-step form, adding a new wizard-form flow or step, touching shared/core/wizard-form, or wiring create/update slices, selectors, or step containers.
effort: medium
allowed-tools: Read, Grep, Glob
user-invocable: true
---

# Wizard-Form Engine (apps/web)

> One generic algorithm drives every guided, multi-step form in the app — urban & photovoltaic,
> creation & editing. Each form is a thin **definition** plugged into a shared engine through an
> **injected lens**. Decision record: `docs/adr/0015-extract-wizard-form-engine-via-injected-lens.md`.
> Glossary (*Wizard form*, *Context*, *Answers*): `apps/web/CONTEXT.md`.

Read this before reading the files — it saves you from reverse-engineering the abstraction. Paths below
are the source of truth; open them when you need detail.

## The one idea: engine + definition, joined by a lens

The engine knows **one abstract state shape**, generic over `<StepId, TAnswers>`. It knows nothing about
projects, sites, urban, or PV. A consumer connects its concrete form to the engine by supplying a
`WizardFormDefinition` whose two key functions are the **injected lens**:

- `selectForm(state)` — locates this instance's `WizardFormSubState` inside the consumer's slice.
- `buildContext(state)` — builds the eager context (the site) handlers read.

That lens is why the same engine + same handler registry serve four live instances: urban-create,
urban-update, pv-create, pv-update.

## Three layers

```
L1  shared/core/wizard-form/                     generic engine — ZERO domain, no slice/reducer
      stepHandler.type.ts    handler contract: AnswerStepHandler / InfoStepHandler
      wizardForm.reducer.ts  the shapes: WizardFormSubState, WizardFormDefinition
      wizardForm.actions.ts  makeWizardFormActionType(prefix, name)  — namespacing
      helpers/               the algorithm (pure fns): computeStepChanges, applyStepChanges,
                             navigateToStep, mutateState, readState, stepsSequence

L2  features/create-project/core/project-form/   shared "reconversion-project-on-a-site" domain
      site · stakeholders · soils-carbon · local-authorities · project-name
      (used by BOTH project types AND by create + update)

L3  features/create-project/core/{urban-project, renewable-energy}/   one per form type
      {type}Steps.ts               StepId union + AnswersByStep map (this is TAnswers)
      step-handlers/**             one pure handler per step
        stepHandlerRegistry.ts     aggregates them (answerStepHandlers + full nav registry)
      {type}Form.reducer.ts        add{Type}FormCasesToBuilder(builder, actions, definition)
      {type}Form.actions.ts        create{Type}FormActions(prefix)
      {type}Form.selectors.ts      create{Type}FormSelectors(prefix)

Views (feature-owned, shared by create + update):
  features/create-project/views/{urban-project, photovoltaic-power-station}/**   containers
  features/create-project/views/{project-form, .../renewable-energy-form}/       context seam
  .../stepToComponent.tsx    maps StepId -> the lazy-loaded container
```

## The handler contract (`stepHandler.type.ts`)

Handlers are **pure functions of `{ context, answers }`** — no store, no dispatch, no create-vs-update
awareness. An `AnswerStepHandler` implements:

- `getNextStepId(params, answers)` — required; the branching logic.
- `getPreviousStepId?`, `getDefaultAnswers?` — optional nav / pre-fill.
- `getRecomputedStepAnswers?`, `getDependencyRules?`, `getShortcut?`, `updateAnswersMiddleware?` —
  optional cascade hooks. Urban uses them; **PV implements none** (the "degenerate" path), so
  `computeStepChanges` always yields empty changes and `applyStepChanges` runs unconditionally.

## Runtime: one step transition

```
dispatch stepCompletionRequested({stepId, answers})     (prefixed action)
  -> buildContext(state) + computeStepChanges(registry, ctx, steps, payload)
        · getDependencyRules -> invalidate downstream answers
        · getShortcut        -> maybe skip ahead
  -> applyStepChanges: writes answers, walks stepsSequence, sets currentStep
  -> selector (via Provider, resolved to the mode's prefix) re-derives current step
  -> stepToComponent maps stepId -> next container mounts
```

The reducer wiring lives in `add{Type}FormCasesToBuilder` and maps exactly four actions onto engine
helpers: `stepCompletionRequested`, `previousStepRequested`, `nextStepRequested`,
`stepNavigationRequested`. Read `renewable-energy/renewableEnergyForm.reducer.ts` — it's the smallest
complete example (~120 lines).

## Create vs. edit — only the lens differs

Both instances call the **same** `add{Type}FormCasesToBuilder` with the **same** `registry`. The one
line that changes is `selectForm`:

```ts
// creation  (features/create-project/core/renewable-energy/renewableEnergy.reducer.ts)
selectForm: (state) => state.renewableEnergyProject,

// update    (features/update-project/core/updateProject.reducer.ts)
selectForm: (state) => state.projectUpdate.renewableEnergyProject,
```

Editing adds only: a **hydration** converter (saved project -> answered steps, reconstructing the
branch path, e.g. PV's POWER vs SURFACE) and a **save-in-place** thunk. Everything else is shared.

## Adding a new wizard form (e.g. a 3rd consumer)

You never open `shared/core/wizard-form/`.

1. **Steps** — a `StepId` union (answer vs info) + the `AnswersByStep` map.
2. **Handlers** — one pure handler per step; aggregate into a registry.
3. **Reducer wiring** — an `addXxxFormCasesToBuilder` mapping the 4 actions onto the engine helpers
   (copy PV's file — it's the degenerate template).
4. **Factories** — `createXxxFormActions(prefix)`, `createXxxFormSelectors(prefix)`.
5. **Slice** — nest a `WizardFormSubState`-shaped sub-state under your key; call the case-builder with
   `{ registry, selectForm, buildContext, config }`.
6. **Views** — containers reading a `useXxxForm()` hook, a Provider that resolves mode, a
   `stepToComponent` map.
7. **Editing too?** — reuse 1–6 with a second definition (different `selectForm`) + a hydration
   converter + a save-in-place thunk.

## Guardrails (things that have actually gone wrong here)

- **No domain in the engine.** `shared/core/wizard-form/` must contain no `project`/`urban`/`site`
  tokens and import nothing from `features/*`. This is now **machine-enforced** — the oxlint rule
  `architecture-boundaries/no-cross-layer-import` (`shared/** -> features/**`) is set to `error` in
  `apps/web/.oxlintrc.json`. If you want to reach into a feature from here, the abstraction is wrong.
- **Update consumes create; never re-mirror.** `features/update-project` imports create-project's
  form-definitions (registry, selectors, containers) via the accepted feature→feature edge and reuses
  them through the `"projectUpdate"` prefix lens. Do **not** copy the selector/container layer into
  update — a line-for-line mirror was introduced under time pressure (ticket 09) and then deleted
  again (tickets 10a/10b). Reuse via the lens.
- **Context is eager, guaranteed present.** `buildContext` returns the site — handlers never defend
  against it being missing. Lazily-fetched, step-scoped data (carbon storage, expected production)
  stays in the slice, out of the handler context.
- **Handlers stay pure and mode-blind.** No store access, no "am I creating or editing?" — that
  distinction lives only in the lens.

## Reference

- Visual architecture diagram: https://claude.ai/code/artifact/cd38a538-d6d3-48b2-bfaa-888f804eef09
- ADR-0015 (decision + rationale): `docs/adr/0015-extract-wizard-form-engine-via-injected-lens.md`
- Glossary: `apps/web/CONTEXT.md`
