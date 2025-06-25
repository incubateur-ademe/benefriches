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

const createUrbanProjectCreationAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(makeUrbanProjectCreationActionType(actionName));

export const customCreateModeSelected = createUrbanProjectCreationAction(
  "customCreateModeSelected",
);
export const expressCreateModeSelected = createUrbanProjectCreationAction(
  "expressCreateModeSelected",
);

export const spacesIntroductionCompleted = createUrbanProjectCreationAction(
  "spacesIntroductionCompleted",
);
export const spacesSelectionCompleted = createUrbanProjectCreationAction<{
  spacesCategories: UrbanSpaceCategory[];
}>("spacesSelectionCompleted");
export const spacesSurfaceAreaCompleted = createUrbanProjectCreationAction<{
  surfaceAreaDistribution: Partial<Record<UrbanSpaceCategory, number>>;
}>("spacesSurfaceAreaCompleted");
export const spacesDevelopmentPlanIntroductionCompleted = createUrbanProjectCreationAction(
  "spacesDevelopmentPlanIntroductionCompleted",
);
// green spaces
export const greenSpacesIntroductionCompleted = createUrbanProjectCreationAction(
  "greenSpacesIntroductionCompleted",
);
export const greenSpacesDistributionCompleted = createUrbanProjectCreationAction<{
  surfaceAreaDistribution: Partial<Record<UrbanGreenSpace, number>>;
}>("greenSpacesDistributionCompleted");

// living and activity spaces
export const livingAndActivitySpacesIntroductionCompleted = createUrbanProjectCreationAction(
  "livingAndActivitySpacesIntroductionCompleted",
);
export const livingAndActivitySpacesDistributionCompleted = createUrbanProjectCreationAction<
  Partial<Record<UrbanLivingAndActivitySpace, number>>
>("livingAndActivitySpacesDistributionCompleted");

// public spaces
export const publicSpacesIntroductionCompleted = createUrbanProjectCreationAction(
  "publicSpacesIntroductionCompleted",
);
export const publicSpacesDistributionCompleted = createUrbanProjectCreationAction<
  Partial<Record<UrbanPublicSpace, number>>
>("publicSpacesDistributionCompleted");

// soils summary and carbon storage
export const soilsSummaryCompleted = createUrbanProjectCreationAction("soilsSummaryCompleted");

export const soilsCarbonStorageCompleted = createUrbanProjectCreationAction(
  "soilsCarbonStorageCompleted",
);

// soils decontamination
export const soilsDecontaminationIntroductionCompleted = createUrbanProjectCreationAction(
  "soilsDecontaminationIntroductionCompleted",
);
export const soilsDecontaminationSelectionCompleted = createUrbanProjectCreationAction<
  "partial" | "unknown" | "none"
>("soilsDecontaminationSelectionCompleted");
export const soilsDecontaminationSurfaceAreaCompleted = createUrbanProjectCreationAction<number>(
  "soilsDecontaminationSurfaceAreaCompleted",
);

// buildings
export const buildingsIntroductionCompleted = createUrbanProjectCreationAction(
  "buildingsIntroductionCompleted",
);
export const buildingsFloorSurfaceAreaCompleted = createUrbanProjectCreationAction<number>(
  "buildingsFloorSurfaceAreaCompleted",
);
export const buildingsUseIntroductionCompleted = createUrbanProjectCreationAction(
  "buildingsUseIntroductionCompleted",
);
export const buildingsUseSurfaceAreasCompleted = createUrbanProjectCreationAction<
  SurfaceAreaDistributionJson<BuildingsUse>
>("buildingsUseSurfaceAreasCompleted");

// stakeholders
export const stakeholderIntroductionCompleted = createUrbanProjectCreationAction(
  "stakeholderIntroductionCompleted",
);
export const stakeholderProjectDeveloperCompleted = createUrbanProjectCreationAction<{
  name: string;
  structureType: ProjectStakeholderStructure;
}>("stakeholderProjectDeveloperCompleted");
export const stakeholderReinstatementContractOwnerCompleted = createUrbanProjectCreationAction<{
  name: string;
  structureType: ProjectStakeholderStructure;
}>("stakeholderReinstatementContractOwnerCompleted");

// site resale
export const siteResaleIntroductionCompleted = createUrbanProjectCreationAction(
  "siteResaleIntroductionCompleted",
);
export const siteResaleChoiceCompleted = createUrbanProjectCreationAction<{
  siteResalePlannedAfterDevelopment: boolean;
}>("siteResaleChoiceCompleted");
export const buildingsResaleChoiceCompleted = createUrbanProjectCreationAction<{
  buildingsResalePlannedAfterDevelopment: boolean;
}>("buildingsResaleChoiceCompleted");

// expenses
export const expensesIntroductionCompleted = createUrbanProjectCreationAction(
  "expensesIntroductionCompleted",
);
export const sitePurchaseCompleted = createUrbanProjectCreationAction<{
  sellingPrice?: number;
  propertyTransferDuties?: number;
}>("sitePurchaseCompleted");
export const reinstatementExpensesCompleted = createUrbanProjectCreationAction<
  ReinstatementExpense[]
>("reinstatementExpensesCompleted");
export const installationExpensesCompleted = createUrbanProjectCreationAction<
  UrbanProjectDevelopmentExpense[]
>("installationExpensesCompleted");
export const buildingsOperationsExpensesCompleted = createUrbanProjectCreationAction<
  RecurringExpense[]
>("buildingsOperationsExpensesCompleted");

// revenues
export const revenueIntroductionCompleted = createUrbanProjectCreationAction(
  "revenueIntroductionCompleted",
);
export const financialAssistanceRevenuesCompleted = createUrbanProjectCreationAction<
  FinancialAssistanceRevenue[]
>("financialAssistanceRevenuesCompleted");

export const yearlyBuildingsOperationsRevenuesCompleted = createUrbanProjectCreationAction<
  YearlyBuildingsOperationsRevenues[]
>("yearlyBuildingsOperationsRevenuesCompleted");
export const expectedSiteResaleRevenueCompleted = createUrbanProjectCreationAction<{
  sellingPrice?: number;
  propertyTransferDuties?: number;
}>("expectedSiteResaleRevenueCompleted");
export const buildingsResaleRevenueCompleted = createUrbanProjectCreationAction<{
  sellingPrice?: number;
  propertyTransferDuties?: number;
}>("buildingsResaleRevenueCompleted");

export const scheduleIntroductionCompleted = createUrbanProjectCreationAction(
  "scheduleIntroductionCompleted",
);
export const projectPhaseCompleted =
  createUrbanProjectCreationAction<UrbanProjectPhase>("projectPhaseCompleted");
export const scheduleCompleted = createUrbanProjectCreationAction<{
  reinstatementSchedule?: Schedule;
  installationSchedule?: Schedule;
  firstYearOfOperation: number;
}>("scheduleCompleted");

export const namingCompleted = createUrbanProjectCreationAction<{
  name: string;
  description?: string;
}>("namingCompleted");
