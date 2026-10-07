import { createSelector } from "@reduxjs/toolkit";
import { type ProjectDevelopmentScore } from "shared";

import type { RootState } from "@/app/store/store";

const selectSelf = (state: RootState) => state.projectImpacts;

export type DevelopmentScoreDataView = ProjectDevelopmentScore;

export const selectDevelopmentScoreDataView = createSelector(
  [selectSelf],
  (state): DevelopmentScoreDataView | undefined => state.developmentScore,
);
