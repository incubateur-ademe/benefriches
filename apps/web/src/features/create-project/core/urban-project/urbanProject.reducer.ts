import { createReducer, UnknownAction } from "@reduxjs/toolkit";
import { UrbanSpaceCategory } from "shared";

import { typedObjectKeys } from "@/shared/core/object-keys/objectKeys";

import { stepRevertConfirmed } from "../actions/actionsUtils";
import { ProjectCreationState } from "../createProject.reducer";
import { getFutureOperator, getFutureSiteOwner } from "../stakeholders";
import { customUrbanProjectSaved } from "./actions/customUrbanProjectSaved.action";
import { expressUrbanProjectSaved } from "./actions/expressUrbanProjectSaved.action";
import {
  buildingsFloorSurfaceAreaCompleted,
  buildingsIntroductionCompleted,
  buildingsUseIntroductionCompleted,
  customCreateModeSelected,
  expressCreateModeSelected,
  greenSpacesDistributionCompleted,
  greenSpacesIntroductionCompleted,
  livingAndActivitySpacesDistributionCompleted,
  livingAndActivitySpacesIntroductionCompleted,
  publicSpacesDistributionCompleted,
  publicSpacesIntroductionCompleted,
  soilsCarbonStorageCompleted,
  soilsDecontaminationIntroductionCompleted,
  soilsDecontaminationSelectionCompleted,
  soilsDecontaminationSurfaceAreaCompleted,
  soilsSummaryCompleted,
  spacesDevelopmentPlanIntroductionCompleted,
  spacesIntroductionCompleted,
  spacesSelectionCompleted,
  spacesSurfaceAreaCompleted,
  stakeholderIntroductionCompleted,
  stakeholderProjectDeveloperCompleted,
  stakeholderReinstatementContractOwnerCompleted,
  expensesIntroductionCompleted,
  sitePurchaseCompleted,
  reinstatementExpensesCompleted,
  installationExpensesCompleted,
  revenueIntroductionCompleted,
  yearlyBuildingsOperationsRevenuesCompleted,
  financialAssistanceRevenuesCompleted,
  namingCompleted,
  projectPhaseCompleted,
  scheduleCompleted,
  scheduleIntroductionCompleted,
  expectedSiteResaleRevenueCompleted,
  siteResaleIntroductionCompleted,
  siteResaleChoiceCompleted,
  buildingsResaleChoiceCompleted,
  buildingsOperationsExpensesCompleted,
  buildingsResaleRevenueCompleted,
  buildingsUseSurfaceAreasCompleted,
} from "./actions/urbanProject.actions";
import { UrbanProjectCreationData } from "./creationData";
import { UrbanProjectCustomCreationStep } from "./creationSteps";
import soilsCarbonStorageReducer, {
  State as SoilsCarbonStorageState,
} from "./soilsCarbonStorage.reducer";

const urbanSpaceCategoryIntroductionMap = {
  GREEN_SPACES: "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION",
  LIVING_AND_ACTIVITY_SPACES: "URBAN_PROJECT_LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
  PUBLIC_SPACES: "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION",
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
  spacesCategoriesToComplete: UrbanSpaceCategory[];
  creationData: UrbanProjectCreationData;
  soilsCarbonStorage: SoilsCarbonStorageState;
};

export const initialState: UrbanProjectState = {
  createMode: undefined,
  expressData: {
    name: undefined,
    category: undefined,
  },
  creationData: {},
  saveState: "idle",
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
  builder.addCase(stepRevertConfirmed, (state, action) => {
    switch (action.payload.revertedStep) {
      case "URBAN_PROJECT_CREATE_MODE_SELECTION":
      case "URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION":
      case "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION":
        state.urbanProject.createMode = undefined;
        break;
      case "URBAN_PROJECT_SPACES_CATEGORIES_SELECTION":
        state.urbanProject.spacesCategoriesToComplete = [];
        state.urbanProject.creationData.spacesCategories = undefined;
        state.urbanProject.creationData.spacesCategoriesDistribution = undefined;
        break;
      case "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA":
        state.urbanProject.spacesCategoriesToComplete = [];
        state.urbanProject.creationData.spacesCategoriesDistribution = undefined;
        break;
      case "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION":
        state.urbanProject.spacesCategoriesToComplete.unshift("GREEN_SPACES");
        break;
      case "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION":
        state.urbanProject.creationData.greenSpacesDistribution = undefined;
        break;
      case "URBAN_PROJECT_LIVING_AND_ACTIVITY_SPACES_INTRODUCTION":
        state.urbanProject.spacesCategoriesToComplete.unshift("LIVING_AND_ACTIVITY_SPACES");
        break;
      case "URBAN_PROJECT_LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION":
        state.urbanProject.creationData.livingAndActivitySpacesDistribution = undefined;
        break;
      case "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION":
        state.urbanProject.spacesCategoriesToComplete.unshift("PUBLIC_SPACES");
        break;
      case "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION":
        state.urbanProject.creationData.publicSpacesDistribution = undefined;
        break;
      case "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION":
        state.urbanProject.creationData.decontaminationPlan = undefined;
        if (state.urbanProject.creationData.decontaminatedSurfaceArea)
          state.urbanProject.creationData.decontaminatedSurfaceArea = undefined;
        break;
      case "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA":
        state.urbanProject.creationData.decontaminatedSurfaceArea = undefined;
        break;
      case "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA":
        state.urbanProject.creationData.buildingsFloorSurfaceArea = undefined;
        break;
      case "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION":
        state.urbanProject.creationData.buildingsUsesDistribution = undefined;
        break;
      case "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER":
        state.urbanProject.creationData.projectDeveloper = undefined;
        break;
      case "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER":
        state.urbanProject.creationData.reinstatementContractOwner = undefined;
        break;
      case "URBAN_PROJECT_SITE_RESALE_SELECTION":
        state.urbanProject.creationData.siteResalePlannedAfterDevelopment = undefined;
        state.urbanProject.creationData.futureSiteOwner = undefined;
        break;
      case "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION":
        state.urbanProject.creationData.buildingsResalePlannedAfterDevelopment = undefined;
        state.urbanProject.creationData.futureOperator = undefined;
        break;
      case "URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS":
        state.urbanProject.creationData.sitePurchaseSellingPrice = undefined;
        state.urbanProject.creationData.sitePurchasePropertyTransferDuties = undefined;
        break;
      case "URBAN_PROJECT_EXPENSES_REINSTATEMENT":
        state.urbanProject.creationData.reinstatementExpenses = undefined;
        break;
      case "URBAN_PROJECT_EXPENSES_INSTALLATION":
        state.urbanProject.creationData.installationExpenses = undefined;
        break;
      case "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES":
        state.urbanProject.creationData.yearlyProjectedBuildingsOperationsExpenses = undefined;
        break;
      case "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE":
        state.urbanProject.creationData.buildingsResaleSellingPrice = undefined;
        state.urbanProject.creationData.buildingsResalePropertyTransferDuties = undefined;
        break;
      case "URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE":
        state.urbanProject.creationData.siteResaleExpectedSellingPrice = undefined;
        state.urbanProject.creationData.siteResaleExpectedPropertyTransferDuties = undefined;
        break;
      case "URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES":
        state.urbanProject.creationData.yearlyProjectedRevenues = undefined;
        break;
      case "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE":
        state.urbanProject.creationData.financialAssistanceRevenues = undefined;
        break;
      case "URBAN_PROJECT_SCHEDULE_PROJECTION":
        state.urbanProject.creationData.firstYearOfOperation = undefined;
        state.urbanProject.creationData.reinstatementSchedule = undefined;
        state.urbanProject.creationData.installationSchedule = undefined;
        break;
      case "URBAN_PROJECT_PROJECT_PHASE":
        state.urbanProject.creationData.projectPhase = undefined;
        break;
      case "URBAN_PROJECT_NAMING":
        state.urbanProject.creationData.name = undefined;
        state.urbanProject.creationData.description = undefined;
        break;
    }
  });
  builder.addCase(expressCreateModeSelected, (state) => {
    state.urbanProject.createMode = "express";
    state.stepsHistory.push("URBAN_PROJECT_EXPRESS_CATEGORY_SELECTION");
  });
  builder.addCase(expressUrbanProjectSaved.pending, (state, action) => {
    state.urbanProject.saveState = "loading";
    state.urbanProject.expressData.category = action.payload;
    state.stepsHistory.push("URBAN_PROJECT_CREATION_RESULT");
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
    state.stepsHistory.push("URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION");
  });
  builder.addCase(spacesIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_SPACES_CATEGORIES_SELECTION");
  });
  builder.addCase(spacesSelectionCompleted, (state, action) => {
    state.urbanProject.creationData.spacesCategories = action.payload.spacesCategories;

    if (action.payload.spacesCategories.length === 1) {
      const spaceCategory = action.payload.spacesCategories[0] as UrbanSpaceCategory;
      state.urbanProject.creationData.spacesCategoriesDistribution = {
        [spaceCategory]: state.siteData?.surfaceArea,
      };
      state.urbanProject.spacesCategoriesToComplete = [spaceCategory];
      state.stepsHistory.push("URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
      return;
    }

    state.stepsHistory.push("URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA");
  });
  builder.addCase(spacesSurfaceAreaCompleted, (state, action) => {
    state.urbanProject.creationData.spacesCategoriesDistribution =
      action.payload.surfaceAreaDistribution;
    state.urbanProject.spacesCategoriesToComplete = typedObjectKeys(
      action.payload.surfaceAreaDistribution,
    );
    state.stepsHistory.push("URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
  });
  builder.addCase(spacesDevelopmentPlanIntroductionCompleted, (state) => {
    const nextCategoryToComplete = state.urbanProject.spacesCategoriesToComplete.shift();
    const nextStep =
      nextCategoryToComplete && urbanSpaceCategoryIntroductionMap[nextCategoryToComplete];
    if (nextStep) {
      state.stepsHistory.push(nextStep);
    }
  });
  builder.addCase(greenSpacesIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
  });
  builder.addCase(greenSpacesDistributionCompleted, (state, action) => {
    state.urbanProject.creationData.greenSpacesDistribution =
      action.payload.surfaceAreaDistribution;
    const nextCategoryToComplete = state.urbanProject.spacesCategoriesToComplete.shift();
    const nextStep =
      nextCategoryToComplete && urbanSpaceCategoryIntroductionMap[nextCategoryToComplete];
    if (nextStep) {
      state.stepsHistory.push(nextStep);
    } else {
      state.stepsHistory.push("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
    }
  });
  builder.addCase(livingAndActivitySpacesIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION");
  });
  builder.addCase(livingAndActivitySpacesDistributionCompleted, (state, action) => {
    state.urbanProject.creationData.livingAndActivitySpacesDistribution = action.payload;
    const nextCategoryToComplete = state.urbanProject.spacesCategoriesToComplete.shift();
    const nextStep =
      nextCategoryToComplete && urbanSpaceCategoryIntroductionMap[nextCategoryToComplete];
    if (nextStep) {
      state.stepsHistory.push(nextStep);
    } else {
      state.stepsHistory.push("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
    }
  });
  builder.addCase(publicSpacesIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION");
  });
  builder.addCase(publicSpacesDistributionCompleted, (state, action) => {
    state.urbanProject.creationData.publicSpacesDistribution = action.payload;
    const nextCategoryToComplete = state.urbanProject.spacesCategoriesToComplete.shift();
    const nextStep =
      nextCategoryToComplete && urbanSpaceCategoryIntroductionMap[nextCategoryToComplete];
    if (nextStep) {
      state.stepsHistory.push(nextStep);
    } else {
      state.stepsHistory.push("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
    }
  });
  builder.addCase(soilsSummaryCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_SOILS_CARBON_SUMMARY");
  });
  builder.addCase(soilsCarbonStorageCompleted, (state) => {
    if (state.siteData?.contaminatedSoilSurface) {
      state.stepsHistory.push("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
      return;
    }
    if (hasBuildings(state)) {
      state.stepsHistory.push("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
      return;
    }
    state.stepsHistory.push("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  });
  builder.addCase(soilsDecontaminationIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION");
  });
  builder.addCase(soilsDecontaminationSelectionCompleted, (state, action) => {
    const nextSectionStep = hasBuildings(state)
      ? "URBAN_PROJECT_BUILDINGS_INTRODUCTION"
      : "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";

    state.urbanProject.creationData.decontaminationPlan = action.payload;
    switch (action.payload) {
      case "partial":
        state.stepsHistory.push("URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA");
        break;
      case "none":
        state.urbanProject.creationData.decontaminatedSurfaceArea = 0;
        state.stepsHistory.push(nextSectionStep);
        break;
      case "unknown": {
        const contaminatedSoilSurface = state.siteData?.contaminatedSoilSurface ?? 0;
        state.urbanProject.creationData.decontaminatedSurfaceArea = contaminatedSoilSurface * 0.25;
        state.stepsHistory.push(nextSectionStep);
        break;
      }
    }
  });
  builder.addCase(soilsDecontaminationSurfaceAreaCompleted, (state, action) => {
    state.stepsHistory.push(
      hasBuildings(state)
        ? "URBAN_PROJECT_BUILDINGS_INTRODUCTION"
        : "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",
    );
    state.urbanProject.creationData.decontaminatedSurfaceArea = action.payload;
  });
  builder.addCase(buildingsIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA");
  });
  builder.addCase(buildingsFloorSurfaceAreaCompleted, (state, action) => {
    state.urbanProject.creationData.buildingsFloorSurfaceArea = action.payload;
    state.stepsHistory.push("URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION");
  });
  builder.addCase(buildingsUseIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION");
  });
  builder.addCase(buildingsUseSurfaceAreasCompleted, (state, action) => {
    state.urbanProject.creationData.buildingsUsesDistribution = action.payload;
    state.stepsHistory.push("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  });
  builder.addCase(stakeholderIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER");
  });
  builder.addCase(stakeholderProjectDeveloperCompleted, (state, action) => {
    state.urbanProject.creationData.projectDeveloper = action.payload;
    state.stepsHistory.push(
      state.siteData?.nature === "FRICHE"
        ? "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
        : "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",
    );
  });
  builder.addCase(stakeholderReinstatementContractOwnerCompleted, (state, action) => {
    state.urbanProject.creationData.reinstatementContractOwner = action.payload;
    state.stepsHistory.push("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  });
  // site resale
  builder.addCase(siteResaleIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_SITE_RESALE_SELECTION");
  });
  builder.addCase(siteResaleChoiceCompleted, (state, action) => {
    const { siteResalePlannedAfterDevelopment } = action.payload;
    state.urbanProject.creationData.siteResalePlannedAfterDevelopment =
      siteResalePlannedAfterDevelopment;

    state.urbanProject.creationData.futureSiteOwner = getFutureSiteOwner(
      siteResalePlannedAfterDevelopment,
      state.siteData?.owner,
    );

    const nextStep = hasBuildings(state)
      ? "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION"
      : "URBAN_PROJECT_EXPENSES_INTRODUCTION";
    state.stepsHistory.push(nextStep);
  });
  builder.addCase(buildingsResaleChoiceCompleted, (state, action) => {
    const { buildingsResalePlannedAfterDevelopment } = action.payload;
    state.urbanProject.creationData.buildingsResalePlannedAfterDevelopment =
      buildingsResalePlannedAfterDevelopment;

    state.urbanProject.creationData.futureOperator = getFutureOperator(
      buildingsResalePlannedAfterDevelopment,
      state.urbanProject.creationData.projectDeveloper,
    );
    state.stepsHistory.push("URBAN_PROJECT_EXPENSES_INTRODUCTION");
  });
  // expenses
  builder.addCase(expensesIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_EXPENSES_SITE_PURCHASE_AMOUNTS");
  });
  builder.addCase(sitePurchaseCompleted, (state, action) => {
    state.urbanProject.creationData.sitePurchaseSellingPrice = action.payload.sellingPrice;
    state.urbanProject.creationData.sitePurchasePropertyTransferDuties =
      action.payload.propertyTransferDuties;
    state.stepsHistory.push(
      state.siteData?.nature === "FRICHE"
        ? "URBAN_PROJECT_EXPENSES_REINSTATEMENT"
        : "URBAN_PROJECT_EXPENSES_INSTALLATION",
    );
  });

  builder.addCase(reinstatementExpensesCompleted, (state, action) => {
    state.urbanProject.creationData.reinstatementExpenses = action.payload;
    state.stepsHistory.push("URBAN_PROJECT_EXPENSES_INSTALLATION");
  });

  builder.addCase(installationExpensesCompleted, (state, action) => {
    state.urbanProject.creationData.installationExpenses = action.payload;
    const nextStep =
      hasBuildings(state) && !willBuildingsBeSold(state)
        ? "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES"
        : "URBAN_PROJECT_REVENUE_INTRODUCTION";
    state.stepsHistory.push(nextStep);
  });

  builder.addCase(buildingsOperationsExpensesCompleted, (state, action) => {
    state.urbanProject.creationData.yearlyProjectedBuildingsOperationsExpenses = action.payload;
    state.stepsHistory.push("URBAN_PROJECT_REVENUE_INTRODUCTION");
  });

  // revenues
  builder.addCase(revenueIntroductionCompleted, (state) => {
    if (state.urbanProject.creationData.siteResalePlannedAfterDevelopment) {
      state.stepsHistory.push("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
      return;
    }
    if (!hasBuildings(state)) {
      state.stepsHistory.push("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
      return;
    }
    if (willBuildingsBeSold(state)) {
      state.stepsHistory.push("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
      return;
    }
    state.stepsHistory.push("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES");
  });

  builder.addCase(expectedSiteResaleRevenueCompleted, (state, action) => {
    state.urbanProject.creationData.siteResaleExpectedSellingPrice = action.payload.sellingPrice;
    state.urbanProject.creationData.siteResaleExpectedPropertyTransferDuties =
      action.payload.propertyTransferDuties;

    if (!hasBuildings(state)) {
      state.stepsHistory.push("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
      return;
    }
    if (willBuildingsBeSold(state)) {
      state.stepsHistory.push("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
      return;
    }
    state.stepsHistory.push("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES");
  });

  builder.addCase(buildingsResaleRevenueCompleted, (state, action) => {
    state.urbanProject.creationData.buildingsResaleSellingPrice = action.payload.sellingPrice;
    state.urbanProject.creationData.buildingsResalePropertyTransferDuties =
      action.payload.propertyTransferDuties;
    state.stepsHistory.push("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
  });

  builder.addCase(yearlyBuildingsOperationsRevenuesCompleted, (state, action) => {
    state.urbanProject.creationData.yearlyProjectedRevenues = action.payload;
    state.stepsHistory.push("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
  });
  builder.addCase(financialAssistanceRevenuesCompleted, (state, action) => {
    state.urbanProject.creationData.financialAssistanceRevenues = action.payload;

    if (!state.isReviewing) {
      state.stepsHistory.push("URBAN_PROJECT_SCHEDULE_INTRODUCTION");
    }
  });
  builder.addCase(scheduleIntroductionCompleted, (state) => {
    state.stepsHistory.push("URBAN_PROJECT_SCHEDULE_PROJECTION");
  });
  builder.addCase(scheduleCompleted, (state, action) => {
    const { firstYearOfOperation, installationSchedule, reinstatementSchedule } = action.payload;
    state.urbanProject.creationData.firstYearOfOperation = firstYearOfOperation;
    state.urbanProject.creationData.reinstatementSchedule = reinstatementSchedule;
    state.urbanProject.creationData.installationSchedule = installationSchedule;

    state.stepsHistory.push("URBAN_PROJECT_PROJECT_PHASE");
  });
  builder.addCase(projectPhaseCompleted, (state, action) => {
    state.urbanProject.creationData.projectPhase = action.payload;
    state.stepsHistory.push("URBAN_PROJECT_NAMING");
  });

  builder.addCase(namingCompleted, (state, action) => {
    const { name, description } = action.payload;
    state.urbanProject.creationData.name = name;
    if (description) state.urbanProject.creationData.description = description;

    state.stepsHistory.push("URBAN_PROJECT_FINAL_SUMMARY");
  });

  builder.addCase(customUrbanProjectSaved.pending, (state) => {
    state.urbanProject.saveState = "loading";
  });
  builder.addCase(customUrbanProjectSaved.fulfilled, (state) => {
    state.urbanProject.saveState = "success";
    state.stepsHistory.push("URBAN_PROJECT_CREATION_RESULT");
  });
  builder.addCase(customUrbanProjectSaved.rejected, (state) => {
    state.urbanProject.saveState = "error";
    state.stepsHistory.push("URBAN_PROJECT_CREATION_RESULT");
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
