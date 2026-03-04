import { ActionReducerMapBuilder, createReducer } from "@reduxjs/toolkit";

import { RenewableEnergyDevelopmentPlanType } from "@/shared/core/reconversionProject";

import { SoilsCarbonStorageResult } from "../../../../shared/core/reducers/project-form/soilsCarbonStorage.action";
import { stepReverted } from "../actions/actionsUtils";
import { ExpressReconversionProjectResult } from "../actions/expressProjectSavedGateway";
import { projectSuggestionsCompleted } from "../actions/projectSuggestionCompleted.action";
import { ProjectCreationState } from "../createProject.reducer";
import { saveReconversionProject } from "./actions/customProjectSaved.action";
import {
  expressPhotovoltaicProjectCreated,
  expressPhotovoltaicProjectSaved,
} from "./actions/expressProjectSaved.action";
import { fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation } from "./actions/getPhotovoltaicExpectedPerformance.action";
import {
  completeRenewableEnergyType,
  customCreateModeSelected,
} from "./actions/renewableEnergy.actions";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "./actions/soilsCarbonStorage.actions";
import { applyStepChanges, computeStepChanges } from "./helpers/completeStep";
import { navigateToAndLoadStep } from "./helpers/navigateToStep";
import { computeStepsSequence } from "./helpers/stepsSequence";
import {
  navigateToNext,
  navigateToPrevious,
  requestStepCompletion,
} from "./renewableEnergy.actions";
import type { RenewableEnergyCreationStep } from "./renewableEnergySteps";
import type { RenewableEnergyStepsState } from "./step-handlers/stepHandler.type";
import { stepHandlerRegistry } from "./step-handlers/stepHandlerRegistry";

export type RenewableEnergyProjectState = {
  createMode: "express" | "custom" | undefined;
  saveState: "idle" | "loading" | "success" | "error";
  currentStep: RenewableEnergyCreationStep;
  stepsSequence: RenewableEnergyCreationStep[];
  firstSequenceStep: RenewableEnergyCreationStep;
  steps: RenewableEnergyStepsState;
  creationData: {
    renewableEnergyType?: RenewableEnergyDevelopmentPlanType;
  };
  expressData: {
    loadingState: "idle" | "loading" | "success" | "error";
    projectData?: ExpressReconversionProjectResult;
  };
  soilsCarbonStorage:
    | {
        loadingState: "idle" | "loading" | "error";
        current: undefined;
        projected: undefined;
      }
    | {
        loadingState: "success";
        current: SoilsCarbonStorageResult;
        projected: SoilsCarbonStorageResult;
      };
  expectedPhotovoltaicPerformance: {
    loadingState: "idle" | "loading" | "success" | "error";
    expectedPerformanceMwhPerYear?: number;
  };
};

const FIRST_CUSTOM_STEP: RenewableEnergyCreationStep =
  "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER";

export const INITIAL_STATE: RenewableEnergyProjectState = {
  createMode: undefined,
  currentStep: FIRST_CUSTOM_STEP,
  stepsSequence: [],
  firstSequenceStep: FIRST_CUSTOM_STEP,
  steps: {},
  creationData: {},
  expressData: {
    loadingState: "idle",
    projectData: undefined,
  },
  saveState: "idle",
  soilsCarbonStorage: {
    loadingState: "idle",
    current: undefined,
    projected: undefined,
  },
  expectedPhotovoltaicPerformance: {
    loadingState: "idle",
    expectedPerformanceMwhPerYear: undefined,
  },
};

// Pre-custom steps (handled outside step handler pattern)
const addPreCustomStepCases = (builder: ActionReducerMapBuilder<ProjectCreationState>) => {
  builder.addCase(projectSuggestionsCompleted, (state, action) => {
    if (action.payload.selectedOption === "PHOTOVOLTAIC_POWER_PLANT") {
      state.renewableEnergyProject.createMode = "express";
    }
  });
  builder.addCase(completeRenewableEnergyType, (state, action) => {
    state.renewableEnergyProject.creationData.renewableEnergyType = action.payload;
    state.stepsHistory.push("RENEWABLE_ENERGY_CREATE_MODE_SELECTION");
  });
  builder.addCase(customCreateModeSelected, (state) => {
    state.renewableEnergyProject.createMode = "custom";
    state.renewableEnergyProject.currentStep = FIRST_CUSTOM_STEP;
    state.renewableEnergyProject.stepsSequence = computeStepsSequence(
      { siteData: state.siteData, stepsState: state.renewableEnergyProject.steps },
      FIRST_CUSTOM_STEP,
    );
    state.stepsHistory.push("RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER");
  });
};

// Express flow (stays as-is)
const addExpressFlowCases = (builder: ActionReducerMapBuilder<ProjectCreationState>) => {
  builder.addCase(expressPhotovoltaicProjectCreated.pending, (state) => {
    state.renewableEnergyProject.createMode = "express";
    state.renewableEnergyProject.expressData = { loadingState: "loading" };
    state.stepsHistory.push("RENEWABLE_ENERGY_EXPRESS_FINAL_SUMMARY");
  });
  builder.addCase(expressPhotovoltaicProjectCreated.rejected, (state) => {
    state.renewableEnergyProject.expressData = { loadingState: "error" };
  });
  builder.addCase(expressPhotovoltaicProjectCreated.fulfilled, (state, action) => {
    state.renewableEnergyProject.expressData = {
      projectData: action.payload,
      loadingState: "success",
    };
  });
  builder.addCase(expressPhotovoltaicProjectSaved.pending, (state) => {
    state.renewableEnergyProject.saveState = "loading";
    state.stepsHistory.push("RENEWABLE_ENERGY_CREATION_RESULT");
  });
  builder.addCase(expressPhotovoltaicProjectSaved.rejected, (state) => {
    state.renewableEnergyProject.saveState = "error";
  });
  builder.addCase(expressPhotovoltaicProjectSaved.fulfilled, (state) => {
    state.renewableEnergyProject.saveState = "success";
  });
};

// Step handler pattern: generic step completion + navigation
const addStepHandlerCases = (builder: ActionReducerMapBuilder<ProjectCreationState>) => {
  builder.addCase(requestStepCompletion, (state, action) => {
    const changes = computeStepChanges(state, action.payload);
    applyStepChanges(state, changes);
  });

  builder.addCase(navigateToPrevious, (state) => {
    const currentStep = state.renewableEnergyProject.currentStep;
    const handler = stepHandlerRegistry[currentStep];

    if (handler.getPreviousStepId) {
      const previousStep = handler.getPreviousStepId({
        siteData: state.siteData,
        stepsState: state.renewableEnergyProject.steps,
      });
      navigateToAndLoadStep(state, previousStep);
    } else {
      // Use stepsSequence for backward navigation in the custom flow
      const stepsSequence = state.renewableEnergyProject.stepsSequence;
      const currentIndex = stepsSequence.indexOf(currentStep);
      const previousStep = currentIndex > 0 ? stepsSequence[currentIndex - 1] : undefined;
      if (previousStep) {
        navigateToAndLoadStep(state, previousStep);
      } else if (state.stepsHistory.length > 1) {
        // Fall back to stepsHistory when at the first step of the sequence
        state.stepsHistory = state.stepsHistory.slice(0, -1);
      }
    }
  });

  builder.addCase(navigateToNext, (state) => {
    const currentStep = state.renewableEnergyProject.currentStep;
    const handler = stepHandlerRegistry[currentStep];
    const context = {
      siteData: state.siteData,
      stepsState: state.renewableEnergyProject.steps,
    };

    if (handler.getNextStepId) {
      const nextStep = handler.getNextStepId(context);
      navigateToAndLoadStep(state, nextStep);
    }
  });
};

// Save thunk
const addSaveReconversionProjectCases = (
  builder: ActionReducerMapBuilder<ProjectCreationState>,
) => {
  builder.addCase(saveReconversionProject.pending, (state) => {
    state.renewableEnergyProject.saveState = "loading";
  });
  builder.addCase(saveReconversionProject.fulfilled, (state) => {
    state.renewableEnergyProject.saveState = "success";
    state.renewableEnergyProject.currentStep = "RENEWABLE_ENERGY_CREATION_RESULT";
    state.stepsHistory.push("RENEWABLE_ENERGY_CREATION_RESULT");
  });
  builder.addCase(saveReconversionProject.rejected, (state) => {
    state.renewableEnergyProject.saveState = "error";
    state.renewableEnergyProject.currentStep = "RENEWABLE_ENERGY_CREATION_RESULT";
    state.stepsHistory.push("RENEWABLE_ENERGY_CREATION_RESULT");
  });
};

// Async thunks
const addAsyncThunkCases = (builder: ActionReducerMapBuilder<ProjectCreationState>) => {
  builder.addCase(fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation.pending, (state) => {
    state.renewableEnergyProject.expectedPhotovoltaicPerformance.loadingState = "loading";
  });
  builder.addCase(
    fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation.fulfilled,
    (state, action) => {
      state.renewableEnergyProject.expectedPhotovoltaicPerformance.loadingState = "success";
      state.renewableEnergyProject.expectedPhotovoltaicPerformance.expectedPerformanceMwhPerYear =
        action.payload.expectedPerformanceMwhPerYear;
    },
  );
  builder.addCase(fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation.rejected, (state) => {
    state.renewableEnergyProject.expectedPhotovoltaicPerformance.loadingState = "error";
  });

  builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.pending, (state) => {
    state.renewableEnergyProject.soilsCarbonStorage.loadingState = "loading";
  });
  builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.fulfilled, (state, action) => {
    state.renewableEnergyProject.soilsCarbonStorage = {
      loadingState: "success",
      current: action.payload.current,
      projected: action.payload.projected,
    };
  });
  builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.rejected, (state) => {
    state.renewableEnergyProject.soilsCarbonStorage.loadingState = "error";
  });
};

// Back navigation for pre-custom steps (still uses stepsHistory)
const addRevertStepCases = (builder: ActionReducerMapBuilder<ProjectCreationState>) => {
  builder.addCase(stepReverted, (state) => {
    const lastStep = state.stepsHistory.at(-1);
    // Only clear createMode when going back from the create mode selection step
    if (lastStep === "RENEWABLE_ENERGY_CREATE_MODE_SELECTION") {
      state.renewableEnergyProject.createMode = undefined;
    }
    if (lastStep === "RENEWABLE_ENERGY_TYPES") {
      state.renewableEnergyProject.creationData.renewableEnergyType = undefined;
    }
  });
};

// Sub-reducer composed via reduce-reducers in createProject.reducer.ts.
// Initial state is always provided by the parent reducer; this placeholder is never used.
export const renewableEnergyProjectReducer = createReducer(
  {} as ProjectCreationState,
  (builder) => {
    addPreCustomStepCases(builder);
    addExpressFlowCases(builder);
    addStepHandlerCases(builder);
    addSaveReconversionProjectCases(builder);
    addAsyncThunkCases(builder);
    addRevertStepCases(builder);
  },
);
