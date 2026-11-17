import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import type { createSiteFormRootSelectors } from "../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../selectors/createSite.selectors";
import type { SiteLocalAuthorities } from "../siteMunicipalityData.reducer";

export type { GetMunicipalityDataResult } from "@/shared/core/gateways/AdministrativeDivisionGateway";
export type { AdministrativeDivisionGateway as SiteMunicipalityDataGateway } from "@/shared/core/gateways/AdministrativeDivisionGateway";

export const createFetchSiteMunicipalityData = (
  actionType: string,
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) =>
  createAppAsyncThunk<{
    localAuthorities?: SiteLocalAuthorities;
    population?: number;
    isRural?: boolean;
  }>(actionType, async (_, { extra, getState }) => {
    const rootState = getState();
    const { siteMunicipalityData } = rootState;
    const cityCode = rootSelectors.selectDerivedSiteData(rootState).address?.cityCode;

    if (!cityCode) {
      throw new Error("fetchSiteMunicipalityData: Missing city code");
    }

    const { loadingState, localAuthorities } = siteMunicipalityData;
    const siteLocalAuthoritiesCityCode = localAuthorities?.city.code;

    const dataAlreadyFetched =
      loadingState === "success" && siteLocalAuthoritiesCityCode === cityCode && localAuthorities;

    if (dataAlreadyFetched) {
      return Promise.resolve(siteMunicipalityData);
    }

    const result = await extra.municipalityDataService.getMunicipalityData(cityCode);

    return result;
  });

// Kept as the byte-identical action type ("site/fetchSiteMunicipalityData") so existing specs
// pass unmodified.
export const fetchSiteMunicipalityData = createFetchSiteMunicipalityData(
  "site/fetchSiteMunicipalityData",
  siteCreationRootSelectors,
);
