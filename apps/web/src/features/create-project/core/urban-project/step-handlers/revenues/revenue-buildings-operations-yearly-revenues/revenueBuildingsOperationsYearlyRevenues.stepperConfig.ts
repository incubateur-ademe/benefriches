import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const revenueBuildingsOperationsYearlyRevenuesStepperConfig = {
  groupId: "REVENUE",
  subGroupId: "REVENUE_BUILDINGS_OPERATION",
} as const satisfies StepStepperConfig;
