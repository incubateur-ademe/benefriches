import { createAction } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

import { ExpressReconversionProjectPayload } from "@/features/create-project/core/actions/expressProjectSavedGateway";
import { ExpressSitePayload } from "@/features/create-site/core/actions/finalStep.actions";
import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";
import { routes } from "@/shared/views/router";

import { MutabilityEvaluationResults } from "./fricheMutability.reducer";

const ACTION_PREFIX = "fricheMutability";

export const fricheMutabilityEvaluationCompleted = createAction<MutabilityEvaluationResults>(
  `${ACTION_PREFIX}/evaluationCompleted`,
);
export const fricheMutabilityAnalysisReset = createAction(`${ACTION_PREFIX}/analysisReset`);

export const fricheMutabilityImpactsRequested = createAppAsyncThunk<
  {
    projectId: string;
  },
  { evaluationId: string }
>(`${ACTION_PREFIX}/impactsRequested`, async (_, { extra, getState }) => {
  // const { evaluationId } = args;
  const { currentUser: currentUserState } = getState();

  if (!currentUserState.currentUser) throw new Error("NO_AUTHENTICATED_USER");

  const siteToCreate: ExpressSitePayload = {
    id: uuid(),
    nature: "FRICHE",
    fricheActivity: "INDUSTRY",
    createdBy: currentUserState.currentUser.id,
    surfaceArea: 4300,
    address: {
      banId: "cc7538b3-8293-4490-88c1-8e5e3de5624f",
      city: "Coutances",
      cityCode: "50147",
      value: "Coutances",
      long: -1.445325,
      lat: 49.054264,
      postCode: "50200",
    },
    // description: "Friche créée à partir de l'analyse de compatibilité",
  };

  await extra.createSiteService.saveExpress(siteToCreate);

  const projectToCreate = {
    siteId: siteToCreate.id,
    category: "PUBLIC_FACILITIES",
    createdBy: currentUserState.currentUser.id,
    reconversionProjectId: uuid(),
  } satisfies ExpressReconversionProjectPayload;

  await extra.saveExpressReconversionProjectService.save(projectToCreate);

  await new Promise((resolve) => setTimeout(resolve, 1500));

  routes.projectImpactsOnboarding({ projectId: projectToCreate.reconversionProjectId }).push();

  return { projectId: projectToCreate.reconversionProjectId };
});
