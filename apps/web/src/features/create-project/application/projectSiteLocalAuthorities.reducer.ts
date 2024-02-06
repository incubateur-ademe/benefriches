import { createSlice } from "@reduxjs/toolkit";
import { fetchSiteLocalAuthorities } from "./projectSiteLocalAuthorities.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

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

export type ProjectSiteLocalAuthoritiesState = {
  loadingState: LoadingState;
  localAuthorities?: SiteLocalAuthorities;
};

const initialState: ProjectSiteLocalAuthoritiesState = {
  loadingState: "idle",
  localAuthorities: undefined,
};

export const siteLocalAuthorities = createSlice({
  name: "projectSiteLocalAuthorities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSiteLocalAuthorities.pending, (state) => {
      state.loadingState = "loading";
    });
    builder.addCase(fetchSiteLocalAuthorities.fulfilled, (state, action) => {
      state.loadingState = "success";
      state.localAuthorities = action.payload;
    });
    builder.addCase(fetchSiteLocalAuthorities.rejected, (state) => {
      state.loadingState = "error";
    });
  },
});

export default siteLocalAuthorities.reducer;
