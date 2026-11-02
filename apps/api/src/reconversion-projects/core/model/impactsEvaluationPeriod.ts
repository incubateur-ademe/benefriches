import { MAX_EVALUATION_PERIOD_IN_YEARS, MIN_EVALUATION_PERIOD_IN_YEARS } from "shared";

import { DevelopmentPlan, PhotovoltaicPowerStationFeatures } from "./reconversionProject";

export const getDefaultImpactsEvaluationPeriod = (
  developmentPlanType: DevelopmentPlan["type"],
  developmentPlanFeatures: DevelopmentPlan["features"],
): number => {
  switch (developmentPlanType) {
    case "PHOTOVOLTAIC_POWER_PLANT": {
      // Impacts are summed over at most MAX_EVALUATION_PERIOD_IN_YEARS (SumOnEvolutionPeriodService),
      // so a longer contract must not be reported as the evaluation period.
      const { contractDuration } = developmentPlanFeatures as PhotovoltaicPowerStationFeatures;
      return Math.min(
        Math.max(contractDuration, MIN_EVALUATION_PERIOD_IN_YEARS),
        MAX_EVALUATION_PERIOD_IN_YEARS,
      );
    }
    case "URBAN_PROJECT":
      return 50;
  }
};
