import { createReducer, UnknownAction } from "@reduxjs/toolkit";

import deepEqual from "@/shared/core/deep-equal/deepEqual";

import { ProjectCreationState } from "../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../urban-project/creationSteps";
import { AnswerDeletionEvent } from "./form-events/AnswerDeletionEvent";
import { AnswerSetEvent } from "./form-events/AnswerSetEvent";
import { FormEvent } from "./form-events/FormEvent.type";
import { FormState } from "./form-state/formState";
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
import { customUrbanProjectSaved } from "./urbanProjectSave.action";
import { AnswersByStep, AnswerStepId } from "./urbanProjectSteps";

export type UrbanProjectState = {
  events: FormEvent[];
  currentStep: UrbanProjectCustomCreationStep;
  isStepLoading: boolean;
  saveState: "idle" | "loading" | "success" | "error";
  soilsCarbonStorage: SoilsCarbonStorageState;
};

export const initialState: UrbanProjectState = {
  events: [],
  currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
  isStepLoading: false,
  saveState: "idle",
  soilsCarbonStorage: { loadingState: "idle", current: undefined, projected: undefined },
};

const MutateStateHelper = {
  navigateToStep: (state: ProjectCreationState, stepId: UrbanProjectCustomCreationStep) => {
    state.urbanProjectEventSourcing.currentStep = stepId;
  },
  addAnswerEvent<K extends AnswerStepId>(
    state: ProjectCreationState,
    stepId: K,
    answers: AnswersByStep[K],
    source: "user" | "system" = "user",
  ) {
    state.urbanProjectEventSourcing.events.push(
      AnswerSetEvent.new(stepId, answers, source) as FormEvent,
    );
  },
  addAnswerDeletionEvent(
    state: ProjectCreationState,
    stepId: AnswerStepId,
    source: "user" | "system" = "system",
  ) {
    if (FormState.getStepAnswers<typeof stepId>(state.urbanProjectEventSourcing.events, stepId)) {
      state.urbanProjectEventSourcing.events.push(
        AnswerDeletionEvent.new(stepId, source) as FormEvent,
      );
    }
  },
};

const urbanProjectReducer = createReducer({} as ProjectCreationState, (builder) => {
  builder.addCase(loadStep, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry[stepId];

    if (!handler.getDefaultAnswers) {
      return;
    }

    state.urbanProjectEventSourcing.isStepLoading = true;

    const answerEvent = FormState.getStepAnswers(
      state.urbanProjectEventSourcing.events,
      action.payload.stepId,
    );

    // Ne pas recalculer si des réponses existent déjà
    if (answerEvent) {
      state.urbanProjectEventSourcing.isStepLoading = false;
      return;
    }

    const defaults = handler.getDefaultAnswers(state);
    if (defaults) {
      MutateStateHelper.addAnswerEvent<typeof stepId>(state, stepId, defaults, "system");
    }

    state.urbanProjectEventSourcing.isStepLoading = false;
  });

  builder.addCase(completeStep, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry[action.payload.stepId];

    const previousAnswers = FormState.getStepAnswers(
      state.urbanProjectEventSourcing.events,
      stepId,
    );
    const newAnswers = handler.updateAnswersMiddleware
      ? handler.updateAnswersMiddleware(state, action.payload.answers)
      : action.payload.answers;

    const hasChanged = !previousAnswers || !deepEqual(previousAnswers, newAnswers);

    if (hasChanged) {
      MutateStateHelper.addAnswerEvent<typeof stepId>(state, stepId, newAnswers, "user");

      if (previousAnswers) {
        // handle side effects
        if (handler.getStepsToInvalidate) {
          handler.getStepsToInvalidate(state, previousAnswers, newAnswers).forEach((stepId) => {
            MutateStateHelper.addAnswerDeletionEvent(state, stepId);
          });
        }
      }
    }

    if (handler.getShortcut) {
      const shortcut = handler.getShortcut(state, newAnswers, hasChanged);
      if (shortcut) {
        for (const stepShortcut of shortcut.complete) {
          MutateStateHelper.addAnswerEvent<typeof stepId>(
            state,
            stepShortcut.stepId,
            stepShortcut.payload,
            "system",
          );
          for (const invalidStep of stepShortcut.invalidSteps) {
            MutateStateHelper.addAnswerDeletionEvent(state, invalidStep);
          }
        }
        MutateStateHelper.navigateToStep(state, shortcut.next);
        return;
      }
    }

    MutateStateHelper.navigateToStep(state, handler.getNextStepId(state));
  });

  builder.addCase(navigateToPrevious, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry[stepId];

    if (stepId === initialState.currentStep) {
      state.urbanProject.createMode = undefined;
    }

    if (handler.getPreviousStepId) {
      MutateStateHelper.navigateToStep(state, handler.getPreviousStepId(state));
    }
  });

  builder.addCase(navigateToNext, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry[stepId];

    if (handler.getNextStepId) {
      MutateStateHelper.navigateToStep(state, handler.getNextStepId(state));
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
