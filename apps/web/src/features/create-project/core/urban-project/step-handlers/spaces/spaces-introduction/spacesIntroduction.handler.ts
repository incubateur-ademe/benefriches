import { isNaturalSoil, typedObjectKeys } from "shared";

import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import type { InfoStepHandler } from "../../stepHandler.type";

export const SpacesIntroductionHandler = {
  stepId: "URBAN_PROJECT_SPACES_INTRODUCTION",

  getPreviousStepId({ answers }) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(answers, "URBAN_PROJECT_USES_SELECTION")?.usesSelection ?? [];

    if (selectedUses.includes("PUBLIC_GREEN_SPACES")) {
      return "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA";
    }

    return "URBAN_PROJECT_USES_SELECTION";
  },

  getNextStepId({ answers, context }) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(answers, "URBAN_PROJECT_USES_SELECTION")?.usesSelection ?? [];

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
} satisfies InfoStepHandler;
