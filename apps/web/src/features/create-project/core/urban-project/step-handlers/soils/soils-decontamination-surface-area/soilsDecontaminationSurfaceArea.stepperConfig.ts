import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const soilsDecontaminationSurfaceAreaStepperConfig = {
  groupId: "SOILS_DECONTAMINATION",
  subGroupId: "DECONTAMINATION_SURFACE",
} as const satisfies StepStepperConfig;
