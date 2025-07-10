import { TExpense } from "../../financial";

export type PhotovoltaicInstallationExpense = TExpense<
  "technical_studies" | "installation_works" | "other"
>;

export const PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC = {
  works: 740,
  technicalStudyAmount: 35,
  other: 75,
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
