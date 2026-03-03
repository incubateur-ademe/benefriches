import { createSelector } from "@reduxjs/toolkit";
import {
  SoilType,
  SoilsDistribution,
  getNonSuitableSoilsForPhotovoltaicPanels,
  typedObjectKeys,
} from "shared";

import { selectSiteSoilsDistribution } from "../../../createProject.selectors";
import { ReadStateHelper } from "../../helpers/readState";
import {
  selectMissingSuitableSurfaceArea,
  selectSteps,
} from "../../selectors/soilsTransformation.selectors";

type NonSuitableSoilsSurfaceAreaToTransformViewData = {
  initialValues: SoilsDistribution;
  soilsToTransform: { soilType: SoilType; currentSurfaceArea: number }[];
  missingSuitableSurfaceArea: number;
};
export const selectNonSuitableSoilsSurfaceAreaToTransformViewData = createSelector(
  [selectSteps, selectSiteSoilsDistribution, selectMissingSuitableSurfaceArea],
  (
    steps,
    siteSoilsDistribution,
    missingSuitableSurfaceArea,
  ): NonSuitableSoilsSurfaceAreaToTransformViewData => {
    const nonSuitableSoilsSurfaceAreas =
      getNonSuitableSoilsForPhotovoltaicPanels(siteSoilsDistribution);
    const surfaceStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
    );
    const selectionStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
    );
    const initialValues =
      surfaceStep?.nonSuitableSoilsSurfaceAreaToTransform ??
      typedObjectKeys(nonSuitableSoilsSurfaceAreas).reduce<SoilsDistribution>((acc, soilType) => {
        acc[soilType] = 0;
        return acc;
      }, {});

    const soilsToTransform = (selectionStep?.nonSuitableSoilsToTransform ?? []).map((soilType) => {
      return { soilType, currentSurfaceArea: nonSuitableSoilsSurfaceAreas[soilType] ?? 0 };
    });
    return {
      initialValues,
      missingSuitableSurfaceArea,
      soilsToTransform,
    };
  },
);
