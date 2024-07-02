import { GetInfluenceAreaValuesServiceInterface } from "./GetInfluenceAreaValuesService";

export class GetInfluenceAreaValuesServiceMock implements GetInfluenceAreaValuesServiceInterface {
  readonly siteSquareMetersSurfaceArea = 10000;
  readonly citySquareMetersSurfaceArea = 6000000000;
  readonly cityPopulation = 300000;
  readonly cityHousingPerSquareMeter = 0.0005 / 32;
  readonly municipalDensityInhabitantPerSquareMeter = 0.0005;
  readonly influenceRadius = 500;
  getInfluenceSquareMetersArea() {
    return 577586;
  }
  getInfluenceAreaSquareMetersHousingSurface() {
    return 924;
  }
  getInhabitantsFromHousingSurface(surface: number) {
    return surface / 32;
  }
  getHouseholdsFromHousingSurface(surface: number) {
    return surface / 32 / 2.2;
  }
}
