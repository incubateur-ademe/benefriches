import { createSelector, createSlice } from "@reduxjs/toolkit";
import { formatLocalAuthorityName, LocalAuthority } from "shared";

import { RootState } from "@/shared/core/store-config/store";

import { fetchSiteMunicipalityData } from "./actions/siteMunicipalityData.actions";
import { selectSiteOwner } from "./selectors/createSite.selectors";

type LoadingState = "idle" | "loading" | "success" | "error";

type SiteLocalAuthorities = {
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

type SiteMunicipalityDataState = {
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
  type: LocalAuthority;
  name: string;
};

export const selectAvailableLocalAuthorities = createSelector(
  (state: RootState) => state.siteMunicipalityData,
  (siteMunicipalityData): AvailableLocalAuthority[] => {
    const { city, department, region, epci } = siteMunicipalityData.localAuthorities ?? {};

    return [
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
  },
);

export const selectAvailableLocalAuthoritiesWithoutCurrentOwner = createSelector(
  [selectAvailableLocalAuthorities, selectSiteOwner],
  (availableLocalAuthorities, siteOwner) => {
    if (!siteOwner) {
      return availableLocalAuthorities;
    }
    return availableLocalAuthorities.filter(
      (localAuthority) =>
        !(
          localAuthority.name === siteOwner.name && localAuthority.type === siteOwner.structureType
        ),
    );
  },
);

export const selectAvailableLocalAuthoritiesWithoutCurrentUser = createSelector(
  [selectAvailableLocalAuthorities, (state: RootState) => state.currentUser],
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

const siteMunicipalityData = createSlice({
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
