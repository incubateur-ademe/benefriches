import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCarbonSequestrationForSoils,
  SiteSoilsCarbonSequestrationResult,
} from "./siteSoilsCarbonSequestration.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

export type State = {
  loadingState: LoadingState;
  carbonSequestration: SiteSoilsCarbonSequestrationResult | undefined;
};

const initialState: State = {
  loadingState: "idle",
  carbonSequestration: undefined,
};

export const siteCarbonSequestration = createSlice({
  name: "carbonSequestration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCarbonSequestrationForSoils.pending, (state) => {
      state.loadingState = "loading";
    });
    builder.addCase(
      fetchCarbonSequestrationForSoils.fulfilled,
      (state, action) => {
        state.loadingState = "success";
        state.carbonSequestration = action.payload;
      },
    );
    builder.addCase(fetchCarbonSequestrationForSoils.rejected, (state) => {
      state.loadingState = "error";
    });
  },
});

export default siteCarbonSequestration.reducer;
