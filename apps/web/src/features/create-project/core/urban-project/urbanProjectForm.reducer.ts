import { ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";

import {
  answerStepHandlers,
  stepHandlerRegistry,
} from "@/features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";
import { applyStepChanges } from "@/shared/core/wizard-form/helpers/applyStepChanges";
import {
  computeStepChanges,
  StepUpdateResult,
} from "@/shared/core/wizard-form/helpers/computeStepChanges";
import { navigateToAndLoadStep } from "@/shared/core/wizard-form/helpers/navigateToStep";
import { WizardFormDefinition } from "@/shared/core/wizard-form/wizardForm.reducer";

import { UrbanStepHandlerContext } from "./step-handlers/stepHandler.type";
import { UrbanProjectFormState } from "./urbanProject.state";
import { UrbanProjectFormReducerActions } from "./urbanProjectForm.actions";
import { AnswersByStep, AnswerStepId, UrbanProjectCreationStep } from "./urbanProjectSteps";

// Structural constraint mirroring PV's `RenewableEnergyHostState` (ADR-0015): any consumer state
// that nests a self-contained urban slice with its own `form` sub-state can drive this case-adder
// — creation and update alike. The case-adder never reads the slice shape directly; it locates the
// form sub-state and eager context through the injected `selectForm` / `buildContext` lenses.
type UrbanProjectHostState = {
  urbanProject: {
    form: UrbanProjectFormState;
  };
  siteData?: UrbanStepHandlerContext["siteData"];
};

type UrbanWizardFormDefinition<S extends UrbanProjectHostState> = Pick<
  WizardFormDefinition<
    UrbanProjectCreationStep,
    UrbanStepHandlerContext,
    Draft<S>["urbanProject"]["form"]["steps"],
    Draft<S>,
    StepUpdateResult<UrbanProjectCreationStep, AnswersByStep, AnswerStepId>
  >,
  "config" | "selectForm" | "buildContext"
> & {
  registry: typeof answerStepHandlers;
};

export const addUrbanProjectFormCasesToBuilder = <S extends UrbanProjectHostState>(
  builder: ActionReducerMapBuilder<S>,
  actions: UrbanProjectFormReducerActions,
  definition: UrbanWizardFormDefinition<S>,
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
