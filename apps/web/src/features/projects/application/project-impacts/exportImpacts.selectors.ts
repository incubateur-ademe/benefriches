import { createSelector } from "@reduxjs/toolkit";

import { SiteFeatures } from "@/features/site-features/core/siteFeatures";
import { RootState } from "@/shared/core/store-config/store";

import { EconomicBalance } from "../../domain/projectImpactsEconomicBalance";
import { EnvironmentalImpact } from "../../domain/projectImpactsEnvironmental";
import { SocialImpact } from "../../domain/projectImpactsSocial";
import { SocioEconomicDetailedImpact } from "../../domain/projectImpactsSocioEconomic";
import { ProjectFeatures } from "../../domain/projects.types";
import { selectEconomicBalanceProjectImpacts } from "./projectImpactsEconomicBalance.selectors";
import { selectEnvironmentalProjectImpacts } from "./projectImpactsEnvironmental.selectors";
import { selectSocialProjectImpacts } from "./projectImpactsSocial.selectors";
import { selectDetailedSocioEconomicProjectImpacts } from "./projectImpactsSocioEconomic.selectors";

type LoadingState = "idle" | "loading" | "success" | "error";

export type ExportImpactsView = {
  loadingState: LoadingState;
  projectFeatures: ProjectFeatures | undefined;
  siteFeatures: SiteFeatures | undefined;
  evaluationPeriodInYears: number | undefined;
  impacts: {
    economicBalance: EconomicBalance;
    environment: EnvironmentalImpact[];
    socioEconomic: SocioEconomicDetailedImpact;
    social: SocialImpact[];
  };
};

const deriveLoadingState = (
  projectFeaturesLoadingState: LoadingState,
  siteFeaturesLoadingState: LoadingState,
): LoadingState => {
  if (projectFeaturesLoadingState === "idle" || siteFeaturesLoadingState === "idle") {
    return "idle";
  }
  if (projectFeaturesLoadingState === "loading" || siteFeaturesLoadingState === "loading") {
    return "loading";
  }
  if (projectFeaturesLoadingState === "success" && siteFeaturesLoadingState === "success") {
    return "success";
  }
  return "error";
};

export const selectExportImpactsView = createSelector(
  [
    (state: RootState) => state.projectFeatures,
    (state: RootState) => state.siteFeatures,
    (state: RootState) => state.projectImpacts.evaluationPeriod,
    selectEconomicBalanceProjectImpacts,
    selectDetailedSocioEconomicProjectImpacts,
    selectEnvironmentalProjectImpacts,
    selectSocialProjectImpacts,
  ],
  (
    projectFeaturesState,
    siteFeaturesState,
    evaluationPeriod,
    economicBalance,
    socioEconomicImpacts,
    environmentImpacts,
    socialImpacts,
  ): ExportImpactsView => {
    const projectFeatures =
      projectFeaturesState.dataLoadingState === "success" ? projectFeaturesState.data : undefined;
    const siteFeatures =
      siteFeaturesState.dataLoadingState === "success" ? siteFeaturesState.siteData : undefined;

    return {
      loadingState: deriveLoadingState(
        projectFeaturesState.dataLoadingState,
        siteFeaturesState.dataLoadingState,
      ),
      projectFeatures,
      siteFeatures,
      evaluationPeriodInYears: evaluationPeriod,
      impacts: {
        economicBalance,
        socioEconomic: socioEconomicImpacts,
        environment: environmentImpacts,
        social: socialImpacts,
      },
    };
  },
);
