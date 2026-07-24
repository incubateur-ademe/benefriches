import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const expensesReinstatementStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_SITE_REINSTATEMENT",
} as const satisfies StepStepperConfig;
