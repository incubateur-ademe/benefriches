import { type AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import { type ItemScoreResult, sumMetricsTotalByName } from "../scoring.helpers";

export const getFricheAccidentsScore = (
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[],
): ItemScoreResult<{
  avoidedFricheAccidents: number;
}> => {
  const avoidedFricheAccidents = sumMetricsTotalByName(
    aggregatedReconversionImpactMetrics,
    "avoidedFricheAccidentsDeaths",
    "avoidedFricheAccidentsSevereInjuries",
    "avoidedFricheAccidentsMinorInjuries",
  );

  if (avoidedFricheAccidents > 0) {
    return { letterScore: "A", metrics: { avoidedFricheAccidents } };
  }

  return undefined;
};
