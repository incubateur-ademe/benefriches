import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../selectors/createSite.selectors";

// Soil Contamination Form ViewData
type SoilContaminationFormViewData = {
  siteSurfaceArea: number | undefined;
  siteContamination: {
    hasContaminatedSoils: boolean | undefined;
    contaminatedSoilSurface: number | undefined;
  };
};

export const createContaminationAndAccidentsSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectSoilContaminationFormViewData = createSelector(
    [rootSelectors.selectSiteSurfaceArea, rootSelectors.selectSiteSoilsContamination],
    (siteSurfaceArea, siteContamination): SoilContaminationFormViewData => ({
      siteSurfaceArea,
      siteContamination,
    }),
  );

  return { selectSoilContaminationFormViewData };
};

export const { selectSoilContaminationFormViewData } =
  createContaminationAndAccidentsSelectors(siteCreationRootSelectors);
