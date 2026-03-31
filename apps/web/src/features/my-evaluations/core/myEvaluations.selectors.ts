import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";
import { selectCurrentUserId } from "@/features/onboarding/core/user.reducer";

import type { UserSiteEvaluation } from "../domain/types";

type LoadingState = "idle" | "loading" | "success" | "error";

type MyEvaluationsViewData = {
  siteEvaluations: UserSiteEvaluation[];
  loadingState: LoadingState;
  currentUserId: string | undefined;
};

const selectEvaluationsList = (state: RootState) => state.evaluationsList;

export const selectMyEvaluationsViewData = createSelector(
  selectEvaluationsList,
  selectCurrentUserId,
  (evaluationsList, currentUserId): MyEvaluationsViewData => ({
    siteEvaluations: evaluationsList.siteEvaluations,
    loadingState: evaluationsList.loadingState,
    currentUserId,
  }),
);
