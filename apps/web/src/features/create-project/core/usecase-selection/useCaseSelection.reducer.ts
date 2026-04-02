import { createReducer } from "@reduxjs/toolkit";
import { DevelopmentPlanCategory, DevelopmentPlanType, ProjectPhase } from "shared";

import { ProjectCreationState } from "../createProject.reducer";
import { ProjectSuggestion } from "../project.types";
import {
  createModeCompleted,
  developmentPlanCategoriesCompleted,
  projectPhaseCompleted,
  projectUseCaseSelectionStepGroupNavigated,
  renewableEnergyTypeCompleted,
  stepReverted,
} from "./useCaseSelection.actions";

export type UseCaseSelectionStep =
  | "USE_CASE_SELECTION_PROJECT_PHASE"
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
  projectPhase?: ProjectPhase;
  projectSuggestions?: ProjectSuggestion[];
};

const DEFAULT_INITIAL_STEP = "USE_CASE_SELECTION_PROJECT_PHASE";

export const USE_CASE_SELECTION_INITIAL_STATE: UseCaseSelectionState = {
  stepsSequence: [DEFAULT_INITIAL_STEP],
  currentStep: DEFAULT_INITIAL_STEP,
  creationMode: undefined,
  projectPhase: undefined,
  projectDevelopmentPlan: undefined,
  projectSuggestions: undefined,
};

const computeStepSequence = (
  state: ProjectCreationState["useCaseSelection"],
): UseCaseSelectionStep[] => {
  switch (state.projectPhase) {
    case "construction":
    case "design":
    case "completed":
    case "planning": {
      const base: UseCaseSelectionStep[] = [
        "USE_CASE_SELECTION_PROJECT_PHASE",
        "USE_CASE_SELECTION_PROJECT_TYPE_SELECTION",
      ];

      if (state.projectDevelopmentPlan?.category === "RENEWABLE_ENERGY") {
        base.push("USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE");
      }

      return base;
    }
    case "setup":
    case "unknown":
      const base: UseCaseSelectionStep[] = [
        "USE_CASE_SELECTION_PROJECT_PHASE",
        "USE_CASE_SELECTION_CREATION_MODE",
      ];

      if (state.creationMode === "custom") {
        base.push("USE_CASE_SELECTION_PROJECT_TYPE_SELECTION");
        if (state.projectDevelopmentPlan?.category === "RENEWABLE_ENERGY") {
          base.push("USE_CASE_SELECTION_RENEWABLE_ENERGY_TYPE");
        }
      }

      return base;
    default:
      return ["USE_CASE_SELECTION_PROJECT_PHASE"];
  }
};

const computeNextStep = (state: ProjectCreationState["useCaseSelection"]) => {
  const currentStepIndex = state.stepsSequence.indexOf(state.currentStep);
  return state.stepsSequence[currentStepIndex + 1] ?? state.currentStep;
};

export const useCaseSelectionProjectCreationReducer = createReducer(
  {} as ProjectCreationState,
  (builder) => {
    builder.addCase(projectPhaseCompleted, (state, action) => {
      state.useCaseSelection.projectPhase = action.payload;

      if (
        action.payload === "construction" ||
        action.payload === "design" ||
        action.payload === "completed" ||
        action.payload === "planning"
      ) {
        state.useCaseSelection.creationMode = "custom";
      }
      state.useCaseSelection.stepsSequence = computeStepSequence(state.useCaseSelection);
      state.useCaseSelection.currentStep = computeNextStep(state.useCaseSelection);
    });

    builder.addCase(createModeCompleted, (state, action) => {
      state.useCaseSelection.creationMode = action.payload;

      if (state.useCaseSelection.creationMode === "express") {
        state.currentProjectFlow = "DEMO";
      }

      state.useCaseSelection.stepsSequence = computeStepSequence(state.useCaseSelection);
      state.useCaseSelection.currentStep = computeNextStep(state.useCaseSelection);
    });

    builder.addCase(developmentPlanCategoriesCompleted, (state, action) => {
      state.useCaseSelection.projectDevelopmentPlan = {
        category: action.payload,
      };

      if (action.payload === "URBAN_PROJECT") {
        state.currentProjectFlow = "URBAN_PROJECT";
        state.useCaseSelection.projectDevelopmentPlan.type = action.payload;
      }

      state.useCaseSelection.stepsSequence = computeStepSequence(state.useCaseSelection);
      state.useCaseSelection.currentStep = computeNextStep(state.useCaseSelection);
    });

    builder.addCase(renewableEnergyTypeCompleted, (state, action) => {
      state.useCaseSelection.projectDevelopmentPlan = {
        category: "RENEWABLE_ENERGY",
        type:
          action.payload === "PHOTOVOLTAIC_POWER_PLANT" ? "PHOTOVOLTAIC_POWER_PLANT" : undefined,
      };
      state.currentProjectFlow = "PHOTOVOLTAIC_POWER_PLANT";
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

    builder.addCase(projectUseCaseSelectionStepGroupNavigated, (state, action) => {
      state.currentProjectFlow = "USE_CASE_SELECTION";
      state.useCaseSelection.currentStep = action.payload;
    });
  },
);
