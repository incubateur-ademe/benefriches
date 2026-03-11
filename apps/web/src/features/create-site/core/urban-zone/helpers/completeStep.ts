import type { SiteCreationState } from "../../createSite.reducer";
import { answerStepHandlers } from "../step-handlers/stepHandlerRegistry";
import type { StepCompletionPayload } from "../urban-zone.actions";
import type { SchematizedAnswerStepId, UrbanZoneSiteCreationStep } from "../urbanZoneSteps";
import { navigateToAndLoadStep } from "./navigateToStep";
import { MutateStateHelper } from "./stateHelpers";
import { computeStepsSequence } from "./stepsSequence";

type StepUpdateResult<T extends SchematizedAnswerStepId> = {
  payload: StepCompletionPayload<T>;
  shortcutComplete?: StepCompletionPayload[];
  navigationTarget?: UrbanZoneSiteCreationStep;
};

export function computeStepChanges<T extends SchematizedAnswerStepId>(
  state: SiteCreationState,
  payload: StepCompletionPayload<T>,
): StepUpdateResult<T> {
  const handler = answerStepHandlers[payload.stepId];
  if (!handler) throw new Error(`No handler registered for step ${String(payload.stepId)}`);

  const context = {
    siteData: state.siteData,
    stepsState: state.urbanZone.steps,
  };

  const newPayload = {
    stepId: payload.stepId,
    answers: handler.updateAnswersMiddleware
      ? handler.updateAnswersMiddleware(context, payload.answers)
      : payload.answers,
  };

  if (handler.getShortcut) {
    const shortcut = handler.getShortcut(context, newPayload.answers);
    if (shortcut) {
      return {
        payload: newPayload,
        shortcutComplete: shortcut.complete,
        navigationTarget: shortcut.next,
      };
    }
  }

  const navigationTarget = handler.getNextStepId?.(context, newPayload.answers);

  return {
    payload: newPayload,
    navigationTarget,
  };
}

export function applyStepChanges<T extends SchematizedAnswerStepId>(
  state: SiteCreationState,
  changes: StepUpdateResult<T>,
): void {
  const { payload } = changes;

  MutateStateHelper.completeStep(state, payload.stepId, payload.answers);

  changes.shortcutComplete?.forEach((shortcutPayload) => {
    MutateStateHelper.completeStepFromPayload(state, shortcutPayload);
  });

  state.urbanZone.stepsSequence = computeStepsSequence(
    {
      siteData: state.siteData,
      stepsState: state.urbanZone.steps,
    },
    state.urbanZone.firstSequenceStep,
  );

  if (changes.navigationTarget) {
    navigateToAndLoadStep(state, changes.navigationTarget);
  }
}
