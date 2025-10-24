import {
  AnswersByStep,
  AnswerStepId,
  InformationalStep,
  UrbanProjectCreationStep,
} from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { ProjectFormState } from "../../projectForm.reducer";

export type StepContext = {
  siteData?: ProjectFormState["siteData"];
  stepsState: ProjectFormState["urbanProject"]["steps"];
};

interface StepHandler {
  readonly stepId: UrbanProjectCreationStep;
  getNextStepId?(context: StepContext): UrbanProjectCreationStep;
  getPreviousStepId?(context: StepContext): UrbanProjectCreationStep;
}

export interface InfoStepHandler extends StepHandler {
  readonly stepId: InformationalStep;
}

export interface AnswerStepHandler<T extends AnswerStepId> extends StepHandler {
  readonly stepId: T;
  getNextStepId(context: StepContext, answers?: AnswersByStep[T]): UrbanProjectCreationStep;
  getPreviousStepId?(context: StepContext): UrbanProjectCreationStep;
  getDefaultAnswers?(context: StepContext): AnswersByStep[T] | undefined;
  getRecomputedStepAnswers?(context: StepContext): AnswersByStep[T] | undefined;
  getDependencyRules?(context: StepContext, answers: AnswersByStep[T]): StepInvalidationRule[];
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
  next: UrbanProjectCreationStep;
};

export type StepInvalidationRule = {
  action: "delete" | "invalidate" | "recompute";
  stepId: AnswerStepId;
};
