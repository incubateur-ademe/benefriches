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

// Generic over `S` (a structural superset of `SiteCreationState`, mirroring
// `CustomWizardFormDefinition` on the custom bundle — ticket 10/11) so both creation
// (`SiteCreationState` itself) and the update flow (`SiteUpdateState`) can drive this
// case-adder against their own concrete state.
export type UrbanZoneWizardFormDefinition<S extends SiteCreationState = SiteCreationState> = Pick<
  WizardFormDefinition<
    UrbanZoneSiteCreationStep,
    UrbanZoneStepHandlerContext,
    Draft<S>["urbanZone"]["steps"],
    Draft<S>,
    StepUpdateResult<UrbanZoneSiteCreationStep, AnswersByStep, SchematizedAnswerStepId>
  >,
  "config" | "selectForm" | "buildContext"
>;

// Urban zone's WizardFormDefinition-shaped wiring, mirroring the PV "degenerate" template
// (renewableEnergyForm.reducer.ts) and demoForm.reducer.ts: no handler in THIS registry
// (urban-zone's own step handlers) implements getDependencyRules, so `computeStepChanges`
// always yields empty cascadingChanges for urban-zone's own sub-flow — there is no
// pending-confirmation state to wire up here in practice, but the full action set is still
// wired for consistency with the shared engine contract (and future dependency rules, per
// ADR-0008). This is no longer true of the site wizard as a whole: the custom flow's own
// ADDRESS handler (../steps/address/address.handlers.ts) declares rules and its
// pending-confirmation dialog is wired in views/custom/CustomSiteCascadingUpdateDialog.tsx — see
// ticket 12. A user can still reach ADDRESS from within urban-zone via `onPreviousStepFallback`;
// any resulting cascade is computed and confirmed there, in the custom-flow's own state, not here.
export const addUrbanZoneFormCasesToBuilder = <S extends SiteCreationState>(
  builder: ActionReducerMapBuilder<S>,
  actions: UrbanZoneFormPureActions,
  definition: UrbanZoneWizardFormDefinition<S>,
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
          groupOf: config.groupOf,
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
          groupOf: config.groupOf,
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
