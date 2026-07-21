import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const buildingsResaleSelectionStepperConfig = {
  groupId: "SITE_RESALE",
  subGroupId: "BUILDINGS_CESSION",
} as const satisfies StepStepperConfig;
