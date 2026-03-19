import { getSelectedParcelTypes } from "../../stateHelpers";
import type { InfoStepHandler } from "../../stepHandler.type";
import { getParcelStepIds } from "../per-parcel-soils/parcelStepMapping";

export const SoilsAndSpacesIntroductionHandler = {
  stepId: "URBAN_ZONE_SOILS_AND_SPACES_INTRODUCTION",

  getNextStepId(context) {
    const selectedTypes = getSelectedParcelTypes(context.stepsState);

    const firstType = selectedTypes[0];
    if (firstType) {
      return getParcelStepIds(firstType).soilsDistribution;
    }
    return "URBAN_ZONE_SOILS_SUMMARY";
  },
} satisfies InfoStepHandler;
