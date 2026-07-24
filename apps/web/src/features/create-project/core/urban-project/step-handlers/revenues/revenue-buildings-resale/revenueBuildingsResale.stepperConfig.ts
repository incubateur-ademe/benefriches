import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const revenueBuildingsResaleStepperConfig = {
  groupId: "REVENUE",
  subGroupId: "REVENUE_BUILDINGS_RESALE",
} as const satisfies StepStepperConfig;
