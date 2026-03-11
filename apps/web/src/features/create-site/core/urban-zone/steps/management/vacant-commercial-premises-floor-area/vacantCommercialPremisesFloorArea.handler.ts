import { ReadStateHelper } from "../../../helpers/stateHelpers";
import type {
  AnswerStepHandler,
  UrbanZoneStepContext,
} from "../../../step-handlers/stepHandler.type";

export const VacantCommercialPremisesFloorAreaHandler: AnswerStepHandler<"URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA"> =
  {
    stepId: "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",

    getNextStepId(context: UrbanZoneStepContext) {
      const footprintSurfaceArea = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
      )?.surfaceArea;
      const siteSurfaceArea = context.siteData.surfaceArea;

      if (footprintSurfaceArea !== undefined && footprintSurfaceArea === siteSurfaceArea) {
        return "URBAN_ZONE_NAMING_INTRODUCTION";
      }
      return "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT";
    },
  };
