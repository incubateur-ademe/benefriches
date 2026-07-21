import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import { SoilType, SoilsDistribution, getNonSuitableSoilsForPhotovoltaicPanels } from "shared";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type NonSuitableSoilsSelectionViewData = {
  initialValues: { soils: SoilType[] };
  nonSuitableSoils: SoilsDistribution;
  missingSuitableSurfaceArea: number;
};
export const createSelectNonSuitableSelectionViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
  selectSiteSoilsDistribution: Selector<RootState, SoilsDistribution>,
  selectMissingSuitableSurfaceArea: Selector<RootState, number>,
) =>
  createSelector(
    [selectSteps, selectSiteSoilsDistribution, selectMissingSuitableSurfaceArea],
    (
      steps,
      siteSoilsDistribution,
      missingSuitableSurfaceArea,
    ): NonSuitableSoilsSelectionViewData => {
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
