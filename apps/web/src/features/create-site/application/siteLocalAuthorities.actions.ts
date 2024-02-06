import { createAppAsyncThunk } from "@/app/application/appAsyncThunk";

export type GetLocalAuthoritiesResult = {
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

export interface LocalAuthoritiesGateway {
  getLocalAuthoritiesForCityCode(cityCode: string): Promise<GetLocalAuthoritiesResult>;
}

export const fetchSiteLocalAuthorities = createAppAsyncThunk<GetLocalAuthoritiesResult>(
  "site/fetchSiteLocalAuthorities",
  async (_, { extra, getState }) => {
    const { siteCreation, siteLocalAuthorities } = getState();
    const cityCode = siteCreation.siteData.address?.cityCode;

    if (!cityCode) {
      throw new Error("fetchSiteLocalAuthorities: Missing city code");
    }

    const { loadingState, localAuthorities } = siteLocalAuthorities;
    const siteLocalAuthoritiesCityCode = localAuthorities?.city.code;

    const dataAlreadyFetched =
      loadingState === "success" && siteLocalAuthoritiesCityCode === cityCode && localAuthorities;

    if (dataAlreadyFetched) {
      return Promise.resolve(localAuthorities);
    }

    const result = await extra.localAuthoritiesService.getLocalAuthoritiesForCityCode(cityCode);

    return result;
  },
);
