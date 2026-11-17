import type { ActionReducerMapBuilder, AsyncThunk, AsyncThunkConfig } from "@reduxjs/toolkit";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";
import type { RootState } from "@/app/store/store";
import type {
  ProjectSiteView,
  RelatedSiteCityReferenceData,
} from "@/features/create-project/core/project-form/projectSite.types";
import { makeWizardFormActionType } from "@/shared/core/wizard-form/wizardForm.actions";

export type { GetMunicipalityDataResult } from "@/shared/core/gateways/AdministrativeDivisionGateway";
export type { AdministrativeDivisionGateway as SiteMunicipalityDataGateway } from "@/shared/core/gateways/AdministrativeDivisionGateway";

type SelectSiteRelatedFormState = (state: RootState) => {
  siteData?: ProjectSiteView;
  siteCityReferenceData: RelatedSiteCityReferenceData;
};

export type WizardFormReducerActions = {
  fetchSiteCityReferenceData: AsyncThunk<
    Omit<RelatedSiteCityReferenceData, "loadingState">,
    void,
    AsyncThunkConfig
  >;
};

export const createWizardFormActions = (
  prefix: string,
  selectSiteRelatedFormState: SelectSiteRelatedFormState,
): WizardFormReducerActions => {
  return {
    fetchSiteCityReferenceData: createAppAsyncThunk<
      Omit<RelatedSiteCityReferenceData, "loadingState">
    >(
      makeWizardFormActionType(prefix, "fetchSiteCityReferenceData"),
      async (_, { extra, getState }) => {
        const formState = selectSiteRelatedFormState(getState());
        const siteAddress = formState.siteData?.address;

        const cityCode = siteAddress?.cityCode;
        if (!cityCode) {
          throw new Error(`${prefix}/fetchSiteCityReferenceData: Missing city code`);
        }

        const {
          loadingState,
          localAuthorities,
          cityCode: storeCityCode,
          landAndRealEstateValues,
        } = formState.siteCityReferenceData;

        const dataAlreadyFetched =
          loadingState === "success" &&
          cityCode === storeCityCode &&
          localAuthorities &&
          landAndRealEstateValues;

        if (dataAlreadyFetched) {
          return Promise.resolve(formState.siteCityReferenceData);
        }

        const result = await extra.municipalityDataService.getMunicipalityData(cityCode);
        return { cityCode, ...result };
      },
    ),
  };
};

export const addWizardFormCasesToBuilder = <
  S extends { siteCityReferenceData: RelatedSiteCityReferenceData },
>(
  builder: ActionReducerMapBuilder<S>,
  actions: WizardFormReducerActions,
) => {
  builder
    .addCase(actions.fetchSiteCityReferenceData.pending, (state) => {
      state.siteCityReferenceData.loadingState = "loading";
    })
    .addCase(actions.fetchSiteCityReferenceData.fulfilled, (state, action) => {
      state.siteCityReferenceData = {
        loadingState: "success",
        ...action.payload,
      };
    })
    .addCase(actions.fetchSiteCityReferenceData.rejected, (state) => {
      state.siteCityReferenceData.loadingState = "error";
    });
};
