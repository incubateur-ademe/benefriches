import { createSelector } from "@reduxjs/toolkit";
import {
  getDefaultScheduleForProject,
  ProjectSchedule,
  ProjectScheduleBuilder,
  SoilsDistribution,
} from "shared";

import { RootState } from "@/app/store/store";

import { createWizardFormSelectors } from "../project-form/projectForm.selectors";
import { ReadStateHelper } from "./helpers/readState";
import type { RenewableEnergyProjectState } from "./renewableEnergy.reducer";
import { answersByStepSchemas, isAnswersStep } from "./renewableEnergySteps";
import {
  createSelectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
  createSelectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
  createSelectMissingSuitableSurfaceArea,
  createSelectPhotovoltaicPanelsSurfaceArea,
  createSelectSuitableSurfaceAreaForPhotovoltaicPanels,
  createSelectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
} from "./selectors/soilsTransformation.selectors";
import {
  createSelectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  createSelectRenewableEnergyProjectAvailableStakeholders,
} from "./selectors/stakeholders.selectors";
import { createSelectPhotovoltaicPowerPlantSummaryNavigationDataView } from "./selectors/stepper.selector";
import { createSelectPhotovoltaicPowerStationInstallationExpensesInitialValues } from "./step-handlers/expenses/expenses-installation/expensesInstallation.selector";
import { createSelectPVReinstatementExpensesViewData } from "./step-handlers/expenses/expenses-reinstatement/expensesReinstatement.selector";
import { createSelectSitePurchaseAmounts } from "./step-handlers/expenses/expenses-site-purchase-amounts/expensesSitePurchaseAmounts.selector";
import { createSelectPhotovoltaicPowerStationYearlyExpensesInitialValues } from "./step-handlers/expenses/expenses-yearly-projected/expensesYearlyProjected.selector";
import { createSelectNameAndDescriptionInitialValues } from "./step-handlers/naming/naming/naming.selector";
import { createSelectContractDurationViewData } from "./step-handlers/photovoltaic/photovoltaic-contract-duration/photovoltaicContractDuration.selectors";
import { createSelectExpectedAnnualProductionViewData } from "./step-handlers/photovoltaic/photovoltaic-expected-annual-production/photovoltaicExpectedAnnualProduction.selector";
import { createSelectPhotovoltaicPlantFeaturesKeyParameter } from "./step-handlers/photovoltaic/photovoltaic-key-parameter/photovoltaicKeyParameter.selector";
import { createSelectPhotovoltaicPowerViewData } from "./step-handlers/photovoltaic/photovoltaic-power/photovoltaicPower.selector";
import { createSelectPhotovoltaicSurfaceViewData } from "./step-handlers/photovoltaic/photovoltaic-surface/photovoltaicSurface.selector";
import { createSelectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues } from "./step-handlers/revenue/revenue-financial-assistance/revenueFinancialAssistance.selector";
import { createSelectPVYearlyProjectedRevenueViewData } from "./step-handlers/revenue/revenue-yearly-projected/revenueYearlyProjected.selector";
import { createSelectPVScheduleProjectionViewData } from "./step-handlers/schedule/schedule-projection/scheduleProjection.selector";
import { createSelectInvolvesReinstatementViewData } from "./step-handlers/soils-decontamination/involves-reinstatement/involvesReinstatement.selectors";
import { createSelectSoilsDecontaminationSelectionViewData } from "./step-handlers/soils-decontamination/soils-decontamination-selection/soilsDecontaminationSelection.selectors";
import { createSelectPVDecontaminationSurfaceAreaViewData } from "./step-handlers/soils-decontamination/soils-decontamination-surface-area/soilsDecontaminationSurfaceArea.selector";
import { createSelectPVClimateAndBiodiversityImpactNoticeViewData } from "./step-handlers/soils-transformation/soils-transformation-climate-and-biodiversity-impact-notice/soilsTransformationClimateAndBiodiversityImpactNotice.selector";
import { createSelectFutureSoilsSelectionViewData } from "./step-handlers/soils-transformation/soils-transformation-future-soils-selection/soilsTransformationFutureSoilsSelection.selector";
import { createSelectFutureSoilsSurfaceAreasViewData } from "./step-handlers/soils-transformation/soils-transformation-future-soils-surface-area/soilsTransformationFutureSoilsSurfaceArea.selector";
import { createSelectPVNonSuitableSoilsNoticeViewData } from "./step-handlers/soils-transformation/soils-transformation-non-suitable-soils-notice/soilsTransformationNonSuitableSoilsNotice.selector";
import { createSelectNonSuitableSelectionViewData } from "./step-handlers/soils-transformation/soils-transformation-non-suitable-soils-selection/soilsTransformationNonSuitableSoilsSelection.selector";
import { createSelectNonSuitableSoilsSurfaceAreaToTransformViewData } from "./step-handlers/soils-transformation/soils-transformation-non-suitable-soils-surface/soilsTransformationNonSuitableSoilsSurface.selector";
import { createSelectSoilsTransformationProjectSelectionViewData } from "./step-handlers/soils-transformation/soils-transformation-project-selection/soilsTransformationProjectSelection.selectors";
import { createSelectPVSoilsSummaryViewData } from "./step-handlers/soils-transformation/soils-transformation-soils-summary/soilsTransformationSoilsSummary.selector";
import { createSelectPVOperatorViewData } from "./step-handlers/stakeholders/stakeholders-future-operator/stakeholdersFutureOperator.selector";
import { createSelectPVDeveloperViewData } from "./step-handlers/stakeholders/stakeholders-project-developer/stakeholdersProjectDeveloper.selector";
import { createSelectSitePurchasedViewData } from "./step-handlers/stakeholders/stakeholders-site-purchase/stakeholdersSitePurchase.selector";
import type { RenewableEnergyStepsState } from "./step-handlers/stepHandler.type";
import { createSelectCreationResultViewData } from "./step-handlers/summary/summary-creation-result/summaryCreationResult.selector";
import { createSelectPhotovoltaicFinalSummaryViewData } from "./step-handlers/summary/summary-final/summaryFinal.selector";
import { createSelectSoilsCarbonStorageViewData } from "./step-handlers/summary/summary-soils-carbon-storage/summarySoilsCarbonStorage.selector";

export const createRenewableEnergyFormSelectors = (prefix: "projectCreation" | "projectUpdate") => {
  const wizardFormSelectors = createWizardFormSelectors(prefix);
  const selectSelf = (state: RootState) => state[prefix];

  const selectRenewableEnergyData = createSelector(
    selectSelf,
    (state): RenewableEnergyProjectState => state.renewableEnergyProject,
  );

  const selectSteps = createSelector(
    selectRenewableEnergyData,
    (state): RenewableEnergyStepsState => state.steps,
  );

  const selectStepsSequence = createSelector(
    selectRenewableEnergyData,
    (state) => state.stepsSequence,
  );

  const selectCurrentStep = createSelector(selectRenewableEnergyData, (state) => state.currentStep);

  const selectSaveState = createSelector(selectRenewableEnergyData, (state) => state.saveState);

  const selectExpectedPhotovoltaicPerformance = createSelector(
    selectRenewableEnergyData,
    (state) => state.expectedPhotovoltaicPerformance,
  );

  const selectSoilsCarbonStorage = createSelector(
    selectRenewableEnergyData,
    (state) => state.soilsCarbonStorage,
  );

  const selectProjectSoilsDistribution = createSelector(selectSteps, (steps): SoilsDistribution => {
    // Check custom surface area allocation first, then project selection
    const customAllocation = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );
    if (customAllocation?.soilsDistribution) return customAllocation.soilsDistribution;

    const projectSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
    );
    if (projectSelection?.soilsDistribution) return projectSelection.soilsDistribution;

    return {};
  });

  const selectPhotovoltaicPowerStationScheduleInitialValues = createSelector(
    [selectSteps],
    (steps): ProjectSchedule => {
      const schedule = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",
      );
      if (schedule?.photovoltaicInstallationSchedule && schedule.firstYearOfOperation) {
        return new ProjectScheduleBuilder()
          .withInstallation(schedule.photovoltaicInstallationSchedule)
          .withFirstYearOfOperations(schedule.firstYearOfOperation)
          .withReinstatement(schedule.reinstatementSchedule)
          .build();
      }

      const involvesReinstatement = ReadStateHelper.getStepAnswers(
        steps,
        "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
      )?.involvesReinstatement;

      return getDefaultScheduleForProject({ now: () => new Date() })({
        hasReinstatement: involvesReinstatement === true,
      });
    },
  );

  // Only steps actually reachable by the current answers (the walked sequence) must be
  // complete — unlike the full ANSWER_STEPS union, which also lists steps a given branch
  // (e.g. non-suitable-soils) never visits.
  const selectIsFormStatusValid = createSelector(
    [selectSteps, selectStepsSequence],
    (steps, stepsSequence): boolean => {
      return stepsSequence.every((stepId) => {
        if (!isAnswersStep(stepId)) return true;
        const step = steps[stepId];
        return (
          Boolean(step?.completed) && answersByStepSchemas[stepId].safeParse(step?.payload).success
        );
      });
    },
  );

  const selectPhotovoltaicPowerPlantSummaryNavigationDataView =
    createSelectPhotovoltaicPowerPlantSummaryNavigationDataView(
      selectCurrentStep,
      selectSteps,
      selectStepsSequence,
    );

  const selectRenewableEnergyProjectAvailableStakeholders =
    createSelectRenewableEnergyProjectAvailableStakeholders(
      wizardFormSelectors.selectProjectAvailableStakeholders,
      selectSteps,
    );

  const selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders =
    createSelectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders(
      wizardFormSelectors.selectAvailableLocalAuthoritiesStakeholders,
      selectSteps,
    );

  const selectPhotovoltaicPanelsSurfaceArea =
    createSelectPhotovoltaicPanelsSurfaceArea(selectSteps);

  const selectSuitableSurfaceAreaForPhotovoltaicPanels =
    createSelectSuitableSurfaceAreaForPhotovoltaicPanels(wizardFormSelectors.selectSiteData);

  const selectMissingSuitableSurfaceArea = createSelectMissingSuitableSurfaceArea(
    selectSteps,
    wizardFormSelectors.selectSiteSoilsDistribution,
  );

  const selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed =
    createSelectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed(
      wizardFormSelectors.selectSiteSoilsDistribution,
      selectProjectSoilsDistribution,
    );

  const selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate =
    createSelectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate(
      wizardFormSelectors.selectSiteSoilsDistribution,
      selectProjectSoilsDistribution,
    );

  const selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea =
    createSelectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea(
      selectProjectSoilsDistribution,
    );

  const selectPhotovoltaicPowerStationInstallationExpensesInitialValues =
    createSelectPhotovoltaicPowerStationInstallationExpensesInitialValues(selectSteps);

  const selectPVReinstatementExpensesViewData =
    createSelectPVReinstatementExpensesViewData(selectSteps);

  const selectSitePurchaseAmounts = createSelectSitePurchaseAmounts(selectSteps);

  const selectPhotovoltaicPowerStationYearlyExpensesInitialValues =
    createSelectPhotovoltaicPowerStationYearlyExpensesInitialValues(selectSteps);

  const selectNameAndDescriptionInitialValues =
    createSelectNameAndDescriptionInitialValues(selectSteps);

  const selectContractDurationViewData = createSelectContractDurationViewData(selectSteps);

  const selectExpectedAnnualProductionViewData = createSelectExpectedAnnualProductionViewData(
    selectExpectedPhotovoltaicPerformance,
  );

  const selectPhotovoltaicPlantFeaturesKeyParameter =
    createSelectPhotovoltaicPlantFeaturesKeyParameter(selectSteps);

  const selectPhotovoltaicPowerViewData = createSelectPhotovoltaicPowerViewData(
    selectSteps,
    wizardFormSelectors.selectSiteSurfaceArea,
  );

  const selectPhotovoltaicSurfaceViewData = createSelectPhotovoltaicSurfaceViewData(
    selectSteps,
    wizardFormSelectors.selectSiteSurfaceArea,
  );

  const selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues =
    createSelectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues(selectSteps);

  const selectPVYearlyProjectedRevenueViewData =
    createSelectPVYearlyProjectedRevenueViewData(selectSteps);

  const selectPVScheduleProjectionViewData = createSelectPVScheduleProjectionViewData(
    selectPhotovoltaicPowerStationScheduleInitialValues,
    selectSteps,
  );

  const selectInvolvesReinstatementViewData =
    createSelectInvolvesReinstatementViewData(selectSteps);

  const selectSoilsDecontaminationSelectionViewData =
    createSelectSoilsDecontaminationSelectionViewData(selectSteps);

  const selectPVDecontaminationSurfaceAreaViewData =
    createSelectPVDecontaminationSurfaceAreaViewData(
      selectSteps,
      wizardFormSelectors.selectSiteData,
      wizardFormSelectors.selectSiteContaminatedSurfaceArea,
    );

  const selectPVClimateAndBiodiversityImpactNoticeViewData =
    createSelectPVClimateAndBiodiversityImpactNoticeViewData(
      selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
      selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
      selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
    );

  const selectFutureSoilsSelectionViewData = createSelectFutureSoilsSelectionViewData(
    selectSteps,
    wizardFormSelectors.selectSiteSoilsDistribution,
  );

  const selectFutureSoilsSurfaceAreasViewData = createSelectFutureSoilsSurfaceAreasViewData(
    selectSteps,
    wizardFormSelectors.selectSiteSurfaceArea,
    wizardFormSelectors.selectSiteSoilsDistribution,
  );

  const selectPVNonSuitableSoilsNoticeViewData = createSelectPVNonSuitableSoilsNoticeViewData(
    selectPhotovoltaicPanelsSurfaceArea,
    selectSuitableSurfaceAreaForPhotovoltaicPanels,
  );

  const selectNonSuitableSelectionViewData = createSelectNonSuitableSelectionViewData(
    selectSteps,
    wizardFormSelectors.selectSiteSoilsDistribution,
    selectMissingSuitableSurfaceArea,
  );

  const selectNonSuitableSoilsSurfaceAreaToTransformViewData =
    createSelectNonSuitableSoilsSurfaceAreaToTransformViewData(
      selectSteps,
      wizardFormSelectors.selectSiteSoilsDistribution,
      selectMissingSuitableSurfaceArea,
    );

  const selectSoilsTransformationProjectSelectionViewData =
    createSelectSoilsTransformationProjectSelectionViewData(selectSteps);

  const selectPVSoilsSummaryViewData = createSelectPVSoilsSummaryViewData(
    wizardFormSelectors.selectSiteSoilsDistribution,
    selectProjectSoilsDistribution,
  );

  const selectPVOperatorViewData = createSelectPVOperatorViewData(selectSteps);

  const selectPVDeveloperViewData = createSelectPVDeveloperViewData(
    selectRenewableEnergyProjectAvailableStakeholders,
    selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
  );
  // Same available-stakeholders shape is reused verbatim for future-site-owner and
  // reinstatement-contract-owner steps, exactly like the pre-factory selector did.
  const selectPVFutureSiteOwnerViewData = selectPVDeveloperViewData;
  const selectPVReinstatementContractOwnerViewData = selectPVDeveloperViewData;

  const selectSitePurchasedViewData = createSelectSitePurchasedViewData(
    selectSteps,
    wizardFormSelectors.selectSiteData,
  );

  const selectCreationResultViewData = createSelectCreationResultViewData(
    selectSteps,
    selectSaveState,
  );

  const selectPhotovoltaicFinalSummaryViewData = createSelectPhotovoltaicFinalSummaryViewData(
    selectSteps,
    wizardFormSelectors.selectSiteData,
    selectSoilsCarbonStorage,
    selectProjectSoilsDistribution,
  );

  const selectSoilsCarbonStorageViewData =
    createSelectSoilsCarbonStorageViewData(selectSoilsCarbonStorage);

  return {
    selectSteps,
    selectStepsSequence,
    selectCurrentStep,
    selectSaveState,
    selectExpectedPhotovoltaicPerformance,
    selectSoilsCarbonStorage,
    selectProjectSoilsDistribution,
    selectPhotovoltaicPowerStationScheduleInitialValues,
    selectIsFormStatusValid,
    selectPhotovoltaicPowerPlantSummaryNavigationDataView,
    // Alias kept for the update-side barrel's pre-existing export name.
    selectPhotovoltaicPowerPlantUpdateStepperDataView:
      selectPhotovoltaicPowerPlantSummaryNavigationDataView,
    selectRenewableEnergyProjectAvailableStakeholders,
    selectRenewableEnergyProjectAvailableLocalAuthoritiesStakeholders,
    selectPhotovoltaicPanelsSurfaceArea,
    selectSuitableSurfaceAreaForPhotovoltaicPanels,
    selectMissingSuitableSurfaceArea,
    selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
    selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
    selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
    selectPhotovoltaicPowerStationInstallationExpensesInitialValues,
    selectPVReinstatementExpensesViewData,
    selectSitePurchaseAmounts,
    selectPhotovoltaicPowerStationYearlyExpensesInitialValues,
    selectNameAndDescriptionInitialValues,
    selectContractDurationViewData,
    selectExpectedAnnualProductionViewData,
    selectPhotovoltaicPlantFeaturesKeyParameter,
    selectPhotovoltaicPowerViewData,
    selectPhotovoltaicSurfaceViewData,
    selectPhotovoltaicPowerStationFinancialAssistanceRevenueInitialValues,
    selectPVYearlyProjectedRevenueViewData,
    selectPVScheduleProjectionViewData,
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
    selectPVOperatorViewData,
    selectPVDeveloperViewData,
    selectPVFutureSiteOwnerViewData,
    selectPVReinstatementContractOwnerViewData,
    selectSitePurchasedViewData,
    selectCreationResultViewData,
    selectPhotovoltaicFinalSummaryViewData,
    selectSoilsCarbonStorageViewData,
    ...wizardFormSelectors,
  };
};
