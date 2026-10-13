import { type AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import type { TrafficSecurityIndicatorMetrics } from "../developmentScore.types";
import { type NullableIndicatorScore, sumMetricsTotalByName } from "../scoring.helpers";

export const getTrafficSecurityScore = (
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[],
): NullableIndicatorScore<TrafficSecurityIndicatorMetrics> => {
  const avoidedTrafficAccidents = sumMetricsTotalByName(
    aggregatedReconversionImpactMetrics,
    "avoidedTrafficAccidentsDeaths",
    "avoidedTrafficAccidentsSevereInjuries",
    "avoidedTrafficAccidentsMinorInjuries",
  );

  return {
    letterGrade: avoidedTrafficAccidents > 0 ? "B" : undefined,
    metrics: { avoidedTrafficAccidents },
  };
};
