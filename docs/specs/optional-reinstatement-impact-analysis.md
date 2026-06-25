# Impact Analysis: Optional Reinstatement in Project Creation

> **Context**: As of 2026-06-23, every reconversion project on a friche unconditionally includes reinstatement. This document analyses what would need to change to let users opt out by answering a new question in both urban and PV project creation flows.

---

## Current State

Reinstatement is **unconditionally triggered for every FRICHE site**. The creation wizard always shows the decontamination → costs → schedule → owner steps, and the impacts engine always factors in reinstatement jobs and expenses. There is no user-facing toggle to opt out.

---

## Scope of Change

A new boolean field — `hasReinstatement` — needs to be captured early in the creation wizard and used to gate all downstream reinstatement logic in both the web form and the API impacts engine.

---

## Places That Assume Reinstatement (must change)

### Web — Creation Wizards

Both flows share the same logical structure. The gate step would sit **before** `SOILS_DECONTAMINATION_INTRODUCTION`.

| Location | File (relative to `apps/web/src/`) | What changes |
|---|---|---|
| Urban step sequence | `features/create-project/core/urban-project/` (step enum + stepper) | Add `HAS_REINSTATEMENT` step; gate the 5 downstream steps behind it |
| PV step sequence | `features/create-project/core/renewable-energy/` (step enum + stepper) | Same |
| Urban expenses handler | `step-handlers/expenses/expenses-reinstatement/expensesReinstatement.handler.ts` | Skip recomputation when `hasReinstatement = false` |
| Urban stakeholder handler | `step-handlers/stakeholders/stakeholders-reinstatement-contract-owner/` | Skip when `hasReinstatement = false` |
| Urban schedule handler | `step-handlers/schedule/schedule-projection/scheduleProjection.handler.ts` | Don't compute reinstatement dates when `hasReinstatement = false`; collapse installation start to "now + offset" |
| Default generator | `packages/shared/…/DefaultProjectGenerator.ts` lines 32–94 | `reinstatementContractOwner` / decontamination defaults gated on `hasReinstatement` |
| Project generator output | `UrbanProjectGenerator.getReconversionProject()` | Omit reinstatement fields when `hasReinstatement = false` |

### API — Impacts Engine

| Location | File (relative to `apps/api/src/`) | What changes |
|---|---|---|
| Full-time jobs | `…/full-time-jobs/fullTimeJobsImpactService.ts` | Guard `computeReinstatementFullTimeJobs` — return 0 when no reinstatement costs |
| Site reconversion economic impacts | `…/siteReconversionRelatedEconomicImpacts.ts` | Reinstatement cost subtracted from economic balance — must be 0 / absent when no reinstatement |
| Schedule-dependent impacts | Anywhere that uses `reinstatementSchedule` to derive durations or job spread | Return neutral values when schedule is absent |

The impacts engine already reads from project data rather than inferring from site nature, so **if the project is saved without reinstatement fields, most impact calculations will naturally produce zero**. The risk is silent assumptions — places that fall back to a default when a field is `null` rather than treating `null` as "no reinstatement."

---

## Data Model Migration

A single new column is enough:

```sql
-- Migration: add has_reinstatement to reconversion_projects
ALTER TABLE reconversion_projects
  ADD COLUMN has_reinstatement boolean NOT NULL DEFAULT true;
```

`DEFAULT true` ensures all existing projects are correctly classified (they were all created under the "always reinstatement" assumption). No existing rows need updating.

**Shared types** (`packages/shared/src/reconversion-projects/reconversionProjectSchemas.ts`): add `hasReinstatement: boolean` to `ReconversionProject` and `SqlReconversionProject`.

No changes to `reconversion_project_reinstatement_costs` — rows simply won't be inserted for projects without reinstatement.

---

## Edge Cases & Risks

| Concern | Detail |
|---|---|
| **Soil cost recomputation dependency** | `EXPENSES_REINSTATEMENT` step is listed as a dependency target of `SOILS_DECONTAMINATION_SELECTION`. When `hasReinstatement = false`, the dependency must be broken or the step must be treated as producing an empty answer, otherwise the recompute cascade silently fires. |
| **Schedule gap** | Today: installation start = reinstatement end + 1 day. Without reinstatement, what anchors the installation start date? The schedule step will need a new default (e.g. project creation date + construction lead time). |
| **Decontaminated surface area vs. reinstatement** | `decontaminatedSoilSurface` is stored even when decontamination plan is "none". When `hasReinstatement = false`, this field should be explicitly `0` to avoid confusion in impacts. |
| **Jobs impact** | Reinstatement jobs are the main source of short-term employment impact for friche projects. Setting them to zero will noticeably change the impact report — worth flagging to users in the UI. |
| **Existing projects in prod** | All existing projects have reinstatement. `DEFAULT true` handles migration safely. |

---

## Complexity Assessment

**Overall: Medium**

- The data model change is trivial (one column, one shared type).
- The creation wizard changes are **mechanical but spread across two parallel flows** — every reinstatement-related step in both `urban-project/` and `renewable-energy/` needs a gate, and the step sequencer needs updating. High risk of missing one.
- The impacts engine is largely safe because it reads saved data rather than re-deriving from site nature — but a targeted audit of every `null`-fallback in reinstatement-related computations is necessary.
- The schedule dependency is the trickiest behavioral change: installation start date needs a new anchor when there's no reinstatement phase.

Estimated scope: ~15–20 files touched, no architectural change, no new service. The main risk is **regression in impacts calculations** — existing projects must continue to produce identical results, and the change must not silently zero out reinstatement-derived impacts for projects that have them.
