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
- for S1-S12, name each sequencing `it()` with the exact step chain (`STEP_A -> STEP_B -> ...`),
- for S1-S12, keep forward and backward routes in separate `it()` tests (no mixed assertions in one test),
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
- [x] Sequencing scenarios now use explicit step-chain `it()` titles and split forward/backward routes into separate tests.

### Still Missing / Incomplete
- [ ] Existing handler updates required by spec navigation rules.
- [ ] Cascading deletion updates for new answer steps when buildings disappear from project.
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
   - each sequencing `it()` starts at `URBAN_PROJECT_BUILDINGS_INTRODUCTION` and reaches a chapter exit step (`URBAN_PROJECT_SITE_RESALE_INTRODUCTION` or `URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION`)
   - each sequencing `it()` title is the exact step chain (e.g. `STEP_A -> STEP_B -> STEP_C`)
   - forward and backward routes are asserted in separate `it()` tests
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
  - each scenario file asserts both forward and reverse navigation
  - each sequencing `it()` starts at `URBAN_PROJECT_BUILDINGS_INTRODUCTION`, reaches a chapter exit step, and checks reverse navigation on the same route
  - each sequencing `it()` title is the exact step chain being asserted
  - forward and backward routes must be split into distinct `it()` tests
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

- [ ] **S3** Answer step: `BUILDINGS_FOOTPRINT_TO_REUSE`.
  - Spec ref: `Answer Schemas` + `Dependency Rules` + `Navigation`
  - Includes: page wiring, selector wiring, dependency invalidation behavior.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts`
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [ ] **S4** Info step: `BUILDINGS_DEMOLITION_INFO`.
  - Spec ref: `View Components` + `Navigation`
  - Includes: conditional route after footprint submission + backward links.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [ ] **S5** Answer step: `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`.
  - Spec ref: `Uses Breakdown Constraints` + `Navigation`
  - Includes: selector factory + page + handler behavior + backward links.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

- [ ] **S6** Info step: `BUILDINGS_NEW_CONSTRUCTION_INFO`.
  - Spec ref: `View Components` + `Navigation`
  - Includes: conditional display and previous-step routing chain.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [ ] **S7** Answer step: `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA`.
  - Spec ref: `Uses Breakdown Constraints` + `Navigation`
  - Includes: selector factory + page + remaining surface-area constraints.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

- [ ] **S8** Answer step: `STAKEHOLDERS_BUILDINGS_DEVELOPER`.
  - Spec ref: `Answer Schemas` + `Navigation` (stakeholders transitions)
  - Includes: page + selector + routing updates in `stakeholders-project-developer` and `stakeholders-reinstatement-contract-owner`.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/previousStepRequested.action.spec.ts`

- [ ] **S9** Answer step: `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`.
  - Spec ref: `Answer Schemas` + `Expense step condition clarification` + `Navigation`
  - Includes: page + selector + routing updates in `expenses-installation` and `expenses-introduction`.
  - Targeted checks:
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesInstallation.handler.spec.ts`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/expenses/expensesIntroduction.handler.spec.ts`
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [ ] **S10** Chapter exit integration from buildings to next sections.
  - Spec ref: `Navigation` (chapter exit routing)
  - Includes: `soils-decontamination-introduction` + `site-resale-introduction` previous-step alignment via last-chapter-step logic.
  - Targeted checks:
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/previousStepRequested.action.spec.ts`
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/stepCompletionRequested.action.spec.ts`
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [ ] **S11** Cascading deletion when buildings disappear from project.
  - Spec ref: `Upstream cascading: when buildings are removed from the project`
  - Includes: deletion/invalidation rules for all new answer steps.
  - Targeted checks:
    - `pnpm --filter web test src/features/create-project/core/urban-project/__tests__/steps/uses/usesSelection.step.spec.ts`
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/buildingsReuseAndConstruction.step.spec.ts`

- [ ] **S12** Sequencing matrix completion (file-per-scenario final pass).
  - Spec ref: `Integration Tests` scenario table
  - Includes: complete scenario coverage in `step-handlers/buildings/__tests__/sequencing/` with one file per scenario and forward/backward assertions.
  - Sequencing rule: each `it()` must start at `URBAN_PROJECT_BUILDINGS_INTRODUCTION`, end at chapter exit, and assert reverse navigation for that exact route.
  - Test style rule: each `it()` title is the exact step chain; forward and backward routes are separate tests.
  - Targeted checks:
    - `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/step-handlers/buildings/__tests__/sequencing`

- [ ] **S13** E2E coverage update for nominal flows.
  - Spec ref: `E2E Tests`
  - Includes:
    - extend `apps/e2e-tests/pages/UrbanProjectCreationPage.ts`
    - add scenarios: `site without buildings`, `no reuse`, `full reuse with new construction`
  - Targeted checks:
    - `pnpm --filter e2e-tests test --list`
    - run each new/updated spec

- [ ] **S14** Release and enablement.
  - Includes:
    - keep feature flag OFF by default for merge/deploy
    - enable in staging with QA
    - enable in production after sequencing + e2e are green

## Recommended Loop Order
`HIST-1 -> HIST-2 -> S1 -> S2 -> S3 -> S4 -> S5 -> S6 -> S7 -> S8 -> S9 -> S10 -> S11 -> S12 -> S13 -> S14`

## Notes
- New chapter step IDs are already introduced in multiple registries, so gating before full flow activation avoids exposing incomplete `TODO` screens.
