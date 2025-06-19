import {
  DevelopmentPlan,
  PhotovoltaicPowerStationFeatures,
  ReconversionProject,
} from "../reconversionProject";

export const getDefaultImpactsEvaluationPeriod = (
  developmentPlanType: DevelopmentPlan["type"],
  developmentPlanFeatures: ReconversionProject["developmentPlan"]["features"],
): number => {
  switch (developmentPlanType) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return (developmentPlanFeatures as PhotovoltaicPowerStationFeatures).contractDuration;
    case "URBAN_PROJECT":
      return 30;
  }
};
