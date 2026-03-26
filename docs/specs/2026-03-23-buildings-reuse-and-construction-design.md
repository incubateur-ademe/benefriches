# Buildings Reuse and Construction — Design Spec

> Urban project creation wizard: new steps for buildings reuse, demolition, and new construction.

## Context

The urban project creation wizard collects building use floor area distribution but does not distinguish between reusing existing site buildings and constructing new ones. This feature adds steps that ask users how much of the existing site buildings they plan to reuse, then derives demolition and new construction amounts, with downstream impacts on stakeholder and expense steps.

## Data Sources

- **Site buildings footprint**: `BUILDINGS` soil type surface area from site data (collected during site creation), i.e. `siteData.soilsSurfaceAreaDistribution.BUILDINGS`
- **Project buildings footprint**: `BUILDINGS` soil type surface area from `URBAN_PROJECT_SPACES_SURFACE_AREA` step, i.e. `stepsState.URBAN_PROJECT_SPACES_SURFACE_AREA.payload.spacesSurfaceAreaDistribution.BUILDINGS`

Note: if a user selects building-related uses but does not allocate `BUILDINGS` soil type in the spaces step, the project buildings footprint is 0 — meaning 100% demolition of site buildings and no new construction. This is a valid (if uncommon) scenario.

## Core Logic

**Reuse** is user-input (m² or %, switchable). From this single input, two values are derived:

- **Demolished** = site buildings footprint - reuse
- **New construction** = max(0, project buildings footprint - reuse)

| Scenario | Site | Project | Reuse (input) | Demolished | New construction |
|---|---|---|---|---|---|
| No buildings on site | 0 | 3000 | N/A (skip) | 0 | 3000 |
| Full reuse, same size | 2000 | 2000 | 2000 | 0 | 0 |
| Partial reuse, smaller project | 2000 | 1500 | 1500 | 500 | 0 |
| Full reuse, bigger project | 2000 | 3000 | 2000 | 0 | 1000 |
| Partial reuse, bigger project | 2000 | 3000 | 1000 | 1000 | 2000 |
| No reuse at all | 2000 | 3000 | 0 | 2000 | 3000 |

## New Steps

### Buildings Chapter (7 new steps)

| Step ID | Type | Condition |
|---|---|---|
| `URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION` | Info | Site has buildings |
| `URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION` | Info | Site has NO buildings |
| `URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE` | Answer | Site has buildings |
| `URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO` | Info | demolished > 0 |
| `URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA` | Answer | reuse > 0 AND new construction > 0 |
| `URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO` | Info | new construction > 0 |
| `URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA` | Answer | reuse > 0 AND new construction > 0 |

### Other Sections (2 new steps)

| Step ID | Type | Section | Condition |
|---|---|---|---|
| `URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER` | Answer | Stakeholders | new construction > 0 |
| `URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` | Answer | Expenses | developer is builder OR reuse > 0 |

### Full Buildings Chapter Sequence

Precondition at `SOILS_CARBON_SUMMARY`:
- feature flag OFF: enter buildings chapter only when `willHaveBuildings(stepsState)` is `true` (legacy behavior)
- feature flag ON: enter buildings chapter when `siteHasBuildings(siteData)` is `true` OR `willHaveBuildings(stepsState)` is `true`

With feature flag ON, users skip this chapter only when both are `false` (no buildings on site and no buildings planned in project).

```
BUILDINGS_INTRODUCTION (existing)
  -> BUILDINGS_USES_FLOOR_SURFACE_AREA (existing, overall)
  -> [site has buildings?]
      YES -> BUILDINGS_REUSE_INTRODUCTION ("Bonne nouvelle !")
           -> BUILDINGS_FOOTPRINT_TO_REUSE (m2 / % input)
           -> [demolished > 0?] -> BUILDINGS_DEMOLITION_INFO
           -> [reuse > 0 AND new > 0?] -> BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA
           -> [new > 0?] -> BUILDINGS_NEW_CONSTRUCTION_INFO ("X m2 a construire")
           -> [reuse > 0 AND new > 0?] -> BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA
      NO  -> BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION ("X m2 a construire")
  -> [next section: decontamination or resale]
```

## Answer Schemas

### `URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE`

```typescript
{ buildingsFootprintToReuse: number } // in m2, max = site buildings footprint
```

### `URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`

```typescript
{ existingBuildingsUsesFloorSurfaceArea: Partial<Record<UrbanProjectUseWithBuilding, number>> }
```

### `URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA`

```typescript
{ newBuildingsUsesFloorSurfaceArea: Partial<Record<UrbanProjectUseWithBuilding, number>> }
```

### `URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER`

```typescript
{ developerWillBeBuildingsConstructor: boolean }
```

### `URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`

```typescript
{
  technicalStudiesAndFees?: number,        // Etudes et honoraires techniques (always shown)
  buildingsConstructionWorks?: number,     // Travaux de construction des batiments (only if new construction > 0)
  buildingsRehabilitationWorks?: number,   // Travaux de rehabilitation des batiments (only if reuse > 0)
  otherConstructionExpenses?: number       // Autres depenses de construction ou de rehabilitation (always shown)
}
```

## Domain Reader Functions

New file: `step-handlers/buildings/buildingsReaders.ts`

```typescript
function getSiteBuildingsFootprint(siteData, stepsState): number
function getProjectBuildingsFootprint(stepsState): number
function getBuildingsFootprintToReuse(stepsState): number | undefined
function getBuildingsFootprintToDemolish(siteData, stepsState): number   // site - reuse
function getBuildingsFootprintToConstruct(siteData, stepsState): number  // max(0, project - reuse)
function siteHasBuildings(siteData): boolean
function willDemolishBuildings(siteData, stepsState): boolean
function willConstructNewBuildings(siteData, stepsState): boolean
function hasBothReuseAndNewConstruction(siteData, stepsState): boolean
```

New file: `step-handlers/stakeholders/stakeholdersReaders.ts`

```typescript
function isDeveloperBuildingsConstructor(stepsState): boolean
```

## Dependency Rules

### `BUILDINGS_FOOTPRINT_TO_REUSE` (key decision point)

| When reuse changes... | Affected step | Action |
|---|---|---|
| new construction becomes 0 (was > 0) | `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA` | **delete** |
| new construction becomes 0 (was > 0) | `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA` | **delete** |
| new construction becomes 0 (was > 0) | `STAKEHOLDERS_BUILDINGS_DEVELOPER` | **delete** |
| new construction changes (still > 0) | `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA` | **invalidate** |
| reuse becomes 0 (was > 0) | `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA` | **delete** |
| reuse changes (still > 0) | `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA` | **invalidate** |
| any change | `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` | **invalidate** |

### `STAKEHOLDERS_BUILDINGS_DEVELOPER`

| When answer changes... | Affected step | Action |
|---|---|---|
| any change | `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` | **invalidate** |

### `BUILDINGS_USES_FLOOR_SURFACE_AREA` (existing overall step)

When the overall floor area distribution changes, the breakdown steps become invalid:

| Affected step | Action |
|---|---|
| `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA` | **invalidate** |
| `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA` | **invalidate** |

### Upstream cascading: when buildings are removed from the project

When uses or spaces change such that buildings are removed, all new answer steps must be deleted. The existing `BUILDINGS_STEPS` array in `urbanProjectSteps.ts` and `usesSelection.handler.ts` manually delete buildings-related steps. The following new answer steps must be added to this cascading deletion:

- `URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE`
- `URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`
- `URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA`
- `URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER`
- `URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`

Info steps (`BUILDINGS_REUSE_INTRODUCTION`, `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION`, `BUILDINGS_DEMOLITION_INFO`, `BUILDINGS_NEW_CONSTRUCTION_INFO`) do not need cascading deletion because they carry no persisted payload — they are navigation-only.

Implementation note: the implementer should check how `usesSelection.handler.ts` currently deletes buildings steps and extend that mechanism consistently (either by updating the `BUILDINGS_STEPS` array or by adding manual delete rules).

### Expense step condition clarification

The condition for `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` is: `isDeveloperBuildingsConstructor(stepsState) === true OR reuse > 0`.

When new construction = 0, the `STAKEHOLDERS_BUILDINGS_DEVELOPER` step is skipped, so `isDeveloperBuildingsConstructor` returns `false` by default. The expense step then only appears if reuse > 0 (for rehabilitation costs). This is correct behavior — no special-casing needed.

## Navigation

### Forward navigation updates to existing handlers

- **`BUILDINGS_USES_FLOOR_SURFACE_AREA`** (`getNextStepId`): route to `BUILDINGS_REUSE_INTRODUCTION` if site has buildings, or `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION` if not
- **`STAKEHOLDERS_PROJECT_DEVELOPER`** (`getNextStepId`): route to `STAKEHOLDERS_BUILDINGS_DEVELOPER` when new construction > 0, otherwise keep existing logic (reinstatement contract owner if friche, else expenses intro)
- **`EXPENSES_INSTALLATION`** (`getNextStepId`): route to `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` when (developer is builder OR reuse > 0), otherwise keep existing logic

### Forward navigation for new steps

- **`STAKEHOLDERS_BUILDINGS_DEVELOPER`** (`getNextStepId`): same logic as current `STAKEHOLDERS_PROJECT_DEVELOPER` exit — reinstatement contract owner if friche, else expenses intro
- **`EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`** (`getNextStepId`): same logic as current `EXPENSES_INSTALLATION` exit — projected operating expenses if buildings not resold, else revenues intro

### Buildings chapter exit routing

Multiple steps can be the "last step" in the buildings chapter depending on conditions. Each of these steps must implement the decontamination-vs-resale exit logic in `getNextStepId`:

| Last step condition | Step |
|---|---|
| Site has NO buildings | `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION` |
| reuse > 0, new = 0, no demolition | `BUILDINGS_FOOTPRINT_TO_REUSE` |
| reuse > 0, new = 0, demolition > 0 | `BUILDINGS_DEMOLITION_INFO` |
| reuse > 0, new > 0 | `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA` |
| reuse = 0, new > 0, demolition > 0 | `BUILDINGS_NEW_CONSTRUCTION_INFO` (after demolition info, no existing uses breakdown) |

Exit logic: if site has contaminated soils -> `SOILS_DECONTAMINATION_INTRODUCTION`, else -> `SITE_RESALE_INTRODUCTION`. Extract this as a shared helper (e.g., `getNextStepAfterBuildings` in `buildingsReaders.ts`) to avoid duplicating the logic across 5 handlers.

### Reverse navigation (getPreviousStepId)

Each new step implements `getPreviousStepId` with the same conditional logic in reverse:

| Step | Previous step |
|---|---|
| `BUILDINGS_REUSE_INTRODUCTION` | `BUILDINGS_USES_FLOOR_SURFACE_AREA` |
| `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION` | `BUILDINGS_USES_FLOOR_SURFACE_AREA` |
| `BUILDINGS_FOOTPRINT_TO_REUSE` | `BUILDINGS_REUSE_INTRODUCTION` |
| `BUILDINGS_DEMOLITION_INFO` | `BUILDINGS_FOOTPRINT_TO_REUSE` |
| `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA` | if demolished > 0: `BUILDINGS_DEMOLITION_INFO`, else: `BUILDINGS_FOOTPRINT_TO_REUSE` |
| `BUILDINGS_NEW_CONSTRUCTION_INFO` | if reuse > 0 AND new > 0: `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`, elif demolished > 0: `BUILDINGS_DEMOLITION_INFO`, else: `BUILDINGS_FOOTPRINT_TO_REUSE` |
| `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA` | `BUILDINGS_NEW_CONSTRUCTION_INFO` |
| `STAKEHOLDERS_BUILDINGS_DEVELOPER` | `STAKEHOLDERS_PROJECT_DEVELOPER` |
| `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` | `EXPENSES_INSTALLATION` |

### Reverse navigation updates to existing handlers

- **`STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER`** (`getPreviousStepId`): currently hardcodes `STAKEHOLDERS_PROJECT_DEVELOPER` — must be updated to return `STAKEHOLDERS_BUILDINGS_DEVELOPER` when new construction > 0
- **`EXPENSES_INTRODUCTION`** (`getPreviousStepId`): currently returns `STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER` (friche) or `STAKEHOLDERS_PROJECT_DEVELOPER` — must also consider `STAKEHOLDERS_BUILDINGS_DEVELOPER` when new construction > 0 and site is not friche
- **`SOILS_DECONTAMINATION_INTRODUCTION`** (`getPreviousStepId`): currently returns `BUILDINGS_USES_FLOOR_SURFACE_AREA` — must be updated to return the last step of the buildings chapter (use `getLastBuildingsChapterStep` helper)
- **`SITE_RESALE_INTRODUCTION`** (`getPreviousStepId`): currently returns `BUILDINGS_USES_FLOOR_SURFACE_AREA` when buildings exist — must be updated to return the last step of the buildings chapter (use `getLastBuildingsChapterStep` helper)

The `getLastBuildingsChapterStep` helper (companion to `getNextStepAfterBuildings`) encapsulates the conditional logic from the exit routing table to determine which step is last in the buildings chapter given the current context.

### No-buildings shortcut

When site has NO buildings (and the buildings chapter is entered), the flow is:
`BUILDINGS_USES_FLOOR_SURFACE_AREA` -> `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION` -> next section.
No reuse input, no breakdown steps, no stakeholder builder question (since there's no notion of "developer is builder" — construction is implicit).

If site has no buildings AND `willHaveBuildings` is `false`, users do not enter the buildings chapter at all (feature flag ON behavior).

## Stepper Configuration

All buildings steps belong to the `BUILDINGS` group. Stakeholder and expense steps belong to their respective groups.

| Step | Group | Label |
|---|---|---|
| `BUILDINGS_REUSE_INTRODUCTION` | `BUILDINGS` | (info step, no label) |
| `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION` | `BUILDINGS` | (info step, no label) |
| `BUILDINGS_FOOTPRINT_TO_REUSE` | `BUILDINGS` | Reutilisation des batiments |
| `BUILDINGS_DEMOLITION_INFO` | `BUILDINGS` | (info step, no label) |
| `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA` | `BUILDINGS` | Usages des batiments existants |
| `BUILDINGS_NEW_CONSTRUCTION_INFO` | `BUILDINGS` | (info step, no label) |
| `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA` | `BUILDINGS` | Usages des nouveaux batiments |
| `STAKEHOLDERS_BUILDINGS_DEVELOPER` | `STAKEHOLDERS` | Constructeur des batiments |
| `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` | `EXPENSES` | Construction et rehabilitation |

## View Components

All views in `shared/views/project-form/urban-project/`.

| Step | Title | Body / Instructions |
|---|---|---|
| `BUILDINGS_REUSE_INTRODUCTION` | "Bonne nouvelle ! Le site comporte deja des batiments" | "Vous pouvez utiliser tout ou partie de ce bati dans votre projet d'amenagement." |
| `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION` | "X m2 de surface au sol de nouveaux batiments seront a construire pour le projet urbain" | — |
| `BUILDINGS_FOOTPRINT_TO_REUSE` | "Quelle surface du bati existant disponible sera utilisee pour le projet urbain ?" | m2 input with % toggle, max = site buildings footprint, hint showing site buildings footprint |
| `BUILDINGS_DEMOLITION_INFO` | "X m2 de batiments seront demolis" | "Il s'agit de la surface des batiments existants que vous ne prevoyez pas d'utiliser dans votre projet." |
| `BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA` | "Quels usages accueilleront les batiments existants ?" | Recap of assigned uses from overall floor area step, constrained to selected uses |
| `BUILDINGS_NEW_CONSTRUCTION_INFO` | "X m2 de surface au sol de nouveaux batiments seront a construire pour le projet urbain" | — |
| `BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA` | "Quels usages accueilleront les nouveaux batiments ?" | Recap of assigned uses, remaining m2 after existing allocation |
| `STAKEHOLDERS_BUILDINGS_DEVELOPER` | "L'amenageur sera-t-il le constructeur des nouveaux batiments ?" | Yes/No radio |
| `EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION` | "Depenses de construction et rehabilitation de batiments" | 4 amount fields: etudes et honoraires techniques (always), travaux de construction (if new > 0), travaux de rehabilitation (if reuse > 0), autres depenses (always) |

## Uses Breakdown Constraints

The two uses breakdown steps (existing + new buildings) are only shown when **both** reuse > 0 AND new construction > 0. They are constrained:

- **Available uses**: only the uses selected in the overall floor area step
- **Sum constraint**: for each use, existing m2 + new m2 = total m2 from overall floor area step
- **Recap display**: both forms show the overall use distribution as instructions to help users allocate correctly

## Step Type Registration

New Info steps must be added to the `INTRODUCTION_STEPS` array in `urbanProjectSteps.ts`:
- `URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION`
- `URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION`
- `URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO`
- `URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO`

New Answer steps must have their schema added to `answersByStepSchemas` in `urbanProjectSteps.ts`:
- `URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE`
- `URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA`
- `URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA`
- `URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER`
- `URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION`

## Scope Boundaries

### In scope

- 9 new step handlers (7 buildings, 1 stakeholder, 1 expense)
- Domain reader functions (`buildingsReaders.ts`, `stakeholdersReaders.ts`)
- Navigation updates to existing handlers (`BUILDINGS_USES_FLOOR_SURFACE_AREA`, `STAKEHOLDERS_PROJECT_DEVELOPER`, `STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER`, `EXPENSES_INTRODUCTION`, `EXPENSES_INSTALLATION`, `SOILS_DECONTAMINATION_INTRODUCTION`, `SITE_RESALE_INTRODUCTION`)
- Dependency/invalidation rules
- View components for all new steps
- Unit tests for all handlers and readers
- Stepper configuration

- E2E tests covering the new buildings reuse/construction flows

- E2E tests covering nominal flows
- Integration tests (step handler tests) covering exhaustive scenario matrix

### Out of scope

- Backend/API changes (new data stays in frontend form state)
- Shared package changes (no new DTOs)
- Express flow changes (only custom flow affected)

### Feature Flag Rollout Note

For incremental rollout, gate the entry to the new buildings chapter in
`BUILDINGS_USES_FLOOR_SURFACE_AREA.getNextStepId` using
`BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled` (from
`apps/web/src/app/envVars.ts`):

- flag OFF: keep legacy route (`SOILS_DECONTAMINATION_INTRODUCTION` or `SITE_RESALE_INTRODUCTION`)
- flag ON: route to new chapter (`BUILDINGS_REUSE_INTRODUCTION` or `BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION`)

This rollout note does not require injecting feature flags into shared step context.

## E2E Tests

E2E tests cover only nominal, most common user flows. Exhaustive scenario coverage belongs in integration tests (step handler `__tests__/` files).

### E2E scenarios (3 nominal flows)

| Scenario | Site buildings | Project buildings | What to verify |
|---|---|---|---|
| No buildings on site | 0 | > 0 | "X m2 a construire" editorial shown, no reuse input, no stakeholder builder question |
| No reuse at all | > 0 | > 0 | "Bonne nouvelle" shown, reuse = 0, demolition editorial shown, new construction editorial shown, no uses breakdown |
| Full reuse with new construction | > 0 | > site | Reuse = 100%, no demolition, existing + new uses breakdown shown, stakeholder builder question shown, expenses step shown |

### Page objects to create/update

- New page object for the buildings reuse/construction steps (reuse input form, uses breakdown forms)
- Update existing urban project creation page objects to navigate through the new steps
- New page object for the stakeholder builder question
- Update expenses page object for the new construction/rehabilitation expense step

## Integration Tests

Exhaustive scenario coverage via step handler tests (following the pattern in `apps/web/src/features/create-site/core/urban-zone/steps/management/__tests__/`).

### Scenarios to cover in step handler tests

| Scenario | Site buildings | Project buildings | Key assertions |
|---|---|---|---|
| No buildings on site | 0 | > 0 | Skips reuse, goes to new construction intro |
| Buildings on site, no buildings planned in project (feature flag ON) | > 0 | 0 | Chapter is entered, reuse step shown, demolition info shown when reuse < site |
| Full reuse, same size | > 0 | = site | No demolition, no new construction |
| Partial reuse with demolition only | > 0 | < site | Demolition shown, no new construction |
| Full reuse with new construction | > 0 | > site | No demolition, existing + new uses breakdown |
| Partial reuse with both demolition and new construction | > 0 | > 0 | Full flow: demolition + existing uses + new construction + new uses |
| No reuse at all | > 0 | > 0 | Full demolition, new construction, no existing uses breakdown |

Additional step handler tests:
- Dependency rules: reuse change invalidates/deletes downstream steps correctly
- Navigation: forward and backward navigation for all conditional branches
- Uses breakdown constraints: sum validation, available uses filtering
- Stakeholder builder question: only shown when new construction > 0
- Expense step: conditional fields based on reuse/new construction

## E2E Tests

E2E tests should cover the key user flows through the new buildings chapter. Tests use the existing Playwright + Page Object pattern.

### Scenarios to cover

| Scenario | Site buildings | Project buildings | Key assertions |
|---|---|---|---|
| No buildings on site | 0 | > 0 | "X m2 a construire" editorial shown, no reuse input, no stakeholder builder question |
| Full reuse, same size | > 0 | = site | "Bonne nouvelle" shown, reuse = 100%, no demolition info, no new construction info |
| Partial reuse with demolition only | > 0 | < site | Reuse input, demolition editorial shown, no new construction |
| Full reuse with new construction | > 0 | > site | Reuse = 100%, no demolition, existing + new uses breakdown shown, stakeholder builder question shown |
| Partial reuse with both demolition and new construction | > 0 | > 0 | Full flow: reuse input, demolition info, existing uses, new construction info, new uses, stakeholder builder, expenses |
| No reuse at all | > 0 | > 0 | Reuse = 0, demolition shown, new construction shown, no existing uses breakdown |

### Page objects to create/update

- New page object for the buildings reuse/construction steps (reuse input form, uses breakdown forms)
- Update existing urban project creation page objects to navigate through the new steps
- New page object for the stakeholder builder question
- Update expenses page object for the new construction/rehabilitation expense step
