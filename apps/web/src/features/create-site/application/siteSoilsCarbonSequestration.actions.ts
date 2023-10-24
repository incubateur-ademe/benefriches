import { SoilType } from "../domain/siteFoncier.types";

import { createAppAsyncThunk } from "@/appAsyncThunk";

export type GetSiteSoilsCarbonSequestrationPayload = {
  cityCode: string;
  soils: Partial<Record<SoilType, number>>;
};

export type SiteSoilsCarbonSequestrationResult = {
  totalCarbonStorage: number;
  soilsStorage: Partial<Record<SoilType, number>>;
};

export interface SoilsCarbonSequestrationGateway {
  getForCityCodeAndSoils(
    siteInformation: GetSiteSoilsCarbonSequestrationPayload,
  ): Promise<SiteSoilsCarbonSequestrationResult>;
}

export const fetchCarbonSequestrationForSoils = createAppAsyncThunk<
  SiteSoilsCarbonSequestrationResult,
  GetSiteSoilsCarbonSequestrationPayload
>("site/fetchCarbonSequestrationForSoils", async (payload, { extra }) => {
  const result =
    await extra.soilsCarbonSequestrationService.getForCityCodeAndSoils(payload);
  return result;
});
