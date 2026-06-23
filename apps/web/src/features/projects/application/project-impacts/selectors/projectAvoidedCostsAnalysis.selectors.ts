import { createSelector } from "@reduxjs/toolkit";
import { GetReconversionProjectImpactsResultDto, SiteNature } from "shared";

import { RootState } from "@/app/store/store";

import { cropUrbanSprawlSimulationByEvaluationPeriod } from "../../../domain/cropImpactsByEvaluationPeriod";
import {
  groupIndirectEconomicImpactsByBearer,
  IndirectEconomicImpactsByBearer,
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
    state.relatedSiteData?.nature && state.projectData?.developmentPlan.type
      ? {
          evaluationPeriodInYears: state.evaluationPeriod ?? 50,
          siteNature: state.relatedSiteData?.nature,
          projectType: state.projectData?.developmentPlan.type,
        }
      : undefined,
);

export type AvoidedInactionCostsAnalysisDataView = {
  siteStatuQuoIndirectEconomicImpactsData?: GetReconversionProjectImpactsResultDto["reconversionImpactsBreakdown"]["siteStatuQuoIndirectEconomicImpactsData"];
  projectOnSiteIndirectEconomicImpactsData?: GetReconversionProjectImpactsResultDto["reconversionImpactsBreakdown"]["projectOnSiteIndirectEconomicImpactsData"];
  siteId?: string;
  stakeholders?: GetReconversionProjectImpactsResultDto["stakeholders"];
  projectEconomicBalance?: GetReconversionProjectImpactsResultDto["projectEconomicBalance"];
};
export const selectAvoidedInactionCostsAnalysisDataView = createSelector(
  [selectSelf, selectImpactsCroppedByEvaluationPeriod],
  (state, impacts): AvoidedInactionCostsAnalysisDataView => ({
    stakeholders: state.impacts?.stakeholders,
    siteStatuQuoIndirectEconomicImpactsData:
      impacts?.reconversionImpactsBreakdown.siteStatuQuoIndirectEconomicImpactsData,
    projectOnSiteIndirectEconomicImpactsData:
      impacts?.reconversionImpactsBreakdown.projectOnSiteIndirectEconomicImpactsData,
    siteId: state.relatedSiteData?.id,
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

      projectName: undefined;
      conversionSiteData: undefined;
      shouldDisplayOnBoarding: boolean;
    }
  | {
      projectImpacts: Exclude<ProjectImpactsState["impacts"], undefined> & {
        siteStatuQuoImpactsByBearer: IndirectEconomicImpactsByBearer;
        projectOnSiteImpactsbyBearer: IndirectEconomicImpactsByBearer;
      };
      urbanSprawlSimulation: Exclude<ProjectImpactsState["urbanSprawlSimulation"], undefined> & {
        simulationSiteStatuQuoImpactsByBearer: IndirectEconomicImpactsByBearer;
        projectOnSimulationSiteImpactsbyBearer: IndirectEconomicImpactsByBearer;
      };
      dataLoadingState: "success";
      projectName: string;
      conversionSiteData: ProjectImpactsState["relatedSiteData"];
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
        projectName: undefined,
        shouldDisplayOnBoarding,
        conversionSiteData: undefined,
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
        projectName: undefined,
        shouldDisplayOnBoarding,
        conversionSiteData: undefined,
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
          simulationSiteStatuQuoImpactsByBearer: groupIndirectEconomicImpactsByBearer(
            urbanSprawlSimulationImpactsByEvaluationPeriod.simulationSiteStatuQuoImpactsData
              .details,
            impactsByEvaluationPeriod?.stakeholders,
          ),
          projectOnSimulationSiteImpactsbyBearer: groupIndirectEconomicImpactsByBearer(
            urbanSprawlSimulationImpactsByEvaluationPeriod.projectOnSimulationSiteImpactsData
              .details,
            impactsByEvaluationPeriod?.stakeholders,
          ),
        },
        projectImpacts: {
          ...impactsByEvaluationPeriod,
          siteStatuQuoImpactsByBearer: groupIndirectEconomicImpactsByBearer(
            impactsByEvaluationPeriod.reconversionImpactsBreakdown
              .siteStatuQuoIndirectEconomicImpactsData.details,
            impactsByEvaluationPeriod?.stakeholders,
          ),
          projectOnSiteImpactsbyBearer: groupIndirectEconomicImpactsByBearer(
            impactsByEvaluationPeriod.reconversionImpactsBreakdown
              .projectOnSiteIndirectEconomicImpactsData.details,
            impactsByEvaluationPeriod?.stakeholders,
          ),
        },
        dataLoadingState: "success",
        projectName: state.projectData?.name ?? "",
        shouldDisplayOnBoarding,
        conversionSiteData: state.relatedSiteData!,
      };
    }
    return {
      projectImpacts: undefined,
      urbanSprawlSimulation: undefined,
      dataLoadingState: "idle",
      projectName: undefined,
      shouldDisplayOnBoarding,
      conversionSiteData: undefined,
    };
  },
);
