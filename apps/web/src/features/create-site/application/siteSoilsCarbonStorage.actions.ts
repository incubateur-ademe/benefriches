import { SoilType } from "../domain/siteFoncier.types";

import { createAppAsyncThunk } from "@/appAsyncThunk";

export type GetSiteSoilsCarbonStoragePayload = {
  cityCode: string;
  soils: { type: SoilType; surfaceArea: number }[];
};

export type SiteSoilsCarbonStorageResult = {
  totalCarbonStorage: number;
  soilsStorage: Partial<Record<SoilType, number>>;
};

export interface SoilsCarbonStorageGateway {
  getForCityCodeAndSoils(
    payload: GetSiteSoilsCarbonStoragePayload,
  ): Promise<SiteSoilsCarbonStorageResult>;
}

export const fetchCarbonStorageForSoils = createAppAsyncThunk<
  SiteSoilsCarbonStorageResult,
  GetSiteSoilsCarbonStoragePayload
>("site/fetchCarbonStorageForSoils", async (payload, { extra }) => {
  const result =
    await extra.soilsCarbonStorageService.getForCityCodeAndSoils(payload);
  return result;
});
