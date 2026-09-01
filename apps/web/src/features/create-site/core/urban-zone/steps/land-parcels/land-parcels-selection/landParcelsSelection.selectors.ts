import { createSelector } from "@reduxjs/toolkit";
import type { UrbanZoneLandParcelType } from "shared";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../../stateHelpers";

type LandParcelsSelectionViewData = {
  initialSelectedTypes: UrbanZoneLandParcelType[];
};

export const createLandParcelsSelectionSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectLandParcelsSelectionViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps],
    (steps): LandParcelsSelectionViewData => {
      const answers = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_LAND_PARCELS_SELECTION");
      return {
        initialSelectedTypes: answers?.landParcelTypes ?? [],
      };
    },
  );

  return { selectLandParcelsSelectionViewData };
};

export const { selectLandParcelsSelectionViewData } =
  createLandParcelsSelectionSelectors(siteCreationRootSelectors);
