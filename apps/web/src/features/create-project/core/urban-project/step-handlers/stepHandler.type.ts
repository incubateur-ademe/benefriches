import {
  AnswersByStep,
  AnswerStepId,
  SummaryStep,
  IntroductionStep,
  UrbanProjectCreationStep,
} from "@/features/create-project/core/urban-project/urbanProjectSteps";
import {
  AnswerStepHandler as GenericAnswerStepHandler,
  InfoStepHandler as GenericInfoStepHandler,
  ShortcutResult as GenericShortcutResult,
  StepHandlerParams as GenericStepHandlerParams,
  StepHandlerRegistry as GenericStepHandlerRegistry,
  StepInvalidationRule as GenericStepInvalidationRule,
} from "@/shared/core/wizard-form/stepHandler.type";

import { WizardFormState } from "../urbanProjectForm.state";

// Urban's eager, guaranteed-loaded situational data (see ADR-0015): `context` wraps the site
// as `siteData` so the context can grow further eager data later without reshaping every
// handler signature. Urban is the generic contract's sole consumer today, so this file
// instantiates it with urban's concrete step/answers types rather than threading generics
// end-to-end.
export type UrbanStepHandlerContext = {
  siteData: WizardFormState["siteData"];
};

export type StepHandlerParams<
  TContext = UrbanStepHandlerContext,
  TAnswers = AnswersByStep,
> = GenericStepHandlerParams<TContext, TAnswers>;

export type InfoStepHandler = GenericInfoStepHandler<
  UrbanProjectCreationStep,
  SummaryStep | IntroductionStep,
  UrbanStepHandlerContext,
  AnswersByStep
>;

export type AnswerStepHandler<T extends AnswerStepId> = GenericAnswerStepHandler<
  UrbanProjectCreationStep,
  UrbanStepHandlerContext,
  AnswersByStep,
  T
>;

export type StepHandlerRegistry = GenericStepHandlerRegistry<
  UrbanProjectCreationStep,
  SummaryStep | IntroductionStep,
  UrbanStepHandlerContext,
  AnswersByStep
>;

export type ShortcutResult = GenericShortcutResult<UrbanProjectCreationStep, AnswersByStep>;

export type StepInvalidationRule = GenericStepInvalidationRule<AnswerStepId>;
