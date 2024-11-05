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
} from "shared";

import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

import { ProjectStakeholder } from "../../domain/project.types";
import {
  BuildingsUseCategory,
  BuildingsEconomicActivityUse,
  ECONOMIC_ACTIVITY_BUILDINGS_USE,
  isBuildingEconomicActivityUse,
} from "../../domain/urbanProject";
import { ProjectCreationState } from "../createProject.reducer";
import soilsCarbonStorageReducer, {
  State as SoilsCarbonStorageState,
} from "./soilsCarbonStorage.reducer";
import {
  buildingsFloorSurfaceAreaCompleted,
  buildingsFloorSurfaceAreaReverted,
  buildingsIntroductionCompleted,
  buildingsUseIntroductionCompleted,
  buildingsUseCategorySelectionCompleted,
  buildingsUseCategorySelectionReverted,
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
  greenSpacesSelectionCompleted,
  greenSpacesSelectionReverted,
  livingAndActivitySpacesDistributionCompleted,
  livingAndActivitySpacesDistributionReverted,
  livingAndActivitySpacesIntroductionCompleted,
  livingAndActivitySpacesIntroductionReverted,
  livingAndActivitySpacesSelectionCompleted,
  livingAndActivitySpacesSelectionReverted,
  publicSpacesDistributionCompleted,
  publicSpacesDistributionReverted,
  publicSpacesIntroductionCompleted,
  publicSpacesIntroductionReverted,
  publicSpacesSelectionCompleted,
  publicSpacesSelectionReverted,
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
  buildingsEconomicActivitySelectionCompleted,
  buildingsEconomicActivitySelectionReverted,
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
} from "./urbanProject.actions";

export type UrbanProjectExpressCreationStep = "EXPRESS_CATEGORY_SELECTION" | "CREATION_RESULT";
export type UrbanProjectCustomCreationStep =
  | "SPACES_CATEGORIES_INTRODUCTION"
  | "SPACES_CATEGORIES_SELECTION"
  | "SPACES_CATEGORIES_SURFACE_AREA"
  | "SPACES_DEVELOPMENT_PLAN_INTRODUCTION"
  | "GREEN_SPACES_INTRODUCTION"
  | "GREEN_SPACES_SELECTION"
  | "GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"
  | "LIVING_AND_ACTIVITY_SPACES_INTRODUCTION"
  | "LIVING_AND_ACTIVITY_SPACES_SELECTION"
  | "LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION"
  | "PUBLIC_SPACES_INTRODUCTION"
  | "PUBLIC_SPACES_SELECTION"
  | "PUBLIC_SPACES_DISTRIBUTION"
  | "SPACES_SOILS_SUMMARY"
  | "SOILS_CARBON_SUMMARY"
  | "SOILS_DECONTAMINATION_INTRODUCTION"
  | "SOILS_DECONTAMINATION_SELECTION"
  | "SOILS_DECONTAMINATION_SURFACE_AREA"
  | "BUILDINGS_INTRODUCTION"
  | "BUILDINGS_FLOOR_SURFACE_AREA"
  | "BUILDINGS_USE_INTRODUCTION"
  | "BUILDINGS_USE_SELECTION"
  | "BUILDINGS_USE_SURFACE_AREA"
  | "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION"
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
  | "REVENUE_PROJECTED_YEARLY_REVENUE"
  | "REVENUE_FINANCIAL_ASSISTANCE"
  | "FINAL_SUMMARY";

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
    spacesCategories?: UrbanSpaceCategory[];
    spacesCategoriesDistribution?: Partial<Record<UrbanSpaceCategory, number>>;
    greenSpaces?: UrbanGreenSpace[];
    greenSpacesDistribution?: Partial<Record<UrbanGreenSpace, number>>;
    livingAndActivitySpaces?: UrbanLivingAndActivitySpace[];
    livingAndActivitySpacesDistribution?: Partial<Record<UrbanLivingAndActivitySpace, number>>;
    publicSpaces?: UrbanPublicSpace[];
    publicSpacesDistribution?: Partial<Record<UrbanPublicSpace, number>>;
    decontaminatedSurfaceArea?: number;
    buildingsFloorSurfaceArea?: number;
    buildingsUseCategories?: BuildingsUseCategory[];
    buildingsUses?: BuildingsUse[];
    buildingsUseCategoriesDistribution?: Partial<Record<BuildingsUseCategory, number>>;
    buildingsUsesDistribution?: Partial<Record<BuildingsUse, number>>;
    buildingsEconomicActivityUses?: BuildingsEconomicActivityUse[];
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
    state.urbanProject.stepsHistory.push("GREEN_SPACES_SELECTION");
  });
  builder.addCase(greenSpacesIntroductionReverted, (state) => {
    state.urbanProject.spacesCategoriesToComplete.unshift("GREEN_SPACES");
  });
  builder.addCase(greenSpacesSelectionCompleted, (state, action) => {
    state.urbanProject.creationData.greenSpaces = action.payload.greenSpaces;

    if (action.payload.greenSpaces.length === 1) {
      const [spaceCategory] = action.payload.greenSpaces;
      state.urbanProject.creationData.greenSpacesDistribution = {
        [spaceCategory as UrbanGreenSpace]:
          state.urbanProject.creationData.spacesCategoriesDistribution?.GREEN_SPACES,
      };
      const nextCategory = state.urbanProject.spacesCategoriesToComplete.shift();
      const nextStep = nextCategory && urbanSpaceCategoryIntroductionMap[nextCategory];
      state.urbanProject.stepsHistory.push(nextStep ?? "SPACES_SOILS_SUMMARY");
      return;
    }

    state.urbanProject.stepsHistory.push("GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
  });
  builder.addCase(greenSpacesSelectionReverted, (state) => {
    state.urbanProject.creationData.greenSpaces = undefined;
    state.urbanProject.creationData.greenSpacesDistribution = undefined;
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
    state.urbanProject.stepsHistory.push("LIVING_AND_ACTIVITY_SPACES_SELECTION");
  });
  builder.addCase(livingAndActivitySpacesIntroductionReverted, (state) => {
    state.urbanProject.spacesCategoriesToComplete.unshift("LIVING_AND_ACTIVITY_SPACES");
  });
  builder.addCase(livingAndActivitySpacesSelectionCompleted, (state, action) => {
    state.urbanProject.creationData.livingAndActivitySpaces = action.payload;

    if (action.payload.length === 1) {
      const [livingOrActivitySpace] = action.payload;

      state.urbanProject.creationData.livingAndActivitySpacesDistribution = {
        [livingOrActivitySpace as UrbanLivingAndActivitySpace]:
          state.urbanProject.creationData.spacesCategoriesDistribution?.LIVING_AND_ACTIVITY_SPACES,
      };

      const nextCategory = state.urbanProject.spacesCategoriesToComplete.shift();
      const nextStep = nextCategory && urbanSpaceCategoryIntroductionMap[nextCategory];
      state.urbanProject.stepsHistory.push(nextStep ?? "SPACES_SOILS_SUMMARY");
      return;
    }

    state.urbanProject.stepsHistory.push("LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION");
  });
  builder.addCase(livingAndActivitySpacesSelectionReverted, (state) => {
    state.urbanProject.creationData.livingAndActivitySpaces = undefined;
    state.urbanProject.creationData.livingAndActivitySpacesDistribution = undefined;
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
    state.urbanProject.stepsHistory.push("PUBLIC_SPACES_SELECTION");
  });
  builder.addCase(publicSpacesIntroductionReverted, (state) => {
    state.urbanProject.spacesCategoriesToComplete.unshift("PUBLIC_SPACES");
  });
  builder.addCase(publicSpacesSelectionCompleted, (state, action) => {
    state.urbanProject.creationData.publicSpaces = action.payload;

    if (action.payload.length === 1) {
      const [publicSpace] = action.payload;
      state.urbanProject.creationData.publicSpacesDistribution = {
        [publicSpace as UrbanPublicSpace]:
          state.urbanProject.creationData.spacesCategoriesDistribution?.PUBLIC_SPACES,
      };
      const nextCategory = state.urbanProject.spacesCategoriesToComplete.shift();
      const nextStep = nextCategory && urbanSpaceCategoryIntroductionMap[nextCategory];
      state.urbanProject.stepsHistory.push(nextStep ?? "SPACES_SOILS_SUMMARY");
      return;
    }

    state.urbanProject.stepsHistory.push("PUBLIC_SPACES_DISTRIBUTION");
  });
  builder.addCase(publicSpacesSelectionReverted, (state) => {
    state.urbanProject.creationData.publicSpaces = undefined;
    state.urbanProject.creationData.publicSpacesDistribution = undefined;
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
    const nextStep = state.siteData?.contaminatedSoilSurface
      ? "SOILS_DECONTAMINATION_INTRODUCTION"
      : "BUILDINGS_INTRODUCTION";
    state.urbanProject.stepsHistory.push(nextStep);
  });
  builder.addCase(soilsDecontaminationIntroductionCompleted, (state) => {
    state.urbanProject.stepsHistory.push("SOILS_DECONTAMINATION_SELECTION");
  });
  builder.addCase(soilsDecontaminationSelectionCompleted, (state, action) => {
    switch (action.payload) {
      case "all":
        state.urbanProject.creationData.decontaminatedSurfaceArea =
          state.siteData?.contaminatedSoilSurface ?? 0;
        state.urbanProject.stepsHistory.push("BUILDINGS_INTRODUCTION");
        break;
      case "partial":
        state.urbanProject.stepsHistory.push("SOILS_DECONTAMINATION_SURFACE_AREA");
        break;
      case "none":
        state.urbanProject.creationData.decontaminatedSurfaceArea = 0;
        state.urbanProject.stepsHistory.push("BUILDINGS_INTRODUCTION");
        break;
      case "unknown":
        state.urbanProject.stepsHistory.push("BUILDINGS_INTRODUCTION");
    }
  });
  builder.addCase(soilsDecontaminationSelectionReverted, (state) => {
    if (state.urbanProject.creationData.decontaminatedSurfaceArea)
      state.urbanProject.creationData.decontaminatedSurfaceArea = undefined;
  });
  builder.addCase(soilsDecontaminationSurfaceAreaCompleted, (state, action) => {
    state.urbanProject.stepsHistory.push("BUILDINGS_INTRODUCTION");
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
    state.urbanProject.stepsHistory.push("BUILDINGS_USE_SELECTION");
  });
  builder.addCase(buildingsUseCategorySelectionCompleted, (state, action) => {
    state.urbanProject.creationData.buildingsUseCategories = action.payload;
    const buildingsUses = action.payload.filter((useCategory) => isBuildingUse(useCategory));
    if (buildingsUses.length > 0) {
      state.urbanProject.creationData.buildingsUses = buildingsUses;
    }

    if (action.payload.length === 1) {
      const [buildingsUseCategory] = action.payload;
      state.urbanProject.creationData.buildingsUseCategoriesDistribution = {
        [buildingsUseCategory as BuildingsUseCategory]:
          state.urbanProject.creationData.buildingsFloorSurfaceArea,
      };

      if (buildingsUses.length > 0) {
        state.urbanProject.creationData.buildingsUsesDistribution = {
          [buildingsUses[0] as BuildingsUse]:
            state.urbanProject.creationData.buildingsFloorSurfaceArea,
        };
      }

      const nextStep = action.payload.includes("ECONOMIC_ACTIVITY")
        ? "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION"
        : "STAKEHOLDERS_INTRODUCTION";
      state.urbanProject.stepsHistory.push(nextStep);
      return;
    }

    state.urbanProject.stepsHistory.push("BUILDINGS_USE_SURFACE_AREA");
  });
  builder.addCase(buildingsUseCategorySelectionReverted, (state) => {
    state.urbanProject.creationData.buildingsUses = undefined;
    state.urbanProject.creationData.buildingsUseCategories = undefined;
    state.urbanProject.creationData.buildingsUsesDistribution = undefined;
    state.urbanProject.creationData.buildingsUseCategoriesDistribution = undefined;
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
      ? "BUILDINGS_ECONOMIC_ACTIVITY_SELECTION"
      : "STAKEHOLDERS_INTRODUCTION";
    state.urbanProject.stepsHistory.push(nextStep);
  });
  builder.addCase(buildingsUseCategorySurfaceAreasReverted, (state) => {
    state.urbanProject.creationData.buildingsUsesDistribution = undefined;
    state.urbanProject.creationData.buildingsUseCategoriesDistribution = undefined;
  });

  builder.addCase(buildingsEconomicActivitySelectionReverted, (state) => {
    if (state.urbanProject.creationData.buildingsUses) {
      state.urbanProject.creationData.buildingsUses =
        state.urbanProject.creationData.buildingsUses.filter(
          (buildingUse) => !isBuildingEconomicActivityUse(buildingUse),
        );
    }
    if (state.urbanProject.creationData.buildingsUsesDistribution) {
      state.urbanProject.creationData.buildingsUsesDistribution = filterObjectWithoutKeys(
        state.urbanProject.creationData.buildingsUsesDistribution,
        [...ECONOMIC_ACTIVITY_BUILDINGS_USE],
      );
    }

    state.urbanProject.creationData.buildingsEconomicActivityUses = undefined;
  });
  builder.addCase(buildingsEconomicActivitySelectionCompleted, (state, action) => {
    state.urbanProject.creationData.buildingsEconomicActivityUses = action.payload;

    if (!state.urbanProject.creationData.buildingsUses) {
      state.urbanProject.creationData.buildingsUses = [];
    }
    state.urbanProject.creationData.buildingsUses = [
      ...state.urbanProject.creationData.buildingsUses,
      ...action.payload,
    ];

    if (action.payload.length === 1) {
      const economicActivityCategory = action.payload[0] as BuildingsUse;

      state.urbanProject.creationData.buildingsUsesDistribution = {
        ...state.urbanProject.creationData.buildingsUsesDistribution,
        [economicActivityCategory]:
          state.urbanProject.creationData.buildingsUseCategoriesDistribution?.ECONOMIC_ACTIVITY,
      };
      state.urbanProject.stepsHistory.push("STAKEHOLDERS_INTRODUCTION");
      return;
    }
    state.urbanProject.stepsHistory.push("BUILDINGS_ECONOMIC_ACTIVITY_SURFACE_AREA");
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
      state.siteData?.isFriche ? "STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER" : "FINAL_SUMMARY",
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
    state.urbanProject.stepsHistory.push("EXPENSES_PROJECTED_YEARLY_EXPENSES");
  });
  builder.addCase(installationExpensesReverted, (state) => {
    state.urbanProject.creationData.installationExpenses = undefined;
  });

  builder.addCase(yearlyProjectedExpensesCompleted, (state, action) => {
    state.urbanProject.creationData.yearlyProjectedExpenses = action.payload;
    state.urbanProject.stepsHistory.push("FINAL_SUMMARY");
  });
  builder.addCase(yearlyProjectedExpensesReverted, (state) => {
    state.urbanProject.creationData.yearlyProjectedExpenses = undefined;
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
