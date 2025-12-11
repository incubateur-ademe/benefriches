import { createSelector } from "@reduxjs/toolkit";
import { MutabilityUsage } from "shared";

import { RootState } from "@/shared/core/store-config/store";

const selectSelf = (state: RootState) => state.reconversionCompatibilityEvaluation;

export type ReconversionCompatibilityEvaluationViewData = {
  evaluationResults:
    | {
        rankedResults: { usage: MutabilityUsage; score: number; rank: number }[];
        reliabilityScore: number;
      }
    | undefined;
  isAnalysisComplete: boolean;
  evaluationError: string | undefined;
  evaluationResultsLoadingState: "idle" | "loading" | "success" | "error";
  hasError: boolean;
};

export const selectReconversionCompatibilityViewData = createSelector(
  selectSelf,
  (state): ReconversionCompatibilityEvaluationViewData => ({
    evaluationResults: state.evaluationResults
      ? {
          rankedResults: state.evaluationResults.rankedResults,
          reliabilityScore: state.evaluationResults.reliabilityScore,
        }
      : undefined,
    evaluationResultsLoadingState: state.evaluationResultsLoadingState,
    evaluationError: state.evaluationError,
    isAnalysisComplete: state.evaluationResults !== undefined,
    hasError: state.evaluationError !== undefined,
  }),
);
