import type { UrbanZoneAnswerStepHandler } from "../../../stepHandlerRegistry";
import { getVacantPremisesFootprintSurfaceArea } from "../managementReaders";

export const VacantCommercialPremisesFloorAreaHandler = {
  stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",

  getNextStepId(params) {
    const footprintSurfaceArea = getVacantPremisesFootprintSurfaceArea(params.answers);
    const siteSurfaceArea = params.context.siteData.surfaceArea;

    if (footprintSurfaceArea !== undefined && footprintSurfaceArea === siteSurfaceArea) {
      return "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION";
    }
    return "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT";
  },
} satisfies UrbanZoneAnswerStepHandler<"URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA">;
