import { createReducer } from "@reduxjs/toolkit";
import { UrbanGreenSpace, UrbanLivingAndActivitySpace, UrbanSpaceCategory } from "shared";

import { ProjectCreationState } from "../createProject.reducer";
import {
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
  | "SPACES_DEVELOPMENT_PLAN_SUMMARY";

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
  };
};

const isRevertedAction = (action: { type: string }) => {
  return (
    action.type.startsWith("projectCreation/urbanProject/") && action.type.endsWith("Reverted")
  );
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
      state.urbanProject.stepsHistory.push("SPACES_DEVELOPMENT_PLAN_SUMMARY");
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
      state.urbanProject.stepsHistory.push("SPACES_DEVELOPMENT_PLAN_SUMMARY");
    }
  });
  builder.addCase(livingAndActivitySpacesDistributionReverted, (state) => {
    state.urbanProject.creationData.livingAndActivitySpacesDistribution = undefined;
  });

  builder.addMatcher(isRevertedAction, (state) => {
    if (state.urbanProject.stepsHistory.length === 1)
      state.urbanProject.stepsHistory = ["CREATE_MODE_SELECTION"];
    else state.urbanProject.stepsHistory.pop();
  });
});

export default urbanProjectReducer;
