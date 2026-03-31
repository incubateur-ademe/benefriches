import { createSelector } from "@reduxjs/toolkit";
import type { UrbanZoneLandParcelType } from "shared";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../stateHelpers";
import { getParcelStepIds } from "./parcelStepMapping";

type ParcelBuildingsFloorAreaViewData = {
  parcelType: UrbanZoneLandParcelType;
  buildingsFootprintSurfaceArea: number;
  initialBuildingsFloorSurfaceArea: number | undefined;
};

export function createParcelBuildingsFloorAreaSelector(parcelType: UrbanZoneLandParcelType) {
  const stepIds = getParcelStepIds(parcelType);

  return createSelector(
    [(state: RootState) => state.siteCreation.urbanZone.steps],
    (steps): ParcelBuildingsFloorAreaViewData => {
      const defaultValues = ReadStateHelper.getDefaultAnswers(steps, stepIds.buildingsFloorArea);
      return {
        parcelType,
        buildingsFootprintSurfaceArea:
          ReadStateHelper.getStepAnswers(steps, stepIds.soilsDistribution)?.soilsDistribution
            ?.BUILDINGS ?? 0,
        initialBuildingsFloorSurfaceArea: (
          defaultValues as { buildingsFloorSurfaceArea?: number } | undefined
        )?.buildingsFloorSurfaceArea,
      };
    },
  );
}
