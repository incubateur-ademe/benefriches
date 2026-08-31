import { createSelector } from "@reduxjs/toolkit";

import type { SiteFormLens } from "../siteForm.lens";
import { siteCreationLens } from "../siteForm.lens";
import { selectSoilsContaminationViewData } from "./steps/contamination/soilsContamination.selectors";
import { selectUrbanZoneCreationResultViewData } from "./steps/creation-result/creationResult.selectors";
import { selectExpensesAndIncomeSummaryViewData } from "./steps/expenses/expenses-summary/expensesAndIncomeSummary.selectors";
import { selectLocalAuthorityExpensesViewData } from "./steps/expenses/local-authority-expenses/localAuthorityExpenses.selectors";
import { selectVacantPremisesExpensesViewData } from "./steps/expenses/vacant-premises-expenses/vacantPremisesExpenses.selectors";
import { selectZoneManagementExpensesViewData } from "./steps/expenses/zone-management-expenses/zoneManagementExpenses.selectors";
import { selectZoneManagementIncomeViewData } from "./steps/expenses/zone-management-income/zoneManagementIncome.selectors";
import { selectUrbanZoneFinalSummaryViewData } from "./steps/final-summary/finalSummary.selectors";
import { selectLandParcelsSelectionViewData } from "./steps/land-parcels/land-parcels-selection/landParcelsSelection.selectors";
import { selectLandParcelsSurfaceDistributionViewData } from "./steps/land-parcels/land-parcels-surface-distribution/landParcelsSurfaceDistribution.selectors";
import { selectFullTimeJobsEquivalentViewData } from "./steps/management/full-time-jobs-equivalent/fullTimeJobsEquivalent.selectors";
import { selectManagerViewData } from "./steps/management/manager/manager.selectors";
import { selectVacantCommercialPremisesFloorAreaViewData } from "./steps/management/vacant-commercial-premises-floor-area/vacantCommercialPremisesFloorArea.selectors";
import { selectVacantCommercialPremisesFootprintViewData } from "./steps/management/vacant-commercial-premises-footprint/vacantCommercialPremisesFootprint.selectors";
import { selectUrbanZoneNamingViewData } from "./steps/naming/naming.selectors";
import { createParcelBuildingsFloorAreaSelector } from "./steps/per-parcel-soils/parcelBuildingsFloorArea.selectors";
import { createParcelSoilsDistributionSelector } from "./steps/per-parcel-soils/parcelSoilsDistribution.selectors";
import { selectUrbanZoneSoilsSummaryViewData } from "./steps/summary/soils-summary/soilsSummary.selectors";
import type { UrbanZoneSiteCreationStep } from "./urbanZoneSteps";

/**
 * The urban-zone sub-flow's selector bundle. See `core/custom/customForm.selectors.ts` for the
 * same deviation note: the leaf ViewData selectors are re-exported as-is (still reading
 * `state.siteCreation`), only `selectCurrentStep` is derived from the injected lens. As with the
 * custom bundle, every step container consumes these selectors through `useUrbanZoneSiteForm()`
 * rather than importing the selector modules directly.
 */
export const createUrbanZoneFormSelectors = (lens: SiteFormLens) => {
  const selectCurrentStep = createSelector(
    lens.selectSiteForm,
    (state): UrbanZoneSiteCreationStep => state.urbanZone.currentStep,
  );

  return {
    selectCurrentStep,
    selectUrbanZoneCreationResultViewData,
    selectExpensesAndIncomeSummaryViewData,
    selectLocalAuthorityExpensesViewData,
    selectVacantPremisesExpensesViewData,
    selectZoneManagementExpensesViewData,
    selectZoneManagementIncomeViewData,
    selectUrbanZoneFinalSummaryViewData,
    selectLandParcelsSelectionViewData,
    selectLandParcelsSurfaceDistributionViewData,
    selectFullTimeJobsEquivalentViewData,
    selectManagerViewData,
    selectVacantCommercialPremisesFloorAreaViewData,
    selectVacantCommercialPremisesFootprintViewData,
    selectUrbanZoneNamingViewData,
    selectUrbanZoneSoilsSummaryViewData,
    selectSoilsContaminationViewData,
    createParcelBuildingsFloorAreaSelector,
    createParcelSoilsDistributionSelector,
  };
};

export const creationUrbanZoneFormSelectors = createUrbanZoneFormSelectors(siteCreationLens);
