import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const spacesSelectionStepperConfig = {
  groupId: "SPACES",
  subGroupId: "SPACES_SELECTION",
} as const satisfies StepStepperConfig;
