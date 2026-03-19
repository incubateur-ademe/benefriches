import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../stateHelpers";

type SoilsContaminationViewData = {
  siteSurfaceArea: number;
  initialValues: {
    hasContaminatedSoils: boolean | undefined;
    contaminatedSoilSurface: number | undefined;
  };
};

export const selectSoilsContaminationViewData = createSelector(
  [
    (state: RootState) => state.siteCreation.siteData.surfaceArea,
    (state: RootState) => state.siteCreation.urbanZone.steps,
  ],
  (surfaceArea, steps): SoilsContaminationViewData => {
    const answers = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_SOILS_CONTAMINATION");
    return {
      siteSurfaceArea: surfaceArea ?? 0,
      initialValues: {
        hasContaminatedSoils: answers?.hasContaminatedSoils,
        contaminatedSoilSurface: answers?.contaminatedSoilSurface,
      },
    };
  },
);
