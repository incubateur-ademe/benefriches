import { MutateStateHelper } from "../../helpers/mutateState";
import { WizardFormState } from "../../wizardForm.reducer";
import { answerStepHandlers } from "../step-handlers/stepHandlerRegistry";
import { AnswersByStep, isAnswersStep, UrbanProjectCreationStep } from "../urbanProjectSteps";

export const navigateToAndLoadStep = (state: WizardFormState, stepId: UrbanProjectCreationStep) => {
  if (isAnswersStep(stepId)) {
    const handler = answerStepHandlers[stepId];
    if (handler.getDefaultAnswers && !state.urbanProject.steps[stepId]?.defaultValues) {
      const defaults = handler.getDefaultAnswers({
        context: { siteData: state.siteData },
        answers: state.urbanProject.steps,
      });

      if (defaults) {
        MutateStateHelper.setDefaultValues<UrbanProjectCreationStep, AnswersByStep, typeof stepId>(
          state.urbanProject,
          stepId,
          defaults,
        );
      }
    }
  }

  MutateStateHelper.navigateToStep(state.urbanProject, stepId);
};
