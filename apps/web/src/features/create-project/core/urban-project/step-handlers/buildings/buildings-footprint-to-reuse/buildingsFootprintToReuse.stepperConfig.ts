import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const buildingsFootprintToReuseStepperConfig = {
  groupId: "BUILDINGS",
  subGroupId: "BUILDINGS_REUSE",
} as const satisfies StepStepperConfig;
