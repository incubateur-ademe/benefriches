import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const spacesSurfaceAreaStepperConfig = {
  groupId: "SPACES",
  subGroupId: "SPACES_SURFACES",
} as const satisfies StepStepperConfig;
