import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../../stateHelpers";
import { getVacantPremisesFootprintSurfaceArea } from "../managementReaders";

type VacantCommercialPremisesFloorAreaViewData = {
  initialValue?: number;
  vacantPremisesFootprintSurfaceArea?: number;
};

export const createVacantCommercialPremisesFloorAreaSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectVacantCommercialPremisesFloorAreaViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps],
    (steps): VacantCommercialPremisesFloorAreaViewData => {
      const answers = ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
      );
      return {
        initialValue: answers?.surfaceArea,
        vacantPremisesFootprintSurfaceArea: getVacantPremisesFootprintSurfaceArea(steps),
      };
    },
  );

  return { selectVacantCommercialPremisesFloorAreaViewData };
};

export const { selectVacantCommercialPremisesFloorAreaViewData } =
  createVacantCommercialPremisesFloorAreaSelectors(siteCreationRootSelectors);
