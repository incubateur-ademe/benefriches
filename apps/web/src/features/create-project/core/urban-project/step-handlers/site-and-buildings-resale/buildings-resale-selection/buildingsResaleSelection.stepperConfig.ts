import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const buildingsResaleSelectionStepperConfig = {
  groupId: "SITE_RESALE",
  subGroupId: "BUILDINGS_CESSION",
} as const satisfies StepStepperConfig;
