# Buildings Reuse and Construction — Work Tracker

Spec (single source of truth): `docs/specs/2026-03-23-buildings-reuse-and-construction-design.md`  
Date snapshot: 2026-03-25

## Goal
Deliver the buildings reuse/construction chapter incrementally in the urban project wizard, while keeping it hidden behind a feature flag until completion.

## Source-of-Truth Contract
- The spec defines functional behavior, scenarios, business rules, and UX copy.
- This tracker defines execution order, ownership status, and validation commands only.
- If a task needs product details, reference the spec section instead of repeating content here.

## Execution Loop Contract
When prompted with: `read <this-tracker>.md and execute it`

1. Read this tracker and the linked spec.
2. Pick exactly one task ID (first unchecked task in `Recommended Loop Order`).
3. Build a quick implementation plan (3-6 bullets) with spec section references.
4. Ask for approval before coding (`Approve task <TASK_ID>?`).
5. After approval, implement only that task.
6. Run checks:
   - The task targeted check(s) listed below.
   - Quality guards from `CLAUDE.md` for affected scope:
     - Web changes: `pnpm --filter web typecheck && pnpm --filter web lint && pnpm --filter web test`
     - API changes: `pnpm --filter api test`
     - Shared changes: `pnpm --filter shared build && pnpm --filter api install && pnpm --filter web install && pnpm -r typecheck && pnpm -r test`
7. Run the `code-reviewer` skill on the resulting diff.
8. Ask user validation of the completed task.
9. Only after explicit validation, mark the task as done in this tracker:
   - switch `[ ]` to `[x]`
   - add a 1-line `Done note`.
10. Stop and wait for the next instruction (do not auto-start the next task).

Prompt template:

```text
Read docs/plans/2026-03-25-buildings-reuse-and-construction-work-tracker.md and execute it.
Constraints:
- pick only one unchecked task,
- ask approval before implementation,
- run checks from the tracker + CLAUDE.md,
- run code-reviewer,
- ask my validation,
- then mark task done.
```

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
- [ ] Existing handler updates required by spec navigation rules.
- [ ] Cascading deletion updates for new answer steps when buildings disappear from project.
- [ ] View-data selectors for 4 new answer steps (only footprint-to-reuse selector exists).
- [ ] UI components for the 9 new steps (wizard still renders `TODO` placeholders).
- [ ] Integration tests for complete matrix and reverse navigation.
- [ ] E2E tests/page objects for new chapter flows.
- [ ] Type-level cleanup in `stepHandlerRegistry.ts` and one handler import issue (`ReadStateHelper.willHaveBuildings` usage).

## Work Groups

## Group A — Feature Flag and Safety Gate (done)

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

- [x] **A3** Use direct env var read in routing handler (no `StepContext` injection).
  - Files:
    - `apps/web/src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.handler.ts`
  - Done note: imported `envVars` directly in handler.
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/uses/buildingsUsesFloorSurfaceArea.handler.spec.ts`

- [x] **A4** Gate chapter entry in `buildingsUsesFloorSurfaceArea.handler.ts`:
  - flag OFF: legacy route
  - flag ON: new chapter route
  - Done note: branch implemented and covered by tests (OFF + ON).
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/uses/usesFloorSurfaceArea.step.spec.ts`

## Group B — Core Flow Completion (no UI yet)

- [ ] **B1** Fix `stepHandlerRegistry.ts` typing: intro/info handlers must not be in `answerStepHandlers`.
  - Spec ref: `Step Type Registration`
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **B2** Fix `expensesBuildingsConstructionAndRehabilitation.handler.ts` imports to use proper readers (`willHaveBuildings`/`hasBuildingsResalePlannedAfterDevelopment`).
  - Spec ref: `Navigation` + `Expense step condition clarification`
  - Done note:
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesInstallation.handler.spec.ts`

- [ ] **B3** Apply remaining navigation updates to existing handlers.
  - Spec ref: `Navigation` (forward + reverse updates and chapter exit routing)
  - Files:
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

- [ ] **B4** Complete dependency/cascading deletion rules when buildings are removed.
  - Spec ref: `Dependency Rules` + `Upstream cascading: when buildings are removed from the project`
  - Done note:
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/uses/usesSelection.step.spec.ts`

## Group C — Selectors and View Data

- [ ] **C1** Add missing selector factories.
  - Spec ref: `View Components` + answer schemas
  - Files:
    - `buildingsExistingBuildingsUsesFloorSurfaceArea.selector.ts`
    - `buildingsNewBuildingsUsesFloorSurfaceArea.selector.ts`
    - `stakeholdersBuildingsDeveloper.selector.ts`
    - `expensesBuildingsConstructionAndRehabilitation.selector.ts`
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **C2** Export selectors via `urbanProject.selectors.ts` and context consumers (`useProjectForm` path).
  - Spec ref: `View Components`
  - Done note:
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

## Group D — UI Steps (chapter order)

- [ ] **D1** Create info pages.
  - Spec ref: `View Components` table
  - Steps:
    - `buildings/reuse-introduction`
    - `buildings/new-construction-introduction`
    - `buildings/demolition-info`
    - `buildings/new-construction-info`
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **D2** Create form page for `BUILDINGS_FOOTPRINT_TO_REUSE`.
  - Spec ref: `Answer Schemas` + `View Components`
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **D3** Create form page for `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`.
  - Spec ref: `Uses Breakdown Constraints`
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **D4** Create form page for `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA`.
  - Spec ref: `Uses Breakdown Constraints`
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **D5** Create form page for `STAKEHOLDERS_BUILDINGS_DEVELOPER`.
  - Spec ref: `View Components` + `Answer Schemas`
  - Done note:
  - Check: `pnpm --filter web typecheck`

- [ ] **D6** Create form page for `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`.
  - Spec ref: `Answer Schemas` + `View Components`
  - Done note:
  - Check: `pnpm --filter web typecheck`

## Group E — Wizard Wiring

- [ ] **E1** Replace all `TODO` switch cases with lazy-loaded containers.
  - Spec ref: `View Components`
  - Files:
    - `UrbanProjectCreationWizard.tsx`
    - `UrbanProjectUpdateView.tsx`
  - Done note:
  - Check: `pnpm --filter web typecheck`

## Group F — Integration Tests (step handlers)

- [ ] **F1** Expand buildings flow integration tests to cover the complete scenario matrix.
  - Spec ref: `Integration Tests` (scenario table)
  - Done note:
  - Check: `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts`

- [ ] **F2** Add handler-focused tests for modified existing handlers (Group B3).
  - Spec ref: `Navigation` + `Reverse navigation updates to existing handlers`
  - Done note:
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesIntroduction.handler.spec.ts && pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesInstallation.handler.spec.ts`

- [ ] **F3** Update action-level navigation tests impacted by new flow.
  - Spec ref: `Navigation`
  - Files:
    - `stepCompletionRequested.action.spec.ts`
    - `previousStepRequested.action.spec.ts`
  - Done note:
  - Check: `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/stepCompletionRequested.action.spec.ts && pnpm --filter web test src/features/create-project/core/urban-project/__tests__/previousStepRequested.action.spec.ts`

## Group G — E2E (nominal user flows)

- [ ] **G1** Extend `apps/e2e-tests/pages/UrbanProjectCreationPage.ts` for custom urban chapter interactions.
  - Spec ref: `E2E Tests` -> `Page objects to create/update`
  - Done note:
  - Check: `pnpm --filter e2e-tests test --list`

- [ ] **G2** Add e2e scenario for “site without buildings”.
  - Spec ref: `E2E Tests` (nominal scenarios table)
  - Done note:
  - Check: run that single e2e spec

- [ ] **G3** Add e2e scenario for “no reuse”.
  - Spec ref: `E2E Tests` (nominal scenarios table)
  - Done note:
  - Check: run that single e2e spec

- [ ] **G4** Add e2e scenario for “full reuse with new construction”.
  - Spec ref: `E2E Tests` (nominal scenarios table)
  - Done note:
  - Check: run that single e2e spec

## Group H — Release and Enablement

- [ ] **H1** Keep feature flag OFF by default; merge and deploy safely.
- [ ] **H2** Enable flag in staging and run full QA on chapter.
- [ ] **H3** Enable flag in production after Group F + G are green.

## Recommended Loop Order
`A1 -> A2 -> A3 -> A4 -> B1 -> B2 -> B3 -> B4 -> C1 -> C2 -> D1 -> D2 -> D3 -> D4 -> D5 -> D6 -> E1 -> F1 -> F2 -> F3 -> G1 -> G2 -> G3 -> G4 -> H1 -> H2 -> H3`

## Notes
- New chapter step IDs are already introduced in multiple registries, so gating before full flow activation avoids exposing incomplete `TODO` screens.
