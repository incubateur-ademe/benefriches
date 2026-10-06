import type { SoilEvolutionDetails } from "../readFeatures.helpers";
import type { ScoredMetrics, LetterGrade } from "../scoring.helpers";
import { convertLetterGradeToGradePoints } from "../scoring.helpers";

const getSoilsPermeableSurfaceLetterGrade = (variationPercent: number): LetterGrade => {
  if (variationPercent > 80) return "A";
  if (variationPercent > 30) return "B";
  if (variationPercent >= -10) return "C";
  if (variationPercent >= -50) return "D";
  return "E";
};

const getContaminationLetterGrade = (reductionPercent: number): LetterGrade => {
  if (reductionPercent > 99) return "A";
  if (reductionPercent > 75) return "B";
  if (reductionPercent > 50) return "C";
  return "D"; // 0 à 50 % : plancher D, E réservé à la perméabilité
};

const getWorstLetterGrade = (a: LetterGrade, b: LetterGrade): LetterGrade =>
  convertLetterGradeToGradePoints(a) <= convertLetterGradeToGradePoints(b) ? a : b;

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

  return {
    letterGrade: getWorstLetterGrade(
      permeableScore,
      getContaminationLetterGrade(soilsEvolutionDetails.contamination.percentVariation),
    ),
    metrics,
  };
};
