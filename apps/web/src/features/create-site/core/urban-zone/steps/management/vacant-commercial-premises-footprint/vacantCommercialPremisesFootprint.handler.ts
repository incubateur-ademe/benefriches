import type { UrbanZoneAnswerStepHandler } from "../../../stepHandlerRegistry";

export const VacantCommercialPremisesFootprintHandler = {
  stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",

  getNextStepId(_params, answer) {
    if (answer?.surfaceArea === 0) {
      return "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT";
    }
    return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA";
  },
} satisfies UrbanZoneAnswerStepHandler<"URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT">;
