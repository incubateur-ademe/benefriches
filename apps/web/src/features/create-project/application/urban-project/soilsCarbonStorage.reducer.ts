import { createReducer } from "@reduxjs/toolkit";

import { SoilsCarbonStorageResult } from "../soilsCarbonStorage.action";
import { fetchCurrentAndProjectedSoilsCarbonStorage } from "./soilsCarbonStorage.actions";

export type State =
  | {
      loadingState: "success";
      current: SoilsCarbonStorageResult;
      projected: SoilsCarbonStorageResult;
    }
  | {
      loadingState: "idle" | "loading" | "error";
      current: undefined;
      projected: undefined;
    };

const initialState = {
  loadingState: "idle",
  current: undefined,
  projected: undefined,
} satisfies State;

const soilsCarbonStorageReducer = createReducer(initialState as State, (builder) => {
  builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.pending, (state) => {
    state.loadingState = "loading";
  });
  builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.fulfilled, (_, action) => {
    return {
      loadingState: "success",
      current: action.payload.current,
      projected: action.payload.projected,
    };
  });
  builder.addCase(fetchCurrentAndProjectedSoilsCarbonStorage.rejected, (state) => {
    state.loadingState = "error";
  });
});

export default soilsCarbonStorageReducer;
