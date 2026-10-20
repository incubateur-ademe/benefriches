import { createSelector } from "@reduxjs/toolkit";
import type { GetReconversionProjectImpactsResultDto, ProjectDevelopmentScore } from "shared";

import type { RootState } from "@/app/store/store";
import {
  buildEconomicBalanceListView,
  type EconomicBalanceByCategory,
} from "@/features/projects/core/projectImpactsEconomicBalance";
import {
  type EnvironmentalImpactMetricsByListViewCategory,
  groupEnvironmentalMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsEnvironmental";
import {
  groupSocialMetricsByListViewCategory,
  type SocialImpactMetricsByListViewCategory,
} from "@/features/projects/core/projectImpactsSocial";
import {
  getSocioEconomicProjectImpactsGroupedByCategory,
  type SocioEconomicImpactsByBearerListView,
} from "@/features/projects/core/projectImpactsSocioEconomic";

const selectSelf = (state: RootState) => state.projectImpacts;

export type DevelopmentScoreDataView = {
  developmentScore: ProjectDevelopmentScore;
  modalsData: {
    contextData: GetReconversionProjectImpactsResultDto["contextData"];
    impactsData: GetReconversionProjectImpactsResultDto["impacts"];
    projectEconomicBalance: EconomicBalanceByCategory;
    economicImpactsByBearerAndCategory: SocioEconomicImpactsByBearerListView;
    environmentalMetricsByCategory: EnvironmentalImpactMetricsByListViewCategory;
    socialMetricsByCategory: SocialImpactMetricsByListViewCategory;
  };
};

const selectEconomicBalanceProjectImpacts = createSelector(
  [selectSelf],
  (state) =>
    state.contextData &&
    buildEconomicBalanceListView(state.contextData?.projectDevelopmentPlan.type, state.impacts),
);

const selectSocialProjectImpacts = createSelector([selectSelf], (state) =>
  groupSocialMetricsByListViewCategory(
    state.impacts?.aggregatedReconversionImpacts.impactsMetrics ?? [],
    state.contextData?.projectDevelopmentPlan.type ?? "URBAN_PROJECT",
  ),
);

const selectEnvironmentalProjectImpacts = createSelector([selectSelf], (state) =>
  groupEnvironmentalMetricsByListViewCategory(state.impacts, state.contextData?.siteSurfaceArea),
);

const selectSocioEconomicProjectImpactsListView = createSelector(
  [selectSelf],
  (state) =>
    state.impacts &&
    getSocioEconomicProjectImpactsGroupedByCategory(
      state.impacts.aggregatedReconversionImpacts.indirectEconomicImpacts,
      state.impacts.stakeholders,
    ),
);

export const selectDevelopmentScoreDataView = createSelector(
  [
    selectSelf,
    selectEconomicBalanceProjectImpacts,
    selectSocioEconomicProjectImpactsListView,
    selectEnvironmentalProjectImpacts,
    selectSocialProjectImpacts,
  ],
  (
    state,
    economicBalanceProjectImpacts,
    economicImpactsByBearerAndCategory,
    environmentalMetricsByCategory,
    socialMetricsByCategory,
  ): DevelopmentScoreDataView | undefined =>
    state.developmentScore &&
    state.impacts &&
    state.contextData &&
    economicImpactsByBearerAndCategory &&
    economicBalanceProjectImpacts
      ? {
          developmentScore: state.developmentScore,
          modalsData: {
            contextData: state.contextData,
            impactsData: state.impacts,
            projectEconomicBalance: economicBalanceProjectImpacts,
            environmentalMetricsByCategory,
            socialMetricsByCategory,
            economicImpactsByBearerAndCategory,
          },
        }
      : undefined,
);
