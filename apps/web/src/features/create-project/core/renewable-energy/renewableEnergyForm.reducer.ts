import { ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";

import { applyStepChanges } from "@/shared/core/wizard-form/helpers/applyStepChanges";
import {
  computeStepChanges,
  StepUpdateResult,
} from "@/shared/core/wizard-form/helpers/computeStepChanges";
import { navigateToAndLoadStep } from "@/shared/core/wizard-form/helpers/navigateToStep";
import {
  WizardFormDefinition,
  WizardFormSubState,
} from "@/shared/core/wizard-form/wizardForm.reducer";

import { RenewableEnergyFormReducerActions } from "./renewableEnergy.actions";
import { AnswersByStep, AnswerStepId, RenewableEnergyCreationStep } from "./renewableEnergySteps";
import {
  RenewableEnergyStepHandlerContext,
  RenewableEnergyStepsState,
} from "./step-handlers/stepHandler.type";
import { answerStepHandlers, stepHandlerRegistry } from "./step-handlers/stepHandlerRegistry";

// Structural constraint mirroring urban's `S extends UrbanProjectHostState`: any consumer state
// that nests a renewableEnergyProject sub-state shaped like the generic engine's own
// WizardFormSubState can drive this case-adder — creation and update alike (ADR-0015).
type RenewableEnergyHostState = {
  renewableEnergyProject: WizardFormSubState<
    RenewableEnergyCreationStep,
    RenewableEnergyStepsState
  >;
  siteData?: RenewableEnergyStepHandlerContext["siteData"];
};

type RenewableEnergyWizardFormDefinition<S extends RenewableEnergyHostState> = Pick<
  WizardFormDefinition<
    RenewableEnergyCreationStep,
    RenewableEnergyStepHandlerContext,
    Draft<S>["renewableEnergyProject"]["steps"],
    Draft<S>,
    StepUpdateResult<RenewableEnergyCreationStep, AnswersByStep, AnswerStepId>
  >,
  "config" | "selectForm" | "buildContext"
> & {
  registry: typeof answerStepHandlers;
};

// PV's WizardFormDefinition-shaped wiring: same registry that ticket 09's editing slice
// reuses, running the same shared engine algorithm as urban's `addUrbanProjectFormCasesToBuilder`.
// PV has no dependency rules/shortcuts (degenerate path), so `computeStepChanges` always yields
// empty cascadingChanges and `applyStepChanges` is called unconditionally — there is no
// pending-confirmation state to wire up. Generic over `S` (mirroring urban) so creation and
// update can each supply their own definition (selectForm/buildContext/onPreviousStepFallback).
export const addRenewableEnergyFormCasesToBuilder = <S extends RenewableEnergyHostState>(
  builder: ActionReducerMapBuilder<S>,
  actions: RenewableEnergyFormReducerActions,
  definition: RenewableEnergyWizardFormDefinition<S>,
) => {
  const { config, registry: answerRegistry, selectForm, buildContext } = definition;

  builder.addCase(actions.stepCompletionRequested, (state, action) => {
    const context = buildContext(state);
    const changes = computeStepChanges<
      RenewableEnergyCreationStep,
      RenewableEnergyStepHandlerContext,
      AnswersByStep,
      AnswerStepId
    >(answerRegistry, context, selectForm(state).steps, action.payload);

    applyStepChanges(selectForm(state), context, changes, stepHandlerRegistry, answerRegistry, {
      nextMode: config.stepChangesNextMode,
      finalSummaryFallbackStep: config.finalSummaryFallbackStep,
    });
  });

  builder.addCase(actions.previousStepRequested, (state) => {
    const form = selectForm(state);
    const context = buildContext(state);
    const handler = stepHandlerRegistry[form.currentStep];

    if (handler.getPreviousStepId) {
      navigateToAndLoadStep(
        form,
        context,
        handler.getPreviousStepId({ context, answers: form.steps }),
        stepHandlerRegistry,
      );
      return;
    }

    const currentIndex = form.stepsSequence.indexOf(form.currentStep);
    const previousStep = currentIndex > 0 ? form.stepsSequence[currentIndex - 1] : undefined;
    if (previousStep) {
      navigateToAndLoadStep(form, context, previousStep, stepHandlerRegistry);
    } else {
      config.onPreviousStepFallback?.(state);
    }
  });

  builder.addCase(actions.nextStepRequested, (state) => {
    const form = selectForm(state);
    const context = buildContext(state);
    const handler = stepHandlerRegistry[form.currentStep];

    if (handler.getNextStepId) {
      navigateToAndLoadStep(
        form,
        context,
        handler.getNextStepId({ context, answers: form.steps }),
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
};
