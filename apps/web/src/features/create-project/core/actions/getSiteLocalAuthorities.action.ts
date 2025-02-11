import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

type GetMunicipalityDataResult = {
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
export const fetchSiteLocalAuthorities = createAppAsyncThunk<
  GetMunicipalityDataResult["localAuthorities"]
>("project/fetchSiteLocalAuthorities", async (_, { extra, getState }) => {
  const { projectCreation } = getState();
  const { siteRelatedLocalAuthorities, siteData } = projectCreation;
  const cityCode = siteData?.address.cityCode;

  if (!cityCode) {
    throw new Error("fetchSiteLocalAuthorities: Missing city code");
  }

  const { loadingState, city, department, region, epci } = siteRelatedLocalAuthorities;
  const projectSiteLocalAuthoritiesCityCode = city?.code;

  const dataAlreadyFetched =
    loadingState === "success" &&
    projectSiteLocalAuthoritiesCityCode === cityCode &&
    city &&
    department &&
    region;

  if (dataAlreadyFetched) {
    return Promise.resolve({ city, department, region, epci });
  }

  const result = await extra.municipalityDataService.getMunicipalityData(cityCode);

  return result.localAuthorities;
});
