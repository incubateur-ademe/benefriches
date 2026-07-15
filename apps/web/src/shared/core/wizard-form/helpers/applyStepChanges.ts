import { AnswerStepHandlerRegistry } from "../stepHandler.type";
import { StepUpdateResult } from "./computeStepChanges";
import { MutableWizardFormState, MutateStateHelper } from "./mutateState";
import { navigateToAndLoadStep, StepRegistry } from "./navigateToStep";
import { ReadStateHelper } from "./readState";
import { computeStepsSequence } from "./stepsSequence";

/**
 * Sub-state `applyStepChanges` mutates: `MutableWizardFormState` plus the bookkeeping fields
 * (`saveState`, `stepsSequence`, `firstSequenceStep`) it also updates on every apply.
 */
export type MutableWizardFormSubState<StepId, TAnswers> = MutableWizardFormState<
  StepId,
  TAnswers
> & {
  saveState: "idle" | "dirty" | "loading" | "success" | "error";
  stepsSequence: StepId[];
  firstSequenceStep: StepId;
};

export type ApplyStepChangesConfig<StepId> = {
  nextMode: "step_order" | "next_empty";
  finalSummaryFallbackStep: StepId;
};

function isAnswerStep<StepId extends string, TContext, TAnswers>(
  stepId: StepId,
  answerRegistry: AnswerStepHandlerRegistry<StepId, TContext, TAnswers>,
): stepId is StepId & keyof TAnswers {
  return stepId in answerRegistry;
}

/**
 * La validation d'une étape entraîne plusieurs conséquences :
 * - On complète l'étape (et les éventuelles étapes complétées par un raccourci)
 * - On applique les changements en cascade (suppression, invalidation, recalcul) sur les étapes dépendantes
 * - On recalcule l'intégralité de la séquence d'étapes à chaque application (pas seulement la navigation)
 * - On navigue vers l'étape suivante (cible du raccourci/handler, ou la première étape non complétée,
 *   ou le fallback de fin de formulaire si tout est complété)
 */
export function applyStepChanges<StepId extends string, TContext, TAnswers>(
  form: MutableWizardFormSubState<StepId, TAnswers>,
  context: TContext,
  changes: StepUpdateResult<StepId, TAnswers>,
  registry: StepRegistry<StepId, TContext, TAnswers>,
  answerRegistry: AnswerStepHandlerRegistry<StepId, TContext, TAnswers>,
  config: ApplyStepChangesConfig<StepId>,
): void {
  const { cascadingChanges, payload, shortcutComplete } = changes;

  MutateStateHelper.completeStep(form, payload.stepId, payload.answers);

  shortcutComplete?.forEach((stepShortcut) => {
    MutateStateHelper.completeStepFromPayload(form, stepShortcut);
  });

  cascadingChanges?.forEach(({ stepId, action }) => {
    switch (action) {
      case "delete":
        MutateStateHelper.deleteStep(form, stepId);
        break;
      case "invalidate":
        MutateStateHelper.invalidateStep(form, stepId);
        break;
      case "recompute": {
        const newValue = answerRegistry[stepId].getRecomputedStepAnswers?.({
          context,
          answers: form.steps,
        });
        if (newValue) {
          MutateStateHelper.recomputeStep(form, stepId, newValue);
        }
      }
    }
  });

  // mets à jour les étapes à compléter dans l'ordre pour finaliser le formulaire
  form.stepsSequence = computeStepsSequence(
    { context, answers: form.steps },
    form.firstSequenceStep,
    registry,
  );

  if (config.nextMode === "step_order" && changes.navigationTarget) {
    navigateToAndLoadStep(form, context, changes.navigationTarget, registry);
  } else {
    const nextEmptyStep = form.stepsSequence.find(
      (stepId) =>
        isAnswerStep(stepId, answerRegistry) &&
        !ReadStateHelper.getStep(form.steps, stepId)?.completed,
    );
    navigateToAndLoadStep(
      form,
      context,
      nextEmptyStep ?? config.finalSummaryFallbackStep,
      registry,
    );
  }

  form.saveState = "dirty";
}
