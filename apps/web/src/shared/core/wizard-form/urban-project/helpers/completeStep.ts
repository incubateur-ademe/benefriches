import {
  computeStepChanges as genericComputeStepChanges,
  StepUpdateResult as GenericStepUpdateResult,
} from "../../helpers/computeStepChanges";
import { MutateStateHelper } from "../../helpers/mutateState";
import { navigateToAndLoadStep } from "../../helpers/navigateToStep";
import { ReadStateHelper } from "../../helpers/readState";
import { computeStepsSequence } from "../../helpers/stepsSequence";
import { WizardFormState } from "../../wizardForm.reducer";
import { UrbanStepHandlerContext } from "../step-handlers/stepHandler.type";
import { answerStepHandlers, stepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";
import { StepCompletionPayload } from "../urbanProject.actions";
import {
  AnswersByStep,
  AnswerStepId,
  isAnswersStep,
  UrbanProjectCreationStep,
} from "../urbanProjectSteps";

export type StepUpdateResult<T extends AnswerStepId> = GenericStepUpdateResult<
  UrbanProjectCreationStep,
  AnswersByStep,
  T
>;

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
  const context: UrbanStepHandlerContext = { siteData: state.siteData };
  return genericComputeStepChanges(answerStepHandlers, context, state.urbanProject.steps, payload);
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
  state.urbanProject.stepsSequence = computeStepsSequence(
    { context: { siteData: state.siteData }, answers: state.urbanProject.steps },
    state.urbanProject.firstSequenceStep,
    stepHandlerRegistry,
  );

  if (config.nextMode == "step_order" && changes.navigationTarget) {
    navigateToAndLoadStep(
      state.urbanProject,
      { siteData: state.siteData },
      changes.navigationTarget,
      stepHandlerRegistry,
    );
  } else {
    const nextEmptyStep = state.urbanProject.stepsSequence.find(
      (stepId) =>
        isAnswersStep(stepId) &&
        !ReadStateHelper.getStep(state.urbanProject.steps, stepId)?.completed,
    );
    navigateToAndLoadStep(
      state.urbanProject,
      { siteData: state.siteData },
      nextEmptyStep ?? "URBAN_PROJECT_FINAL_SUMMARY",
      stepHandlerRegistry,
    );
  }

  state.urbanProject.saveState = "dirty";
}
