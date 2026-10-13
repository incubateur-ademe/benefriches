import { type AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import type { FricheAccidentsIndicatorMetrics } from "../developmentScore.types";
import { type NullableIndicatorScore, sumMetricsTotalByName } from "../scoring.helpers";

export const getFricheAccidentsScore = (
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[],
): NullableIndicatorScore<FricheAccidentsIndicatorMetrics> => {
  const avoidedFricheAccidents = sumMetricsTotalByName(
    aggregatedReconversionImpactMetrics,
    "avoidedFricheAccidentsDeaths",
    "avoidedFricheAccidentsSevereInjuries",
    "avoidedFricheAccidentsMinorInjuries",
  );

  return {
    letterGrade: avoidedFricheAccidents > 0 ? "A" : undefined,
    metrics: { avoidedFricheAccidents },
  };
};
