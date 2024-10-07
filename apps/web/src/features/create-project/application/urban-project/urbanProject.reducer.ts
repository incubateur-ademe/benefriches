import { createReducer } from "@reduxjs/toolkit";
import { UrbanSpaceCategory } from "shared";
import { ProjectCreationState } from "../createProject.reducer";
import {
  createModeStepReverted,
  customCreateModeSelected,
  expressCreateModeSelected,
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
  | "SPACES_CATEGORIES_SURFACE_AREA";

export type UrbanProjectCreationStep =
  | "CREATE_MODE_SELECTION"
  | UrbanProjectExpressCreationStep
  | UrbanProjectCustomCreationStep;

export type UrbanProjectState = {
  createMode: "express" | "custom" | undefined;
  saveState: "idle" | "loading" | "success" | "error";
  stepsHistory: UrbanProjectCreationStep[];
  creationData: {
    spacesCategories?: UrbanSpaceCategory[];
    spacesCategoriesDistribution?: Partial<Record<UrbanSpaceCategory, number>>;
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
    state.urbanProject.stepsHistory.push("SPACES_CATEGORIES_SURFACE_AREA");
  });
  builder.addCase(spacesSelectionReverted, (state) => {
    state.urbanProject.creationData.spacesCategories = undefined;
  });
  builder.addCase(spacesSurfaceAreaCompleted, (state, action) => {
    state.urbanProject.creationData.spacesCategoriesDistribution =
      action.payload.surfaceAreaDistribution;
  });
  builder.addCase(spacesSurfaceAreaReverted, (state) => {
    state.urbanProject.creationData.spacesCategoriesDistribution = undefined;
  });

  builder.addMatcher(isRevertedAction, (state) => {
    if (state.urbanProject.stepsHistory.length === 1)
      state.urbanProject.stepsHistory = ["CREATE_MODE_SELECTION"];
    else state.urbanProject.stepsHistory.pop();
  });
});

export default urbanProjectReducer;
