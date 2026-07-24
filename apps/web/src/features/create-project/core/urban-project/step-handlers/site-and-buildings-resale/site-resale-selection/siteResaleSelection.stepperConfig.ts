import type { StepStepperConfig } from "@/features/create-project/core/urban-project/step-handlers/stepGroups.types";

export const siteResaleSelectionStepperConfig = {
  groupId: "SITE_RESALE",
  subGroupId: "SITE_CESSION",
} as const satisfies StepStepperConfig;
