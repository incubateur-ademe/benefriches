import { type AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import type { FricheAccidentsIndicator } from "../developmentScore.types";
import { sumMetricsTotalByName } from "../scoring.helpers";

export const getFricheAccidentsScore = (
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[],
): FricheAccidentsIndicator => {
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
