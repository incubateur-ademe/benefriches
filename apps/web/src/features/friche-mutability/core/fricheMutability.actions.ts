import { createAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import { ExpressReconversionProjectPayload } from "@/features/create-project/core/actions/expressProjectSavedGateway";
import { ExpressSitePayload } from "@/features/create-site/core/actions/finalStep.actions";
import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";
import { routes } from "@/shared/views/router";

import { MutabilityUsage } from "./fricheMutability.reducer";

function mapMutabilityUsageToProjectCategory(
  usage: MutabilityUsage,
): ExpressReconversionProjectPayload["category"] {
  switch (usage) {
    case "residentiel":
      return "RESIDENTIAL_NORMAL_AREA";
    case "equipements":
      return "PUBLIC_FACILITIES";
    case "culture":
      return "TOURISM_AND_CULTURAL_FACILITIES";
    case "tertiaire":
      return "OFFICES";
    case "industrie":
      return "INDUSTRIAL_FACILITIES";
    case "renaturation":
      return "RENATURATION";
    case "photovoltaique":
      return "PHOTOVOLTAIC_POWER_PLANT";
  }
}

const ACTION_PREFIX = "fricheMutability";

export const fricheMutabilityAnalysisReset = createAction(`${ACTION_PREFIX}/analysisReset`);

export type MutabilityEvaluationResults = {
  evaluationId: string;
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

export interface FricheMutabilityEvaluationGateway {
  getEvaluationResults: (evaluationId: string) => Promise<MutabilityEvaluationResults | null>;
}

export const fricheMutabilityEvaluationResultsRequested = createAppAsyncThunk<
  MutabilityEvaluationResults,
  { evaluationId: string }
>(`${ACTION_PREFIX}/evaluationResultsRequested`, async (args, { extra }) => {
  const { evaluationId } = args;
  const results = await extra.fricheMutabilityEvaluationService.getEvaluationResults(evaluationId);

  if (!results) throw new Error("EVALUATION_NOT_FOUND");

  return results;
});

export const fricheMutabilityImpactsRequested = createAppAsyncThunk<
  {
    projectId: string;
  },
  { usage: MutabilityUsage }
>(`${ACTION_PREFIX}/impactsRequested`, async (payload, { extra, getState }) => {
  const { currentUser: currentUserState, fricheMutability: fricheMutabilityState } = getState();
  const { evaluationResults } = fricheMutabilityState;

  if (!currentUserState.currentUser) throw new Error("NO_AUTHENTICATED_USER");
  if (!evaluationResults) throw new Error("NO_EVALUATION_RESULTS");

  const siteToCreate: ExpressSitePayload = {
    id: uuid(),
    nature: "FRICHE",
    fricheActivity: "INDUSTRY",
    createdBy: currentUserState.currentUser.id,
    surfaceArea: evaluationResults.evaluationInput.surfaceArea,
    builtSurfaceArea: evaluationResults.evaluationInput.buildingsFootprintSurfaceArea,
    address: {
      banId: uuid(),
      city: evaluationResults.evaluationInput.city,
      cityCode: evaluationResults.evaluationInput.cityCode,
      value: evaluationResults.evaluationInput.city,
      long: -1.445325, // todo: get coordinates from mutafriches response
      lat: 49.054264,
      postCode: "50200",
    },
    // description: "Friche créée à partir de l'analyse de compatibilité",
  };

  await extra.createSiteService.saveExpress(siteToCreate);

  const projectToCreate = {
    siteId: siteToCreate.id,
    category: mapMutabilityUsageToProjectCategory(payload.usage),
    createdBy: currentUserState.currentUser.id,
    reconversionProjectId: uuid(),
  } satisfies ExpressReconversionProjectPayload;

  await extra.saveExpressReconversionProjectService.save(projectToCreate);

  await new Promise((resolve) => setTimeout(resolve, 500));

  routes
    .projectImpactsOnboarding({
      projectId: projectToCreate.reconversionProjectId,
      canSkipIntroduction: true,
    })
    .push();

  return { projectId: projectToCreate.reconversionProjectId };
});
