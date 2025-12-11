import { MutabilityUsage } from "shared";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { ACTION_PREFIX } from ".";

export type ReconversionCompatibilityEvaluationResults = {
  mutafrichesId: string;
  reliabilityScore: number;
  rankedResults: {
    usage: MutabilityUsage;
    score: number;
    rank: number;
  }[];
  evaluationInput: {
    cadastreId: string;
    city: string;
    cityCode: string;
    surfaceArea: number;
    lat: number;
    long: number;
    buildingsFootprintSurfaceArea: number;
    hasContaminatedSoils: boolean;
  };
};

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
