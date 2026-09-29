import { filterByName } from "../../../filter-by-name";
import type { AggregatedReconversionProjectOnSiteImpactItemView } from "../../projectImpacts.types";
import type { ItemScoreResult, LetterScore } from "../scoring.helpers";

const getEcosystemServicesLetterScore = (
  positiveCount: number,
  negativeCount: number,
): LetterScore => {
  const A = positiveCount >= 5 && negativeCount === 0;
  const B =
    (positiveCount >= 5 && negativeCount >= 1) ||
    (positiveCount >= 2 && positiveCount <= 4 && negativeCount <= 1);
  const C =
    (positiveCount <= 1 && negativeCount <= 1) ||
    (positiveCount >= 2 && positiveCount <= 4 && negativeCount >= 2 && negativeCount <= 4);

  const E = positiveCount === 0 && negativeCount > 5;

  if (A) return "A";
  if (B) return "B";
  if (C) return "C";
  if (E) return "E";
  return "D";
};

export const getEcosystemServicesScore = (
  aggregatedReconversionEconomicImpacts: AggregatedReconversionProjectOnSiteImpactItemView[],
): ItemScoreResult<{
  ecosystemicServices: AggregatedReconversionProjectOnSiteImpactItemView[];
}> => {
  const ecosystemicServices = filterByName(
    aggregatedReconversionEconomicImpacts,
    "newStoredCo2Eq",
    "forestRelatedProduct",
    "invasiveSpeciesRegulation",
    "natureRelatedWelnessAndLeisure",
    "nitrogenCycle",
    "pollination",
    "soilErosion",
    "waterCycle",
  );

  const positiveCount = ecosystemicServices.filter((item) => item.total > 0).length;
  const negativeCount = ecosystemicServices.filter((item) => item.total < 0).length;

  return {
    letterScore: getEcosystemServicesLetterScore(positiveCount, negativeCount),
    metrics: { ecosystemicServices },
  };
};
