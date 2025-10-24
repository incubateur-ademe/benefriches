import {
  ShortcutResult,
  StepInvalidationRule,
} from "../../../../../../features/create-project/core/urban-project/step-handlers/stepHandler.type";
import { stepHandlerRegistry } from "../../../../../../features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";
import { StepCompletionPayload } from "../urbanProject.actions";
import { ProjectFormState } from "../urbanProject.reducer";
import { AnswerStepId, UrbanProjectCreationStep } from "../urbanProjectSteps";
import { MutateStateHelper } from "./mutateState";
import { navigateToAndLoadStep } from "./navigateToStep";

export type StepUpdateResult<T extends AnswerStepId> = {
  payload: StepCompletionPayload<T>;
  shortcutComplete?: StepCompletionPayload[];
  cascadingChanges?: StepInvalidationRule[];
  navigationTarget?: UrbanProjectCreationStep;
};

function processShortcutInvalidations(
  handlerContext: {
    siteData: ProjectFormState["siteData"];
    stepsState: ProjectFormState["urbanProject"]["steps"];
  },
  shortcutsComplete: ShortcutResult["complete"],
  dependencyRules: StepInvalidationRule[],
) {
  return shortcutsComplete.reduce(
    (rules, completeStepShortcut) => {
      // replace or remove current completed step from invalidation rules
      const newRules = rules.filter((r) => r.stepId !== completeStepShortcut.stepId);

      const shortcutHandler = stepHandlerRegistry[completeStepShortcut.stepId];
      const shortcutDependencyRules = shortcutHandler.getDependencyRules?.(
        handlerContext,
        completeStepShortcut.answers,
      );

      if (shortcutDependencyRules) {
        newRules
          .filter((r) => !shortcutDependencyRules.find((sdr) => sdr.stepId === r.stepId))
          .push(...shortcutDependencyRules);
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
  state: ProjectFormState,
  payload: StepCompletionPayload<T>,
): StepUpdateResult<T> {
  const handler = stepHandlerRegistry[payload.stepId];
  const handlerContext = { siteData: state.siteData, stepsState: state.urbanProject.steps };

  const newPayload = {
    stepId: payload.stepId,
    answers: handler.updateAnswersMiddleware
      ? handler.updateAnswersMiddleware(handlerContext, payload.answers)
      : payload.answers,
  };

  const dependencyRules = handler.getDependencyRules
    ? handler.getDependencyRules(handlerContext, newPayload.answers)
    : [];

  if (handler.getShortcut) {
    const shortcut = handler.getShortcut(handlerContext, newPayload.answers);

    if (shortcut) {
      return {
        payload: newPayload,
        shortcutComplete: shortcut.complete,
        cascadingChanges: processShortcutInvalidations(
          handlerContext,
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
    navigationTarget: handler.getNextStepId(
      {
        siteData: state.siteData,
        stepsState: state.urbanProject.steps,
      },
      payload.answers,
    ),
  };
}

export function applyStepChanges<T extends AnswerStepId>(
  state: ProjectFormState,
  changes: StepUpdateResult<T>,
): void {
  const { cascadingChanges, payload, shortcutComplete } = changes;

  MutateStateHelper.completeStep(state, payload.stepId, payload.answers);

  shortcutComplete?.forEach((stepShortcut) => {
    MutateStateHelper.completeStep(state, stepShortcut.stepId, stepShortcut.answers);
  });

  cascadingChanges?.forEach(({ stepId, action }) => {
    switch (action) {
      case "delete":
        MutateStateHelper.deleteStep(state, stepId);
        break;
      case "invalidate":
        MutateStateHelper.invalidateStep(state, stepId);
        break;
      case "recompute": {
        const newValue =
          stepHandlerRegistry[stepId].getRecomputedStepAnswers &&
          stepHandlerRegistry[stepId].getRecomputedStepAnswers({
            siteData: state.siteData,
            stepsState: state.urbanProject.steps,
          });
        if (newValue) {
          MutateStateHelper.recomputeStep(state, stepId, newValue);
        }
      }
    }
  });

  if (changes.navigationTarget) {
    navigateToAndLoadStep(state, changes.navigationTarget);
  }
}
