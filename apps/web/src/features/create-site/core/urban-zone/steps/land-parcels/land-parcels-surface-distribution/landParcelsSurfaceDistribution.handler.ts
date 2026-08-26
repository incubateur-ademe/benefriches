import type { UrbanZoneAnswerStepHandler } from "../../../stepHandlerRegistry";

export const LandParcelsSurfaceDistributionHandler = {
  stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",

  getNextStepId() {
    return "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION";
  },
} satisfies UrbanZoneAnswerStepHandler<"URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION">;
