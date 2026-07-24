import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const publicGreenSpacesSoilsDistributionStepperConfig = {
  groupId: "SPACES",
  subGroupId: "SPACES_GREEN_SPACES_SOILS",
} as const satisfies StepStepperConfig;
