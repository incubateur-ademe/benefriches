import { createReducer, UnknownAction } from "@reduxjs/toolkit";
import { UrbanSpaceCategory } from "shared";

import { typedObjectKeys } from "@/shared/core/object-keys/objectKeys";

import { ProjectCreationState } from "../createProject.reducer";
import { getFutureOperator, getFutureSiteOwner } from "../stakeholders";
import { customUrbanProjectSaved } from "./actions/customUrbanProjectSaved.action";
import { expressUrbanProjectSaved } from "./actions/expressUrbanProjectSaved.action";
import {
  buildingsFloorSurfaceAreaCompleted,
  buildingsFloorSurfaceAreaReverted,
  buildingsIntroductionCompleted,
  buildingsUseIntroductionCompleted,
  createModeStepReverted,
  customCreateModeSelected,
  expressCategoryStepReverted,
  expressCreateModeSelected,
  greenSpacesDistributionCompleted,
  greenSpacesDistributionReverted,
  greenSpacesIntroductionCompleted,
  greenSpacesIntroductionReverted,
  livingAndActivitySpacesDistributionCompleted,
  livingAndActivitySpacesDistributionReverted,
  livingAndActivitySpacesIntroductionCompleted,
  livingAndActivitySpacesIntroductionReverted,
  publicSpacesDistributionCompleted,
  publicSpacesDistributionReverted,
  publicSpacesIntroductionCompleted,
  publicSpacesIntroductionReverted,
  soilsCarbonStorageCompleted,
  soilsDecontaminationIntroductionCompleted,
  soilsDecontaminationSelectionCompleted,
  soilsDecontaminationSelectionReverted,
  soilsDecontaminationSurfaceAreaCompleted,
  soilsDecontaminationSurfaceAreaReverted,
  soilsSummaryCompleted,
  spacesDevelopmentPlanIntroductionCompleted,
  spacesIntroductionCompleted,
  spacesIntroductionReverted,
  spacesSelectionCompleted,
  spacesSelectionReverted,
  spacesSurfaceAreaCompleted,
  spacesSurfaceAreaReverted,
  stakeholderIntroductionCompleted,
  stakeholderProjectDeveloperCompleted,
  stakeholderProjectDeveloperReverted,
  stakeholderReinstatementContractOwnerCompleted,
  stakeholderReinstatementContractOwnerReverted,
  expensesIntroductionCompleted,
  sitePurchaseCompleted,
  sitePurchaseReverted,
  reinstatementExpensesCompleted,
  reinstatementExpensesReverted,
  installationExpensesCompleted,
  installationExpensesReverted,
  revenueIntroductionCompleted,
  yearlyBuildingsOperationsRevenuesCompleted,
  yearlyBuildingsOperationsRevenuesReverted,
  financialAssistanceRevenuesCompleted,
  financialAssistanceRevenuesReverted,
  namingCompleted,
  namingReverted,
  projectPhaseCompleted,
  projectPhaseReverted,
  scheduleCompleted,
  scheduleIntroductionCompleted,
  scheduleReverted,
  expectedSiteResaleRevenueCompleted,
  expectedSiteResaleRevenueReverted,
  siteResaleIntroductionCompleted,
  siteResaleChoiceCompleted,
  siteResaleChoiceReverted,
  buildingsResaleChoiceCompleted,
  buildingsResaleChoiceReverted,
  buildingsOperationsExpensesCompleted,
  buildingsOperationsExpensesReverted,
  buildingsResaleRevenueCompleted,
  buildingsResaleRevenueReverted,
  buildingsUseSurfaceAreasCompleted,
  buildingsUseSurfaceAreasReverted,
} from "./actions/urbanProject.actions";
import { UrbanProjectCreationData } from "./creationData";
import { UrbanProjectCreationStep, UrbanProjectCustomCreationStep } from "./creationSteps";
import soilsCarbonStorageReducer, {
  State as SoilsCarbonStorageState,
} from "./soilsCarbonStorage.reducer";

const urbanSpaceCategoryIntroductionMap = {
  GREEN_SPACES: "GREEN_SPACES_INTRODUCTION",
  LIVING_AND_ACTIVITY_SPACES: "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
  PUBLIC_SPACES: "PUBLIC_SPACES_INTRODUCTION",
  URBAN_FARM: undefined,
  RENEWABLE_ENERGY_PRODUCTION_PLANT: undefined,
  URBAN_POND_OR_LAKE: undefined,
} as const satisfies Record<UrbanSpaceCategory, UrbanProjectCustomCreationStep | undefined>;

export type UrbanProjectState = {
  createMode: "express" | "custom" | undefined;
  expressData: {
    name?: string;
    category?:
      | "PUBLIC_FACILITIES"
      | "RESIDENTIAL_TENSE_AREA"
      | "RESIDENTIAL_NORMAL_AREA"
      | "NEW_URBAN_CENTER";
  };
  saveState: "idle" | "loading" | "success" | "error";
  stepsHistory: UrbanProjectCreationStep[];
  spacesCategoriesToComplete: UrbanSpaceCategory[];
  creationData: UrbanProjectCreationData;
  soilsCarbonStorage: SoilsCarbonStorageState;
};

const isRevertedAction = (action: { type: string }) => {
  return (
    action.type.startsWith("projectCreation/urbanProject/") && action.type.endsWith("Reverted")
  );
};

export const initialState: UrbanProjectState = {
  createMode: undefined,
  expressData: {
    name: undefined,
    category: undefined,
  },
  creationData: {},
  saveState: "idle",
  stepsHistory: ["CREATE_MODE_SELECTION"],
  spacesCategoriesToComplete: [],
  soilsCarbonStorage: { loadingState: "idle", current: undefined, projected: undefined },
};

export const hasBuildings = (state: ProjectCreationState) => {
  const buildingsSurfaceArea =
    state.urbanProject.creationData.livingAndActivitySpacesDistribution?.BUILDINGS ?? 0;
  return buildingsSurfaceArea > 0;
};

const willBuildingsBeSold = (state: ProjectCreationState): boolean => {
  return (
    hasBuildings(state) && !!state.urbanProject.creationData.buildingsResalePlannedAfterDevelopment
  );
};

const urbanProjectReducer = createReducer({} as ProjectCreationState, (builder) => {
  builder.addCase(createModeStepReverted, (state) => {
    state.urbanProject.createMode = undefined;
  });
  builder.addCase(expressCreateModeSelected, (state) => {
    state.urbanProject.createMode = "express";
    state.urbanProject.stepsHistory.push("EXPRESS_CATEGORY_SELECTION");
  });
  builder.addCase(expressCategoryStepReverted, (state) => {
    state.urbanProject.createMode = undefined;
  });
  builder.addCase(expressUrbanProjectSaved.pending, (state, action) => {
    state.urbanProject.saveState = "loading";
    state.urbanProject.expressData.category = action.payload;
    state.urbanProject.stepsHistory.push("CREATION_RESULT");
  });
  builder.addCase(expressUrbanProjectSaved.rejected, (state) => {
    state.urbanProject.saveState = "error";
  });
  builder.addCase(expressUrbanProjectSaved.fulfilled, (state, action) => {
    state.urbanProject.saveState = "success";
    state.urbanProject.expressData.name = action.payload.name;
  });
  builder.addCase(customCreateModeSelected, (state) => {
    state.urbanProject.createMode = "custom";
    state.urbanProject.stepsHistory.push("SPACES_CATEGORIES_INTRODUCTION");
  });
  builder.addCase(spacesIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("SPACES_CATEGORIES_SELECTION");
  });
  builder.addCase(spacesIntroductionReverted, (state) => {
    state.urbanProject.createMode = undefined;
  });
  builder.addCase(spacesSelectionCompleted, (state, action) => {
    state.urbanProject.creationData.spacesCategories = action.payload.spacesCategories;

    if (action.payload.spacesCategories.length === 1) {
      const spaceCategory = action.payload.spacesCategories[0] as UrbanSpaceCategory;
      state.urbanProject.creationData.spacesCategoriesDistribution = {
        [spaceCategory]: state.siteData?.surfaceArea,
      };
      state.urbanProject.spacesCategoriesToComplete = [spaceCategory];
      state.urbanProject.stepsHistory.push("SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
      return;
    }

    state.urbanProject.stepsHistory.push("SPACES_CATEGORIES_SURFACE_AREA");
  });
  builder.addCase(spacesSelectionReverted, (state) => {
    state.urbanProject.spacesCategoriesToComplete = [];
    state.urbanProject.creationData.spacesCategories = undefined;
    state.urbanProject.creationData.spacesCategoriesDistribution = undefined;
  });
  builder.addCase(spacesSurfaceAreaCompleted, (state, action) => {
    state.urbanProject.creationData.spacesCategoriesDistribution =
      action.payload.surfaceAreaDistribution;
    state.urbanProject.spacesCategoriesToComplete = typedObjectKeys(
      action.payload.surfaceAreaDistribution,
    );
    state.urbanProject.stepsHistory.push("SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
  });
  builder.addCase(spacesSurfaceAreaReverted, (state) => {
    state.urbanProject.spacesCategoriesToComplete = [];
    state.urbanProject.creationData.spacesCategoriesDistribution = undefined;
  });
  builder.addCase(spacesDevelopmentPlanIntroductionCompleted, (state) => {
    const nextCategoryToComplete = state.urbanProject.spacesCategoriesToComplete.shift();
    const nextStep =
      nextCategoryToComplete && urbanSpaceCategoryIntroductionMap[nextCategoryToComplete];
    if (nextStep) {
      state.urbanProject.stepsHistory.push(nextStep);
    }
  });
  builder.addCase(greenSpacesIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
  });
  builder.addCase(greenSpacesIntroductionReverted, (state) => {
    state.urbanProject.spacesCategoriesToComplete.unshift("GREEN_SPACES");
  });
  builder.addCase(greenSpacesDistributionCompleted, (state, action) => {
    state.urbanProject.creationData.greenSpacesDistribution =
      action.payload.surfaceAreaDistribution;
    const nextCategoryToComplete = state.urbanProject.spacesCategoriesToComplete.shift();
    const nextStep =
      nextCategoryToComplete && urbanSpaceCategoryIntroductionMap[nextCategoryToComplete];
    if (nextStep) {
      state.urbanProject.stepsHistory.push(nextStep);
    } else {
      state.urbanProject.stepsHistory.push("SPACES_SOILS_SUMMARY");
    }
  });
  builder.addCase(greenSpacesDistributionReverted, (state) => {
    state.urbanProject.creationData.greenSpacesDistribution = undefined;
  });
  builder.addCase(livingAndActivitySpacesIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION");
  });
  builder.addCase(livingAndActivitySpacesIntroductionReverted, (state) => {
    state.urbanProject.spacesCategoriesToComplete.unshift("LIVING_AND_ACTIVITY_SPACES");
  });
  builder.addCase(livingAndActivitySpacesDistributionCompleted, (state, action) => {
    state.urbanProject.creationData.livingAndActivitySpacesDistribution = action.payload;
    const nextCategoryToComplete = state.urbanProject.spacesCategoriesToComplete.shift();
    const nextStep =
      nextCategoryToComplete && urbanSpaceCategoryIntroductionMap[nextCategoryToComplete];
    if (nextStep) {
      state.urbanProject.stepsHistory.push(nextStep);
    } else {
      state.urbanProject.stepsHistory.push("SPACES_SOILS_SUMMARY");
    }
  });
  builder.addCase(livingAndActivitySpacesDistributionReverted, (state) => {
    state.urbanProject.creationData.livingAndActivitySpacesDistribution = undefined;
  });
  builder.addCase(publicSpacesIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("PUBLIC_SPACES_DISTRIBUTION");
  });
  builder.addCase(publicSpacesIntroductionReverted, (state) => {
    state.urbanProject.spacesCategoriesToComplete.unshift("PUBLIC_SPACES");
  });
  builder.addCase(publicSpacesDistributionCompleted, (state, action) => {
    state.urbanProject.creationData.publicSpacesDistribution = action.payload;
    const nextCategoryToComplete = state.urbanProject.spacesCategoriesToComplete.shift();
    const nextStep =
      nextCategoryToComplete && urbanSpaceCategoryIntroductionMap[nextCategoryToComplete];
    if (nextStep) {
      state.urbanProject.stepsHistory.push(nextStep);
    } else {
      state.urbanProject.stepsHistory.push("SPACES_SOILS_SUMMARY");
    }
  });
  builder.addCase(publicSpacesDistributionReverted, (state) => {
    state.urbanProject.creationData.publicSpacesDistribution = undefined;
  });
  builder.addCase(soilsSummaryCompleted, (state) => {
    state.urbanProject.stepsHistory.push("SOILS_CARBON_SUMMARY");
  });
  builder.addCase(soilsCarbonStorageCompleted, (state) => {
    if (state.siteData?.contaminatedSoilSurface) {
      state.urbanProject.stepsHistory.push("SOILS_DECONTAMINATION_INTRODUCTION");
      return;
    }
    if (hasBuildings(state)) {
      state.urbanProject.stepsHistory.push("BUILDINGS_INTRODUCTION");
      return;
    }
    state.urbanProject.stepsHistory.push("STAKEHOLDERS_INTRODUCTION");
  });
  builder.addCase(soilsDecontaminationIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("SOILS_DECONTAMINATION_SELECTION");
  });
  builder.addCase(soilsDecontaminationSelectionCompleted, (state, action) => {
    const nextSectionStep = hasBuildings(state)
      ? "BUILDINGS_INTRODUCTION"
      : "STAKEHOLDERS_INTRODUCTION";

    state.urbanProject.creationData.decontaminationPlan = action.payload;
    switch (action.payload) {
      case "partial":
        state.urbanProject.stepsHistory.push("SOILS_DECONTAMINATION_SURFACE_AREA");
        break;
      case "none":
        state.urbanProject.creationData.decontaminatedSurfaceArea = 0;
        state.urbanProject.stepsHistory.push(nextSectionStep);
        break;
      case "unknown": {
        const contaminatedSoilSurface = state.siteData?.contaminatedSoilSurface ?? 0;
        state.urbanProject.creationData.decontaminatedSurfaceArea = contaminatedSoilSurface * 0.25;
        state.urbanProject.stepsHistory.push(nextSectionStep);
        break;
      }
    }
  });
  builder.addCase(soilsDecontaminationSelectionReverted, (state) => {
    state.urbanProject.creationData.decontaminationPlan = undefined;
    if (state.urbanProject.creationData.decontaminatedSurfaceArea)
      state.urbanProject.creationData.decontaminatedSurfaceArea = undefined;
  });
  builder.addCase(soilsDecontaminationSurfaceAreaCompleted, (state, action) => {
    state.urbanProject.stepsHistory.push(
      hasBuildings(state) ? "BUILDINGS_INTRODUCTION" : "STAKEHOLDERS_INTRODUCTION",
    );
    state.urbanProject.creationData.decontaminatedSurfaceArea = action.payload;
  });
  builder.addCase(soilsDecontaminationSurfaceAreaReverted, (state) => {
    state.urbanProject.creationData.decontaminatedSurfaceArea = undefined;
  });
  builder.addCase(buildingsIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("BUILDINGS_FLOOR_SURFACE_AREA");
  });
  builder.addCase(buildingsFloorSurfaceAreaCompleted, (state, action) => {
    state.urbanProject.creationData.buildingsFloorSurfaceArea = action.payload;
    state.urbanProject.stepsHistory.push("BUILDINGS_USE_INTRODUCTION");
  });
  builder.addCase(buildingsFloorSurfaceAreaReverted, (state) => {
    state.urbanProject.creationData.buildingsFloorSurfaceArea = undefined;
  });
  builder.addCase(buildingsUseIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION");
  });
  builder.addCase(buildingsUseSurfaceAreasCompleted, (state, action) => {
    state.urbanProject.creationData.buildingsUsesDistribution = action.payload;
    state.urbanProject.stepsHistory.push("STAKEHOLDERS_INTRODUCTION");
  });
  builder.addCase(buildingsUseSurfaceAreasReverted, (state) => {
    state.urbanProject.creationData.buildingsUsesDistribution = undefined;
  });

  builder.addCase(stakeholderIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("STAKEHOLDERS_PROJECT_DEVELOPER");
  });
  builder.addCase(stakeholderProjectDeveloperCompleted, (state, action) => {
    state.urbanProject.creationData.projectDeveloper = action.payload;
    state.urbanProject.stepsHistory.push(
      state.siteData?.isFriche
        ? "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
        : "SITE_RESALE_INTRODUCTION",
    );
  });
  builder.addCase(stakeholderProjectDeveloperReverted, (state) => {
    state.urbanProject.creationData.projectDeveloper = undefined;
  });
  builder.addCase(stakeholderReinstatementContractOwnerCompleted, (state, action) => {
    state.urbanProject.creationData.reinstatementContractOwner = action.payload;
    state.urbanProject.stepsHistory.push("SITE_RESALE_INTRODUCTION");
  });
  builder.addCase(stakeholderReinstatementContractOwnerReverted, (state) => {
    state.urbanProject.creationData.reinstatementContractOwner = undefined;
  });

  // site resale
  builder.addCase(siteResaleIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("SITE_RESALE_SELECTION");
  });
  builder.addCase(siteResaleChoiceCompleted, (state, action) => {
    const { siteResalePlannedAfterDevelopment } = action.payload;
    state.urbanProject.creationData.siteResalePlannedAfterDevelopment =
      siteResalePlannedAfterDevelopment;

    state.urbanProject.creationData.futureSiteOwner = getFutureSiteOwner(
      siteResalePlannedAfterDevelopment,
      state.siteData?.owner,
    );

    const nextStep = hasBuildings(state) ? "BUILDINGS_RESALE_SELECTION" : "EXPENSES_INTRODUCTION";
    state.urbanProject.stepsHistory.push(nextStep);
  });
  builder.addCase(siteResaleChoiceReverted, (state) => {
    state.urbanProject.creationData.siteResalePlannedAfterDevelopment = undefined;
    state.urbanProject.creationData.futureSiteOwner = undefined;
  });
  builder.addCase(buildingsResaleChoiceCompleted, (state, action) => {
    const { buildingsResalePlannedAfterDevelopment } = action.payload;
    state.urbanProject.creationData.buildingsResalePlannedAfterDevelopment =
      buildingsResalePlannedAfterDevelopment;

    state.urbanProject.creationData.futureOperator = getFutureOperator(
      buildingsResalePlannedAfterDevelopment,
      state.urbanProject.creationData.projectDeveloper,
    );
    state.urbanProject.stepsHistory.push("EXPENSES_INTRODUCTION");
  });
  builder.addCase(buildingsResaleChoiceReverted, (state) => {
    state.urbanProject.creationData.buildingsResalePlannedAfterDevelopment = undefined;
    state.urbanProject.creationData.futureOperator = undefined;
  });

  // expenses
  builder.addCase(expensesIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("EXPENSES_SITE_PURCHASE_AMOUNTS");
  });
  builder.addCase(sitePurchaseCompleted, (state, action) => {
    state.urbanProject.creationData.sitePurchaseSellingPrice = action.payload.sellingPrice;
    state.urbanProject.creationData.sitePurchasePropertyTransferDuties =
      action.payload.propertyTransferDuties;
    state.urbanProject.stepsHistory.push(
      state.siteData?.isFriche ? "EXPENSES_REINSTATEMENT" : "EXPENSES_INSTALLATION",
    );
  });
  builder.addCase(sitePurchaseReverted, (state) => {
    state.urbanProject.creationData.sitePurchaseSellingPrice = undefined;
    state.urbanProject.creationData.sitePurchasePropertyTransferDuties = undefined;
  });

  builder.addCase(reinstatementExpensesCompleted, (state, action) => {
    state.urbanProject.creationData.reinstatementExpenses = action.payload;
    state.urbanProject.stepsHistory.push("EXPENSES_INSTALLATION");
  });
  builder.addCase(reinstatementExpensesReverted, (state) => {
    state.urbanProject.creationData.reinstatementExpenses = undefined;
  });

  builder.addCase(installationExpensesCompleted, (state, action) => {
    state.urbanProject.creationData.installationExpenses = action.payload;
    const nextStep =
      hasBuildings(state) && !willBuildingsBeSold(state)
        ? "EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES"
        : "REVENUE_INTRODUCTION";
    state.urbanProject.stepsHistory.push(nextStep);
  });
  builder.addCase(installationExpensesReverted, (state) => {
    state.urbanProject.creationData.installationExpenses = undefined;
  });

  builder.addCase(buildingsOperationsExpensesCompleted, (state, action) => {
    state.urbanProject.creationData.yearlyProjectedBuildingsOperationsExpenses = action.payload;
    state.urbanProject.stepsHistory.push("REVENUE_INTRODUCTION");
  });
  builder.addCase(buildingsOperationsExpensesReverted, (state) => {
    state.urbanProject.creationData.yearlyProjectedBuildingsOperationsExpenses = undefined;
  });

  // revenues
  builder.addCase(revenueIntroductionCompleted, (state) => {
    if (state.urbanProject.creationData.siteResalePlannedAfterDevelopment) {
      state.urbanProject.stepsHistory.push("REVENUE_EXPECTED_SITE_RESALE");
      return;
    }
    if (!hasBuildings(state)) {
      state.urbanProject.stepsHistory.push("REVENUE_FINANCIAL_ASSISTANCE");
      return;
    }
    if (willBuildingsBeSold(state)) {
      state.urbanProject.stepsHistory.push("REVENUE_BUILDINGS_RESALE");
      return;
    }
    state.urbanProject.stepsHistory.push("REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES");
  });

  builder.addCase(expectedSiteResaleRevenueCompleted, (state, action) => {
    state.urbanProject.creationData.siteResaleExpectedSellingPrice = action.payload.sellingPrice;
    state.urbanProject.creationData.siteResaleExpectedPropertyTransferDuties =
      action.payload.propertyTransferDuties;

    if (!hasBuildings(state)) {
      state.urbanProject.stepsHistory.push("REVENUE_FINANCIAL_ASSISTANCE");
      return;
    }
    if (willBuildingsBeSold(state)) {
      state.urbanProject.stepsHistory.push("REVENUE_BUILDINGS_RESALE");
      return;
    }
    state.urbanProject.stepsHistory.push("REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES");
  });

  builder.addCase(buildingsResaleRevenueCompleted, (state, action) => {
    state.urbanProject.creationData.buildingsResaleSellingPrice = action.payload.sellingPrice;
    state.urbanProject.creationData.buildingsResalePropertyTransferDuties =
      action.payload.propertyTransferDuties;
    state.urbanProject.stepsHistory.push("REVENUE_FINANCIAL_ASSISTANCE");
  });
  builder.addCase(buildingsResaleRevenueReverted, (state) => {
    state.urbanProject.creationData.buildingsResaleSellingPrice = undefined;
    state.urbanProject.creationData.buildingsResalePropertyTransferDuties = undefined;
  });

  builder.addCase(expectedSiteResaleRevenueReverted, (state) => {
    state.urbanProject.creationData.siteResaleExpectedSellingPrice = undefined;
    state.urbanProject.creationData.siteResaleExpectedPropertyTransferDuties = undefined;
  });

  builder.addCase(yearlyBuildingsOperationsRevenuesCompleted, (state, action) => {
    state.urbanProject.creationData.yearlyProjectedRevenues = action.payload;
    state.urbanProject.stepsHistory.push("REVENUE_FINANCIAL_ASSISTANCE");
  });
  builder.addCase(yearlyBuildingsOperationsRevenuesReverted, (state) => {
    state.urbanProject.creationData.yearlyProjectedRevenues = undefined;
  });
  builder.addCase(financialAssistanceRevenuesCompleted, (state, action) => {
    state.urbanProject.creationData.financialAssistanceRevenues = action.payload;
    state.urbanProject.stepsHistory.push("SCHEDULE_INTRODUCTION");
  });
  builder.addCase(financialAssistanceRevenuesReverted, (state) => {
    state.urbanProject.creationData.financialAssistanceRevenues = undefined;
  });

  builder.addCase(scheduleIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("SCHEDULE_PROJECTION");
  });
  builder.addCase(scheduleCompleted, (state, action) => {
    const { firstYearOfOperation, installationSchedule, reinstatementSchedule } = action.payload;
    state.urbanProject.creationData.firstYearOfOperation = firstYearOfOperation;
    state.urbanProject.creationData.reinstatementSchedule = reinstatementSchedule;
    state.urbanProject.creationData.installationSchedule = installationSchedule;

    state.urbanProject.stepsHistory.push("PROJECT_PHASE");
  });
  builder.addCase(scheduleReverted, (state) => {
    state.urbanProject.creationData.firstYearOfOperation = undefined;
    state.urbanProject.creationData.reinstatementSchedule = undefined;
    state.urbanProject.creationData.installationSchedule = undefined;
  });

  builder.addCase(projectPhaseCompleted, (state, action) => {
    state.urbanProject.creationData.projectPhase = action.payload;
    state.urbanProject.stepsHistory.push("NAMING");
  });
  builder.addCase(projectPhaseReverted, (state) => {
    state.urbanProject.creationData.projectPhase = undefined;
  });

  builder.addCase(namingCompleted, (state, action) => {
    const { name, description } = action.payload;
    state.urbanProject.creationData.name = name;
    if (description) state.urbanProject.creationData.description = description;

    state.urbanProject.stepsHistory.push("FINAL_SUMMARY");
  });

  builder.addCase(namingReverted, (state) => {
    state.urbanProject.creationData.name = undefined;
    state.urbanProject.creationData.description = undefined;
  });

  builder.addCase(customUrbanProjectSaved.pending, (state) => {
    state.urbanProject.saveState = "loading";
  });
  builder.addCase(customUrbanProjectSaved.fulfilled, (state) => {
    state.urbanProject.saveState = "success";
    state.urbanProject.stepsHistory.push("CREATION_RESULT");
  });
  builder.addCase(customUrbanProjectSaved.rejected, (state) => {
    state.urbanProject.saveState = "error";
    state.urbanProject.stepsHistory.push("CREATION_RESULT");
  });

  builder.addMatcher(isRevertedAction, (state) => {
    if (state.urbanProject.stepsHistory.length === 1)
      state.urbanProject.stepsHistory = ["CREATE_MODE_SELECTION"];
    else state.urbanProject.stepsHistory.pop();
  });
});

export default (state: ProjectCreationState, action: UnknownAction): ProjectCreationState => {
  const s = urbanProjectReducer(state, action);
  return {
    ...s,
    urbanProject: {
      ...s.urbanProject,
      soilsCarbonStorage: soilsCarbonStorageReducer(state.urbanProject.soilsCarbonStorage, action),
    },
  };
};
