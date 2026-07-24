import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const publicGreenSpacesIntroductionStepperConfig = {
  groupId: "SPACES",
  subGroupId: "SPACES_GREEN_SPACES_SOILS",
} as const satisfies StepStepperConfig;
