import type { StepStepperConfig } from "@/shared/views/project-form/stepper/stepperConfig";

export const expensesSitePurchaseAmountsStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_SITE_PURCHASE",
} as const satisfies StepStepperConfig;
