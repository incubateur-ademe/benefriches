import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../../stateHelpers";

type VacantCommercialPremisesFootprintViewData = {
  initialValue?: number;
  siteSurfaceArea: number;
};

export const createVacantCommercialPremisesFootprintSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectVacantCommercialPremisesFootprintViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps, rootSelectors.selectSiteSurfaceArea],
    (steps, siteSurfaceArea): VacantCommercialPremisesFootprintViewData => {
      const answers = ReadStateHelper.getStepAnswers(
        steps,
        "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT",
      );
      return {
        initialValue: answers?.surfaceArea,
        siteSurfaceArea: siteSurfaceArea ?? 0,
      };
    },
  );

  return { selectVacantCommercialPremisesFootprintViewData };
};

export const { selectVacantCommercialPremisesFootprintViewData } =
  createVacantCommercialPremisesFootprintSelectors(siteCreationRootSelectors);
