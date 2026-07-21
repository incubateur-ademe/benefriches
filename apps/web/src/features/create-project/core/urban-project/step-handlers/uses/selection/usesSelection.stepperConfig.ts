import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const usesSelectionStepperConfig = {
  groupId: "USES",
  subGroupId: "USES_SELECTION",
} as const satisfies StepStepperConfig;
