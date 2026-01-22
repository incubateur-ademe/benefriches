import { isBuildingUse, type UrbanProjectUse } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler } from "../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA";

export const UsesFloorSurfaceAreaHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,

  getPreviousStepId() {
    return "URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION";
  },

  getShortcut(context, answers) {
    const selectedUses =
      ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_PROJECT_USES_SELECTION")
        ?.usesSelection ?? [];
    const buildingUses = selectedUses.filter((use) => isBuildingUse(use));

    // If single building use, auto-complete with the footprint value
    if (buildingUses.length === 1 && buildingUses[0]) {
      const singleBuildingUse = buildingUses[0] as UrbanProjectUse;
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
          next: "URBAN_PROJECT_SPACES_DEVELOPMENT_PLAN_INTRODUCTION",
        };
      }
    }

    return undefined;
  },
};
