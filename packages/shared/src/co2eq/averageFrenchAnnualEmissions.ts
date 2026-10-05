const AVERAGE_FRENCH_ANNUAL_EMISSIONS_TON_CO2_EQ_PER_PERSON = 9.2;

export const getCo2EqEmissionsTonsInAverageFrenchAnnualEmissionsPerPerson = (
  co2EqEmissions: number,
): number => {
  return co2EqEmissions / AVERAGE_FRENCH_ANNUAL_EMISSIONS_TON_CO2_EQ_PER_PERSON;
};
