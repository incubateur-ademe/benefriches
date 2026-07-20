import { ActionReducerMapBuilder, Draft } from "@reduxjs/toolkit";

import { applyStepChanges } from "@/shared/core/wizard-form/helpers/applyStepChanges";
import {
  computeStepChanges,
  StepUpdateResult,
} from "@/shared/core/wizard-form/helpers/computeStepChanges";
import { navigateToAndLoadStep } from "@/shared/core/wizard-form/helpers/navigateToStep";
import { WizardFormDefinition } from "@/shared/core/wizard-form/wizardForm.reducer";

import { ProjectCreationState } from "../createProject.reducer";
import { RenewableEnergyFormReducerActions } from "./renewableEnergy.actions";
import { AnswersByStep, AnswerStepId, RenewableEnergyCreationStep } from "./renewableEnergySteps";
import { RenewableEnergyStepHandlerContext } from "./step-handlers/stepHandler.type";
import { answerStepHandlers, stepHandlerRegistry } from "./step-handlers/stepHandlerRegistry";

type RenewableEnergyWizardFormDefinition = Pick<
  WizardFormDefinition<
    RenewableEnergyCreationStep,
    RenewableEnergyStepHandlerContext,
    Draft<ProjectCreationState>["renewableEnergyProject"]["steps"],
    Draft<ProjectCreationState>,
    StepUpdateResult<RenewableEnergyCreationStep, AnswersByStep, AnswerStepId>
  >,
  "config" | "selectForm" | "buildContext"
> & {
  registry: typeof answerStepHandlers;
};

const defaultDefinition: RenewableEnergyWizardFormDefinition = {
  config: {
    stepChangesNextMode: "step_order",
    finalSummaryFallbackStep: "RENEWABLE_ENERGY_FINAL_SUMMARY",
  },
  registry: answerStepHandlers,
  selectForm: (state) => state.renewableEnergyProject,
  buildContext: (state) => ({ siteData: state.siteData }),
};

// PV's WizardFormDefinition-shaped wiring: same registry that ticket 09's editing slice will
// reuse, running the same shared engine algorithm as urban's `addUrbanProjectFormCasesToBuilder`.
// PV has no dependency rules/shortcuts (degenerate path), so `computeStepChanges` always yields
// empty cascadingChanges and `applyStepChanges` is called unconditionally — there is no
// pending-confirmation state to wire up.
export const addRenewableEnergyFormCasesToBuilder = (
  builder: ActionReducerMapBuilder<ProjectCreationState>,
  actions: RenewableEnergyFormReducerActions,
  definition: RenewableEnergyWizardFormDefinition = defaultDefinition,
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
      state.currentProjectFlow = "USE_CASE_SELECTION";
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
};
