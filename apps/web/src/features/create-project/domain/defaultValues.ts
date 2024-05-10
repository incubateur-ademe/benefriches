import { ReinstatementCosts, ReinstatementCostsPurpose } from "./project.types";

import { roundTo1Digit } from "@/shared/services/round-numbers/roundNumbers";

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

const FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR: Record<
  ReinstatementCostsPurpose,
  number | "unknown"
> = {
  sustainable_soils_reinstatement: 14 / 1000000,
  deimpermeabilization: 5.45 / 1000000,
  asbestos_removal: 6 / 1000000,
  demolition: 6 / 1000000,
  waste_collection: 5.7 / 1000000,
  remediation: 5 / 1000000,
  other_reinstatement: "unknown",
};

export const computeDefaultReinstatementFullTimeJobs = (
  reinstatementExpenses: ReinstatementCosts["expenses"],
) => {
  const reinstatementFullTimeJobs = reinstatementExpenses.reduce(
    (totalJobs, { purpose, amount }) => {
      const ratio = FULL_TIME_JOBS_RATIO_FOR_BUDGET_PER_EURO_PER_YEAR[purpose];
      return ratio === "unknown" ? totalJobs : totalJobs + amount * ratio;
    },
    0,
  );
  return roundTo1Digit(reinstatementFullTimeJobs);
};
