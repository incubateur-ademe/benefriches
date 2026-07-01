import { createAction } from "@reduxjs/toolkit";
import { GetReconversionProjectImpactsResultDto } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

import { ViewMode } from "../projectImpacts.reducer";

const PROJECT_IMPACTS_PREFIX = "projectImpacts";

const createProjectImpactsActionName = (actionName: string) =>
  `${PROJECT_IMPACTS_PREFIX}/${actionName}`;

const createProjectImpactsAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(createProjectImpactsActionName(actionName));

export const viewModeUpdated = createProjectImpactsAction<ViewMode>("impactsViewModeUpdated");
export const evaluationPeriodUpdated =
  createProjectImpactsAction<number>("evaluationPeriodUpdated");

export interface ReconversionProjectImpactsGateway {
  getReconversionProjectImpacts(
    reconversionProjectId: string,
  ): Promise<GetReconversionProjectImpactsResultDto>;
}

export const reconversionProjectImpactsBreakEvenLevelRequested = createAppAsyncThunk<
  GetReconversionProjectImpactsResultDto,
  { projectId: string }
>(
  createProjectImpactsActionName("reconversionProjectImpactsBreakEvenLevelRequested"),
  async ({ projectId }, { extra }) => {
    const data = await extra.reconversionProjectImpacts.getReconversionProjectImpacts(projectId);
    return data;
  },
);
