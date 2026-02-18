import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { InfoStepHandler } from "../stepHandler.type";

export const SoilsSummaryHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SPACES_SOILS_SUMMARY",

  getPreviousStepId(context) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];

    if (selectedUses.includes("PUBLIC_GREEN_SPACES")) {
      return "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION";
    }

    return "URBAN_PROJECT_SPACES_SURFACE_AREA";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },
};
