# [ADR-0004] Colocate urban project step definitions

- **Date**: 2026-02-23
- **Status**: Accepted

## Context

The urban project creation wizard is a dynamic multi-step form with ~60 steps. Each step's logic was scattered across 4-5 central files:

| Piece | Location |
|---|---|
| Zod schema | `urbanProjectSteps.ts` (260+ lines, all schemas mixed together) |
| Handler | `step-handlers/{section}/{name}.handler.ts` |
| Registry entry | `step-handlers/stepHandlerRegistry.ts` (120-line import list) |
| ViewData selector | `urbanProject.selectors.ts` (400+ lines, all selectors mixed together) |
| Stepper config | `stepper/stepperConfig.ts` (group mapping per step) |

Understanding or modifying a single step required jumping between 5 files across 4 directories. The central files grew linearly with every new step, making them hard to navigate.

## Decision

Colocate step-related files into **per-step folders** under `step-handlers/{section}/{step-name}/`. Each folder contains separate files for handler, schema, selector, and stepper config. Only create files that are needed (e.g., intro steps have no schema or selector).

The 4 central files become **thin aggregators** that import from colocated folders.

### Folder structure per step

```
step-handlers/{section}/{step-name}/
  {stepName}.handler.ts          -- navigation, defaults, dependencies, shortcuts
  {stepName}.schema.ts           -- Zod schema (answer steps only)
  {stepName}.stepperConfig.ts    -- stepper sidebar group mapping
  {stepName}.selector.ts         -- ViewData selector factory (only if step has a dedicated selector)
```

### Example: `URBAN_PROJECT_USES_SELECTION`

```
step-handlers/uses/selection/
  usesSelection.handler.ts
  usesSelection.schema.ts
  usesSelection.stepperConfig.ts
  (no selector — uses generic selectStepAnswers)
```

### Aggregator pattern

Each aggregator imports from step folders and assembles the registry/map:

```typescript
// urbanProjectSteps.ts
import { usesSelectionSchema } from "./step-handlers/uses/selection/usesSelection.schema";

export const answersByStepSchemas = {
  URBAN_PROJECT_USES_SELECTION: usesSelectionSchema,
  // ...remaining inline schemas until migrated
};
```

```typescript
// stepHandlerRegistry.ts
import { UsesSelectionHandler } from "./uses/selection/usesSelection.handler";

export const stepHandlerRegistry = {
  URBAN_PROJECT_USES_SELECTION: UsesSelectionHandler,
  // ...
};
```

```typescript
// stepperConfig.ts
import { usesSelectionStepperConfig } from "@/shared/core/.../uses/selection/usesSelection.stepperConfig";

export const STEP_TO_GROUP_MAPPING = {
  URBAN_PROJECT_USES_SELECTION: usesSelectionStepperConfig,
  // ...
};
```

```typescript
// urbanProject.selectors.ts — for steps with dedicated selectors
import { createSelectPublicGreenSpacesSurfaceAreaViewData } from "./step-handlers/uses/public-green-spaces-surface-area/publicGreenSpacesSurfaceArea.selector";

const selectPublicGreenSpacesSurfaceAreaViewData =
  createSelectPublicGreenSpacesSurfaceAreaViewData(selectStepState, selectors.selectSiteSurfaceArea);
```

### Selector factory signature

Steps with dedicated ViewData selectors export a factory function that takes the shared selectors as arguments:

```typescript
export const createSelectXxxViewData = <S>(
  selectStepState: Selector<S, ProjectFormState["urbanProject"]["steps"]>,
  // ...other selectors as needed
) => createSelector([selectStepState, ...], (steps, ...): XxxViewData => { ... });
```

### Section-to-folder mapping

Steps are grouped into section folders matching their domain:

- `uses/` — uses flow steps (introduction, selection, public green spaces surface area)
- `buildings/` — buildings-related steps (introduction, floor surface area, use selection, etc.)
- `spaces/` — spaces flow steps
- `soils/` — soils summary, decontamination, carbon
- `stakeholders/` — project developer, reinstatement contract owner
- `site-and-buildings-resale/` — resale selection steps
- `expenses/` — all expense steps
- `revenues/` — all revenue steps
- `schedule/`, `naming/`, `project-phase/` — single-step sections
- `express/` — express flow steps
- `creation-mode/`, `result/`, `summary/` — common steps

### Known edge cases for migration

1. **Shared schemas**: `projectStakeholderSchema` is used by multiple steps (stakeholders, buildings resale). When those steps are migrated, extract it to a shared file (e.g., `step-handlers/shared/projectStakeholder.schema.ts`) rather than duplicating.

2. **`spaces/new-public-green-spaces/`**: Two handlers remain there (`publicGreenSpacesIntroduction`, `publicGreenSpacesSoilsDistribution`). When migrated, they should move to `spaces/public-green-spaces-introduction/` and `spaces/public-green-spaces-soils-distribution/` respectively.

## Options Considered

### Option 1: Colocate as separate files (chosen)

Each piece remains a separate export in its own file, grouped by folder.

- **Pros**: No new abstractions, easy to understand, incremental migration, files are identical to what they were before (just moved)
- **Cons**: More files on disk, aggregator files still exist as boilerplate

### Option 2: Single step definition object

Bundle handler + schema + selector + stepper config into one exported object per step.

- **Pros**: Single import per step, registry becomes a simple array
- **Cons**: New abstraction to learn, harder to type correctly (generics across handler + schema + selector), bigger refactoring surface

### Option 3: Keep centralized files, improve navigation

Add better comments/sections to the existing large files.

- **Pros**: No file moves, minimal diff
- **Cons**: Doesn't solve the core problem — files keep growing, cognitive overhead remains

## Consequences

### Positive

- Understanding a step requires opening one folder instead of jumping between 5 files
- Central files stop growing — they become thin import aggregators
- Adding a new step is self-contained: create a folder, add files, register in aggregators
- Migration is incremental — old inline definitions coexist with new colocated ones

### Negative

- More files on disk (~4 files per step vs 1)
- Aggregator files are boilerplate (import + re-export), though they shrink in complexity
- During migration, the codebase has a mixed style (some steps colocated, some inline)

## Migration strategy

Incremental, one step (or section) at a time:

1. Create subfolder under `step-handlers/{section}/{step-name}/`
2. Extract schema, stepper config, and selector (if applicable) into separate files
3. Move handler into the subfolder
4. Update the 4 aggregator files to import from the new location
5. Run `pnpm --filter web typecheck && pnpm --filter web lint && pnpm --filter web test`
6. Commit
7. Repeat for next step
