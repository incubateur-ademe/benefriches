import { GetInfluenceAreaValuesServiceInterface } from "../../../gateways/GetInfluenceAreaValuesService";

const DEFAULT_IMPACT_RADIUS = 500;
const SQUARE_METERS_PER_PERSON = 32;
const PERSONS_PER_HOUSEHOLD = 2.2;

export class GetInfluenceAreaValuesService implements GetInfluenceAreaValuesServiceInterface {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  influenceRadius: number;

  constructor(
    siteSquareMetersSurfaceArea: number,
    citySquareMetersSurfaceArea: number,
    cityPopulation: number,
    influenceRadius: number = DEFAULT_IMPACT_RADIUS,
  ) {
    this.siteSquareMetersSurfaceArea = siteSquareMetersSurfaceArea;
    this.citySquareMetersSurfaceArea = citySquareMetersSurfaceArea;
    this.cityPopulation = cityPopulation;
    this.influenceRadius = influenceRadius;
  }

  get municipalDensityInhabitantPerSquareMeter() {
    return this.cityPopulation / this.citySquareMetersSurfaceArea;
  }

  get cityHousingPerSquareMeter() {
    return this.municipalDensityInhabitantPerSquareMeter * SQUARE_METERS_PER_PERSON;
  }

  getInfluenceSquareMetersArea() {
    const siteRadius = Math.sqrt(this.siteSquareMetersSurfaceArea / Math.PI);
    return (
      Math.pow(siteRadius + this.influenceRadius, 2) * Math.PI - this.siteSquareMetersSurfaceArea
    );
  }

  getInfluenceAreaSquareMetersHousingSurface() {
    return this.getInfluenceSquareMetersArea() * this.cityHousingPerSquareMeter;
  }

  getInhabitantsFromHousingSurface(housingSurface: number) {
    return housingSurface / SQUARE_METERS_PER_PERSON;
  }

  getHouseholdsFromHousingSurface(housingSurface: number) {
    return this.getInhabitantsFromHousingSurface(housingSurface) / PERSONS_PER_HOUSEHOLD;
  }
}
