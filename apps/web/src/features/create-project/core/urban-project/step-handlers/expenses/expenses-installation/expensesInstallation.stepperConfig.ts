import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const expensesInstallationStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_SITE_INSTALLATION",
} as const satisfies StepStepperConfig;
