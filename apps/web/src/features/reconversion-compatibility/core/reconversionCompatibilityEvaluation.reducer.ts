import { createReducer } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import { reconversionCompatibilityEvaluationReset } from "./actions/compatibilityEvaluationReset.actions";
import { ReconversionCompatibilityEvaluationResults } from "./actions/compatibilityEvaluationResultsRequested.actions";
import { reconversionCompatibilityEvaluationResultsRequested } from "./actions/compatibilityEvaluationResultsRequested.actions";
import { reconversionCompatibilityEvaluationStarted } from "./actions/compatibilityEvaluationStarted.actions";
import { fricheSavedFromCompatibilityEvaluation } from "./actions/fricheSavedFromCompatibilityEvaluation.actions";

export type MutabilityUsage =
  | "residentiel"
  | "equipements"
  | "culture"
  | "tertiaire"
  | "industrie"
  | "renaturation"
  | "photovoltaique";

type ReconversionCompatibilityEvaluationState = {
  currentEvaluationId: string | undefined;
  evaluationResults: ReconversionCompatibilityEvaluationResults | undefined;
  evaluationError: string | undefined;
  evaluationResultsLoadingState: "idle" | "loading" | "success" | "error";
  saveSiteLoadingState: "idle" | "loading" | "success" | "error";
  saveSiteError: string | undefined;
};

const initialState: ReconversionCompatibilityEvaluationState = {
  currentEvaluationId: undefined,
  evaluationResults: undefined,
  evaluationError: undefined,
  evaluationResultsLoadingState: "idle",
  saveSiteLoadingState: "idle",
  saveSiteError: undefined,
};

export const reconversionCompatibilityEvaluationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(reconversionCompatibilityEvaluationStarted.fulfilled, (state, action) => {
      state.currentEvaluationId = action.payload.evaluationId;
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
