import { DevelopmentPlan, PhotovoltaicPowerStationFeatures } from "../reconversionProject";

export const getDefaultImpactsEvaluationPeriod = (
  developmentPlanType: DevelopmentPlan["type"],
  developmentPlanFeatures: DevelopmentPlan["features"],
): number => {
  switch (developmentPlanType) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return (developmentPlanFeatures as PhotovoltaicPowerStationFeatures).contractDuration;
    case "URBAN_PROJECT":
      return 50;
  }
};
