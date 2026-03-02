import { createSelector } from "@reduxjs/toolkit";
import { ReinstatementExpense, SoilsDistribution, TExpense } from "shared";
import {
  computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower,
  computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower,
} from "shared";

import { selectSiteData } from "../../createProject.selectors";
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

type PVReinstatementExpensesViewData = {
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
  decontaminatedSurfaceArea: number;
  reinstatementExpenses: ReinstatementExpense[] | undefined;
};

export const selectPVReinstatementExpensesViewData = createSelector(
  [selectSiteData, selectCreationData],
  (siteData, projectData): PVReinstatementExpensesViewData => ({
    siteSoilsDistribution: siteData?.soilsDistribution ?? {},
    projectSoilsDistribution: projectData.soilsDistribution ?? {},
    decontaminatedSurfaceArea: projectData.decontaminatedSurfaceArea ?? 0,
    reinstatementExpenses: projectData.reinstatementExpenses,
  }),
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
