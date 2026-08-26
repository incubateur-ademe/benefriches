import { ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";

import { applyStepChanges } from "@/shared/core/wizard-form/helpers/applyStepChanges";
import {
  computeStepChanges,
  StepUpdateResult,
} from "@/shared/core/wizard-form/helpers/computeStepChanges";
import { navigateToAndLoadStep } from "@/shared/core/wizard-form/helpers/navigateToStep";
import { WizardFormDefinition } from "@/shared/core/wizard-form/wizardForm.reducer";

import { SiteCreationState } from "../createSite.reducer";
import {
  answerStepHandlers,
  UrbanZoneStepHandlerContext,
  urbanZoneStepHandlerRegistry,
} from "./stepHandlerRegistry";
import { UrbanZoneFormPureActions } from "./urban-zone.actions";
import {
  AnswersByStep,
  SchematizedAnswerStepId,
  UrbanZoneSiteCreationStep,
} from "./urbanZoneSteps";

// Urban zone has exactly one consumer today (create), so this is typed directly against the
// concrete SiteCreationState rather than generic over a host-state param — same pattern as
// demoForm.reducer.ts. The update flow (ticket 06) will call this same builder with a second
// definition (different selectForm), mirroring renewableEnergyForm.reducer.ts.
type UrbanZoneWizardFormDefinition = Pick<
  WizardFormDefinition<
    UrbanZoneSiteCreationStep,
    UrbanZoneStepHandlerContext,
    Draft<SiteCreationState>["urbanZone"]["steps"],
    Draft<SiteCreationState>,
    StepUpdateResult<UrbanZoneSiteCreationStep, AnswersByStep, SchematizedAnswerStepId>
  >,
  "config" | "selectForm" | "buildContext"
>;

// Urban zone's WizardFormDefinition-shaped wiring, mirroring the PV "degenerate" template
// (renewableEnergyForm.reducer.ts) and demoForm.reducer.ts: no handler currently implements
// getDependencyRules, so `computeStepChanges` always yields empty cascadingChanges and
// `applyStepChanges` runs unconditionally — there is no pending-confirmation state to wire up in
// practice, but the full action set is still wired for consistency with the shared engine
// contract (and future dependency rules, per ADR-0008).
export const addUrbanZoneFormCasesToBuilder = (
  builder: ActionReducerMapBuilder<SiteCreationState>,
  actions: UrbanZoneFormPureActions,
  definition: UrbanZoneWizardFormDefinition,
) => {
  const { config, selectForm, buildContext } = definition;

  builder.addCase(actions.stepCompletionRequested, (state, action) => {
    const context = buildContext(state);
    const changes = computeStepChanges<
      UrbanZoneSiteCreationStep,
      UrbanZoneStepHandlerContext,
      AnswersByStep,
      SchematizedAnswerStepId
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
        urbanZoneStepHandlerRegistry,
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
        urbanZoneStepHandlerRegistry,
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
    const handler = urbanZoneStepHandlerRegistry[form.currentStep];

    if (handler.getPreviousStepId) {
      navigateToAndLoadStep(
        form,
        context,
        handler.getPreviousStepId({ context, answers: form.steps }),
        urbanZoneStepHandlerRegistry,
      );
      return;
    }

    const currentIndex = form.stepsSequence.indexOf(form.currentStep);
    const previousStep = currentIndex > 0 ? form.stepsSequence[currentIndex - 1] : undefined;
    if (previousStep) {
      navigateToAndLoadStep(form, context, previousStep, urbanZoneStepHandlerRegistry);
    } else {
      config.onPreviousStepFallback?.(state);
    }
  });

  builder.addCase(actions.nextStepRequested, (state) => {
    const form = selectForm(state);
    const context = buildContext(state);
    const handler = urbanZoneStepHandlerRegistry[form.currentStep];

    if (handler.getNextStepId) {
      navigateToAndLoadStep(
        form,
        context,
        handler.getNextStepId({ context, answers: form.steps }),
        urbanZoneStepHandlerRegistry,
      );
    }
  });

  builder.addCase(actions.stepNavigationRequested, (state, action) => {
    navigateToAndLoadStep(
      selectForm(state),
      buildContext(state),
      action.payload.stepId,
      urbanZoneStepHandlerRegistry,
    );
  });
};
