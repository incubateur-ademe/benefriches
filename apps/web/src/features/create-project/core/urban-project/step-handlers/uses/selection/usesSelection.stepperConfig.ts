import type { StepStepperConfig } from "@/shared/views/project-form/stepper/stepperConfig";

export const usesSelectionStepperConfig = {
  groupId: "USES",
  subGroupId: "USES_SELECTION",
} as const satisfies StepStepperConfig;
