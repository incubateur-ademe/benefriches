import { createSelector } from "@reduxjs/toolkit";
import type { UrbanZoneLandParcelType } from "shared";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../helpers/readState";
import { getParcelStepIds } from "./parcelStepMapping";

export type ParcelBuildingsFloorAreaViewData = {
  parcelType: UrbanZoneLandParcelType;
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
        initialBuildingsFloorSurfaceArea: (
          defaultValues as { buildingsFloorSurfaceArea?: number } | undefined
        )?.buildingsFloorSurfaceArea,
      };
    },
  );
}
