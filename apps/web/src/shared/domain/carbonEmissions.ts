const AVERAGE_FRENCH_ANNUAL_EMISSIONS_TON_CO2_EQ_PER_PERSON = 9.2;

/* 
Poids atomique d'un atome de carbone : 12
Poids atomique d'un atome d'oxygène : 16
Poids atomique total du CO2 = 44 (12 + (16 * 2)). 
Quantité de carbone = Quantité de CO2 * 12 / 44 
1 kg de CO2 = 0,27 kg de carbone
*/
const RATIO_CO2_TO_CARBON = 12 / 44;

export const getCarbonTonsInAverageFrenchAnnualEmissionsPerPerson = (
  carbonTons: number,
): number => {
  if (!carbonTons) return 0;

  return carbonTons / (AVERAGE_FRENCH_ANNUAL_EMISSIONS_TON_CO2_EQ_PER_PERSON * RATIO_CO2_TO_CARBON);
};
