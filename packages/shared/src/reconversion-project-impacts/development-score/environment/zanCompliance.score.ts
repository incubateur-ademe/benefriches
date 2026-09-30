import type { SiteReconversionType, SoilEvolutionDetails } from "../readFeatures.helpers";
import type { ScoredMetrics, LetterGrade } from "../scoring.helpers";

const getZanComplianceLetterGrade = (
  siteReconversionType: SiteReconversionType,
  soilsEvolutionDetails: Pick<
    SoilEvolutionDetails,
    "newGreenSoilSurfaces" | "permeableSurfaceDifference"
  >,
): LetterGrade | undefined => {
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
): ScoredMetrics<
  Pick<SoilEvolutionDetails, "newGreenSoilSurfaces" | "permeableSurfaceDifference"> & {
    siteReconversionType: SiteReconversionType;
  }
> => {
  const letterGrade = getZanComplianceLetterGrade(siteReconversionType, soilsEvolutionDetails);

  if (!letterGrade) {
    return undefined;
  }

  return {
    letterGrade,
    metrics: {
      permeableSurfaceDifference: soilsEvolutionDetails.permeableSurfaceDifference,
      newGreenSoilSurfaces: soilsEvolutionDetails.newGreenSoilSurfaces,
      siteReconversionType,
    },
  };
};
