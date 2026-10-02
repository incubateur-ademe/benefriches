import { createSelector } from "@reduxjs/toolkit";
import { computeProjectDevelopmentScore, type ProjectDevelopmentScore } from "shared";

import type { RootState } from "@/app/store/store";

import { selectImpactsCroppedByEvaluationPeriod } from "./projectImpacts.selectors";

const selectSelf = (state: RootState) => state.projectImpacts;

export type DevelopmentScoreDataView = ProjectDevelopmentScore & {
  evaluationPeriodInYears: number;
};

export const selectDevelopmentScoreDataView = createSelector(
  [selectSelf, selectImpactsCroppedByEvaluationPeriod],
  (state, breakEvenLevelForEvaluationPeriod): DevelopmentScoreDataView | undefined => {
    if (!breakEvenLevelForEvaluationPeriod || !state.contextData) {
      return undefined;
    }

    return {
      evaluationPeriodInYears: state.evaluationPeriod ?? 50,
      ...computeProjectDevelopmentScore(state.contextData, breakEvenLevelForEvaluationPeriod),
    };
  },
);
