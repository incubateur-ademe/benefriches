import { ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";

import { applyStepChanges } from "@/shared/core/wizard-form/helpers/applyStepChanges";
import {
  computeStepChanges,
  StepUpdateResult,
} from "@/shared/core/wizard-form/helpers/computeStepChanges";
import { navigateToAndLoadStep } from "@/shared/core/wizard-form/helpers/navigateToStep";
import { WizardFormDefinition } from "@/shared/core/wizard-form/wizardForm.reducer";

import { SiteCreationState } from "../createSite.reducer";
import { DemoFormPureActions } from "./demo.actions";
import { AnswersByStep, DemoAnswerStepId, DemoSiteCreationStep } from "./demoSteps";
import {
  answerStepHandlers,
  demoStepHandlerRegistry,
  DemoStepHandlerContext,
} from "./stepHandlerRegistry";

// Demo has exactly one consumer (create — express sites are never edited), so this is typed
// directly against the concrete SiteCreationState rather than generic over a host-state param,
// unlike renewableEnergyForm.reducer.ts which serves both creation and update.
type DemoWizardFormDefinition = Pick<
  WizardFormDefinition<
    DemoSiteCreationStep,
    DemoStepHandlerContext,
    Draft<SiteCreationState>["demo"]["steps"],
    Draft<SiteCreationState>,
    StepUpdateResult<DemoSiteCreationStep, AnswersByStep, DemoAnswerStepId>
  >,
  "config" | "selectForm" | "buildContext"
>;

// Demo's WizardFormDefinition-shaped wiring, mirroring the PV "degenerate" template
// (renewableEnergyForm.reducer.ts): demo has no dependency rules/shortcuts either, so
// `computeStepChanges` always yields empty cascadingChanges and `applyStepChanges` runs
// unconditionally — there is no pending-confirmation state to wire up in practice, but the
// full action set is still wired for consistency with the shared engine contract.
export const addDemoFormCasesToBuilder = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
  actions: DemoFormPureActions,
  definition: DemoWizardFormDefinition,
) => {
  const { config, selectForm, buildContext } = definition;

  builder.addCase(actions.stepCompletionRequested, (state, action) => {
    const context = buildContext(state);
    const changes = computeStepChanges<
      DemoSiteCreationStep,
      DemoStepHandlerContext,
      AnswersByStep,
      DemoAnswerStepId
    >(answerStepHandlers, context, selectForm(state).steps, action.payload);

    if (changes.cascadingChanges && changes.cascadingChanges.length > 0) {
      selectForm(state).pendingStepCompletion = {
        changes,
        showAlert: true,
      };
    } else {
      applyStepChanges(
        selectForm(state),
        context,
        changes,
        demoStepHandlerRegistry,
        answerStepHandlers,
        {
          nextMode: config.stepChangesNextMode,
          finalSummaryFallbackStep: config.finalSummaryFallbackStep,
        },
      );
    }
  });

  builder.addCase(actions.stepCompletionConfirmed, (state) => {
    const pending = selectForm(state).pendingStepCompletion;
    if (pending) {
      applyStepChanges(
        selectForm(state),
        buildContext(state),
        pending.changes,
        demoStepHandlerRegistry,
        answerStepHandlers,
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
    const form = selectForm(state);
    const context = buildContext(state);
    const handler = demoStepHandlerRegistry[form.currentStep];

    if (handler.getPreviousStepId) {
      navigateToAndLoadStep(
        form,
        context,
        handler.getPreviousStepId({ context, answers: form.steps }),
        demoStepHandlerRegistry,
      );
      return;
    }

    const currentIndex = form.stepsSequence.indexOf(form.currentStep);
    const previousStep = currentIndex > 0 ? form.stepsSequence[currentIndex - 1] : undefined;
    if (previousStep) {
      navigateToAndLoadStep(form, context, previousStep, demoStepHandlerRegistry);
    } else {
      config.onPreviousStepFallback?.(state);
    }
  });

  builder.addCase(actions.nextStepRequested, (state) => {
    const form = selectForm(state);
    const context = buildContext(state);
    const handler = demoStepHandlerRegistry[form.currentStep];

    if (handler.getNextStepId) {
      navigateToAndLoadStep(
        form,
        context,
        handler.getNextStepId({ context, answers: form.steps }),
        demoStepHandlerRegistry,
      );
    }
  });

  builder.addCase(actions.stepNavigationRequested, (state, action) => {
    navigateToAndLoadStep(
      selectForm(state),
      buildContext(state),
      action.payload.stepId,
      demoStepHandlerRegistry,
    );
  });
};
