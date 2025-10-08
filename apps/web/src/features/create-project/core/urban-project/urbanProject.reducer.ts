import { createReducer, UnknownAction } from "@reduxjs/toolkit";

import { ReconversionProject } from "../actions/expressProjectSavedGateway";
import { ProjectCreationState } from "../createProject.reducer";
import { applyStepChanges, computeStepChanges, StepUpdateResult } from "./helpers/completeStep";
import { navigateToAndLoadStep } from "./helpers/navigateToStep";
import soilsCarbonStorageReducer, {
  State as SoilsCarbonStorageState,
} from "./soils-carbon-storage/soilsCarbonStorage.reducer";
import { stepHandlerRegistry } from "./step-handlers/stepHandlerRegistry";
import {
  requestStepCompletion,
  confirmStepCompletion,
  cancelStepCompletion,
  navigateToPrevious,
  navigateToNext,
  navigateToStep,
} from "./urbanProject.actions";
import { customUrbanProjectSaved } from "./urbanProjectCustomSaved.action";
import { expressUrbanProjectSaved } from "./urbanProjectExpressSaved.action";
import { AnswersByStep, AnswerStepId, UrbanProjectCreationStep } from "./urbanProjectSteps";

export type UrbanProjectState = {
  currentStep: UrbanProjectCreationStep;
  saveState: "idle" | "loading" | "success" | "error";
  soilsCarbonStorage: SoilsCarbonStorageState;
  pendingStepCompletion?: {
    changes: StepUpdateResult<AnswerStepId>;
    showAlert: boolean;
  };
  steps: Partial<{
    [K in UrbanProjectCreationStep]: K extends "URBAN_PROJECT_EXPRESS_CREATION_RESULT"
      ? {
          completed: boolean;
          projectData?: ReconversionProject;
        }
      : K extends AnswerStepId
        ? {
            completed: boolean;
            payload?: AnswersByStep[K];
            defaultValues?: AnswersByStep[K];
          }
        : {
            completed: boolean;
          };
  }>;
};

export const initialState: UrbanProjectState = {
  currentStep: "URBAN_PROJECT_CREATE_MODE_SELECTION",
  saveState: "idle",
  soilsCarbonStorage: { loadingState: "idle", current: undefined, projected: undefined },
  steps: {},
  pendingStepCompletion: undefined,
};

const urbanProjectReducer = createReducer({} as ProjectCreationState, (builder) => {
  builder.addCase(requestStepCompletion, (state, action) => {
    const changes = computeStepChanges(state, action.payload);

    if (changes.cascadingChanges && changes.cascadingChanges.length > 0) {
      state.urbanProject.pendingStepCompletion = {
        changes,
        showAlert: true,
      };
    } else {
      applyStepChanges(state, changes);
    }
  });

  builder.addCase(confirmStepCompletion, (state) => {
    const pending = state.urbanProject.pendingStepCompletion;
    if (pending) {
      applyStepChanges(state, pending.changes);
      state.urbanProject.pendingStepCompletion = undefined;
    }
  });

  builder.addCase(cancelStepCompletion, (state) => {
    state.urbanProject.pendingStepCompletion = undefined;
  });

  builder.addCase(navigateToPrevious, (state) => {
    const stepId = state.urbanProject.currentStep;
    const handler = stepHandlerRegistry[stepId];

    if (stepId === initialState.currentStep) {
      state.stepsHistory = state.stepsHistory.filter(
        (stepId) => stepId !== initialState.currentStep,
      );
    }

    if (handler.getPreviousStepId) {
      navigateToAndLoadStep(
        state,
        handler.getPreviousStepId({
          siteData: state.siteData,
          stepsState: state.urbanProject.steps,
        }),
      );
    }
  });

  builder.addCase(navigateToNext, (state) => {
    const stepId = state.urbanProject.currentStep;
    const handler = stepHandlerRegistry[stepId];

    if (!state.urbanProject.steps[stepId]) {
      state.urbanProject.steps[stepId] = {
        completed: true,
      };
    } else {
      state.urbanProject.steps[stepId].completed = true;
    }

    if (handler.getNextStepId) {
      navigateToAndLoadStep(
        state,
        handler.getNextStepId({
          siteData: state.siteData,
          stepsState: state.urbanProject.steps,
        }),
      );
    }
  });

  builder.addCase(navigateToStep, (state, action) => {
    navigateToAndLoadStep(state, action.payload.stepId);
  });
  builder.addCase(customUrbanProjectSaved.pending, (state) => {
    state.urbanProject.saveState = "loading";
  });
  builder.addCase(customUrbanProjectSaved.fulfilled, (state) => {
    state.urbanProject.saveState = "success";
  });
  builder.addCase(customUrbanProjectSaved.rejected, (state) => {
    state.urbanProject.saveState = "error";
  });
  builder.addCase(expressUrbanProjectSaved.pending, (state) => {
    state.urbanProject.saveState = "loading";
  });
  builder.addCase(expressUrbanProjectSaved.rejected, (state) => {
    state.urbanProject.saveState = "error";
  });
  builder.addCase(expressUrbanProjectSaved.fulfilled, (state, action) => {
    state.urbanProject.saveState = "success";
    state.urbanProject.steps.URBAN_PROJECT_EXPRESS_CREATION_RESULT = {
      completed: true,
      projectData: action.payload,
    };
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
