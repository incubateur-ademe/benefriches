import { createAppAsyncThunk } from "../../store-config/appAsyncThunk";

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

type LocalAuthorityConfig<TState> = {
  entityName: string;
  selectSiteData: (state: TState) => { address: { cityCode?: string } } | undefined;
  selectSiteLocalAuthorities: (state: TState) => Partial<
    GetMunicipalityDataResult["localAuthorities"]
  > & {
    loadingState: string;
  };
};

export const createFetchLocalAuthoritiesThunk = <TState>({
  entityName,
  selectSiteData,
  selectSiteLocalAuthorities,
}: LocalAuthorityConfig<TState>) => {
  return createAppAsyncThunk<GetMunicipalityDataResult["localAuthorities"]>(
    `${entityName}/fetchLocalAuthorities`,
    async (_, { extra, getState }) => {
      const state = getState() as TState;
      const siteData = selectSiteData(state);
      const localAuthoritiesData = selectSiteLocalAuthorities(state);

      const cityCode = siteData?.address.cityCode;
      if (!cityCode) {
        throw new Error(`${entityName}/fetchLocalAuthorities: Missing city code`);
      }

      const { loadingState, city, department, region, epci } = localAuthoritiesData;
      const cachedCityCode = city?.code;

      const dataAlreadyFetched =
        loadingState === "success" && cachedCityCode === cityCode && city && department && region;

      if (dataAlreadyFetched) {
        return Promise.resolve({ city, department, region, epci });
      }

      const result = await extra.municipalityDataService.getMunicipalityData(cityCode);
      return result.localAuthorities;
    },
  );
};
