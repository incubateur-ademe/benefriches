import { createReducer, UnknownAction } from "@reduxjs/toolkit";
import {
  BuildingsUse,
  isBuildingUse,
  typedObjectEntries,
  UrbanGreenSpace,
  UrbanLivingAndActivitySpace,
  UrbanPublicSpace,
  UrbanSpaceCategory,
} from "shared";

import { BuildingsUseCategory } from "../../domain/urbanProject";
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
} from "./urbanProject.actions";

export type UrbanProjectExpressCreationStep = "CREATION_RESULT";
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
  | "BUILDINGS_EQUIPMENT_INTRODUCTION"
  | "BUILDINGS_EQUIPMENT_SELECTION";

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
  builder.addCase(expressCreateModeSelected.pending, (state) => {
    state.urbanProject.createMode = "express";
    state.urbanProject.saveState = "loading";
    state.urbanProject.stepsHistory.push("CREATION_RESULT");
  });
  builder.addCase(expressCreateModeSelected.rejected, (state) => {
    state.urbanProject.saveState = "error";
  });
  builder.addCase(expressCreateModeSelected.fulfilled, (state) => {
    state.urbanProject.saveState = "success";
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
    state.urbanProject.spacesCategoriesToComplete = action.payload.spacesCategories;
    state.urbanProject.stepsHistory.push("SPACES_CATEGORIES_SURFACE_AREA");
  });
  builder.addCase(spacesSelectionReverted, (state) => {
    state.urbanProject.creationData.spacesCategories = undefined;
  });
  builder.addCase(spacesSurfaceAreaCompleted, (state, action) => {
    state.urbanProject.creationData.spacesCategoriesDistribution =
      action.payload.surfaceAreaDistribution;
    state.urbanProject.stepsHistory.push("SPACES_DEVELOPMENT_PLAN_INTRODUCTION");
  });
  builder.addCase(spacesSurfaceAreaReverted, (state) => {
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
    state.urbanProject.stepsHistory.push("GREEN_SPACES_SURFACE_AREA_DISTRIBUTION");
  });
  builder.addCase(greenSpacesSelectionReverted, (state) => {
    state.urbanProject.creationData.greenSpaces = undefined;
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
    state.urbanProject.stepsHistory.push("LIVING_AND_ACTIVITY_SPACES_DISTRIBUTION");
  });
  builder.addCase(livingAndActivitySpacesSelectionReverted, (state) => {
    state.urbanProject.creationData.livingAndActivitySpaces = undefined;
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
    state.urbanProject.stepsHistory.push("PUBLIC_SPACES_DISTRIBUTION");
  });
  builder.addCase(publicSpacesSelectionReverted, (state) => {
    state.urbanProject.creationData.publicSpaces = undefined;
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

    state.urbanProject.stepsHistory.push("BUILDINGS_USE_SURFACE_AREA");
  });
  builder.addCase(buildingsUseCategorySelectionReverted, (state) => {
    state.urbanProject.creationData.buildingsUses = undefined;
    state.urbanProject.creationData.buildingsUseCategories = undefined;
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
      : "BUILDINGS_EQUIPMENT_INTRODUCTION";
    state.urbanProject.stepsHistory.push(nextStep);
  });
  builder.addCase(buildingsUseCategorySurfaceAreasReverted, (state) => {
    state.urbanProject.creationData.buildingsUsesDistribution = undefined;
    state.urbanProject.creationData.buildingsUseCategoriesDistribution = undefined;
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
