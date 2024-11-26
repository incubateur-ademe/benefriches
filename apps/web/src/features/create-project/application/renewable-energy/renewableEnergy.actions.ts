import { createAction as _createAction } from "@reduxjs/toolkit";
import {
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  ReinstatementExpense,
  RenewableEnergyProjectPhase,
  SoilsDistribution,
  SoilType,
} from "shared";

import { RenewableEnergyDevelopmentPlanType } from "@/shared/domain/reconversionProject";

import {
  PhotovoltaicKeyParameter,
  ReconversionProjectCreationData,
  Schedule,
} from "../../domain/project.types";
import { SoilsTransformationProject } from "../../domain/soilsTransformation";

export function prefixActionType(actionType: string) {
  return `projectCreation/renewableEnergyProject/${actionType}`;
}

export const createAction = <TPayload = void>(actionName: string) =>
  _createAction<TPayload>(prefixActionType(actionName));

export const completeRenewableEnergyType = createAction<RenewableEnergyDevelopmentPlanType>(
  "completeRenewableEnergyType",
);
export const completeSoilsTransformationIntroductionStep = createAction(
  "completeSoilsTransformationIntroductionStep",
);
export const completeNonSuitableSoilsNoticeStep = createAction(
  "completeNonSuitableSoilsNoticeStep",
);
export const completeNonSuitableSoilsSelectionStep = createAction<SoilType[]>(
  "completeNonSuitableSoilsSelectionStep",
);
export const completeNonSuitableSoilsSurfaceStep = createAction<SoilsDistribution>(
  "completeNonSuitableSoilsSurfaceStep",
);
export const completeSoilsTransformationProjectSelectionStep =
  createAction<SoilsTransformationProject>("completeSoilsTransformationProjectSelectionStep");
export const completeCustomSoilsSelectionStep = createAction<SoilType[]>(
  "completeCustomSoilsSelectionStep",
);
export const completeCustomSoilsSurfaceAreaAllocationStep = createAction<SoilsDistribution>(
  "completeCustomSoilsSurfaceAreaAllocationStep",
);
export const completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep = createAction(
  "completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep",
);
export const completeStakeholdersIntroductionStep = createAction(
  "completeStakeholdersIntroductionStep",
);
export const completeFutureOperator =
  createAction<ReconversionProjectCreationData["futureOperator"]>("completeFutureOperator");
export const completeProjectDeveloper = createAction<
  ReconversionProjectCreationData["projectDeveloper"]
>("completeProjectDeveloper");
export const completeReinstatementContractOwner = createAction<
  ReconversionProjectCreationData["reinstatementContractOwner"]
>("completeReinstatementContractOwner");
export const completeExpensesIntroductionStep = createAction("completeExpensesIntroductionStep");
export const completeReinstatementExpenses = createAction<ReinstatementExpense[]>(
  "completeReinstatementExpenses",
);
export const completeRevenuIntroductionStep = createAction("completeRevenuIntroductionStep");
export const completePhotovoltaicPanelsInstallationExpenses = createAction<
  PhotovoltaicInstallationExpense[]
>("completePhotovoltaicPanelsInstallationExpenses");
export const completeYearlyProjectedExpenses = createAction<
  ReconversionProjectCreationData["yearlyProjectedExpenses"]
>("completeYearlyProjectedExpenses");
export const completeFinancialAssistanceRevenues = createAction<FinancialAssistanceRevenue[]>(
  "completeFinancialAssistanceRevenues",
);
export const completeYearlyProjectedRevenue = createAction<
  ReconversionProjectCreationData["yearlyProjectedRevenues"]
>("completeYearlyProjectedRevenue");
export const completeNaming = createAction<{ name: string; description?: string }>(
  "completeNaming",
);
export const completePhotovoltaicKeyParameter = createAction<PhotovoltaicKeyParameter>(
  "completePhotovoltaicKeyParameter",
);
export const completePhotovoltaicInstallationElectricalPower = createAction<number>(
  "completePhotovoltaicInstallationElectricalPower",
);
export const completePhotovoltaicInstallationSurface = createAction<number>(
  "completePhotovoltaicInstallationSurface",
);
export const completePhotovoltaicExpectedAnnualProduction = createAction<number>(
  "completePhotovoltaicExpectedAnnualProduction",
);
export const completePhotovoltaicContractDuration = createAction<number>(
  "completePhotovoltaicContractDuration",
);
export const completeSoilsSummaryStep = createAction("completeSoilsSummaryStep");
export const completeSoilsCarbonStorageStep = createAction("completeSoilsCarbonStorageStep");
export const completeScheduleIntroductionStep = createAction("completeScheduleIntroductionStep");
export const completeScheduleStep = createAction<{
  firstYearOfOperation?: number;
  photovoltaicInstallationSchedule?: Schedule;
  reinstatementSchedule?: Schedule;
}>("completeScheduleStep");
export const completeSitePurchase = createAction<boolean>("completeSitePurchase");
export const completeFutureSiteOwner =
  createAction<ReconversionProjectCreationData["futureSiteOwner"]>("completeFutureSiteOwner");
export const completeSitePurchaseAmounts = createAction<{
  sellingPrice: number;
  propertyTransferDuties?: number;
}>("completeSitePurchaseAmounts");
export const completeProjectPhaseStep = createAction<{ phase: RenewableEnergyProjectPhase }>(
  "completeProjectPhaseStep",
);
export const completeSoilsDecontaminationIntroduction = createAction(
  "completeSoilsDecontaminationIntroduction",
);
export const completeSoilsDecontaminationSelection = createAction<
  "all" | "partial" | "none" | "unknown" | null
>("completeSoilsDecontaminationSelection");
export const completeSoilsDecontaminationSurfaceArea = createAction<number>(
  "completeSoilsDecontaminationSurfaceArea",
);

export const revertRenewableEnergyType = createAction("revertRenewableEnergyType");
export const revertSoilsDecontaminationIntroductionStep = createAction(
  "revertSoilsDecontaminationIntroductionStep",
);
export const revertSoilsDecontaminationSelectionStep = createAction(
  "revertSoilsDecontaminationSelectionStep",
);
export const revertSoilsDecontaminationSurfaceAreaStep = createAction(
  "revertSoilsDecontaminationSurfaceAreaStep",
);
export const revertSoilsTransformationIntroductionStep = createAction(
  "revertSoilsTransformationIntroductionStep",
);
export const revertNonSuitableSoilsNoticeStep = createAction("revertNonSuitableSoilsNoticeStep");
export const revertNonSuitableSoilsSelectionStep = createAction(
  "revertNonSuitableSoilsSelectionStep",
);
export const revertNonSuitableSoilsSurfaceStep = createAction("revertNonSuitableSoilsSurfaceStep");
export const revertSoilsTransformationProjectSelectionStep = createAction(
  "revertSoilsTransformationProjectSelectionStep",
);
export const revertCustomSoilsSelectionStep = createAction("revertCustomSoilsSelectionStep");
export const revertCustomSoilsSurfaceAreaAllocationStep = createAction(
  "revertCustomSoilsSurfaceAreaAllocationStep",
);
export const revertBiodiversityAndClimateImpactNoticeStep = createAction(
  "revertBiodiversityAndClimateImpactNoticeStep",
);
export const revertStakeholdersIntroductionStep = createAction(
  "revertStakeholdersIntroductionStep",
);
export const revertProjectDeveloper = createAction("revertProjectDeveloper");
export const revertFutureOperator = createAction("revertFutureOperator");
export const revertReinstatementContractOwner = createAction("revertReinstatementContractOwner");
export const revertWillSiteBePurchased = createAction("revertWillSiteBePurchased");
export const revertFutureSiteOwner = createAction("revertFutureSiteOwner");
export const revertExpensesIntroductionStep = createAction("revertExpensesIntroductionStep");
export const revertSitePurchaseAmounts = createAction("revertSitePurchaseAmounts");
export const revertReinstatementExpenses = createAction("revertReinstatementExpenses");
export const revertPhotovoltaicPanelsInstallationExpenses = createAction(
  "revertPhotovoltaicPanelsInstallationExpenses",
);
export const revertYearlyProjectedExpenses = createAction("revertYearlyProjectedExpenses");
export const revertRevenuIntroductionStep = createAction("revertRevenuIntroductionStep");
export const revertFinancialAssistanceRevenues = createAction("revertFinancialAssistanceRevenues");
export const revertYearlyProjectedRevenue = createAction("revertYearlyProjectedRevenue");
export const revertNaming = createAction("revertNaming");
export const revertPhotovoltaicKeyParameter = createAction("revertPhotovoltaicKeyParameter");
export const revertPhotovoltaicInstallationElectricalPower = createAction(
  "revertPhotovoltaicInstallationElectricalPower",
);
export const revertPhotovoltaicInstallationSurface = createAction(
  "revertPhotovoltaicInstallationSurface",
);
export const revertPhotovoltaicExpectedAnnualProduction = createAction(
  "revertPhotovoltaicExpectedAnnualProduction",
);
export const revertPhotovoltaicContractDuration = createAction(
  "revertPhotovoltaicContractDuration",
);
export const revertSoilsSummaryStep = createAction("revertSoilsSummaryStep");
export const revertSoilsCarbonStorageStep = createAction("revertSoilsCarbonStorageStep");
export const revertScheduleIntroductionStep = createAction("revertScheduleIntroductionStep");
export const revertProjectPhaseStep = createAction("revertProjectPhaseStep");
export const revertScheduleStep = createAction("revertScheduleStep");
export const revertFinalSummaryStep = createAction("revertFinalSummaryStep");
export const revertResultStep = createAction("revertResultStep");
