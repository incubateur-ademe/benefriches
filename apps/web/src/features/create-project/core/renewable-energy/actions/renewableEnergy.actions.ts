import { createAction } from "@reduxjs/toolkit";
import {
  FinancialAssistanceRevenue,
  PhotovoltaicInstallationExpense,
  ReinstatementExpense,
  RenewableEnergyProjectPhase,
  SoilsDistribution,
  SoilType,
} from "shared";

import { RenewableEnergyDevelopmentPlanType } from "@/shared/core/reconversionProject";

import { makeProjectCreationActionType } from "../../actions/actionsUtils";
import {
  PhotovoltaicKeyParameter,
  ProjectStakeholder,
  ReconversionProjectCreationData,
  Schedule,
} from "../../project.types";
import { SoilsTransformationProject } from "../soilsTransformation";

const RENEWABLE_ENERGY = "renewableEnergy";

export const makeRenewableEnergyProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`${RENEWABLE_ENERGY}/${actionName}`);
};

export const createUrbanProjectCreationAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(makeRenewableEnergyProjectCreationActionType(actionName));

export const completeRenewableEnergyType =
  createUrbanProjectCreationAction<RenewableEnergyDevelopmentPlanType>(
    "completeRenewableEnergyType",
  );
export const completeSoilsTransformationIntroductionStep = createUrbanProjectCreationAction(
  "completeSoilsTransformationIntroductionStep",
);
export const completeNonSuitableSoilsNoticeStep = createUrbanProjectCreationAction(
  "completeNonSuitableSoilsNoticeStep",
);
export const completeNonSuitableSoilsSelectionStep = createUrbanProjectCreationAction<SoilType[]>(
  "completeNonSuitableSoilsSelectionStep",
);
export const completeNonSuitableSoilsSurfaceStep =
  createUrbanProjectCreationAction<SoilsDistribution>("completeNonSuitableSoilsSurfaceStep");
export const completeSoilsTransformationProjectSelectionStep =
  createUrbanProjectCreationAction<SoilsTransformationProject>(
    "completeSoilsTransformationProjectSelectionStep",
  );
export const completeCustomSoilsSelectionStep = createUrbanProjectCreationAction<SoilType[]>(
  "completeCustomSoilsSelectionStep",
);
export const completeCustomSoilsSurfaceAreaAllocationStep =
  createUrbanProjectCreationAction<SoilsDistribution>(
    "completeCustomSoilsSurfaceAreaAllocationStep",
  );
export const completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep =
  createUrbanProjectCreationAction(
    "completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep",
  );
export const completeStakeholdersIntroductionStep = createUrbanProjectCreationAction(
  "completeStakeholdersIntroductionStep",
);
export const futureOperatorCompleted =
  createUrbanProjectCreationAction<ProjectStakeholder>("futureOperatorCompleted");
export const completeProjectDeveloper = createUrbanProjectCreationAction<
  ReconversionProjectCreationData["projectDeveloper"]
>("completeProjectDeveloper");
export const completeReinstatementContractOwner = createUrbanProjectCreationAction<
  ReconversionProjectCreationData["reinstatementContractOwner"]
>("completeReinstatementContractOwner");
export const completeExpensesIntroductionStep = createUrbanProjectCreationAction(
  "completeExpensesIntroductionStep",
);
export const completeReinstatementExpenses = createUrbanProjectCreationAction<
  ReinstatementExpense[]
>("completeReinstatementExpenses");
export const completeRevenuIntroductionStep = createUrbanProjectCreationAction(
  "completeRevenuIntroductionStep",
);
export const completePhotovoltaicPanelsInstallationExpenses = createUrbanProjectCreationAction<
  PhotovoltaicInstallationExpense[]
>("completePhotovoltaicPanelsInstallationExpenses");
export const completeYearlyProjectedExpenses = createUrbanProjectCreationAction<
  ReconversionProjectCreationData["yearlyProjectedExpenses"]
>("completeYearlyProjectedExpenses");
export const completeFinancialAssistanceRevenues = createUrbanProjectCreationAction<
  FinancialAssistanceRevenue[]
>("completeFinancialAssistanceRevenues");
export const completeYearlyProjectedRevenue = createUrbanProjectCreationAction<
  ReconversionProjectCreationData["yearlyProjectedRevenues"]
>("completeYearlyProjectedRevenue");
export const completeNaming = createUrbanProjectCreationAction<{
  name: string;
  description?: string;
}>("completeNaming");
export const completePhotovoltaicKeyParameter =
  createUrbanProjectCreationAction<PhotovoltaicKeyParameter>("completePhotovoltaicKeyParameter");
export const completePhotovoltaicInstallationElectricalPower =
  createUrbanProjectCreationAction<number>("completePhotovoltaicInstallationElectricalPower");
export const completePhotovoltaicInstallationSurface = createUrbanProjectCreationAction<number>(
  "completePhotovoltaicInstallationSurface",
);
export const completePhotovoltaicExpectedAnnualProduction =
  createUrbanProjectCreationAction<number>("completePhotovoltaicExpectedAnnualProduction");
export const completePhotovoltaicContractDuration = createUrbanProjectCreationAction<number>(
  "completePhotovoltaicContractDuration",
);
export const completeSoilsSummaryStep = createUrbanProjectCreationAction(
  "completeSoilsSummaryStep",
);
export const completeSoilsCarbonStorageStep = createUrbanProjectCreationAction(
  "completeSoilsCarbonStorageStep",
);
export const completeScheduleIntroductionStep = createUrbanProjectCreationAction(
  "completeScheduleIntroductionStep",
);
export const completeScheduleStep = createUrbanProjectCreationAction<{
  firstYearOfOperation?: number;
  photovoltaicInstallationSchedule?: Schedule;
  reinstatementSchedule?: Schedule;
}>("completeScheduleStep");
export const completeSitePurchase =
  createUrbanProjectCreationAction<boolean>("completeSitePurchase");
export const completeFutureSiteOwner =
  createUrbanProjectCreationAction<ReconversionProjectCreationData["futureSiteOwner"]>(
    "completeFutureSiteOwner",
  );
export const completeSitePurchaseAmounts = createUrbanProjectCreationAction<{
  sellingPrice: number;
  propertyTransferDuties?: number;
}>("completeSitePurchaseAmounts");
export const completeProjectPhaseStep = createUrbanProjectCreationAction<{
  phase: RenewableEnergyProjectPhase;
}>("completeProjectPhaseStep");
export const completeSoilsDecontaminationIntroduction = createUrbanProjectCreationAction(
  "completeSoilsDecontaminationIntroduction",
);
export const completeSoilsDecontaminationSelection = createUrbanProjectCreationAction<
  "partial" | "none" | "unknown"
>("completeSoilsDecontaminationSelection");
export const completeSoilsDecontaminationSurfaceArea = createUrbanProjectCreationAction<number>(
  "completeSoilsDecontaminationSurfaceArea",
);

export const revertRenewableEnergyType = createUrbanProjectCreationAction(
  "revertRenewableEnergyType",
);
export const revertSoilsDecontaminationIntroductionStep = createUrbanProjectCreationAction(
  "revertSoilsDecontaminationIntroductionStep",
);
export const revertSoilsDecontaminationSelectionStep = createUrbanProjectCreationAction(
  "revertSoilsDecontaminationSelectionStep",
);
export const revertSoilsDecontaminationSurfaceAreaStep = createUrbanProjectCreationAction(
  "revertSoilsDecontaminationSurfaceAreaStep",
);
export const revertSoilsTransformationIntroductionStep = createUrbanProjectCreationAction(
  "revertSoilsTransformationIntroductionStep",
);
export const revertNonSuitableSoilsNoticeStep = createUrbanProjectCreationAction(
  "revertNonSuitableSoilsNoticeStep",
);
export const revertNonSuitableSoilsSelectionStep = createUrbanProjectCreationAction(
  "revertNonSuitableSoilsSelectionStep",
);
export const revertNonSuitableSoilsSurfaceStep = createUrbanProjectCreationAction(
  "revertNonSuitableSoilsSurfaceStep",
);
export const revertSoilsTransformationProjectSelectionStep = createUrbanProjectCreationAction(
  "revertSoilsTransformationProjectSelectionStep",
);
export const revertCustomSoilsSelectionStep = createUrbanProjectCreationAction(
  "revertCustomSoilsSelectionStep",
);
export const revertCustomSoilsSurfaceAreaAllocationStep = createUrbanProjectCreationAction(
  "revertCustomSoilsSurfaceAreaAllocationStep",
);
export const revertBiodiversityAndClimateImpactNoticeStep = createUrbanProjectCreationAction(
  "revertBiodiversityAndClimateImpactNoticeStep",
);
export const revertStakeholdersIntroductionStep = createUrbanProjectCreationAction(
  "revertStakeholdersIntroductionStep",
);
export const revertProjectDeveloper = createUrbanProjectCreationAction("revertProjectDeveloper");
export const revertFutureOperator = createUrbanProjectCreationAction("revertFutureOperator");
export const revertReinstatementContractOwner = createUrbanProjectCreationAction(
  "revertReinstatementContractOwner",
);
export const revertWillSiteBePurchased = createUrbanProjectCreationAction(
  "revertWillSiteBePurchased",
);
export const revertFutureSiteOwner = createUrbanProjectCreationAction("revertFutureSiteOwner");
export const revertExpensesIntroductionStep = createUrbanProjectCreationAction(
  "revertExpensesIntroductionStep",
);
export const revertSitePurchaseAmounts = createUrbanProjectCreationAction(
  "revertSitePurchaseAmounts",
);
export const revertReinstatementExpenses = createUrbanProjectCreationAction(
  "revertReinstatementExpenses",
);
export const revertPhotovoltaicPanelsInstallationExpenses = createUrbanProjectCreationAction(
  "revertPhotovoltaicPanelsInstallationExpenses",
);
export const revertYearlyProjectedExpenses = createUrbanProjectCreationAction(
  "revertYearlyProjectedExpenses",
);
export const revertRevenuIntroductionStep = createUrbanProjectCreationAction(
  "revertRevenuIntroductionStep",
);
export const revertFinancialAssistanceRevenues = createUrbanProjectCreationAction(
  "revertFinancialAssistanceRevenues",
);
export const revertYearlyProjectedRevenue = createUrbanProjectCreationAction(
  "revertYearlyProjectedRevenue",
);
export const revertNaming = createUrbanProjectCreationAction("revertNaming");
export const revertPhotovoltaicKeyParameter = createUrbanProjectCreationAction(
  "revertPhotovoltaicKeyParameter",
);
export const revertPhotovoltaicInstallationElectricalPower = createUrbanProjectCreationAction(
  "revertPhotovoltaicInstallationElectricalPower",
);
export const revertPhotovoltaicInstallationSurface = createUrbanProjectCreationAction(
  "revertPhotovoltaicInstallationSurface",
);
export const revertPhotovoltaicExpectedAnnualProduction = createUrbanProjectCreationAction(
  "revertPhotovoltaicExpectedAnnualProduction",
);
export const revertPhotovoltaicContractDuration = createUrbanProjectCreationAction(
  "revertPhotovoltaicContractDuration",
);
export const revertSoilsSummaryStep = createUrbanProjectCreationAction("revertSoilsSummaryStep");
export const revertSoilsCarbonStorageStep = createUrbanProjectCreationAction(
  "revertSoilsCarbonStorageStep",
);
export const revertScheduleIntroductionStep = createUrbanProjectCreationAction(
  "revertScheduleIntroductionStep",
);
export const revertProjectPhaseStep = createUrbanProjectCreationAction("revertProjectPhaseStep");
export const revertScheduleStep = createUrbanProjectCreationAction("revertScheduleStep");
export const revertFinalSummaryStep = createUrbanProjectCreationAction("revertFinalSummaryStep");
export const revertResultStep = createUrbanProjectCreationAction("revertResultStep");
