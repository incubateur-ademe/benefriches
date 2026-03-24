import type {
  AnswerStepHandler as GenericAnswerStepHandler,
  AnswerStepHandlerMap as GenericAnswerStepHandlerMap,
  InfoStepHandler as GenericInfoStepHandler,
  ShortcutResult as GenericShortcutResult,
  NavigationHandlerRegistry,
  StepContext,
} from "../factory/handlerRegistry.types";
import { SiteCreationData } from "../siteFoncier.types";
import type {
  SchematizedAnswerStepId,
  DemoSiteCreationStep,
  answersByStepSchemas,
  DemoSummaryStep,
  DemoIntroductionStep,
} from "./demoSteps";
import { DemoSiteAddressHandler } from "./steps/address/address.handler";
import { DemoCreationResultHandler } from "./steps/creation-result/creationResult.handler";
import { DemoSiteIntroductionHandler } from "./steps/introduction/introduction.handler";
import { DemoSiteActivityHandler } from "./steps/site-activity/siteActivity.handler";
import { DemoSiteNatureHandler } from "./steps/site-nature/siteNature.handler";
import { DemoSiteSurfaceAreaHandler } from "./steps/surface-area/surfaceArea.handler";

export type DemoStepContext = StepContext<typeof answersByStepSchemas, SiteCreationData>;

export type DemoAnswerStepHandler<K extends SchematizedAnswerStepId> = GenericAnswerStepHandler<
  typeof answersByStepSchemas,
  DemoSiteCreationStep,
  DemoStepContext,
  K
>;

export type InfoStepHandler = GenericInfoStepHandler<
  DemoIntroductionStep,
  DemoSummaryStep,
  SchematizedAnswerStepId,
  DemoStepContext
>;

export type ShortcutResult = GenericShortcutResult<
  typeof answersByStepSchemas,
  DemoSiteCreationStep
>;

export type AnswerStepHandlerMap = GenericAnswerStepHandlerMap<
  typeof answersByStepSchemas,
  DemoSiteCreationStep,
  DemoStepContext
>;

export const answerStepHandlers: Partial<AnswerStepHandlerMap> = {
  DEMO_SITE_NATURE_SELECTION: DemoSiteNatureHandler,
  DEMO_SITE_ACTIVITY_SELECTION: DemoSiteActivityHandler,
  DEMO_SITE_ADDRESS: DemoSiteAddressHandler,
  DEMO_SITE_SURFACE_AREA: DemoSiteSurfaceAreaHandler,
};

export type DemoStepHandlerRegistry = NavigationHandlerRegistry<
  DemoSiteCreationStep,
  DemoStepContext
>;

export const demoStepHandlerRegistry: DemoStepHandlerRegistry = {
  ...answerStepHandlers,
  DEMO_INTRODUCTION: DemoSiteIntroductionHandler,
  DEMO_CREATION_RESULT: DemoCreationResultHandler,
};
