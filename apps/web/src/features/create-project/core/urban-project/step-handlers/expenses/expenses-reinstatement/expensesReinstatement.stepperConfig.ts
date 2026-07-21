import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const expensesReinstatementStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_SITE_REINSTATEMENT",
} as const satisfies StepStepperConfig;
