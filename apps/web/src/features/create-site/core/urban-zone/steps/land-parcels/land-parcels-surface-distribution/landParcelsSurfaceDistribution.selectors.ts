import { createSelector } from "@reduxjs/toolkit";
import { SurfaceAreaDistribution, type UrbanZoneLandParcelType } from "shared";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../../stateHelpers";

type LandParcelsSurfaceDistributionViewData = {
  selectedParcelTypes: UrbanZoneLandParcelType[];
  totalSurfaceArea: number;
  initialSurfaceAreas: Partial<Record<UrbanZoneLandParcelType, number>>;
};

export const createLandParcelsSurfaceDistributionSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectLandParcelsSurfaceDistributionViewData = createSelector(
    [
      rootSelectors.selectUrbanZoneSteps,
      rootSelectors.selectSiteSurfaceArea,
      rootSelectors.selectSurfaceAreaInputMode,
    ],
    (steps, totalSurfaceArea, surfaceAreaInputMode): LandParcelsSurfaceDistributionViewData => {
      const selectionAnswers = ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_ZONE_LAND_PARCELS_SELECTION",
      );
      const distributionAnswers = ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_ZONE_LAND_PARCELS_SURFACE_DISTRIBUTION",
      );
      // The step's payload always stores raw square meters (see `landParcelsSurfaceDistributionSchema`),
      // but the form can display/edit either unit — convert to the currently active input mode here
      // so `initialSurfaceAreas` is never handed to the form in the wrong unit (mirrors
      // `getSurfaceAreaDistributionWithUnit` in `create-site/core/steps/spaces/spaces.selectors.ts`).
      const surfaceAreasInSquareMeters = distributionAnswers?.surfaceAreas ?? {};
      const initialSurfaceAreas =
        surfaceAreaInputMode === "percentage"
          ? SurfaceAreaDistribution.fromJSON(
              surfaceAreasInSquareMeters,
            ).getDistributionInPercentage()
          : surfaceAreasInSquareMeters;

      return {
        selectedParcelTypes: selectionAnswers?.landParcelTypes ?? [],
        totalSurfaceArea: totalSurfaceArea ?? 0,
        initialSurfaceAreas,
      };
    },
  );

  return { selectLandParcelsSurfaceDistributionViewData };
};

export const { selectLandParcelsSurfaceDistributionViewData } =
  createLandParcelsSurfaceDistributionSelectors(siteCreationRootSelectors);
