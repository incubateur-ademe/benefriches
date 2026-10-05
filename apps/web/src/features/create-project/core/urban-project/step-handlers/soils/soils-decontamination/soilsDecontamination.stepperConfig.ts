import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const soilsDecontaminationStepperConfig = {
  groupId: "SOILS_DECONTAMINATION",
  subGroupId: "DECONTAMINATION",
} as const satisfies StepStepperConfig;
