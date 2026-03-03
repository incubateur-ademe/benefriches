import { createSelector } from "@reduxjs/toolkit";
import { ReinstatementExpense, SoilsDistribution, TExpense } from "shared";
import {
  computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower,
  computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower,
} from "shared";

import { selectSiteData } from "../../createProject.selectors";
import { ReadStateHelper } from "../helpers/readState";
import { selectProjectSoilsDistribution, selectSteps } from "./renewableEnergy.selector";

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

type PVReinstatementExpensesViewData = {
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
  decontaminatedSurfaceArea: number;
  reinstatementExpenses: ReinstatementExpense[] | undefined;
};

export const selectPVReinstatementExpensesViewData = createSelector(
  [selectSiteData, selectSteps, selectProjectSoilsDistribution],
  (siteData, steps, projectSoilsDistribution): PVReinstatementExpensesViewData => {
    const decontaminationSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    );
    const decontaminationSurface = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
    );
    const reinstatementStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
    );
    return {
      siteSoilsDistribution: siteData?.soilsDistribution ?? {},
      projectSoilsDistribution,
      decontaminatedSurfaceArea:
        decontaminationSurface?.decontaminatedSurfaceArea ??
        decontaminationSelection?.decontaminatedSurfaceArea ??
        0,
      reinstatementExpenses: reinstatementStep?.reinstatementExpenses,
    };
  },
);

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
