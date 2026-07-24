import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const revenueFinancialAssistanceStepperConfig = {
  groupId: "REVENUE",
  subGroupId: "REVENUE_FINANCIAL_ASSISTANCE",
} as const satisfies StepStepperConfig;
