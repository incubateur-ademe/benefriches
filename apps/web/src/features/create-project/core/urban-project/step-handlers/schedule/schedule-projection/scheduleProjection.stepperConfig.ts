import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const scheduleProjectionStepperConfig = {
  groupId: "SCHEDULE",
} as const satisfies StepStepperConfig;
