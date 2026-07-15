import { AsyncThunk, AsyncThunkConfig } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { RootState } from "@/app/store/store";

import type { WizardFormState } from "./wizardForm.reducer";

/**
 * Lens injected by each consumer so this factory can read the site data it needs without
 * indexing `RootState` by the (now opaque) action prefix. The read fields (`siteData`,
 * `siteRelatedLocalAuthorities`) are domain and the whole `fetchSiteRelatedLocalAuthorities`
 * thunk relocates to the project-form base in ticket 05, at which point this lens disappears.
 */
type SelectWizardFormState = (
  state: RootState,
) => Pick<WizardFormState, "siteData" | "siteRelatedLocalAuthorities">;

export const makeWizardFormActionType = (prefix: string, actionName: string) => {
  return `${prefix}/wizardForm/${actionName}`;
};

export type WizardFormReducerActions = {
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

export const createWizardFormActions = (
  prefix: string,
  selectWizardFormState: SelectWizardFormState,
): WizardFormReducerActions => {
  return {
    fetchSiteRelatedLocalAuthorities: createAppAsyncThunk<
      GetMunicipalityDataResult["localAuthorities"]
    >(
      makeWizardFormActionType(prefix, "fetchSiteRelatedLocalAuthorities"),
      async (_, { extra, getState }) => {
        const formState = selectWizardFormState(getState());
        const siteAddress = formState.siteData?.address;
        const localAuthoritiesData = formState.siteRelatedLocalAuthorities;

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
