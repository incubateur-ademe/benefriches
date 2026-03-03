import type { ProjectCreationState } from "../../createProject.reducer";
import type { StepCompletionPayload } from "../renewableEnergy.actions";
import type { AnswerStepId, RenewableEnergyCreationStep } from "../renewableEnergySteps";
import type { AnswerStepHandler } from "../step-handlers/stepHandler.type";
import { stepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";
import { MutateStateHelper } from "./mutateState";
import { navigateToAndLoadStep } from "./navigateToStep";
import { computeStepsSequence } from "./stepsSequence";

type StepUpdateResult<T extends AnswerStepId> = {
  payload: StepCompletionPayload<T>;
  navigationTarget?: RenewableEnergyCreationStep;
};

export function computeStepChanges<T extends AnswerStepId>(
  state: ProjectCreationState,
  payload: StepCompletionPayload<T>,
): StepUpdateResult<T> {
  // Cast is safe: the registry key matches the handler's generic parameter
  const handler = stepHandlerRegistry[payload.stepId] as AnswerStepHandler<T>;
  const handlerContext = {
    siteData: state.siteData,
    stepsState: state.renewableEnergyProject.steps,
  };

  const newPayload = {
    stepId: payload.stepId,
    answers: handler.updateAnswersMiddleware
      ? handler.updateAnswersMiddleware(handlerContext, payload.answers)
      : payload.answers,
  };

  const navigationTarget = handler.getNextStepId?.(handlerContext, newPayload.answers);

  return {
    payload: newPayload,
    navigationTarget,
  };
}

export function applyStepChanges<T extends AnswerStepId>(
  state: ProjectCreationState,
  changes: StepUpdateResult<T>,
): void {
  const { payload } = changes;

  MutateStateHelper.completeStep(state, payload.stepId, payload.answers);

  state.renewableEnergyProject.stepsSequence = computeStepsSequence(
    { siteData: state.siteData, stepsState: state.renewableEnergyProject.steps },
    state.renewableEnergyProject.firstSequenceStep,
  );

  if (changes.navigationTarget) {
    navigateToAndLoadStep(state, changes.navigationTarget);
  }
}
