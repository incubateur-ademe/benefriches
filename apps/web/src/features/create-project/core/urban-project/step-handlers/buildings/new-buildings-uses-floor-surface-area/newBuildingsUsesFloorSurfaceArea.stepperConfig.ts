import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const buildingsNewBuildingsUsesFloorSurfaceAreaStepperConfig = {
  groupId: "BUILDINGS",
  subGroupId: "BUILDINGS_NEW_USES",
} as const satisfies StepStepperConfig;
