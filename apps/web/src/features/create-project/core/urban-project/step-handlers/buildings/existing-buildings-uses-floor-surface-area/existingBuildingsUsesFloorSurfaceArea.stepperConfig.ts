import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const buildingsExistingBuildingsUsesFloorSurfaceAreaStepperConfig = {
  groupId: "BUILDINGS",
  subGroupId: "BUILDINGS_EXISTING_USES",
} as const satisfies StepStepperConfig;
