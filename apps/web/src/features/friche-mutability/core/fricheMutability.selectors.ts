import { createSelector } from "@reduxjs/toolkit";

import { RootState } from "@/shared/core/store-config/store";

import { MutabilityUsage } from "./fricheMutability.reducer";

const selectSelf = (state: RootState) => state.fricheMutability;

export type FricheMutabilityViewData = {
  evaluationResults:
    | {
        top3MutabilityUsages: { usage: MutabilityUsage; score: number; rank: number }[];
        reliabilityScore: number;
      }
    | undefined;
  isAnalysisComplete: boolean;
  isCreatingProject: boolean;
  creatingProjectUsage: string | undefined;
  evaluationError: string | undefined;
  hasError: boolean;
};

export const selectFricheMutabilityViewData = createSelector(
  selectSelf,
  (state): FricheMutabilityViewData => ({
    evaluationResults: state.evaluationResults
      ? {
          top3MutabilityUsages: state.evaluationResults.top3Usages,
          reliabilityScore: state.evaluationResults.reliabilityScore,
        }
      : undefined,
    evaluationError: state.evaluationError,
    isAnalysisComplete: state.evaluationResults !== undefined,
    isCreatingProject: state.projectCreationState === "loading",
    creatingProjectUsage: state.creatingProjectUsage,
    hasError: state.evaluationError !== undefined,
  }),
);
