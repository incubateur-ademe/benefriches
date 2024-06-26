type CityProps = {
  area: number;
  population: number;
  cityCode: string;
};

export class City {
  private constructor(
    readonly cityCode: string,
    readonly population: number,
    readonly area: number,
  ) {}

  static create({ area, population, cityCode }: CityProps): City {
    return new City(cityCode, population, area);
  }
}
