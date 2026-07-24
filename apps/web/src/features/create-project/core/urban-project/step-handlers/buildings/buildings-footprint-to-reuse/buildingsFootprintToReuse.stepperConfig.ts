import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const buildingsFootprintToReuseStepperConfig = {
  groupId: "BUILDINGS",
  subGroupId: "BUILDINGS_REUSE",
} as const satisfies StepStepperConfig;
