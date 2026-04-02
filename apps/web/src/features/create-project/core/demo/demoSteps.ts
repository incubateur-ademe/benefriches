import { renewableEnergyTemplateSchema, urbanProjectTemplateSchema } from "shared";
import z from "zod";

import { ExpressReconversionProjectResult } from "./demoProject.actions";

export const SUMMARY_STEPS = ["DEMO_PROJECT_SUMMARY", "DEMO_PROJECT_CREATION_RESULT"] as const;

export const ANSWER_STEP_IDS = ["DEMO_PROJECT_TEMPLATE_SELECTION"] as const;

export type DemoSummaryStep = (typeof SUMMARY_STEPS)[number];

export type DemoAnswerStepId = (typeof ANSWER_STEP_IDS)[number];

export type DemoProjectCreationStep = DemoSummaryStep | DemoAnswerStepId;

export const answersByStepSchemas = {
  DEMO_PROJECT_TEMPLATE_SELECTION: z.object({
    projectTemplate: z.union([urbanProjectTemplateSchema, renewableEnergyTemplateSchema]),
  }),
} as const;

export type SchematizedAnswerStepId = keyof typeof answersByStepSchemas;

export type AnswersByStep = {
  [K in SchematizedAnswerStepId]: z.infer<(typeof answersByStepSchemas)[K]>;
};

type SummaryStepState<T_Data> = {
  completed: boolean;
  loadingState?: "idle" | "loading" | "success" | "error";
  data?: T_Data;
};

export type DemoProjectStepsState = Partial<
  {
    [K in SchematizedAnswerStepId]: {
      completed: boolean;
      payload?: AnswersByStep[K];
      defaultValues?: AnswersByStep[K];
    };
  } & {
    DEMO_PROJECT_SUMMARY?: SummaryStepState<ExpressReconversionProjectResult>;
  }
>;

const DEMO_STEP_HANDLER_STEPS_SET: ReadonlySet<string> = new Set([
  ...SUMMARY_STEPS,
  ...ANSWER_STEP_IDS,
]);

export const isDemoStepHandlerStep = (stepId: string): stepId is DemoProjectCreationStep =>
  DEMO_STEP_HANDLER_STEPS_SET.has(stepId);
