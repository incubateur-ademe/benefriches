import { createSelector, createSlice } from "@reduxjs/toolkit";
import { formatLocalAuthorityName, LocalAuthority } from "shared";

import { RootState } from "@/app/store/store";

import { fetchSiteMunicipalityData } from "./actions/siteMunicipalityData.actions";
import { selectSiteAddress, selectSiteOwner } from "./selectors/createSite.selectors";

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
  isRural?: boolean;
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

// City-aware: the fetched local authorities are cached under whatever cityCode they were last
// fetched for. If the site's current address has since moved to a different city (e.g. the
// ADDRESS step was re-answered — see steps/address/address.handlers.ts), fall back to the
// generic names while the refetch is in flight, rather than momentarily offering the previous
// city's "Mairie de <old city>" as a choice. When there is no current address yet, the cache
// can't be stale by definition — nothing has changed since it was fetched — so it is trusted.
export const selectAvailableLocalAuthorities = createSelector(
  (state: RootState) => state.siteMunicipalityData,
  selectSiteAddress,
  (siteMunicipalityData, siteAddress): AvailableLocalAuthority[] => {
    const isStale =
      siteAddress !== undefined &&
      siteMunicipalityData.localAuthorities?.city.code !== siteAddress.cityCode;
    const { city, department, region, epci } = isStale
      ? {}
      : (siteMunicipalityData.localAuthorities ?? {});

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

// Both creation's and the update flow's fetch-municipality-data thunks (distinct action-type
// prefixes, "site/..." vs "siteUpdate/...") feed this single global slice, keyed only by city
// code — matched by suffix rather than importing the update instance here, which would invert
// the create -> update dependency direction (update-site imports create-site, never the
// reverse).
const isFetchSiteMunicipalityDataAction = (suffix: "pending" | "fulfilled" | "rejected") => {
  return (action: { type: string }): boolean =>
    action.type.endsWith(`/fetchSiteMunicipalityData/${suffix}`);
};

const siteMunicipalityData = createSlice({
  name: "siteMunicipalityData",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(isFetchSiteMunicipalityDataAction("pending"), (state) => {
      state.loadingState = "loading";
    });
    builder.addMatcher(
      isFetchSiteMunicipalityDataAction("fulfilled"),
      (state, action: ReturnType<typeof fetchSiteMunicipalityData.fulfilled>) => {
        state.loadingState = "success";
        state.localAuthorities = action.payload.localAuthorities;
        state.population = action.payload.population;
        state.isRural = action.payload.isRural;
      },
    );
    builder.addMatcher(isFetchSiteMunicipalityDataAction("rejected"), (state) => {
      state.loadingState = "error";
    });
  },
});

export default siteMunicipalityData.reducer;
