import { createSelector } from "@reduxjs/toolkit";
import { PhotovoltaicInstallationExpense } from "shared";

import { computePhotovoltaicPowerStationExpensesFromElectricalPower } from "../photovoltaic";
import { selectCreationData } from "./renewableEnergy.selector";

type PhotovoltaicPowerStationInstallationExpensesInitialValues = {
  works: number;
  technicalStudy: number;
  other: number;
};
const expensesToInitialValuesMap = {
  technical_studies: "technicalStudy",
  installation_works: "works",
  other: "other",
} as const satisfies Record<
  PhotovoltaicInstallationExpense["purpose"],
  keyof PhotovoltaicPowerStationInstallationExpensesInitialValues
>;
export const selectPhotovoltaicPowerStationInstallationExpensesInitialValues = createSelector(
  selectCreationData,
  (creationData): PhotovoltaicPowerStationInstallationExpensesInitialValues => {
    const { photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc } = creationData;
    if (creationData.photovoltaicPanelsInstallationExpenses) {
      return creationData.photovoltaicPanelsInstallationExpenses.reduce((acc, cur) => {
        return { ...acc, [expensesToInitialValuesMap[cur.purpose]]: cur.amount };
      }, {}) as PhotovoltaicPowerStationInstallationExpensesInitialValues;
    }
    return computePhotovoltaicPowerStationExpensesFromElectricalPower(electricalPowerKWc ?? 0);
  },
);
