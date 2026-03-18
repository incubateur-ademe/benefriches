import { TExpense } from "../../financial";

export type PhotovoltaicInstallationExpense = TExpense<
  "technical_studies" | "installation_works" | "other"
>;

// All data from Comité de régulation de l'énergie 2026
export const PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC = {
  works: 830,
  technicalStudyAmount: 40,
  other: 85,
};

const computeDefaultPhotovoltaicWorksAmountExpenses = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc * PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC.works,
  );
};

const computeDefaultPhotovoltaicTechnicalStudiesAmountExpenses = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc *
      PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC.technicalStudyAmount,
  );
};

const computeDefaultPhotovoltaicOtherAmountExpenses = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc * PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC.other,
  );
};

export const computePhotovoltaicPowerStationInstallationExpensesFromElectricalPower = (
  electricalPowerKWc: number,
) => {
  return {
    works: computeDefaultPhotovoltaicWorksAmountExpenses(electricalPowerKWc),
    technicalStudy: computeDefaultPhotovoltaicTechnicalStudiesAmountExpenses(electricalPowerKWc),
    other: computeDefaultPhotovoltaicOtherAmountExpenses(electricalPowerKWc),
  };
};
