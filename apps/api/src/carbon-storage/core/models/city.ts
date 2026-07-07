export type CityProps = {
  name: string;
  city_code: string;
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
  readonly cityCode: string;
  readonly name: string;
  readonly department: string;
  readonly region: string;
  readonly zpc: string;
  readonly epci: string;
  readonly codeGreco: string[];
  readonly codeSer: string[];
  readonly codeSerGroup: string[];
  readonly codePoplarPool: string | undefined;
  private constructor(
    cityCode: string,
    name: string,
    department: string,
    region: string,
    zpc: string,
    epci: string,
    codeGreco: string[],
    codeSer: string[],
    codeSerGroup: string[],
    codePoplarPool: string | undefined,
  ) {
    this.cityCode = cityCode;
    this.name = name;
    this.department = department;
    this.region = region;
    this.zpc = zpc;
    this.epci = epci;
    this.codeGreco = codeGreco;
    this.codeSer = codeSer;
    this.codeSerGroup = codeSerGroup;
    this.codePoplarPool = codePoplarPool;
  }

  static create({
    name,
    city_code,
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
      city_code,
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

  toDatabaseFormat(): CityProps {
    return {
      city_code: this.cityCode,
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
