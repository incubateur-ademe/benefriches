import { createReducer, UnknownAction } from "@reduxjs/toolkit";

import deepEqual from "@/shared/core/deep-equal/deepEqual";

import { ProjectCreationState } from "../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../urban-project/creationSteps";
import soilsCarbonStorageReducer, {
  State as SoilsCarbonStorageState,
} from "./soils-carbon-storage/soilsCarbonStorage.reducer";
import { stepHandlerRegistry } from "./step-handlers/stepHandlerRegistry";
import {
  loadStep,
  completeStep,
  navigateToPrevious,
  navigateToNext,
  navigateToStep,
} from "./urbanProject.actions";
import { MutateStateHelper } from "./urbanProject.helpers";
import { customUrbanProjectSaved } from "./urbanProjectSave.action";
import { AnswersByStep, AnswerStepId } from "./urbanProjectSteps";

export type UrbanProjectState = {
  currentStep: UrbanProjectCustomCreationStep;
  isStepLoading: boolean;
  saveState: "idle" | "loading" | "success" | "error";
  soilsCarbonStorage: SoilsCarbonStorageState;
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
  isStepLoading: false,
  saveState: "idle",
  soilsCarbonStorage: { loadingState: "idle", current: undefined, projected: undefined },
  steps: {},
};

const urbanProjectReducer = createReducer({} as ProjectCreationState, (builder) => {
  builder.addCase(loadStep, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry[stepId];

    if (!handler.getDefaultAnswers) {
      return;
    }

    state.urbanProjectEventSourcing.isStepLoading = true;

    // Ne pas recalculer si des réponses existent déjà
    if (state.urbanProjectEventSourcing.steps[stepId]?.defaultValues) {
      state.urbanProjectEventSourcing.isStepLoading = false;
      return;
    }

    const defaults = handler.getDefaultAnswers({
      siteData: state.siteData,
      stepsState: state.urbanProjectEventSourcing.steps,
    });
    if (defaults) {
      MutateStateHelper.setDefaultValues<typeof stepId>(state, stepId, defaults);
    }

    state.urbanProjectEventSourcing.isStepLoading = false;
  });

  builder.addCase(completeStep, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry[action.payload.stepId];

    const previousAnswers = state.urbanProjectEventSourcing.steps[stepId]?.payload;

    const newAnswers = handler.updateAnswersMiddleware
      ? handler.updateAnswersMiddleware(
          { siteData: state.siteData, stepsState: state.urbanProjectEventSourcing.steps },
          action.payload.answers,
        )
      : action.payload.answers;

    const hasChanged = !previousAnswers || !deepEqual(previousAnswers, newAnswers);

    MutateStateHelper.completeStep<typeof stepId>(state, stepId, newAnswers);

    if (hasChanged && previousAnswers) {
      // handle side effects
      if (handler.getStepsToInvalidate) {
        handler
          .getStepsToInvalidate(
            { siteData: state.siteData, stepsState: state.urbanProjectEventSourcing.steps },
            previousAnswers,
            newAnswers,
          )
          .forEach((stepId) => {
            MutateStateHelper.deleteStepAnswer(state, stepId);
          });
      }
    }

    if (handler.getShortcut) {
      const shortcut = handler.getShortcut(
        { siteData: state.siteData, stepsState: state.urbanProjectEventSourcing.steps },
        newAnswers,
        hasChanged,
      );
      if (shortcut) {
        for (const stepShortcut of shortcut.complete) {
          MutateStateHelper.completeStep<typeof stepId>(
            state,
            stepShortcut.stepId,
            stepShortcut.payload,
          );
          for (const invalidStep of stepShortcut.invalidSteps) {
            MutateStateHelper.deleteStepAnswer(state, invalidStep);
          }
        }
        MutateStateHelper.navigateToStep(state, shortcut.next);
        return;
      }
    }

    MutateStateHelper.navigateToStep(
      state,
      handler.getNextStepId({
        siteData: state.siteData,
        stepsState: state.urbanProjectEventSourcing.steps,
      }),
    );
  });

  builder.addCase(navigateToPrevious, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry[stepId];

    if (stepId === initialState.currentStep) {
      state.urbanProject.createMode = undefined;
    }

    if (handler.getPreviousStepId) {
      MutateStateHelper.navigateToStep(
        state,
        handler.getPreviousStepId({
          siteData: state.siteData,
          stepsState: state.urbanProjectEventSourcing.steps,
        }),
      );
    }
  });

  builder.addCase(navigateToNext, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry[stepId];

    if (!state.urbanProjectEventSourcing.steps[stepId]) {
      state.urbanProjectEventSourcing.steps[stepId] = {
        completed: true,
      };
    } else {
      state.urbanProjectEventSourcing.steps[stepId].completed = true;
    }

    if (handler.getNextStepId) {
      MutateStateHelper.navigateToStep(
        state,
        handler.getNextStepId({
          siteData: state.siteData,
          stepsState: state.urbanProjectEventSourcing.steps,
        }),
      );
    }
  });

  builder.addCase(navigateToStep, (state, action) => {
    MutateStateHelper.navigateToStep(state, action.payload.stepId);
  });
  builder.addCase(customUrbanProjectSaved.pending, (state) => {
    state.urbanProjectEventSourcing.saveState = "loading";
  });
  builder.addCase(customUrbanProjectSaved.fulfilled, (state) => {
    state.urbanProjectEventSourcing.saveState = "success";
    MutateStateHelper.navigateToStep(state, "URBAN_PROJECT_CREATION_RESULT");
  });
  builder.addCase(customUrbanProjectSaved.rejected, (state) => {
    state.urbanProjectEventSourcing.saveState = "error";
    MutateStateHelper.navigateToStep(state, "URBAN_PROJECT_CREATION_RESULT");
  });
});

export default (state: ProjectCreationState, action: UnknownAction): ProjectCreationState => {
  const s = urbanProjectReducer(state, action);
  return {
    ...s,
    urbanProjectEventSourcing: {
      ...s.urbanProjectEventSourcing,
      soilsCarbonStorage: soilsCarbonStorageReducer(
        state.urbanProjectEventSourcing.soilsCarbonStorage,
        action,
      ),
    },
  };
};
