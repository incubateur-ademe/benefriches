import { createSlice } from "@reduxjs/toolkit";

import {
  fetchCurrentAndProjectedSoilsCarbonStorage,
  SoilsCarbonStorageResult,
} from "./soilsCarbonStorage.actions";

export type LoadingState = "idle" | "loading" | "success" | "error";

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

export const siteCarbonStorage = createSlice({
  name: "projectSoilsCarbonStorage",
  initialState: initialState as State,
  reducers: {},
  extraReducers: (builder) => {
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
  },
});

export default siteCarbonStorage.reducer;
