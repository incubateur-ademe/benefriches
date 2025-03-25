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

export const RENEWABLE_ENERGY = "renewableEnergy";

export const makeRenewableEnergyProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`${RENEWABLE_ENERGY}/${actionName}`);
};

export const createRenewableEnergyAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(makeRenewableEnergyProjectCreationActionType(actionName));

export const completeRenewableEnergyType =
  createRenewableEnergyAction<RenewableEnergyDevelopmentPlanType>("completeRenewableEnergyType");
export const completeSoilsTransformationIntroductionStep = createRenewableEnergyAction(
  "completeSoilsTransformationIntroductionStep",
);
export const completeNonSuitableSoilsNoticeStep = createRenewableEnergyAction(
  "completeNonSuitableSoilsNoticeStep",
);
export const completeNonSuitableSoilsSelectionStep = createRenewableEnergyAction<SoilType[]>(
  "completeNonSuitableSoilsSelectionStep",
);
export const completeNonSuitableSoilsSurfaceStep = createRenewableEnergyAction<SoilsDistribution>(
  "completeNonSuitableSoilsSurfaceStep",
);
export const completeSoilsTransformationProjectSelectionStep =
  createRenewableEnergyAction<SoilsTransformationProject>(
    "completeSoilsTransformationProjectSelectionStep",
  );
export const completeCustomSoilsSelectionStep = createRenewableEnergyAction<SoilType[]>(
  "completeCustomSoilsSelectionStep",
);
export const completeCustomSoilsSurfaceAreaAllocationStep =
  createRenewableEnergyAction<SoilsDistribution>("completeCustomSoilsSurfaceAreaAllocationStep");
export const completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep =
  createRenewableEnergyAction("completeSoilsTransformationClimateAndBiodiversityImpactNoticeStep");
export const completeStakeholdersIntroductionStep = createRenewableEnergyAction(
  "completeStakeholdersIntroductionStep",
);
export const futureOperatorCompleted =
  createRenewableEnergyAction<ProjectStakeholder>("futureOperatorCompleted");
export const completeProjectDeveloper = createRenewableEnergyAction<
  ReconversionProjectCreationData["projectDeveloper"]
>("completeProjectDeveloper");
export const completeReinstatementContractOwner = createRenewableEnergyAction<
  ReconversionProjectCreationData["reinstatementContractOwner"]
>("completeReinstatementContractOwner");
export const completeExpensesIntroductionStep = createRenewableEnergyAction(
  "completeExpensesIntroductionStep",
);
export const completeReinstatementExpenses = createRenewableEnergyAction<ReinstatementExpense[]>(
  "completeReinstatementExpenses",
);
export const completeRevenuIntroductionStep = createRenewableEnergyAction(
  "completeRevenuIntroductionStep",
);
export const completePhotovoltaicPanelsInstallationExpenses = createRenewableEnergyAction<
  PhotovoltaicInstallationExpense[]
>("completePhotovoltaicPanelsInstallationExpenses");
export const completeYearlyProjectedExpenses = createRenewableEnergyAction<
  ReconversionProjectCreationData["yearlyProjectedExpenses"]
>("completeYearlyProjectedExpenses");
export const completeFinancialAssistanceRevenues = createRenewableEnergyAction<
  FinancialAssistanceRevenue[]
>("completeFinancialAssistanceRevenues");
export const completeYearlyProjectedRevenue = createRenewableEnergyAction<
  ReconversionProjectCreationData["yearlyProjectedRevenues"]
>("completeYearlyProjectedRevenue");
export const completeNaming = createRenewableEnergyAction<{
  name: string;
  description?: string;
}>("completeNaming");
export const completePhotovoltaicKeyParameter =
  createRenewableEnergyAction<PhotovoltaicKeyParameter>("completePhotovoltaicKeyParameter");
export const completePhotovoltaicInstallationElectricalPower = createRenewableEnergyAction<number>(
  "completePhotovoltaicInstallationElectricalPower",
);
export const completePhotovoltaicInstallationSurface = createRenewableEnergyAction<number>(
  "completePhotovoltaicInstallationSurface",
);
export const completePhotovoltaicExpectedAnnualProduction = createRenewableEnergyAction<number>(
  "completePhotovoltaicExpectedAnnualProduction",
);
export const completePhotovoltaicContractDuration = createRenewableEnergyAction<number>(
  "completePhotovoltaicContractDuration",
);
export const completeSoilsSummaryStep = createRenewableEnergyAction("completeSoilsSummaryStep");
export const completeSoilsCarbonStorageStep = createRenewableEnergyAction(
  "completeSoilsCarbonStorageStep",
);
export const completeScheduleIntroductionStep = createRenewableEnergyAction(
  "completeScheduleIntroductionStep",
);
export const completeScheduleStep = createRenewableEnergyAction<{
  firstYearOfOperation?: number;
  photovoltaicInstallationSchedule?: Schedule;
  reinstatementSchedule?: Schedule;
}>("completeScheduleStep");
export const completeSitePurchase = createRenewableEnergyAction<boolean>("completeSitePurchase");
export const completeFutureSiteOwner =
  createRenewableEnergyAction<ReconversionProjectCreationData["futureSiteOwner"]>(
    "completeFutureSiteOwner",
  );
export const completeSitePurchaseAmounts = createRenewableEnergyAction<{
  sellingPrice: number;
  propertyTransferDuties?: number;
}>("completeSitePurchaseAmounts");
export const completeProjectPhaseStep = createRenewableEnergyAction<{
  phase: RenewableEnergyProjectPhase;
}>("completeProjectPhaseStep");
export const completeSoilsDecontaminationIntroduction = createRenewableEnergyAction(
  "completeSoilsDecontaminationIntroduction",
);
export const completeSoilsDecontaminationSelection = createRenewableEnergyAction<
  "partial" | "none" | "unknown"
>("completeSoilsDecontaminationSelection");
export const completeSoilsDecontaminationSurfaceArea = createRenewableEnergyAction<number>(
  "completeSoilsDecontaminationSurfaceArea",
);
