import { ProjectCreationState } from "../../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../../urban-project/creationSteps";
import { ShortcutResult } from "../step-handlers/stepHandler.type";
import { stepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";
import { StepCompletionPayload } from "../urbanProject.actions";
import { AnswerStepId } from "../urbanProjectSteps";
import { MutateStateHelper } from "./mutateState";

export type StepUpdateResult<T extends AnswerStepId> = {
  payload: StepCompletionPayload<T>;
  shortcutComplete?: StepCompletionPayload[];
  cascadingChanges?: StepCascadingChanges;
  navigationTarget?: UrbanProjectCustomCreationStep;
};

type StepCascadingChanges = {
  deletedSteps?: AnswerStepId[];
  recomputedSteps?: AnswerStepId[];
  invalidSteps?: AnswerStepId[];
};

function collectStepInvalidations(invalidations?: {
  deleted?: AnswerStepId[];
  invalid?: AnswerStepId[];
  recomputed?: AnswerStepId[];
}) {
  const deletedSteps = new Set<AnswerStepId>();
  const recomputedSteps = new Set<AnswerStepId>();
  const invalidSteps = new Set<AnswerStepId>();

  if (invalidations) {
    const { deleted, recomputed, invalid } = invalidations;

    deleted?.forEach((step) => deletedSteps.add(step));
    recomputed?.forEach((step) => recomputedSteps.add(step));
    invalid?.forEach((step) => invalidSteps.add(step));
  }
  return { deletedSteps, recomputedSteps, invalidSteps };
}

function processShortcutInvalidations(
  handlerContext: {
    siteData: ProjectCreationState["siteData"];
    stepsState: ProjectCreationState["urbanProjectBeta"]["steps"];
  },
  shortcutsComplete: ShortcutResult["complete"],
  invalidations: {
    deletedSteps: Set<AnswerStepId>;
    recomputedSteps: Set<AnswerStepId>;
    invalidSteps: Set<AnswerStepId>;
  },
) {
  shortcutsComplete.forEach((completeStepShortcut) => {
    invalidations.deletedSteps.delete(completeStepShortcut.stepId);
    invalidations.invalidSteps.delete(completeStepShortcut.stepId);

    const shortcutHandler = stepHandlerRegistry[completeStepShortcut.stepId];
    const shortcutInvalidations = shortcutHandler.getStepsToInvalidate?.(
      handlerContext,
      completeStepShortcut.answers,
    );

    if (shortcutInvalidations) {
      shortcutInvalidations.deleted?.forEach((step) => invalidations.deletedSteps.add(step));
      shortcutInvalidations.recomputed?.forEach((step) => invalidations.recomputedSteps.add(step));
      shortcutInvalidations.invalid?.forEach((step) => invalidations.invalidSteps.add(step));
    }
  });

  return formatCascadingChanges(invalidations);
}

function formatCascadingChanges(invalidations: {
  deletedSteps: Set<AnswerStepId>;
  recomputedSteps: Set<AnswerStepId>;
  invalidSteps: Set<AnswerStepId>;
}): StepCascadingChanges | undefined {
  const hasChanges =
    invalidations.deletedSteps.size > 0 ||
    invalidations.recomputedSteps.size > 0 ||
    invalidations.invalidSteps.size > 0;

  return hasChanges
    ? {
        deletedSteps: Array.from(invalidations.deletedSteps),
        recomputedSteps: Array.from(invalidations.recomputedSteps),
        invalidSteps: Array.from(invalidations.invalidSteps),
      }
    : undefined;
}

export function computeStepChanges<T extends AnswerStepId>(
  state: ProjectCreationState,
  payload: StepCompletionPayload<T>,
): StepUpdateResult<T> {
  const handler = stepHandlerRegistry[payload.stepId];
  const handlerContext = { siteData: state.siteData, stepsState: state.urbanProjectBeta.steps };

  const newPayload = {
    stepId: payload.stepId,
    answers: handler.updateAnswersMiddleware
      ? handler.updateAnswersMiddleware(handlerContext, payload.answers)
      : payload.answers,
  };

  const { deletedSteps, recomputedSteps, invalidSteps } = collectStepInvalidations(
    handler.getStepsToInvalidate
      ? handler.getStepsToInvalidate(handlerContext, newPayload.answers)
      : undefined,
  );

  if (handler.getShortcut) {
    const shortcut = handler.getShortcut(handlerContext, newPayload.answers);

    if (shortcut) {
      return {
        payload: newPayload,
        shortcutComplete: shortcut.complete,
        cascadingChanges: processShortcutInvalidations(handlerContext, shortcut.complete, {
          deletedSteps,
          recomputedSteps,
          invalidSteps,
        }),
        navigationTarget: shortcut.next,
      };
    }
  }
  return {
    payload: newPayload,
    cascadingChanges: formatCascadingChanges({ deletedSteps, recomputedSteps, invalidSteps }),
    navigationTarget: handler.getNextStepId({
      siteData: state.siteData,
      stepsState: state.urbanProjectBeta.steps,
    }),
  };
}

export function applyStepChanges<T extends AnswerStepId>(
  state: ProjectCreationState,
  changes: StepUpdateResult<T>,
): void {
  const { cascadingChanges, payload, shortcutComplete } = changes;

  MutateStateHelper.completeStep(state, payload.stepId, payload.answers);

  shortcutComplete?.forEach((stepShortcut) => {
    MutateStateHelper.completeStep(state, stepShortcut.stepId, stepShortcut.answers);
  });

  cascadingChanges?.deletedSteps?.forEach((stepId) => {
    MutateStateHelper.deleteStep(state, stepId);
  });

  cascadingChanges?.invalidSteps?.forEach((stepId) => {
    MutateStateHelper.invalidateStep(state, stepId);
  });

  cascadingChanges?.recomputedSteps?.forEach((stepId) => {
    const newValue =
      stepHandlerRegistry[stepId].getDefaultAnswers &&
      stepHandlerRegistry[stepId].getDefaultAnswers({
        siteData: state.siteData,
        stepsState: state.urbanProjectBeta.steps,
      });
    if (newValue) {
      MutateStateHelper.recomputeStep(state, stepId, newValue);
    }
  });

  if (changes.navigationTarget) {
    MutateStateHelper.navigateToStep(state, changes.navigationTarget);
  }
}
