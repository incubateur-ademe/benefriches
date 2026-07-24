import { createSelector } from "@reduxjs/toolkit";

import type { ProjectFeatures } from "../../core/projects.types";
import {
  selectProjectFeatures,
  selectProjectFeaturesLoadingState,
} from "./projectFeatures.reducer";

type LoadingState = "idle" | "loading" | "success" | "error";

type ProjectFeaturesViewData = {
  projectFeatures: ProjectFeatures | undefined;
  loadingState: LoadingState;
};

export const selectProjectFeaturesViewData = createSelector(
  selectProjectFeatures,
  selectProjectFeaturesLoadingState,
  (projectFeatures, loadingState): ProjectFeaturesViewData => ({
    projectFeatures,
    loadingState,
  }),
);
