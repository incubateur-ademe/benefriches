import { createSelector, createSlice } from "@reduxjs/toolkit";
import { fetchSiteMunicipalityData } from "./siteMunicipalityData.actions";

import { RootState } from "@/app/application/store";
import formatLocalAuthorityName from "@/shared/services/strings/formatLocalAuthorityName";

export type LoadingState = "idle" | "loading" | "success" | "error";

export type SiteLocalAuthorities = {
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

export type SiteMunicipalityDataState = {
  loadingState: LoadingState;
  localAuthorities?: SiteLocalAuthorities;
  population?: number;
};

const initialState: SiteMunicipalityDataState = {
  loadingState: "idle",
  localAuthorities: undefined,
  population: undefined,
};

export type AvailableLocalAuthority = {
  type: "municipality" | "epci" | "region" | "department";
  name: string;
};

export const getAvailableLocalAuthorities = createSelector(
  [(state: RootState) => state.siteMunicipalityData, (state: RootState) => state.siteCreation],
  (siteMunicipalityData, siteCreation) => {
    const { owner: siteOwner } = siteCreation.siteData;

    const { city, department, region, epci } = siteMunicipalityData.localAuthorities ?? {};

    const addressLocalAuthorities = [
      {
        type: "municipality",
        name: city ? formatLocalAuthorityName("municipality", city.name) : "Mairie",
      },
      {
        type: "epci",
        name: epci
          ? formatLocalAuthorityName("epci", epci.name)
          : "Établissement public de coopération intercommunale",
      },
      {
        type: "department",
        name: department ? formatLocalAuthorityName("department", department.name) : "Département",
      },
      {
        type: "region",
        name: region ? formatLocalAuthorityName("region", region.name) : "Région",
      },
    ];

    return addressLocalAuthorities.filter(
      (addressLocalAuthority) =>
        !(
          addressLocalAuthority.name === siteOwner?.name &&
          addressLocalAuthority.type === siteOwner.structureType
        ),
    ) as AvailableLocalAuthority[];
  },
);

export const getAvailableLocalAuthoritiesWithoutCurrentUser = createSelector(
  [
    (state: RootState) => getAvailableLocalAuthorities(state),
    (state: RootState) => state.currentUser,
  ],
  (availableLocalAuthorities, currentUserState) => {
    const currentUser = currentUserState.currentUser;
    if (currentUser?.structureType !== "local_authority") {
      return availableLocalAuthorities;
    }
    return availableLocalAuthorities.filter(
      (addressLocalAuthority) =>
        !(
          addressLocalAuthority.name === currentUser.structureName &&
          addressLocalAuthority.type === currentUser.structureActivity
        ),
    );
  },
);

export const siteMunicipalityData = createSlice({
  name: "siteMunicipalityData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSiteMunicipalityData.pending, (state) => {
      state.loadingState = "loading";
    });
    builder.addCase(fetchSiteMunicipalityData.fulfilled, (state, action) => {
      state.loadingState = "success";
      state.localAuthorities = action.payload.localAuthorities;
      state.population = action.payload.population;
    });
    builder.addCase(fetchSiteMunicipalityData.rejected, (state) => {
      state.loadingState = "error";
    });
  },
});

export default siteMunicipalityData.reducer;
