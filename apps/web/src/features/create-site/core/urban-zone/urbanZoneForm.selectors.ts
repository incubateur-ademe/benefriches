import { createSelector } from "@reduxjs/toolkit";

import { createSiteFormRootSelectors } from "../selectors/createSite.selectors";
import type { SiteFormLens } from "../siteForm.lens";
import { siteCreationLens } from "../siteForm.lens";
import { createSoilsContaminationSelectors } from "./steps/contamination/soilsContamination.selectors";
import { createCreationResultSelectors } from "./steps/creation-result/creationResult.selectors";
import { createExpensesAndIncomeSummarySelectors } from "./steps/expenses/expenses-summary/expensesAndIncomeSummary.selectors";
import { createLocalAuthorityExpensesSelectors } from "./steps/expenses/local-authority-expenses/localAuthorityExpenses.selectors";
import { createVacantPremisesExpensesSelectors } from "./steps/expenses/vacant-premises-expenses/vacantPremisesExpenses.selectors";
import { createZoneManagementExpensesSelectors } from "./steps/expenses/zone-management-expenses/zoneManagementExpenses.selectors";
import { createZoneManagementIncomeSelectors } from "./steps/expenses/zone-management-income/zoneManagementIncome.selectors";
import { createFinalSummarySelectors } from "./steps/final-summary/finalSummary.selectors";
import { createLandParcelsSelectionSelectors } from "./steps/land-parcels/land-parcels-selection/landParcelsSelection.selectors";
import { createLandParcelsSurfaceDistributionSelectors } from "./steps/land-parcels/land-parcels-surface-distribution/landParcelsSurfaceDistribution.selectors";
import { createFullTimeJobsEquivalentSelectors } from "./steps/management/full-time-jobs-equivalent/fullTimeJobsEquivalent.selectors";
import { createManagerSelectors } from "./steps/management/manager/manager.selectors";
import { createVacantCommercialPremisesFloorAreaSelectors } from "./steps/management/vacant-commercial-premises-floor-area/vacantCommercialPremisesFloorArea.selectors";
import { createVacantCommercialPremisesFootprintSelectors } from "./steps/management/vacant-commercial-premises-footprint/vacantCommercialPremisesFootprint.selectors";
import { createUrbanZoneNamingSelectors } from "./steps/naming/naming.selectors";
import { createParcelBuildingsFloorAreaSelectorFactory } from "./steps/per-parcel-soils/parcelBuildingsFloorArea.selectors";
import { createParcelSoilsDistributionSelectorFactory } from "./steps/per-parcel-soils/parcelSoilsDistribution.selectors";
import { createUrbanZoneSoilsSummarySelectors } from "./steps/summary/soils-summary/soilsSummary.selectors";
import {
  computeUrbanZoneStepperGroups,
  type UrbanZoneStepperGroup,
} from "./urbanZoneStepperConfig";
import type { UrbanZoneSiteCreationStep } from "./urbanZoneSteps";

/**
 * The urban-zone sub-flow's selector bundle — fully lens-parameterised (ticket 11, mirroring
 * ticket 10's `createCustomFormSelectors`): the whole bundle, including every leaf ViewData
 * selector under `steps/**`, is built from `createSiteFormRootSelectors(lens)` so a second
 * instance (the update flow's `siteUpdateLens`) resolves its own flow's data end to end, not
 * creation's.
 *
 * Every step container consumes these selectors through `useUrbanZoneSiteForm()` (this bundle,
 * exposed on `UrbanZoneSiteFormContextValue`) rather than importing the selector modules
 * directly.
 */
export const createUrbanZoneFormSelectors = (lens: SiteFormLens) => {
  const rootSelectors = createSiteFormRootSelectors(lens);

  const { selectSoilsContaminationViewData } = createSoilsContaminationSelectors(rootSelectors);
  const { selectUrbanZoneCreationResultViewData } = createCreationResultSelectors(rootSelectors);
  const { selectExpensesAndIncomeSummaryViewData } =
    createExpensesAndIncomeSummarySelectors(rootSelectors);
  const { selectLocalAuthorityExpensesViewData } =
    createLocalAuthorityExpensesSelectors(rootSelectors);
  const { selectVacantPremisesExpensesViewData } =
    createVacantPremisesExpensesSelectors(rootSelectors);
  const { selectZoneManagementExpensesViewData } =
    createZoneManagementExpensesSelectors(rootSelectors);
  const { selectZoneManagementIncomeViewData } = createZoneManagementIncomeSelectors(rootSelectors);
  const { selectUrbanZoneFinalSummaryViewData } = createFinalSummarySelectors(rootSelectors);
  const { selectLandParcelsSelectionViewData } = createLandParcelsSelectionSelectors(rootSelectors);
  const { selectLandParcelsSurfaceDistributionViewData } =
    createLandParcelsSurfaceDistributionSelectors(rootSelectors);
  const { selectFullTimeJobsEquivalentViewData } =
    createFullTimeJobsEquivalentSelectors(rootSelectors);
  const { selectManagerViewData } = createManagerSelectors(rootSelectors);
  const { selectVacantCommercialPremisesFloorAreaViewData } =
    createVacantCommercialPremisesFloorAreaSelectors(rootSelectors);
  const { selectVacantCommercialPremisesFootprintViewData } =
    createVacantCommercialPremisesFootprintSelectors(rootSelectors);
  const { selectUrbanZoneNamingViewData } = createUrbanZoneNamingSelectors(rootSelectors);
  const { selectUrbanZoneSoilsSummaryViewData } =
    createUrbanZoneSoilsSummarySelectors(rootSelectors);
  const createParcelBuildingsFloorAreaSelector =
    createParcelBuildingsFloorAreaSelectorFactory(rootSelectors);
  const createParcelSoilsDistributionSelector =
    createParcelSoilsDistributionSelectorFactory(rootSelectors);

  const selectCurrentStep = createSelector(
    lens.selectSiteForm,
    (state): UrbanZoneSiteCreationStep => state.urbanZone.currentStep,
  );

  const selectSaveState = rootSelectors.selectUrbanZoneSaveState;

  const selectUrbanZoneStepperGroups = createSelector(
    lens.selectSiteForm,
    (state): UrbanZoneStepperGroup[] =>
      computeUrbanZoneStepperGroups({
        currentStep: state.urbanZone.currentStep,
        steps: state.urbanZone.steps,
        stepsSequence: state.urbanZone.stepsSequence,
      }),
  );

  return {
    selectCurrentStep,
    selectSaveState,
    selectUrbanZoneStepperGroups,
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
