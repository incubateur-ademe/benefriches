import type { UrbanZoneLandParcelType } from "shared";

import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";

export const LandParcelsSelectionHandler = {
  stepId: "URBAN_ZONE_LAND_PARCELS_SELECTION",

  getNextStepId() {
    return "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION";
  },

  getShortcut(context, answers) {
    if (answers.landParcelTypes.length !== 1) {
      return undefined;
    }
    const [singleType] = answers.landParcelTypes as [UrbanZoneLandParcelType];
    const totalSurfaceArea = context.siteData.surfaceArea ?? 0;

    return {
      complete: [
        {
          stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
          answers: { surfaceAreas: { [singleType]: totalSurfaceArea } },
        },
      ],
      next: "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION",
    };
  },
} satisfies AnswerStepHandler<"URBAN_ZONE_LAND_PARCELS_SELECTION">;
