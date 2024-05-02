import { ReinstatementCosts } from "./project.types";

// Droits de mutation par transaction  (Etat + département + collectivité territoriale)
const TRANSFER_TAX_PERCENT_PER_TRANSACTION = 0.0581;

export const computeTransferTaxFromSellingPrice = (sellingPrice: number) => {
  return Math.round(TRANSFER_TAX_PERCENT_PER_TRANSACTION * sellingPrice * 100) / 100;
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

const FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR = {
  SUSTAINABLE_SOILS_REINSTATEMENT: 14 / 1000000,
  DEIMPERMEABILIZATION: 5.45 / 1000000,
  DEMOLITION_AND_ABESTOS_REMOVAL: 6 / 1000000,
  WASTE_COLLECTION: 5.7 / 1000000,
  REMEDIATION_: 5 / 1000000,
};

export const computeDefaultReinstatementFullTimeJobs = (
  reinstatementExpenses: ReinstatementCosts["expenses"],
) => {
  return Math.round(
    reinstatementExpenses.reduce((totalJobs, { purpose, amount }) => {
      switch (purpose) {
        case "sustainable_soils_reinstatement":
          return (
            totalJobs +
            amount *
              FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR.SUSTAINABLE_SOILS_REINSTATEMENT
          );
        case "abestos_removal":
          return (
            totalJobs +
            amount *
              FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR.DEMOLITION_AND_ABESTOS_REMOVAL
          );
        case "deimpermeabilization":
          return (
            totalJobs +
            amount * FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR.DEIMPERMEABILIZATION
          );
        case "demolition":
          return (
            totalJobs +
            amount *
              FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR.DEMOLITION_AND_ABESTOS_REMOVAL
          );
        case "remediation":
          return (
            totalJobs + amount * FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR.REMEDIATION_
          );
        case "waste_collection":
          return (
            totalJobs + amount * FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR.WASTE_COLLECTION
          );
        default:
          return totalJobs;
      }
    }, 0),
  );
};
