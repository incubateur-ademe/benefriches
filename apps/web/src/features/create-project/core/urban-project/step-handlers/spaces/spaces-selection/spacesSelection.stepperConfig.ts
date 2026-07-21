import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const spacesSelectionStepperConfig = {
  groupId: "SPACES",
  subGroupId: "SPACES_SELECTION",
} as const satisfies StepStepperConfig;
