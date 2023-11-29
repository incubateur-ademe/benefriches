import { SoilType } from "../soils";

export type GetSoilsCarbonStoragePayload = {
  cityCode: string;
  soils: { type: SoilType; surfaceArea: number }[];
};

export type SoilsCarbonStorageResult = {
  totalCarbonStorage: number;
  soilsStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
  }[];
};

export interface SoilsCarbonStorageGateway {
  getForCityCodeAndSoils(
    payload: GetSoilsCarbonStoragePayload,
  ): Promise<SoilsCarbonStorageResult>;
}
