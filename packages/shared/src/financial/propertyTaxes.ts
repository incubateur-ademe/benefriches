// Source : https://data.economie.gouv.fr/explore/dataset/fiscalite-locale-des-particuliers-geo/table/?disjunctive.insee_com
const AVERAGE_PROPERTY_TAXES_RATE = 0.4038;
// Source : https://www.seloger.com/prix-de-l-immo/location/pays/france.htm
const AVERAGE_RENTAL_VALUE_PER_SQUARE_METERS = 14;

export const computeEstimatedPropertyTaxesAmount = (buildingsSurfaceArea: number) => {
  const estimatedRentalValue = AVERAGE_RENTAL_VALUE_PER_SQUARE_METERS * buildingsSurfaceArea;
  return Math.round(estimatedRentalValue * 0.5 * AVERAGE_PROPERTY_TAXES_RATE);
};
