import z from "zod";

import { addressSelectionSchema } from "./steps/address/address.schema";
import { siteActivitySelectionSchema } from "./steps/site-activity/siteActivity.schema";
import { siteNatureSelectionSchema } from "./steps/site-nature/siteNature.schema";
import { siteSurfaceAreaSchema } from "./steps/surface-area/surfaceArea.schema";

export const INTRODUCTION_STEPS = ["DEMO_INTRODUCTION"] as const;

export const SUMMARY_STEPS = ["DEMO_CREATION_RESULT"] as const;

export const ANSWER_STEP_IDS = [
  "DEMO_SITE_NATURE_SELECTION",
  "DEMO_SITE_ACTIVITY_SELECTION",
  "DEMO_SITE_ADDRESS",
  "DEMO_SITE_SURFACE_AREA",
] as const;

export type DemoIntroductionStep = (typeof INTRODUCTION_STEPS)[number];
export type DemoSummaryStep = (typeof SUMMARY_STEPS)[number];

export type DemoAnswerStepId = (typeof ANSWER_STEP_IDS)[number];

export type DemoSiteCreationStep = DemoIntroductionStep | DemoSummaryStep | DemoAnswerStepId;

export const answersByStepSchemas = {
  DEMO_SITE_NATURE_SELECTION: siteNatureSelectionSchema,
  DEMO_SITE_ACTIVITY_SELECTION: siteActivitySelectionSchema,
  DEMO_SITE_ADDRESS: addressSelectionSchema,
  DEMO_SITE_SURFACE_AREA: siteSurfaceAreaSchema,
} as const;

export type SchematizedAnswerStepId = keyof typeof answersByStepSchemas;

export type AnswersByStep = {
  [K in SchematizedAnswerStepId]: z.infer<(typeof answersByStepSchemas)[K]>;
};

export type DemoStepsState = Partial<{
  [K in SchematizedAnswerStepId]: {
    completed: boolean;
    payload?: AnswersByStep[K];
    defaultValues?: AnswersByStep[K];
  };
}>;

const DEMO_STEP_HANDLER_STEPS_SET: ReadonlySet<string> = new Set([
  ...INTRODUCTION_STEPS,
  ...SUMMARY_STEPS,
  ...ANSWER_STEP_IDS,
]);

export const isDemoStepHandlerStep = (stepId: string): stepId is DemoSiteCreationStep =>
  DEMO_STEP_HANDLER_STEPS_SET.has(stepId);
