import { ProjectCreationState } from "../../createProject.reducer";
import { UrbanProjectCustomCreationStep } from "../../urban-project/creationSteps";
import { AnswersByStep, AnswerStepId, InformationalStep } from "../urbanProjectSteps";

type StepContext = {
  siteData?: ProjectCreationState["siteData"];
  stepsState: ProjectCreationState["urbanProjectBeta"]["steps"];
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
    answers: AnswersByStep[T],
  ):
    | { deleted?: AnswerStepId[]; invalid?: AnswerStepId[]; recomputed?: AnswerStepId[] }
    | undefined;
  getShortcut?(context: StepContext, answers: AnswersByStep[T]): ShortcutResult | undefined;
  updateAnswersMiddleware?(context: StepContext, answers: AnswersByStep[T]): AnswersByStep[T];
}

type StepAnswerPayload<K extends AnswerStepId = AnswerStepId> = {
  [P in K]: {
    stepId: P;
    answers: AnswersByStep[P];
  };
}[K];
export type ShortcutResult = {
  complete: StepAnswerPayload[];
  next: UrbanProjectCustomCreationStep;
};
