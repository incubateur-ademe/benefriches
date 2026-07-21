import type { StepStepperConfig } from "@/features/create-project/views/project-form/stepper/stepperConfig";

export const involvesReinstatementStepperConfig = {
  groupId: "SOILS_DECONTAMINATION",
  subGroupId: "INVOLVES_REINSTATEMENT",
} as const satisfies StepStepperConfig;
