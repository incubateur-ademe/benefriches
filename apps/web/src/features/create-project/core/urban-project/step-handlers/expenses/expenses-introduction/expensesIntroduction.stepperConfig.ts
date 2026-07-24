import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const expensesIntroductionStepperConfig = {
  groupId: "EXPENSES",
} as const satisfies StepStepperConfig;
