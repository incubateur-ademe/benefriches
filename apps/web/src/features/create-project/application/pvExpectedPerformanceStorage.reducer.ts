import { createSlice } from "@reduxjs/toolkit";
import { fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation } from "./pvExpectedPerformanceStorage.actions";

export type LoadingState = "idle" | "loading" | "success" | "error";

export type State = {
  loadingState: LoadingState;
  computationContext?: {
    location: {
      lat: number;
      long: number;
      elevation: number;
    };
    dataSources: {
      radiation: string;
      meteo: string;
      period: string;
      horizon?: string;
    };
    pvInstallation: {
      slope: { value: number; optimal: boolean };
      azimuth: { value: number; optimal: boolean };
      type: string;
      technology: string;
      peakPower: number;
      systemLoss: number;
    };
  };
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
        state.computationContext = action.payload.computationContext;
        state.expectedPerformanceMwhPerYear = action.payload.expectedPerformanceMwhPerYear;
      },
    );
    builder.addCase(fetchPhotovoltaicExpectedAnnulPowerPerformanceForLocation.rejected, (state) => {
      state.loadingState = "error";
    });
  },
});

export default pvExpectedPerformanceStorage.reducer;
