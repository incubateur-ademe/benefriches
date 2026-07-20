import type { ProjectSiteView } from "@/features/create-project/core/project-form/projectSite.types";
import {
  AnswerStepHandler as GenericAnswerStepHandler,
  InfoStepHandler as GenericInfoStepHandler,
  StepHandlerParams as GenericStepHandlerParams,
  StepHandlerRegistry as GenericStepHandlerRegistry,
  WizardFormStepsState,
} from "@/shared/core/wizard-form/stepHandler.type";

import type {
  AnswersByStep,
  AnswerStepId,
  IntroductionStep,
  RenewableEnergyCreationStep,
  SummaryStep,
} from "../renewableEnergySteps";

// Photovoltaic's eager, guaranteed-loaded situational data (see ADR-0015), mirroring urban's
// context shape: `context` wraps the site as `siteData` so it can grow further eager data
// later without reshaping every handler signature.
export type RenewableEnergyStepHandlerContext = {
  siteData: ProjectSiteView | undefined;
};

export type RenewableEnergyStepsState = WizardFormStepsState<AnswersByStep>;

export type StepHandlerParams<
  TContext = RenewableEnergyStepHandlerContext,
  TAnswers = AnswersByStep,
> = GenericStepHandlerParams<TContext, TAnswers>;

export type InfoStepHandler = GenericInfoStepHandler<
  RenewableEnergyCreationStep,
  SummaryStep | IntroductionStep,
  RenewableEnergyStepHandlerContext,
  AnswersByStep
>;

export type AnswerStepHandler<T extends AnswerStepId> = GenericAnswerStepHandler<
  RenewableEnergyCreationStep,
  RenewableEnergyStepHandlerContext,
  AnswersByStep,
  T
>;

export type StepHandlerRegistry = GenericStepHandlerRegistry<
  RenewableEnergyCreationStep,
  SummaryStep | IntroductionStep,
  RenewableEnergyStepHandlerContext,
  AnswersByStep
>;
