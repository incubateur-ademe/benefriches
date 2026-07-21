import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const buildingsUsesFloorSurfaceAreaStepperConfig = {
  groupId: "BUILDINGS",
  subGroupId: "USES_FLOOR_AREA",
} as const satisfies StepStepperConfig;
