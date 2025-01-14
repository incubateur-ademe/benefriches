import { createReducer, UnknownAction } from "@reduxjs/toolkit";
import {
  BuildingsUse,
  isBuildingUse,
  typedObjectEntries,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanPublicSpace,
  UrbanSpaceCategory,
  filterObjectWithoutKeys,
  FinancialAssistanceRevenue,
  RecurringRevenue,
  RecurringExpense,
  ReinstatementExpense,
  UrbanProjectDevelopmentExpense,
  UrbanProjectPhase,
  ECONOMIC_ACTIVITY_BUILDINGS_USE,
  BuildingsEconomicActivityUse,
} from "shared";

import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

import { ProjectCreationState } from "../createProject.reducer";
import { ProjectStakeholder } from "../project.types";
import { saveReconversionProject } from "./actions/saveReconversionProject.action";
import {
  buildingsFloorSurfaceAreaCompleted,
  buildingsFloorSurfaceAreaReverted,
  buildingsIntroductionCompleted,
  buildingsUseIntroductionCompleted,
  buildingsUseCategorySurfaceAreasCompleted,
  buildingsUseCategorySurfaceAreasReverted,
  createModeStepReverted,
  customCreateModeSelected,
  expressCategorySelected,
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
  buildingsEconomicActivitySurfaceAreasCompleted,
  buildingsEconomicActivitySurfaceAreasReverted,
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
  yearlyProjectedExpensesCompleted,
  yearlyProjectedExpensesReverted,
  revenueIntroductionCompleted,
  yearlyProjectedRevenueCompleted,
  yearlyProjectedRevenueReverted,
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
} from "./actions/urbanProject.actions";
import soilsCarbonStorageReducer, {
  State as SoilsCarbonStorageState,
} from "./soilsCarbonStorage.reducer";
import { BuildingsUseCategory } from "./urbanProject";

export type UrbanProjectExpressCreationStep = "EXPRESS_CATEGORY_SELECTION" | "CREATION_RESULT";
export type UrbanProjectCustomCreationStep =
  | "SPACES_CATEGORIES_INTRODUCTION"
  | "SPACES_CATEGORIES_SELECTION"
  | "SPACES_CATEGORIES_SURFACE_AREA"
  | "SPACES_DEVELOPMENT_PLAN_INTRODUCTION"
  | "GREEN_SPACES_INTRODUCTION"
  | "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"
  | "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION"
  | "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION"
  | "PUBLIC_SPACES_INTRODUCTION"
  | "PUBLIC_SPACES_DISTRIBUTION"
  | "SPACES_SOILS_SUMMARY"
  | "SOILS_CARBON_SUMMARY"
  | "SOILS_DECONTAMINATION_INTRODUCTION"
  | "SOILS_DECONTAMINATION_SELECTION"
  | "SOILS_DECONTAMINATION_SURFACE_AREA"
  | "BUILDINGS_INTRODUCTION"
  | "BUILDINGS_FLOOR_SURFACE_AREA"
  | "BUILDINGS_USE_INTRODUCTION"
  | "BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION"
  | "BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA"
  | "BUILDINGS_EQUIPMENT_INTRODUCTION"
  | "BUILDINGS_EQUIPMENT_SELECTION"
  | "STAKEHOLDERS_INTRODUCTION"
  | "STAKEHOLDERS_PROJECT_DEVELOPER"
  | "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
  | "EXPENSES_INTRODUCTION"
  | "EXPENSES_SITE_PURCHASE_AMOUNTS"
  | "EXPENSES_REINSTATEMENT"
  | "EXPENSES_INSTALLATION"
  | "EXPENSES_PROJECTED_YEARLY_EXPENSES"
  | "REVENUE_INTRODUCTION"
  | "REVENUE_EXPECTED_SITE_RESALE"
  | "REVENUE_PROJECTED_YEARLY_REVENUE"
  | "REVENUE_FINANCIAL_ASSISTANCE"
  | "SCHEDULE_INTRODUCTION"
  | "SCHEDULE_PROJECTION"
  | "NAMING"
  | "PROJECT_PHASE"
  | "FINAL_SUMMARY"
  | "CREATION_RESULT";

const urbanSpaceCategoryIntroductionMap = {
  GREEN_SPACES: "GREEN_SPACES_INTRODUCTION",
  LIVING_AND_ACTIVITY_SPACES: "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION",
  PUBLIC_SPACES: "PUBLIC_SPACES_INTRODUCTION",
  URBAN_FARM: undefined,
  RENEWABLE_ENERGY_PRODUCTION_PLANT: undefined,
  URBAN_POND_OR_LAKE: undefined,
} as const satisfies Record<UrbanSpaceCategory, UrbanProjectCustomCreationStep | undefined>;

export type UrbanProjectCreationStep =
  | "CREATE_MODE_SELECTION"
  | UrbanProjectExpressCreationStep
  | UrbanProjectCustomCreationStep;

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
  creationData: {
    name?: string;
    description?: string;
    // spaces and surfaces
    spacesCategories?: UrbanSpaceCategory[];
    spacesCategoriesDistribution?: Partial<Record<UrbanSpaceCategory, number>>;
    greenSpacesDistribution?: Partial<Record<UrbanGreenSpace, number>>;
    livingAndActivitySpacesDistribution?: Partial<Record<UrbanLivingAndActivitySpace, number>>;
    publicSpacesDistribution?: Partial<Record<UrbanPublicSpace, number>>;
    decontaminationNeeded?: "partial" | "none" | "unknown";
    decontaminatedSurfaceArea?: number;
    // buildings
    buildingsFloorSurfaceArea?: number;
    buildingsUseCategoriesDistribution?: Partial<Record<BuildingsUseCategory, number>>;
    buildingsUsesDistribution?: Partial<Record<BuildingsUse, number>>;
    buildingsEconomicActivityUses?: BuildingsEconomicActivityUse[];
    // cession foncière
    // TODO : question à poser dans Cession foncière
    projectDevoloperOwnsBuildings?: boolean;
    // stakeholders
    projectDeveloper?: ProjectStakeholder;
    reinstatementContractOwner?: ProjectStakeholder;
    // site purchase
    sitePurchaseSellingPrice?: number;
    sitePurchasePropertyTransferDuties?: number;
    // expenses
    reinstatementExpenses?: ReinstatementExpense[];
    installationExpenses?: UrbanProjectDevelopmentExpense[];
    yearlyProjectedExpenses?: RecurringExpense[];
    // revenues
    yearlyProjectedRevenues?: RecurringRevenue[];
    financialAssistanceRevenues?: FinancialAssistanceRevenue[];
    siteResaleExpectedSellingPrice?: number;
    siteResaleExpectedPropertyTransferDuties?: number;
    // schedules
    reinstatementSchedule?: {
      startDate: string;
      endDate: string;
    };
    installationSchedule?: {
      startDate: string;
      endDate: string;
    };
    firstYearOfOperation?: number;
    // project phase
    projectPhase?: UrbanProjectPhase;
  };
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

const hasBuildingsOperations = (state: ProjectCreationState) => {
  return hasBuildings(state) && state.urbanProject.creationData.projectDevoloperOwnsBuildings;
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
  builder.addCase(expressCategorySelected.pending, (state, action) => {
    state.urbanProject.saveState = "loading";
    state.urbanProject.expressData.category = action.payload;
    state.urbanProject.stepsHistory.push("CREATION_RESULT");
  });
  builder.addCase(expressCategorySelected.rejected, (state) => {
    state.urbanProject.saveState = "error";
  });
  builder.addCase(expressCategorySelected.fulfilled, (state, action) => {
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

    state.urbanProject.creationData.decontaminationNeeded = action.payload;
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
  builder.addCase(buildingsUseCategorySurfaceAreasCompleted, (state, action) => {
    state.urbanProject.creationData.buildingsUseCategoriesDistribution = action.payload;

    state.urbanProject.creationData.buildingsUsesDistribution = typedObjectEntries(
      action.payload,
    ).reduce<Partial<Record<BuildingsUse, number>>>((acc, [category, surfaceArea]) => {
      if (isBuildingUse(category) && surfaceArea) acc[category] = surfaceArea;
      return acc;
    }, {});

    const nextStep = action.payload.ECONOMIC_ACTIVITY
      ? "BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA"
      : "STAKEHOLDERS_INTRODUCTION";
    state.urbanProject.stepsHistory.push(nextStep);
  });
  builder.addCase(buildingsUseCategorySurfaceAreasReverted, (state) => {
    state.urbanProject.creationData.buildingsUsesDistribution = undefined;
    state.urbanProject.creationData.buildingsUseCategoriesDistribution = undefined;
  });

  builder.addCase(buildingsEconomicActivitySurfaceAreasReverted, (state) => {
    if (state.urbanProject.creationData.buildingsUsesDistribution) {
      state.urbanProject.creationData.buildingsUsesDistribution = filterObjectWithoutKeys(
        state.urbanProject.creationData.buildingsUsesDistribution,
        [...ECONOMIC_ACTIVITY_BUILDINGS_USE],
      );
    }
  });
  builder.addCase(buildingsEconomicActivitySurfaceAreasCompleted, (state, action) => {
    state.urbanProject.creationData.buildingsUsesDistribution = {
      ...state.urbanProject.creationData.buildingsUsesDistribution,
      ...action.payload,
    };

    state.urbanProject.stepsHistory.push("STAKEHOLDERS_INTRODUCTION");
  });

  builder.addCase(stakeholderIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("STAKEHOLDERS_PROJECT_DEVELOPER");
  });
  builder.addCase(stakeholderProjectDeveloperCompleted, (state, action) => {
    state.urbanProject.creationData.projectDeveloper = action.payload;
    state.urbanProject.stepsHistory.push(
      state.siteData?.isFriche
        ? "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"
        : "EXPENSES_INTRODUCTION",
    );
  });
  builder.addCase(stakeholderProjectDeveloperReverted, (state) => {
    state.urbanProject.creationData.projectDeveloper = undefined;
  });
  builder.addCase(stakeholderReinstatementContractOwnerCompleted, (state, action) => {
    state.urbanProject.creationData.reinstatementContractOwner = action.payload;
    state.urbanProject.stepsHistory.push("EXPENSES_INTRODUCTION");
  });
  builder.addCase(stakeholderReinstatementContractOwnerReverted, (state) => {
    state.urbanProject.creationData.reinstatementContractOwner = undefined;
  });

  // costs
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
    state.urbanProject.stepsHistory.push(
      hasBuildingsOperations(state) ? "EXPENSES_PROJECTED_YEARLY_EXPENSES" : "REVENUE_INTRODUCTION",
    );
  });
  builder.addCase(installationExpensesReverted, (state) => {
    state.urbanProject.creationData.installationExpenses = undefined;
  });

  builder.addCase(yearlyProjectedExpensesCompleted, (state, action) => {
    state.urbanProject.creationData.yearlyProjectedExpenses = action.payload;
    state.urbanProject.stepsHistory.push("REVENUE_INTRODUCTION");
  });
  builder.addCase(yearlyProjectedExpensesReverted, (state) => {
    state.urbanProject.creationData.yearlyProjectedExpenses = undefined;
  });

  // revenues
  builder.addCase(revenueIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("REVENUE_EXPECTED_SITE_RESALE");
  });

  builder.addCase(expectedSiteResaleRevenueCompleted, (state, action) => {
    state.urbanProject.creationData.siteResaleExpectedSellingPrice = action.payload.sellingPrice;
    state.urbanProject.creationData.siteResaleExpectedPropertyTransferDuties =
      action.payload.propertyTransferDuties;
    state.urbanProject.stepsHistory.push(
      hasBuildingsOperations(state)
        ? "REVENUE_PROJECTED_YEARLY_REVENUE"
        : "REVENUE_FINANCIAL_ASSISTANCE",
    );
  });
  builder.addCase(expectedSiteResaleRevenueReverted, (state) => {
    state.urbanProject.creationData.siteResaleExpectedSellingPrice = undefined;
    state.urbanProject.creationData.siteResaleExpectedPropertyTransferDuties = undefined;
  });

  builder.addCase(yearlyProjectedRevenueCompleted, (state, action) => {
    state.urbanProject.creationData.yearlyProjectedRevenues = action.payload;
    state.urbanProject.stepsHistory.push("REVENUE_FINANCIAL_ASSISTANCE");
  });
  builder.addCase(yearlyProjectedRevenueReverted, (state) => {
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

  builder.addCase(saveReconversionProject.pending, (state) => {
    state.urbanProject.saveState = "loading";
  });
  builder.addCase(saveReconversionProject.fulfilled, (state) => {
    state.urbanProject.saveState = "success";
    state.urbanProject.stepsHistory.push("CREATION_RESULT");
  });
  builder.addCase(saveReconversionProject.rejected, (state) => {
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
