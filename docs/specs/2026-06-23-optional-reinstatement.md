# Optional Reinstatement — Implementation Plan

> **Context**: Today every reconversion project on a friche unconditionally includes reinstatement. We want users to be able to declare that their project does **not** involve reinstatement. This plan adds a boolean `involvesReinstatement` to the data model and gates all reinstatement logic behind it in both creation wizards and the impacts engine.
>
> **Reference**: [Impact analysis](./optional-reinstatement-impact-analysis.md)

## Status

**Current step: Step 2 — API wiring**

| Step | Status |
|---|---|
| Step 1 — Data model | ✅ done |
| Step 2 — API wiring | ✅ done |
| Step 3 — Impacts audit | 🔲 todo |
| Step 4 — Urban project creation wizard | 🔲 todo |
| Step 5 — PV project creation wizard | 🔲 todo |

---

## Agent instructions

**Use TDD for every change**: write the test first, confirm it fails, implement until it passes, then move on. Never write implementation code before a failing test exists for it. When fixing a bug or correcting behaviour, update the relevant test case or add a new one before touching the implementation.

**After completing each step**:
1. Run the step's validation commands and confirm they all pass.
2. Update the status table above to mark the step done.
3. Append a log entry (see below).
4. **Ask the user**: "The step is done. Can you confirm it works as expected and that a code review has been done?" Wait for explicit confirmation before continuing.
5. Once confirmed, run `/generate-commit-message` and present the result. Do not commit — let the user do it.

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
- Added `.default(true)` to `involvesReinstatement: z.boolean()` in `packages/shared/src/reconversion-projects/reconversionProjectSchemas.ts` so existing HTTP clients that omit the field default to `true`.
- Fixed 3 existing integration test expectations that do `SELECT *` on `reconversion_projects` and use `.toEqual()` — they were missing `involves_reinstatement` in expected rows (would have failed against the new DB column): minimal PV save, exhaustive PV save, and urban project save in the controller duplicate test.
- Added 2 new round-trip integration tests: `involvesReinstatement: false` and `involvesReinstatement: true` saved via `save()` and asserted via `getById()`.

**Difficulties:**
- The Step 1 log claimed `getById` mapping was done; it was — the `ReconversionProjectSqlResult` type included `involves_reinstatement` and the result mapping referenced it — but the SELECT clause was never updated, so the column was always `undefined` at runtime. Caught by the failing test.
- RTK proxy was filtering grep output, requiring `rtk proxy grep` to see match details.

**Decisions:**
- Added `.default(true)` at the schema factory level (affects both HTTP and domain schemas). Harmless for the domain schema since the controller always provides the field after HTTP validation.
- Fixed all 3 broken `SELECT *` / `toEqual` tests rather than narrowing them to `toMatchObject` — keeping exhaustive assertions is the documented project preference.

**Revisions:**
- None.
