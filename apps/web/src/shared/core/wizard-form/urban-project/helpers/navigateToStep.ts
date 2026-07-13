import { ProjectFormState } from "../../projectForm.reducer";
import { answerStepHandlers } from "../step-handlers/stepHandlerRegistry";
import { isAnswersStep, UrbanProjectCreationStep } from "../urbanProjectSteps";
import { MutateStateHelper } from "./mutateState";

export const navigateToAndLoadStep = (
  state: ProjectFormState,
  stepId: UrbanProjectCreationStep,
) => {
  if (isAnswersStep(stepId)) {
    const handler = answerStepHandlers[stepId];
    if (handler.getDefaultAnswers && !state.urbanProject.steps[stepId]?.defaultValues) {
      const defaults = handler.getDefaultAnswers({
        siteData: state.siteData,
        stepsState: state.urbanProject.steps,
      });

      if (defaults) {
        MutateStateHelper.setDefaultValues<typeof stepId>(state, stepId, defaults);
      }
    }
  }

  MutateStateHelper.navigateToStep(state, stepId);
};
