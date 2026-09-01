import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../stateHelpers";

type SoilsContaminationViewData = {
  siteSurfaceArea: number;
  initialValues: {
    hasContaminatedSoils: boolean | undefined;
    contaminatedSoilSurface: number | undefined;
  };
};

export const createSoilsContaminationSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectSoilsContaminationViewData = createSelector(
    [rootSelectors.selectSiteSurfaceArea, rootSelectors.selectUrbanZoneSteps],
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

  return { selectSoilsContaminationViewData };
};

export const { selectSoilsContaminationViewData } =
  createSoilsContaminationSelectors(siteCreationRootSelectors);
