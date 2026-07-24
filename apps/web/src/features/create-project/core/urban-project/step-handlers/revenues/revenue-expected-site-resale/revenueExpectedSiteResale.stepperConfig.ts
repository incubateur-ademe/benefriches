import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const revenueExpectedSiteResaleStepperConfig = {
  groupId: "REVENUE",
  subGroupId: "REVENUE_SITE_RESALE",
} as const satisfies StepStepperConfig;
