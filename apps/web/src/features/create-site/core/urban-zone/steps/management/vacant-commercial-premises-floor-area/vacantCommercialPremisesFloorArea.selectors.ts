import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../helpers/stateHelpers";
import { getVacantPremisesFootprintSurfaceArea } from "../managementReaders";

type VacantCommercialPremisesFloorAreaViewData = {
  initialValue?: number;
  vacantPremisesFootprintSurfaceArea?: number;
};

export const selectVacantCommercialPremisesFloorAreaViewData = createSelector(
  [(state: RootState) => state.siteCreation.urbanZone.steps],
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
