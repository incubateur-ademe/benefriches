# [ADR-0007] Keep `shared` lean: move API-only domain code to `api`

- **Date**: 2026-03-05
- **Status**: Accepted

## Context

ADR-0003 established a `packages/shared` package for cross-app types, DTOs, and domain vocabulary. Over time, `packages/shared/src/site/` accumulated code that was **only ever used by the API**:

- Full domain interfaces (`Friche`, `AgriculturalOperationSite`, `NaturalAreaSite`, `Site`)
- Zod validation schemas for full site models (`baseSiteSchema`, `fricheSchema`, etc.)
- Factory functions (`createFriche`, `createAgriculturalOrNaturalSite`)
- Generator classes (`FricheGenerator`, `AgriculturalOperationGenerator`, `NaturalAreaGenerator`)
- Site generation types (`SiteGenerator`, `SiteGenerationProps`, `City`)

The web app only used a small subset: three utility functions for computing soils distributions and one function for contamination percentage estimation.

Having API-only production code in `shared` blurs the sharing boundary, slows shared builds, and makes it harder to reason about who owns what.

## Decision

Apply the rule: **code belongs in `shared` only if it is consumed by both `api` and `web`**.

For the site domain specifically:

- **Stays in `shared`**: `siteNatureSchema`, `SiteNature`, `addressSchema`, `Address`, and the handful of utility functions the web app actually calls (`getSoilsDistributionForFricheActivity`, `getSoilsDistributionForAgriculturalOperationActivity`, `getSoilsDistributionForNaturalAreaType`, `getContaminatedPercentageFromFricheActivity`)
- **Moves to `apps/api/src/sites/core/models/`**: all domain interfaces, full Zod schemas, factory functions, generator classes, site generation types, and the factory tests

When extracting, utility functions that web uses are split into focused single-purpose files (e.g., `friche/contaminatedSoils.ts`) rather than left as side-exports from generator files.

## Options Considered

### Option 1: Status quo — keep all domain code in `shared`

- **Pros**: Single location for all site domain code; no imports to update
- **Cons**: `shared` is misleading — it contains code only one app uses; shared build includes unnecessary code; violates the principle that drove ADR-0003

### Option 2: Move API-only code to `api` (chosen)

- **Pros**: `shared` accurately reflects what is shared; API owns its domain factories; clearer boundary guides future placement decisions
- **Cons**: Import paths in API files must be updated; requires coordinating a non-trivial refactor

## Consequences

### Positive

- `shared` is now a reliable signal: if it's there, both apps use it
- API domain code lives alongside the usecases and repositories that use it, following clean architecture
- Smaller `shared` build output
- Future developers have a clear rule for placement: check imports before putting new code in `shared`

### Negative

- Two locations now define "site domain": `shared` for the shared vocabulary (`SiteNature`, `Address`) and `api` for the full model — developers must know which to reach for
- Refactors that move code out of `shared` require updating all API import paths

## Links

- Related ADRs: [ADR-0003](0003-shared-package-for-cross-app-types.md), [ADR-0001](0001-clean-hexagonal-architecture.md)
