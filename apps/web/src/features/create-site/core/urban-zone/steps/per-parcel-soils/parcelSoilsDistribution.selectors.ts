import { createSelector } from "@reduxjs/toolkit";
import type { SoilsDistribution, UrbanZoneLandParcelType } from "shared";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../helpers/readState";
import { getParcelStepIds } from "./parcelStepMapping";

export type ParcelSoilsDistributionViewData = {
  parcelType: UrbanZoneLandParcelType;
  totalSurfaceArea: number;
  initialSoilsDistribution: SoilsDistribution;
};

export function createParcelSoilsDistributionSelector(parcelType: UrbanZoneLandParcelType) {
  const stepIds = getParcelStepIds(parcelType);

  return createSelector(
    [(state: RootState) => state.siteCreation.urbanZone.steps],
    (steps): ParcelSoilsDistributionViewData => {
      const surfaceAreas = ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
      )?.surfaceAreas;
      const totalSurfaceArea = surfaceAreas?.[parcelType] ?? 0;

      const defaultValues = ReadStateHelper.getDefaultAnswers(steps, stepIds.soilsDistribution);
      const initialSoilsDistribution =
        (defaultValues as { soilsDistribution?: SoilsDistribution } | undefined)
          ?.soilsDistribution ?? {};

      return {
        parcelType,
        totalSurfaceArea,
        initialSoilsDistribution,
      };
    },
  );
}
