import type { StepStepperConfig } from "@/shared/views/project-form/stepper/stepperConfig";

export const buildingsResaleSelectionStepperConfig = {
  groupId: "SITE_RESALE",
  subGroupId: "BUILDINGS_CESSION",
} as const satisfies StepStepperConfig;
