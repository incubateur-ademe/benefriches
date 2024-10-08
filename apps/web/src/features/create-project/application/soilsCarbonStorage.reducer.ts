import { createSlice } from "@reduxjs/toolkit";

import {
  CurrentAndProjectedSoilsCarbonStorageResult,
  fetchCurrentAndProjectedSoilsCarbonStorage,
} from "./soilsCarbonStorage.actions";

export type LoadingState = "idle" | "loading" | "success" | "error";

export type State = {
  loadingState: LoadingState;
  current?: CurrentAndProjectedSoilsCarbonStorageResult["current"];
  projected?: CurrentAndProjectedSoilsCarbonStorageResult["projected"];
};

const initialState: State = {
  loadingState: "idle",
  current: undefined,
  projected: undefined,
};

export const siteCarbonStorage = createSlice({
  name: "projectSoilsCarbonStorage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.pending, (state) => {
      state.loadingState = "loading";
    });
    builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.fulfilled, (state, action) => {
      state.loadingState = "success";
      state.current = action.payload.current;
      state.projected = action.payload.projected;
    });
    builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.rejected, (state) => {
      state.loadingState = "error";
    });
  },
});

export default siteCarbonStorage.reducer;
