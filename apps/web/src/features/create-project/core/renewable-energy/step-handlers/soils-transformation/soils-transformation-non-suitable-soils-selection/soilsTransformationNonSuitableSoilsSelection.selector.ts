import { createSelector } from "@reduxjs/toolkit";
import { SoilType, SoilsDistribution, getNonSuitableSoilsForPhotovoltaicPanels } from "shared";

import { selectSiteSoilsDistribution } from "../../../../createProject.selectors";
import { ReadStateHelper } from "../../../helpers/readState";
import {
  selectMissingSuitableSurfaceArea,
  selectSteps,
} from "../../../selectors/soilsTransformation.selectors";

type NonSuitableSoilsSelectionViewData = {
  initialValues: { soils: SoilType[] };
  nonSuitableSoils: SoilsDistribution;
  missingSuitableSurfaceArea: number;
};
export const selectNonSuitableSelectionViewData = createSelector(
  [selectSteps, selectSiteSoilsDistribution, selectMissingSuitableSurfaceArea],
  (steps, siteSoilsDistribution, missingSuitableSurfaceArea): NonSuitableSoilsSelectionViewData => {
    const nonSuitableSoils = getNonSuitableSoilsForPhotovoltaicPanels(siteSoilsDistribution);
    const selection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
    );
    return {
      initialValues: { soils: selection?.nonSuitableSoilsToTransform ?? [] },
      nonSuitableSoils,
      missingSuitableSurfaceArea,
    };
  },
);
