import { createSelector } from "@reduxjs/toolkit";
import { TExpense } from "shared";

import {
  computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower,
  computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower,
} from "../photovoltaic";
import { selectCreationData } from "./renewableEnergy.selector";

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
  selectCreationData,
  (creationData): PhotovoltaicPowerStationInstallationExpensesInitialValues => {
    const enteredExpenses = creationData.photovoltaicPanelsInstallationExpenses;
    if (enteredExpenses?.length) {
      return {
        technicalStudy: getExpenseAmountByPurpose(enteredExpenses, "technical_studies") ?? 0,
        works: getExpenseAmountByPurpose(enteredExpenses, "installation_works") ?? 0,
        other: getExpenseAmountByPurpose(enteredExpenses, "other") ?? 0,
      };
    }

    const { photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc } = creationData;
    return computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower(
      electricalPowerKWc ?? 0,
    );
  },
);

type PhotovoltaicPowerStationYearlyExpensesInitialValues = {
  rent: number;
  maintenance: number;
  taxes: number;
  other: number;
};
export const selectPhotovoltaicPowerStationYearlyExpensesInitialValues = createSelector(
  [selectCreationData],
  (creationData): PhotovoltaicPowerStationYearlyExpensesInitialValues => {
    const enteredExpenses = creationData.yearlyProjectedExpenses;
    if (enteredExpenses?.length) {
      return {
        rent: getExpenseAmountByPurpose(enteredExpenses, "rent") ?? 0,
        maintenance: getExpenseAmountByPurpose(enteredExpenses, "maintenance") ?? 0,
        taxes: getExpenseAmountByPurpose(enteredExpenses, "taxes") ?? 0,
        other: getExpenseAmountByPurpose(enteredExpenses, "other") ?? 0,
      };
    }

    const { photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc } = creationData;
    return computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower(
      electricalPowerKWc ?? 0,
    );
  },
);
