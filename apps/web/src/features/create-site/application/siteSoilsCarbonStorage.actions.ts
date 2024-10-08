import { SoilType } from "shared";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

import { SiteCarbonStorage } from "./siteSoilsCarbonStorage.reducer";

export type GetSiteSoilsCarbonStoragePayload = {
  cityCode: string;
  soils: { type: SoilType; surfaceArea: number }[];
};

export type SiteSoilsCarbonStorageResult = {
  totalCarbonStorage: number;
  soilsStorage: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
  }[];
};

export interface SoilsCarbonStorageGateway {
  getForCityCodeAndSoils(
    payload: GetSiteSoilsCarbonStoragePayload,
  ): Promise<SiteSoilsCarbonStorageResult>;
}

export const fetchCarbonStorageForSoils = createAppAsyncThunk<
  SiteCarbonStorage,
  GetSiteSoilsCarbonStoragePayload
>("site/fetchCarbonStorageForSoils", async (payload, { extra }) => {
  const result = await extra.soilsCarbonStorageService.getForCityCodeAndSoils(payload);

  return {
    total: result.totalCarbonStorage,
    soils: result.soilsStorage,
  };
});
