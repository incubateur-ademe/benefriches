import { createSelector } from "@reduxjs/toolkit";
import type { SoilType, SoilsDistribution } from "shared";

import {
  selectSiteSoilsDistribution,
  selectSiteSurfaceArea,
} from "../../../createProject.selectors";
import { ReadStateHelper } from "../../helpers/readState";
import { selectSteps } from "../../selectors/renewableEnergy.selector";

type FutureSoilsSurfaceAreasViewData = {
  initialValues?: SoilsDistribution;
  selectedSoils: SoilType[];
  siteSurfaceArea: number;
  photovoltaicPanelsSurfaceArea: number;
  baseSoilsDistribution: SoilsDistribution;
};
export const selectFutureSoilsSurfaceAreasViewData = createSelector(
  [selectSteps, selectSiteSurfaceArea, selectSiteSoilsDistribution],
  (steps, siteSurfaceArea, siteSoilsDistribution): FutureSoilsSurfaceAreasViewData => {
    const customAllocation = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );
    const customSoilsSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
    );
    const nonSuitableSoilsSurface = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
    );
    const surfaceStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
    );

    const initialValues = customAllocation?.soilsDistribution;
    const selectedSoils = customSoilsSelection?.futureSoilsSelection ?? [];
    const photovoltaicPanelsSurfaceArea =
      surfaceStep?.photovoltaicInstallationSurfaceSquareMeters ?? 0;

    return {
      initialValues,
      selectedSoils,
      photovoltaicPanelsSurfaceArea,
      siteSurfaceArea,
      baseSoilsDistribution:
        nonSuitableSoilsSurface?.baseSoilsDistributionForTransformation ?? siteSoilsDistribution,
    };
  },
);
