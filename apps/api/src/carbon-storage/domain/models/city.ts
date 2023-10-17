type CityProps = {
  name: string;
  insee: string;
  department: string;
  region: string;
  zpc: string;
  epci: string;

  code_greco: string[];
  code_groupeser: string[];
  code_ser: string[];
  code_rad13: string | undefined;
  code_bassin_populicole: string | undefined;
};

export class City {
  private constructor(
    readonly insee: string,
    readonly name: string,
    readonly department: string,
    readonly region: string,
    readonly zpc: string,
    readonly epci: string,
    readonly code_rad13: string | undefined,
    readonly code_greco: string[],
    readonly code_ser: string[],
    readonly code_groupeser: string[],
    readonly code_bassin_populicole: string | undefined,
  ) {}

  static create({
    name,
    insee,
    department,
    region,
    zpc,
    epci,
    code_greco,
    code_ser,
    code_groupeser,
    code_rad13,
    code_bassin_populicole,
  }: CityProps): City {
    return new City(
      insee,
      name,
      department,
      region,
      zpc,
      epci,
      code_rad13,
      code_greco,
      code_ser,
      code_groupeser,
      code_bassin_populicole,
    );
  }
}
