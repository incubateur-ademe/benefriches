import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const publicGreenSpacesSurfaceAreaStepperConfig = {
  groupId: "USES",
  subGroupId: "USES_GREEN_SPACES_AREA",
} as const satisfies StepStepperConfig;
