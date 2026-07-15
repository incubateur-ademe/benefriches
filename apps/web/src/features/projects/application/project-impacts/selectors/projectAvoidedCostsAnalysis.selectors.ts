import { createSelector } from "@reduxjs/toolkit";
import { GetReconversionProjectImpactsResultDto, SiteNature } from "shared";

import { RootState } from "@/app/store/store";

import { cropUrbanSprawlSimulationByEvaluationPeriod } from "../../../domain/cropImpactsByEvaluationPeriod";
import {
  groupIndirectEconomicImpactsByBearerAndCategory,
  IndirectEconomicImpactsByBearerAndGroupCategory,
} from "../../../domain/groupIndirectImpactsByBearer";
import { ProjectDevelopmentPlanType } from "../../../domain/projects.types";
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
      groupIndirectEconomicImpactsByBearerAndCategory(
        impacts?.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData,
        impacts?.stakeholders,
      ),
    projectOnSiteIndirectEconomicImpactsByBearerAndCategory:
      groupIndirectEconomicImpactsByBearerAndCategory(
        impacts?.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData,
        impacts?.stakeholders,
      ),
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
            groupIndirectEconomicImpactsByBearerAndCategory(
              urbanSprawlSimulationImpactsByEvaluationPeriod.simulationSiteStatuQuoImpactsData,
              impactsByEvaluationPeriod?.stakeholders,
            ),
          projectOnSimulationSiteImpactsByBearerAndCategory:
            groupIndirectEconomicImpactsByBearerAndCategory(
              urbanSprawlSimulationImpactsByEvaluationPeriod.projectOnSimulationSiteImpactsData,
              impactsByEvaluationPeriod?.stakeholders,
            ),
        },
        projectImpacts: {
          ...impactsByEvaluationPeriod,
          siteStatuQuoImpactsByBearerAndCategory: groupIndirectEconomicImpactsByBearerAndCategory(
            impactsByEvaluationPeriod.reconversionImpactsBreakdown
              .siteStatuQuoIndirectEconomicImpactsData,
            impactsByEvaluationPeriod?.stakeholders,
          ),
          projectOnSiteImpactsByBearerAndCategory: groupIndirectEconomicImpactsByBearerAndCategory(
            impactsByEvaluationPeriod.reconversionImpactsBreakdown
              .projectOnSiteIndirectEconomicImpactsData,
            impactsByEvaluationPeriod?.stakeholders,
          ),
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
