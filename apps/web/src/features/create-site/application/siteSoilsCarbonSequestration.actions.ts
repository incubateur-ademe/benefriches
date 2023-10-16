import { FricheSoilType } from "../domain/friche.types";

import { createAppAsyncThunk } from "@/appAsyncThunk";

export type GetSiteSoilsCarbonSequestrationPayload = {
  cityCode: string;
  soils: Partial<Record<FricheSoilType, number>>;
};

export type SiteSoilsCarbonSequestrationResult = {
  totalCarbonStorage: number;
  soilsStorage: Partial<Record<FricheSoilType, number>>;
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
