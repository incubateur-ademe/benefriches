import { SoilsDistribution, SoilType } from "shared";

import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

import { selectSiteSoilsDistribution } from "../selectors/createSite.selectors";
import { SiteCarbonStorage } from "../siteSoilsCarbonStorage.reducer";

export type GetSiteSoilsCarbonStoragePayload = {
  cityCode: string;
  soils: SoilsDistribution;
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

export const fetchSiteSoilsCarbonStorage = createAppAsyncThunk<SiteCarbonStorage>(
  "site/fetchSiteSoilsCarbonStorage",
  async (_, { extra, getState }) => {
    const rootState = getState();
    const soilsDistribution = selectSiteSoilsDistribution(rootState);
    const siteAddress = rootState.siteCreation.siteData.address;

    if (!siteAddress) throw new Error("No address in store");

    const result = await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
      cityCode: siteAddress.cityCode,
      soils: soilsDistribution,
    });

    return {
      total: result.totalCarbonStorage,
      soils: result.soilsStorage,
    };
  },
);
