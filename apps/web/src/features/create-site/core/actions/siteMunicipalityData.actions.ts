import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import type { GetMunicipalityDataResult } from "@/shared/core/gateways/AdministrativeDivisionGateway";

export type { GetMunicipalityDataResult } from "@/shared/core/gateways/AdministrativeDivisionGateway";
export type { AdministrativeDivisionGateway as SiteMunicipalityDataGateway } from "@/shared/core/gateways/AdministrativeDivisionGateway";

export const fetchSiteMunicipalityData = createAppAsyncThunk<GetMunicipalityDataResult>(
  "site/fetchSiteMunicipalityData",
  async (_, { extra, getState }) => {
    const { siteCreation, siteMunicipalityData } = getState();
    const cityCode = siteCreation.siteData.address?.cityCode;

    if (!cityCode) {
      throw new Error("fetchSiteMunicipalityData: Missing city code");
    }

    const { loadingState, localAuthorities, population } = siteMunicipalityData;
    const siteLocalAuthoritiesCityCode = localAuthorities?.city.code;

    const dataAlreadyFetched =
      loadingState === "success" &&
      siteLocalAuthoritiesCityCode === cityCode &&
      localAuthorities &&
      population;

    if (dataAlreadyFetched) {
      return Promise.resolve({ localAuthorities, population });
    }

    const result = await extra.municipalityDataService.getMunicipalityData(cityCode);

    return result;
  },
);
