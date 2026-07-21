import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import {
  SoilsDistribution,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
  isBiodiversityAndClimateSensibleSoil,
  willTransformationNoticeablyImpactBiodiversityAndClimate,
  getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
  sumSoilsSurfaceAreasWhere,
} from "shared";

import type { RootState } from "@/app/store/store";
import type { ProjectSiteView } from "@/features/create-project/core/project-form/projectSite.types";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../helpers/readState";

export const createSelectPhotovoltaicPanelsSurfaceArea = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector(selectSteps, (steps): number => {
    return (
      ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
        ?.photovoltaicInstallationSurfaceSquareMeters ?? 0
    );
  });

export const createSelectSuitableSurfaceAreaForPhotovoltaicPanels = (
  selectSiteData: Selector<RootState, ProjectSiteView | undefined>,
) =>
  createSelector(selectSiteData, (state): number => {
    return getSuitableSurfaceAreaForPhotovoltaicPanels(state?.soilsDistribution ?? {});
  });

export const createSelectMissingSuitableSurfaceArea = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
) => {
  const selectPhotovoltaicPanelsSurfaceArea =
    createSelectPhotovoltaicPanelsSurfaceArea(selectSteps);

  return createSelector(
    [selectPhotovoltaicPanelsSurfaceArea, selectSiteSoilsDistribution],
    (neededSurfaceArea, siteSoilsDistribution): number => {
      return neededSurfaceArea - getSuitableSurfaceAreaForPhotovoltaicPanels(siteSoilsDistribution);
    },
  );
};

export const createSelectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed = (
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
  selectProjectSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
    (siteSoilsDistribution, projectSoilsDistribution): number => {
      return getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed(
        siteSoilsDistribution,
        projectSoilsDistribution,
      );
    },
  );

export const createSelectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate = (
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
  selectProjectSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
    (siteSoilsDistribution, projectSoilsDistribution): boolean => {
      return willTransformationNoticeablyImpactBiodiversityAndClimate(
        siteSoilsDistribution,
        projectSoilsDistribution,
      );
    },
  );

export const createSelectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea = (
  selectProjectSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
    selectProjectSoilsDistribution,
    (futureSoilsDistribution: SoilsDistribution): number => {
      return sumSoilsSurfaceAreasWhere(
        futureSoilsDistribution,
        isBiodiversityAndClimateSensibleSoil,
      );
    },
  );
