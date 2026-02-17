import { doesUseIncludeBuildings, isNaturalSoil, typedObjectKeys } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { InfoStepHandler } from "../stepHandler.type";

export const SpacesIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SPACES_INTRODUCTION",

  getPreviousStepId(context) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];

    if (selectedUses.some(doesUseIncludeBuildings)) {
      return "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA";
    }

    if (selectedUses.includes("PUBLIC_GREEN_SPACES")) {
      return "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA";
    }

    return "URBAN_PROJECT_USES_SELECTION";
  },

  getNextStepId(context) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];

    if (selectedUses.includes("PUBLIC_GREEN_SPACES")) {
      const siteSoilsDistribution = context.siteData?.soilsDistribution ?? {};
      const hasSiteNaturalSoils = typedObjectKeys(siteSoilsDistribution).some(isNaturalSoil);

      if (hasSiteNaturalSoils) {
        return "URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION";
      }

      return "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION";
    }

    return "URBAN_PROJECT_SPACES_SELECTION";
  },
};
