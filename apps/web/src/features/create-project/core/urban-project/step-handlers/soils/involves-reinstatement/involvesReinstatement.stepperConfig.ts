import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const involvesReinstatementStepperConfig = {
  groupId: "SOILS_DECONTAMINATION",
  subGroupId: "INVOLVES_REINSTATEMENT",
} as const satisfies StepStepperConfig;
