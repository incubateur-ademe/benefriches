import { createSelector } from "@reduxjs/toolkit";
import type { UrbanZoneLandParcelType } from "shared";

import type { createSiteFormRootSelectors } from "../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../stateHelpers";
import { getParcelStepIds } from "./parcelStepMapping";

type ParcelBuildingsFloorAreaViewData = {
  parcelType: UrbanZoneLandParcelType;
  buildingsFootprintSurfaceArea: number;
  initialBuildingsFloorSurfaceArea: number | undefined;
};

export const createParcelBuildingsFloorAreaSelectorFactory = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  return function createParcelBuildingsFloorAreaSelector(parcelType: UrbanZoneLandParcelType) {
    const stepIds = getParcelStepIds(parcelType);

    return createSelector(
      [rootSelectors.selectUrbanZoneSteps],
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
  };
};

export const createParcelBuildingsFloorAreaSelector =
  createParcelBuildingsFloorAreaSelectorFactory(siteCreationRootSelectors);
