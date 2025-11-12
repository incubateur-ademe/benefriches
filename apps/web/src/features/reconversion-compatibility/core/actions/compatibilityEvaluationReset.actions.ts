import { createAction } from "@reduxjs/toolkit";

import { ACTION_PREFIX } from ".";

export const reconversionCompatibilityEvaluationReset = createAction(`${ACTION_PREFIX}/reset`);
