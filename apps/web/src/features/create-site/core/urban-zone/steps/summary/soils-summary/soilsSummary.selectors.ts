import { createSelector } from "@reduxjs/toolkit";
import {
  type SoilType,
  SurfaceAreaDistribution,
  typedObjectEntries,
  type SoilsDistribution,
} from "shared";

import type { RootState } from "@/app/store/store";

import { getSelectedParcelTypes, ReadStateHelper } from "../../../helpers/stateHelpers";
import { getParcelStepIds } from "../../per-parcel-soils/parcelStepMapping";

export type UrbanZoneSoilsSummaryViewData = {
  soilsDistribution: SoilsDistribution;
  totalSurfaceArea: number;
};

export const selectUrbanZoneSoilsSummaryViewData = createSelector(
  [
    (state: RootState) => state.siteCreation.urbanZone.steps,
    (state: RootState) => state.siteCreation.siteData.surfaceArea,
  ],
  (steps, totalSurfaceArea): UrbanZoneSoilsSummaryViewData => {
    const selectedTypes = getSelectedParcelTypes(steps);

    // Aggregate soils distribution across all parcel distribution steps
    const aggregated = new SurfaceAreaDistribution<SoilType>();
    for (const parcelType of selectedTypes) {
      const stepId = getParcelStepIds(parcelType).soilsDistribution;
      const stepAnswers = ReadStateHelper.getStepAnswers(steps, stepId);
      const soilsDistribution = (
        stepAnswers as { soilsDistribution?: SoilsDistribution } | undefined
      )?.soilsDistribution;
      if (soilsDistribution) {
        for (const [soilType, area] of typedObjectEntries(soilsDistribution)) {
          aggregated.addSurface(soilType, area ?? 0);
        }
      }
    }
    return {
      soilsDistribution: aggregated.toJSON(),
      totalSurfaceArea: totalSurfaceArea ?? 0,
    };
  },
);
