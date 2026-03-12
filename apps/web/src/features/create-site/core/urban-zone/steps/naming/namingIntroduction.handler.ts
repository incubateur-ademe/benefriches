import { ReadStateHelper } from "../../helpers/stateHelpers";
import type { InfoStepHandler, UrbanZoneStepContext } from "../../step-handlers/stepHandler.type";

export const UrbanZoneNamingIntroductionHandler = {
  stepId: "URBAN_ZONE_NAMING_INTRODUCTION",

  getNextStepId() {
    return "URBAN_ZONE_NAMING";
  },

  getPreviousStepId(context: UrbanZoneStepContext) {
    const footprintSurfaceArea = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
    )?.surfaceArea;

    if (
      footprintSurfaceArea !== undefined &&
      footprintSurfaceArea === context.siteData.surfaceArea
    ) {
      return "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA";
    }
    return "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT";
  },
} satisfies InfoStepHandler;
