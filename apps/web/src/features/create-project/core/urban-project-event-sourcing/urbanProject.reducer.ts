import { createReducer, UnknownAction } from "@reduxjs/toolkit";

import { ProjectCreationState } from "../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../urban-project/creationSteps";
import { FormEvent } from "./form-events/FormEvent.type";
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
import { AnswerStepId, isInformationalStep } from "./urbanProjectSteps";

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

export const urbanProjectReducer = createReducer({} as ProjectCreationState, (builder) => {
  builder.addCase(loadStep, (state, action) => {
    state.urbanProjectEventSourcing.isStepLoading = true;
    const handler = stepHandlerRegistry.getAnswerStepHandler(action.payload.stepId);
    handler.load(state);
    state.urbanProjectEventSourcing.isStepLoading = false;
  });

  builder.addCase(completeStep, (state, action) => {
    const stepId = action.payload.stepId;
    const handler = stepHandlerRegistry.getAnswerStepHandler(stepId);

    handler.complete(state, action.payload.answers);
  });

  builder.addCase(navigateToPrevious, (state, action) => {
    const stepId = action.payload.stepId;

    const handler = isInformationalStep(stepId)
      ? stepHandlerRegistry.getInformationalStepHandler(stepId)
      : stepHandlerRegistry.getAnswerStepHandler(stepId as AnswerStepId);

    handler.previous(state);
  });

  builder.addCase(navigateToNext, (state, action) => {
    const stepId = action.payload.stepId;

    const handler = isInformationalStep(stepId)
      ? stepHandlerRegistry.getInformationalStepHandler(stepId)
      : stepHandlerRegistry.getAnswerStepHandler(stepId as AnswerStepId);

    handler.next(state);
  });

  builder.addCase(navigateToStep, (state, action) => {
    state.urbanProjectEventSourcing.currentStep = action.payload.stepId;
  });
  builder.addCase(customUrbanProjectSaved.pending, (state) => {
    state.urbanProjectEventSourcing.saveState = "loading";
  });
  builder.addCase(customUrbanProjectSaved.fulfilled, (state) => {
    state.urbanProjectEventSourcing.saveState = "success";
    state.urbanProjectEventSourcing.currentStep = "URBAN_PROJECT_CREATION_RESULT";
  });
  builder.addCase(customUrbanProjectSaved.rejected, (state) => {
    state.urbanProjectEventSourcing.saveState = "error";
    state.urbanProjectEventSourcing.currentStep = "URBAN_PROJECT_CREATION_RESULT";
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
