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
} from "./mixedUseNeighbourhoodProject.actions";

export type MixedUseNeighbourhoodExpressCreationStep = "CREATION_RESULT";
export type UrbanProjectCustomCreationStep =
  | "SPACES_CATEGORIES_INTRODUCTION"
  | "SPACES_CATEGORIES_SELECTION"
  | "SPACES_CATEGORIES_SURFACE_AREA";

export type UrbanProjectCreationStep =
  | "CREATE_MODE_SELECTION"
  | MixedUseNeighbourhoodExpressCreationStep
  | UrbanProjectCustomCreationStep;

export type MixedUseNeighbourhoodState = {
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
    action.type.startsWith("projectCreation/mixedUseNeighbourhood/") &&
    action.type.endsWith("Reverted")
  );
};

const mixedUseNeighbourhoodReducer = createReducer({} as ProjectCreationState, (builder) => {
  builder.addCase(createModeStepReverted, (state) => {
    state.mixedUseNeighbourhood.createMode = undefined;
  });
  builder.addCase(expressCreateModeSelected.pending, (state) => {
    state.mixedUseNeighbourhood.createMode = "express";
    state.mixedUseNeighbourhood.saveState = "loading";
    state.mixedUseNeighbourhood.stepsHistory.push("CREATION_RESULT");
  });
  builder.addCase(expressCreateModeSelected.rejected, (state) => {
    state.mixedUseNeighbourhood.saveState = "error";
  });
  builder.addCase(expressCreateModeSelected.fulfilled, (state) => {
    state.mixedUseNeighbourhood.saveState = "success";
  });

  builder.addCase(customCreateModeSelected, (state) => {
    state.mixedUseNeighbourhood.createMode = "custom";
    state.mixedUseNeighbourhood.stepsHistory.push("SPACES_CATEGORIES_INTRODUCTION");
  });
  builder.addCase(spacesIntroductionCompleted, (state) => {
    state.mixedUseNeighbourhood.stepsHistory.push("SPACES_CATEGORIES_SELECTION");
  });
  builder.addCase(spacesIntroductionReverted, (state) => {
    state.mixedUseNeighbourhood.createMode = undefined;
  });
  builder.addCase(spacesSelectionCompleted, (state, action) => {
    state.mixedUseNeighbourhood.creationData.spacesCategories = action.payload.spacesCategories;
    state.mixedUseNeighbourhood.stepsHistory.push("SPACES_CATEGORIES_SURFACE_AREA");
  });
  builder.addCase(spacesSelectionReverted, (state) => {
    state.mixedUseNeighbourhood.creationData.spacesCategories = undefined;
  });
  builder.addCase(spacesSurfaceAreaCompleted, (state, action) => {
    state.mixedUseNeighbourhood.creationData.spacesCategoriesDistribution =
      action.payload.surfaceAreaDistribution;
  });
  builder.addCase(spacesSurfaceAreaReverted, (state) => {
    state.mixedUseNeighbourhood.creationData.spacesCategoriesDistribution = undefined;
  });

  builder.addMatcher(isRevertedAction, (state) => {
    if (state.mixedUseNeighbourhood.stepsHistory.length === 1)
      state.mixedUseNeighbourhood.stepsHistory = ["CREATE_MODE_SELECTION"];
    else state.mixedUseNeighbourhood.stepsHistory.pop();
  });
});

export default mixedUseNeighbourhoodReducer;
