import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import {
  REQUIRED_SOILS_FOR_PHOTOVOLTAIC_PANELS,
  SoilType,
  SoilsDistribution,
  getSuitableSoilsForTransformation,
  typedObjectKeys,
} from "shared";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type FutureSoilsSelectionViewData = {
  initialValues: SoilType[];
  selectableSoils: SoilType[];
  baseSoilsDistribution: SoilsDistribution;
};
export const createSelectFutureSoilsSelectionViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
) =>
  createSelector(
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
        nonSuitableSoilsSurfaceStep?.baseSoilsDistributionForTransformation ??
        siteSoilsDistribution;
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
