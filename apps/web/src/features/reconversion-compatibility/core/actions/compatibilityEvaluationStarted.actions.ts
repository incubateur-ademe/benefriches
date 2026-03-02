import { v4 as uuid } from "uuid";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import { ACTION_PREFIX } from ".";

export const reconversionCompatibilityEvaluationStarted = createAppAsyncThunk(
  `${ACTION_PREFIX}/started`,
  async (_, { extra }) => {
    const evaluationId = uuid();

    await extra.reconversionCompatibilityEvaluationService.startEvaluation({ evaluationId });

    return { evaluationId };
  },
);
