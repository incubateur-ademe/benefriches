import {
  AnswerStepHandlerRegistry,
  ShortcutResult,
  StepAnswerPayload,
  StepHandlerParams,
  StepInvalidationRule,
  WizardFormStepsState,
} from "../stepHandler.type";

export type StepUpdateResult<StepId, TAnswers, K extends keyof TAnswers = keyof TAnswers> = {
  payload: StepAnswerPayload<TAnswers, K>;
  shortcutComplete?: StepAnswerPayload<TAnswers>[];
  cascadingChanges?: StepInvalidationRule<keyof TAnswers>[];
  navigationTarget?: StepId;
};

function processShortcutInvalidations<StepId, TContext, TAnswers>(
  registry: AnswerStepHandlerRegistry<StepId, TContext, TAnswers>,
  handlerParams: StepHandlerParams<TContext, TAnswers>,
  shortcutsComplete: ShortcutResult<StepId, TAnswers>["complete"],
  dependencyRules: StepInvalidationRule<keyof TAnswers>[],
): StepInvalidationRule<keyof TAnswers>[] {
  return shortcutsComplete.reduce(
    (rules, completeStepShortcut) => {
      // replace or remove current completed step from invalidation rules
      const newRules = rules.filter((r) => r.stepId !== completeStepShortcut.stepId);

      const shortcutHandler = registry[completeStepShortcut.stepId];
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
export function computeStepChanges<StepId, TContext, TAnswers, K extends keyof TAnswers>(
  registry: AnswerStepHandlerRegistry<StepId, TContext, TAnswers>,
  context: TContext,
  answers: WizardFormStepsState<TAnswers>,
  payload: StepAnswerPayload<TAnswers, K>,
): StepUpdateResult<StepId, TAnswers, K> {
  const handler = registry[payload.stepId];
  const handlerParams: StepHandlerParams<TContext, TAnswers> = { context, answers };

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
          registry,
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
