import { createReducer } from "@reduxjs/toolkit";

import {
  fricheMutabilityAnalysisReset,
  fricheMutabilityEvaluationCompleted,
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

export type MutabilityEvaluationResults = {
  evaluationId: string;
  top3Usages: {
    usage: MutabilityUsage;
    score: number;
    rank: number;
  }[];
  reliabilityScore: number;
};

export type FricheMutabilityState = {
  evaluationResults: MutabilityEvaluationResults | undefined;
  evaluationError: string | undefined;
  projectCreationState: "idle" | "loading" | "success" | "error";
  projectCreationStateErrorCode: string | undefined;
  createdProjectId: string | undefined;
  creatingProjectUsage: MutabilityUsage | undefined;
};

const initialState: FricheMutabilityState = {
  evaluationResults: undefined,
  evaluationError: undefined,
  projectCreationState: "idle",
  projectCreationStateErrorCode: undefined,
  createdProjectId: undefined,
  creatingProjectUsage: undefined,
};

export const fricheMutabilityReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fricheMutabilityEvaluationCompleted, (state, action) => {
      state.evaluationResults = action.payload;
      state.evaluationError = undefined;
    })
    .addCase(fricheMutabilityAnalysisReset, (state) => {
      state.evaluationResults = undefined;
      state.evaluationError = undefined;
      state.projectCreationState = "idle";
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
