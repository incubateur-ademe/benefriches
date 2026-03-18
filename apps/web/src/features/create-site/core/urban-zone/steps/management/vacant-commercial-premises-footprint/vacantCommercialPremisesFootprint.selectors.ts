import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../helpers/stateHelpers";

type VacantCommercialPremisesFootprintViewData = {
  initialValue?: number;
  siteSurfaceArea: number;
};

export const selectVacantCommercialPremisesFootprintViewData = createSelector(
  [
    (state: RootState) => state.siteCreation.urbanZone.steps,
    (state: RootState) => state.siteCreation.siteData.surfaceArea,
  ],
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
