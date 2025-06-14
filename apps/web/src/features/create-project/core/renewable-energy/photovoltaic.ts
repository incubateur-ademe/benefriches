// 10 000 m² pour 1000 kWc
export const PHOTOVOLTAIC_RATIO_M2_PER_KWC = 10;

export const AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS = 20;

const RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS = 0.88;
const RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS = 0.02;

export const getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea = (
  photovoltaicPanelsSurfaceArea: number,
): number => {
  return photovoltaicPanelsSurfaceArea / PHOTOVOLTAIC_RATIO_M2_PER_KWC;
};

export const getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower = (
  electricalPowerKWc: number,
): number => {
  return electricalPowerKWc * PHOTOVOLTAIC_RATIO_M2_PER_KWC;
};

export const getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea = (
  photovoltaicInstallationElectricalPowerKWc: number,
) => {
  return photovoltaicInstallationElectricalPowerKWc * RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS;
};

export const getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea = (
  photovoltaicInstallationElectricalPowerKWc: number,
) => {
  return photovoltaicInstallationElectricalPowerKWc * RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS;
};

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

const ECONOMICAL_RATIO_OPERATIONS_INCOME_EURO_PER_MWH_PER_YEAR = 65;
export const computeDefaultPhotovoltaicYearlyRecurringRevenueAmount = (
  expectedProductionMWh: number,
) => {
  return Math.round(
    expectedProductionMWh * ECONOMICAL_RATIO_OPERATIONS_INCOME_EURO_PER_MWH_PER_YEAR,
  );
};
