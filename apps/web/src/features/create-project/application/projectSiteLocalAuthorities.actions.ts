import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

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
export const fetchSiteLocalAuthorities = createAppAsyncThunk<
  GetMunicipalityDataResult["localAuthorities"]
>("project/fetchSiteLocalAuthorities", async (_, { extra, getState }) => {
  const { projectCreation, projectSiteLocalAuthorities } = getState();
  const cityCode = projectCreation.siteData?.address.cityCode;

  if (!cityCode) {
    throw new Error("fetchSiteLocalAuthorities: Missing city code");
  }

  const { loadingState, localAuthorities } = projectSiteLocalAuthorities;
  const projectSiteLocalAuthoritiesCityCode = localAuthorities?.city.code;

  const dataAlreadyFetched =
    loadingState === "success" &&
    projectSiteLocalAuthoritiesCityCode === cityCode &&
    localAuthorities;

  if (dataAlreadyFetched) {
    return Promise.resolve(localAuthorities);
  }

  const result = await extra.municipalityDataService.getMunicipalityData(cityCode);

  return result.localAuthorities;
});
