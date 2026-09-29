import { type AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import { type ItemScoreResult, sumMetricsTotalByName } from "../scoring.helpers";

export const getTrafficSecurityScore = (
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[],
): ItemScoreResult<{
  avoidedTrafficAccidents: number;
}> => {
  const avoidedTrafficAccidents = sumMetricsTotalByName(
    aggregatedReconversionImpactMetrics,
    "avoidedTrafficAccidentsDeaths",
    "avoidedTrafficAccidentsSevereInjuries",
    "avoidedTrafficAccidentsMinorInjuries",
  );

  if (avoidedTrafficAccidents > 0) {
    return { letterScore: "B", metrics: { avoidedTrafficAccidents } };
  }

  return undefined;
};
