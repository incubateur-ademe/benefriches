import { doesUseIncludeBuildings, type UrbanProjectUse } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA";

export const UsesFloorSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_INTRODUCTION";
  },

  getShortcut(context, answers) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];
    const usesWithBuildings = selectedUses.filter((use) => doesUseIncludeBuildings(use));

    // If single building use, auto-complete with the footprint value
    if (usesWithBuildings.length === 1 && usesWithBuildings[0]) {
      const singleBuildingUse = usesWithBuildings[0] as UrbanProjectUse;
      const footprintDistribution =
        ReadStateHelper.getStepAnswers(
          context.stepsState,
          "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA",
        )?.usesFootprintSurfaceAreaDistribution ?? {};
      const footprintValue = footprintDistribution[singleBuildingUse];

      // Only shortcut if we have the footprint value and user entered valid data
      if (
        footprintValue !== undefined &&
        answers.usesFloorSurfaceAreaDistribution?.[singleBuildingUse]
      ) {
        return {
          complete: [],
          next: "URBAN_PROJECT_SPACES_INTRODUCTION",
        };
      }
    }

    return undefined;
  },
};
