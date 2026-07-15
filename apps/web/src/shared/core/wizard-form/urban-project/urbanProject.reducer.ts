import { ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";

import { applyStepChanges } from "@/shared/core/wizard-form/helpers/applyStepChanges";
import { computeStepChanges } from "@/shared/core/wizard-form/helpers/computeStepChanges";
import { navigateToAndLoadStep } from "@/shared/core/wizard-form/helpers/navigateToStep";
import {
  answerStepHandlers,
  stepHandlerRegistry,
} from "@/shared/core/wizard-form/urban-project/step-handlers/stepHandlerRegistry";

import { StepUpdateResult } from "../helpers/computeStepChanges";
import { WizardFormDefinition, WizardFormState } from "../wizardForm.reducer";
import { UrbanStepHandlerContext } from "./step-handlers/stepHandler.type";
import { UrbanProjectFormReducerActions } from "./urbanProject.actions";
import { AnswersByStep, AnswerStepId, UrbanProjectCreationStep } from "./urbanProjectSteps";

type UrbanWizardFormDefinition<S extends WizardFormState> = Pick<
  WizardFormDefinition<
    UrbanProjectCreationStep,
    UrbanStepHandlerContext,
    Draft<S>["urbanProject"]["steps"],
    Draft<S>,
    StepUpdateResult<UrbanProjectCreationStep, AnswersByStep, AnswerStepId>
  >,
  "config" | "selectForm" | "buildContext"
> & {
  registry: typeof answerStepHandlers;
};

const defaultDefinition = <S extends WizardFormState>(): UrbanWizardFormDefinition<S> => ({
  config: {
    stepChangesNextMode: "step_order",
    finalSummaryFallbackStep: "URBAN_PROJECT_FINAL_SUMMARY",
  },
  registry: answerStepHandlers,
  selectForm: (state) => state.urbanProject,
  buildContext: (state) => ({ siteData: state.siteData }),
});

export const addUrbanProjectFormCasesToBuilder = <S extends WizardFormState>(
  builder: ActionReducerMapBuilder<S>,
  actions: UrbanProjectFormReducerActions,
  definition: UrbanWizardFormDefinition<S> = defaultDefinition<S>(),
) => {
  const { config, registry: answerRegistry, selectForm, buildContext } = definition;

  builder.addCase(actions.stepCompletionRequested, (state, action) => {
    const context = buildContext(state);
    const changes = computeStepChanges<
      UrbanProjectCreationStep,
      UrbanStepHandlerContext,
      AnswersByStep,
      AnswerStepId
    >(answerRegistry, context, selectForm(state).steps, action.payload);

    if (changes.cascadingChanges && changes.cascadingChanges.length > 0) {
      selectForm(state).pendingStepCompletion = {
        changes,
        showAlert: true,
      };
    } else {
      applyStepChanges(selectForm(state), context, changes, stepHandlerRegistry, answerRegistry, {
        nextMode: config.stepChangesNextMode,
        finalSummaryFallbackStep: config.finalSummaryFallbackStep,
      });
    }
  });

  builder.addCase(actions.stepCompletionConfirmed, (state) => {
    const pending = selectForm(state).pendingStepCompletion;
    if (pending) {
      applyStepChanges(
        selectForm(state),
        buildContext(state),
        pending.changes,
        stepHandlerRegistry,
        answerRegistry,
        {
          nextMode: config.stepChangesNextMode,
          finalSummaryFallbackStep: config.finalSummaryFallbackStep,
        },
      );
      selectForm(state).pendingStepCompletion = undefined;
    }
  });

  builder.addCase(actions.stepCompletionCancelled, (state) => {
    selectForm(state).pendingStepCompletion = undefined;
  });

  builder.addCase(actions.previousStepRequested, (state) => {
    const stepId = selectForm(state).currentStep;
    const handler = stepHandlerRegistry[stepId];

    if (handler.getPreviousStepId) {
      navigateToAndLoadStep(
        selectForm(state),
        buildContext(state),
        handler.getPreviousStepId({
          context: buildContext(state),
          answers: selectForm(state).steps,
        }),
        stepHandlerRegistry,
      );
    } else {
      config.onPreviousStepFallback?.(state);
    }
  });

  builder.addCase(actions.nextStepRequested, (state) => {
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
        selectForm(state),
        buildContext(state),
        handler.getNextStepId({
          context: buildContext(state),
          answers: selectForm(state).steps,
        }),
        stepHandlerRegistry,
      );
    }
  });

  builder.addCase(actions.stepNavigationRequested, (state, action) => {
    navigateToAndLoadStep(
      selectForm(state),
      buildContext(state),
      action.payload.stepId,
      stepHandlerRegistry,
    );
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
