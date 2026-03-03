import { createSelector } from "@reduxjs/toolkit";
import {
  REQUIRED_SOILS_FOR_PHOTOVOLTAIC_PANELS,
  SoilType,
  SoilsDistribution,
  getSuitableSoilsForTransformation,
  typedObjectKeys,
} from "shared";

import { selectSiteSoilsDistribution } from "../../../../createProject.selectors";
import { ReadStateHelper } from "../../../helpers/readState";
import { selectSteps } from "../../../selectors/renewableEnergy.selector";

type FutureSoilsSelectionViewData = {
  initialValues: SoilType[];
  selectableSoils: SoilType[];
  baseSoilsDistribution: SoilsDistribution;
};
export const selectFutureSoilsSelectionViewData = createSelector(
  [selectSteps, selectSiteSoilsDistribution],
  (steps, siteSoilsDistribution): FutureSoilsSelectionViewData => {
    const nonSuitableSoilsSurfaceStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
    );
    const customSoilsSelectionStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
    );
    const baseSoilsDistribution =
      nonSuitableSoilsSurfaceStep?.baseSoilsDistributionForTransformation ?? siteSoilsDistribution;
    const selectableSoils = getSuitableSoilsForTransformation(
      typedObjectKeys(baseSoilsDistribution),
    );
    const initialValues =
      customSoilsSelectionStep?.futureSoilsSelection ?? REQUIRED_SOILS_FOR_PHOTOVOLTAIC_PANELS;
    return {
      initialValues,
      selectableSoils,
      baseSoilsDistribution,
    };
  },
);
