export type GetMunicipalityDataResult = {
  localAuthorities: {
    city: {
      code: string;
      name: string;
    };
    epci?: {
      code: string;
      name: string;
    };
    department: {
      code: string;
      name: string;
    };
    region: {
      code: string;
      name: string;
    };
  };
  population: number;
  isRural?: boolean;
};

export interface AdministrativeDivisionGateway {
  getMunicipalityData(cityCode: string): Promise<GetMunicipalityDataResult>;
}
