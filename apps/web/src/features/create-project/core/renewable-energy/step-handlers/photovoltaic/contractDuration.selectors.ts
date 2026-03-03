import { createSelector } from "@reduxjs/toolkit";
import { AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS } from "shared";

import { ReadStateHelper } from "../../helpers/readState";
import { selectSteps } from "../../selectors/renewableEnergy.selector";

type ContractDurationViewData = {
  initialValues: { photovoltaicContractDuration: number };
};

export const selectContractDurationViewData = createSelector(
  selectSteps,
  (steps): ContractDurationViewData => {
    const savedValue = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
    )?.photovoltaicContractDuration;

    return {
      initialValues: {
        photovoltaicContractDuration: savedValue ?? AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS,
      },
    };
  },
);
