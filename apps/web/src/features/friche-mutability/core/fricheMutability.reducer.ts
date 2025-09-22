import { createReducer } from "@reduxjs/toolkit";

import {
  fricheMutabilityAnalysisReset,
  fricheMutabilityEvaluationCompleted,
  fricheMutabilityProjectCreationFailed,
  fricheMutabilityProjectCreationRequested,
  fricheMutabilityProjectCreationSucceeded,
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
  isCreatingProject: boolean;
  creatingProjectUsage: MutabilityUsage | undefined;
};

const initialState: FricheMutabilityState = {
  evaluationResults: undefined,
  evaluationError: undefined,
  isCreatingProject: false,
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
      state.isCreatingProject = false;
    })
    .addCase(fricheMutabilityProjectCreationRequested, (state, action) => {
      state.isCreatingProject = true;
      state.creatingProjectUsage = action.payload;
      state.evaluationError = undefined;
    })
    .addCase(fricheMutabilityProjectCreationSucceeded, (state) => {
      state.isCreatingProject = false;
      state.creatingProjectUsage = undefined;
    })
    .addCase(fricheMutabilityProjectCreationFailed, (state) => {
      state.isCreatingProject = false;
      state.creatingProjectUsage = undefined;
    });
});
