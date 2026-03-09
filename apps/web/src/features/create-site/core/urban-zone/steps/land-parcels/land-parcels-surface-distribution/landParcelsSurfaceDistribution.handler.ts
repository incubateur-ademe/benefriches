import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";

export const LandParcelsSurfaceDistributionHandler: AnswerStepHandler<"URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION"> =
  {
    stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",

    getNextStepId() {
      // Phase 4 will implement the per-parcel soils loop
      return "URBAN_ZONE_LAND_PARCEL_SOILS_SELECTION";
    },
  };
