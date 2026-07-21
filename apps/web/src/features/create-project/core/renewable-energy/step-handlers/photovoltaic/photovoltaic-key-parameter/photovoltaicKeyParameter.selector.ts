import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

export const createSelectPhotovoltaicPlantFeaturesKeyParameter = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector(selectSteps, (steps) => {
    return ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER")
      ?.photovoltaicKeyParameter;
  });
