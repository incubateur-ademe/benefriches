import {
  convertCarbonToCO2eq,
  getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson,
} from "shared";

export { getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson } from "shared";

export const getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson = (
  carbonTons: number,
): number => {
  if (!carbonTons) return 0;

  return getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson(
    convertCarbonToCO2eq(carbonTons),
  );
};
