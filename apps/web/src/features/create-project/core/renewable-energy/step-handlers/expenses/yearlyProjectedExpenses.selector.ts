import { createSelector } from "@reduxjs/toolkit";
import { TExpense, computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower } from "shared";

import { ReadStateHelper } from "../../helpers/readState";
import { selectSteps } from "../../selectors/renewableEnergy.selector";

const getExpenseAmountByPurpose = <TExpenses extends TExpense<string>[]>(
  expenses: TExpenses,
  purpose: TExpenses[number]["purpose"],
): number | undefined => {
  return expenses.find((expense) => expense.purpose === purpose)?.amount;
};

type PhotovoltaicPowerStationYearlyExpensesInitialValues = {
  rent: number;
  maintenance: number;
  taxes: number;
  other: number;
};
export const selectPhotovoltaicPowerStationYearlyExpensesInitialValues = createSelector(
  [selectSteps],
  (steps): PhotovoltaicPowerStationYearlyExpensesInitialValues => {
    const yearlyStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
    );
    const enteredExpenses = yearlyStep?.yearlyProjectedExpenses;
    if (enteredExpenses?.length) {
      return {
        rent: getExpenseAmountByPurpose(enteredExpenses, "rent") ?? 0,
        maintenance: getExpenseAmountByPurpose(enteredExpenses, "maintenance") ?? 0,
        taxes: getExpenseAmountByPurpose(enteredExpenses, "taxes") ?? 0,
        other: getExpenseAmountByPurpose(enteredExpenses, "other") ?? 0,
      };
    }

    const electricalPowerKWc =
      ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER")
        ?.photovoltaicInstallationElectricalPowerKWc ?? 0;
    return computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower(electricalPowerKWc);
  },
);
