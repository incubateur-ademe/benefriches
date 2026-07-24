import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const usesSelectionStepperConfig = {
  groupId: "USES",
  subGroupId: "USES_SELECTION",
} as const satisfies StepStepperConfig;
