import { createSelector } from "@reduxjs/toolkit";
import type { UrbanZoneLandParcelType } from "shared";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../helpers/readState";

export type LandParcelsSurfaceDistributionViewData = {
  selectedParcelTypes: UrbanZoneLandParcelType[];
  totalSurfaceArea: number;
  initialSurfaceAreas: Partial<Record<UrbanZoneLandParcelType, number>>;
};

export const selectLandParcelsSurfaceDistributionViewData = createSelector(
  [
    (state: RootState) => state.siteCreation.urbanZone.steps,
    (state: RootState) => state.siteCreation.siteData.surfaceArea,
  ],
  (steps, totalSurfaceArea): LandParcelsSurfaceDistributionViewData => {
    const selectionAnswers = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_ZONE_LAND_PARCELS_SELECTION",
    );
    const distributionAnswers = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
    );
    return {
      selectedParcelTypes: selectionAnswers?.landParcelTypes ?? [],
      totalSurfaceArea: totalSurfaceArea ?? 0,
      initialSurfaceAreas: distributionAnswers?.surfaceAreas ?? {},
    };
  },
);
