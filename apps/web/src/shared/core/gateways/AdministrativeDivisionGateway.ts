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
  isRural: boolean;
  landAndRealEstateValues: {
    landWithoutBuildingsMedianPricePerSquareMeters?: number;
    propertyValueMedianPricePerSquareMeters: number;
    accuracy: "city" | "france";
  };
};

export interface AdministrativeDivisionGateway {
  getMunicipalityData(cityCode: string): Promise<GetMunicipalityDataResult>;
}
