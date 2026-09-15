export class City {
  readonly cityCode: string;
  readonly name: string;
  readonly department: string;
  readonly region: string;
  readonly zpc: string | undefined;
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
    epci: string,
    zpc: string | undefined,
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
    epci,
    aldo_zpc,
    aldo_code_greco,
    aldo_code_ser,
    aldo_code_groupeser,
    aldo_code_bassin_populicole,
  }: {
    id: string;
    name: string;
    city_code: string;
    department: string;
    region: string;
    epci: string;

    aldo_zpc: string | undefined;
    aldo_code_greco: string[];
    aldo_code_groupeser: string[];
    aldo_code_ser: string[];
    aldo_code_bassin_populicole: string | undefined;

    mte_zonage_abc: string | undefined;
    updated_at?: Date;
  }): City {
    return new City(
      city_code,
      name,
      department,
      region,
      epci,
      aldo_zpc,
      aldo_code_greco,
      aldo_code_ser,
      aldo_code_groupeser,
      aldo_code_bassin_populicole,
    );
  }
}
