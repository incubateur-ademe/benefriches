import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const soilsCarbonSummaryStepperConfig = {
  groupId: "SPACES",
  subGroupId: "CARBON_STORAGE",
} as const satisfies StepStepperConfig;
