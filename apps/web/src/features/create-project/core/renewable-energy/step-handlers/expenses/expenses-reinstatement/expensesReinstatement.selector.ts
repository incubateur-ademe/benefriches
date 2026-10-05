import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type { ReinstatementExpense } from "shared";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type PVReinstatementExpensesViewData = {
  decontaminatedSurfaceArea: number;
  reinstatementExpenses: ReinstatementExpense[] | undefined;
};

export const createSelectPVReinstatementExpensesViewData = (
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector([selectSteps], (steps): PVReinstatementExpensesViewData => {
    const decontamination = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
    );
    const reinstatementExpenses =
      ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT")
        ?.reinstatementExpenses ??
      ReadStateHelper.getDefaultAnswers(steps, "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT")
        ?.reinstatementExpenses;
    return {
      decontaminatedSurfaceArea: decontamination?.decontaminatedSurfaceArea ?? 0,
      reinstatementExpenses: reinstatementExpenses,
    };
  });
