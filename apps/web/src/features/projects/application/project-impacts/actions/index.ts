import { createAction } from "@reduxjs/toolkit";
import { FricheActivity, ReconversionProjectImpacts, SiteNature, SoilsDistribution } from "shared";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

import { ViewMode } from "../projectImpacts.reducer";

const PROJECT_IMPACTS_PREFIX = "projectImpacts";

const createProjectImpactsActionName = (actionName: string) =>
  `${PROJECT_IMPACTS_PREFIX}/${actionName}`;

const createProjectImpactsAction = <TPayload = void>(actionName: string) =>
  createAction<TPayload>(createProjectImpactsActionName(actionName));

export const viewModeUpdated = createProjectImpactsAction<ViewMode>("impactsViewModeUpdated");

export interface ReconversionProjectImpactsGateway {
  getReconversionProjectImpacts(
    reconversionProjectId: string,
    evaluationPeriodInYears?: number,
  ): Promise<ReconversionProjectImpactsResult>;
}

export type ReconversionProjectImpactsResult = {
  id: string;
  name: string;
  evaluationPeriodInYears: number;
  relatedSiteId: string;
  relatedSiteName: string;
  isExpressSite: boolean;
  projectData: {
    isExpressProject: boolean;
    soilsDistribution: SoilsDistribution;
    contaminatedSoilSurface: number;
    developmentPlan:
      | {
          type: "PHOTOVOLTAIC_POWER_PLANT";
          electricalPowerKWc: number;
          surfaceArea: number;
        }
      | {
          type: "URBAN_PROJECT";
          buildingsFloorAreaDistribution: {
            LOCAL_STORE?: number;
            RESIDENTIAL?: number;
          };
        };
  };
  siteData: {
    addressLabel: string;
    contaminatedSoilSurface: number;
    soilsDistribution: SoilsDistribution;
    surfaceArea: number;
    nature: SiteNature;
    fricheActivity: FricheActivity;
    owner: {
      structureType: string;
      name: string;
    };
  };
  impacts: ReconversionProjectImpacts;
};

export const reconversionProjectImpactsRequested = createAppAsyncThunk<
  ReconversionProjectImpactsResult,
  { projectId: string }
>(
  createProjectImpactsActionName("reconversionProjectImpactsRequested"),
  async ({ projectId }, { extra }) => {
    const data = await extra.reconversionProjectImpacts.getReconversionProjectImpacts(projectId);
    return data;
  },
);

export const evaluationPeriodUpdated = createAppAsyncThunk<
  ReconversionProjectImpactsResult,
  { evaluationPeriodInYears: number }
>(
  createProjectImpactsActionName("impactsEvaluationPeriodUpdated"),
  async ({ evaluationPeriodInYears }, { extra, getState }) => {
    const { projectImpacts } = getState();

    const data = await extra.reconversionProjectImpacts.getReconversionProjectImpacts(
      projectImpacts.projectData?.id ?? "",
      evaluationPeriodInYears,
    );
    return data;
  },
);
