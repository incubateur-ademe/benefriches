import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const soilsDecontaminationSelectionStepperConfig = {
  groupId: "SOILS_DECONTAMINATION",
  subGroupId: "DECONTAMINATION_SELECTION",
} as const satisfies StepStepperConfig;
