import { createSelector } from "@reduxjs/toolkit";
import {
  SurfaceAreaDistribution,
  type SoilsDistribution,
  type UrbanZoneLandParcelType,
} from "shared";

import type { createSiteFormRootSelectors } from "../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../stateHelpers";
import { getParcelStepIds } from "./parcelStepMapping";

type ParcelSoilsDistributionViewData = {
  parcelType: UrbanZoneLandParcelType;
  totalSurfaceArea: number;
  initialSoilsDistribution: SoilsDistribution;
};

export const createParcelSoilsDistributionSelectorFactory = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  return function createParcelSoilsDistributionSelector(parcelType: UrbanZoneLandParcelType) {
    const stepIds = getParcelStepIds(parcelType);

    return createSelector(
      [rootSelectors.selectUrbanZoneSteps, rootSelectors.selectSurfaceAreaInputMode],
      (steps, surfaceAreaInputMode): ParcelSoilsDistributionViewData => {
        const surfaceAreas = ReadStateHelper.getStepAnswers(
          steps,
          "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
        )?.surfaceAreas;
        const totalSurfaceArea = surfaceAreas?.[parcelType] ?? 0;

        const defaultValues = ReadStateHelper.getDefaultAnswers(steps, stepIds.soilsDistribution);
        const soilsDistributionInSquareMeters =
          (defaultValues as { soilsDistribution?: SoilsDistribution } | undefined)
            ?.soilsDistribution ?? {};
        // The step's own payload always stores raw square meters — convert to the currently
        // active input mode here, the same way `landParcelsSurfaceDistribution.selectors.ts`
        // does for the sibling surface-distribution step.
        const initialSoilsDistribution =
          surfaceAreaInputMode === "percentage"
            ? SurfaceAreaDistribution.fromJSON(
                soilsDistributionInSquareMeters,
              ).getDistributionInPercentage()
            : soilsDistributionInSquareMeters;

        return {
          parcelType,
          totalSurfaceArea,
          initialSoilsDistribution,
        };
      },
    );
  };
};

export const createParcelSoilsDistributionSelector =
  createParcelSoilsDistributionSelectorFactory(siteCreationRootSelectors);
