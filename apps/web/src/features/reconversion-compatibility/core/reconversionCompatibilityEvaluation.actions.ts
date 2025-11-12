import { createAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";
import { routes } from "@/shared/views/router";

import { ACTION_PREFIX } from "./actions";
import { MutabilityUsage } from "./reconversionCompatibilityEvaluation.reducer";

export const reconversionCompatibilityEvaluationReset = createAction(`${ACTION_PREFIX}/reset`);

export type ReconversionCompatibilityEvaluationResults = {
  mutafrichesId: string;
  reliabilityScore: number;
  top3Usages: {
    usage: MutabilityUsage;
    score: number;
    rank: number;
  }[];
  evaluationInput: {
    cadastreId: string;
    city: string;
    cityCode: string;
    surfaceArea: number;
    buildingsFootprintSurfaceArea: number;
  };
};

export type EvaluationCompletedPayload = {
  id: string;
  mutafrichesId: string;
};

export interface ReconversionCompatibilityEvaluationGateway {
  startEvaluation(input: { evaluationId: string }): Promise<void>;

  completeEvaluation(payload: EvaluationCompletedPayload): Promise<void>;

  getEvaluationResults(
    mutafrichesId: string,
  ): Promise<ReconversionCompatibilityEvaluationResults | null>;
}

export const reconversionCompatibilityEvaluationStarted = createAppAsyncThunk(
  `${ACTION_PREFIX}/started`,
  async (_, { extra }) => {
    const evaluationId = uuid();

    await extra.reconversionCompatibilityEvaluationService.startEvaluation({ evaluationId });

    return { evaluationId };
  },
);

export const reconversionCompatibilityEvaluationCompleted = createAppAsyncThunk<
  undefined,
  { mutafrichesId: string }
>(`${ACTION_PREFIX}/completed`, async (args, { extra, getState }) => {
  const { reconversionCompatibilityEvaluation } = getState();

  if (!reconversionCompatibilityEvaluation.currentEvaluationId)
    throw new Error("EVALUATION_NOT_FOUND");

  await extra.reconversionCompatibilityEvaluationService.completeEvaluation({
    id: reconversionCompatibilityEvaluation.currentEvaluationId,
    mutafrichesId: args.mutafrichesId,
  });

  routes.reconversionCompatibilityResults({ mutafrichesId: args.mutafrichesId }).push();
  return undefined;
});

export const reconversionCompatibilityEvaluationResultsRequested = createAppAsyncThunk<
  ReconversionCompatibilityEvaluationResults,
  { mutafrichesId: string }
>(`${ACTION_PREFIX}/resultsRequested`, async (args, { extra }) => {
  const { mutafrichesId } = args;
  const results =
    await extra.reconversionCompatibilityEvaluationService.getEvaluationResults(mutafrichesId);

  if (!results) throw new Error("EVALUATION_NOT_FOUND");

  return results;
});
