import type { StepStepperConfig } from "@/shared/views/project-form/stepper/stepperConfig";

export const buildingsFootprintToReuseStepperConfig = {
  groupId: "BUILDINGS",
  subGroupId: "BUILDINGS_REUSE",
} as const satisfies StepStepperConfig;
