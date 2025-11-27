import { ReconversionProjectTemplate, CreateExpressSiteDto } from "shared";
import { MutabilityUsage } from "shared";
import { v4 as uuid } from "uuid";

import { ProjectSuggestion } from "@/features/create-project/core/project.types";
import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";
import { routes } from "@/shared/views/router";

import { ACTION_PREFIX } from ".";

function mapMutabilityUsageToProjectTypeTemplate(
  usage: MutabilityUsage,
): ReconversionProjectTemplate {
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

const actionType = `${ACTION_PREFIX}/fricheSaved`;

export const fricheSavedFromCompatibilityEvaluation = createAppAsyncThunk(
  actionType,
  async (_, { extra, getState }) => {
    const {
      currentUser: currentUserState,
      reconversionCompatibilityEvaluation: compatibilityState,
    } = getState();
    const { evaluationResults, currentEvaluationId } = compatibilityState;

    if (!currentUserState.currentUser) throw new Error("NO_AUTHENTICATED_USER");
    if (!evaluationResults) throw new Error("NO_EVALUATION_RESULTS");
    if (!currentEvaluationId) throw new Error("NO_CURRENT_EVALUATION_ID");

    const siteId = uuid();
    const siteToCreate: CreateExpressSiteDto = {
      id: siteId,
      nature: "FRICHE",
      fricheActivity: "INDUSTRY",
      createdBy: currentUserState.currentUser.id,
      surfaceArea: evaluationResults.evaluationInput.surfaceArea,
      builtSurfaceArea: evaluationResults.evaluationInput.buildingsFootprintSurfaceArea,
      hasContaminatedSoils: evaluationResults.evaluationInput.hasContaminatedSoils,
      address: {
        city: evaluationResults.evaluationInput.city,
        cityCode: evaluationResults.evaluationInput.cityCode,
        value: evaluationResults.evaluationInput.city,
        long: evaluationResults.evaluationInput.long,
        lat: evaluationResults.evaluationInput.lat,
        postCode: "50200",
      },
    };

    await extra.createSiteService.saveExpress(siteToCreate);

    await extra.reconversionCompatibilityEvaluationService.addRelatedSite({
      evaluationId: currentEvaluationId,
      relatedSiteId: siteId,
    });

    const projectSuggestions: ProjectSuggestion[] = evaluationResults.top3Usages.map(
      ({ score, usage }) => ({
        type: mapMutabilityUsageToProjectTypeTemplate(usage),
        compatibilityScore: score,
      }),
    );
    routes
      .siteActionsList({
        siteId,
        fromCompatibilityEvaluation: true,
        projectEvaluationSuggestions: projectSuggestions,
      })
      .push();

    return { siteId };
  },
);
