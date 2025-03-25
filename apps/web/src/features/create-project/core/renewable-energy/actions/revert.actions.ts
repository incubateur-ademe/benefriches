import { Action, createAction } from "@reduxjs/toolkit";

import {
  isStepRevertAttemptedAction,
  makeProjectCreationRevertActionType,
} from "../../actions/actionsUtils";
import { ReconversionProjectCreationData } from "../../project.types";
import { createRenewableEnergyAction, RENEWABLE_ENERGY } from "./renewableEnergy.actions";

export type StepRevertedActionPayload =
  | { resetFields: (keyof ReconversionProjectCreationData)[] }
  | undefined;

export const createRenewableEnergyStepRevertAttemptedAction =
  createAction<StepRevertedActionPayload>(makeProjectCreationRevertActionType(RENEWABLE_ENERGY));

export const stepReverted = createRenewableEnergyAction<StepRevertedActionPayload>("stepReverted");

export const stepRevertConfirmed = createRenewableEnergyAction<{ doNotAskAgain: boolean }>(
  "stepRevertConfirmed",
);
export const stepRevertCancelled = createRenewableEnergyAction<{ doNotAskAgain: boolean }>(
  "stepRevertCancelled",
);

export const isRenewableEnergyStepRevertAttemptedAction = (
  action: Action,
): action is ReturnType<typeof createRenewableEnergyStepRevertAttemptedAction> => {
  return isStepRevertAttemptedAction(action) && action.type.includes(RENEWABLE_ENERGY);
};

export const renewableEnergyTypeStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["renewableEnergyType"],
  });
export const soilsDecontaminationIntroductionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction();

export const soilsDecontaminationSelectionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["decontaminatedSurfaceArea", "decontaminationPlan"],
  });
export const soilsDecontaminationSurfaceAreaStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({ resetFields: ["decontaminatedSurfaceArea"] });
export const soilsTransformationIntroductionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction();
export const nonSuitableSoilsNoticeStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction();
export const nonSuitableSoilsSelectionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["nonSuitableSoilsToTransform"],
  });
export const nonSuitableSoilsSurfaceStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: [
      "baseSoilsDistributionForTransformation",
      "nonSuitableSoilsSurfaceAreaToTransform",
    ],
  });
export const soilsTransformationProjectSelectionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["soilsTransformationProject", "soilsDistribution"],
  });
export const customSoilsSelectionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["futureSoilsSelection"],
  });
export const customSoilsSurfaceAreaAllocationStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({ resetFields: ["soilsDistribution"] });
export const biodiversityAndClimateImpactNoticeStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction();
export const stakeholdersIntroductionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction();
export const projectDeveloperStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["projectDeveloper"],
  });
export const futureOperatorStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["futureOperator"],
  });
export const reinstatementContractOwnerStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["reinstatementContractOwner"],
  });
export const willSiteBePurchasedStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["willSiteBePurchased"],
  });
export const futureSiteOwnerStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["futureSiteOwner"],
  });
export const expensesIntroductionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction();
export const sitePurchaseAmountsStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["sitePurchaseSellingPrice", "sitePurchasePropertyTransferDuties"],
  });
export const reinstatementExpensesStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["reinstatementExpenses"],
  });
export const photovoltaicPanelsInstallationExpensesStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["photovoltaicPanelsInstallationExpenses"],
  });
export const yearlyProjectedExpensesStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["yearlyProjectedExpenses"],
  });
export const revenueIntroductionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction();
export const financialAssistanceRevenuesStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["financialAssistanceRevenues"],
  });
export const yearlyProjectedRevenueStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["yearlyProjectedRevenues"],
  });
export const namingStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["name", "description"],
  });
export const photovoltaicKeyParameterStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["photovoltaicKeyParameter"],
  });
export const photovoltaicInstallationElectricalPowerStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["photovoltaicInstallationElectricalPowerKWc"],
  });
export const photovoltaicInstallationSurfaceStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["photovoltaicInstallationSurfaceSquareMeters"],
  });
export const photovoltaicExpectedAnnualProductionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["photovoltaicExpectedAnnualProduction"],
  });
export const photovoltaicContractDurationStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["photovoltaicContractDuration"],
  });
export const soilsSummaryStepReverted = () => createRenewableEnergyStepRevertAttemptedAction();
export const soilsCarbonStorageStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction();
export const scheduleIntroductionStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction();
export const projectPhaseStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: ["projectPhase"],
  });
export const scheduleStepReverted = () =>
  createRenewableEnergyStepRevertAttemptedAction({
    resetFields: [
      "firstYearOfOperation",
      "reinstatementSchedule",
      "photovoltaicInstallationSchedule",
    ],
  });
export const finalSummaryStepReverted = () => createRenewableEnergyStepRevertAttemptedAction();
export const resultsStepReverted = () => createRenewableEnergyStepRevertAttemptedAction();
