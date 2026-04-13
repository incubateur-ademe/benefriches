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
5. After approval, run the `test-driven-development` skill, then implement only that task.
6. Run checks:
   - The task targeted check(s) listed below.
   - Quality guards from `CLAUDE.md` for affected scope:
     - Web changes: `pnpm --filter web typecheck && pnpm --filter web lint && pnpm --filter web format && pnpm --filter web test`
     - API changes: `pnpm --filter api test`
     - Shared changes: `pnpm --filter shared build && pnpm --filter api install && pnpm --filter web install && pnpm -r typecheck && pnpm -r test`
7. Run the `code-reviewer` skill on the resulting diff.
8. Before asking validation:
   - for `S1` to `S12`, list the sequencing test files created/updated in `step-handlers/buildings/__tests__/sequencing/`
   - for `S13` and `S14`, list non-sequencing tests/e2e specs created/updated
9. Ask user validation of the completed task.
10. Only after explicit validation, mark the task as done in this tracker:
   - switch `[ ]` to `[x]`
   - add a 1-line `Done note`.
11. Run the `generate-commit-message` skill
12. Stop and wait for the next instruction (do not auto-start the next task).

Prompt template:

```text
Read docs/plans/2026-03-25-buildings-reuse-and-construction-work-tracker.md and execute it.
Constraints:
- pick only one unchecked task,
- ask approval before implementation,
- run `test-driven-development` before coding,
- run checks from the tracker + CLAUDE.md,
- run code-reviewer,
- for S1-S12, update sequencing tests and list modified sequencing files before asking validation,
- for S1-S12, make each sequencing `it()` a full route from `URBAN_PROJECT_BUILDINGS_INTRODUCTION` to chapter exit,
- for S1-S12, use human-readable `it()` descriptions with a stripped step-chain comment inside the test body,
- for S1-S12, group tests under `describe("forward navigation")` and `describe("backward navigation")`,
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
- [x] Sequencing suite renamed to `*.sequence.spec.ts` and no longer uses `it.todo`.
- [x] Sequencing scenarios use human-readable `it()` descriptions with step-chain comments, grouped under `describe("forward navigation")` / `describe("backward navigation")`.

### Still Missing / Incomplete
- [x] Align `URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE` max constraint with spec update: `max = min(site buildings footprint, project buildings footprint)`.
  - Done note: Updated spec wording + selector/form max display/validation and added focused tests for min(site, project) behavior.
- [ ] Existing handler updates required by spec navigation rules.
- [x] Cascading deletion updates for new answer steps when buildings disappear from project.
  - Done note: Extended upstream uses/spaces cascades to delete persisted buildings answers when buildings disappear, and invalidated reuse entry on building-footprint updates so update flows revisit the buildings chapter.
- [ ] View-data selectors for 4 new answer steps (only footprint-to-reuse selector exists).
- [ ] UI components for the 9 new steps (wizard still renders `TODO` placeholders).
- [ ] Integration tests for complete matrix and reverse navigation.
- [ ] E2E tests/page objects for new chapter flows.
- [ ] Type-level cleanup in `stepHandlerRegistry.ts` and one handler import issue (`ReadStateHelper.willHaveBuildings` usage).

## Definition of Done (mandatory for each unchecked task)

1. Run the `test-driven-development` skill, then implement the task scope in production code (handler logic, selectors/view-data, UI page, wizard/update wiring as applicable).
2. For `S1` to `S12`, add or update sequencing tests using the urban-zone approach:
   - one `*.sequence.spec.ts` file per scenario
   - each scenario file contains forward and backward navigation assertions
   - tests are grouped under `describe("forward navigation")` and `describe("backward navigation")`
   - each `it()` uses a human-readable description with a stripped step-chain comment in the test body
   - each forward `it()` starts at `URBAN_PROJECT_BUILDINGS_INTRODUCTION` and reaches a chapter exit step
3. For `S13` and `S14`, sequencing-test updates are optional; e2e and release validation are mandatory.
4. Run task-targeted tests listed in the task.
5. Run quality guards from `CLAUDE.md` for impacted scope.
6. Run the `code-reviewer` skill on the diff.
7. Validate manually with the feature flag ON for the impacted path.

## Sequencing Tests Contract (new mandatory approach for this epic)

- Test directory: `apps/web/src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing/`
- File naming convention: `*.sequence.spec.ts`
- File pattern: one file per scenario (example names):
  - `withNoExistingBuildings.sequence.spec.ts`
  - `reuseOnlyNoDemolition.sequence.spec.ts`
  - `reuseOnlyWithDemolition.sequence.spec.ts`
  - `reuseAndNewConstruction.sequence.spec.ts`
  - `newConstructionOnlyWithDemolition.sequence.spec.ts`
- Scope:
  - each scenario file groups tests under `describe("forward navigation")` and `describe("backward navigation")`
  - each sequencing `it()` uses a human-readable description (e.g., `"skips reuse steps and goes directly to new construction"`)
  - each test body starts with a stripped step-chain comment (e.g., `// INTRO -> FLOOR_AREA -> NEW_CONSTRUCTION_INTRO -> SITE_RESALE_INTRO`)
  - each sequencing `it()` starts at `URBAN_PROJECT_BUILDINGS_INTRODUCTION` (forward) or a chapter exit step (backward), reaching the opposite end
- Command baseline: `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

## Historical Done (kept for traceability)

- [x] **HIST-1** Feature flag foundation (`A1` to `A4`) is implemented and tested.
- [x] **HIST-2** Registry typing cleanup and reader-import fix (`B1`, `B2`) are implemented and tested.

## Incremental User-Centric Flow Tasks

- [x] **S1** Chapter entry branch from `BUILDINGS_USES_FLOOR_SURFACE_AREA`.
  - Spec ref: `Navigation` (entry branch, flag ON behavior)
  - Includes: finalize any remaining entry/previous-step routing updates linked to chapter entry.
  - Done note: Added S1 branch coverage in action + sequencing tests for no-buildings and reuse-intro forward/backward paths.
  - Targeted checks:
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/uses/usesFloorSurfaceArea.step.spec.ts`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/uses/buildingsUsesFloorSurfaceArea.handler.spec.ts`

- [x] **S2** Info step: `BUILDINGS_REUSE_INTRODUCTION` + branch `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION`.
  - Spec ref: `View Components` + `Navigation`
  - Includes: containers + wizard wiring + sequencing scenarios touching both introductions.
  - Done note: Added both introduction containers/views with wizard wiring and sequencing coverage for no-existing-buildings and reuse-introduction navigation paths.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [x] **S3** Answer step: `BUILDINGS_FOOTPRINT_TO_REUSE`.
  - Spec ref: `Answer Schemas` + `Dependency Rules` + `Navigation`
  - Includes: page wiring, selector wiring, dependency invalidation behavior.
  - Done note: Added footprint-to-reuse form + container, wired create/update wizard screens, and completed sequencing tests in renamed `*.sequence.spec.ts` files with split forward/backward routes.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts`
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [x] **S4** Info step: `BUILDINGS_DEMOLITION_INFO`.
  - Spec ref: `View Components` + `Navigation`
  - Includes: conditional route after footprint submission + backward links.
  - Done note: Added demolition info selector + page wiring in create/update wizards, and reorganized sequencing tests into forward/backward describe blocks with scenario descriptions.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [x] **S5** Answer step: `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`.
  - Spec ref: `Uses Breakdown Constraints` + `Navigation`
  - Includes: selector factory + page + handler behavior + backward links.
  - Done note: Added the existing-buildings uses selector and form, wired both urban project wizards, and extended sequencing coverage with mixed-use reuse/new-construction allocations.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

- [x] **S6** Info step: `BUILDINGS_NEW_CONSTRUCTION_INFO`.
  - Spec ref: `View Components` + `Navigation`
  - Includes: conditional display and previous-step routing chain.
  - Done note: Added the new-construction info selector and screen wiring in create/update flows, with sequencing coverage for both previous-step branches.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [x] **S7** Answer step: `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA`.
  - Spec ref: `Uses Breakdown Constraints` + `Navigation`
  - Includes: selector factory + page + remaining surface-area constraints.
  - Done note: Added the new-buildings uses selector and form, wired both urban project wizards, and extended sequencing coverage for the new-buildings step submission/backward path.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

- [x] **S8** Answer step: `STAKEHOLDERS_BUILDINGS_DEVELOPER`.
  - Spec ref: `Answer Schemas` + `Navigation` (stakeholders transitions)
  - Includes: page + selector + routing updates in `stakeholders-project-developer` and `stakeholders-reinstatement-contract-owner`.
  - Done note: Added the buildings-developer selector and yes/no form in create/update wizards, with focused adjacent navigation coverage for forward and backward stakeholder transitions.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/previousStepRequested.action.spec.ts`

- [x] **S9** Answer step: `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`.
  - Spec ref: `Answer Schemas` + `Expense step condition clarification` + `Navigation`
  - Includes: page + selector + routing updates in `expenses-installation` and `expenses-introduction`.
  - Done note: Added the buildings construction/rehabilitation expense selector and form, wired create/update expense screens, and inserted the step into the validated expenses flow with focused handler, selector, and workflow coverage.
  - Targeted checks:
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesInstallation.handler.spec.ts`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesIntroduction.handler.spec.ts`
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [x] **S10** Chapter exit integration from buildings to next sections.
  - Spec ref: `Navigation` (chapter exit routing)
  - Includes: `soils-decontamination-introduction` + `site-resale-introduction` previous-step alignment via last-chapter-step logic.
  - Done note: Aligned chapter-exit reverse routing with last-buildings-step logic and added focused action plus sequencing coverage for all exit scenarios.
  - Targeted checks:
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/previousStepRequested.action.spec.ts`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/stepCompletionRequested.action.spec.ts`
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [x] **S11** Cascading deletion when buildings disappear from project.
  - Spec ref: `Upstream cascading: when buildings are removed from the project`
  - Includes: deletion/invalidation rules for all new answer steps.
  - Done note: Extended upstream uses/spaces cascades to delete persisted buildings answers when buildings disappear, and invalidated reuse entry on building-footprint updates so update flows revisit the buildings chapter.
  - Targeted checks:
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/uses/usesSelection.step.spec.ts`
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts`

- [x] **S12** Sequencing matrix completion (file-per-scenario final pass).
  - Spec ref: `Integration Tests` scenario table
  - Includes: complete scenario coverage in `step-handlers/buildings/__tests__/sequencing/` with one file per scenario and forward/backward assertions.
  - Sequencing rule: each forward `it()` must start at `URBAN_PROJECT_BUILDINGS_INTRODUCTION` and end at a chapter exit step.
  - Test style rule: human-readable `it()` descriptions with step-chain comments; `describe("forward navigation")` / `describe("backward navigation")` grouping.
  - Done note: Split the mixed reuse-and-new-construction sequencing suite into separate full-reuse and partial-reuse scenario files, keeping file-per-scenario forward/backward coverage aligned with the spec matrix.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [x] **S13** E2E coverage update for nominal flows.
  - Spec ref: `E2E Tests`
  - Includes:
    - extend `apps/e2e-tests/pages/UrbanProjectCreationPage.ts`
    - add scenarios: `site without buildings`, `no reuse`, `full reuse with new construction`
  - Done note: Added dedicated express/custom urban-project e2e specs with realistic multi-use buildings scenarios and page-object support for the buildings reuse/construction chapter.
  - Targeted checks:
    - `pnpm --filter e2e-tests test --list`
    - run each new/updated spec

- [x] **S13b** Wizard summary: display construction/rehabilitation expenses.
  - Spec ref: `Wizard summary (current phase)`
  - Includes:
    - update `shared/views/project-form/urban-project/summary/UrbanProjectExpensesSection.tsx` to include construction/rehabilitation expenses from form state
    - add label function for the 4 expense purposes in `shared/core/urbanProject.ts`
  - Done note: Added construction/rehabilitation expenses to wizard summary with total + per-purpose detail lines, label function for all 4 expense purposes, and component test.
  - Targeted checks:
    - `pnpm --filter web typecheck && pnpm --filter web test`

- [ ] **S14** Release and enablement.
  - Includes:
    - keep feature flag OFF by default for merge/deploy
    - enable in staging with QA
    - enable in production after sequencing + e2e are green

- [ ] **S15** API persistence for new buildings reuse data.
  - Spec ref: `API Persistence (follow-up)`
  - Includes:
    - new optional fields on creation/update DTOs in `packages/shared/` (`buildingsFootprintToReuse`, `existingBuildingsUsesFloorSurfaceArea`, `newBuildingsUsesFloorSurfaceArea`, `developerWillBeBuildingsConstructor`, `buildingsConstructionAndRehabilitationExpenses`)
    - database migration to store the new fields
    - repository/query updates in `apps/api/`
    - web submission thunks send the new fields on project creation and update
  - Targeted checks:
    - `pnpm --filter shared build && pnpm --filter api install && pnpm --filter web install && pnpm -r typecheck && pnpm -r test`

- [ ] **S16** Update flow data mapping in `convertProjectDataToSteps`.
  - Spec ref: `Update Flow Mapping (follow-up)`
  - Depends on: S15 (API must return the new fields)
  - Includes:
    - map the 5 new answer step payloads from API response to form state in `convertProjectDataToSteps.ts`
    - verify update wizard pre-populates the new steps correctly
  - Targeted checks:
    - `pnpm --filter web test src/features/update-project/`
    - `pnpm --filter web typecheck`

- [ ] **S17** Display views: show construction/rehabilitation expenses from API data.
  - Spec ref: `Display views to update (after API returns the new fields)`
  - Depends on: S15 (API must return the new fields)
  - Includes:
    - `ExpensesAndRevenues.tsx` — new section for construction/rehabilitation expenses
    - `ProjectExpensesAndIncomesPdf.tsx` — mirror web view changes
    - `projectImpactsEconomicBalance.ts` — include in cost aggregation
  - Targeted checks:
    - `pnpm --filter web typecheck && pnpm --filter web test`

## Recommended Loop Order
`HIST-1 -> HIST-2 -> S1 -> S2 -> S3 -> S4 -> S5 -> S6 -> S7 -> S8 -> S9 -> S10 -> S11 -> S12 -> S13 -> S13b -> S14 -> S15 -> S16 -> S17`

## Notes
- New chapter step IDs are already introduced in multiple registries, so gating before full flow activation avoids exposing incomplete `TODO` screens.
