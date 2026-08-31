import type {
  AnswerStepHandler as GenericAnswerStepHandler,
  InfoStepHandler as GenericInfoStepHandler,
  StepHandlerParams,
  StepHandlerRegistry as GenericStepHandlerRegistry,
} from "@/shared/core/wizard-form/stepHandler.type";

import type { SiteCreationData } from "../siteFoncier.types";
import { addressHandlers } from "../steps/address/address.handlers";
import { contaminationAndAccidentsHandlers } from "../steps/contamination-and-accidents/contaminationAndAccidents.handlers";
import { namingHandlers } from "../steps/naming/naming.handlers";
import { siteActivityHandlers } from "../steps/site-activity/siteActivity.handlers";
import { siteManagementHandlers } from "../steps/site-management/siteManagement.handlers";
import { spacesHandlers } from "../steps/spaces/spaces.handlers";
import { urbanZoneHandoffHandlers } from "../steps/urban-zone/urbanZone.handlers";
import type {
  CustomAnswerStepId,
  CustomAnswersByStep,
  CustomInfoStepId,
  SiteCreationCustomStep,
} from "./customSteps";

// Custom flow's eager, guaranteed-loaded situational data (see ADR-0015), mirroring
// urban-zone's/demo's context shape. `isFriche`/`nature` are set by the pre-engine steps
// (IS_FRICHE/SITE_NATURE), which stay outside the engine — see createSite.reducer.ts.
export type CustomStepHandlerContext = { siteData: SiteCreationData };

export type CustomStepParams = StepHandlerParams<CustomStepHandlerContext, CustomAnswersByStep>;

export type CustomAnswerStepHandler<K extends CustomAnswerStepId> = GenericAnswerStepHandler<
  SiteCreationCustomStep,
  CustomStepHandlerContext,
  CustomAnswersByStep,
  K
>;

export type CustomInfoStepHandler = GenericInfoStepHandler<
  SiteCreationCustomStep,
  CustomInfoStepId,
  CustomStepHandlerContext,
  CustomAnswersByStep
>;

type AnswerStepHandlerMap = {
  [K in CustomAnswerStepId]: CustomAnswerStepHandler<K>;
};

export const customAnswerStepHandlers: AnswerStepHandlerMap = {
  ...siteActivityHandlers,
  ...addressHandlers,
  ...spacesHandlers,
  ...contaminationAndAccidentsHandlers.answerSteps,
  ...siteManagementHandlers,
  ...namingHandlers.answerSteps,
  ...urbanZoneHandoffHandlers.answerSteps,
};

export type CustomStepHandlerRegistry = GenericStepHandlerRegistry<
  SiteCreationCustomStep,
  CustomInfoStepId,
  CustomStepHandlerContext,
  CustomAnswersByStep
>;

export const customStepHandlerRegistry: CustomStepHandlerRegistry = {
  ...customAnswerStepHandlers,
  ...contaminationAndAccidentsHandlers.infoSteps,
  ...namingHandlers.infoSteps,
  ...urbanZoneHandoffHandlers.infoSteps,
  SPACES_INTRODUCTION: {
    stepId: "SPACES_INTRODUCTION",
    getNextStepId: () => "SURFACE_AREA",
  },
  SOILS_SUMMARY: {
    stepId: "SOILS_SUMMARY",
    getNextStepId: () => "SOILS_CARBON_STORAGE",
  },
  SOILS_CARBON_STORAGE: {
    stepId: "SOILS_CARBON_STORAGE",
    getNextStepId: ({ context }) =>
      context.siteData.isFriche ? "SOILS_CONTAMINATION_INTRODUCTION" : "MANAGEMENT_INTRODUCTION",
  },
  MANAGEMENT_INTRODUCTION: {
    stepId: "MANAGEMENT_INTRODUCTION",
    getNextStepId: () => "OWNER",
  },
  YEARLY_EXPENSES_AND_INCOME_INTRODUCTION: {
    stepId: "YEARLY_EXPENSES_AND_INCOME_INTRODUCTION",
    getNextStepId: () => "YEARLY_EXPENSES",
  },
  YEARLY_EXPENSES_SUMMARY: {
    stepId: "YEARLY_EXPENSES_SUMMARY",
    getNextStepId: () => "NAMING_INTRODUCTION",
  },
  FINAL_SUMMARY: {
    stepId: "FINAL_SUMMARY",
    // No getNextStepId: advancing past the summary is a save-thunk (customSiteSaved), not a
    // step transition — see views/common-views/summary. The stepsSequence walk stops here.
  },
  CREATION_RESULT: {
    stepId: "CREATION_RESULT",
    // Entered directly by customSiteSaved.pending (not via stepCompletionRequested), so it is
    // never part of the computed stepsSequence — back navigation needs an explicit target.
    getPreviousStepId: () => "FINAL_SUMMARY",
  },
};
