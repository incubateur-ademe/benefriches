import { GetReconversionProjectFeaturesResponseDto } from "shared";

export type UrbanProjectFeatures = Extract<
  ProjectFeatures["developmentPlan"],
  { type: "URBAN_PROJECT" }
>;
export type ProjectFeatures = GetReconversionProjectFeaturesResponseDto;

export type ProjectDevelopmentPlanType = "PHOTOVOLTAIC_POWER_PLANT" | "URBAN_PROJECT";
