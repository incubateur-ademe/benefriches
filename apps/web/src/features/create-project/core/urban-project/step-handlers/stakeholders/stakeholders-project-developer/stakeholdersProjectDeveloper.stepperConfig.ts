import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const stakeholdersProjectDeveloperStepperConfig = {
  groupId: "STAKEHOLDERS",
  subGroupId: "STAKEHOLDERS_PROJECT_DEVELOPER",
} as const satisfies StepStepperConfig;
