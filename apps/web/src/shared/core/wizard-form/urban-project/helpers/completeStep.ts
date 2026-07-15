import { MutateStateHelper } from "../../helpers/mutateState";
import { WizardFormState } from "../../wizardForm.reducer";
import {
  ShortcutResult,
  StepInvalidationRule,
  UrbanStepHandlerContext,
} from "../step-handlers/stepHandler.type";
import { answerStepHandlers } from "../step-handlers/stepHandlerRegistry";
import { StepCompletionPayload } from "../urbanProject.actions";
import {
  AnswersByStep,
  AnswerStepId,
  isAnswersStep,
  UrbanProjectCreationStep,
} from "../urbanProjectSteps";
import { navigateToAndLoadStep } from "./navigateToStep";
import { ReadStateHelper } from "./readState";
import { computeProjectStepsSequence } from "./stepsSequence";

export type StepUpdateResult<T extends AnswerStepId> = {
  payload: StepCompletionPayload<T>;
  shortcutComplete?: StepCompletionPayload[];
  cascadingChanges?: StepInvalidationRule[];
  navigationTarget?: UrbanProjectCreationStep;
};

function processShortcutInvalidations(
  handlerParams: {
    context: UrbanStepHandlerContext;
    answers: WizardFormState["urbanProject"]["steps"];
  },
  shortcutsComplete: ShortcutResult["complete"],
  dependencyRules: StepInvalidationRule[],
) {
  return shortcutsComplete.reduce(
    (rules, completeStepShortcut) => {
      // replace or remove current completed step from invalidation rules
      const newRules = rules.filter((r) => r.stepId !== completeStepShortcut.stepId);

      const shortcutHandler = answerStepHandlers[completeStepShortcut.stepId];
      const shortcutDependencyRules = shortcutHandler.getDependencyRules?.(
        handlerParams,
        completeStepShortcut.answers,
      );

      if (shortcutDependencyRules) {
        return [
          ...newRules.filter(
            (r) => !shortcutDependencyRules.find((sdr) => sdr.stepId === r.stepId),
          ),
          ...shortcutDependencyRules,
        ];
      }
      return newRules;
    },
    [...dependencyRules],
  );
}

/**
 * La validation d'une étape entraîne plusieurs conséquences :
 * - On utilise la méthode updateAnswersMiddleware si elle existe pour enrichir automatiquement la réponse
 *   (ex: si buildingsResalePlannedAfterDevelopment = true, on peut initialiser une valeur pour futureOperator)
 * - On récupère les potentielles étapes impactées par le changement (s'il s'agit d'une modif de réponse)
 * - On récupère les éventuels raccourcis liés à la réponse (ex: sélection d'un seul type d'espace, on peut remplir
 *   automatiquement l'étape des surfaces en assignant le total)
 * - On récupère les potentielles étapes impactées par le changement des shortcuts et on supprime les étapes complétées par le shortcut
 *   des étapes à invalider
 * - On navigue vers l'étape suivante
 */
export function computeStepChanges<T extends AnswerStepId>(
  state: WizardFormState,
  payload: StepCompletionPayload<T>,
): StepUpdateResult<T> {
  const handler = answerStepHandlers[payload.stepId];
  const handlerParams = {
    context: { siteData: state.siteData },
    answers: state.urbanProject.steps,
  };

  const newPayload = {
    stepId: payload.stepId,
    answers: handler.updateAnswersMiddleware
      ? handler.updateAnswersMiddleware(handlerParams, payload.answers)
      : payload.answers,
  };

  const dependencyRules = handler.getDependencyRules
    ? handler.getDependencyRules(handlerParams, newPayload.answers)
    : [];

  if (handler.getShortcut) {
    const shortcut = handler.getShortcut(handlerParams, newPayload.answers);

    if (shortcut) {
      return {
        payload: newPayload,
        shortcutComplete: shortcut.complete,
        cascadingChanges: processShortcutInvalidations(
          handlerParams,
          shortcut.complete,
          dependencyRules,
        ),
        navigationTarget: shortcut.next,
      };
    }
  }
  return {
    payload: newPayload,
    cascadingChanges: dependencyRules,
    navigationTarget: handler.getNextStepId(handlerParams, payload.answers),
  };
}

type StepChangesConfig = {
  nextMode: "step_order" | "next_empty";
};
export function applyStepChanges<T extends AnswerStepId>(
  state: WizardFormState,
  changes: StepUpdateResult<T>,
  config: StepChangesConfig,
): void {
  const { cascadingChanges, payload, shortcutComplete } = changes;

  MutateStateHelper.completeStep(state.urbanProject, payload.stepId, payload.answers);

  shortcutComplete?.forEach((stepShortcut) => {
    MutateStateHelper.completeStepFromPayload(state.urbanProject, stepShortcut);
  });

  cascadingChanges?.forEach(({ stepId, action }) => {
    switch (action) {
      case "delete":
        MutateStateHelper.deleteStep<UrbanProjectCreationStep, AnswersByStep>(
          state.urbanProject,
          stepId,
        );
        break;
      case "invalidate":
        MutateStateHelper.invalidateStep<UrbanProjectCreationStep, AnswersByStep>(
          state.urbanProject,
          stepId,
        );
        break;
      case "recompute": {
        const newValue = answerStepHandlers[stepId].getRecomputedStepAnswers?.({
          context: { siteData: state.siteData },
          answers: state.urbanProject.steps,
        });
        if (newValue) {
          MutateStateHelper.recomputeStep(state.urbanProject, stepId, newValue);
        }
      }
    }
  });

  // mets à jour les étapes à compléter dans l'ordre pour finaliser le formulaire
  state.urbanProject.stepsSequence = computeProjectStepsSequence(
    { context: { siteData: state.siteData }, answers: state.urbanProject.steps },
    state.urbanProject.firstSequenceStep,
  );

  if (config.nextMode == "step_order" && changes.navigationTarget) {
    navigateToAndLoadStep(state, changes.navigationTarget);
  } else {
    const nextEmptyStep = state.urbanProject.stepsSequence.find(
      (stepId) =>
        isAnswersStep(stepId) &&
        !ReadStateHelper.getStep(state.urbanProject.steps, stepId)?.completed,
    );
    navigateToAndLoadStep(state, nextEmptyStep ?? "URBAN_PROJECT_FINAL_SUMMARY");
  }

  state.urbanProject.saveState = "dirty";
}
