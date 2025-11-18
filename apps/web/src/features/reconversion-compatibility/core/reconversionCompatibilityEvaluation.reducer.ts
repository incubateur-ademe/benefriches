import { createReducer } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import { reconversionCompatibilityEvaluationCompleted } from "./actions/compatibilityEvaluationCompleted.actions";
import { reconversionCompatibilityEvaluationReset } from "./actions/compatibilityEvaluationReset.actions";
import { ReconversionCompatibilityEvaluationResults } from "./actions/compatibilityEvaluationResultsRequested.actions";
import { reconversionCompatibilityEvaluationResultsRequested } from "./actions/compatibilityEvaluationResultsRequested.actions";
import { reconversionCompatibilityEvaluationStarted } from "./actions/compatibilityEvaluationStarted.actions";
import { fricheSavedFromCompatibilityEvaluation } from "./actions/fricheSavedFromCompatibilityEvaluation.actions";

type ReconversionCompatibilityEvaluationState = {
  currentEvaluationId: string | undefined;
  evaluationResults: ReconversionCompatibilityEvaluationResults | undefined;
  evaluationError: string | undefined;
  evaluationResultsLoadingState: "idle" | "loading" | "success" | "error";
  evaluationStartLoadingState: "idle" | "loading" | "success" | "error";
  evaluationStartError: string | undefined;
  evaluationCompletedLoadingState: "idle" | "loading" | "success" | "error";
  evaluationCompletedError: string | undefined;
  saveSiteLoadingState: "idle" | "loading" | "success" | "error";
  saveSiteError: string | undefined;
};

const initialState: ReconversionCompatibilityEvaluationState = {
  currentEvaluationId: undefined,
  evaluationResults: undefined,
  evaluationError: undefined,
  evaluationResultsLoadingState: "idle",
  evaluationStartLoadingState: "idle",
  evaluationStartError: undefined,
  evaluationCompletedLoadingState: "idle",
  evaluationCompletedError: undefined,
  saveSiteLoadingState: "idle",
  saveSiteError: undefined,
};

export const reconversionCompatibilityEvaluationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(reconversionCompatibilityEvaluationStarted.pending, (state) => {
      state.evaluationStartLoadingState = "loading";
      state.evaluationStartError = undefined;
    })
    .addCase(reconversionCompatibilityEvaluationStarted.fulfilled, (state, action) => {
      state.currentEvaluationId = action.payload.evaluationId;
      state.evaluationStartLoadingState = "success";
      state.evaluationStartError = undefined;
      state.saveSiteLoadingState = "idle";
      state.saveSiteError = undefined;
    })
    .addCase(reconversionCompatibilityEvaluationStarted.rejected, (state, action) => {
      state.evaluationStartLoadingState = "error";
      state.evaluationStartError = action.error.message;
    })
    .addCase(reconversionCompatibilityEvaluationCompleted.pending, (state) => {
      state.evaluationCompletedLoadingState = "loading";
      state.evaluationCompletedError = undefined;
    })
    .addCase(reconversionCompatibilityEvaluationCompleted.fulfilled, (state) => {
      state.evaluationCompletedLoadingState = "success";
      state.evaluationCompletedError = undefined;
    })
    .addCase(reconversionCompatibilityEvaluationCompleted.rejected, (state, action) => {
      state.evaluationCompletedLoadingState = "error";
      state.evaluationCompletedError = action.error.message;
    })
    .addCase(reconversionCompatibilityEvaluationReset, (state) => {
      state.evaluationError = undefined;
      state.currentEvaluationId = uuid();
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
    .addCase(fricheSavedFromCompatibilityEvaluation.pending, (state) => {
      state.saveSiteLoadingState = "loading";
      state.saveSiteError = undefined;
    })
    .addCase(fricheSavedFromCompatibilityEvaluation.fulfilled, (state) => {
      state.saveSiteLoadingState = "success";
      state.saveSiteError = undefined;
    })
    .addCase(fricheSavedFromCompatibilityEvaluation.rejected, (state, action) => {
      state.saveSiteLoadingState = "error";
      state.saveSiteError = action.error.message;
    });
});

export const getInitialState = (): ReconversionCompatibilityEvaluationState => initialState;
