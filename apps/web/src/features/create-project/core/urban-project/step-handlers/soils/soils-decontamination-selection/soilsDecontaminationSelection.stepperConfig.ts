import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const soilsDecontaminationSelectionStepperConfig = {
  groupId: "SOILS_DECONTAMINATION",
  subGroupId: "DECONTAMINATION_SELECTION",
} as const satisfies StepStepperConfig;
