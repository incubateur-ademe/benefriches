# Buildings Reuse and Construction — Work Tracker

Source spec: `docs/superpowers/specs/2026-03-23-buildings-reuse-and-construction-design.md`
Date snapshot: 2026-03-25

## Goal
Deliver the new buildings reuse/construction chapter incrementally in the urban project wizard, while keeping it hidden in production behind a feature flag until the chapter is complete.

## Current Status Snapshot

### Already Done
- [x] Step IDs and schemas are added in `urbanProjectSteps.ts` (including new intro + answer steps).
- [x] Core readers are implemented in `step-handlers/buildings/buildingsReaders.ts`.
- [x] Reader tests exist and pass in `step-handlers/buildings/__tests__/buildingsReaders.spec.ts`.
- [x] New handlers exist for all planned buildings/stakeholders/expenses steps.
- [x] Stepper config and query-string mappings include the new step IDs.
- [x] Wizard and update switch cases include the new step IDs (currently `TODO` placeholders).
- [x] A first integration test file exists for `BUILDINGS_FOOTPRINT_TO_REUSE` dependency/navigation logic.

### Still Missing / Incomplete
- [ ] Existing handler updates required by spec (buildings/stakeholders/expenses/decontamination/resale navigation).
- [ ] Cascading deletion updates for all new answer steps when buildings disappear from project.
- [ ] View-data selectors for 4 new answer steps (only footprint-to-reuse selector exists).
- [ ] All UI components for the 9 new steps (none created yet; wizard still renders `TODO` divs).
- [ ] Integration tests for full scenario matrix and reverse navigation.
- [ ] E2E tests/page objects for new chapter flows.
- [ ] Type-level cleanup in `stepHandlerRegistry.ts` and one handler import issue (`ReadStateHelper.willHaveBuildings` usage).

## Ralph-Wiggum Loop Rules
- Pick exactly one unchecked task ID.
- Implement only that task.
- Run only the listed targeted checks.
- Mark the checkbox and add a 1-line note in this file.
- Stop and ask before jumping to the next task.

Prompt template:

```text
Implement only task <TASK_ID> from docs/superpowers/plans/2026-03-25-buildings-reuse-and-construction-work-tracker.md.
Constraints:
- Do not implement any other task.
- Run the task's targeted checks.
- Update the tracker checkbox and add a short “Done note”.
```

## Work Groups

## Group A — Feature Flag and Safety Gate (do first)

- [x] **A1** Add env flag `WEBAPP_ENABLE_URBAN_PROJECT_BUILDINGS_REUSE_CHAPTER` in:
  - `apps/web/.env.example`
  - `apps/web/.env`
  - `.env.e2e`
  - `docker-compose.e2e.yml`
  - Done note: added in all 4 files (`.env.e2e` default `false`).
  - Check: `rg -n "WEBAPP_ENABLE_URBAN_PROJECT_BUILDINGS_REUSE_CHAPTER" apps/web/.env.example apps/web/.env .env.e2e docker-compose.e2e.yml`

- [x] **A2** Expose flag in `apps/web/src/app/envVars.ts` as `urbanProjectBuildingsReuseChapterEnabled`.
  - Done note: exposed from `window._benefriches_env.WEBAPP_ENABLE_URBAN_PROJECT_BUILDINGS_REUSE_CHAPTER`.
  - Check: `pnpm --filter web typecheck`

- [x] **A3** Use simple flag strategy: read `BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled` directly in the routing handler (no `StepContext` injection).
  - Files:
    - `apps/web/src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.handler.ts`
  - Done note: avoided global state/context plumbing by importing `envVars` directly in the handler.
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/uses/buildingsUsesFloorSurfaceArea.handler.spec.ts`

- [x] **A4** Gate chapter entry in `buildingsUsesFloorSurfaceArea.handler.ts`:
  - Flag OFF -> keep legacy route (`SOILS_DECONTAMINATION_INTRODUCTION` or `SITE_RESALE_INTRODUCTION`).
  - Flag ON -> new branch (`BUILDINGS_REUSE_INTRODUCTION` vs `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION`).
  - Done note: branch implemented and covered by dedicated handler tests (flag OFF + ON).
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/uses/usesFloorSurfaceArea.step.spec.ts`

## Group B — Core Flow Completion (no UI yet)

- [ ] **B1** Fix `stepHandlerRegistry.ts` typing: intro/info handlers must not be in `answerStepHandlers` map.
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **B2** Fix `expensesBuildingsConstructionAndRehabilitation.handler.ts` imports to use proper readers (`willHaveBuildings`/`hasBuildingsResalePlannedAfterDevelopment`).
  - Done note:
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesInstallation.handler.spec.ts`

- [ ] **B3** Apply remaining navigation updates from spec in existing handlers:
  - `buildings-uses-floor-surface-area`
  - `stakeholders-project-developer`
  - `stakeholders-reinstatement-contract-owner`
  - `expenses-introduction`
  - `expenses-installation`
  - `soils-decontamination-introduction`
  - `site-resale-introduction`
  - Done note:
  - Checks:
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesIntroduction.handler.spec.ts`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesInstallation.handler.spec.ts`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/previousStepRequested.action.spec.ts`

- [ ] **B4** Complete dependency/cascading deletion rules when buildings are removed:
  - `usesSelection.handler.ts` and/or `BUILDINGS_STEPS` + `getDeleteBuildingsRules`.
  - Must include deletion/invalidation of:
    - `URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE`
    - `URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`
    - `URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA`
    - `URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER`
    - `URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`
  - Done note:
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/uses/usesSelection.step.spec.ts`

## Group C — Selectors and View Data

- [ ] **C1** Add missing selector factories:
  - `buildingsExistingBuildingsUsesFloorSurfaceArea.selector.ts`
  - `buildingsNewBuildingsUsesFloorSurfaceArea.selector.ts`
  - `stakeholdersBuildingsDeveloper.selector.ts`
  - `expensesBuildingsConstructionAndRehabilitation.selector.ts`
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **C2** Export selectors via `urbanProject.selectors.ts` and context consumers (`useProjectForm` usage path).
  - Done note:
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

## Group D — UI Steps (incremental by chapter order)

- [ ] **D1** Create info pages:
  - `buildings/reuse-introduction`
  - `buildings/new-construction-introduction`
  - `buildings/demolition-info`
  - `buildings/new-construction-info`
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **D2** Create form page for `BUILDINGS_FOOTPRINT_TO_REUSE` (m² + % toggle, max site buildings).
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **D3** Create form page for `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`.
  - Constraints: selected uses only, recap support.
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **D4** Create form page for `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA`.
  - Constraints: selected uses only, sum(existing + new = total per use).
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **D5** Create form page for `STAKEHOLDERS_BUILDINGS_DEVELOPER` (yes/no).
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **D6** Create form page for `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` (conditional fields).
  - Done note:
  - Check: `pnpm --filter web typecheck`

## Group E — Wizard Wiring

- [ ] **E1** Replace all `TODO` switch cases in:
  - `UrbanProjectCreationWizard.tsx`
  - `UrbanProjectUpdateView.tsx`
  - with lazy-loaded containers.
  - Done note:
  - Check: `pnpm --filter web typecheck`

## Group F — Integration Tests (step handlers)

- [ ] **F1** Expand buildings flow integration tests to full matrix:
  - no buildings on site
  - full reuse same size
  - partial reuse with demolition only
  - full reuse with new construction
  - partial reuse with both demolition + new construction
  - no reuse
  - Done note:
  - Check: `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts`

- [ ] **F2** Add handler-focused tests for newly modified existing handlers (Group B3).
  - Done note:
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesIntroduction.handler.spec.ts && pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesInstallation.handler.spec.ts`

- [ ] **F3** Update action-level navigation tests impacted by new flow:
  - `stepCompletionRequested.action.spec.ts`
  - `previousStepRequested.action.spec.ts`
  - Done note:
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/stepCompletionRequested.action.spec.ts && pnpm --filter web test src/features/create-project/core/urban-project/__tests__/previousStepRequested.action.spec.ts`

## Group G — E2E (nominal user flows)

- [ ] **G1** Extend `apps/e2e-tests/pages/UrbanProjectCreationPage.ts` for custom urban chapter interactions.
  - Done note:
  - Check: `pnpm --filter e2e-tests test --list`

- [ ] **G2** Add e2e scenario: site without buildings -> new construction intro shown, reuse input absent.
  - Done note:
  - Check: run that single e2e spec

- [ ] **G3** Add e2e scenario: no reuse -> demolition info + new construction info, no breakdown forms.
  - Done note:
  - Check: run that single e2e spec

- [ ] **G4** Add e2e scenario: full reuse with new construction -> both breakdown forms + stakeholder builder + expenses construction/rehab step.
  - Done note:
  - Check: run that single e2e spec

## Group H — Release and Enablement

- [ ] **H1** Keep feature flag OFF by default; merge and deploy safely.
- [ ] **H2** Enable flag in staging and run full QA on chapter.
- [ ] **H3** Enable flag in production after Group F + G are green.

## Recommended Loop Order
`A1 -> A2 -> A3 -> A4 -> B1 -> B2 -> B3 -> B4 -> C1 -> C2 -> D1 -> D2 -> D3 -> D4 -> D5 -> D6 -> E1 -> F1 -> F2 -> F3 -> G1 -> G2 -> G3 -> G4 -> H1 -> H2 -> H3`

## Notes
- New chapter step IDs are already introduced in multiple registries, so gating before flow activation is important to avoid exposing incomplete `TODO` screens.
