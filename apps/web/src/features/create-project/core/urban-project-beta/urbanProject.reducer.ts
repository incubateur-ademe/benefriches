import { createReducer, UnknownAction } from "@reduxjs/toolkit";

import { ProjectCreationState } from "../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../urban-project/creationSteps";
import { applyStepChanges, computeStepChanges, StepUpdateResult } from "./helpers/completeStep";
import { MutateStateHelper } from "./helpers/mutateState";
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
import { customUrbanProjectSaved } from "./urbanProjectSave.action";
import { AnswersByStep, AnswerStepId } from "./urbanProjectSteps";

export type UrbanProjectState = {
  currentStep: UrbanProjectCustomCreationStep;
  saveState: "idle" | "loading" | "success" | "error";
  soilsCarbonStorage: SoilsCarbonStorageState;
  pendingStepCompletion?: {
    changes: StepUpdateResult<AnswerStepId>;
    showAlert: boolean;
  };
  steps: Partial<{
    [K in UrbanProjectCustomCreationStep]: K extends AnswerStepId
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
  currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
  saveState: "idle",
  soilsCarbonStorage: { loadingState: "idle", current: undefined, projected: undefined },
  steps: {},
  pendingStepCompletion: undefined,
};

const urbanProjectReducer = createReducer({} as ProjectCreationState, (builder) => {
  builder.addCase(requestStepCompletion, (state, action) => {
    const changes = computeStepChanges(state, action.payload);

    if (changes.cascadingChanges) {
      state.urbanProjectBeta.pendingStepCompletion = {
        changes,
        showAlert: true,
      };
    } else {
      applyStepChanges(state, changes);
    }
  });

  builder.addCase(confirmStepCompletion, (state) => {
    const pending = state.urbanProjectBeta.pendingStepCompletion;
    if (pending) {
      applyStepChanges(state, pending.changes);
      state.urbanProjectBeta.pendingStepCompletion = undefined;
    }
  });

  builder.addCase(cancelStepCompletion, (state) => {
    state.urbanProjectBeta.pendingStepCompletion = undefined;
  });

  builder.addCase(navigateToPrevious, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry[stepId];

    if (stepId === initialState.currentStep) {
      state.urbanProject.createMode = undefined;
    }

    if (handler.getPreviousStepId) {
      navigateToAndLoadStep(
        state,
        handler.getPreviousStepId({
          siteData: state.siteData,
          stepsState: state.urbanProjectBeta.steps,
        }),
      );
    }
  });

  builder.addCase(navigateToNext, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry[stepId];

    if (!state.urbanProjectBeta.steps[stepId]) {
      state.urbanProjectBeta.steps[stepId] = {
        completed: true,
      };
    } else {
      state.urbanProjectBeta.steps[stepId].completed = true;
    }

    if (handler.getNextStepId) {
      navigateToAndLoadStep(
        state,
        handler.getNextStepId({
          siteData: state.siteData,
          stepsState: state.urbanProjectBeta.steps,
        }),
      );
    }
  });

  builder.addCase(navigateToStep, (state, action) => {
    navigateToAndLoadStep(state, action.payload.stepId);
  });
  builder.addCase(customUrbanProjectSaved.pending, (state) => {
    state.urbanProjectBeta.saveState = "loading";
  });
  builder.addCase(customUrbanProjectSaved.fulfilled, (state) => {
    state.urbanProjectBeta.saveState = "success";
    MutateStateHelper.navigateToStep(state, "URBAN_PROJECT_CREATION_RESULT");
  });
  builder.addCase(customUrbanProjectSaved.rejected, (state) => {
    state.urbanProjectBeta.saveState = "error";
    MutateStateHelper.navigateToStep(state, "URBAN_PROJECT_CREATION_RESULT");
  });
});

export default (state: ProjectCreationState, action: UnknownAction): ProjectCreationState => {
  const s = urbanProjectReducer(state, action);
  return {
    ...s,
    urbanProjectBeta: {
      ...s.urbanProjectBeta,
      soilsCarbonStorage: soilsCarbonStorageReducer(
        state.urbanProjectBeta.soilsCarbonStorage,
        action,
      ),
    },
  };
};
