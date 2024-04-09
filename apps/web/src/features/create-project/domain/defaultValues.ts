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
