import { createReducer } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import {
  ReconversionCompatibilityEvaluationResults,
  reconversionCompatibilityEvaluationReset,
  reconversionCompatibilityEvaluationResultsRequested,
  reconversionCompatibilityEvaluationStarted,
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

type ReconversionCompatibilityEvaluationState = {
  currentEvaluationId: string | undefined;
  evaluationResults: ReconversionCompatibilityEvaluationResults | undefined;
  evaluationError: string | undefined;
  evaluationResultsLoadingState: "idle" | "loading" | "success" | "error";
  projectCreationState: "idle" | "loading" | "success" | "error";
  projectCreationStateErrorCode: string | undefined;
  createdProjectId: string | undefined;
};

const initialState: ReconversionCompatibilityEvaluationState = {
  currentEvaluationId: undefined,
  evaluationResults: undefined,
  evaluationError: undefined,
  evaluationResultsLoadingState: "idle",
  projectCreationState: "idle",
  projectCreationStateErrorCode: undefined,
  createdProjectId: undefined,
};

export const reconversionCompatibilityEvaluationReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(reconversionCompatibilityEvaluationStarted.fulfilled, (state, action) => {
      state.currentEvaluationId = action.payload.evaluationId;
    })
    .addCase(reconversionCompatibilityEvaluationReset, (state) => {
      state.evaluationError = undefined;
      state.projectCreationState = "idle";
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
