import { SoilsDistribution, SoilType } from "shared";

export type GetSoilsCarbonStoragePayload = {
  cityCode: string;
  soils: SoilsDistribution;
};

export type SoilsCarbonStorageResult = {
  totalCarbonStorage: number;
  soilsStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
  }[];
};

export interface SoilsCarbonStorageGateway {
  getForCityCodeAndSoils(payload: GetSoilsCarbonStoragePayload): Promise<SoilsCarbonStorageResult>;
}
