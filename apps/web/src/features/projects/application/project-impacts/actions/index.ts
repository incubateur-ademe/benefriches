import { createAction } from "@reduxjs/toolkit";

import { ViewMode } from "../projectImpacts.reducer";

const PROJECT_IMPACTS_PREFIX = "projectImpacts";

export const createProjectImpactsAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(`${PROJECT_IMPACTS_PREFIX}/${actionName}`);

export const evaluationPeriodUpdated = createProjectImpactsAction<number>(
  "impactsEvaluationPeriodUpdated",
);

export const viewModeUpdated = createProjectImpactsAction<ViewMode>("impactsViewModeUpdated");
