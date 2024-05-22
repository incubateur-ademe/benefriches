import { createSelector, createSlice } from "@reduxjs/toolkit";
import { fetchSiteMunicipalityData } from "./siteMunicipalityData.actions";

import { RootState } from "@/app/application/store";

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

export type LocalAuthority = {
  type: "municipality" | "epci" | "region" | "department";
  name: string;
};

export const getAvailableLocalAuthorities = createSelector(
  [(state: RootState) => state.siteMunicipalityData, (state: RootState) => state.siteCreation],
  (siteMunicipalityData, siteCreation) => {
    const localAuthorities: LocalAuthority[] = [];

    const { owner: siteOwner } = siteCreation.siteData;
    const siteOwnerStructureType = siteOwner?.structureType;

    const { city, department, region, epci } = siteMunicipalityData.localAuthorities ?? {
      city: { name: "Mairie" },
      department: { name: "Département" },
      region: { name: "Région" },
      epci: { name: "Établissement public de coopération intercommunale" },
    };

    if (siteOwnerStructureType !== "municipality") {
      localAuthorities.push({
        type: "municipality",
        name: city.name,
      });
    }
    if (siteOwnerStructureType !== "epci") {
      localAuthorities.push({
        type: "epci",
        name: epci?.name ?? "Établissement public de coopération intercommunale",
      });
    }
    if (siteOwnerStructureType !== "department") {
      localAuthorities.push({
        type: "department",
        name: department.name,
      });
    }
    if (siteOwnerStructureType !== "region") {
      localAuthorities.push({
        type: "region",
        name: region.name,
      });
    }
    return localAuthorities;
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
