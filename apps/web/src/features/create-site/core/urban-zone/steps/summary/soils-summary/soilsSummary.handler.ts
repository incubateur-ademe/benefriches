import { getSelectedParcelTypes, ReadStateHelper } from "../../../stateHelpers";
import type { InfoStepHandler } from "../../../stepHandlerRegistry";
import { getParcelStepIds } from "../../per-parcel-soils/parcelStepMapping";

export const UrbanZoneSoilsSummaryHandler = {
  stepId: "URBAN_ZONE_SOILS_SUMMARY",

  getNextStepId() {
    return "URBAN_ZONE_SOILS_CARBON_STORAGE";
  },

  getPreviousStepId(params) {
    const selectedTypes = getSelectedParcelTypes(params.answers);

    const lastType = selectedTypes[selectedTypes.length - 1];
    if (!lastType) return "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION";

    const lastStepIds = getParcelStepIds(lastType);
    const lastBuildingsStep = ReadStateHelper.getStep(
      params.answers,
      lastStepIds.buildingsFloorArea,
    );
    return lastBuildingsStep?.completed
      ? lastStepIds.buildingsFloorArea
      : lastStepIds.soilsDistribution;
  },
} satisfies InfoStepHandler;
