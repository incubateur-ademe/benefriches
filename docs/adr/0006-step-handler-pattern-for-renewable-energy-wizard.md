# [ADR-0006] Use step handler pattern for renewable energy wizard reducer

- **Date**: 2026-03-03
- **Status**: Accepted

## Context

The renewable energy project creation wizard has ~40 steps managed by a monolithic reducer (`renewableEnergy.reducer.ts`). Each step's navigation logic, default value computation, answer transformation, and state mutation was handled inline in the reducer via individual action handlers (one `createAction` + one reducer case per step). This led to:

- A ~500-line reducer file with repetitive patterns (navigate, set payload, compute next step)
- ~40 separate action creators (one per step), each dispatched from a dedicated container component
- Navigation logic (which step comes next?) scattered across reducer cases
- No reusable abstraction for step behavior — adding a step required editing the reducer, creating an action, and wiring the container

The urban project wizard already adopted a step handler pattern (see ADR-0004), but the renewable energy wizard still used the legacy per-action approach.

## Decision

Extract step-specific logic into **step handler objects** registered in a `stepHandlerRegistry`, and replace the ~40 per-step actions with a single generic `stepCompletionRequested` action carrying a discriminated union payload (`{ stepId, answers }`).

### Key components

1. **Co-located schemas** — Each handler directory contains a `*.schema.ts` file with the Zod schema for that step's answers. `renewableEnergySteps.ts` imports and re-exports them to build the `AnswersByStep` type map
2. **`stepHandler.type.ts`** — `AnswerStepHandler<T>` and `InfoStepHandler` interfaces with:
   - `getNextStepId(context, answers?)` — navigation logic
   - `getDefaultAnswers?(context)` — pre-fill defaults
   - `updateAnswersMiddleware?(context, answers)` — transform answers before storing
3. **`stepHandlerRegistry.ts`** — maps every step ID to its handler
4. **`renewableEnergy.actions.ts`** — 3 generic actions: `stepCompletionRequested`, `nextStepRequested`, `previousStepRequested`
5. **Helpers** (`completeStep.ts`, `mutateState.ts`, `navigateToStep.ts`, `stepsSequence.ts`) — shared reducer logic
6. **Co-located selectors** — Each handler directory contains a `*.selector.ts` file with the ViewData selector for its container, replacing the former central selector files (`expenses.selectors.ts`, `revenues.selectors.ts`, etc.)
7. **Co-located stepper config** — Each handler directory contains a `*.stepperConfig.ts` declaring `{ groupId }`. A central `renewableEnergyStepperConfig.ts` aggregates them into a `RENEWABLE_ENERGY_STEP_TO_GROUP` mapping, replacing the former 66-case switch in the stepper component with a data-driven lookup
8. **Co-located step tests** — Each handler directory contains a `*.step.spec.ts` file covering forward navigation (all branches), backward navigation, and `updateAnswersMiddleware` transformations

### Backward navigation

`previousStepRequested` derives the previous step from `stepsSequence` — the same forward sequence built by chaining `getNextStepId` calls. It finds the current step's index in the sequence and navigates to `index - 1`. No handler needs to declare a `getPreviousStepId` method.

This differs from the urban project wizard, where backward navigation is explicit: each handler declares `getPreviousStepId(context)`. That is appropriate there because dependency cascades and recomputations mean a handler may need state context to determine its predecessor. The PV wizard has no such complexity.

### Directory structure

Each step is a self-contained directory under `step-handlers/<category>/<step-name>/`:

```
step-handlers/
├── photovoltaic/
│   ├── key-parameter/
│   │   ├── keyParameter.handler.ts
│   │   ├── keyParameter.schema.ts
│   │   ├── keyParameter.selector.ts
│   │   ├── keyParameter.stepperConfig.ts
│   │   └── keyParameter.step.spec.ts
│   └── surface/
│       ├── surface.handler.ts
│       ├── surface.schema.ts
│       ├── surface.selector.ts
│       ├── surface.stepperConfig.ts
│       └── surface.step.spec.ts
├── stakeholders/
│   └── site-purchase/
│       ├── sitePurchase.handler.ts
│       ├── sitePurchase.schema.ts
│       ├── sitePurchase.selector.ts
│       ├── sitePurchase.stepperConfig.ts
│       └── sitePurchase.step.spec.ts
├── shared/
│   ├── soils.schema.ts              # Shared Zod schemas (soilsDistribution, soilType[])
│   └── projectStakeholder.schema.ts # Shared stakeholder schema
├── stepHandlerRegistry.ts           # Maps every step ID → handler
└── renewableEnergyStepperConfig.ts  # Aggregates stepperConfig → STEP_TO_GROUP mapping
```

Not every step has all files — introduction steps have only a handler and stepperConfig, answer steps without dedicated selectors omit the selector file.

The reducer becomes a thin dispatcher: receive `stepCompletionRequested`, look up the handler, apply changes, compute next step.

## Options Considered

### Option 1: Step handler registry with generic actions (chosen)

Extract step logic into handler objects, use a single `stepCompletionRequested` action with discriminated payload.

- **Pros**: Dramatic reducer simplification (500+ → ~100 lines of reducer logic), type-safe payload via discriminated union, adding a step = create handler + register, aligns with urban project wizard pattern
- **Cons**: New abstraction to learn, handler registry imports grow, requires migrating all containers to dispatch the generic action

### Option 2: Keep per-step actions, extract only navigation logic

Keep individual actions but move `getNextStep` logic into a shared navigation config.

- **Pros**: Smaller diff, containers unchanged, no new dispatch pattern
- **Cons**: Still ~40 action creators, reducer stays large, only partially addresses the problem

### Option 3: Status quo with better organization

Split the reducer into multiple files by section (stakeholders, expenses, etc.).

- **Pros**: No new abstractions, minimal learning curve
- **Cons**: Doesn't reduce repetition, just moves it around; the fundamental pattern (one action per step) remains

### Backward navigation: derive from stepsSequence vs. explicit getPreviousStepId (chosen: derive)

- **Derive from stepsSequence**: No per-handler boilerplate; the forward chain already encodes all needed information; consistent with the PV wizard's simpler model
- **Explicit getPreviousStepId per handler** (urban project approach): Self-contained and explicit, but requires ~35 handlers each to repeat their predecessor; any sequence change requires updating both directions

## Consequences

### Positive

- Reducer reduced from ~500 lines of case-by-case handling to a generic dispatcher
- Adding a new step is self-contained: create a handler directory with handler, schema, selector, stepperConfig, and step test, then register
- Navigation logic, schema, ViewData selector, stepper config, and tests are all colocated with the step they belong to
- Containers become simpler: dispatch `stepCompletionRequested({ stepId, answers })` instead of a step-specific action
- Step sequence is the single source of truth for navigation in both directions
- Consistent pattern with urban project wizard (ADR-0004)

### Negative

- All ~40 container components need updating to dispatch the generic action
- Higher file count (~130 files across nested directories vs. a few central files)
- Handler registry file has many imports (one per step)
- The discriminated union payload type (`StepCompletionPayload`) requires careful typing to maintain type safety
- Backward navigation silently does nothing if `stepsSequence` is empty; step tests must seed it explicitly via `StoreBuilder.withStepsSequence`
- The derived backward navigation only holds while no step needs context-dependent backward branching; if that changes, explicit `getPreviousStepId` declarations would be needed

## Links

- Related ADRs: [ADR-0004 — Colocate urban project step definitions](0004-colocate-urban-project-step-definitions.md)
