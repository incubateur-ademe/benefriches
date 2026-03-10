import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";

export const LandParcelsSurfaceDistributionHandler: AnswerStepHandler<"URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION"> =
  {
    stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",

    getNextStepId() {
      return "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION";
    },
  };
