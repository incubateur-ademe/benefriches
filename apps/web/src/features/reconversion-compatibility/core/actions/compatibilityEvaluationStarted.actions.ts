import { v4 as uuid } from "uuid";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { ACTION_PREFIX } from ".";

export const reconversionCompatibilityEvaluationStarted = createAppAsyncThunk(
  `${ACTION_PREFIX}/started`,
  async (_, { extra }) => {
    const evaluationId = uuid();

    await extra.reconversionCompatibilityEvaluationService.startEvaluation({ evaluationId });

    return { evaluationId };
  },
);
