# [ADR-0008] Use static per-parcel-type step IDs instead of loop mechanism for per-item wizard steps

- **Date**: 2026-03-09
- **Status**: Accepted

## Context

The urban zone site creation wizard needs to collect soils distribution and buildings floor area data for each selected land parcel type (up to 4 types: COMMERCIAL_ACTIVITY_AREA, PUBLIC_SPACES, SERVICED_SURFACE, RESERVED_SURFACE).

An initial implementation used a loop mechanism: 3 shared step IDs (`LAND_PARCEL_SOILS_SELECTION`, `LAND_PARCEL_SOILS_DISTRIBUTION`, `LAND_PARCEL_BUILDINGS_FLOOR_AREA`) were reused for each parcel, with `currentLandParcelIndex` tracking position and `applyStateMutation`/`applyBackMutation` callbacks on handlers to manage `landParcels[]` state outside the normal step handler flow. This diverged from the established handler patterns (ADR-0004, ADR-0006) where handlers return declarative data and the infrastructure stores it.

## Decision

Replace the loop mechanism with **static per-parcel-type step IDs** — one pair of step IDs per parcel type (soils distribution + buildings floor area), for 8 total. A **handler factory** creates identical `AnswerStepHandler` instances parameterized by parcel type.

This eliminates:
- `applyStateMutation` / `applyBackMutation` from handler types
- `currentLandParcelIndex` and `landParcels[]` from wizard state
- `stateMutation` field from `StepUpdateResult`

Navigation between parcel types is handled by `getNextStepId`/`getPreviousStepId` reading the selected parcel types from `LAND_PARCELS_SELECTION` step answers. Each parcel's data lives in its own step answers slot.

### Key components

- **`parcelStepMapping.ts`** — maps `UrbanZoneLandParcelType` → step IDs, with reverse lookup and ordered sequence helpers
- **`parcelSoilsHandlerFactory.ts`** — `createParcelSoilsDistributionHandler(parcelType)` and `createParcelBuildingsFloorAreaHandler(parcelType)` returning standard `AnswerStepHandler`s
- **Selector factories** — `createParcelSoilsDistributionSelector(parcelType)` and `createParcelBuildingsFloorAreaSelector(parcelType)`
- **Soils summary** — aggregates data by reading all per-parcel distribution step answers

## Options Considered

### Option 1: Static per-parcel-type step IDs with handler factory (chosen)

Each parcel type gets its own step IDs. A factory creates the handlers.

- **Pros**: Handler types match existing patterns exactly (ADR-0004, ADR-0006) — no new abstractions; each step independently testable; back navigation trivial; no mutable loop state
- **Cons**: 8 step IDs instead of 3; registry has more entries; if new parcel types are added, new step IDs must be added to the union type

### Option 2: Loop with applyStateMutation/applyBackMutation (initial implementation, replaced)

Shared step IDs reused per parcel, with callback hooks for state mutation.

- **Pros**: Fewer step IDs (3 vs 8); works for any number of parcel types without adding step IDs
- **Cons**: Introduces `applyStateMutation`/`applyBackMutation` — imperative state-mutating callbacks that diverge from the declarative handler pattern; requires `currentLandParcelIndex` and `landParcels[]` state; harder to test (loop position is implicit); back navigation requires mutation cleanup

### Option 3: Shared step IDs with per-parcel keyed answers (considered but not chosen)

Keep shared step IDs but store answers keyed by parcel index in a `byParcel` map, with `updateAnswersMiddleware` for data enrichment and derived loop index.

- **Pros**: No new step IDs; uses existing `updateAnswersMiddleware` pattern; removes imperative mutations
- **Cons**: Answer schema becomes more complex (`byParcel` map); loop index derivation adds complexity; still needs special handling for back navigation across parcels

## Consequences

### Positive

- Handler types are clean — no mutation hooks, matching the urban project and renewable energy patterns
- Per-parcel data is independently addressable via step ID — simpler selectors, simpler tests
- Adding/removing parcel types is a matter of adding/removing step IDs and factory calls — mechanical change
- Back navigation is straightforward — `getPreviousStepId` just returns the right step ID

### Negative

- Step ID count increases (8 per-parcel + existing steps)
- If the set of parcel types were dynamic (user-defined), this approach wouldn't work — but the 4 types are a fixed domain enum
- Views need pattern matching on step ID suffix to route to the right component (minor complexity in `StepContent.tsx`)

## Links

- Related ADRs: [ADR-0004 — Colocate urban project step definitions](0004-colocate-urban-project-step-definitions.md), [ADR-0006 — Step handler pattern for renewable energy wizard](0006-step-handler-pattern-for-renewable-energy-wizard.md)
