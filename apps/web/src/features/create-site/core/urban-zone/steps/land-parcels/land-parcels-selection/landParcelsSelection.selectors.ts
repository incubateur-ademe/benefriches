import { createSelector } from "@reduxjs/toolkit";
import type { UrbanZoneLandParcelType } from "shared";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../helpers/readState";

export type LandParcelsSelectionViewData = {
  initialSelectedTypes: UrbanZoneLandParcelType[];
};

export const selectLandParcelsSelectionViewData = createSelector(
  [(state: RootState) => state.siteCreation.urbanZone.steps],
  (steps): LandParcelsSelectionViewData => {
    const answers = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_LAND_PARCELS_SELECTION");
    return {
      initialSelectedTypes: answers?.landParcelTypes ?? [],
    };
  },
);
