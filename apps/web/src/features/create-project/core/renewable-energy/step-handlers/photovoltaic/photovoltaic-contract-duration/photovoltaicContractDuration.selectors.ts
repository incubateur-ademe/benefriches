import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import { AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS } from "shared";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type ContractDurationViewData = {
  initialValues: { photovoltaicContractDuration: number };
};

export const createSelectContractDurationViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector(selectSteps, (steps): ContractDurationViewData => {
    const savedValue = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
    )?.photovoltaicContractDuration;

    return {
      initialValues: {
        photovoltaicContractDuration: savedValue ?? AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS,
      },
    };
  });
