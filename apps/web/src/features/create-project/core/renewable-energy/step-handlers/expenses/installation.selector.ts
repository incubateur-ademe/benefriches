import { createSelector } from "@reduxjs/toolkit";
import {
  TExpense,
  computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower,
} from "shared";

import { ReadStateHelper } from "../../helpers/readState";
import { selectSteps } from "../../selectors/renewableEnergy.selector";

const getExpenseAmountByPurpose = <TExpenses extends TExpense<string>[]>(
  expenses: TExpenses,
  purpose: TExpenses[number]["purpose"],
): number | undefined => {
  return expenses.find((expense) => expense.purpose === purpose)?.amount;
};

type PhotovoltaicPowerStationInstallationExpensesInitialValues = {
  works: number;
  technicalStudy: number;
  other: number;
};
export const selectPhotovoltaicPowerStationInstallationExpensesInitialValues = createSelector(
  selectSteps,
  (steps): PhotovoltaicPowerStationInstallationExpensesInitialValues => {
    const installationStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
    );
    const enteredExpenses = installationStep?.photovoltaicPanelsInstallationExpenses;
    if (enteredExpenses?.length) {
      return {
        technicalStudy: getExpenseAmountByPurpose(enteredExpenses, "technical_studies") ?? 0,
        works: getExpenseAmountByPurpose(enteredExpenses, "installation_works") ?? 0,
        other: getExpenseAmountByPurpose(enteredExpenses, "other") ?? 0,
      };
    }

    const electricalPowerKWc =
      ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER")
        ?.photovoltaicInstallationElectricalPowerKWc ?? 0;
    return computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower(
      electricalPowerKWc,
    );
  },
);
