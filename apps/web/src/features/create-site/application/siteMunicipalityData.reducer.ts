import { createSlice } from "@reduxjs/toolkit";
import { fetchSiteMunicipalityData } from "./siteMunicipalityData.actions";

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
