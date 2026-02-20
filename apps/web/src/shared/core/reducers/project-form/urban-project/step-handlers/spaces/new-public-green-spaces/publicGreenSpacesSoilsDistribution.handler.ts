import { isNaturalSoil, typedObjectEntries, typedObjectKeys } from "shared";
import type { SoilType } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler } from "../../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION";

export const PublicGreenSpacesSoilsDistributionHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId(context) {
    const siteSoilsDistribution = context.siteData?.soilsDistribution ?? {};
    const hasExistingNaturalSoils = typedObjectKeys(siteSoilsDistribution).some(isNaturalSoil);

    if (hasExistingNaturalSoils) {
      return "URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION";
    }

    return "URBAN_PROJECT_SPACES_INTRODUCTION";
  },

  getNextStepId(context) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];

    const isOnlyPublicGreenSpaces =
      selectedUses.length === 1 && selectedUses[0] === "PUBLIC_GREEN_SPACES";

    if (isOnlyPublicGreenSpaces) {
      return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
    }

    return "URBAN_PROJECT_SPACES_SELECTION";
  },

  getDefaultAnswers(context) {
    const siteSoilsDistribution = context.siteData?.soilsDistribution ?? {};

    const existingNaturalSoilsDistribution = typedObjectEntries(siteSoilsDistribution).filter(
      ([soilType]) => isNaturalSoil(soilType),
    );

    if (existingNaturalSoilsDistribution.length === 0) {
      return undefined;
    }

    const defaultDistribution: Partial<Record<SoilType, number>> = {};
    for (const [soilType, surfaceArea] of existingNaturalSoilsDistribution) {
      if (surfaceArea && surfaceArea > 0) {
        defaultDistribution[soilType] = surfaceArea;
      }
    }

    return { publicGreenSpacesSoilsDistribution: defaultDistribution };
  },
};
