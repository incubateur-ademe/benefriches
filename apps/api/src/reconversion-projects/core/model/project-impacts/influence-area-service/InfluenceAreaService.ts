const DEFAULT_IMPACT_RADIUS = 500;
const SQUARE_METERS_PER_PERSON = 32;
const PERSONS_PER_HOUSEHOLD = 2.2;

type Props = {
  siteSquareMetersSurfaceArea: number;
  citySquareMetersSurfaceArea: number;
  cityPopulation: number;
  influenceRadius?: number;
};

export class InfluenceAreaService {
  protected readonly siteSquareMetersSurfaceArea: number;
  protected readonly citySquareMetersSurfaceArea: number;
  protected readonly cityPopulation: number;
  protected influenceRadius: number;

  constructor({
    siteSquareMetersSurfaceArea,
    citySquareMetersSurfaceArea,
    cityPopulation,
    influenceRadius = DEFAULT_IMPACT_RADIUS,
  }: Props) {
    this.siteSquareMetersSurfaceArea = siteSquareMetersSurfaceArea;
    this.citySquareMetersSurfaceArea = citySquareMetersSurfaceArea;
    this.cityPopulation = cityPopulation;
    this.influenceRadius = influenceRadius;
  }

  protected get municipalDensityInhabitantPerSquareMeter() {
    return this.cityPopulation / this.citySquareMetersSurfaceArea;
  }

  protected get cityHousingPerSquareMeter() {
    return this.municipalDensityInhabitantPerSquareMeter * SQUARE_METERS_PER_PERSON;
  }

  protected get influenceSquareMetersArea() {
    const siteRadius = Math.sqrt(this.siteSquareMetersSurfaceArea / Math.PI);
    return (
      Math.pow(siteRadius + this.influenceRadius, 2) * Math.PI - this.siteSquareMetersSurfaceArea
    );
  }

  static getInhabitantsFromHousingSurface(housingSurface: number) {
    return housingSurface / SQUARE_METERS_PER_PERSON;
  }

  static getHouseholdsFromHousingSurface(housingSurface: number) {
    return this.getInhabitantsFromHousingSurface(housingSurface) / PERSONS_PER_HOUSEHOLD;
  }

  getInfluenceAreaSquareMetersHousingSurface() {
    return this.influenceSquareMetersArea * this.cityHousingPerSquareMeter;
  }
}
