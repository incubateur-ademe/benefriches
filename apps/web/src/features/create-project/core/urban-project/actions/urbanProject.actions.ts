import { createAction } from "@reduxjs/toolkit";
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

import { makeProjectCreationActionType } from "../../actions/actionsUtils";
import { ProjectStakeholderStructure, Schedule } from "../../project.types";

const URBAN_PROJECT_CREATION_PREFIX = "urbanProject";

export const makeUrbanProjectCreationActionType = (actionName: string) => {
  return makeProjectCreationActionType(`${URBAN_PROJECT_CREATION_PREFIX}/${actionName}`);
};

export const createUrbanProjectCreationAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(makeUrbanProjectCreationActionType(actionName));

export const createModeStepReverted = createUrbanProjectCreationAction("createModeStepReverted");

export const resultStepReverted = createUrbanProjectCreationAction("resultStepReverted");
export const expressCategoryStepReverted = createUrbanProjectCreationAction(
  "expressCategoryStepReverted",
);

export const customCreateModeSelected = createUrbanProjectCreationAction(
  "customCreateModeSelected",
);
export const expressCreateModeSelected = createUrbanProjectCreationAction(
  "expressCreateModeSelected",
);

export const spacesIntroductionCompleted = createUrbanProjectCreationAction(
  "spacesIntroductionCompleted",
);
export const spacesIntroductionReverted = createUrbanProjectCreationAction(
  "spacesIntroductionReverted",
);
export const spacesSelectionCompleted = createUrbanProjectCreationAction<{
  spacesCategories: UrbanSpaceCategory[];
}>("spacesSelectionCompleted");
export const spacesSelectionReverted = createUrbanProjectCreationAction("spacesSelectionReverted");
export const spacesSurfaceAreaCompleted = createUrbanProjectCreationAction<{
  surfaceAreaDistribution: Partial<Record<UrbanSpaceCategory, number>>;
}>("spacesSurfaceAreaCompleted");
export const spacesSurfaceAreaReverted = createUrbanProjectCreationAction(
  "spacesSurfaceAreaReverted",
);
export const spacesDevelopmentPlanIntroductionCompleted = createUrbanProjectCreationAction(
  "spacesDevelopmentPlanIntroductionCompleted",
);
export const spacesDevelopmentPlanIntroductionReverted = createUrbanProjectCreationAction(
  "spacesDevelopmentPlanIntroductionReverted",
);

// green spaces
export const greenSpacesIntroductionCompleted = createUrbanProjectCreationAction(
  "greenSpacesIntroductionCompleted",
);
export const greenSpacesIntroductionReverted = createUrbanProjectCreationAction(
  "greenSpacesIntroductionReverted",
);
export const greenSpacesDistributionCompleted = createUrbanProjectCreationAction<{
  surfaceAreaDistribution: Partial<Record<UrbanGreenSpace, number>>;
}>("greenSpacesDistributionCompleted");
export const greenSpacesDistributionReverted = createUrbanProjectCreationAction(
  "greenSpacesDistributionReverted",
);

// living and activity spaces
export const livingAndActivitySpacesIntroductionCompleted = createUrbanProjectCreationAction(
  "livingAndActivitySpacesIntroductionCompleted",
);
export const livingAndActivitySpacesIntroductionReverted = createUrbanProjectCreationAction(
  "livingAndActivitySpacesIntroductionReverted",
);
export const livingAndActivitySpacesDistributionCompleted = createUrbanProjectCreationAction<
  Partial<Record<UrbanLivingAndActivitySpace, number>>
>("livingAndActivitySpacesDistributionCompleted");
export const livingAndActivitySpacesDistributionReverted = createUrbanProjectCreationAction(
  "livingAndActivitySpacesDistributionReverted",
);

// public spaces
export const publicSpacesIntroductionCompleted = createUrbanProjectCreationAction(
  "publicSpacesIntroductionCompleted",
);
export const publicSpacesIntroductionReverted = createUrbanProjectCreationAction(
  "publicSpacesIntroductionReverted",
);
export const publicSpacesDistributionCompleted = createUrbanProjectCreationAction<
  Partial<Record<UrbanPublicSpace, number>>
>("publicSpacesDistributionCompleted");
export const publicSpacesDistributionReverted = createUrbanProjectCreationAction(
  "publicSpacesDistributionReverted",
);

// soils summary and carbon storage
export const soilsSummaryCompleted = createUrbanProjectCreationAction("soilsSummaryCompleted");
export const soilsSummaryReverted = createUrbanProjectCreationAction("soilsSummaryReverted");

export const soilsCarbonStorageCompleted = createUrbanProjectCreationAction(
  "soilsCarbonStorageCompleted",
);
export const soilsCarbonStorageReverted = createUrbanProjectCreationAction(
  "soilsCarbonStorageReverted",
);

// soils decontamination
export const soilsDecontaminationIntroductionCompleted = createUrbanProjectCreationAction(
  "soilsDecontaminationIntroductionCompleted",
);
export const soilsDecontaminationIntroductionReverted = createUrbanProjectCreationAction(
  "soilsDecontaminationIntroductionReverted",
);
export const soilsDecontaminationSelectionCompleted = createUrbanProjectCreationAction<
  "partial" | "unknown" | "none"
>("soilsDecontaminationSelectionCompleted");
export const soilsDecontaminationSelectionReverted = createUrbanProjectCreationAction(
  "soilsDecontaminationSelectionReverted",
);
export const soilsDecontaminationSurfaceAreaCompleted = createUrbanProjectCreationAction<number>(
  "soilsDecontaminationSurfaceAreaCompleted",
);
export const soilsDecontaminationSurfaceAreaReverted = createUrbanProjectCreationAction(
  "soilsDecontaminationSurfaceAreaReverted",
);

// buildings
export const buildingsIntroductionCompleted = createUrbanProjectCreationAction(
  "buildingsIntroductionCompleted",
);
export const buildingsIntroductionReverted = createUrbanProjectCreationAction(
  "buildingsIntroductionReverted",
);
export const buildingsFloorSurfaceAreaCompleted = createUrbanProjectCreationAction<number>(
  "buildingsFloorSurfaceAreaCompleted",
);
export const buildingsFloorSurfaceAreaReverted = createUrbanProjectCreationAction(
  "buildingsFloorSurfaceAreaReverted",
);
export const buildingsUseIntroductionCompleted = createUrbanProjectCreationAction(
  "buildingsUseIntroductionCompleted",
);
export const buildingsUseIntroductionReverted = createUrbanProjectCreationAction(
  "buildingsUseIntroductionReverted",
);
export const buildingsUseSurfaceAreasCompleted = createUrbanProjectCreationAction<
  SurfaceAreaDistributionJson<BuildingsUse>
>("buildingsUseSurfaceAreasCompleted");
export const buildingsUseSurfaceAreasReverted = createUrbanProjectCreationAction(
  "buildingsUseSurfaceAreasReverted",
);

// stakeholders
export const stakeholderIntroductionCompleted = createUrbanProjectCreationAction(
  "stakeholderIntroductionCompleted",
);
export const stakeholderIntroductionReverted = createUrbanProjectCreationAction(
  "stakeholderIntroductionReverted",
);
export const stakeholderProjectDeveloperCompleted = createUrbanProjectCreationAction<{
  name: string;
  structureType: ProjectStakeholderStructure;
}>("stakeholderProjectDeveloperCompleted");
export const stakeholderProjectDeveloperReverted = createUrbanProjectCreationAction(
  "stakeholderProjectDeveloperReverted",
);
export const stakeholderReinstatementContractOwnerCompleted = createUrbanProjectCreationAction<{
  name: string;
  structureType: ProjectStakeholderStructure;
}>("stakeholderReinstatementContractOwnerCompleted");
export const stakeholderReinstatementContractOwnerReverted = createUrbanProjectCreationAction(
  "stakeholderReinstatementContractOwnerReverted",
);

// site resale
export const siteResaleIntroductionCompleted = createUrbanProjectCreationAction(
  "siteResaleIntroductionCompleted",
);
export const siteResaleIntroductionReverted = createUrbanProjectCreationAction(
  "siteResaleIntroductionReverted",
);
export const siteResaleChoiceCompleted = createUrbanProjectCreationAction<{
  siteResalePlannedAfterDevelopment: boolean;
}>("siteResaleChoiceCompleted");
export const siteResaleChoiceReverted = createUrbanProjectCreationAction(
  "siteResaleChoiceReverted",
);
export const buildingsResaleChoiceCompleted = createUrbanProjectCreationAction<{
  buildingsResalePlannedAfterDevelopment: boolean;
}>("buildingsResaleChoiceCompleted");
export const buildingsResaleChoiceReverted = createUrbanProjectCreationAction(
  "buildingsResaleChoiceReverted",
);

// expenses
export const expensesIntroductionCompleted = createUrbanProjectCreationAction(
  "expensesIntroductionCompleted",
);
export const expensesIntroductionReverted = createUrbanProjectCreationAction(
  "expensesIntroductionReverted",
);
export const sitePurchaseCompleted = createUrbanProjectCreationAction<{
  sellingPrice?: number;
  propertyTransferDuties?: number;
}>("sitePurchaseCompleted");
export const sitePurchaseReverted = createUrbanProjectCreationAction("sitePurchaseReverted");
export const reinstatementExpensesCompleted = createUrbanProjectCreationAction<
  ReinstatementExpense[]
>("reinstatementExpensesCompleted");
export const reinstatementExpensesReverted = createUrbanProjectCreationAction(
  "reinstatementExpensesReverted",
);
export const installationExpensesCompleted = createUrbanProjectCreationAction<
  UrbanProjectDevelopmentExpense[]
>("installationExpensesCompleted");
export const installationExpensesReverted = createUrbanProjectCreationAction(
  "installationExpensesReverted",
);
export const buildingsOperationsExpensesCompleted = createUrbanProjectCreationAction<
  RecurringExpense[]
>("buildingsOperationsExpensesCompleted");
export const buildingsOperationsExpensesReverted = createUrbanProjectCreationAction(
  "buildingsOperationsExpensesReverted",
);

// revenues
export const revenueIntroductionCompleted = createUrbanProjectCreationAction(
  "revenueIntroductionCompleted",
);
export const revenueIntroductionReverted = createUrbanProjectCreationAction(
  "revenueIntroductionReverted",
);
export const financialAssistanceRevenuesCompleted = createUrbanProjectCreationAction<
  FinancialAssistanceRevenue[]
>("financialAssistanceRevenuesCompleted");

export const financialAssistanceRevenuesReverted = createUrbanProjectCreationAction(
  "financialAssistanceRevenuesReverted",
);
export const yearlyBuildingsOperationsRevenuesCompleted = createUrbanProjectCreationAction<
  YearlyBuildingsOperationsRevenues[]
>("yearlyBuildingsOperationsRevenuesCompleted");
export const yearlyBuildingsOperationsRevenuesReverted = createUrbanProjectCreationAction(
  "yearlyBuildingsOperationsRevenuesReverted",
);
export const expectedSiteResaleRevenueReverted = createUrbanProjectCreationAction(
  "expectedSiteResaleRevenueReverted",
);
export const expectedSiteResaleRevenueCompleted = createUrbanProjectCreationAction<{
  sellingPrice?: number;
  propertyTransferDuties?: number;
}>("expectedSiteResaleRevenueCompleted");
export const buildingsResaleRevenueReverted = createUrbanProjectCreationAction(
  "buildingsResaleRevenueReverted",
);
export const buildingsResaleRevenueCompleted = createUrbanProjectCreationAction<{
  sellingPrice?: number;
  propertyTransferDuties?: number;
}>("buildingsResaleRevenueCompleted");

export const scheduleIntroductionCompleted = createUrbanProjectCreationAction(
  "scheduleIntroductionCompleted",
);
export const scheduleIntroductionReverted = createUrbanProjectCreationAction(
  "scheduleIntroductioReverted",
);
export const projectPhaseCompleted =
  createUrbanProjectCreationAction<UrbanProjectPhase>("projectPhaseCompleted");
export const projectPhaseReverted = createUrbanProjectCreationAction("projectPhaseReverted");
export const scheduleCompleted = createUrbanProjectCreationAction<{
  reinstatementSchedule?: Schedule;
  installationSchedule?: Schedule;
  firstYearOfOperation: number;
}>("scheduleCompleted");
export const scheduleReverted = createUrbanProjectCreationAction("scheduleReverted");

export const namingCompleted = createUrbanProjectCreationAction<{
  name: string;
  description?: string;
}>("namingCompleted");
export const namingReverted = createUrbanProjectCreationAction("namingReverted");
export const finalSummaryReverted = createUrbanProjectCreationAction("finalSummaryReverted");
