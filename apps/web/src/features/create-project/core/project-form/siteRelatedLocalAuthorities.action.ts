import { ActionReducerMapBuilder, AsyncThunk, AsyncThunkConfig } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import { RootState } from "@/app/store/store";
import { makeWizardFormActionType } from "@/shared/core/wizard-form/wizardForm.actions";
import type { WizardFormState } from "@/shared/core/wizard-form/wizardForm.reducer";

type SelectWizardFormState = (
  state: RootState,
) => Pick<WizardFormState, "siteData" | "siteRelatedLocalAuthorities">;

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

export const addWizardFormCasesToBuilder = <S extends WizardFormState>(
  builder: ActionReducerMapBuilder<S>,
  actions: WizardFormReducerActions,
) => {
  builder
    .addCase(actions.fetchSiteRelatedLocalAuthorities.pending, (state) => {
      state.siteRelatedLocalAuthorities.loadingState = "loading";
    })
    .addCase(actions.fetchSiteRelatedLocalAuthorities.fulfilled, (state, action) => {
      state.siteRelatedLocalAuthorities = {
        loadingState: "success",
        ...action.payload,
      };
    })
    .addCase(actions.fetchSiteRelatedLocalAuthorities.rejected, (state) => {
      state.siteRelatedLocalAuthorities.loadingState = "error";
    });
};
