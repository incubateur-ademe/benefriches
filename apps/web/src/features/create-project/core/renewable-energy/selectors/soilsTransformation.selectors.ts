import { createSelector } from "@reduxjs/toolkit";
import {
  SoilsDistribution,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
  isBiodiversityAndClimateSensibleSoil,
  willTransformationNoticeablyImpactBiodiversityAndClimate,
  getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
  sumSoilsSurfaceAreasWhere,
} from "shared";

import { selectSiteData, selectSiteSoilsDistribution } from "../../createProject.selectors";
import { ReadStateHelper } from "../helpers/readState";
import { selectProjectSoilsDistribution, selectSteps } from "./renewableEnergy.selector";

export { selectSteps } from "./renewableEnergy.selector";

export const selectPhotovoltaicPanelsSurfaceArea = createSelector(selectSteps, (steps): number => {
  return (
    ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      ?.photovoltaicInstallationSurfaceSquareMeters ?? 0
  );
});

export const selectSuitableSurfaceAreaForPhotovoltaicPanels = createSelector(
  selectSiteData,
  (state): number => {
    return getSuitableSurfaceAreaForPhotovoltaicPanels(state?.soilsDistribution ?? {});
  },
);

export const selectMissingSuitableSurfaceArea = createSelector(
  [selectPhotovoltaicPanelsSurfaceArea, selectSiteSoilsDistribution],
  (neededSurfaceArea, siteSoilsDistribution): number => {
    return neededSurfaceArea - getSuitableSurfaceAreaForPhotovoltaicPanels(siteSoilsDistribution);
  },
);

export const selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed = createSelector(
  [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
  (siteSoilsDistribution, projectSoilsDistribution): number => {
    return getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed(
      siteSoilsDistribution,
      projectSoilsDistribution,
    );
  },
);

export const selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate =
  createSelector(
    [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
    (siteSoilsDistribution, projectSoilsDistribution): boolean => {
      return willTransformationNoticeablyImpactBiodiversityAndClimate(
        siteSoilsDistribution,
        projectSoilsDistribution,
      );
    },
  );

export const selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea = createSelector(
  selectProjectSoilsDistribution,
  (futureSoilsDistribution: SoilsDistribution): number => {
    return sumSoilsSurfaceAreasWhere(futureSoilsDistribution, isBiodiversityAndClimateSensibleSoil);
  },
);
