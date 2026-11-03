import { getSelectedParcelTypes } from "../../stateHelpers";
import type { InfoStepHandler } from "../../stepHandlerRegistry";
import { getParcelStepIds } from "../per-parcel-soils/parcelStepMapping";

export const UrbanZoneMissingInformationHandler = {
  stepId: "URBAN_ZONE_MISSING_INFORMATION",

  getNextStepId(params) {
    const firstType = getSelectedParcelTypes(params.answers)[0];
    if (firstType) {
      return getParcelStepIds(firstType).soilsDistribution;
    }
    return "URBAN_ZONE_SOILS_SUMMARY";
  },

  getPreviousStepId() {
    return "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION";
  },
} satisfies InfoStepHandler;
