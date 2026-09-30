import { type AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import { type ScoredMetrics, sumMetricsTotalByName } from "../scoring.helpers";

export const getFricheAccidentsScore = (
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[],
): ScoredMetrics<{
  avoidedFricheAccidents: number;
}> => {
  const avoidedFricheAccidents = sumMetricsTotalByName(
    aggregatedReconversionImpactMetrics,
    "avoidedFricheAccidentsDeaths",
    "avoidedFricheAccidentsSevereInjuries",
    "avoidedFricheAccidentsMinorInjuries",
  );

  if (avoidedFricheAccidents > 0) {
    return { letterGrade: "A", metrics: { avoidedFricheAccidents } };
  }

  return undefined;
};
