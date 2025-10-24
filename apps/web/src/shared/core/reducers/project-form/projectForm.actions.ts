import { AsyncThunk, AsyncThunkConfig } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "../../store-config/appAsyncThunk";

export const makeProjectFormActionType = (prefix: string, actionName: string) => {
  return `${prefix}/projectForm/${actionName}`;
};

export type ProjectFormReducerActions = {
  fetchSiteRelatedLocalAuthorities: AsyncThunk<
    GetMunicipalityDataResult["localAuthorities"],
    void,
    AsyncThunkConfig
  >;
};

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

export const createProjectFormActions = (
  prefix: "projectCreation" | "projectUpdate",
): ProjectFormReducerActions => {
  return {
    fetchSiteRelatedLocalAuthorities: createAppAsyncThunk<
      GetMunicipalityDataResult["localAuthorities"]
    >(
      makeProjectFormActionType(prefix, "fetchSiteRelatedLocalAuthorities"),
      async (_, { extra, getState }) => {
        const state = getState();
        const siteAddress = state[prefix].siteData?.address;
        const localAuthoritiesData = state[prefix].siteRelatedLocalAuthorities;

        const cityCode = siteAddress?.cityCode;
        if (!cityCode) {
          throw new Error(`${prefix}/fetchSiteRelatedLocalAuthorities: Missing city code`);
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
    ),
  };
};
