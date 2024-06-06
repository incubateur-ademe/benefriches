type TownProps = {
  area: number;
  population: number;
  cityCode: string;
};

export class Town {
  private constructor(
    readonly cityCode: string,
    readonly population: number,
    readonly area: number,
  ) {}

  static create({ area, population, cityCode }: TownProps): Town {
    return new Town(cityCode, population, area);
  }
}
