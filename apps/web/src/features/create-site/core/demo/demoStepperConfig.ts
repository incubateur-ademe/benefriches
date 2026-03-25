import z from "zod";

import type { DemoSiteCreationStep } from "./demoSteps";

const demoStepGroupIdSchema = z.enum([
  "INTRODUCTION",
  "SITE_NATURE",
  "ADDRESS",
  "SURFACE_AREA",
  "SUMMARY",
]);

export type DemoStepGroupId = z.infer<typeof demoStepGroupIdSchema>;

export const DEMO_STEP_GROUP_IDS = demoStepGroupIdSchema.options;

export const DEMO_STEP_GROUP_LABELS: Record<DemoStepGroupId, string> = {
  INTRODUCTION: "Introduction",
  SITE_NATURE: "Type de site",
  ADDRESS: "Adresse",
  SURFACE_AREA: "Superficie",
  SUMMARY: "Récapitulatif",
};

type DemoStepStepperConfig = {
  groupId: DemoStepGroupId;
  label?: string;
};

export const DEMO_STEP_TO_GROUP: Record<DemoSiteCreationStep, DemoStepStepperConfig> = {
  DEMO_INTRODUCTION: {
    groupId: "INTRODUCTION",
  },
  DEMO_SITE_NATURE_SELECTION: {
    groupId: "SITE_NATURE",
  },
  DEMO_SITE_ACTIVITY_SELECTION: {
    groupId: "SITE_NATURE",
  },
  DEMO_SITE_ADDRESS: {
    groupId: "ADDRESS",
  },
  DEMO_SITE_SURFACE_AREA: {
    groupId: "SURFACE_AREA",
  },
  DEMO_CREATION_RESULT: {
    groupId: "SUMMARY",
  },
};
