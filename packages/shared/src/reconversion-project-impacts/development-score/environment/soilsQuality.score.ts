import type { SoilEvolutionDetails } from "../readFeatures.helpers";
import type { ItemScoreResult, LetterScore } from "../scoring.helpers";

const getSoilsPermeableSurfaceLetterScore = (variationPercent: number): LetterScore => {
  if (variationPercent > 80) return "A";
  if (variationPercent > 30) return "B";
  if (variationPercent >= -10) return "C";
  if (variationPercent >= -50) return "D";
  return "E";
};

export const getSoilsQualityScore = (
  soilsEvolutionDetails: Pick<SoilEvolutionDetails, "contamination" | "permeableSurfaceDifference">,
): ItemScoreResult<Pick<SoilEvolutionDetails, "contamination" | "permeableSurfaceDifference">> => {
  const permeableScore = getSoilsPermeableSurfaceLetterScore(
    soilsEvolutionDetails.permeableSurfaceDifference.percentVariation,
  );

  const metrics = {
    permeableSurfaceDifference: soilsEvolutionDetails.permeableSurfaceDifference,
    contamination: soilsEvolutionDetails.contamination,
  };

  if (soilsEvolutionDetails.contamination.siteContaminatedSurface === 0) {
    return { letterScore: permeableScore, metrics };
  }

  if (soilsEvolutionDetails.contamination.percentVariation > 99 && permeableScore === "A")
    return { letterScore: "A", metrics };
  if (soilsEvolutionDetails.contamination.percentVariation > 75 && permeableScore === "B")
    return { letterScore: "B", metrics };
  if (soilsEvolutionDetails.contamination.percentVariation > 50 && permeableScore === "C")
    return { letterScore: "C", metrics };
  if (soilsEvolutionDetails.contamination.percentVariation > 0 && permeableScore === "D")
    return { letterScore: "D", metrics };
  return { letterScore: "E", metrics };
};
