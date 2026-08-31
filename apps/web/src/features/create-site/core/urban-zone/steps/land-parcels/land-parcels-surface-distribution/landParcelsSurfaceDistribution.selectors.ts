import { createSelector } from "@reduxjs/toolkit";
import type { UrbanZoneLandParcelType } from "shared";

import type { RootState } from "@/app/store/store";

import { selectSiteSurfaceArea } from "../../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../../stateHelpers";

type LandParcelsSurfaceDistributionViewData = {
  selectedParcelTypes: UrbanZoneLandParcelType[];
  totalSurfaceArea: number;
  initialSurfaceAreas: Partial<Record<UrbanZoneLandParcelType, number>>;
};

export const selectLandParcelsSurfaceDistributionViewData = createSelector(
  [(state: RootState) => state.siteCreation.urbanZone.steps, selectSiteSurfaceArea],
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
