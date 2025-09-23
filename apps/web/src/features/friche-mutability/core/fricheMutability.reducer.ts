import { createReducer } from "@reduxjs/toolkit";

import {
  MutabilityEvaluationResults,
  fricheMutabilityAnalysisReset,
  fricheMutabilityEvaluationResultsRequested,
  fricheMutabilityImpactsRequested,
} from "./fricheMutability.actions";

export type MutabilityUsage =
  | "residentiel"
  | "equipements"
  | "culture"
  | "tertiaire"
  | "industrie"
  | "renaturation"
  | "photovoltaique";

export type FricheMutabilityState = {
  evaluationResults: MutabilityEvaluationResults | undefined;
  evaluationError: string | undefined;
  evaluationResultsLoadingState: "idle" | "loading" | "success" | "error";
  projectCreationState: "idle" | "loading" | "success" | "error";
  projectCreationStateErrorCode: string | undefined;
  createdProjectId: string | undefined;
  creatingProjectUsage: MutabilityUsage | undefined;
};

const initialState: FricheMutabilityState = {
  evaluationResults: undefined,
  evaluationError: undefined,
  evaluationResultsLoadingState: "idle",
  projectCreationState: "idle",
  projectCreationStateErrorCode: undefined,
  createdProjectId: undefined,
  creatingProjectUsage: undefined,
};

export const fricheMutabilityReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fricheMutabilityAnalysisReset, (state) => {
      state.evaluationError = undefined;
      state.projectCreationState = "idle";
    })
    .addCase(fricheMutabilityEvaluationResultsRequested.pending, (state) => {
      state.evaluationResults = undefined;
      state.evaluationError = undefined;
      state.evaluationResultsLoadingState = "loading";
    })
    .addCase(fricheMutabilityEvaluationResultsRequested.fulfilled, (state, action) => {
      state.evaluationResults = action.payload;
      state.evaluationError = undefined;
      state.evaluationResultsLoadingState = "success";
    })
    .addCase(fricheMutabilityEvaluationResultsRequested.rejected, (state, action) => {
      state.evaluationResults = undefined;
      state.evaluationError = action.error.message;
      state.evaluationResultsLoadingState = "error";
    })
    .addCase(fricheMutabilityImpactsRequested.pending, (state) => {
      state.projectCreationState = "loading";
    })
    .addCase(fricheMutabilityImpactsRequested.fulfilled, (state, action) => {
      state.projectCreationState = "success";
      state.createdProjectId = action.payload.projectId;
    })
    .addCase(fricheMutabilityImpactsRequested.rejected, (state, action) => {
      state.projectCreationState = "error";
      state.projectCreationStateErrorCode = action.error.message;
    });
});
