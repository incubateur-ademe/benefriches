import { createSelector } from "@reduxjs/toolkit";

import {
  selectProjectFeatures,
  selectProjectFeaturesLoadingState,
} from "../application/project-features/projectFeatures.reducer";
import type { ProjectFeatures } from "../domain/projects.types";

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
