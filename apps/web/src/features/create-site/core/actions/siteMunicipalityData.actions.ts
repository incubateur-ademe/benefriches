import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

export type GetMunicipalityDataResult = {
  localAuthorities: {
    city: {
      code: string;
      name: string;
    };
    epci?: {
      code: string;
      name: string;
    };
    department: {
      code: string;
      name: string;
    };
    region: {
      code: string;
      name: string;
    };
  };
  population: number;
};

export interface SiteMunicipalityDataGateway {
  getMunicipalityData(cityCode: string): Promise<GetMunicipalityDataResult>;
}

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
