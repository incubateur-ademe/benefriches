import type { ProjectSiteView } from "@/shared/core/reducers/project-form/projectForm.types";

import type {
  AnswersByStep,
  AnswerStepId,
  IntroductionStep,
  RenewableEnergyCreationStep,
  SummaryStep,
} from "../renewableEnergySteps";

export type RenewableEnergyStepsState = Partial<{
  [K in AnswerStepId]: {
    completed: boolean;
    payload?: AnswersByStep[K];
    defaultValues?: AnswersByStep[K];
  };
}>;

export type StepContext = {
  siteData?: ProjectSiteView;
  stepsState: RenewableEnergyStepsState;
};

type StepHandler = {
  readonly stepId: RenewableEnergyCreationStep;
  getNextStepId?(context: StepContext): RenewableEnergyCreationStep;
  getPreviousStepId?(context: StepContext): RenewableEnergyCreationStep;
};

export type InfoStepHandler = StepHandler & {
  readonly stepId: SummaryStep | IntroductionStep;
};

export type AnswerStepHandler<T extends AnswerStepId> = Omit<StepHandler, "getNextStepId"> & {
  readonly stepId: T;
  getNextStepId(context: StepContext, answers?: AnswersByStep[T]): RenewableEnergyCreationStep;
  getPreviousStepId?(context: StepContext): RenewableEnergyCreationStep;
  getDefaultAnswers?(context: StepContext): AnswersByStep[T] | undefined;
  updateAnswersMiddleware?(context: StepContext, answers: AnswersByStep[T]): AnswersByStep[T];
};
