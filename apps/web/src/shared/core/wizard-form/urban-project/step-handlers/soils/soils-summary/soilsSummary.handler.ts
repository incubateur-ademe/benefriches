import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsSummaryHandler = {
  stepId: "URBAN_PROJECT_SPACES_SOILS_SUMMARY",

  getPreviousStepId(params) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(params.answers, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];

    const isOnlyPublicGreenSpaces =
      selectedUses.length === 1 && selectedUses[0] === "PUBLIC_GREEN_SPACES";

    if (isOnlyPublicGreenSpaces) {
      return "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION";
    }

    return "URBAN_PROJECT_SPACES_SURFACE_AREA";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },
} satisfies InfoStepHandler;
