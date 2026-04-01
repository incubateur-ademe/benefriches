import { ActionReducerMapBuilder, createReducer } from "@reduxjs/toolkit";

import { SoilsCarbonStorageResult } from "../../../../shared/core/reducers/project-form/soilsCarbonStorage.action";
import { ProjectCreationState } from "../createProject.reducer";
import { saveReconversionProject } from "./actions/customProjectSaved.action";
import { fetchPhotovoltaicExpectedAnnualPowerPerformanceForLocation } from "./actions/getPhotovoltaicExpectedPerformance.action";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "./actions/soilsCarbonStorage.actions";
import { applyStepChanges, computeStepChanges } from "./helpers/completeStep";
import { navigateToAndLoadStep } from "./helpers/navigateToStep";
import {
  nextStepRequested,
  previousStepRequested,
  stepCompletionRequested,
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

// Step handler pattern: generic step completion + navigation
const addStepHandlerCases = (builder: ActionReducerMapBuilder<ProjectCreationState>) => {
  builder.addCase(stepCompletionRequested, (state, action) => {
    const changes = computeStepChanges(state, action.payload);
    applyStepChanges(state, changes);
  });

  builder.addCase(previousStepRequested, (state) => {
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
      } else {
        state.currentStepGroup = "USE_CASE_SELECTION";
      }
    }
  });

  builder.addCase(nextStepRequested, (state) => {
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
  });
  builder.addCase(saveReconversionProject.rejected, (state) => {
    state.renewableEnergyProject.saveState = "error";
    state.renewableEnergyProject.currentStep = "RENEWABLE_ENERGY_CREATION_RESULT";
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

// Sub-reducer composed via reduce-reducers in createProject.reducer.ts.
// Initial state is always provided by the parent reducer; this placeholder is never used.
export const renewableEnergyProjectReducer = createReducer(
  {} as ProjectCreationState,
  (builder) => {
    addStepHandlerCases(builder);
    addSaveReconversionProjectCases(builder);
    addAsyncThunkCases(builder);
  },
);
