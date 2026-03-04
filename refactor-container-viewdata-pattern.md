# Refactor Container Components to ViewData Pattern

## Overview

This plan addresses **32 remaining container components** that violate the single ViewData selector pattern by calling `useAppSelector` multiple times. Each area can be refactored incrementally.

## How to Use This Plan

Execute by area:
```
Refactor the [AREA_NAME] area from @specs/refactor-container-viewdata-pattern.md
```

Example:
```
Refactor the "Project Impacts" area from @specs/refactor-container-viewdata-pattern.md
```

The checklist will be updated as each file is completed.

---

## Refactoring Pattern

### Before (Anti-pattern)
```typescript
const data1 = useAppSelector(selectData1);
const data2 = useAppSelector(selectData2);
const data3 = useAppSelector((state) => state.feature.data3);
```

### After (ViewData Pattern)
```typescript
// In selectors file
export type FeatureViewData = {
  data1: Data1Type;
  data2: Data2Type;
  data3: Data3Type;
};

export const selectFeatureViewData = (state: RootState): FeatureViewData => ({
  data1: selectData1(state),
  data2: selectData2(state),
  data3: state.feature.data3,
});

// In container
const { data1, data2, data3 } = useAppSelector(selectFeatureViewData);
```

### Test Requirement (MANDATORY)

Every new ViewData selector MUST have a test:

```typescript
// In __tests__/selectors.spec.ts or adjacent test file
describe("selectFeatureViewData", () => {
  it("returns composed view data from state", () => {
    const state = new StoreBuilder()
      .withFeatureData({ /* test data */ })
      .build()
      .getState();

    const viewData = selectFeatureViewData(state);

    expect(viewData).toEqual({
      data1: expectedData1,
      data2: expectedData2,
      data3: expectedData3,
    });
  });
});
```

---

## Areas

### 1. Project Impacts (HIGH PRIORITY)

**Selectors file**: `src/features/projects/core/projectImpacts.selectors.ts`
**Test file**: `src/features/projects/core/__tests__/projectImpacts.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 8 | `features/projects/views/project-page/impacts/charts-view/index.tsx` | `selectImpactsChartsViewData` |
| [x] | 6 | `features/projects/views/project-page/impacts/list-view/index.tsx` | `selectImpactsListViewData` |
| [x] | 3 | `features/projects/views/project-page/impacts/summary-view/index.tsx` | `selectImpactsSummaryViewData` |
| [x] | 3 | `features/projects/views/project-page/impacts/index.tsx` | `selectImpactsPageViewData` |

---

### 2. Urban Sprawl Comparison (HIGH PRIORITY)

**Selectors file**: `src/features/projects/core/urbanSprawlComparison.selectors.ts` (create if needed)
**Test file**: `src/features/projects/core/__tests__/urbanSprawlComparison.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 6 | `features/projects/views/project-impacts-urban-sprawl-comparison/index.tsx` | `selectUrbanSprawlComparisonViewData` |
| [x] | 3 | `features/projects/views/project-impacts-urban-sprawl-comparison/summary-view/index.tsx` | `selectUrbanSprawlSummaryViewData` |

---

### 3. Site Creation - Stakeholders (MEDIUM PRIORITY)

**Selectors file**: `src/features/create-site/core/selectors/createSite.selectors.ts` and `src/features/create-site/core/selectors/viewData.selectors.ts`
**Test file**: `src/features/create-site/core/__tests__/createSite.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 5 | `features/create-site/views/custom/site-management/stakeholders/owner/index.tsx` | `selectSiteOwnerFormViewData` |
| [x] | 3 | `features/create-site/views/custom/site-management/stakeholders/tenant/index.tsx` | `selectSiteTenantFormViewData` |
| [x] | 2 | `features/create-site/views/custom/site-management/stakeholders/is-site-operated/index.tsx` | `selectIsSiteOperatedFormViewData` |
| [x] | 3 | `features/create-site/views/custom/site-management/stakeholders/site-operator/index.tsx` | `selectSiteOperatorFormViewData` |

---

### 4. Site Creation - Express Forms (MEDIUM PRIORITY)

**Selectors file**: `src/features/create-site/core/selectors/createSite.selectors.ts`
**Test file**: `src/features/create-site/core/__tests__/createSite.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 3 | `features/create-site/views/express/surface-area/index.tsx` | `selectSiteSurfaceAreaFormViewData` |
| [x] | 3 | `features/create-site/views/express/result/index.tsx` | `selectExpressResultViewData` |
| [x] | 3 | `features/create-site/views/express/result/SiteFeaturesContainer.tsx` | `selectSiteFeaturesContainerViewData` |

---

### 5. Site Creation - Custom Forms (MEDIUM PRIORITY)

**Selectors file**: `src/features/create-site/core/selectors/createSite.selectors.ts` and `src/features/create-site/core/selectors/expenses.selectors.ts`
**Test file**: `src/features/create-site/core/__tests__/createSite.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 3 | `features/create-site/views/custom/soil-contamination/index.tsx` | `selectSoilContaminationFormViewData` |
| [x] | 3 | `features/create-site/views/custom/spaces-and-soils/spaces-selection/index.tsx` | `selectSpacesSelectionFormViewData` |
| [x] | 3 | `features/create-site/views/custom/spaces-and-soils/surface-area/index.tsx` | `selectSiteSurfaceAreaFormViewData` |
| [x] | 3 | `features/create-site/views/custom/address/index.tsx` | `selectAddressFormViewData` |
| [x] | 3 | `features/create-site/views/custom/site-management/expenses-and-income/yearly-expenses/index.tsx` | `selectSiteYearlyExpensesViewData` |
| [x] | 3 | `features/create-site/views/custom/site-management/expenses-and-income/yearly-income/index.tsx` | `selectYearlyIncomeFormViewData` |

---

### 6. Urban Project Forms - Stakeholders (MEDIUM PRIORITY)

**Selectors file**: `src/shared/core/reducers/project-form/urban-project/urbanProject.selectors.ts`
**Test file**: `src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 3 | `shared/views/project-form/urban-project/stakeholders/reinstatement-contract-owner/index.tsx` | `selectReinstatementContractOwnerViewData` |
| [x] | 3 | `shared/views/project-form/urban-project/stakeholders/project-developer/index.tsx` | `selectProjectDeveloperViewData` |
| ~~N/A~~ | ~~2~~ | ~~`shared/views/project-form/urban-project/stakeholders/future-operator/index.tsx`~~ | ~~File deleted~~ |
| ~~N/A~~ | ~~2~~ | ~~`shared/views/project-form/urban-project/stakeholders/future-site-owner/index.tsx`~~ | ~~File deleted~~ |
| ~~N/A~~ | ~~2~~ | ~~`shared/views/project-form/urban-project/stakeholders/site-purchaser/index.tsx`~~ | ~~File deleted~~ |
| ~~N/A~~ | ~~2~~ | ~~`shared/views/project-form/urban-project/stakeholders/has-real-estate-transaction/index.tsx`~~ | ~~File deleted~~ |

---

### 7. Urban Project Forms - Spaces (MEDIUM PRIORITY)

**Selectors file**: `src/shared/core/reducers/project-form/urban-project/urbanProject.selectors.ts`
**Test file**: `src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | ~~4~~ 1 | `shared/views/project-form/urban-project/spaces/surface-area/index.tsx` | `selectSpacesSurfaceAreaViewData` |
| [x] | 2 | `shared/views/project-form/urban-project/soils/summary/index.tsx` | `selectSoilsSummaryViewData` |
| ~~N/A~~ | ~~3~~ | ~~`shared/views/project-form/urban-project/spaces/public-spaces/surface-area-distribution/index.tsx`~~ | ~~File deleted~~ |
| ~~N/A~~ | ~~3~~ | ~~`shared/views/project-form/urban-project/spaces/living-and-activity-spaces/surface-area-distribution/index.tsx`~~ | ~~File deleted~~ |
| ~~N/A~~ | ~~3~~ | ~~`shared/views/project-form/urban-project/spaces/green-spaces/surface-area-distribution/index.tsx`~~ | ~~File deleted~~ |
| [x] | ~~2~~ 1 | `shared/views/project-form/urban-project/spaces/selection/index.tsx` | `selectSpacesSelectionViewData` |
| ~~N/A~~ | ~~2~~ | ~~`shared/views/project-form/urban-project/spaces/urban-pond-surface-area/index.tsx`~~ | ~~File deleted~~ |

---

### 8. Urban Project Forms - Buildings (MEDIUM PRIORITY)

**Selectors file**: `src/shared/core/reducers/project-form/urban-project/urbanProject.selectors.ts`
**Test file**: `src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| ~~N/A~~ | ~~4~~ | ~~`shared/views/project-form/urban-project/buildings/use-surface-areas/index.tsx`~~ | ~~File deleted~~ |
| ~~N/A~~ | ~~3~~ | ~~`shared/views/project-form/urban-project/buildings/floor-surface-area/index.tsx`~~ | ~~File deleted~~ |
| ~~N/A~~ | ~~2~~ | ~~`shared/views/project-form/urban-project/buildings/use-introduction/index.tsx`~~ | ~~File deleted~~ |
| ~~N/A~~ | ~~2~~ | ~~`shared/views/project-form/urban-project/buildings/economic-activity-surface-area/index.tsx`~~ | ~~File deleted~~ |

---

### 9. Urban Project Forms - Expenses & Revenue (MEDIUM PRIORITY)

**Selectors file**: `src/shared/core/reducers/project-form/urban-project/urbanProject.selectors.ts`
**Test file**: `src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 3 | `shared/views/project-form/urban-project/expenses/reinstatement/index.tsx` | `selectReinstatementExpensesViewData` |
| [x] | ~~2~~ 1 | `shared/views/project-form/urban-project/expenses/installation/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `shared/views/project-form/urban-project/expenses/yearly-projected-costs/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `shared/views/project-form/urban-project/expenses/site-purchase-amounts/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `shared/views/project-form/urban-project/revenues/yearly-buildings-operations-revenues/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `shared/views/project-form/urban-project/revenues/site-resale/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `shared/views/project-form/urban-project/revenues/financial-assistance/index.tsx` | Already refactored |

---

### 10. Urban Project Forms - Schedule & Summary (MEDIUM PRIORITY)

**Selectors file**: `src/shared/core/reducers/project-form/urban-project/urbanProject.selectors.ts`
**Test file**: `src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 5 | `shared/views/project-form/urban-project/summary/index.tsx` | `selectUrbanProjectSummaryViewData` |
| [x] | 2 | `shared/views/project-form/urban-project/schedule/projection/index.tsx` | `selectScheduleProjectionViewData` |
| [x] | 2 | `shared/views/project-form/urban-project/soils/decontamination-surface-area/index.tsx` | `selectSoilsDecontaminationSurfaceAreaViewData` |
| ~~N/A~~ | ~~2~~ | ~~`shared/views/project-form/urban-project/schedule/introduction/index.tsx`~~ | ~~File deleted~~ |
| ~~N/A~~ | ~~2~~ | ~~`shared/views/project-form/urban-project/naming/index.tsx`~~ | ~~File deleted~~ |

---

### 11. Urban Project Forms - Creation Result (MEDIUM PRIORITY)

**Selectors file**: `src/shared/core/reducers/project-form/urban-project/urbanProject.selectors.ts`
**Test file**: `src/features/create-project/core/urban-project/__tests__/urbanProject.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [ ] | 3 | `features/create-project/views/urban-project/express-forms/creation-result/index.tsx` | `selectExpressCreationResultViewData` |
| [ ] | 3 | `features/create-project/views/urban-project/custom-forms/creation-result/index.tsx` | `selectCustomCreationResultViewData` |

---

### 12. Photovoltaic Forms - Summary & Result (MEDIUM PRIORITY)

**Selectors file**: `src/features/create-project/core/photovoltaic/photovoltaic.selectors.ts` (create if needed)
**Test file**: `src/features/create-project/core/photovoltaic/__tests__/photovoltaic.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 3 | `features/create-project/views/photovoltaic-power-station/custom-form/summary/index.tsx` | `selectPhotovoltaicSummaryViewData` |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/result/index.tsx` | Already refactored |

---

### 13. Photovoltaic Forms - Stakeholders (LOW PRIORITY)

**Selectors file**: `src/features/create-project/core/photovoltaic/photovoltaic.selectors.ts`
**Test file**: `src/features/create-project/core/photovoltaic/__tests__/photovoltaic.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 2 | `features/create-project/views/photovoltaic-power-station/custom-form/stakeholders/developer/index.tsx` | `selectPVDeveloperViewData` |
| [x] | 2 | `features/create-project/views/photovoltaic-power-station/custom-form/stakeholders/operator/index.tsx` | `selectPVOperatorViewData` |
| [x] | 2 | `features/create-project/views/photovoltaic-power-station/custom-form/stakeholders/future-site-owner/index.tsx` | `selectPVFutureSiteOwnerViewData` |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/stakeholders/site-purchased/index.tsx` | Already refactored |
| ~~N/A~~ | ~~2~~ | ~~`features/create-project/views/photovoltaic-power-station/custom-form/stakeholders/site-purchaser/index.tsx`~~ | ~~File deleted~~ |
| [x] | 2 | `features/create-project/views/photovoltaic-power-station/custom-form/stakeholders/reinstatement-contract-owner/index.tsx` | `selectPVReinstatementContractOwnerViewData` |

---

### 14. Photovoltaic Forms - Soils (LOW PRIORITY)

**Selectors file**: `src/features/create-project/core/photovoltaic/photovoltaic.selectors.ts`
**Test file**: `src/features/create-project/core/photovoltaic/__tests__/photovoltaic.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| ~~N/A~~ | ~~2~~ | ~~`features/create-project/views/photovoltaic-power-station/custom-form/soils/soils-selection/index.tsx`~~ | ~~File deleted~~ |
| ~~N/A~~ | ~~2~~ | ~~`features/create-project/views/photovoltaic-power-station/custom-form/soils/soils-surface-areas/index.tsx`~~ | ~~File deleted~~ |
| [x] | 2 | `features/create-project/views/photovoltaic-power-station/custom-form/soils/soils-summary/index.tsx` | `selectPVSoilsSummaryViewData` |
| [x] | 2 | `features/create-project/views/photovoltaic-power-station/custom-form/soils/soils-transformation/non-suitable-soils-notice/index.tsx` | `selectPVNonSuitableSoilsNoticeViewData` |
| [x] | 3 | `features/create-project/views/photovoltaic-power-station/custom-form/soils/soils-transformation/climate-and-biodiversity-impact-notice/index.tsx` | `selectPVClimateAndBiodiversityImpactNoticeViewData` |
| [x] | 2 | `features/create-project/views/photovoltaic-power-station/custom-form/soils-decontamination/surface-area/index.tsx` | `selectPVDecontaminationSurfaceAreaViewData` |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/soils/soils-transformation/future-soils-selection/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/soils/soils-transformation/future-soils-surface-area/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/soils/soils-transformation/non-suitable-soils-selection/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/soils/soils-transformation/non-suitable-soils-surface-to-transform/index.tsx` | Already refactored |
| [x] | ~~2~~ 0 | `features/create-project/views/photovoltaic-power-station/custom-form/soils/soils-transformation/introduction/index.tsx` | Already refactored (no selector needed) |

---

### 15. Photovoltaic Forms - Expenses & Revenue (LOW PRIORITY)

**Selectors file**: `src/features/create-project/core/photovoltaic/photovoltaic.selectors.ts`
**Test file**: `src/features/create-project/core/photovoltaic/__tests__/photovoltaic.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 2 | `features/create-project/views/photovoltaic-power-station/custom-form/expenses/reinstatement/index.tsx` | `selectPVReinstatementExpensesViewData` |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/expenses/yearly-projected-costs/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/expenses/site-purchase-amounts/index.tsx` | Already refactored |
| [x] | 2 | `features/create-project/views/photovoltaic-power-station/custom-form/revenue/yearly-projected-revenue/index.tsx` | `selectPVYearlyProjectedRevenueViewData` |
| ~~N/A~~ | ~~2~~ | ~~`features/create-project/views/photovoltaic-power-station/custom-form/revenue/expected-site-resale/index.tsx`~~ | ~~File deleted~~ |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/revenue/financial-assistance/index.tsx` | Already refactored |

---

### 16. Photovoltaic Forms - Other (LOW PRIORITY)

**Selectors file**: `src/features/create-project/core/photovoltaic/photovoltaic.selectors.ts`
**Test file**: `src/features/create-project/core/photovoltaic/__tests__/photovoltaic.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 2 | `features/create-project/views/photovoltaic-power-station/custom-form/schedule/projection/index.tsx` | `selectPVScheduleProjectionViewData` |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/naming/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/photovoltaic-power-station/power/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/photovoltaic-power-station/surface-area/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/photovoltaic-power-station/expected-annual-production/index.tsx` | Already refactored |
| [x] | ~~2~~ 1 | `features/create-project/views/photovoltaic-power-station/custom-form/photovoltaic-power-station/contract-duration/index.tsx` | Already refactored |

---

### 17. Project Features Page (LOW PRIORITY)

**Selectors file**: `src/features/projects/core/projectFeatures.selectors.ts` (create if needed)
**Test file**: `src/features/projects/core/__tests__/projectFeatures.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 2 | `features/projects/views/project-page/features/index.tsx` | `selectProjectFeaturesViewData` |

---

### 18. My Evaluations Page (LOW PRIORITY)

**Selectors file**: `src/features/my-evaluations/core/myEvaluations.selectors.ts` (create if needed)
**Test file**: `src/features/my-evaluations/core/__tests__/myEvaluations.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [x] | 2 | `features/my-evaluations/views/my-evaluations-page/index.tsx` | `selectMyEvaluationsViewData` |

---

### 19. Urban Project Express Forms (LOW PRIORITY)

**Selectors file**: `src/features/create-project/core/createProject.selectors.ts` (or create dedicated)
**Test file**: `src/features/create-project/core/__tests__/createProject.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [ ] | 2 | `features/create-project/views/urban-project/express-forms/summary/index.tsx` | `selectUrbanProjectExpressSummaryViewData` |

---

### 20. Common Project Views (LOW PRIORITY)

**Selectors file**: `src/features/create-project/core/createProject.selectors.ts`
**Test file**: `src/features/create-project/core/__tests__/createProject.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [ ] | 2 | `features/create-project/views/common-views/result/index.tsx` | `selectCommonResultViewData` |

---

### 21. Site Creation - Express Address (LOW PRIORITY)

**Selectors file**: `src/features/create-site/core/selectors/createSite.selectors.ts`
**Test file**: `src/features/create-site/core/__tests__/createSite.selectors.spec.ts`

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [ ] | 2 | `features/create-site/views/express/address/index.tsx` | `selectExpressAddressFormViewData` |

---

### 22. Wizards & Steppers (LOW PRIORITY)

**Note**: These are higher-level wizard/stepper components rather than individual step containers, but they also violate the single-selector pattern.

**Selectors files**: Various (per feature)

| Status | Calls | File | ViewData Selector Name |
|--------|-------|------|------------------------|
| [ ] | 6 | `features/update-project/views/UrbanProjectUpdateView.tsx` | `selectUrbanProjectUpdateViewData` |
| [ ] | 3 | `features/create-site/views/SiteCreationWizard.tsx` | `selectSiteCreationWizardViewData` |
| [ ] | 3 | `features/create-project/views/urban-project/UrbanProjectCreationStepper.tsx` | `selectUrbanProjectCreationStepperViewData` |
| [ ] | 2 | `features/update-project/views/NavigationBlockerDialog.tsx` | `selectNavigationBlockerDialogViewData` |
| [ ] | 2 | `features/create-project/views/urban-project/UrbanProjectCreationWizard.tsx` | `selectUrbanProjectCreationWizardViewData` |
| [ ] | 2 | `features/create-project/views/photovoltaic-power-station/express-form/PhotovoltaicExpressCreationResult.tsx` | `selectPVExpressCreationResultViewData` |

---

## Refactoring Checklist (Per File)

For each file being refactored:

1. [ ] Read the current container component
2. [ ] Identify all `useAppSelector` calls and what data they retrieve
3. [ ] Define `{Feature}ViewData` type in selectors file
4. [ ] Create `select{Feature}ViewData` selector composing all data
5. [ ] Write test for the new ViewData selector (MANDATORY)
6. [ ] Run test: `pnpm --filter web test path/to/selectors.spec.ts`
7. [ ] Update container to use single `useAppSelector(select{Feature}ViewData)`
8. [ ] Verify container still works (no TypeScript errors)
9. [ ] Run: `pnpm --filter web typecheck && pnpm --filter web lint`
10. [ ] Mark checkbox as complete in this plan: `[ ]` -> `[x]`

---

## Progress Summary

| Area | Total | Completed | Deleted | Remaining |
|------|-------|-----------|---------|-----------|
| 1. Project Impacts | 4 | 4 | 0 | 0 |
| 2. Urban Sprawl Comparison | 2 | 2 | 0 | 0 |
| 3. Site Creation - Stakeholders | 4 | 4 | 0 | 0 |
| 4. Site Creation - Express | 3 | 3 | 0 | 0 |
| 5. Site Creation - Custom | 6 | 6 | 0 | 0 |
| 6. Urban Project - Stakeholders | 6 | 1 | 4 | 1 |
| 7. Urban Project - Spaces | 7 | 3 | 4 | 0 |
| 8. Urban Project - Buildings | 4 | 0 | 4 | 0 |
| 9. Urban Project - Expenses/Revenue | 7 | 7 | 0 | 0 |
| 10. Urban Project - Schedule/Summary | 5 | 3 | 2 | 0 |
| 11. Urban Project - Creation Result | 2 | 0 | 0 | 2 |
| 12. Photovoltaic - Summary/Result | 2 | 2 | 0 | 0 |
| 13. Photovoltaic - Stakeholders | 6 | 5 | 1 | 0 |
| 14. Photovoltaic - Soils | 13 | 9 | 2 | 2 |
| 15. Photovoltaic - Expenses/Revenue | 6 | 5 | 1 | 0 |
| 16. Photovoltaic - Other | 6 | 6 | 0 | 0 |
| 17. Project Features Page | 1 | 1 | 0 | 0 |
| 18. My Evaluations Page | 1 | 1 | 0 | 0 |
| 19. Urban Project Express Forms | 1 | 0 | 0 | 1 |
| 20. Common Project Views | 1 | 0 | 0 | 1 |
| 21. Site Creation - Express Address | 1 | 0 | 0 | 1 |
| 22. Wizards & Steppers | 6 | 0 | 0 | 6 |
| **TOTAL** | **92** | **62** | **18** | **12** |

Note: 18 files were deleted/renamed during prior refactoring.

---

## References

- **Pattern example (selector)**: `src/shared/core/reducers/project-form/urban-project/urbanProject.selectors.ts` -> `selectUsesFootprintSurfaceAreaViewData`
- **Pattern example (container)**: `src/shared/views/project-form/urban-project/uses/footprint-surface-area/index.tsx`
- **Test example**: `src/features/create-project/core/urban-project/__tests__/steps/site-resale/siteResaleSelection.step.spec.ts`
- **Store builder**: `src/features/create-project/core/urban-project/__tests__/_testStoreHelpers.ts`
