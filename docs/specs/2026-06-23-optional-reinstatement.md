# Optional Reinstatement — Implementation Plan

> **Context**: Today every reconversion project on a friche unconditionally includes reinstatement. We want users to be able to declare that their project does **not** involve reinstatement. This plan adds a boolean `involvesReinstatement` to the data model and gates all reinstatement logic behind it in both creation wizards and the impacts engine.
>
> **Reference**: [Impact analysis](./optional-reinstatement-impact-analysis.md)

## Status

**Current step: Step 4 — Urban project creation wizard**

| Step | Status |
|---|---|
| Step 1 — Data model | ✅ done |
| Step 2 — API wiring | ✅ done |
| Step 3 — Impacts audit | ✅ done |
| Step 4 — Urban project creation wizard | 🔲 todo |
| Step 5 — PV project creation wizard | 🔲 todo |
| Step 6 — Domain invariant enforcement | 🔲 todo |

---

## Agent instructions

**Use TDD for every change**: write the test first, confirm it fails, implement until it passes, then move on. Never write implementation code before a failing test exists for it. When fixing a bug or correcting behaviour, update the relevant test case or add a new one before touching the implementation.

**After completing each step**:
1. Run the step's validation commands and confirm they all pass.
2. Run code review skill in a sub-agent
3. Ask for approval that the task is completed.
4. Update the status table above to mark the step done.
5. Append a log entry (see below).
6. Run `/generate-commit-message` and present the result. Do not commit — let the user do it.

When implementing any step, maintain a running log at the bottom of this file under a `## Log` section. For every iteration, append an entry with:

- **What you did** — files changed, commands run, decisions made.
- **Difficulties** — anything that didn't match the spec, surprised you, or required investigation.
- **Decisions** — any choice you made that wasn't already specified (naming, structure, approach).
- **Revisions** — any deviation from this plan and why.

Keep entries terse. The goal is a trail a human can read to understand what happened and where the spec was incomplete.

---

## Step 1 — Data model

**Objective**: Introduce `involves_reinstatement` in the database and in shared TypeScript types. Zero behavior change — all existing projects and all new projects get `true` by default.

### Changes

**Migration** (`apps/api/src/shared-kernel/adapters/sql-knex/migrations/`):

```sql
ALTER TABLE reconversion_projects
  ADD COLUMN involves_reinstatement boolean NOT NULL DEFAULT true;
```

Use the `/create-database-migration` skill.

**`packages/shared/src/reconversion-projects/reconversionProjectSchemas.ts`**:
- Add `involvesReinstatement: boolean` to the `ReconversionProject` type and its Zod schema.

**`apps/api/src/shared-kernel/adapters/sql-knex/tableTypes.d.ts`**:
- Add `involves_reinstatement: boolean` to `SqlReconversionProject`.

### Validation

```bash
pnpm --filter shared build
pnpm --filter shared typecheck
pnpm --filter api typecheck
pnpm --filter web typecheck
```

---

## Step 2 — API wiring

**Objective**: The API accepts, persists, and returns `involvesReinstatement`. All new projects receive the value sent by the client; all existing projects read `true` from the DB column default.

### Changes

**Repository** (`apps/api/src/reconversion-projects/adapters/secondary/repositories/SqlReconversionProjectRepository.ts`):
- Map `involvesReinstatement` on save (insert `involves_reinstatement`).
- Map `involves_reinstatement` on load (read → `involvesReinstatement`).

**POST DTO / command** (wherever the create-project command is defined):
- Accept `involvesReinstatement: boolean` (default `true` if absent, so existing clients keep working).

**Integration test** (next to the repository integration spec):
- Create a project with `involvesReinstatement: false`, reload it, assert the value is preserved.
- Create a project with `involvesReinstatement: true`, reload it, assert the value is preserved.

### Validation

```bash
pnpm --filter api typecheck
pnpm --filter api lint
pnpm --filter api test:integration src/reconversion-projects
```

---

## Step 3 — Impacts audit

**Objective**: Verify that the impacts engine naturally produces correct results (zero reinstatement-derived values) when `involvesReinstatement: false` and no reinstatement costs/schedule are present. This step is a hard gate before any user-facing change.

### Changes

**New integration test** in the impacts engine tests (e.g. next to `reconversionProjectImpacts.spec.ts` or the full-time jobs spec):

Scenario: a FRICHE project with `involvesReinstatement: false`, no `reinstatementCosts`, no `reinstatementSchedule`.

Assert that:
- Reinstatement full-time jobs = 0.
- Reinstatement expenses in economic balance = 0 (no negative impact from reinstatement costs).
- No reinstatement-related line items appear in the impacts output.

If any assertion fails, fix the silent null-fallback in the relevant computation before moving to steps 4–5.

### Validation

```bash
pnpm --filter api typecheck
pnpm --filter api test:unit src/reconversion-projects/core/model/project-impacts
```

---

## Step 4 — Urban project creation wizard

**Objective**: Add an `INVOLVES_REINSTATEMENT` question step in the urban project creation flow. When the user answers "no", all downstream reinstatement steps are skipped and the schedule default is anchored to creation date + 1 year instead of reinstatement end date.

### Changes

**New step handler** (`apps/web/src/shared/core/reducers/project-form/urban-project/step-handlers/reinstatement/involves-reinstatement/`):
- `involvesReinstatement.handler.ts` — `AnswerStepHandler<{ involvesReinstatement: boolean }>`.
  - `getNextStepId()`: if `true` → `SOILS_DECONTAMINATION_INTRODUCTION`; if `false` → first non-reinstatement step after the reinstatement block (expenses or stakeholders, whichever comes first in the non-reinstatement path).
  - `getDependencyRules()`: when answer changes to `false`, delete answers for all reinstatement steps (`SOILS_DECONTAMINATION_INTRODUCTION`, `SOILS_DECONTAMINATION_SELECTION`, `SOILS_DECONTAMINATION_SURFACE_AREA`, `EXPENSES_REINSTATEMENT`, `STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER`).
- `involvesReinstatement.schema.ts`
- `involvesReinstatement.selectors.ts`
- `involvesReinstatement.stepperConfig.ts`

**Step registry** (`step-handlers/stepHandlerRegistry.ts`):
- Register `INVOLVES_REINSTATEMENT` handler before `SOILS_DECONTAMINATION_INTRODUCTION`.

**Step enum / stepper**:
- Add `INVOLVES_REINSTATEMENT` to the steps union, positioned before `SOILS_DECONTAMINATION_INTRODUCTION`.

**Schedule handler** (`step-handlers/schedule/schedule-projection/scheduleProjection.handler.ts`):
- When `involvesReinstatement: false`, set installation start default to `createdAt + 1 year` instead of `reinstatementSchedule.endDate + 1 day`.

**Project generator** (`UrbanProjectGenerator.getReconversionProject()`):
- When `involvesReinstatement: false`, omit `reinstatementCosts`, `reinstatementSchedule`, `reinstatementContractOwner`, `decontaminatedSoilSurface`.
- Always include `involvesReinstatement` in the output (sent to API).

**Tests** (`urban-project/__tests__/steps/reinstatement/involvesReinstatement.step.spec.ts`):
- Answer `true` → next step is `SOILS_DECONTAMINATION_INTRODUCTION`.
- Answer `false` → reinstatement steps are skipped; project generator omits reinstatement fields.
- Schedule default when `false` → installation start = createdAt + 1 year.

### Validation

```bash
pnpm --filter web typecheck
pnpm --filter web lint
pnpm --filter web test
```

Any change to wizard step sequencing on a FRICHE site must also update the e2e tests in `apps/e2e-tests/tests/project-creation/urban-project/create-custom-urban-project.spec.ts` and run them via the `/run-e2e-tests` skill. Check that the friche test scenarios still include the new step and that the page object (`UrbanProjectCreationPage.ts`) has a method to interact with it.

---

## Step 5 — PV project creation wizard

**Objective**: Same as Step 4 but for the renewable energy (photovoltaic) creation flow.

### Changes

Mirror Step 4 in the renewable energy wizard:

**New step handler** (`apps/web/src/features/create-project/core/renewable-energy/step-handlers/reinstatement/involves-reinstatement/`):
- Same logic as the urban handler (same answer type, same dependency rules, same schedule fallback).

**Step registry** (`step-handlers/stepHandlerRegistry.ts` for renewable energy):
- Register before `SOILS_DECONTAMINATION_INTRODUCTION`.

**Step enum / stepper**:
- Add `INVOLVES_REINSTATEMENT` to the renewable energy steps union.

**Project generator** (renewable energy equivalent of `UrbanProjectGenerator`):
- Same omission logic as Step 4 when `involvesReinstatement: false`.

**Tests** (`renewable-energy/__tests__/steps/involvesReinstatement.step.spec.ts`):
- Same scenarios as the urban test.

### Validation

```bash
pnpm --filter web typecheck
pnpm --filter web lint
pnpm --filter web test
pnpm -r typecheck
pnpm -r test
```

---

## Step 6 — Domain invariant enforcement

**Objective**: Make `involvesReinstatement` the authoritative source of truth at the domain boundary. If `involvesReinstatement: false`, the domain rejects (not silently strips) any project that also carries reinstatement expenses, a reinstatement schedule, or a reinstatement contract owner. This catches bugs in callers early rather than relying on the computation-time gate added in Step 3.

### Changes

**Domain factory / validation** (wherever `ReconversionProject` is constructed or validated before save):
- In the create and update UseCases (or a shared domain factory), assert: if `involvesReinstatement === false` then `reinstatementCosts`, `reinstatementSchedule`, and `reinstatementContractOwner` must all be absent/empty.
- Return a new failure type (e.g. `"InvalidReinstatementData"`) when the invariant is violated.

**Unit tests** (create and update UseCase specs):
- `involvesReinstatement: false` + no reinstatement data → success (existing happy path, unchanged).
- `involvesReinstatement: false` + reinstatement expenses present → `"InvalidReinstatementData"` failure.
- `involvesReinstatement: true` + reinstatement data present → success (unchanged).

### Notes

- The computation-time gate in `ReconversionProjectImpactsService` (Step 3) stays as defense-in-depth against stale pre-Step-6 data.
- The ADEME CSV importer already derives `involvesReinstatement` from whether costs are present, so it naturally satisfies the invariant.

### Validation

```bash
pnpm --filter api typecheck
pnpm --filter api lint
pnpm --filter api test:unit src/reconversion-projects
```

---

## Log

### 2026-06-23 — Step 1: Data model

**What I did:**
- Created migration `20260623145011_add-involves_reinstatement-to-reconversion_projects-table.ts` (`boolean NOT NULL DEFAULT true`).
- Added `involvesReinstatement: z.boolean()` to `createReconversionProjectSchema` in `packages/shared/src/reconversion-projects/reconversionProjectSchemas.ts`.
- Added `involves_reinstatement: boolean` to `SqlReconversionProject` in `tableTypes.d.ts`.
- Added `involvesReinstatement: boolean` mapping to `SqlReconversionProjectRepository` (save, update, getById).
- Added `involves_reinstatement` field to `ReconversionProjectSqlResult` type in repository.
- Fixed all test fixtures and mock objects missing the new required field across API and web.
- Added `involvesReinstatement: true` default to both web project creation actions (`customProjectSaved.action.ts`, `urbanProjectCustomSaved.action.ts`) and both shared project generators (`PhotovoltaicPowerPlantProjectGenerator`, `UrbanProjectGenerator`) and the ADEME CSV importer.

**Difficulties:**
- The field is required (not optional) in Zod, so every place that constructs a `ReconversionProject` or `ReconversionProjectSavePropsDto` needed to be updated. Found 15+ sites across shared, API, and web.
- The DB migration couldn't be applied (no local Postgres running), but typecheck validation covers all consumers.

**Decisions:**
- Made `involvesReinstatement` required (not optional with default) in the Zod schema, consistent with spec intent. All existing consumers default to `true`.
- Added `involvesReinstatement: true` hardcoded in both web creation actions and both project generators for Step 1; Steps 4 and 5 will replace these with the actual user-selected value.
- For ADEME CSV import, used `hasReinstatement` (existing boolean derived from the "Montant global de remise en état" CSV column) as the value.

**Revisions:**
- None. Followed spec exactly.

---

### 2026-06-24 — Step 2: API wiring

**What I did:**
- Added `"involves_reinstatement"` to the SELECT clause in `SqlReconversionProjectRepository.getById()` — the column was mapped in the result type but not actually fetched from the DB.
- Fixed 3 existing integration test expectations that do `SELECT *` on `reconversion_projects` and use full-equality assertions — they were missing `involves_reinstatement` in expected rows: minimal PV save, exhaustive PV save, and urban project save in the controller duplicate test.
- Added 1 new integration test: `involvesReinstatement: false` round-trip (save → getById).

**Difficulties:**
- The Step 1 log claimed `getById` mapping was done; it was — the `ReconversionProjectSqlResult` type included `involves_reinstatement` and the result mapping referenced it — but the SELECT clause was never updated, so the column was always `undefined` at runtime. Caught by the failing test.
- RTK proxy was filtering grep output, requiring `rtk proxy grep` to see match details.
- The integration test runner changed from Vitest to `node:test` between Step 1 and Step 2; the path-filter argument syntax no longer works — must run `pnpm test:integration` without a path argument.

**Decisions:**
- Kept `involvesReinstatement: z.boolean()` (required, no default) — all callers already set the value explicitly.
- Single `false`-case test only; the `true` case is already covered by the existing exhaustive save tests.

**Revisions:**
- Removed `.default(true)` after code review: silently masks missing-field bugs.
- Replaced a `describe` block with two tests by a single flat test for the `false` case only.

---

### 2026-06-24 — Step 3: Impacts audit

**What I did:**
- Added a new describe block "when involvesReinstatement is false" in `ReconversionProjectImpactsService.spec.ts`.
- Test creates two services: one WITH reinstatement (expenses + schedule) and one WITHOUT (empty expenses, no schedule), both using a 10 000 KWc PV project to guarantee non-zero forecast jobs.
- Asserts: (1) operations are unaffected, (2) conversion.forecast is strictly lower without reinstatement (no reinstatement job contribution), (3) `economicBalance.costs.siteReinstatement` is `undefined` when no reinstatement costs.

**Difficulties:**
- Initial fixture used `electricalPowerKWc: 53` which rounds to 0 FTJ for operations AND conversion over 10 years. With no reinstatement, `totalForecastFullTimeJobs === 0` → service returns `undefined` → impossible to assert job values. Fixed by using a 10 000 KWc plant in the test.
- `!` non-null assertions flagged by `no-unnecessary-type-assertion` after `assert.ok(x !== undefined)` — TypeScript narrows the type, making `!` redundant. Removed.

**Decisions:**
- Used a comparison approach (with vs without reinstatement) rather than hardcoding expected job values, since the exact numbers depend on rounding and are tested elsewhere.
- No implementation changes needed: the impacts engine already produces zero reinstatement outputs when `reinstatementExpenses: []` and `reinstatementSchedule: undefined`.

**Revisions:**
- Dropped the full-time jobs test after code review: `FullTimeJobsImpactService.spec.ts` already covers this at lower level; testing it again through `ReconversionProjectImpactsService` added noise without new coverage. Kept only the economic balance assertion.
- Added `involvesReinstatement: boolean` to `InputReconversionProjectData` (raised during Step 3 review). Cascaded through: `ReconversionProjectImpactsDataView` in shared, `SqlReconversionProjectImpactsQuery` SELECT + mapping, `quickComputeUrbanProjectImpactsOnFricheUseCase` explicit mapping, and `involvesReinstatement: true` fixtures in 9 spec files.
- WITHOUT scenario keeps `reinstatementContractOwnerName` (developer = owner) so `siteReinstatement: undefined` is driven by the empty expenses guard, not the ownership guard.
