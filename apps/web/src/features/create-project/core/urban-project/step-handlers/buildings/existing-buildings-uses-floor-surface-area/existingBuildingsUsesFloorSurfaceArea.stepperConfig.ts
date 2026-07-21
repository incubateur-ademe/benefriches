import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const buildingsExistingBuildingsUsesFloorSurfaceAreaStepperConfig = {
  groupId: "BUILDINGS",
  subGroupId: "BUILDINGS_EXISTING_USES",
} as const satisfies StepStepperConfig;
