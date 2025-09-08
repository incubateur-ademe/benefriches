import { ProjectCreationState } from "../../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../../urban-project/creationSteps";
import { stepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";
import { isAnswersStep } from "../urbanProjectSteps";
import { MutateStateHelper } from "./mutateState";

export const navigateToAndLoadStep = (
  state: ProjectCreationState,
  stepId: UrbanProjectCustomCreationStep,
) => {
  if (isAnswersStep(stepId)) {
    const handler = stepHandlerRegistry[stepId];
    if (handler.getDefaultAnswers && !state.urbanProjectBeta.steps[stepId]?.defaultValues) {
      const defaults = handler.getDefaultAnswers({
        siteData: state.siteData,
        stepsState: state.urbanProjectBeta.steps,
      });

      if (defaults) {
        MutateStateHelper.setDefaultValues<typeof stepId>(state, stepId, defaults);
      }
    }
  }

  MutateStateHelper.navigateToStep(state, stepId);
};
