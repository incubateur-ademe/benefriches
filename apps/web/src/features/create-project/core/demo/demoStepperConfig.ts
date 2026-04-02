import z from "zod";

import type { DemoProjectCreationStep } from "./demoSteps";

const demoStepGroupIdSchema = z.enum(["PROJECT_TEMPLATE", "SUMMARY"]);

export type DemoStepGroupId = z.infer<typeof demoStepGroupIdSchema>;

export const DEMO_STEP_GROUP_IDS = demoStepGroupIdSchema.options;

export const DEMO_STEP_GROUP_LABELS: Record<DemoStepGroupId, string> = {
  PROJECT_TEMPLATE: "Type de projet",
  SUMMARY: "Récapitulatif",
};

type DemoStepStepperConfig = {
  groupId: DemoStepGroupId;
  label?: string;
};

export const DEMO_STEP_TO_GROUP: Record<DemoProjectCreationStep, DemoStepStepperConfig> = {
  DEMO_PROJECT_TEMPLATE_SELECTION: {
    groupId: "PROJECT_TEMPLATE",
  },
  DEMO_PROJECT_CREATION_RESULT: {
    groupId: "SUMMARY",
  },
  DEMO_PROJECT_SUMMARY: {
    groupId: "SUMMARY",
  },
};
