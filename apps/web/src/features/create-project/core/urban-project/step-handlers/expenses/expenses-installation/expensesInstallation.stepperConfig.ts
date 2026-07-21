import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const expensesInstallationStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_SITE_INSTALLATION",
} as const satisfies StepStepperConfig;
