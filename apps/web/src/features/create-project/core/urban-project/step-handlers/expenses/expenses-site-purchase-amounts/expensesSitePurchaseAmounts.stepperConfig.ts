import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const expensesSitePurchaseAmountsStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_SITE_PURCHASE",
} as const satisfies StepStepperConfig;
