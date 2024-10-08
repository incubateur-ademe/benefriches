import { createSlice } from "@reduxjs/toolkit";

import { fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation } from "./pvExpectedPerformanceStorage.actions";

export type LoadingState = "idle" | "loading" | "success" | "error";

export type State = {
  loadingState: LoadingState;
  expectedPerformanceMwhPerYear?: number;
};

const initialState: State = {
  loadingState: "idle",
};

export const pvExpectedPerformanceStorage = createSlice({
  name: "pvExpectedPerformanceStorage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation.pending, (state) => {
      state.loadingState = "loading";
    });
    builder.addCase(
      fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation.fulfilled,
      (state, action) => {
        state.loadingState = "success";
        state.expectedPerformanceMwhPerYear = action.payload.expectedPerformanceMwhPerYear;
      },
    );
    builder.addCase(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation.rejected, (state) => {
      state.loadingState = "error";
    });
  },
});

export default pvExpectedPerformanceStorage.reducer;
