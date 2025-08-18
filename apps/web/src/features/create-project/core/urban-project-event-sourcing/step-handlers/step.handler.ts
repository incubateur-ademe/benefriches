import { ProjectCreationState } from "../../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../../urban-project/creationSteps";

export type StepContext = ProjectCreationState;

export interface StepHandler {
  previous(context: StepContext): void;
  next(context: StepContext): void;
}

export abstract class BaseStepHandler {
  protected abstract readonly stepId: UrbanProjectCustomCreationStep;

  abstract previous(context: StepContext): void;
  abstract next(context: StepContext): void;

  protected navigateTo(context: StepContext, stepId: UrbanProjectCustomCreationStep): void {
    context.urbanProjectEventSourcing.currentStep = stepId;
  }
}
