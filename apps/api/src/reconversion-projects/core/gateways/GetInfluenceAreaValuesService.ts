export interface GetInfluenceAreaValuesServiceInterface {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  cityHousingPerSquareMeter: number;
  municipalDensityInhabitantPerSquareMeter: number;
  getInhabitantsFromHousingSurface: (surface: number) => number;
  getHouseholdsFromHousingSurface: (surface: number) => number;
  getInfluenceSquareMetersArea: () => number;
  getInfluenceAreaSquareMetersHousingSurface: () => number;
}
