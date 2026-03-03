import { createSelector } from "@reduxjs/toolkit";

import { ReadStateHelper } from "../../helpers/readState";
import { selectSteps } from "../../selectors/renewableEnergy.selector";

export const selectPhotovoltaicPlantFeaturesKeyParameter = createSelector(selectSteps, (steps) => {
  return ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER")
    ?.photovoltaicKeyParameter;
});
