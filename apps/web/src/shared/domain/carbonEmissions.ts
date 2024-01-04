const AVERAGE_FRENCH_ANNUAL_EMISSIONS_PER_PERSON = 9.9;

export const getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson = (
  carbonTons: number,
): number => {
  if (!carbonTons) return 0;

  return carbonTons / AVERAGE_FRENCH_ANNUAL_EMISSIONS_PER_PERSON;
};
