# Codebase Concerns

**Analysis Date:** 2026-03-12

## Tech Debt

**Incomplete Urban Zone Implementation:**
- Issue: Urban zone site nature is not fully supported in impact calculations—throws error when attempting computation
- Files: `apps/api/src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase.ts` (lines 119, 609)
- Impact: Urban zone sites cannot have their impacts calculated in urban sprawl comparison. Feature is half-implemented in web but blocked on API support
- Fix approach: Complete the impact calculation service for urban zone sites, add test coverage for urban zone comparisons, and verify end-to-end flow

**Hardcoded Calculation Parameter (V2 Quartier):**
- Issue: Property value increase calculation has a hardcoded `false` parameter with TODO comment for future calculation method
- Files: `apps/api/src/reconversion-projects/core/model/project-impacts/UrbanProjectImpactsService.ts` (line 185)
- Impact: Property value calculations for urban projects may not reflect accurate data; parameter should be computed based on quartier data
- Fix approach: Implement proper calculation method for quartier V2 parameter, update tests to validate correct parameter usage

**Manual Shared Package Build Requirement:**
- Issue: Shared package changes require manual `pnpm --filter shared build` — no automatic rebuild on file changes
- Files: `packages/shared/package.json`, workflow in both `apps/api/` and `apps/web/`
- Impact: Developers can easily forget to rebuild shared package after changes, leading to stale types in dependent apps; CI doesn't catch this until typecheck runs
- Fix approach: Add automated rebuild in shared watch mode or create pre-commit hook that detects shared changes and builds automatically; update CLAUDE.md to emphasize this step

## Test Coverage Gaps

**Core Impact Calculation Services Without Direct Unit Tests:**
- What's not tested: Individual impact calculation services for:
  - `UrbanFreshnessRelatedImpactsService.ts` — no test file
  - `TravelRelatedImpactsService.ts` — no test file
  - `InfluenceAreaService.ts` — no test file
  - Individual impact modules (e.g., `propertyValueImpact.ts`, `soilsCo2eqStorage.ts`)
- Files: `apps/api/src/reconversion-projects/core/model/project-impacts/` (see 30+ .ts files without corresponding .spec.ts)
- Risk: Impact calculations could regress unnoticed; changes to these services require manual testing through integration tests only
- Priority: Medium (integration tests exist but direct unit tests would catch issues earlier)

**Web State Management Reducer Coverage:**
- What's not tested: 20+ Redux reducers without clear test file associations in some cases
- Files: `apps/web/src/` (multiple `.reducer.ts` files)
- Risk: State mutations could break view rendering or introduce subtle bugs in step handlers
- Priority: Medium (step handler tests exist but raw reducer mutations need coverage)

**Urban Zone Creation Wizard E2E Tests:**
- What's not tested: Complete urban zone site creation flow through UI
- Files: `apps/web/src/features/create-site/core/urban-zone/`
- Risk: The new urban zone feature (added March 2026) has unit/integration tests but may have UI interaction issues
- Priority: High (recent feature, check e2e test coverage)

**Error Handling in HTTP Services:**
- What's not tested: Error handling paths in web infrastructure services
- Files: Multiple `Http*Service.ts` files in `apps/web/src/features/*/infrastructure/`
- Risk: Network errors, malformed responses, or API changes could cause unhandled Promise rejections
- Priority: Medium (InMemory mocks exist, but real HTTP error paths need coverage)

## Fragile Areas

**Complex Database Migration with Data Transformation:**
- Files: `apps/api/src/shared-kernel/adapters/sql-knex/migrations/20251126094945_replace-space-distribution-by-soils-distribution-space-category-for-urban-reconversion-project.ts` (17,111 lines)
- Why fragile: Large migration with data validation logic embedded; transforms legacy space distribution to new soils distribution schema with warning system
- Safe modification:
  1. Review `checkSpaceDistributionMigration()` logic before any changes
  2. Test with production-like dataset sizes
  3. Verify backward compatibility warning messages if modifying validation
  4. Run full integration test suite after touching migration data transformation
- Test coverage: Migration has inline validation but should have dedicated migration test

**Urban Sprawl Impacts Comparison Computation (791 lines):**
- Files: `apps/api/src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase.ts`
- Why fragile:
  - Deeply nested impact merging logic with 9 switch/case statements for merging different impact types
  - Handles 4 different site nature types with 3 different code paths each
  - Uses lambda generators for comparison sites with hardcoded default values
  - Complex impact amount aggregation with multiple conditional branches
  - Error prone: missing a single impact type merge could silently drop data from comparison
- Safe modification:
  1. Run full spec test (`computeProjectUrbanSprawlImpactsComparison.usecase.spec.ts` — 912 lines) before and after changes
  2. Add new test case for any new impact type before modifying merge logic
  3. Use immutable patterns — don't mutate impact objects mid-computation
  4. Verify both base case and comparison case impacts are computed
- Test coverage: Comprehensive but test file is 912 lines — indicates hidden complexity

**Step Handler Pattern in Web (Urban Project):**
- Files: `apps/web/src/shared/core/reducers/project-form/urban-project/step-handlers/`
- Why fragile:
  - Implements cascading dependency rules with auto-invalidation/recomputation
  - Supports both creation and update modes through factory pattern
  - Confirmation dialogs trigger on step dependency changes
  - Shortcuts auto-complete multiple steps based on conditions
  - Recomputation preserves user edits while updating dependent values
- Safe modification:
  1. Test with `StoreBuilder` helper from `__tests__/_testStoreHelpers.ts` before committing
  2. Run all urban project step tests: `pnpm --filter web test src/shared/core/reducers/project-form/urban-project/__tests__/`
  3. Verify dependency rules don't create circular references
  4. Check that shortcuts don't bypass required validation
- Test coverage: Pattern is well-tested but any new dependency rule needs test case

**SocioEconomic Impact Merging Logic (170+ lines):**
- Files: `apps/api/src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase.ts` (lines 170-370)
- Why fragile: Handles 6+ different impact types with different merging strategies (merge, replace, aggregate details); easy to forget an impact type
- Safe modification:
  1. Any new impact type requires update to `mergeSocioEconomicImpacts()` function
  2. Add test case in spec for the new impact type
  3. Verify the merged impact includes both project and statu quo components where applicable

## Performance Bottlenecks

**Urban Sprawl Impacts Computation Makes Multiple Sequential API Calls:**
- Problem: Computing comparison impacts requires 3 separate carbon storage lookups (base site, project, comparison site) that are awaited sequentially
- Files: `apps/api/src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase.ts` (lines 621-641)
- Cause: Three separate calls to `getCarbonStorageFromSoilDistributionService.execute()` can't be parallelized due to dependency on city code
- Improvement path:
  1. Move carbon storage calls into `Promise.all()` since they are independent
  2. Cache city stats lookups to avoid repeated queries
  3. Consider batch API for carbon storage lookups

**Large Impact Service Instantiation:**
- Problem: Creating new instances of `UrbanProjectImpactsService` and `PhotovoltaicProjectImpactsService` for each comparison case instantiates multiple service objects
- Files: `apps/api/src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase.ts` (lines 137-158)
- Cause: Services created inline within comparison computation rather than pre-instantiated
- Improvement path: Inject impact services as dependencies rather than creating them locally

**Web Redux Store Size with Project Impact Data:**
- Problem: `projectImpacts.mock.ts` contains 437 lines of detailed impact data; large mock datasets can slow selector computations
- Files: `apps/web/src/features/projects/application/project-impacts/projectImpacts.mock.ts`
- Cause: Complex impact structure with nested details replicated in mock data
- Improvement path: Use factory function for mock data generation; memoize selectors for expensive computations

## Security Considerations

**Auth Link Exposure in Error Messages:**
- Risk: `SendAuthLinkUseCase` returns generic success message even when user doesn't exist (correct behavior) but error message for rate limiting could expose user existence check
- Files: `apps/api/src/auth/core/sendAuthLink.usecase.ts`, `apps/api/src/auth/adapters/auth.controller.ts`
- Current mitigation: Controller returns 400 with generic message; backend logs rate limit hit
- Recommendations:
  1. Audit all auth endpoints for timing attack vectors
  2. Add rate limiting metrics to monitor for brute force attempts
  3. Document auth security assumptions in ADR

**Environment Variables Not Validated at Startup:**
- Risk: Missing or invalid env vars could cause runtime errors in production
- Files: `apps/web/src/app/envVars.ts` throws error if required vars missing, but timing may be late
- Current mitigation: `envVars.ts` throws during app initialization
- Recommendations:
  1. Add pre-flight check script to validate all required env vars before app start
  2. Add schema validation for env var formats (URLs, ports, etc.)

**Hardcoded Default Values in Comparison Site Generation:**
- Risk: Comparison sites are generated with hardcoded default values (e.g., "INDUSTRY" activity, "POLYCULTURE_AND_LIVESTOCK")
- Files: `apps/api/src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase.ts` (lines 582-611)
- Current mitigation: These are intentional defaults for comparison scenarios
- Recommendations:
  1. Document why these defaults were chosen
  2. Add ability to customize comparison site parameters via API
  3. Consider making defaults configurable per region/city

## Scaling Limits

**Database Migration History (70+ migrations):**
- Current capacity: 70 migrations tracked; migration startup time increases with each addition
- Limit: At ~100+ migrations, startup time becomes noticeable in dev/test environments
- Scaling path:
  1. Create migration archive snapshots periodically
  2. Reset test database from snapshot rather than replaying all migrations
  3. Document baseline migration for new developers

**Redux Store with Large Project Datasets:**
- Current capacity: Single project with full impact details fits in store; multiple projects with detailed impacts not tested
- Limit: Rendering thousands of projects with full impact data would cause memory pressure
- Scaling path:
  1. Implement pagination for project lists
  2. Load impact details on-demand rather than in list view
  3. Use normalized state shape for projects/impacts

**Urban Zone MVP Feature Completeness:**
- Current capacity: Site creation works; impacts calculation blocked
- Limit: Cannot fully support urban zone projects until impacts calculation implemented
- Scaling path:
  1. Complete impact calculation for urban zone (see Tech Debt section)
  2. Add urban zone support to all impact types (renewable energy, urban project, etc.)
  3. Test end-to-end flow through comparison view

## Dependencies at Risk

**Date Manipulation Library (date-fns ~4.1.0):**
- Risk: Major version bump could contain breaking API changes
- Impact: Numerous utilities depend on date-fns; API changes would require updates across codebase
- Migration plan: Monitor date-fns releases; test major upgrades in isolated branch before merging

**Zod Validation Library (~4.3.6):**
- Risk: Schema validation failures could change between versions; breaking changes possible
- Impact: All DTOs validated with Zod; version change could alter validation behavior
- Migration plan: Lock version in monorepo; test schema validation after any upgrade

**TypeScript Strict Mode Dependency:**
- Risk: Code is type-strict; loosening strict mode would be a regression risk
- Impact: New code must match strict type requirements; this is a strength but limits flexibility
- Migration plan: Continue enforcing strict mode in pre-commit hooks

## Missing Critical Features

**Urban Zone Impact Calculations:**
- Problem: Urban zone sites created via web wizard cannot have their impacts calculated
- Blocks: Urban zone projects cannot reach impact comparison view; feature incomplete
- Workaround: Users cannot create urban zone projects yet (feature is new/in-progress)
- Priority: High (blocks urban zone MVP completion)

**Support Ticket Contact Button:**
- Problem: Two locations have TODOs for displaying support button: auth failure page and access link not received page
- Blocks: Users cannot easily contact support if authentication fails
- Files: `apps/web/src/features/onboarding/views/pages/auth-with-token/AuthWithToken.tsx` (line 26), `apps/web/src/features/onboarding/views/pages/access-benefriches/AuthLinkNotReceivedHelp.tsx` (line 23)
- Priority: Medium (users can still contact support through main site, but not convenient)

**Quartier V2 Property Value Calculation:**
- Problem: Hardcoded `false` parameter blocks accurate property value impact calculation
- Blocks: Urban project impacts use placeholder calculation instead of real quartier data
- Priority: Medium (impacts are still calculated, just with simplified formula)

---

*Concerns audit: 2026-03-12*
