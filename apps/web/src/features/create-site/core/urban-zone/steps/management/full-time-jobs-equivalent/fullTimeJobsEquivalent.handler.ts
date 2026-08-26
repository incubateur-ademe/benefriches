import type { UrbanZoneAnswerStepHandler } from "../../../stepHandlerRegistry";
import { getVacantPremisesFootprintSurfaceArea } from "../managementReaders";

export const FullTimeJobsEquivalentHandler = {
  stepId: "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT",

  getNextStepId() {
    return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
  },

  getPreviousStepId(params) {
    const footprintSurfaceArea = getVacantPremisesFootprintSurfaceArea(params.answers);

    if (footprintSurfaceArea === 0) {
      return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT";
    }
    return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA";
  },
} satisfies UrbanZoneAnswerStepHandler<"URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT">;
