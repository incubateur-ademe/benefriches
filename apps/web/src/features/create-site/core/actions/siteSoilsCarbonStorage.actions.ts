import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import type {
  GetSoilsCarbonStoragePayload,
  SoilsCarbonStorageResult,
} from "@/shared/core/gateways/SoilsCarbonStorageGateway";

import type { createSiteFormRootSelectors } from "../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../selectors/createSite.selectors";
import { SiteCarbonStorageResult } from "../siteSoilsCarbonStorage.reducer";

export type { SoilsCarbonStorageGateway } from "@/shared/core/gateways/SoilsCarbonStorageGateway";

export type GetSiteSoilsCarbonStoragePayload = GetSoilsCarbonStoragePayload;

export type SiteSoilsCarbonStorageResult = SoilsCarbonStorageResult;

export const createFetchSiteSoilsCarbonStorage = (
  actionType: string,
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) =>
  createAppAsyncThunk<SiteCarbonStorageResult>(actionType, async (_, { extra, getState }) => {
    const rootState = getState();
    const soilsDistribution = rootSelectors.selectSiteSoilsDistribution(rootState);
    const siteAddress = rootSelectors.selectDerivedSiteData(rootState).address;

    if (!siteAddress) throw new Error("No address in store");

    const result = await extra.soilsCarbonStorageService.getForCityCodeAndSoils({
      cityCode: siteAddress.cityCode,
      soils: soilsDistribution,
    });

    return {
      cityCode: siteAddress.cityCode,
      carbonStorage: {
        total: result.totalCarbonStorage,
        soils: result.soilsStorage,
      },
    };
  });

// Kept as the byte-identical action type ("site/fetchSiteSoilsCarbonStorage") so existing specs
// pass unmodified.
export const fetchSiteSoilsCarbonStorage = createFetchSiteSoilsCarbonStorage(
  "site/fetchSiteSoilsCarbonStorage",
  siteCreationRootSelectors,
);
