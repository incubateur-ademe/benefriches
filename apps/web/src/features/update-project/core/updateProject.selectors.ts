import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/store/store";
import { createRenewableEnergyFormSelectors } from "@/features/create-project/core/renewable-energy/renewableEnergyForm.selectors";
import { createUrbanProjectFormSelectors } from "@/features/create-project/core/urban-project/urbanProjectForm.selectors";

export const updateUrbanProjectFormSelectors = createUrbanProjectFormSelectors("projectUpdate");

const { selectSiteAddress, selectSiteSoilsDistribution, selectProjectSoilsDistributionByType } =
  updateUrbanProjectFormSelectors;

export { selectSiteAddress, selectSiteSoilsDistribution, selectProjectSoilsDistributionByType };

export const selectUrbanProjectCurrentStep = createSelector(
  [(state: RootState) => state.projectUpdate.urbanProject.form],
  (form) => form.currentStep,
);

// Update-side instantiation of the shared PV selector factory (ticket 10b): one definition
// (`createRenewableEnergyFormSelectors`) serves both `state.projectCreation` and
// `state.projectUpdate` — see `renewableEnergyProject.selectors.ts` for the create-side instance.
export const updateRenewableEnergyFormSelectors =
  createRenewableEnergyFormSelectors("projectUpdate");

export const {
  selectSiteData,
  selectSiteSurfaceArea,
  selectSiteContaminatedSurfaceArea,
  selectProjectAvailableStakeholders,
  selectAvailableLocalAuthoritiesStakeholders,
  selectSteps,
  selectSaveState,
  selectIsFormStatusValid,
  selectExpectedPhotovoltaicPerformance,
  selectSoilsCarbonStorage,
  selectProjectSoilsDistribution,
  selectPhotovoltaicPowerStationScheduleInitialValues,
  selectPhotovoltaicPanelsSurfaceArea,
  selectSuitableSurfaceAreaForPhotovoltaicPanels,
  selectMissingSuitableSurfaceArea,
  selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
  selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
  selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
  selectRenewableEnergyProjectAvailableStakeholders,
  selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  selectPhotovoltaicPowerPlantUpdateStepperDataView,
  selectPhotovoltaicPlantFeaturesKeyParameter,
  selectPhotovoltaicPowerViewData,
  selectPhotovoltaicSurfaceViewData,
  selectExpectedAnnualProductionViewData,
  selectContractDurationViewData,
  selectNameAndDescriptionInitialValues,
  selectInvolvesReinstatementViewData,
  selectSoilsDecontaminationSelectionViewData,
  selectPVDecontaminationSurfaceAreaViewData,
  selectPVClimateAndBiodiversityImpactNoticeViewData,
  selectFutureSoilsSelectionViewData,
  selectFutureSoilsSurfaceAreasViewData,
  selectPVNonSuitableSoilsNoticeViewData,
  selectNonSuitableSelectionViewData,
  selectNonSuitableSoilsSurfaceAreaToTransformViewData,
  selectSoilsTransformationProjectSelectionViewData,
  selectPVSoilsSummaryViewData,
  selectSoilsCarbonStorageViewData,
  selectPVOperatorViewData,
  selectPVDeveloperViewData,
  selectPVFutureSiteOwnerViewData,
  selectPVReinstatementContractOwnerViewData,
  selectSitePurchasedViewData,
  selectPhotovoltaicPowerStationInstallationExpensesInitialValues,
  selectPVReinstatementExpensesViewData,
  selectSitePurchaseAmounts,
  selectPhotovoltaicPowerStationYearlyExpensesInitialValues,
  selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues,
  selectPVYearlyProjectedRevenueViewData,
  selectPVScheduleProjectionViewData,
  selectPhotovoltaicFinalSummaryViewData,
} = updateRenewableEnergyFormSelectors;
