# Urban Project Engine Alignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adopt urban zone's stronger typing patterns into the urban project wizard engine, preparing both engines for future unification into a generic shared engine.

**Architecture:** Four incremental refactors to the urban project step handler system: correlated mapped type for the registry, `completeStepFromPayload` method, `satisfies` on all handler declarations, and domain reader extraction. Each increment is a self-contained commit that leaves all tests green.

**Tech Stack:** TypeScript 5+ (strict), Redux Toolkit, Vitest

**Spec:** `docs/superpowers/specs/2026-03-23-urban-project-engine-alignment-design.md`

**Base path:** All file paths below are relative to `apps/web/src/shared/core/reducers/project-form/urban-project/` unless otherwise noted.

---

## Task 1: Split stepHandlerRegistry into correlated answer registry + combined registry

**Files:**
- Modify: `step-handlers/stepHandlerRegistry.ts`

- [ ] **Step 1: Add `AnswerStepHandlerMap` type and `answerStepHandlers` export**

Add the correlated mapped type and a new export containing only the 25 answer handlers. Keep the existing `stepHandlerRegistry` intact for now.

In `step-handlers/stepHandlerRegistry.ts`, add before the existing `stepHandlerRegistry`:

```typescript
import type { AnswerStepHandler, InfoStepHandler } from "./stepHandler.type";
import type { AnswerStepId, UrbanProjectCreationStep } from "../urbanProjectSteps";

// Correlated mapped type: lookup with generic T yields AnswerStepHandler<T>
type AnswerStepHandlerMap = {
  [K in AnswerStepId]: AnswerStepHandler<K>;
};

export const answerStepHandlers: AnswerStepHandlerMap = {
  URBAN_PROJECT_CREATE_MODE_SELECTION: CreationModeSelectionHandler,
  URBAN_PROJECT_EXPRESS_TEMPLATE_SELECTION: ExpressTemplateSelectionHandler,
  URBAN_PROJECT_USES_SELECTION: UsesSelectionHandler,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: PublicGreenSpacesSurfaceAreaHandler,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: PublicGreenSpacesSoilsDistributionHandler,
  URBAN_PROJECT_SPACES_SELECTION: SpacesSelectionHandler,
  URBAN_PROJECT_SPACES_SURFACE_AREA: SpacesSurfaceAreaHandler,
  URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION: SoilsDecontaminationSelectionHandler,
  URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA: SoilsDecontaminationSurfaceAreaHandler,
  URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: BuildingsUsesFloorSurfaceAreaHandler,
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: StakeholdersProjectDeveloperHandler,
  URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: StakeholdersReinstatementContractOwnerHandler,
  URBAN_PROJECT_SITE_RESALE_SELECTION: SiteResaleSelectionHandler,
  URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: BuildingsResaleSelectionHandler,
  URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS: ExpensesSitePurchaseAmountsHandler,
  URBAN_PROJECT_EXPENSES_REINSTATEMENT: UrbanProjectReinstatementExpensesHandler,
  URBAN_PROJECT_EXPENSES_INSTALLATION: UrbanProjectInstallationExpensesHandler,
  URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: ExpensesProjectedBuildingsOperatingExpensesHandler,
  URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: RevenueExpectedSiteResaleHandler,
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: RevenueBuildingsResaleHandler,
  URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: RevenueBuildingsOperationsYearlyRevenuesHandler,
  URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE: RevenueFinancialAssistanceHandler,
  URBAN_PROJECT_SCHEDULE_PROJECTION: UrbanProjectScheduleProjectionHandler,
  URBAN_PROJECT_PROJECT_PHASE: ProjectPhaseHandler,
  URBAN_PROJECT_NAMING: UrbanProjectNamingHandler,
};
```

- [ ] **Step 2: Retype `stepHandlerRegistry` to use `answerStepHandlers` spread + info handlers**

Replace the existing `stepHandlerRegistry` with a combined registry that spreads `answerStepHandlers` and adds only the 15 info/summary handlers:

```typescript
export const stepHandlerRegistry: Record<
  UrbanProjectCreationStep,
  InfoStepHandler | AnswerStepHandler<AnswerStepId>
> = {
  ...answerStepHandlers,
  // express
  URBAN_PROJECT_EXPRESS_SUMMARY: ExpressSummaryHandler,
  URBAN_PROJECT_EXPRESS_CREATION_RESULT: ExpressCreationResultHandler,
  // uses
  URBAN_PROJECT_USES_INTRODUCTION: UsesIntroductionHandler,
  // spaces
  URBAN_PROJECT_SPACES_INTRODUCTION: SpacesIntroductionHandler,
  URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION: PublicGreenSpacesIntroductionHandler,
  URBAN_PROJECT_SPACES_SOILS_SUMMARY: SoilsSummaryHandler,
  URBAN_PROJECT_SOILS_CARBON_SUMMARY: SoilsCarbonSummaryHandler,
  // buildings
  URBAN_PROJECT_BUILDINGS_INTRODUCTION: BuildingsIntroductionHandler,
  // decontamination
  URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION: SoilsDecontaminationIntroductionHandler,
  // stakeholders and resale
  URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION: StakeholdersIntroductionHandler,
  URBAN_PROJECT_SITE_RESALE_INTRODUCTION: SiteResaleIntroductionHandler,
  URBAN_PROJECT_EXPENSES_INTRODUCTION: ExpensesIntroductionHandler,
  URBAN_PROJECT_REVENUE_INTRODUCTION: RevenueIntroductionHandler,
  // summary and result
  URBAN_PROJECT_FINAL_SUMMARY: FinalSummaryHandler,
  URBAN_PROJECT_CREATION_RESULT: CreationResultHandler,
};
```

Remove the old `as const` declaration entirely.

- [ ] **Step 3: Verify typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS. If any answer handler is missing from `answerStepHandlers`, TypeScript will error with "Property 'URBAN_PROJECT_...' is missing in type".

- [ ] **Step 4: Verify tests**

Run: `pnpm --filter web test`
Expected: All tests pass (no runtime change).

- [ ] **Step 5: Commit**

```
refactor(web): split step handler registry into correlated answer + combined registries
```

---

## Task 2: Switch consumers to use `answerStepHandlers` for type-correlated lookups

**Files:**
- Modify: `helpers/completeStep.ts`
- Modify: `helpers/navigateToStep.ts`

- [ ] **Step 1: Update imports in `completeStep.ts`**

In `helpers/completeStep.ts`, add the `answerStepHandlers` import:

```typescript
import { answerStepHandlers, stepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";
```

(Keep both imports — `stepHandlerRegistry` is still used for the sequence computation check at the end of `applyStepChanges`.)

- [ ] **Step 2: Switch `computeStepChanges` to use `answerStepHandlers`**

In `computeStepChanges` (line 66), change:

```typescript
const handler = stepHandlerRegistry[payload.stepId];
```

to:

```typescript
const handler = answerStepHandlers[payload.stepId];
```

- [ ] **Step 3: Switch `processShortcutInvalidations` to use `answerStepHandlers`**

In `processShortcutInvalidations` (line 31), change:

```typescript
const shortcutHandler = stepHandlerRegistry[completeStepShortcut.stepId];
```

to:

```typescript
const shortcutHandler = answerStepHandlers[completeStepShortcut.stepId];
```

- [ ] **Step 4: Switch `applyStepChanges` recompute case to use `answerStepHandlers`**

In `applyStepChanges` (line 134), change:

```typescript
const newValue = stepHandlerRegistry[stepId].getRecomputedStepAnswers?.({
```

to:

```typescript
const newValue = answerStepHandlers[stepId].getRecomputedStepAnswers?.({
```

- [ ] **Step 5: Update `navigateToStep.ts` to use `answerStepHandlers`**

In `helpers/navigateToStep.ts`, change the import:

```typescript
import { answerStepHandlers } from "../step-handlers/stepHandlerRegistry";
```

And update line 11:

```typescript
const handler = answerStepHandlers[stepId];
```

(Remove `stepHandlerRegistry` import entirely from this file — it's no longer needed here.)

- [ ] **Step 6: Verify typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS. The correlated mapped type means `answerStepHandlers[payload.stepId]` returns `AnswerStepHandler<T>` when `payload.stepId` is typed as `T`.

- [ ] **Step 7: Verify tests**

Run: `pnpm --filter web test`
Expected: All tests pass.

- [ ] **Step 8: Commit**

```
refactor(web): use correlated answerStepHandlers for type-safe handler lookups
```

---

## Task 3: Add `completeStepFromPayload` to MutateStateHelper

**Files:**
- Modify: `helpers/mutateState.ts`
- Test: `helpers/mutateState.spec.ts`

- [ ] **Step 1: Write the failing test**

Add to `helpers/mutateState.spec.ts`, inside the top-level `describe("MutateStateHelper")`, after the `deleteStep` describe block:

```typescript
describe("completeStepFromPayload", () => {
  it("should mark step as completed and set payload from bundled payload", () => {
    MutateStateHelper.completeStepFromPayload(state, {
      stepId: "URBAN_PROJECT_NAMING",
      answers: { name: "Project Name", description: "Project Description" },
    });

    expect(state.urbanProject.steps.URBAN_PROJECT_NAMING).toEqual({
      completed: true,
      payload: { name: "Project Name", description: "Project Description" },
    });
  });

  it("should create step if it does not exist", () => {
    MutateStateHelper.completeStepFromPayload(state, {
      stepId: "URBAN_PROJECT_NAMING",
      answers: { name: "Test", description: "Test" },
    });

    expect(state.urbanProject.steps.URBAN_PROJECT_NAMING).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter web test helpers/mutateState.spec.ts`
Expected: FAIL — `completeStepFromPayload` is not a function.

- [ ] **Step 3: Implement `completeStepFromPayload`**

In `helpers/mutateState.ts`, add the import:

```typescript
import type { StepCompletionPayload } from "../urbanProject.actions";
```

Add the new method to `MutateStateHelper`, after `completeStep`:

```typescript
completeStepFromPayload(state: ProjectFormState, payload: StepCompletionPayload) {
  const step = this.ensureStepExists(state, payload.stepId, true);
  step.completed = true;
  step.payload = payload.answers;
},
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter web test helpers/mutateState.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```
refactor(web): add completeStepFromPayload to preserve discriminated union correlation
```

---

## Task 4: Use `completeStepFromPayload` in shortcut loop

**Files:**
- Modify: `helpers/completeStep.ts`

- [ ] **Step 1: Replace shortcut loop in `applyStepChanges`**

In `helpers/completeStep.ts`, change lines 121-123:

```typescript
shortcutComplete?.forEach((stepShortcut) => {
  MutateStateHelper.completeStep(state, stepShortcut.stepId, stepShortcut.answers);
});
```

to:

```typescript
shortcutComplete?.forEach((stepShortcut) => {
  MutateStateHelper.completeStepFromPayload(state, stepShortcut);
});
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS

- [ ] **Step 3: Verify tests**

Run: `pnpm --filter web test`
Expected: All tests pass (existing shortcut tests cover this path via integration tests in `features/create-project/core/urban-project/__tests__/`).

- [ ] **Step 4: Commit**

```
refactor(web): use completeStepFromPayload in shortcut loop
```

---

## Task 5: Switch answer handlers to `satisfies` (batch 1 — handlers with `STEP_ID` constant)

**Files:**
- Modify: 8 handler files that use `const STEP_ID`

The 8 files are:
- `step-handlers/uses/selection/usesSelection.handler.ts`
- `step-handlers/uses/public-green-spaces-surface-area/publicGreenSpacesSurfaceArea.handler.ts`
- `step-handlers/spaces/spaces-selection/spacesSelection.handler.ts`
- `step-handlers/spaces/spaces-surface-area/spacesSurfaceArea.handler.ts`
- `step-handlers/spaces/public-green-spaces-soils-distribution/publicGreenSpacesSoilsDistribution.handler.ts`
- `step-handlers/buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.handler.ts`
- `step-handlers/site-and-buildings-resale/site-resale-selection/siteResaleSelection.handler.ts`
- `step-handlers/site-and-buildings-resale/buildings-resale-selection/buildingsResaleSelection.handler.ts`

- [ ] **Step 1: Transform all 8 files**

For each file, apply this mechanical transformation:

Before:
```typescript
export const SomeHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,
  // ...
};
```

After:
```typescript
export const SomeHandler = {
  stepId: STEP_ID,
  // ...
} satisfies AnswerStepHandler<typeof STEP_ID>;
```

Change the `AnswerStepHandler` import from value import to type import if not already:
```typescript
import type { AnswerStepHandler } from "../../stepHandler.type";
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```
refactor(web): switch answer handlers with STEP_ID constant to satisfies
```

---

## Task 6: Switch answer handlers to `satisfies` (batch 2 — handlers with inline string literals)

**Files:**
- Modify: 17 answer handler files that use inline string literals

- [ ] **Step 1: Transform all 17 files**

For each file, apply this mechanical transformation:

Before:
```typescript
export const CreationModeSelectionHandler: AnswerStepHandler<"URBAN_PROJECT_CREATE_MODE_SELECTION"> =
  {
    stepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",
    // ...
  };
```

After:
```typescript
export const CreationModeSelectionHandler = {
  stepId: "URBAN_PROJECT_CREATE_MODE_SELECTION",
  // ...
} satisfies AnswerStepHandler<"URBAN_PROJECT_CREATE_MODE_SELECTION">;
```

Change the `AnswerStepHandler` import from value import to type import if not already:
```typescript
import type { AnswerStepHandler } from "../../stepHandler.type";
```

Note: Some handlers also import `StepContext` or `StepInvalidationRule` as value imports alongside `AnswerStepHandler`. Ensure `AnswerStepHandler` becomes a type import but keep non-type imports as value imports. Use separate import statements if needed:
```typescript
import type { AnswerStepHandler } from "../../stepHandler.type";
import { type StepContext, type StepInvalidationRule } from "../../stepHandler.type";
```

Or combine with `type` keyword per-specifier:
```typescript
import { type AnswerStepHandler, type StepContext, type StepInvalidationRule } from "../../stepHandler.type";
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS

- [ ] **Step 3: Commit**

```
refactor(web): switch answer handlers with inline literals to satisfies
```

---

## Task 7: Switch info handlers to `satisfies`

**Files:**
- Modify: 15 info handler files

- [ ] **Step 1: Transform all 15 files**

For each file, apply this mechanical transformation:

Before:
```typescript
export const SpacesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SPACES_INTRODUCTION",
  // ...
};
```

After:
```typescript
export const SpacesIntroductionHandler = {
  stepId: "URBAN_PROJECT_SPACES_INTRODUCTION",
  // ...
} satisfies InfoStepHandler;
```

Change the `InfoStepHandler` import to type import if not already:
```typescript
import type { InfoStepHandler } from "../../stepHandler.type";
```

- [ ] **Step 2: Verify typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS

- [ ] **Step 3: Verify all tests still pass**

Run: `pnpm --filter web test`
Expected: All tests pass (no runtime change across tasks 5-7).

- [ ] **Step 4: Commit**

```
refactor(web): switch info handlers to satisfies
```

---

## Task 8: Create domain reader files (buildings + site resale)

**Files:**
- Create: `helpers/readers/buildingsReaders.ts`
- Create: `helpers/readers/siteResaleReaders.ts`

- [ ] **Step 1: Create `helpers/readers/buildingsReaders.ts`**

```typescript
import { doesUseIncludeBuildings } from "shared";

import type { ProjectFormState } from "../../../projectForm.reducer";
import { ReadStateHelper } from "../readState";

type Steps = ProjectFormState["urbanProject"]["steps"];

export function willHaveBuildings(steps: Steps): boolean {
  const selectedUses =
    ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_USES_SELECTION")?.usesSelection ?? [];
  return selectedUses.some((use) => doesUseIncludeBuildings(use));
}

export function hasBuildingsResalePlannedAfterDevelopment(
  steps: Steps,
): boolean | undefined {
  return ReadStateHelper.getStepAnswers(
    steps,
    "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
  )?.buildingsResalePlannedAfterDevelopment;
}
```

- [ ] **Step 2: Create `helpers/readers/siteResaleReaders.ts`**

```typescript
import type { ProjectFormState } from "../../../projectForm.reducer";
import { ReadStateHelper } from "../readState";

type Steps = ProjectFormState["urbanProject"]["steps"];

export function getSiteResaleSelection(steps: Steps) {
  return ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SITE_RESALE_SELECTION")
    ?.siteResaleSelection;
}

export function isSiteResalePlannedAfterDevelopment(steps: Steps): boolean {
  const selection = getSiteResaleSelection(steps);
  return selection === "yes" || selection === "unknown";
}

export function shouldSiteResalePriceBeEstimated(steps: Steps): boolean {
  return getSiteResaleSelection(steps) === "unknown";
}
```

- [ ] **Step 3: Verify typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS (new files compile, no consumers yet).

- [ ] **Step 4: Commit**

```
refactor(web): create buildings and site resale domain reader files
```

---

## Task 9: Create domain reader files (soils + project data)

**Files:**
- Create: `helpers/readers/soilsReaders.ts`
- Create: `helpers/readers/projectDataReaders.ts`

- [ ] **Step 1: Create `helpers/readers/soilsReaders.ts`**

Copy `getProjectSoilDistribution` and `getProjectSoilDistributionBySoilType` from `readState.ts`, converting `this.getStepAnswers(...)` to `ReadStateHelper.getStepAnswers(...)`:

```typescript
import { getProjectSoilDistributionByType, typedObjectEntries } from "shared";

import type { ProjectFormState } from "../../../projectForm.reducer";
import { ReadStateHelper } from "../readState";

type Steps = ProjectFormState["urbanProject"]["steps"];

export function getProjectSoilDistribution(steps: Steps) {
  const publicGreenSpacesSoilsDistribution = ReadStateHelper.getStepAnswers(
    steps,
    "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
  )?.publicGreenSpacesSoilsDistribution;

  const spacesSurfaceAreaDistribution = ReadStateHelper.getStepAnswers(
    steps,
    "URBAN_PROJECT_SPACES_SURFACE_AREA",
  )?.spacesSurfaceAreaDistribution;

  return [
    ...typedObjectEntries(publicGreenSpacesSoilsDistribution ?? {})
      .filter(([, surfaceArea]) => surfaceArea)
      .map(([soilType, surfaceArea = 0]) => ({
        surfaceArea,
        soilType,
        spaceCategory: "PUBLIC_GREEN_SPACE" as const,
      })),
    ...typedObjectEntries(spacesSurfaceAreaDistribution ?? {})
      .filter(([, surfaceArea]) => surfaceArea)
      .map(([soilType, surfaceArea = 0]) => ({
        surfaceArea,
        soilType,
      })),
  ];
}

export function getProjectSoilDistributionBySoilType(steps: Steps) {
  return getProjectSoilDistributionByType(getProjectSoilDistribution(steps));
}
```

- [ ] **Step 2: Create `helpers/readers/projectDataReaders.ts`**

Copy `getProjectData` from `readState.ts`, converting `this.` calls to imports from the other reader files and `ReadStateHelper`:

```typescript
import type { ProjectFormState } from "../../../projectForm.reducer";
import { DEFAULT_FUTURE_SITE_OWNER } from "../../../helpers/stakeholders";
import type { UrbanProjectFormData } from "../../urbanProjectSteps";
import { ReadStateHelper } from "../readState";
import { getProjectSoilDistribution } from "./soilsReaders";
import { isSiteResalePlannedAfterDevelopment } from "./siteResaleReaders";

type Steps = ProjectFormState["urbanProject"]["steps"];

export function getProjectData(steps: Steps): Partial<UrbanProjectFormData> {
  return {
    name: steps.URBAN_PROJECT_NAMING?.payload?.name,
    description: steps.URBAN_PROJECT_NAMING?.payload?.description,
    reinstatementContractOwner:
      steps.URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER?.payload
        ?.reinstatementContractOwner,
    reinstatementCosts:
      steps.URBAN_PROJECT_EXPENSES_REINSTATEMENT?.payload?.reinstatementExpenses,
    sitePurchaseSellingPrice:
      steps.URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS?.payload?.sitePurchaseSellingPrice,
    sitePurchasePropertyTransferDuties:
      steps.URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS?.payload
        ?.sitePurchasePropertyTransferDuties,
    siteResaleExpectedSellingPrice:
      steps.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE?.payload?.siteResaleExpectedSellingPrice,
    siteResaleExpectedPropertyTransferDuties:
      steps.URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE?.payload
        ?.siteResaleExpectedPropertyTransferDuties,
    financialAssistanceRevenues:
      steps.URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE?.payload?.financialAssistanceRevenues,
    yearlyProjectedCosts:
      steps.URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES?.payload
        ?.yearlyProjectedBuildingsOperationsExpenses ?? [],
    yearlyProjectedRevenues:
      steps.URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES?.payload
        ?.yearlyProjectedRevenues ?? [],
    soilsDistribution: getProjectSoilDistribution(steps),
    reinstatementSchedule:
      steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.reinstatementSchedule,
    operationsFirstYear: steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.firstYearOfOperation,
    futureOperator: steps.URBAN_PROJECT_BUILDINGS_RESALE_SELECTION?.payload?.futureOperator,
    futureSiteOwner: isSiteResalePlannedAfterDevelopment(steps)
      ? DEFAULT_FUTURE_SITE_OWNER
      : undefined,
    developmentPlan: {
      type: "URBAN_PROJECT",
      developer: steps.URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER?.payload
        ?.projectDeveloper ?? { structureType: "", name: "" },
      costs: steps.URBAN_PROJECT_EXPENSES_INSTALLATION?.payload?.installationExpenses ?? [],
      installationSchedule:
        steps.URBAN_PROJECT_SCHEDULE_PROJECTION?.payload?.installationSchedule,
      features: {
        buildingsFloorAreaDistribution:
          steps.URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA?.payload
            ?.usesFloorSurfaceAreaDistribution ?? {},
      },
    },
    projectPhase: steps.URBAN_PROJECT_PROJECT_PHASE?.payload?.projectPhase,
    decontaminatedSoilSurface:
      steps.URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA?.payload?.decontaminatedSurfaceArea,
    buildingsResaleExpectedPropertyTransferDuties:
      steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.payload
        ?.buildingsResalePropertyTransferDuties,
    buildingsResaleExpectedSellingPrice:
      steps.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE?.payload?.buildingsResaleSellingPrice,
  };
}
```

- [ ] **Step 3: Verify typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS

- [ ] **Step 4: Commit**

```
refactor(web): create soils and project data domain reader files
```

---

## Task 10: Remove domain methods from ReadStateHelper and update consumers

**Files:**
- Modify: `helpers/readState.ts`
- Modify: ~16 consumer files
- Modify: `helpers/readState.spec.ts`

- [ ] **Step 1: Remove 8 domain methods from `readState.ts`**

Keep only `getStep`, `getStepAnswers`, and `getDefaultAnswers` in `ReadStateHelper`. Remove:
- `willHaveBuildings`
- `hasBuildingsResalePlannedAfterDevelopment`
- `getSiteResaleSelection`
- `isSiteResalePlannedAfterDevelopment`
- `shouldSiteResalePriceBeEstimated`
- `getProjectSoilDistribution`
- `getProjectSoilDistributionBySoilType`
- `getProjectData`

Also remove imports that are now only used by the removed methods (`doesUseIncludeBuildings`, `getProjectSoilDistributionByType`, `typedObjectEntries`, `DEFAULT_FUTURE_SITE_OWNER`, `UrbanProjectFormData`).

- [ ] **Step 2: Update all consumer files**

For each of the ~16 consumer files, replace:
```typescript
import { ReadStateHelper } from "path/to/readState";
// ...
ReadStateHelper.willHaveBuildings(context.stepsState)
```

with:
```typescript
import { willHaveBuildings } from "path/to/readers/buildingsReaders";
// ...
willHaveBuildings(context.stepsState)
```

Apply the same pattern for all domain reader calls. Each consumer file may reference multiple domain readers — import from the appropriate reader file.

Keep `ReadStateHelper` imports in files that still use `getStep`, `getStepAnswers`, or `getDefaultAnswers`.

- [ ] **Step 3: Move domain method tests to reader test files**

Create 3 new test files and move the corresponding `describe` blocks from `readState.spec.ts`. Keep the 3 generic accessor tests (`getStep`, `getStepAnswers`, `getDefaultAnswers`) in `readState.spec.ts`.

Create `helpers/readers/buildingsReaders.spec.ts` — move 2 describe blocks:
- `willHaveBuildings` (3 tests)
- `hasBuildingsResalePlannedAfterDevelopment` (3 tests)
- Replace `ReadStateHelper.willHaveBuildings(steps)` with `willHaveBuildings(steps)` etc.

Create `helpers/readers/siteResaleReaders.spec.ts` — move 2 describe blocks:
- `isSiteResalePlannedAfterDevelopment` (3 tests)
- `shouldSiteResalePriceBeEstimated` (2 tests)
- Replace `ReadStateHelper.isSiteResalePlanned...` with `isSiteResalePlannedAfterDevelopment(steps)` etc.

Create `helpers/readers/soilsReaders.spec.ts` — move 1 describe block:
- `getProjectSoilDistribution` (5 tests)
- Replace `ReadStateHelper.getProjectSoilDistribution(steps)` with `getProjectSoilDistribution(steps)`

The `getProjectData` describe block (2 tests) can stay in a new `helpers/readers/projectDataReaders.spec.ts` or be colocated with the function. Replace `ReadStateHelper.getProjectData(steps)` with `getProjectData(steps)`.

After moving, `readState.spec.ts` should contain only the 3 `describe` blocks for `getStep`, `getStepAnswers`, `getDefaultAnswers`.

- [ ] **Step 4: Verify typecheck**

Run: `pnpm --filter web typecheck`
Expected: PASS

- [ ] **Step 5: Verify tests**

Run: `pnpm --filter web test`
Expected: All tests pass.

- [ ] **Step 6: Verify lint and format**

Run: `pnpm --filter web lint && pnpm --filter web format`
Expected: PASS (clean unused imports in `readState.ts`).

- [ ] **Step 7: Commit**

```
refactor(web): extract domain readers from ReadStateHelper into focused files
```
