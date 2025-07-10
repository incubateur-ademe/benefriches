import { TExpense } from "../../financial";

export type RecurringExpensePurpose = "rent" | "maintenance" | "taxes" | "other";

export type RecurringExpense = TExpense<RecurringExpensePurpose>;

const PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC_PER_YEAR = {
  rent: 4,
  maintenance: 11,
  taxes: 4.394,
};

const computeDefaultPhotovoltaicYearlyRentAmount = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc * PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC_PER_YEAR.rent,
  );
};

const computeDefaultPhotovoltaicYearlyMaintenanceAmount = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc *
      PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC_PER_YEAR.maintenance,
  );
};

const computeDefaultPhotovoltaicYearlyTaxesAmount = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc * PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC_PER_YEAR.taxes,
  );
};

export const computePhotovoltaicPowerStationYearlyExpensesFromElectricalPower = (
  electricalPowerKWc: number,
) => {
  return {
    rent: computeDefaultPhotovoltaicYearlyRentAmount(electricalPowerKWc),
    maintenance: computeDefaultPhotovoltaicYearlyMaintenanceAmount(electricalPowerKWc),
    taxes: computeDefaultPhotovoltaicYearlyTaxesAmount(electricalPowerKWc),
    other: 0,
  };
};
