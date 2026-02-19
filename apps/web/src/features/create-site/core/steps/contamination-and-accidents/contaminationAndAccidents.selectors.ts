import { createSelector } from "@reduxjs/toolkit";

import {
  selectSiteSoilsContamination,
  selectSiteSurfaceArea,
} from "../../selectors/createSite.selectors";

// Soil Contamination Form ViewData
type SoilContaminationFormViewData = {
  siteSurfaceArea: number | undefined;
  siteContamination: {
    hasContaminatedSoils: boolean | undefined;
    contaminatedSoilSurface: number | undefined;
  };
};

export const selectSoilContaminationFormViewData = createSelector(
  [selectSiteSurfaceArea, selectSiteSoilsContamination],
  (siteSurfaceArea, siteContamination): SoilContaminationFormViewData => ({
    siteSurfaceArea,
    siteContamination,
  }),
);
