import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";
import { routes } from "@/shared/views/router";

import { ACTION_PREFIX } from ".";

export type EvaluationCompletedPayload = {
  id: string;
  mutafrichesId: string;
};

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
