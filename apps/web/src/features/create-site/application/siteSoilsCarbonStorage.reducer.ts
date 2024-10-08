import { createSlice } from "@reduxjs/toolkit";
import { SoilType } from "shared";

import { fetchCarbonStorageForSoils } from "./siteSoilsCarbonStorage.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

export type SiteCarbonStorage = {
  total: number;
  soils: {
    type: SoilType;
    surfaceArea: number;
    carbonStorage: number;
    carbonStorageInTonPerSquareMeters: number;
  }[];
};

export type State = {
  loadingState: LoadingState;
  carbonStorage: SiteCarbonStorage | undefined;
};

const initialState: State = {
  loadingState: "idle",
  carbonStorage: undefined,
};

export const siteCarbonStorage = createSlice({
  name: "carbonStorage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCarbonStorageForSoils.pending, (state) => {
      state.loadingState = "loading";
    });
    builder.addCase(fetchCarbonStorageForSoils.fulfilled, (state, action) => {
      state.loadingState = "success";
      state.carbonStorage = action.payload;
    });
    builder.addCase(fetchCarbonStorageForSoils.rejected, (state) => {
      state.loadingState = "error";
    });
  },
});

export default siteCarbonStorage.reducer;
