import type { StepStepperConfig } from "@/shared/views/project-form/stepper/stepperConfig";

export const buildingsUsesFloorSurfaceAreaStepperConfig = {
  groupId: "BUILDINGS",
  subGroupId: "USES_FLOOR_AREA",
} as const satisfies StepStepperConfig;
