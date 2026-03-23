# Buildings Reuse and Construction — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add wizard steps to the urban project creation flow that distinguish between reusing existing site buildings and constructing new buildings, with downstream impacts on stakeholder and expense steps.

**Architecture:** New step handlers follow the existing colocated pattern (handler + schema + selector + stepperConfig). Domain reader functions in `buildingsReaders.ts` encapsulate derived computation (demolished, new construction amounts). Navigation uses shared exit-routing helpers to avoid logic duplication. All new data stays in frontend form state (no backend changes).

**Tech Stack:** React 19, Redux Toolkit 2, Zod, Vitest, react-hook-form, Playwright (E2E)

**Spec:** `docs/superpowers/specs/2026-03-23-buildings-reuse-and-construction-design.md`

---

## File Map

All paths relative to repo root. `SH` = `apps/web/src/shared/core/reducers/project-form/urban-project/step-handlers`. `SV` = `apps/web/src/shared/views/project-form/urban-project`.

### New files

| File | Purpose |
|---|---|
| `SH/buildings/buildingsReaders.ts` | Domain reader functions for buildings reuse/construction derived values |
| `SH/buildings/__tests__/buildingsReaders.spec.ts` | Unit tests for reader functions |
| `SH/stakeholders/stakeholdersReaders.ts` | Reader for `isDeveloperBuildingsConstructor` |
| `SH/buildings/buildings-reuse-introduction/buildingsReuseIntroduction.handler.ts` | Info handler |
| `SH/buildings/buildings-reuse-introduction/buildingsReuseIntroduction.stepperConfig.ts` | Stepper config |
| `SH/buildings/buildings-new-construction-introduction/buildingsNewConstructionIntroduction.handler.ts` | Info handler |
| `SH/buildings/buildings-new-construction-introduction/buildingsNewConstructionIntroduction.stepperConfig.ts` | Stepper config |
| `SH/buildings/buildings-footprint-to-reuse/buildingsFootprintToReuse.handler.ts` | Answer handler with dependency rules |
| `SH/buildings/buildings-footprint-to-reuse/buildingsFootprintToReuse.schema.ts` | Zod schema |
| `SH/buildings/buildings-footprint-to-reuse/buildingsFootprintToReuse.selector.ts` | ViewData selector factory |
| `SH/buildings/buildings-footprint-to-reuse/buildingsFootprintToReuse.stepperConfig.ts` | Stepper config |
| `SH/buildings/buildings-demolition-info/buildingsDemolitionInfo.handler.ts` | Info handler |
| `SH/buildings/buildings-demolition-info/buildingsDemolitionInfo.stepperConfig.ts` | Stepper config |
| `SH/buildings/buildings-existing-buildings-uses-floor-surface-area/buildingsExistingBuildingsUsesFloorSurfaceArea.handler.ts` | Answer handler |
| `SH/buildings/buildings-existing-buildings-uses-floor-surface-area/buildingsExistingBuildingsUsesFloorSurfaceArea.schema.ts` | Zod schema |
| `SH/buildings/buildings-existing-buildings-uses-floor-surface-area/buildingsExistingBuildingsUsesFloorSurfaceArea.selector.ts` | ViewData selector factory |
| `SH/buildings/buildings-existing-buildings-uses-floor-surface-area/buildingsExistingBuildingsUsesFloorSurfaceArea.stepperConfig.ts` | Stepper config |
| `SH/buildings/buildings-new-construction-info/buildingsNewConstructionInfo.handler.ts` | Info handler |
| `SH/buildings/buildings-new-construction-info/buildingsNewConstructionInfo.stepperConfig.ts` | Stepper config |
| `SH/buildings/buildings-new-buildings-uses-floor-surface-area/buildingsNewBuildingsUsesFloorSurfaceArea.handler.ts` | Answer handler |
| `SH/buildings/buildings-new-buildings-uses-floor-surface-area/buildingsNewBuildingsUsesFloorSurfaceArea.schema.ts` | Zod schema |
| `SH/buildings/buildings-new-buildings-uses-floor-surface-area/buildingsNewBuildingsUsesFloorSurfaceArea.selector.ts` | ViewData selector factory |
| `SH/buildings/buildings-new-buildings-uses-floor-surface-area/buildingsNewBuildingsUsesFloorSurfaceArea.stepperConfig.ts` | Stepper config |
| `SH/stakeholders/stakeholders-buildings-developer/stakeholdersBuildingsDeveloper.handler.ts` | Answer handler |
| `SH/stakeholders/stakeholders-buildings-developer/stakeholdersBuildingsDeveloper.schema.ts` | Zod schema |
| `SH/stakeholders/stakeholders-buildings-developer/stakeholdersBuildingsDeveloper.selector.ts` | ViewData selector factory |
| `SH/stakeholders/stakeholders-buildings-developer/stakeholdersBuildingsDeveloper.stepperConfig.ts` | Stepper config |
| `SH/expenses/expenses-buildings-construction-and-rehabilitation/expensesBuildingsConstructionAndRehabilitation.handler.ts` | Answer handler |
| `SH/expenses/expenses-buildings-construction-and-rehabilitation/expensesBuildingsConstructionAndRehabilitation.schema.ts` | Zod schema |
| `SH/expenses/expenses-buildings-construction-and-rehabilitation/expensesBuildingsConstructionAndRehabilitation.selector.ts` | ViewData selector factory |
| `SH/expenses/expenses-buildings-construction-and-rehabilitation/expensesBuildingsConstructionAndRehabilitation.stepperConfig.ts` | Stepper config |
| `SH/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts` | Integration tests for buildings chapter flow |
| `SV/buildings/reuse-introduction/index.tsx` | Container |
| `SV/buildings/reuse-introduction/BuildingsReuseIntroduction.tsx` | Presentational |
| `SV/buildings/new-construction-introduction/index.tsx` | Container |
| `SV/buildings/new-construction-introduction/BuildingsNewConstructionIntroduction.tsx` | Presentational |
| `SV/buildings/footprint-to-reuse/index.tsx` | Container |
| `SV/buildings/footprint-to-reuse/BuildingsFootprintToReuseForm.tsx` | Presentational |
| `SV/buildings/demolition-info/index.tsx` | Container |
| `SV/buildings/demolition-info/BuildingsDemolitionInfo.tsx` | Presentational |
| `SV/buildings/existing-buildings-uses-floor-surface-area/index.tsx` | Container |
| `SV/buildings/existing-buildings-uses-floor-surface-area/ExistingBuildingsUsesFloorSurfaceAreaForm.tsx` | Presentational |
| `SV/buildings/new-construction-info/index.tsx` | Container |
| `SV/buildings/new-construction-info/BuildingsNewConstructionInfo.tsx` | Presentational |
| `SV/buildings/new-buildings-uses-floor-surface-area/index.tsx` | Container |
| `SV/buildings/new-buildings-uses-floor-surface-area/NewBuildingsUsesFloorSurfaceAreaForm.tsx` | Presentational |
| `SV/stakeholders/buildings-developer/index.tsx` | Container |
| `SV/stakeholders/buildings-developer/BuildingsDeveloperForm.tsx` | Presentational |
| `SV/expenses/buildings-construction-and-rehabilitation/index.tsx` | Container |
| `SV/expenses/buildings-construction-and-rehabilitation/BuildingsConstructionAndRehabilitationForm.tsx` | Presentational |

### Modified files

| File | Change |
|---|---|
| `SH/../urbanProjectSteps.ts` | Add 4 info step IDs to `INTRODUCTION_STEPS`, 5 answer schemas to `answersByStepSchemas`, extend `BUILDINGS_STEPS` |
| `SH/stepHandlerRegistry.ts` | Register 9 new handlers |
| `SH/buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.handler.ts` | Update `getNextStepId` + add `getDependencyRules` |
| `SH/stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.handler.ts` | Update `getNextStepId` |
| `SH/stakeholders/stakeholders-reinstatement-contract-owner/stakeholdersReinstatementContractOwner.handler.ts` | Update `getPreviousStepId` |
| `SH/expenses/expenses-introduction/expensesIntroduction.handler.ts` | Update `getPreviousStepId` |
| `SH/expenses/expenses-installation/expensesInstallation.handler.ts` | Update `getNextStepId` |
| `SH/soils-decontamination/soils-decontamination-introduction/soilsDecontaminationIntroduction.handler.ts` | Update `getPreviousStepId` |
| `SH/site-and-buildings-resale/site-resale-introduction/siteResaleIntroduction.handler.ts` | Update `getPreviousStepId` |
| `SH/uses/selection/usesSelection.handler.ts` | Add new steps to cascading deletion in `getDependencyRules` |
| `SH/spaces/getCommonRules.ts` | Update `getDeleteBuildingsRules` — it uses `BUILDINGS_STEPS` array for spaces handlers cascading |
| `apps/web/src/shared/core/reducers/project-form/urban-project/urbanProject.selectors.ts` | Add new selector factories |
| `apps/web/src/shared/views/project-form/stepper/stepperConfig.ts` | Add 9 entries to `STEP_TO_GROUP_MAPPING`, new `StepSubGroupId` values for answer steps, new labels in `STEP_GROUP_LABELS` |
| `apps/web/src/features/create-project/views/urban-project/creationStepQueryStringMap.ts` | Add 9 entries to `URBAN_PROJECT_CREATION_STEP_QUERY_STRING_MAP` |
| `apps/web/src/features/create-project/views/urban-project/UrbanProjectCreationWizard.tsx` | Add 9 switch cases for step → component mapping |
| `apps/web/src/features/update-project/views/UrbanProjectUpdateView.tsx` | Add 9 switch cases (exhaustive switch on `UrbanProjectUpdateStep` derived from creation steps) |

---

## Task 1: Foundation — Domain Readers and Step Registration

**Files:**
- Create: `SH/buildings/buildingsReaders.ts`
- Create: `SH/buildings/__tests__/buildingsReaders.spec.ts`
- Create: `SH/stakeholders/stakeholdersReaders.ts`
- Modify: `SH/../urbanProjectSteps.ts`

### Reader functions

- [x] **Step 1: Write failing tests for `buildingsReaders`**

Create `SH/buildings/__tests__/buildingsReaders.spec.ts`. Test each reader function against the scenario table from the spec:

| Function | Input | Expected |
|---|---|---|
| `siteHasBuildings(siteData)` | siteData with BUILDINGS: 2000 | `true` |
| `siteHasBuildings(siteData)` | siteData with no BUILDINGS | `false` |
| `getSiteBuildingsFootprint(siteData)` | siteData with BUILDINGS: 2000 | `2000` |
| `getProjectBuildingsFootprint(stepsState)` | spaces step with BUILDINGS: 3000 | `3000` |
| `getBuildingsFootprintToReuse(stepsState)` | reuse step completed with 1500 | `1500` |
| `getBuildingsFootprintToReuse(stepsState)` | reuse step not completed | `undefined` |
| `getBuildingsFootprintToDemolish(siteData, stepsState)` | site=2000, reuse=1500 | `500` |
| `getBuildingsFootprintToConstruct(siteData, stepsState)` | site=2000, project=3000, reuse=2000 | `1000` |
| `willDemolishBuildings(siteData, stepsState)` | site=2000, reuse=1500 | `true` |
| `willConstructNewBuildings(siteData, stepsState)` | site=2000, project=3000, reuse=2000 | `true` |
| `hasBothReuseAndNewConstruction(siteData, stepsState)` | site=2000, project=3000, reuse=1000 | `true` |

Use `ReadStateHelper` pattern from `managementReaders.ts`. Construct minimal step state objects for each test (no store needed — these are pure functions).

- [x] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter web test SH/buildings/__tests__/buildingsReaders.spec.ts`
Expected: FAIL — functions don't exist yet.

- [x] **Step 3: Implement `buildingsReaders.ts`**

Create `SH/buildings/buildingsReaders.ts`:

```typescript
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "../../helpers/readState";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
type StepsState = ProjectFormState["urbanProject"]["steps"];

type SiteData = NonNullable<ProjectFormState["siteData"]>;

export function siteHasBuildings(siteData: SiteData): boolean {
  return (siteData.soilsSurfaceAreaDistribution.BUILDINGS ?? 0) > 0;
}

export function getSiteBuildingsFootprint(siteData: SiteData): number {
  return siteData.soilsSurfaceAreaDistribution.BUILDINGS ?? 0;
}

export function getProjectBuildingsFootprint(stepsState: StepsState): number {
  return (
    ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_SPACES_SURFACE_AREA")
      ?.spacesSurfaceAreaDistribution?.BUILDINGS ?? 0
  );
}

export function getBuildingsFootprintToReuse(stepsState: StepsState): number | undefined {
  return ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE")
    ?.buildingsFootprintToReuse;
}

export function getBuildingsFootprintToDemolish(
  siteData: SiteData,
  stepsState: StepsState,
): number {
  const reuse = getBuildingsFootprintToReuse(stepsState) ?? 0;
  return getSiteBuildingsFootprint(siteData) - reuse;
}

export function getBuildingsFootprintToConstruct(
  siteData: SiteData,
  stepsState: StepsState,
): number {
  const reuse = getBuildingsFootprintToReuse(stepsState) ?? 0;
  return Math.max(0, getProjectBuildingsFootprint(stepsState) - reuse);
}

export function willDemolishBuildings(siteData: SiteData, stepsState: StepsState): boolean {
  return getBuildingsFootprintToDemolish(siteData, stepsState) > 0;
}

export function willConstructNewBuildings(
  siteData: SiteData,
  stepsState: StepsState,
): boolean {
  return getBuildingsFootprintToConstruct(siteData, stepsState) > 0;
}

export function hasBothReuseAndNewConstruction(
  siteData: SiteData,
  stepsState: StepsState,
): boolean {
  const reuse = getBuildingsFootprintToReuse(stepsState) ?? 0;
  return reuse > 0 && willConstructNewBuildings(siteData, stepsState);
}
```

Also add two shared exit-routing helpers at the bottom of this file:

```typescript
import type { StepContext } from "../../stepHandler.type";
import type { UrbanProjectCreationStep } from "../../../urbanProjectSteps";

export function getNextStepAfterBuildings(context: StepContext): UrbanProjectCreationStep {
  return context.siteData?.hasContaminatedSoils
    ? "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION"
    : "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
}

export function getLastBuildingsChapterStep(context: StepContext): UrbanProjectCreationStep {
  const { siteData, stepsState } = context;
  if (!siteData || !siteHasBuildings(siteData)) {
    return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION";
  }
  if (hasBothReuseAndNewConstruction(siteData, stepsState)) {
    return "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA";
  }
  if (willConstructNewBuildings(siteData, stepsState)) {
    return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
  }
  if (willDemolishBuildings(siteData, stepsState)) {
    return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
  }
  return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
}
```

- [x] **Step 4: Run tests to verify they pass**

Run: `pnpm --filter web test SH/buildings/__tests__/buildingsReaders.spec.ts`
Expected: PASS

- [x] **Step 5: Create `stakeholdersReaders.ts`**

Create `SH/stakeholders/stakeholdersReaders.ts`:

```typescript
import { ReadStateHelper } from "../../helpers/readState";
import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
type StepsState = ProjectFormState["urbanProject"]["steps"];

export function isDeveloperBuildingsConstructor(stepsState: StepsState): boolean {
  return (
    ReadStateHelper.getStepAnswers(stepsState, "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER")
      ?.developerWillBeBuildingsConstructor ?? false
  );
}
```

### Step registration

- [x] **Step 6: Add schemas and step IDs to `urbanProjectSteps.ts`**

Add to `INTRODUCTION_STEPS` array:
```typescript
"URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION",
"URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION",
"URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO",
"URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO",
```

Add to `answersByStepSchemas`:
```typescript
URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: buildingsFootprintToReuseSchema,
URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: buildingsExistingBuildingsUsesFloorSurfaceAreaSchema,
URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: buildingsNewBuildingsUsesFloorSurfaceAreaSchema,
URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: stakeholdersBuildingsDeveloperSchema,
URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION: expensesBuildingsConstructionAndRehabilitationSchema,
```

Add to `BUILDINGS_STEPS` array:
```typescript
"URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
"URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
"URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
```

Also add `URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER` and `URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` to the buildings-related deletion logic (see Task 8).

Create the 5 schema files (minimal — just the Zod schema object and type export). Reference patterns from existing schema files (e.g., `buildingsUsesFloorSurfaceArea.schema.ts`, `expensesInstallation.schema.ts`).

- [x] **Step 7: Update stepper config registry, query string map, and view routing stubs**

**`apps/web/src/shared/views/project-form/stepper/stepperConfig.ts`**: Add 9 entries to `STEP_TO_GROUP_MAPPING`. For answer steps, add new `StepSubGroupId` values and corresponding labels in `STEP_GROUP_LABELS`:
- `"BUILDINGS_REUSE"` → "Réutilisation des bâtiments"
- `"BUILDINGS_EXISTING_USES"` → "Usages des bâtiments existants"
- `"BUILDINGS_NEW_USES"` → "Usages des nouveaux bâtiments"
- `"STAKEHOLDERS_BUILDINGS_DEVELOPER"` → "Constructeur des bâtiments"
- `"EXPENSES_BUILDINGS_CONSTRUCTION"` → "Construction et réhabilitation"

**`apps/web/src/features/create-project/views/urban-project/creationStepQueryStringMap.ts`**: Add 9 entries with descriptive query string keys (e.g., `"buildings-reuse-introduction"`, `"buildings-footprint-to-reuse"`, etc.).

**`apps/web/src/features/create-project/views/urban-project/UrbanProjectCreationWizard.tsx`**: Add 9 switch cases. For now, use placeholder `<div>TODO</div>` — actual components come in Tasks 9-10.

**`apps/web/src/features/update-project/views/UrbanProjectUpdateView.tsx`**: Add 9 switch cases (same pattern as creation wizard).

- [x] **Step 8: Run typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS (all `Record<UrbanProjectCreationStep, ...>` mappings have entries for every step ID)

- [ ] **Step 8: Commit**

```bash
git add -A && git commit -m "feat(web): add buildings readers, step registration, and schemas for buildings reuse and construction"
```

---

## Task 2: Info Handlers (4 info steps)

**Files:**
- Create: `SH/buildings/buildings-reuse-introduction/buildingsReuseIntroduction.handler.ts`
- Create: `SH/buildings/buildings-reuse-introduction/buildingsReuseIntroduction.stepperConfig.ts`
- Create: `SH/buildings/buildings-new-construction-introduction/buildingsNewConstructionIntroduction.handler.ts`
- Create: `SH/buildings/buildings-new-construction-introduction/buildingsNewConstructionIntroduction.stepperConfig.ts`
- Create: `SH/buildings/buildings-demolition-info/buildingsDemolitionInfo.handler.ts`
- Create: `SH/buildings/buildings-demolition-info/buildingsDemolitionInfo.stepperConfig.ts`
- Create: `SH/buildings/buildings-new-construction-info/buildingsNewConstructionInfo.handler.ts`
- Create: `SH/buildings/buildings-new-construction-info/buildingsNewConstructionInfo.stepperConfig.ts`
- Modify: `SH/stepHandlerRegistry.ts`

All 4 are `InfoStepHandler` instances. Follow the pattern from `buildingsIntroduction.handler.ts`.

Note: 3 of these 4 handlers have conditional navigation logic (demolition info, new construction info, new construction introduction). Write tests for their navigation in Task 11 alongside the other integration tests, since the handlers must exist first.

- [ ] **Step 1: Create `buildingsReuseIntroduction` handler**

```typescript
import type { InfoStepHandler, StepContext } from "../../stepHandler.type";

export const BuildingsReuseIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION",
  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA";
  },
  getNextStepId() {
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
};
```

Stepper config: `{ groupId: "BUILDINGS" }`

- [ ] **Step 2: Create `buildingsNewConstructionIntroduction` handler**

```typescript
export const BuildingsNewConstructionIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION",
  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA";
  },
  getNextStepId(context) {
    return getNextStepAfterBuildings(context);
  },
};
```

Import `getNextStepAfterBuildings` from `buildingsReaders.ts`. This is a potential last step in the buildings chapter (when site has no buildings).

Stepper config: `{ groupId: "BUILDINGS" }`

- [ ] **Step 3: Create `buildingsDemolitionInfo` handler**

```typescript
export const BuildingsDemolitionInfoHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO",
  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
  getNextStepId(context) {
    if (context.siteData && hasBothReuseAndNewConstruction(context.siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    if (context.siteData && willConstructNewBuildings(context.siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
    }
    return getNextStepAfterBuildings(context);
  },
};
```

This is a potential last step (when reuse > 0, new = 0, demolished > 0).

Stepper config: `{ groupId: "BUILDINGS" }`

- [ ] **Step 4: Create `buildingsNewConstructionInfo` handler**

```typescript
export const BuildingsNewConstructionInfoHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO",
  getPreviousStepId(context) {
    if (context.siteData && hasBothReuseAndNewConstruction(context.siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    if (context.siteData && willDemolishBuildings(context.siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
    }
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
  getNextStepId(context) {
    if (context.siteData && hasBothReuseAndNewConstruction(context.siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    return getNextStepAfterBuildings(context);
  },
};
```

This is a potential last step (when reuse = 0, new > 0).

Stepper config: `{ groupId: "BUILDINGS" }`

- [ ] **Step 5: Register all 4 info handlers in `stepHandlerRegistry.ts`**

Add imports and entries:
```typescript
URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION: BuildingsReuseIntroductionHandler,
URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION: BuildingsNewConstructionIntroductionHandler,
URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO: BuildingsDemolitionInfoHandler,
URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO: BuildingsNewConstructionInfoHandler,
```

- [ ] **Step 6: Run typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat(web): add 4 info step handlers for buildings reuse and construction flow"
```

---

## Task 3: `BUILDINGS_FOOTPRINT_TO_REUSE` Answer Handler

**Files:**
- Create: `SH/buildings/buildings-footprint-to-reuse/buildingsFootprintToReuse.handler.ts`
- Create: `SH/buildings/buildings-footprint-to-reuse/buildingsFootprintToReuse.selector.ts`
- Create: `SH/buildings/buildings-footprint-to-reuse/buildingsFootprintToReuse.stepperConfig.ts`
- Schema already created in Task 1

This is the key decision step with complex dependency rules.

- [ ] **Step 1: Write failing tests for handler navigation and dependency rules**

Add to `SH/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts`:

Test cases:
- `getNextStepId`: when demolished > 0 → `BUILDINGS_DEMOLITION_INFO`
- `getNextStepId`: when reuse > 0, new > 0, no demolition → `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`
- `getNextStepId`: when new > 0, no demolition, no both → `BUILDINGS_NEW_CONSTRUCTION_INFO`
- `getNextStepId`: when reuse > 0, new = 0, no demolition → exit routing (decontamination or resale)
- `getDependencyRules`: when new construction becomes 0 → deletes existing/new uses steps + stakeholder builder
- `getDependencyRules`: when reuse changes (still > 0, new still > 0) → invalidates existing uses
- `getDependencyRules`: always invalidates expenses step

Use `StoreBuilder` from `_testStoreHelpers.ts` and dispatch `stepCompletionRequested`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter web test SH/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts`
Expected: FAIL

- [ ] **Step 3: Implement handler**

```typescript
import type { AnswerStepHandler, StepContext } from "../../stepHandler.type";
import type { AnswersByStep, StepInvalidationRule } from "../../../urbanProjectSteps";
import {
  willDemolishBuildings,
  willConstructNewBuildings,
  hasBothReuseAndNewConstruction,
  getNextStepAfterBuildings,
  getBuildingsFootprintToConstruct,
  getBuildingsFootprintToReuse,
} from "../buildingsReaders";

export const BuildingsFootprintToReuseHandler: AnswerStepHandler<"URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE"> = {
  stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",

  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION";
  },

  getNextStepId(context, answers) {
    const siteData = context.siteData;
    if (!siteData) return getNextStepAfterBuildings(context);

    // Apply tentative answers to derive state
    if (willDemolishBuildings(siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
    }
    if (hasBothReuseAndNewConstruction(siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }
    if (willConstructNewBuildings(siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
    }
    return getNextStepAfterBuildings(context);
  },

  getDependencyRules(context, answers) {
    const siteData = context.siteData;
    if (!siteData) return [];

    const rules: StepInvalidationRule[] = [];

    // IMPORTANT: context.stepsState has the OLD values (before this step completion).
    // `answers` has the NEW values the user just submitted.
    // Compute derived values from the NEW reuse, not from stepsState reader functions.
    const newReuse = answers.buildingsFootprintToReuse;
    const projectBuildingsFootprint = getProjectBuildingsFootprint(context.stepsState);
    const newConstruction = Math.max(0, projectBuildingsFootprint - newReuse);
    const hasBoth = newReuse > 0 && newConstruction > 0;

    // Always invalidate expenses when reuse changes
    rules.push({
      stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
      action: "invalidate",
    });

    // Handle existing buildings uses step (only shown when both reuse > 0 AND new > 0)
    if (!hasBoth) {
      rules.push({
        stepId: "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        action: "delete",
      });
    } else {
      rules.push({
        stepId: "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        action: "invalidate",
      });
    }

    // Handle new buildings uses step (only shown when both reuse > 0 AND new > 0)
    if (!hasBoth) {
      rules.push({
        stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        action: "delete",
      });
    } else {
      rules.push({
        stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        action: "invalidate",
      });
    }

    // Handle stakeholder builder step (only shown when new construction > 0)
    if (newConstruction === 0) {
      rules.push({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        action: "delete",
      });
    }

    return rules;
  },
};

- [ ] **Step 4: Create selector factory**

Follow pattern from `buildingsUsesFloorSurfaceArea.selector.ts`:

```typescript
export const createSelectBuildingsFootprintToReuseViewData = (selectStepState) =>
  createSelector([selectStepState], (steps) => ({
    siteBuildingsFootprint: /* from siteData — need selectSiteData too */,
    currentValue: ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE")
      ?.buildingsFootprintToReuse,
  }));
```

Note: the selector needs access to `siteData` for the max constraint. Check how existing selectors access site data (they may need an additional selector input).

Stepper config: `{ groupId: "BUILDINGS" }`

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm --filter web test SH/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(web): add BUILDINGS_FOOTPRINT_TO_REUSE handler with dependency rules"
```

---

## Task 4: Uses Breakdown Handlers (Existing + New Buildings)

**Files:**
- Create: handler, selector, stepperConfig for `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`
- Create: handler, selector, stepperConfig for `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA`
- Schemas already created in Task 1

Both handlers follow a similar pattern — they collect floor area distribution per use, constrained to the uses from the overall floor area step.

- [ ] **Step 1: Write failing tests for existing buildings uses handler**

Test cases:
- `getPreviousStepId`: if demolished > 0 → `BUILDINGS_DEMOLITION_INFO`, else → `BUILDINGS_FOOTPRINT_TO_REUSE`
- `getNextStepId`: always → `BUILDINGS_NEW_CONSTRUCTION_INFO`

- [ ] **Step 2: Implement existing buildings uses handler**

```typescript
export const BuildingsExistingBuildingsUsesFloorSurfaceAreaHandler: AnswerStepHandler<"URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA"> = {
  stepId: "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA",
  getPreviousStepId(context) {
    if (context.siteData && willDemolishBuildings(context.siteData, context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
    }
    return "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
  },
  getNextStepId() {
    return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
  },
};
```

- [ ] **Step 3: Create existing buildings uses selector**

ViewData should include:
- `selectedUses` (from overall uses selection step — only uses with buildings)
- `overallUsesFloorSurfaceAreaDistribution` (recap from overall floor area step)
- `existingBuildingsUsesFloorSurfaceArea` (current answers)

- [ ] **Step 4: Write failing tests for new buildings uses handler**

Test cases:
- `getPreviousStepId`: always → `BUILDINGS_NEW_CONSTRUCTION_INFO`
- `getNextStepId`: always → `getNextStepAfterBuildings(context)` (exit routing)

- [ ] **Step 5: Implement new buildings uses handler**

```typescript
export const BuildingsNewBuildingsUsesFloorSurfaceAreaHandler: AnswerStepHandler<"URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA"> = {
  stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
  getPreviousStepId() {
    return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO";
  },
  getNextStepId(context) {
    return getNextStepAfterBuildings(context);
  },
};
```

This is the last step in the buildings chapter when both reuse AND new construction exist.

- [ ] **Step 6: Create new buildings uses selector**

ViewData should include:
- `selectedUses`
- `overallUsesFloorSurfaceAreaDistribution` (recap)
- `existingBuildingsUsesFloorSurfaceArea` (from existing buildings step — to show remaining allocation)
- `newBuildingsUsesFloorSurfaceArea` (current answers)

- [ ] **Step 7: Register both handlers in registry, add stepper configs**

Both: `{ groupId: "BUILDINGS" }`

- [ ] **Step 8: Run tests and typecheck**

Run: `pnpm --filter web test SH/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts && pnpm --filter web typecheck`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat(web): add existing and new buildings uses floor surface area handlers"
```

---

## Task 5: `STAKEHOLDERS_BUILDINGS_DEVELOPER` Answer Handler

**Files:**
- Create: handler, selector, stepperConfig for `STAKEHOLDERS_BUILDINGS_DEVELOPER`
- Schema already created in Task 1

- [ ] **Step 1: Write failing tests**

Test cases:
- `getPreviousStepId`: always → `STAKEHOLDERS_PROJECT_DEVELOPER`
- `getNextStepId`: if friche → `STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER`, else → `EXPENSES_INTRODUCTION`
- `getDependencyRules`: any change → invalidates `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`

- [ ] **Step 2: Implement handler**

```typescript
export const StakeholdersBuildingsDeveloperHandler: AnswerStepHandler<"URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER"> = {
  stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
  getPreviousStepId() {
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },
  getNextStepId(context) {
    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
    }
    return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
  },
  getDependencyRules() {
    return [
      { stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION", action: "invalidate" },
    ];
  },
};
```

- [ ] **Step 3: Create selector**

Simple ViewData: `{ developerWillBeBuildingsConstructor: boolean | undefined }`

- [ ] **Step 4: Register in registry, add stepper config**

Stepper config: `{ groupId: "STAKEHOLDERS" }`

- [ ] **Step 5: Run tests and typecheck**

Run: `pnpm --filter web test && pnpm --filter web typecheck`

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(web): add STAKEHOLDERS_BUILDINGS_DEVELOPER handler"
```

---

## Task 6: `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` Answer Handler

**Files:**
- Create: handler, selector, stepperConfig for `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`
- Schema already created in Task 1

- [ ] **Step 1: Write failing tests**

Test cases:
- `getPreviousStepId`: always → `EXPENSES_INSTALLATION`
- `getNextStepId`: same as current `EXPENSES_INSTALLATION` exit — if buildings exist and no resale → `EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES`, else → `REVENUE_INTRODUCTION`

- [ ] **Step 2: Implement handler**

```typescript
export const ExpensesBuildingsConstructionAndRehabilitationHandler: AnswerStepHandler<"URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION"> = {
  stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
  getPreviousStepId() {
    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
  },
  getNextStepId(context) {
    if (
      ReadStateHelper.willHaveBuildings(context.stepsState) &&
      !ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment(context.stepsState)
    ) {
      return "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES";
    }
    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },
};
```

- [ ] **Step 3: Create selector**

ViewData should include:
- Current answers (if any)
- `hasNewConstruction: boolean` (to conditionally show construction works field)
- `hasReuse: boolean` (to conditionally show rehabilitation works field)

- [ ] **Step 4: Register in registry, add stepper config**

Stepper config: `{ groupId: "EXPENSES" }`

- [ ] **Step 5: Run tests and typecheck**

Run: `pnpm --filter web test && pnpm --filter web typecheck`

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "feat(web): add EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION handler"
```

---

## Task 7: Navigation Updates to Existing Handlers

**Files:**
- Modify: `SH/buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.handler.ts`
- Modify: `SH/stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.handler.ts`
- Modify: `SH/stakeholders/stakeholders-reinstatement-contract-owner/stakeholdersReinstatementContractOwner.handler.ts`
- Modify: `SH/expenses/expenses-introduction/expensesIntroduction.handler.ts`
- Modify: `SH/expenses/expenses-installation/expensesInstallation.handler.ts`
- Modify: `SH/soils-decontamination/soils-decontamination-introduction/soilsDecontaminationIntroduction.handler.ts`
- Modify: `SH/site-and-buildings-resale/site-resale-introduction/siteResaleIntroduction.handler.ts`

- [ ] **Step 1: Write failing tests for navigation changes**

Add tests for each modified handler. Key assertions:

- `BUILDINGS_USES_FLOOR_SURFACE_AREA.getNextStepId`: site has buildings → `BUILDINGS_REUSE_INTRODUCTION`, no buildings → `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION`
- `STAKEHOLDERS_PROJECT_DEVELOPER.getNextStepId`: new construction > 0 → `STAKEHOLDERS_BUILDINGS_DEVELOPER`, otherwise unchanged
- `STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER.getPreviousStepId`: new construction > 0 → `STAKEHOLDERS_BUILDINGS_DEVELOPER`, otherwise `STAKEHOLDERS_PROJECT_DEVELOPER`
- `EXPENSES_INTRODUCTION.getPreviousStepId`: new construction > 0 and not friche → `STAKEHOLDERS_BUILDINGS_DEVELOPER`, otherwise unchanged
- `EXPENSES_INSTALLATION.getNextStepId`: (developer is builder OR reuse > 0) → `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`, otherwise unchanged
- `SOILS_DECONTAMINATION_INTRODUCTION.getPreviousStepId`: → `getLastBuildingsChapterStep(context)`
- `SITE_RESALE_INTRODUCTION.getPreviousStepId`: when buildings exist → `getLastBuildingsChapterStep(context)`

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm --filter web test`
Expected: FAIL on new assertions

- [ ] **Step 3: Update `buildingsUsesFloorSurfaceArea.handler.ts`**

Change `getNextStepId`:
```typescript
getNextStepId(context) {
  if (context.siteData && siteHasBuildings(context.siteData)) {
    return "URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION";
  }
  return "URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION";
},
```

Add `getDependencyRules` to invalidate breakdown steps when overall distribution changes:
```typescript
getDependencyRules(context) {
  return [
    { stepId: "URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA", action: "invalidate" },
    { stepId: "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA", action: "invalidate" },
  ];
},
```

- [ ] **Step 4: Update `stakeholdersProjectDeveloper.handler.ts`**

Change `getNextStepId`:
```typescript
getNextStepId(context) {
  if (context.siteData && willConstructNewBuildings(context.siteData, context.stepsState)) {
    return "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";
  }
  if (context.siteData?.nature === "FRICHE") {
    return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
  }
  return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
},
```

- [ ] **Step 5: Update `stakeholdersReinstatementContractOwner.handler.ts`**

Change `getPreviousStepId`:
```typescript
getPreviousStepId(context) {
  if (context.siteData && willConstructNewBuildings(context.siteData, context.stepsState)) {
    return "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";
  }
  return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
},
```

- [ ] **Step 6: Update `expensesIntroduction.handler.ts`**

Change `getPreviousStepId` to also check for `STAKEHOLDERS_BUILDINGS_DEVELOPER`:
```typescript
getPreviousStepId(context) {
  if (context.siteData?.nature === "FRICHE") {
    return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
  }
  if (context.siteData && willConstructNewBuildings(context.siteData, context.stepsState)) {
    return "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";
  }
  return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
},
```

- [ ] **Step 7: Update `expensesInstallation.handler.ts`**

Change `getNextStepId` to route through new expenses step:
```typescript
getNextStepId(context) {
  const reuse = getBuildingsFootprintToReuse(context.stepsState) ?? 0;
  if (isDeveloperBuildingsConstructor(context.stepsState) || reuse > 0) {
    return "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION";
  }
  if (
    ReadStateHelper.willHaveBuildings(context.stepsState) &&
    !ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment(context.stepsState)
  ) {
    return "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES";
  }
  return "URBAN_PROJECT_REVENUE_INTRODUCTION";
},
```

- [ ] **Step 8: Update `soilsDecontaminationIntroduction.handler.ts`**

Change `getPreviousStepId` to use `getLastBuildingsChapterStep`:
```typescript
getPreviousStepId(context) {
  if (ReadStateHelper.willHaveBuildings(context.stepsState)) {
    return getLastBuildingsChapterStep(context);
  }
  return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
},
```

- [ ] **Step 9: Update `siteResaleIntroduction.handler.ts`**

Change the buildings branch to use `getLastBuildingsChapterStep`:
```typescript
// Replace the direct reference to BUILDINGS_USES_FLOOR_SURFACE_AREA:
if (ReadStateHelper.willHaveBuildings(context.stepsState)) {
  return getLastBuildingsChapterStep(context);
}
```

- [ ] **Step 10: Run all tests**

Run: `pnpm --filter web test && pnpm --filter web typecheck`
Expected: PASS

- [ ] **Step 11: Commit**

```bash
git add -A && git commit -m "feat(web): update existing handler navigation for buildings reuse and construction flow"
```

---

## Task 8: Upstream Cascading Deletion

**Files:**
- Modify: `SH/../urbanProjectSteps.ts` (if `BUILDINGS_STEPS` needs the 2 non-buildings steps)
- Modify: `SH/uses/selection/usesSelection.handler.ts`
- Modify: `SH/spaces/getCommonRules.ts` (if applicable)

When uses or spaces change such that buildings are removed, the new answer steps must also be deleted.

- [ ] **Step 1: Write failing test**

Test: when `URBAN_PROJECT_USES_SELECTION` changes and buildings are removed, the new steps are deleted:
- `URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE`
- `URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`
- `URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA`
- `URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER`
- `URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`

- [ ] **Step 2: Update both cascading mechanisms**

Two mechanisms exist and both need updating:
1. **`usesSelection.handler.ts`**: Uses manual `ReadStateHelper.getStep()` checks to delete individual buildings steps. Add manual delete rules for the 5 new answer steps.
2. **`getCommonRules.ts` → `getDeleteBuildingsRules`**: Uses `BUILDINGS_STEPS` array and is called from spaces handlers. The 3 new buildings answer steps were already added to `BUILDINGS_STEPS` in Task 1. Additionally, add manual delete rules for `STAKEHOLDERS_BUILDINGS_DEVELOPER` and `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` here too (they're not in `BUILDINGS_STEPS` but must be deleted when buildings are removed).

- [ ] **Step 3: Add new steps to cascading deletion**

Update whichever mechanism is used. Add `URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER` and `URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` to the deletion logic (these are not in `BUILDINGS_STEPS` but must be deleted when buildings are removed).

- [ ] **Step 4: Run tests**

Run: `pnpm --filter web test && pnpm --filter web typecheck`

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "feat(web): add new buildings steps to upstream cascading deletion rules"
```

---

## Task 9: View Components for Info Steps

**Files:**
- Create: container + presentational for reuse introduction, new construction introduction, demolition info, new construction info
- Modify: step → component routing/mapping

- [ ] **Step 1: Create reuse introduction view**

Container (`SV/buildings/reuse-introduction/index.tsx`):
```typescript
function BuildingsReuseIntroductionContainer() {
  const { onBack, onNext } = useProjectForm();
  return <BuildingsReuseIntroduction onNext={onNext} onBack={onBack} />;
}
```

Presentational: editorial page with title "Bonne nouvelle ! Le site comporte déjà des bâtiments" and body "Vous pouvez utiliser tout ou partie de ce bâti dans votre projet d'aménagement."

- [ ] **Step 2: Create new construction introduction view (no buildings on site)**

Container needs `siteBuildingsFootprint` from selector to display "X m² de surface au sol de nouveaux bâtiments seront à construire pour le projet urbain" with the dynamic m² value.

Create a selector that reads project buildings footprint from spaces step.

- [ ] **Step 3: Create demolition info view**

Container needs `demolishedSurfaceArea` from selector.
Title: "X m² de bâtiments seront démolis"
Body: "Il s'agit de la surface des bâtiments existants que vous ne prévoyez pas d'utiliser dans votre projet."

- [ ] **Step 4: Create new construction info view (after reuse input)**

Container needs `newConstructionSurfaceArea` from selector.
Title: "X m² de surface au sol de nouveaux bâtiments seront à construire pour le projet urbain"

- [ ] **Step 5: Add all 4 to step → component mapping**

Find where step IDs are mapped to React components (likely in a switch/object in the project form view). Add entries for all 4 info steps.

- [ ] **Step 6: Run typecheck and lint**

Run: `pnpm --filter web typecheck && pnpm --filter web lint`

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "feat(web): add view components for buildings info steps"
```

---

## Task 10: View Components for Answer Steps

**Files:**
- Create: container + presentational for footprint to reuse, existing buildings uses, new buildings uses, stakeholder builder, expenses
- Modify: step → component routing/mapping

- [ ] **Step 1: Create footprint to reuse form**

Form with:
- m² number input with % toggle (switchable)
- Max = site buildings footprint
- Hint showing site buildings footprint
- Uses `react-hook-form` with Zod resolver

Look at existing forms with similar m² / % toggle for reference (search codebase for toggle patterns).

- [ ] **Step 2: Create existing buildings uses floor surface area form**

Follow pattern from `SV/buildings/uses-floor-surface-area/` (the existing overall form). Key differences:
- Title: "Quels usages accueilleront les bâtiments existants ?"
- Instructions: show recap of overall uses distribution
- Constrained to uses from overall step

- [ ] **Step 3: Create new buildings uses floor surface area form**

Same pattern as existing buildings form. Key differences:
- Title: "Quels usages accueilleront les nouveaux bâtiments ?"
- Instructions: show recap + remaining after existing allocation

- [ ] **Step 4: Create stakeholder builder form**

Simple Yes/No radio form.
Title: "L'aménageur sera-t-il le constructeur des nouveaux bâtiments ?"

Check existing yes/no forms for pattern (e.g., buildings resale selection).

- [ ] **Step 5: Create construction and rehabilitation expenses form**

Follow existing expense form pattern (e.g., `SV/expenses/installation/`).
Title: "Dépenses de construction et réhabilitation de bâtiments"
4 amount fields (2 conditional):
- "Études et honoraires techniques" (always)
- "Travaux de construction des bâtiments" (if new construction > 0)
- "Travaux de réhabilitation des bâtiments" (if reuse > 0)
- "Autres dépenses de construction ou de réhabilitation" (always)

- [ ] **Step 6: Add all 5 to step → component mapping**

- [ ] **Step 7: Register all new selectors in `urbanProject.selectors.ts`**

Add selector factories to `createUrbanProjectFormSelectors`.

- [ ] **Step 8: Run typecheck, lint, format**

Run: `pnpm --filter web typecheck && pnpm --filter web lint && pnpm --filter web format`

- [ ] **Step 9: Commit**

```bash
git add -A && git commit -m "feat(web): add view components for buildings answer steps"
```

---

## Task 11: Integration Tests (Exhaustive Scenarios)

**Files:**
- Create/extend: `SH/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts`

Follow the pattern from `apps/web/src/features/create-site/core/urban-zone/steps/management/__tests__/`.

- [ ] **Step 1: Write test for "no buildings on site" scenario**

Setup: site with no BUILDINGS in soils, project with BUILDINGS in spaces.
Assert: after floor area step, navigates to `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION` → exit.

- [ ] **Step 2: Write test for "full reuse, same size" scenario**

Setup: site BUILDINGS = 2000, project BUILDINGS = 2000.
Assert: reuse intro → reuse input (2000) → no demolition → no new construction → exit.

- [ ] **Step 3: Write test for "partial reuse with demolition only" scenario**

Setup: site BUILDINGS = 2000, project BUILDINGS = 1500.
Assert: reuse input (1500) → demolition info (500 m²) → no existing uses → no new construction → exit.

- [ ] **Step 4: Write test for "full reuse with new construction" scenario**

Setup: site BUILDINGS = 2000, project BUILDINGS = 3000.
Assert: reuse input (2000) → no demolition → existing uses step → new construction info (1000 m²) → new uses step → exit.

- [ ] **Step 5: Write test for "partial reuse with both demolition and new construction"**

Setup: site BUILDINGS = 2000, project BUILDINGS = 3000, reuse = 1000.
Assert: full flow including all steps.

- [ ] **Step 6: Write test for "no reuse at all"**

Setup: site BUILDINGS = 2000, project BUILDINGS = 3000, reuse = 0.
Assert: demolition info (2000 m²) → no existing uses → new construction info (3000 m²) → no new uses → exit.

- [ ] **Step 7: Write dependency rules tests**

- Reuse changes invalidate/delete downstream steps correctly
- Stakeholder builder change invalidates expenses
- Overall floor area change invalidates breakdown steps

- [ ] **Step 8: Write navigation tests (forward + backward)**

Test `getPreviousStepId` for all conditional branches.

- [ ] **Step 9: Run all tests**

Run: `pnpm --filter web test`
Expected: PASS

- [ ] **Step 10: Commit**

```bash
git add -A && git commit -m "test(web): add exhaustive integration tests for buildings reuse and construction flow"
```

---

## Task 12: Quality Checks

- [ ] **Step 1: Run full quality suite**

```bash
pnpm --filter web typecheck && pnpm --filter web lint && pnpm --filter web format && pnpm --filter web test
```

All must pass.

- [ ] **Step 2: Fix any issues**

- [ ] **Step 3: Commit any fixes**

```bash
git add -A && git commit -m "fix(web): address quality check issues in buildings reuse and construction"
```

---

## Task 13: E2E Tests (3 Nominal Flows)

**Files:**
- Create: page objects for buildings reuse/construction steps
- Create: E2E test spec for the 3 scenarios
- Modify: existing page objects if needed for navigation

Follow `@.claude/skills/create-e2e-test/SKILL.md` and `apps/e2e-tests/CLAUDE.md`.

- [ ] **Step 1: Create page objects**

Create page objects with methods for:
- Filling reuse amount (m² or %)
- Verifying editorial pages are shown with correct m² values
- Filling uses breakdown forms
- Answering stakeholder builder question
- Filling expense amounts

- [ ] **Step 2: Write E2E test: "no buildings on site"**

Setup: create site with no BUILDINGS soil type, create urban project with building uses.
Assert: "X m² à construire" editorial shown, no reuse input appears.

- [ ] **Step 3: Write E2E test: "no reuse at all"**

Setup: create site WITH BUILDINGS, create urban project with building uses.
Assert: "Bonne nouvelle" shown, set reuse to 0, verify demolition editorial, verify new construction editorial, no uses breakdown.

- [ ] **Step 4: Write E2E test: "full reuse with new construction"**

Setup: create site with BUILDINGS = small, create urban project with BUILDINGS = larger.
Assert: set reuse to 100%, no demolition, existing + new uses breakdown shown, stakeholder builder question shown, expenses step shown.

- [ ] **Step 5: Run E2E tests**

Use `/run-e2e-tests` skill to start the stack and run tests.

- [ ] **Step 6: Fix any failures**

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "test(e2e): add 3 nominal E2E scenarios for buildings reuse and construction"
```
