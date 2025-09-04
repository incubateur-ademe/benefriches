import { ProjectCreationState } from "../../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../../urban-project/creationSteps";
import { AnswersByStep, AnswerStepId, InformationalStep } from "../urbanProjectSteps";

type StepContext = {
  siteData?: ProjectCreationState["siteData"];
  stepsState: ProjectCreationState["urbanProjectEventSourcing"]["steps"];
};

export interface StepHandler {
  readonly stepId: UrbanProjectCustomCreationStep;
  getNextStepId?(context: StepContext): UrbanProjectCustomCreationStep;
  getPreviousStepId?(context: StepContext): UrbanProjectCustomCreationStep;
}

export interface InfoStepHandler extends StepHandler {
  readonly stepId: InformationalStep;
}

export interface AnswerStepHandler<T extends AnswerStepId> extends StepHandler {
  readonly stepId: T;
  getNextStepId(context: StepContext): UrbanProjectCustomCreationStep;
  getPreviousStepId(context: StepContext): UrbanProjectCustomCreationStep;
  getDefaultAnswers?(context: StepContext): AnswersByStep[T] | undefined;
  getStepsToInvalidate?(
    context: StepContext,
    previous: AnswersByStep[T],
    current: AnswersByStep[T],
  ): AnswerStepId[];
  getShortcut?(
    context: StepContext,
    answers: AnswersByStep[T],
    hasChanged?: boolean,
  ): ShortcutResult | undefined;
  updateAnswersMiddleware?(context: StepContext, answers: AnswersByStep[T]): AnswersByStep[T];
}

type AnswerPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    payload: AnswersByStep[P];
    invalidSteps: AnswerStepId[];
  };
}[K];
type ShortcutResult = {
  complete: AnswerPayload[];
  next: UrbanProjectCustomCreationStep;
};
