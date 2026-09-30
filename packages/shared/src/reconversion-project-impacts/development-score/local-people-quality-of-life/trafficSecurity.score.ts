import { type AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import { type ScoredMetrics, sumMetricsTotalByName } from "../scoring.helpers";

export const getTrafficSecurityScore = (
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[],
): ScoredMetrics<{
  avoidedTrafficAccidents: number;
}> => {
  const avoidedTrafficAccidents = sumMetricsTotalByName(
    aggregatedReconversionImpactMetrics,
    "avoidedTrafficAccidentsDeaths",
    "avoidedTrafficAccidentsSevereInjuries",
    "avoidedTrafficAccidentsMinorInjuries",
  );

  if (avoidedTrafficAccidents > 0) {
    return { letterGrade: "B", metrics: { avoidedTrafficAccidents } };
  }

  return undefined;
};
