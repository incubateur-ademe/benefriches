import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import type {
  GetSoilsCarbonStoragePayload,
  SoilsCarbonStorageResult,
} from "@/shared/core/gateways/SoilsCarbonStorageGateway";

import { selectSiteSoilsDistribution } from "../selectors/createSite.selectors";
import { SiteCarbonStorage } from "../siteSoilsCarbonStorage.reducer";

export type { SoilsCarbonStorageGateway } from "@/shared/core/gateways/SoilsCarbonStorageGateway";

export type GetSiteSoilsCarbonStoragePayload = GetSoilsCarbonStoragePayload;

export type SiteSoilsCarbonStorageResult = SoilsCarbonStorageResult;

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
