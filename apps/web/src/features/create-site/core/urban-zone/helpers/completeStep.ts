import type { SiteCreationState } from "../../createSite.reducer";
import type { AnswerStepHandler } from "../step-handlers/stepHandler.type";
import { urbanZoneStepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";
import type { StepCompletionPayload } from "../urban-zone.actions";
import type { SchematizedAnswerStepId, UrbanZoneSiteCreationStep } from "../urbanZoneSteps";
import { MutateStateHelper } from "./mutateState";
import { navigateToAndLoadStep } from "./navigateToStep";
import { computeStepsSequence } from "./stepsSequence";

type StepUpdateResult<T extends SchematizedAnswerStepId> = {
  payload: StepCompletionPayload<T>;
  shortcutComplete?: StepCompletionPayload<SchematizedAnswerStepId>[];
  navigationTarget?: UrbanZoneSiteCreationStep;
};

export function computeStepChanges<T extends SchematizedAnswerStepId>(
  state: SiteCreationState,
  payload: StepCompletionPayload<T>,
): StepUpdateResult<T> {
  // Cast is safe: the registry key matches the handler's generic parameter
  const handler = urbanZoneStepHandlerRegistry[payload.stepId] as AnswerStepHandler<T>;
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
        shortcutComplete: shortcut.complete as StepCompletionPayload<SchematizedAnswerStepId>[],
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
    MutateStateHelper.completeStep(state, shortcutPayload.stepId, shortcutPayload.answers);
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
