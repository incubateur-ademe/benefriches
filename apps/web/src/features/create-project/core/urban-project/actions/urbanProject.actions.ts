import { createAction as _createAction } from "@reduxjs/toolkit";
import {
  FinancialAssistanceRevenue,
  UrbanProjectPhase,
  RecurringExpense,
  ReinstatementExpense,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanProjectDevelopmentExpense,
  UrbanPublicSpace,
  UrbanSpaceCategory,
  YearlyBuildingsOperationsRevenues,
  BuildingsUse,
  SurfaceAreaDistributionJson,
} from "shared";

import { ProjectStakeholderStructure, Schedule } from "../../project.types";

export function prefixActionType(actionType: string) {
  return `projectCreation/urbanProject/${actionType}`;
}

const createAction = <TPayload = void>(actionName: string) =>
  _createAction<TPayload>(prefixActionType(actionName));

export const createModeStepReverted = createAction("createModeStepReverted");

export const resultStepReverted = createAction("resultStepReverted");
export const expressCategoryStepReverted = createAction("expressCategoryStepReverted");

export const customCreateModeSelected = createAction("customCreateModeSelected");
export const expressCreateModeSelected = createAction("expressCreateModeSelected");

export const spacesIntroductionCompleted = createAction("spacesIntroductionCompleted");
export const spacesIntroductionReverted = createAction("spacesIntroductionReverted");
export const spacesSelectionCompleted = createAction<{
  spacesCategories: UrbanSpaceCategory[];
}>("spacesSelectionCompleted");
export const spacesSelectionReverted = createAction("spacesSelectionReverted");
export const spacesSurfaceAreaCompleted = createAction<{
  surfaceAreaDistribution: Partial<Record<UrbanSpaceCategory, number>>;
}>("spacesSurfaceAreaCompleted");
export const spacesSurfaceAreaReverted = createAction("spacesSurfaceAreaReverted");
export const spacesDevelopmentPlanIntroductionCompleted = createAction(
  "spacesDevelopmentPlanIntroductionCompleted",
);
export const spacesDevelopmentPlanIntroductionReverted = createAction(
  "spacesDevelopmentPlanIntroductionReverted",
);

// green spaces
export const greenSpacesIntroductionCompleted = createAction("greenSpacesIntroductionCompleted");
export const greenSpacesIntroductionReverted = createAction("greenSpacesIntroductionReverted");
export const greenSpacesDistributionCompleted = createAction<{
  surfaceAreaDistribution: Partial<Record<UrbanGreenSpace, number>>;
}>("greenSpacesDistributionCompleted");
export const greenSpacesDistributionReverted = createAction("greenSpacesDistributionReverted");

// living and activity spaces
export const livingAndActivitySpacesIntroductionCompleted = createAction(
  "livingAndActivitySpacesIntroductionCompleted",
);
export const livingAndActivitySpacesIntroductionReverted = createAction(
  "livingAndActivitySpacesIntroductionReverted",
);
export const livingAndActivitySpacesDistributionCompleted = createAction<
  Partial<Record<UrbanLivingAndActivitySpace, number>>
>("livingAndActivitySpacesDistributionCompleted");
export const livingAndActivitySpacesDistributionReverted = createAction(
  "livingAndActivitySpacesDistributionReverted",
);

// public spaces
export const publicSpacesIntroductionCompleted = createAction("publicSpacesIntroductionCompleted");
export const publicSpacesIntroductionReverted = createAction("publicSpacesIntroductionReverted");
export const publicSpacesDistributionCompleted = createAction<
  Partial<Record<UrbanPublicSpace, number>>
>("publicSpacesDistributionCompleted");
export const publicSpacesDistributionReverted = createAction("publicSpacesDistributionReverted");

// soils summary and carbon storage
export const soilsSummaryCompleted = createAction("soilsSummaryCompleted");
export const soilsSummaryReverted = createAction("soilsSummaryReverted");

export const soilsCarbonStorageCompleted = createAction("soilsCarbonStorageCompleted");
export const soilsCarbonStorageReverted = createAction("soilsCarbonStorageReverted");

// soils decontamination
export const soilsDecontaminationIntroductionCompleted = createAction(
  "soilsDecontaminationIntroductionCompleted",
);
export const soilsDecontaminationIntroductionReverted = createAction(
  "soilsDecontaminationIntroductionReverted",
);
export const soilsDecontaminationSelectionCompleted = createAction<"partial" | "unknown" | "none">(
  "soilsDecontaminationSelectionCompleted",
);
export const soilsDecontaminationSelectionReverted = createAction(
  "soilsDecontaminationSelectionReverted",
);
export const soilsDecontaminationSurfaceAreaCompleted = createAction<number>(
  "soilsDecontaminationSurfaceAreaCompleted",
);
export const soilsDecontaminationSurfaceAreaReverted = createAction(
  "soilsDecontaminationSurfaceAreaReverted",
);

// buildings
export const buildingsIntroductionCompleted = createAction("buildingsIntroductionCompleted");
export const buildingsIntroductionReverted = createAction("buildingsIntroductionReverted");
export const buildingsFloorSurfaceAreaCompleted = createAction<number>(
  "buildingsFloorSurfaceAreaCompleted",
);
export const buildingsFloorSurfaceAreaReverted = createAction("buildingsFloorSurfaceAreaReverted");
export const buildingsUseIntroductionCompleted = createAction("buildingsUseIntroductionCompleted");
export const buildingsUseIntroductionReverted = createAction("buildingsUseIntroductionReverted");
export const buildingsUseSurfaceAreasCompleted = createAction<
  SurfaceAreaDistributionJson<BuildingsUse>
>("buildingsUseSurfaceAreasCompleted");
export const buildingsUseSurfaceAreasReverted = createAction("buildingsUseSurfaceAreasReverted");

// stakeholders
export const stakeholderIntroductionCompleted = createAction("stakeholderIntroductionCompleted");
export const stakeholderIntroductionReverted = createAction("stakeholderIntroductionReverted");
export const stakeholderProjectDeveloperCompleted = createAction<{
  name: string;
  structureType: ProjectStakeholderStructure;
}>("stakeholderProjectDeveloperCompleted");
export const stakeholderProjectDeveloperReverted = createAction(
  "stakeholderProjectDeveloperReverted",
);
export const stakeholderReinstatementContractOwnerCompleted = createAction<{
  name: string;
  structureType: ProjectStakeholderStructure;
}>("stakeholderReinstatementContractOwnerCompleted");
export const stakeholderReinstatementContractOwnerReverted = createAction(
  "stakeholderReinstatementContractOwnerReverted",
);

// site resale
export const siteResaleIntroductionCompleted = createAction("siteResaleIntroductionCompleted");
export const siteResaleIntroductionReverted = createAction("siteResaleIntroductionReverted");
export const siteResaleChoiceCompleted = createAction<{
  siteResalePlannedAfterDevelopment: boolean;
}>("siteResaleChoiceCompleted");
export const siteResaleChoiceReverted = createAction("siteResaleChoiceReverted");
export const buildingsResaleChoiceCompleted = createAction<{
  buildingsResalePlannedAfterDevelopment: boolean;
}>("buildingsResaleChoiceCompleted");
export const buildingsResaleChoiceReverted = createAction("buildingsResaleChoiceReverted");

// expenses
export const expensesIntroductionCompleted = createAction("expensesIntroductionCompleted");
export const expensesIntroductionReverted = createAction("expensesIntroductionReverted");
export const sitePurchaseCompleted = createAction<{
  sellingPrice?: number;
  propertyTransferDuties?: number;
}>("sitePurchaseCompleted");
export const sitePurchaseReverted = createAction("sitePurchaseReverted");
export const reinstatementExpensesCompleted = createAction<ReinstatementExpense[]>(
  "reinstatementExpensesCompleted",
);
export const reinstatementExpensesReverted = createAction("reinstatementExpensesReverted");
export const installationExpensesCompleted = createAction<UrbanProjectDevelopmentExpense[]>(
  "installationExpensesCompleted",
);
export const installationExpensesReverted = createAction("installationExpensesReverted");
export const buildingsOperationsExpensesCompleted = createAction<RecurringExpense[]>(
  "buildingsOperationsExpensesCompleted",
);
export const buildingsOperationsExpensesReverted = createAction(
  "buildingsOperationsExpensesReverted",
);

// revenues
export const revenueIntroductionCompleted = createAction("revenueIntroductionCompleted");
export const revenueIntroductionReverted = createAction("revenueIntroductionReverted");
export const financialAssistanceRevenuesCompleted = createAction<FinancialAssistanceRevenue[]>(
  "financialAssistanceRevenuesCompleted",
);

export const financialAssistanceRevenuesReverted = createAction(
  "financialAssistanceRevenuesReverted",
);
export const yearlyBuildingsOperationsRevenuesCompleted = createAction<
  YearlyBuildingsOperationsRevenues[]
>("yearlyBuildingsOperationsRevenuesCompleted");
export const yearlyBuildingsOperationsRevenuesReverted = createAction(
  "yearlyBuildingsOperationsRevenuesReverted",
);
export const expectedSiteResaleRevenueReverted = createAction("expectedSiteResaleRevenueReverted");
export const expectedSiteResaleRevenueCompleted = createAction<{
  sellingPrice?: number;
  propertyTransferDuties?: number;
}>("expectedSiteResaleRevenueCompleted");
export const buildingsResaleRevenueReverted = createAction("buildingsResaleRevenueReverted");
export const buildingsResaleRevenueCompleted = createAction<{
  sellingPrice?: number;
  propertyTransferDuties?: number;
}>("buildingsResaleRevenueCompleted");

export const scheduleIntroductionCompleted = createAction("scheduleIntroductionCompleted");
export const scheduleIntroductionReverted = createAction("scheduleIntroductioReverted");
export const projectPhaseCompleted = createAction<UrbanProjectPhase>("projectPhaseCompleted");
export const projectPhaseReverted = createAction("projectPhaseReverted");
export const scheduleCompleted = createAction<{
  reinstatementSchedule?: Schedule;
  installationSchedule?: Schedule;
  firstYearOfOperation: number;
}>("scheduleCompleted");
export const scheduleReverted = createAction("scheduleReverted");

export const namingCompleted = createAction<{ name: string; description?: string }>(
  "namingCompleted",
);
export const namingReverted = createAction("namingReverted");
export const finalSummaryReverted = createAction("finalSummaryReverted");
