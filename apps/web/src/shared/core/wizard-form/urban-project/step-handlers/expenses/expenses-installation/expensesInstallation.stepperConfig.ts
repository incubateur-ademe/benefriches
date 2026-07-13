import type { StepStepperConfig } from "@/shared/views/project-form/stepper/stepperConfig";

export const expensesInstallationStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_SITE_INSTALLATION",
} as const satisfies StepStepperConfig;
