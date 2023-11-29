import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCarbonStorageForSiteAndProjectSoils,
  ProjectAndSiteSoilsCarbonStorageResult,
} from "./soilsCarbonStorage.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

export type State = {
  loadingState: LoadingState;
  siteCarbonStorage:
    | ProjectAndSiteSoilsCarbonStorageResult["siteCarbonStorage"]
    | undefined;
  projectCarbonStorage:
    | ProjectAndSiteSoilsCarbonStorageResult["projectCarbonStorage"]
    | undefined;
};

const initialState: State = {
  loadingState: "idle",
  siteCarbonStorage: undefined,
  projectCarbonStorage: undefined,
};

export const siteCarbonStorage = createSlice({
  name: "projectSoilsCarbonStorage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(
      fetchCarbonStorageForSiteAndProjectSoils.pending,
      (state) => {
        state.loadingState = "loading";
      },
    );
    builder.addCase(
      fetchCarbonStorageForSiteAndProjectSoils.fulfilled,
      (state, action) => {
        state.loadingState = "success";
        state.siteCarbonStorage = action.payload.siteCarbonStorage;
        state.projectCarbonStorage = action.payload.projectCarbonStorage;
      },
    );
    builder.addCase(
      fetchCarbonStorageForSiteAndProjectSoils.rejected,
      (state) => {
        state.loadingState = "error";
      },
    );
  },
});

export default siteCarbonStorage.reducer;
