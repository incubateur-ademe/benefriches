import { ActionReducerMapBuilder } from "@reduxjs/toolkit";

import { stepHandlerRegistry } from "@/shared/core/reducers/project-form/urban-project/step-handlers/stepHandlerRegistry";

import { ProjectFormState } from "../projectForm.reducer";
import { applyStepChanges, computeStepChanges } from "./helpers/completeStep";
import { navigateToAndLoadStep } from "./helpers/navigateToStep";
import { UrbanProjectFormReducerActions } from "./urbanProject.actions";
import { UrbanProjectCreationStep } from "./urbanProjectSteps";

export const addUrbanProjectFormCasesToBuilder = <
  T extends UrbanProjectCreationStep,
  S extends ProjectFormState<T>,
>(
  builder: ActionReducerMapBuilder<S>,
  actions: UrbanProjectFormReducerActions,
) => {
  builder.addCase(actions.requestStepCompletion, (state, action) => {
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

  builder.addCase(actions.confirmStepCompletion, (state) => {
    const pending = state.urbanProject.pendingStepCompletion;
    if (pending) {
      applyStepChanges(state, pending.changes);
      state.urbanProject.pendingStepCompletion = undefined;
    }
  });

  builder.addCase(actions.cancelStepCompletion, (state) => {
    state.urbanProject.pendingStepCompletion = undefined;
  });

  builder.addCase(actions.navigateToPrevious, (state) => {
    const stepId = state.urbanProject.currentStep;
    const handler = stepHandlerRegistry[stepId];

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

  builder.addCase(actions.navigateToNext, (state) => {
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

  builder.addCase(actions.navigateToStep, (state, action) => {
    navigateToAndLoadStep(state, action.payload.stepId);
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
