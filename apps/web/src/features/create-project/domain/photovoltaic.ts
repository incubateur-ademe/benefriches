// 12 500 m² pour 1000 kWc
export const PHOTOVOLTAIC_RATIO_M2_PER_KWC = 12.5;

export const AVERAGE_PHOTOVOLTAIC_CONTRACT_DURATION_IN_YEARS = 30;

const RECOMMENDED_M2_PER_KWC_FOR_ACCESS_PATHS = 0.88;
const RECOMMENDED_M2_PER_KWC_FOR_FOUNDATIONS = 0.02;

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

const PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC = {
  works: 740,
  technicalStudyAmount: 35,
  other: 75,
};

export const computeDefaultPhotovoltaicWorksAmountCost = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc * PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC.works,
  );
};

export const computeDefaultPhotovoltaicTechnicalStudiesAmountCost = (
  electricalPowerKWc: number,
) => {
  return Math.round(
    electricalPowerKWc *
      PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC.technicalStudyAmount,
  );
};

export const computeDefaultPhotovoltaicOtherAmountCost = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc * PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC.other,
  );
};

const PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC_PER_YEAR = {
  rent: 4,
  maintenance: 11,
  taxes: 4.394,
};

export const computeDefaultPhotovoltaicYearlyRentAmount = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc * PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC_PER_YEAR.rent,
  );
};

export const computeDefaultPhotovoltaicYearlyMaintenanceAmount = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc *
      PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC_PER_YEAR.maintenance,
  );
};

const ECONOMICAL_RATIO_OPERATIONS_INCOME_EURO_PER_KWC_PER_YEAR = 0.0065;
export const computeDefaultPhotovoltaicYearlyRecurringRevenueAmount = (
  electricalPowerKWc: number,
) => {
  return Math.round(electricalPowerKWc * ECONOMICAL_RATIO_OPERATIONS_INCOME_EURO_PER_KWC_PER_YEAR);
};

export const computeDefaultPhotovoltaicYearlyTaxesAmount = (electricalPowerKWc: number) => {
  return Math.round(
    electricalPowerKWc * PHOTOVOLTAIC_POWER_PLANT_ECONOMICAL_RATIO_EURO_PER_KWC_PER_YEAR.taxes,
  );
};

const PHOTOVOLTAIC_OPERATIONS_FULL_TIME_JOBS_JOB_PER_KWC = 0.0002;
export const computeDefaultPhotovoltaicOperationsFullTimeJobs = (electricalPowerKWc: number) => {
  return Math.round(electricalPowerKWc * PHOTOVOLTAIC_OPERATIONS_FULL_TIME_JOBS_JOB_PER_KWC);
};

const PHOTOVOLTAIC_INSTALLATION_FULL_TIME_JOBS_JOB_PER_KWC = 0.0013;
export const computeDefaultPhotovoltaicConversionFullTimeJobs = (electricalPowerKWc: number) => {
  return Math.round(electricalPowerKWc * PHOTOVOLTAIC_INSTALLATION_FULL_TIME_JOBS_JOB_PER_KWC);
};
