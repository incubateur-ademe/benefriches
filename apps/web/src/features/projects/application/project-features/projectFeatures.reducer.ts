import { createReducer, createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/app/application/store";

import { ProjectFeatures } from "../../domain/projects.types";
import { fetchProjectFeatures } from "./projectFeatures.actions";

type LoadingState = "idle" | "loading" | "success" | "error";

type ProjectFeaturesState = {
  dataLoadingState: LoadingState;
  data?: ProjectFeatures;
};

const getInitialState = (): ProjectFeaturesState => {
  return {
    data: undefined,
    dataLoadingState: "idle",
  };
};

export const projectFeaturesReducer = createReducer(getInitialState(), (builder) => {
  builder.addCase(fetchProjectFeatures.pending, (state) => {
    state.dataLoadingState = "loading";
  });
  builder.addCase(fetchProjectFeatures.fulfilled, (state, action) => {
    state.dataLoadingState = "success";
    state.data = action.payload;
  });
  builder.addCase(fetchProjectFeatures.rejected, (state) => {
    state.dataLoadingState = "error";
  });
});

const selectSelf = (state: RootState) => state.projectFeatures;

export const selectProjectFeatures = createSelector(
  selectSelf,
  (state): ProjectFeatures | undefined => {
    return state.data;
  },
);
