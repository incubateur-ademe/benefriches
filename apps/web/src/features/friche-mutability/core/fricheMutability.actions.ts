import { createAction } from "@reduxjs/toolkit";

import { MutabilityEvaluationResults } from "./fricheMutability.reducer";

const ACTION_PREFIX = "fricheMutability";

export const fricheMutabilityEvaluationCompleted = createAction<MutabilityEvaluationResults>(
  `${ACTION_PREFIX}/evaluationCompleted`,
);
export const fricheMutabilityAnalysisReset = createAction(`${ACTION_PREFIX}/analysisReset`);

export const fricheMutabilityProjectCreationRequested = createAction(
  `${ACTION_PREFIX}/projectCreationRequested`,
);
export const fricheMutabilityProjectCreationSucceeded = createAction(
  `${ACTION_PREFIX}/projectCreationSucceeded`,
);
export const fricheMutabilityProjectCreationFailed = createAction(
  `${ACTION_PREFIX}/projectCreationFailed`,
);
