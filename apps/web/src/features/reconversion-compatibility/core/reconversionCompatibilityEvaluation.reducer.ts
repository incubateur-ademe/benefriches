import { createReducer } from "@reduxjs/toolkit";

import {
  ReconversionCompatibilityEvaluationResults,
  reconversionCompatibilityEvaluationReset,
  reconversionCompatibilityEvaluationResultsRequested,
  reconversionCompatibilityResultImpactsRequested,
} from "./reconversionCompatibilityEvaluation.actions";

export type MutabilityUsage =
  | "residentiel"
  | "equipements"
  | "culture"
  | "tertiaire"
  | "industrie"
  | "renaturation"
  | "photovoltaique";

export type ReconversionCompatibilityEvaluationState = {
  evaluationResults: ReconversionCompatibilityEvaluationResults | undefined;
  evaluationError: string | undefined;
  evaluationResultsLoadingState: "idle" | "loading" | "success" | "error";
  projectCreationState: "idle" | "loading" | "success" | "error";
  projectCreationStateErrorCode: string | undefined;
  createdProjectId: string | undefined;
};

const initialState: ReconversionCompatibilityEvaluationState = {
  evaluationResults: undefined,
  evaluationError: undefined,
  evaluationResultsLoadingState: "idle",
  projectCreationState: "idle",
  projectCreationStateErrorCode: undefined,
  createdProjectId: undefined,
};

export const reconversionCompatibilityEvaluationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(reconversionCompatibilityEvaluationReset, (state) => {
      state.evaluationError = undefined;
      state.projectCreationState = "idle";
    })
    .addCase(reconversionCompatibilityEvaluationResultsRequested.pending, (state) => {
      state.evaluationResults = undefined;
      state.evaluationError = undefined;
      state.evaluationResultsLoadingState = "loading";
    })
    .addCase(reconversionCompatibilityEvaluationResultsRequested.fulfilled, (state, action) => {
      state.evaluationResults = action.payload;
      state.evaluationError = undefined;
      state.evaluationResultsLoadingState = "success";
    })
    .addCase(reconversionCompatibilityEvaluationResultsRequested.rejected, (state, action) => {
      state.evaluationResults = undefined;
      state.evaluationError = action.error.message;
      state.evaluationResultsLoadingState = "error";
    })
    .addCase(reconversionCompatibilityResultImpactsRequested.pending, (state) => {
      state.projectCreationState = "loading";
    })
    .addCase(reconversionCompatibilityResultImpactsRequested.fulfilled, (state, action) => {
      state.projectCreationState = "success";
      state.createdProjectId = action.payload.projectId;
    })
    .addCase(reconversionCompatibilityResultImpactsRequested.rejected, (state, action) => {
      state.projectCreationState = "error";
      state.projectCreationStateErrorCode = action.error.message;
    });
});
