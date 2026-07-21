import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const soilsDecontaminationSurfaceAreaStepperConfig = {
  groupId: "SOILS_DECONTAMINATION",
  subGroupId: "DECONTAMINATION_SURFACE",
} as const satisfies StepStepperConfig;
