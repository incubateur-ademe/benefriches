import type { SiteReconversionType, SoilEvolutionDetails } from "../readFeatures.helpers";
import type { ItemScoreResult, LetterScore } from "../scoring.helpers";

const getZanComplianceLetterScore = (
  siteReconversionType: SiteReconversionType,
  soilsEvolutionDetails: Pick<
    SoilEvolutionDetails,
    "newGreenSoilSurfaces" | "permeableSurfaceDifference"
  >,
): LetterScore | undefined => {
  const permeableVariation = soilsEvolutionDetails.permeableSurfaceDifference.percentVariation;
  const hasNewGreenSoil = soilsEvolutionDetails.newGreenSoilSurfaces > 0;
  if (siteReconversionType === "friche") {
    if (hasNewGreenSoil || permeableVariation > 80) return "A";
    if (permeableVariation >= 30) return "B";
    if (permeableVariation <= -50) return "E";
    return "C";
  }

  if (siteReconversionType === "enaf" || siteReconversionType === "friche_agricole") {
    if (hasNewGreenSoil || permeableVariation >= -15) return "D";
    return "E";
  }

  // TODO ZAE / urbain à compléter
  return undefined;
};

export const getZanComplianceScore = (
  siteReconversionType: SiteReconversionType,
  soilsEvolutionDetails: Pick<
    SoilEvolutionDetails,
    "newGreenSoilSurfaces" | "permeableSurfaceDifference"
  >,
): ItemScoreResult<
  Pick<SoilEvolutionDetails, "newGreenSoilSurfaces" | "permeableSurfaceDifference"> & {
    siteReconversionType: SiteReconversionType;
  }
> => {
  const letterScore = getZanComplianceLetterScore(siteReconversionType, soilsEvolutionDetails);

  if (!letterScore) {
    return undefined;
  }

  return {
    letterScore,
    metrics: {
      permeableSurfaceDifference: soilsEvolutionDetails.permeableSurfaceDifference,
      newGreenSoilSurfaces: soilsEvolutionDetails.newGreenSoilSurfaces,
      siteReconversionType,
    },
  };
};
