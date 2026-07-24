import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const expensesBuildingsConstructionAndRehabilitationStepperConfig = {
  groupId: "EXPENSES",
  subGroupId: "EXPENSES_BUILDINGS_CONSTRUCTION",
} as const satisfies StepStepperConfig;
