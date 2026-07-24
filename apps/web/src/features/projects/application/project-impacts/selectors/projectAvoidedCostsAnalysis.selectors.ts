import { createSelector } from "@reduxjs/toolkit";
import { GetReconversionProjectImpactsResultDto, SiteNature } from "shared";

import { RootState } from "@/app/store/store";

import { cropUrbanSprawlSimulationByEvaluationPeriod } from "../../../core/cropImpactsByEvaluationPeriod";
import {
  groupIndirectEconomicImpactsByBearerAndCategory,
  IndirectEconomicImpactsByBearerAndGroupCategory,
} from "../../../core/groupIndirectImpactsByBearer";
import { ProjectDevelopmentPlanType } from "../../../core/projects.types";
import { ProjectImpactsState } from "../projectImpacts.reducer";
import { selectImpactsCroppedByEvaluationPeriod } from "./projectBreakEvenLevel.selectors";
import { selectDisplayOnboarding } from "./projectUrbanSprawlComparisonOnboardingSkip.selector";

const selectSelf = (state: RootState) => state.projectImpacts;

export type AvoidedCostsAnalysisDataView = {
  evaluationPeriodInYears: number;
  siteNature: SiteNature;
  projectType: ProjectDevelopmentPlanType;
};
export const selectAvoidedCostsAnalysisDataView = createSelector(
  [selectSelf],
  (state): AvoidedCostsAnalysisDataView | undefined =>
    state.contextData?.siteNature && state.contextData.projectDevelopmentPlan.type
      ? {
          evaluationPeriodInYears: state.evaluationPeriod ?? 50,
          siteNature: state.contextData?.siteNature,
          projectType: state.contextData.projectDevelopmentPlan.type,
        }
      : undefined,
);

export type AvoidedInactionCostsAnalysisDataView = {
  siteStatuQuoIndirectEconomicImpactsByBearerAndCategory?: IndirectEconomicImpactsByBearerAndGroupCategory;
  projectOnSiteIndirectEconomicImpactsByBearerAndCategory?: IndirectEconomicImpactsByBearerAndGroupCategory;
  siteId?: string;
  projectEconomicBalance?: GetReconversionProjectImpactsResultDto["impacts"]["projectEconomicBalance"];
};
export const selectAvoidedInactionCostsAnalysisDataView = createSelector(
  [selectSelf, selectImpactsCroppedByEvaluationPeriod],
  (state, impacts): AvoidedInactionCostsAnalysisDataView => ({
    siteStatuQuoIndirectEconomicImpactsByBearerAndCategory:
      groupIndirectEconomicImpactsByBearerAndCategory({
        indirectEconomicImpacts:
          impacts?.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.details,
        indirectEconomicImpactsTotal:
          impacts?.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData.total,
        stakeholders: impacts?.stakeholders,
      }),
    projectOnSiteIndirectEconomicImpactsByBearerAndCategory:
      groupIndirectEconomicImpactsByBearerAndCategory({
        indirectEconomicImpacts:
          impacts?.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData.details,
        indirectEconomicImpactsTotal:
          impacts?.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData.total,
        stakeholders: impacts?.stakeholders,
      }),
    siteId: state.contextData?.relatedSiteId,
    projectEconomicBalance: impacts?.projectEconomicBalance,
  }),
);

const selectUrbanSprawlSimulationCroppedByEvaluationPeriod = createSelector(
  [selectSelf],
  (state) =>
    state.urbanSprawlSimulation
      ? cropUrbanSprawlSimulationByEvaluationPeriod(
          state.urbanSprawlSimulation,
          state.evaluationPeriod ?? 50,
        )
      : undefined,
);

export type AvoidedCostsUrbanSprawlAnalysisDataView =
  | {
      projectImpacts: undefined;
      urbanSprawlSimulation: undefined;
      dataLoadingState: "loading" | "error" | "idle";
      contextData: undefined;
      shouldDisplayOnBoarding: boolean;
    }
  | {
      projectImpacts: Exclude<ProjectImpactsState["impacts"], undefined> & {
        siteStatuQuoImpactsByBearerAndCategory: IndirectEconomicImpactsByBearerAndGroupCategory;
        projectOnSiteImpactsByBearerAndCategory: IndirectEconomicImpactsByBearerAndGroupCategory;
      };
      urbanSprawlSimulation: Exclude<ProjectImpactsState["urbanSprawlSimulation"], undefined> & {
        simulationSiteStatuQuoImpactsByBearerAndCategory: IndirectEconomicImpactsByBearerAndGroupCategory;
        projectOnSimulationSiteImpactsByBearerAndCategory: IndirectEconomicImpactsByBearerAndGroupCategory;
      };
      dataLoadingState: "success";
      contextData: ProjectImpactsState["contextData"];
      shouldDisplayOnBoarding: boolean;
    };
export const selectAvoidedUrbanSprawlCostsAnalysisDataView = createSelector(
  [
    selectSelf,
    selectImpactsCroppedByEvaluationPeriod,
    selectUrbanSprawlSimulationCroppedByEvaluationPeriod,
    selectDisplayOnboarding,
  ],
  (
    state,
    impactsByEvaluationPeriod,
    urbanSprawlSimulationImpactsByEvaluationPeriod,
    shouldDisplayOnBoarding,
  ): AvoidedCostsUrbanSprawlAnalysisDataView => {
    if (
      state.dataLoadingState.impacts === "loading" ||
      state.dataLoadingState.urbanSprawlSimulation === "loading"
    ) {
      return {
        projectImpacts: undefined,
        urbanSprawlSimulation: undefined,
        dataLoadingState: "loading",
        shouldDisplayOnBoarding,
        contextData: undefined,
      };
    }

    if (
      state.dataLoadingState.impacts === "error" ||
      state.dataLoadingState.urbanSprawlSimulation === "error"
    ) {
      return {
        projectImpacts: undefined,
        urbanSprawlSimulation: undefined,
        dataLoadingState: "error",
        shouldDisplayOnBoarding,
        contextData: undefined,
      };
    }
    if (
      state.dataLoadingState.impacts === "success" &&
      state.dataLoadingState.urbanSprawlSimulation === "success" &&
      urbanSprawlSimulationImpactsByEvaluationPeriod &&
      impactsByEvaluationPeriod
    ) {
      return {
        urbanSprawlSimulation: {
          ...urbanSprawlSimulationImpactsByEvaluationPeriod,
          simulationSiteStatuQuoImpactsByBearerAndCategory:
            groupIndirectEconomicImpactsByBearerAndCategory({
              indirectEconomicImpacts:
                urbanSprawlSimulationImpactsByEvaluationPeriod.simulationSiteStatuQuoImpactsData
                  .details,
              indirectEconomicImpactsTotal:
                urbanSprawlSimulationImpactsByEvaluationPeriod.simulationSiteStatuQuoImpactsData
                  .total,
              stakeholders: impactsByEvaluationPeriod?.stakeholders,
            }),
          projectOnSimulationSiteImpactsByBearerAndCategory:
            groupIndirectEconomicImpactsByBearerAndCategory({
              indirectEconomicImpacts:
                urbanSprawlSimulationImpactsByEvaluationPeriod.projectOnSimulationSiteImpactsData
                  .details,
              indirectEconomicImpactsTotal:
                urbanSprawlSimulationImpactsByEvaluationPeriod.projectOnSimulationSiteImpactsData
                  .total,
              stakeholders: impactsByEvaluationPeriod?.stakeholders,
            }),
        },
        projectImpacts: {
          ...impactsByEvaluationPeriod,
          siteStatuQuoImpactsByBearerAndCategory: groupIndirectEconomicImpactsByBearerAndCategory({
            indirectEconomicImpacts:
              impactsByEvaluationPeriod.reconversionImpactsBreakdown
                .siteStatuQuoIndirectEconomicImpactsData.details,
            indirectEconomicImpactsTotal:
              impactsByEvaluationPeriod.reconversionImpactsBreakdown
                .siteStatuQuoIndirectEconomicImpactsData.total,
            stakeholders: impactsByEvaluationPeriod?.stakeholders,
          }),
          projectOnSiteImpactsByBearerAndCategory: groupIndirectEconomicImpactsByBearerAndCategory({
            indirectEconomicImpacts:
              impactsByEvaluationPeriod.reconversionImpactsBreakdown
                .projectOnSiteIndirectEconomicImpactsData.details,
            indirectEconomicImpactsTotal:
              impactsByEvaluationPeriod.reconversionImpactsBreakdown
                .projectOnSiteIndirectEconomicImpactsData.total,
            stakeholders: impactsByEvaluationPeriod?.stakeholders,
          }),
        },
        dataLoadingState: "success",
        shouldDisplayOnBoarding,
        contextData: state.contextData!,
      };
    }
    return {
      projectImpacts: undefined,
      urbanSprawlSimulation: undefined,
      dataLoadingState: "idle",
      shouldDisplayOnBoarding,
      contextData: undefined,
    };
  },
);
