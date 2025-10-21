import { BaseReconversionProjectFeaturesView, FricheActivity, SiteNature } from "shared";

export type ProjectsGroup = {
  siteId: string;
  siteName: string;
  siteNature: SiteNature;
  isExpressSite: boolean;
  fricheActivity?: FricheActivity;
  reconversionProjects: {
    id: string;
    name: string;
    type: ProjectDevelopmentPlanType;
    isExpressProject: boolean;
  }[];
};

export type ReconversionProjectsGroupedBySite = ProjectsGroup[];

export type UrbanProjectFeatures = Extract<
  ProjectFeatures["developmentPlan"],
  { type: "URBAN_PROJECT" }
>;
export type ProjectFeatures = BaseReconversionProjectFeaturesView;

export type ProjectDevelopmentPlanType = "PHOTOVOLTAIC_POWER_PLANT" | "URBAN_PROJECT";
