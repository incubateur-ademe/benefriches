import { createReducer } from "@reduxjs/toolkit";
import {
  DevelopmentPlanCategory,
  DevelopmentPlanType,
  RenewableEnergyProjectPhase,
  UrbanProjectPhase,
} from "shared";

import { ProjectCreationState } from "../createProject.reducer";
import { ProjectSuggestion } from "../project.types";
import {
  createModeCompleted,
  developmentPlanCategoriesCompleted,
  renewableEnergyTypeCompleted,
  stepReverted,
} from "./useCaseSelection.actions";

export type UseCaseSelectionStep =
  | "USE_CASE_SELECTION_CREATION_MODE"
  | "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION"
  | "USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE";

export type UseCaseSelectionState = {
  stepsSequence: UseCaseSelectionStep[];
  currentStep: UseCaseSelectionStep;
  creationMode?: "express" | "custom";
  projectDevelopmentPlan?: {
    category: DevelopmentPlanCategory;
    type?: DevelopmentPlanType;
  };
  projectPhase?: UrbanProjectPhase | RenewableEnergyProjectPhase;
  projectSuggestions?: ProjectSuggestion[];
};

export const USE_CASE_SELECTION_INITIAL_STATE: UseCaseSelectionState = {
  stepsSequence: ["USE_CASE_SELECTION_CREATION_MODE"],
  currentStep: "USE_CASE_SELECTION_CREATION_MODE",
  creationMode: undefined,
  projectPhase: undefined,
  projectDevelopmentPlan: undefined,
  projectSuggestions: undefined,
};
export const useCaseSelectionProjectCreationReducer = createReducer(
  {} as ProjectCreationState,
  (builder) => {
    builder.addCase(developmentPlanCategoriesCompleted, (state, action) => {
      state.useCaseSelection.projectDevelopmentPlan = {
        category: action.payload,
      };

      switch (action.payload) {
        case "URBAN_PROJECT":
          state.currentStepGroup = "URBAN_PROJECT";
          state.useCaseSelection.projectDevelopmentPlan.type = action.payload;
          state.useCaseSelection.stepsSequence = [
            "USE_CASE_SELECTION_CREATION_MODE",
            "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
          ];
          break;
        case "RENEWABLE_ENERGY":
          state.useCaseSelection.currentStep = "USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE";
          state.useCaseSelection.stepsSequence = [
            "USE_CASE_SELECTION_CREATION_MODE",
            "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
            "USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE",
          ];
          break;
      }
    });
    builder.addCase(createModeCompleted, (state, action) => {
      state.useCaseSelection.creationMode = action.payload;
      if (state.useCaseSelection.creationMode === "custom") {
        state.useCaseSelection.currentStep = "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION";
        state.useCaseSelection.stepsSequence = [
          "USE_CASE_SELECTION_CREATION_MODE",
          "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
        ];
      } else {
        state.currentStepGroup = "DEMO";
        state.useCaseSelection.stepsSequence = ["USE_CASE_SELECTION_CREATION_MODE"];
      }
    });

    builder.addCase(renewableEnergyTypeCompleted, (state, action) => {
      state.useCaseSelection.projectDevelopmentPlan = {
        category: "RENEWABLE_ENERGY",
        type:
          action.payload === "PHOTOVOLTAIC_POWER_PLANT" ? "PHOTOVOLTAIC_POWER_PLANT" : undefined,
      };
      state.currentStepGroup = "PHOTOVOLTAIC_POWER_PLANT";
    });

    builder.addCase(stepReverted, (state) => {
      const currentStepIndex = state.useCaseSelection.stepsSequence.indexOf(
        state.useCaseSelection.currentStep,
      );
      const previousStep = state.useCaseSelection.stepsSequence[currentStepIndex - 1];

      if (previousStep) {
        state.useCaseSelection.currentStep = previousStep;
      }
    });
  },
);
