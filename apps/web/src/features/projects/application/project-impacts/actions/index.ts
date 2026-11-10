import { createAction } from "@reduxjs/toolkit";
import type {
  GetReconversionProjectImpactsResultDto,
  ReportImpactsExportedRequestDto,
} from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

const PROJECT_IMPACTS_PREFIX = "projectImpacts";

const createProjectImpactsActionName = (actionName: string) =>
  `${PROJECT_IMPACTS_PREFIX}/${actionName}`;

const createProjectImpactsAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(createProjectImpactsActionName(actionName));

export const evaluationPeriodUpdated =
  createProjectImpactsAction<number>("evaluationPeriodUpdated");

export interface ReconversionProjectImpactsGateway {
  // Resolves to undefined when no project has this id (unknown or malformed id).
  getReconversionProjectImpacts(
    reconversionProjectId: string,
  ): Promise<GetReconversionProjectImpactsResultDto | undefined>;
  reportImpactsExported(
    reconversionProjectId: string,
    impactsExport: ReportImpactsExportedRequestDto,
  ): Promise<void>;
}

export const reconversionProjectImpactsAnalysisRequested = createAppAsyncThunk<
  GetReconversionProjectImpactsResultDto,
  { projectId: string },
  { rejectValue: "notFound" }
>(
  createProjectImpactsActionName("reconversionProjectImpactsAnalysisRequested"),
  async ({ projectId }, { extra, rejectWithValue }) => {
    const data = await extra.reconversionProjectImpacts.getReconversionProjectImpacts(projectId);
    if (!data) return rejectWithValue("notFound");
    return data;
  },
);
