import type { StepStepperConfig } from "@/shared/views/project-form/stepper/stepperConfig";

export const expensesReinstatementStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_SITE_REINSTATEMENT",
} as const satisfies StepStepperConfig;
