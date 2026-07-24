import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const stakeholdersReinstatementContractOwnerStepperConfig = {
  groupId: "STAKEHOLDERS",
  subGroupId: "STAKEHOLDERS_REINSTATEMENT_OWNER",
} as const satisfies StepStepperConfig;
