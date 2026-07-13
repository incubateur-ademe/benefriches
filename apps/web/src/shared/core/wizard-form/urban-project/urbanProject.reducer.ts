import { ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";

import { stepHandlerRegistry } from "@/shared/core/wizard-form/urban-project/step-handlers/stepHandlerRegistry";

import { WizardFormDefinition, WizardFormState } from "../wizardForm.reducer";
import { applyStepChanges, computeStepChanges, StepUpdateResult } from "./helpers/completeStep";
import { navigateToAndLoadStep } from "./helpers/navigateToStep";
import { UrbanStepHandlerContext } from "./step-handlers/stepHandler.type";
import { UrbanProjectFormReducerActions } from "./urbanProject.actions";
import { AnswerStepId, UrbanProjectCreationStep } from "./urbanProjectSteps";

// Helper to cast Immer draft state to WizardFormState for helper functions
// This is safe because S extends WizardFormState and Immer drafts are mutable versions
const asFormState = (state: WizardFormState): WizardFormState => {
  return state as unknown as WizardFormState;
};

type UrbanWizardFormDefinition<S extends WizardFormState> = Pick<
  WizardFormDefinition<
    UrbanProjectCreationStep,
    UrbanStepHandlerContext,
    Draft<S>["urbanProject"]["steps"],
    Draft<S>,
    StepUpdateResult<AnswerStepId>
  >,
  "config" | "selectForm" | "buildContext"
>;

const defaultDefinition = <S extends WizardFormState>(): UrbanWizardFormDefinition<S> => ({
  config: { stepChangesNextMode: "step_order" },
  selectForm: (state) => state.urbanProject,
  buildContext: (state) => ({ siteData: state.siteData }),
});

export const addUrbanProjectFormCasesToBuilder = <S extends WizardFormState>(
  builder: ActionReducerMapBuilder<S>,
  actions: UrbanProjectFormReducerActions,
  definition: UrbanWizardFormDefinition<S> = defaultDefinition<S>(),
) => {
  const { config, selectForm, buildContext } = definition;

  builder.addCase(actions.stepCompletionRequested, (state, action) => {
    const formState = asFormState(state);
    const changes = computeStepChanges(formState, action.payload);

    if (changes.cascadingChanges && changes.cascadingChanges.length > 0) {
      selectForm(state).pendingStepCompletion = {
        changes,
        showAlert: true,
      };
    } else {
      applyStepChanges(formState, changes, { nextMode: config.stepChangesNextMode });
    }
  });

  builder.addCase(actions.stepCompletionConfirmed, (state) => {
    const formState = asFormState(state);
    const pending = selectForm(state).pendingStepCompletion;
    if (pending) {
      applyStepChanges(formState, pending.changes, { nextMode: config.stepChangesNextMode });
      selectForm(state).pendingStepCompletion = undefined;
    }
  });

  builder.addCase(actions.stepCompletionCancelled, (state) => {
    selectForm(state).pendingStepCompletion = undefined;
  });

  builder.addCase(actions.previousStepRequested, (state) => {
    const formState = asFormState(state);
    const stepId = selectForm(state).currentStep;
    const handler = stepHandlerRegistry[stepId];

    if (handler.getPreviousStepId) {
      navigateToAndLoadStep(
        formState,
        handler.getPreviousStepId({
          context: buildContext(state),
          answers: selectForm(state).steps,
        }),
      );
    } else {
      config.onPreviousStepFallback?.(state);
    }
  });

  builder.addCase(actions.nextStepRequested, (state) => {
    const formState = asFormState(state);
    const form = selectForm(state);
    const stepId = form.currentStep;
    const handler = stepHandlerRegistry[stepId];

    if (!form.steps[stepId]) {
      form.steps[stepId] = {
        completed: true,
      };
    } else {
      form.steps[stepId].completed = true;
    }

    if (handler.getNextStepId) {
      navigateToAndLoadStep(
        formState,
        handler.getNextStepId({
          context: buildContext(state),
          answers: selectForm(state).steps,
        }),
      );
    }
  });

  builder.addCase(actions.stepNavigationRequested, (state, action) => {
    const formState = asFormState(state);
    navigateToAndLoadStep(formState, action.payload.stepId);
  });

  builder.addCase(actions.fetchSoilsCarbonStorageDifference.pending, (state) => {
    const form = selectForm(state);
    if (!form.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY) {
      form.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY = { completed: false };
    }
    form.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.loadingState = "loading";
  });
  builder.addCase(actions.fetchSoilsCarbonStorageDifference.fulfilled, (state, action) => {
    const form = selectForm(state);
    if (!form.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY) {
      form.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY = { completed: false };
    }
    form.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.loadingState = "success";
    form.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.data = {
      current: action.payload.current,
      projected: action.payload.projected,
    };
  });
  builder.addCase(actions.fetchSoilsCarbonStorageDifference.rejected, (state) => {
    const form = selectForm(state);
    if (!form.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY) {
      form.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY = { completed: false };
    }
    form.steps.URBAN_PROJECT_SOILS_CARBON_SUMMARY.loadingState = "error";
  });
};
