import { isBuildingUse, typedObjectEntries } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_SPACES_SURFACE_AREA";

export const SpacesSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
  },

  getDefaultAnswers(context) {
    const usesFootprintDistribution = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA",
    )?.usesFootprintSurfaceAreaDistribution;

    if (!usesFootprintDistribution) {
      return undefined;
    }

    const buildingsTotalSurfaceArea = typedObjectEntries(usesFootprintDistribution)
      .filter(([use]) => isBuildingUse(use))
      .reduce((sum, [, surfaceArea]) => sum + (surfaceArea ?? 0), 0);

    if (buildingsTotalSurfaceArea === 0) {
      return undefined;
    }

    return {
      spacesSurfaceAreaDistribution: {
        BUILDINGS: buildingsTotalSurfaceArea,
      },
    };
  },
};
