import {
  AnswersByStep,
  AnswerStepId,
  SummaryStep,
  IntroductionStep,
  UrbanProjectCreationStep,
} from "@/shared/core/wizard-form/urban-project/urbanProjectSteps";

import { WizardFormState } from "../../wizardForm.reducer";

// Generic decision-encoding shape handed to every step handler method (see ADR-0015):
// `context` is the eager situational data, wrapping the site as `siteData` so the context can
// grow further eager data later without reshaping every handler signature. `context` itself is
// always present (never `undefined`); `siteData` is optional because the engine computes the
// step sequence once before any site is loaded (see `getWizardFormInitialState`). `answers` is
// the accumulated per-step answers state. Urban is still the engine's only consumer, so this is
// defaulted to urban's concrete types rather than threaded generically end-to-end.
export type UrbanStepHandlerContext = {
  siteData: WizardFormState["siteData"];
};

export type StepHandlerParams<
  TContext = UrbanStepHandlerContext,
  TAnswers = WizardFormState["urbanProject"]["steps"],
> = {
  context: TContext;
  answers: TAnswers;
};

interface StepHandler {
  readonly stepId: UrbanProjectCreationStep;
  getNextStepId?(params: StepHandlerParams): UrbanProjectCreationStep;
  getPreviousStepId?(params: StepHandlerParams): UrbanProjectCreationStep;
}

export interface InfoStepHandler extends StepHandler {
  readonly stepId: SummaryStep | IntroductionStep;
}

export interface AnswerStepHandler<T extends AnswerStepId> extends StepHandler {
  readonly stepId: T;
  getNextStepId(params: StepHandlerParams, answers?: AnswersByStep[T]): UrbanProjectCreationStep;
  getPreviousStepId?(params: StepHandlerParams): UrbanProjectCreationStep;
  getDefaultAnswers?(params: StepHandlerParams): AnswersByStep[T] | undefined;
  getRecomputedStepAnswers?(params: StepHandlerParams): AnswersByStep[T] | undefined;
  getDependencyRules?(params: StepHandlerParams, answers: AnswersByStep[T]): StepInvalidationRule[];
  getShortcut?(params: StepHandlerParams, answers: AnswersByStep[T]): ShortcutResult | undefined;
  updateAnswersMiddleware?(params: StepHandlerParams, answers: AnswersByStep[T]): AnswersByStep[T];
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
