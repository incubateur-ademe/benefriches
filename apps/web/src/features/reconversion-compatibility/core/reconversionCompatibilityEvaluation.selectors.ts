import { createSelector } from "@reduxjs/toolkit";
import { MutabilityUsage } from "shared";

import { RootState } from "@/shared/core/store-config/store";

const selectSelf = (state: RootState) => state.reconversionCompatibilityEvaluation;

export type ReconversionCompatibilityEvaluationViewData = {
  evaluationResults:
    | {
        top3MutabilityUsages: { usage: MutabilityUsage; score: number; rank: number }[];
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
          top3MutabilityUsages: state.evaluationResults.top3Usages,
          reliabilityScore: state.evaluationResults.reliabilityScore,
        }
      : undefined,
    evaluationResultsLoadingState: state.evaluationResultsLoadingState,
    evaluationError: state.evaluationError,
    isAnalysisComplete: state.evaluationResults !== undefined,
    hasError: state.evaluationError !== undefined,
  }),
);
