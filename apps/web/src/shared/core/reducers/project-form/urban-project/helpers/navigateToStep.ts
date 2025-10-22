import { stepHandlerRegistry } from "../../../../../../features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";
import { ProjectFormState } from "../../projectForm.reducer";
import { isAnswersStep, UrbanProjectCreationStep } from "../urbanProjectSteps";
import { MutateStateHelper } from "./mutateState";

export const navigateToAndLoadStep = (
  state: ProjectFormState,
  stepId: UrbanProjectCreationStep,
) => {
  if (isAnswersStep(stepId)) {
    const handler = stepHandlerRegistry[stepId];
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
