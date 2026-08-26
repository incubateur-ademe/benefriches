import type {
  AnswerStepHandler as GenericAnswerStepHandler,
  InfoStepHandler as GenericInfoStepHandler,
  StepHandlerRegistry as GenericStepHandlerRegistry,
  WizardFormStepsState,
} from "@/shared/core/wizard-form/stepHandler.type";

import { SiteCreationData } from "../siteFoncier.types";
import type {
  AnswersByStep,
  DemoAnswerStepId,
  DemoIntroductionStep,
  DemoSiteCreationStep,
  DemoSummaryStep,
} from "./demoSteps";
import { DemoSiteAddressHandler } from "./steps/address/address.handler";
import { DemoCreationResultHandler } from "./steps/creation-result/creationResult.handler";
import { DemoSiteIntroductionHandler } from "./steps/introduction/introduction.handler";
import { DemoSiteActivityHandler } from "./steps/site-activity/siteActivity.handler";
import { DemoSiteNatureHandler } from "./steps/site-nature/siteNature.handler";
import { DemoSiteSurfaceAreaHandler } from "./steps/surface-area/surfaceArea.handler";

// Demo's eager, guaranteed-loaded situational data (see ADR-0015), mirroring
// renewable-energy's/urban's context shape.
export type DemoStepHandlerContext = {
  siteData: SiteCreationData;
};

export type DemoStepsState = WizardFormStepsState<AnswersByStep>;

export type DemoAnswerStepHandler<K extends DemoAnswerStepId> = GenericAnswerStepHandler<
  DemoSiteCreationStep,
  DemoStepHandlerContext,
  AnswersByStep,
  K
>;

export type InfoStepHandler = GenericInfoStepHandler<
  DemoSiteCreationStep,
  DemoSummaryStep | DemoIntroductionStep,
  DemoStepHandlerContext,
  AnswersByStep
>;

export type StepHandlerRegistry = GenericStepHandlerRegistry<
  DemoSiteCreationStep,
  DemoSummaryStep | DemoIntroductionStep,
  DemoStepHandlerContext,
  AnswersByStep
>;

type AnswerStepHandlerMap = {
  [K in DemoAnswerStepId]: DemoAnswerStepHandler<K>;
};

export const answerStepHandlers: AnswerStepHandlerMap = {
  DEMO_SITE_NATURE_SELECTION: DemoSiteNatureHandler,
  DEMO_SITE_ACTIVITY_SELECTION: DemoSiteActivityHandler,
  DEMO_SITE_ADDRESS: DemoSiteAddressHandler,
  DEMO_SITE_SURFACE_AREA: DemoSiteSurfaceAreaHandler,
};

export const demoStepHandlerRegistry: StepHandlerRegistry = {
  ...answerStepHandlers,
  DEMO_INTRODUCTION: DemoSiteIntroductionHandler,
  DEMO_CREATION_RESULT: DemoCreationResultHandler,
};
