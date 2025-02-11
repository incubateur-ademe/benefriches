type CityProps = {
  name: string;
  surfaceArea: number;
  population: number;
  cityCode: string;
};

export class City {
  private constructor(
    readonly name: string,
    readonly cityCode: string,
    readonly population: number,
    readonly surfaceArea: number,
  ) {}

  static create({ name, surfaceArea, population, cityCode }: CityProps): City {
    return new City(name, cityCode, population, surfaceArea);
  }
}
