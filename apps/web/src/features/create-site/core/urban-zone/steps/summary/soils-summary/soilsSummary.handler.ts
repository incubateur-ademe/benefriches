import { getSelectedParcelTypes, ReadStateHelper } from "../../../stateHelpers";
import type { InfoStepHandler } from "../../../stepHandler.type";
import { getParcelStepIds } from "../../per-parcel-soils/parcelStepMapping";

export const UrbanZoneSoilsSummaryHandler = {
  stepId: "URBAN_ZONE_SOILS_SUMMARY",

  getNextStepId() {
    return "URBAN_ZONE_SOILS_CARBON_STORAGE";
  },

  getPreviousStepId(context) {
    const selectedTypes = getSelectedParcelTypes(context.stepsState);

    const lastType = selectedTypes[selectedTypes.length - 1];
    if (!lastType) return "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION";

    const lastStepIds = getParcelStepIds(lastType);
    const lastBuildingsStep = ReadStateHelper.getStep(
      context.stepsState,
      lastStepIds.buildingsFloorArea,
    );
    return lastBuildingsStep?.completed
      ? lastStepIds.buildingsFloorArea
      : lastStepIds.soilsDistribution;
  },
} satisfies InfoStepHandler;
