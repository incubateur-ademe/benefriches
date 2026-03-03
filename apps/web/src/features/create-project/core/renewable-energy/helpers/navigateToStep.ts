import type { ProjectCreationState } from "../../createProject.reducer";
import type { RenewableEnergyCreationStep } from "../renewableEnergySteps";
import { isAnswersStep } from "../renewableEnergySteps";
import { stepHandlerRegistry } from "../step-handlers/stepHandlerRegistry";
import { MutateStateHelper } from "./mutateState";

export const navigateToAndLoadStep = (
  state: ProjectCreationState,
  stepId: RenewableEnergyCreationStep,
) => {
  if (isAnswersStep(stepId)) {
    const handler = stepHandlerRegistry[stepId];
    if (handler.getDefaultAnswers && !state.renewableEnergyProject.steps[stepId]?.defaultValues) {
      const defaults = handler.getDefaultAnswers({
        siteData: state.siteData,
        stepsState: state.renewableEnergyProject.steps,
      });

      if (defaults) {
        MutateStateHelper.setDefaultValues<typeof stepId>(state, stepId, defaults);
      }
    }
  }

  MutateStateHelper.navigateToStep(state, stepId);
};
