import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const soilsSummaryStepperConfig = {
  groupId: "SPACES",
  subGroupId: "SOILS_SUMMARY",
} as const satisfies StepStepperConfig;
