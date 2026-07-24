import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const expensesProjectedBuildingsOperatingExpensesStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_BUILDINGS_OPERATION",
} as const satisfies StepStepperConfig;
