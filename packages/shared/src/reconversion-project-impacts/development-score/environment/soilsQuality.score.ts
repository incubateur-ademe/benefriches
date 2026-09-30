import type { SoilEvolutionDetails } from "../readFeatures.helpers";
import type { ScoredMetrics, LetterGrade } from "../scoring.helpers";

const getSoilsPermeableSurfaceLetterGrade = (variationPercent: number): LetterGrade => {
  if (variationPercent > 80) return "A";
  if (variationPercent > 30) return "B";
  if (variationPercent >= -10) return "C";
  if (variationPercent >= -50) return "D";
  return "E";
};

export const getSoilsQualityScore = (
  soilsEvolutionDetails: Pick<SoilEvolutionDetails, "contamination" | "permeableSurfaceDifference">,
): ScoredMetrics<Pick<SoilEvolutionDetails, "contamination" | "permeableSurfaceDifference">> => {
  const permeableScore = getSoilsPermeableSurfaceLetterGrade(
    soilsEvolutionDetails.permeableSurfaceDifference.percentVariation,
  );

  const metrics = {
    permeableSurfaceDifference: soilsEvolutionDetails.permeableSurfaceDifference,
    contamination: soilsEvolutionDetails.contamination,
  };

  if (soilsEvolutionDetails.contamination.siteContaminatedSurface === 0) {
    return { letterGrade: permeableScore, metrics };
  }

  if (soilsEvolutionDetails.contamination.percentVariation > 99 && permeableScore === "A")
    return { letterGrade: "A", metrics };
  if (soilsEvolutionDetails.contamination.percentVariation > 75 && permeableScore === "B")
    return { letterGrade: "B", metrics };
  if (soilsEvolutionDetails.contamination.percentVariation > 50 && permeableScore === "C")
    return { letterGrade: "C", metrics };
  if (soilsEvolutionDetails.contamination.percentVariation > 0 && permeableScore === "D")
    return { letterGrade: "D", metrics };
  return { letterGrade: "E", metrics };
};
