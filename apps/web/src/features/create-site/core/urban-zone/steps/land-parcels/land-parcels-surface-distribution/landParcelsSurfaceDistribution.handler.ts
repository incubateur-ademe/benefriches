import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswerStepHandler } from "../../../step-handlers/stepHandler.type";
import { getParcelStepIds } from "../../per-parcel-soils/parcelStepMapping";

export const LandParcelsSurfaceDistributionHandler: AnswerStepHandler<"URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION"> =
  {
    stepId: "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",

    getNextStepId(context) {
      const selectedTypes =
        ReadStateHelper.getStepAnswers(context.stepsState, "URBAN_ZONE_LAND_PARCELS_SELECTION")
          ?.landParcelTypes ?? [];

      const firstType = selectedTypes[0];
      if (firstType) {
        return getParcelStepIds(firstType).soilsDistribution;
      }
      return "URBAN_ZONE_SOILS_SUMMARY";
    },
  };
