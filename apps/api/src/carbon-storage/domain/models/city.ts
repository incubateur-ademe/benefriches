export type CityProps = {
  name: string;
  insee: string;
  department: string;
  region: string;
  zpc: string;
  epci: string;

  code_greco: string[];
  code_groupeser: string[];
  code_ser: string[];
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
    readonly codeGreco: string[],
    readonly codeSer: string[],
    readonly codeSerGroup: string[],
    readonly codePoplarPool: string | undefined,
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
    code_bassin_populicole,
  }: CityProps): City {
    return new City(
      insee,
      name,
      department,
      region,
      zpc,
      epci,
      code_greco,
      code_ser,
      code_groupeser,
      code_bassin_populicole,
    );
  }

  toDatabaseFormat() {
    return {
      insee: this.insee,
      name: this.name,
      department: this.department,
      region: this.region,
      zpc: this.zpc,
      epci: this.epci,
      code_greco: this.codeGreco,
      code_ser: this.codeSer,
      code_groupeser: this.codeSerGroup,
      code_bassin_populicole: this.codePoplarPool,
    };
  }
}
