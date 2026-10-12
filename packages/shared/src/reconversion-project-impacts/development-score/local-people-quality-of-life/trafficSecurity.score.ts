import { type AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import type { TrafficSecurityIndicator } from "../developmentScore.types";
import { sumMetricsTotalByName } from "../scoring.helpers";

export const getTrafficSecurityScore = (
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[],
): TrafficSecurityIndicator => {
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
