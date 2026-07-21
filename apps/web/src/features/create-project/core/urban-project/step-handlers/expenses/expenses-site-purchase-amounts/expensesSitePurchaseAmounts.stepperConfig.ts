import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const expensesSitePurchaseAmountsStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_SITE_PURCHASE",
} as const satisfies StepStepperConfig;
