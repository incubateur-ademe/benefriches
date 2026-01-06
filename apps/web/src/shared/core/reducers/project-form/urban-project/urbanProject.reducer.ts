import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { stepHandlerRegistry } from "@/shared/core/reducers/project-form/urban-project/step-handlers/stepHandlerRegistry";

import { ProjectFormState } from "../projectForm.reducer";
import { applyStepChanges, computeStepChanges } from "./helpers/completeStep";
import { navigateToAndLoadStep } from "./helpers/navigateToStep";
import { UrbanProjectFormReducerActions } from "./urbanProject.actions";

type FormReducerConfig = {
  stepChangesNextMode: "step_order" | "next_empty";
};

// Helper to cast Immer draft state to ProjectFormState for helper functions
// This is safe because S extends ProjectFormState and Immer drafts are mutable versions
const asFormState = <S extends ProjectFormState>(state: S): ProjectFormState => {
  return state as unknown as ProjectFormState;
};

export const addUrbanProjectFormCasesToBuilder = <S extends ProjectFormState>(
  builder: ActionReducerMapBuilder<S>,
  actions: UrbanProjectFormReducerActions,
  config: FormReducerConfig = { stepChangesNextMode: "step_order" },
) => {
  builder.addCase(actions.requestStepCompletion, (state, action) => {
    const formState = asFormState(state);
    const changes = computeStepChanges(formState, action.payload);

    if (changes.cascadingChanges && changes.cascadingChanges.length > 0) {
      state.urbanProject.pendingStepCompletion = {
        changes,
        showAlert: true,
      };
    } else {
      applyStepChanges(formState, changes, { nextMode: config.stepChangesNextMode });
    }
  });

  builder.addCase(actions.confirmStepCompletion, (state) => {
    const formState = asFormState(state);
    const pending = state.urbanProject.pendingStepCompletion;
    if (pending) {
      applyStepChanges(formState, pending.changes, { nextMode: config.stepChangesNextMode });
      state.urbanProject.pendingStepCompletion = undefined;
    }
  });

  builder.addCase(actions.cancelStepCompletion, (state) => {
    state.urbanProject.pendingStepCompletion = undefined;
  });

  builder.addCase(actions.navigateToPrevious, (state) => {
    const formState = asFormState(state);
    const stepId = state.urbanProject.currentStep;
    const handler = stepHandlerRegistry[stepId];

    if (handler.getPreviousStepId) {
      navigateToAndLoadStep(
        formState,
        handler.getPreviousStepId({
          siteData: state.siteData,
          stepsState: state.urbanProject.steps,
        }),
      );
    }
  });

  builder.addCase(actions.navigateToNext, (state) => {
    const formState = asFormState(state);
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
        formState,
        handler.getNextStepId({
          siteData: state.siteData,
          stepsState: state.urbanProject.steps,
        }),
      );
    }
  });

  builder.addCase(actions.navigateToStep, (state, action) => {
    const formState = asFormState(state);
    navigateToAndLoadStep(formState, action.payload.stepId);
  });

  builder.addCase(actions.fetchSoilsCarbonStorageDifference.pending, (state) => {
    if (!state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY) {
      state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY = { completed: false };
    }
    state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.loadingState = "loading";
  });
  builder.addCase(actions.fetchSoilsCarbonStorageDifference.fulfilled, (state, action) => {
    if (!state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY) {
      state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY = { completed: false };
    }
    state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.loadingState = "success";
    state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.data = {
      current: action.payload.current,
      projected: action.payload.projected,
    };
  });
  builder.addCase(actions.fetchSoilsCarbonStorageDifference.rejected, (state) => {
    if (!state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY) {
      state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY = { completed: false };
    }
    state.urbanProject.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.loadingState = "error";
  });
};
