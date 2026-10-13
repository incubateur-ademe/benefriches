import type {
  SiteReconversionType,
  LetterGrade,
  SoilEvolutionDetails,
  ZanComplianceIndicatorMetrics,
} from "../developmentScore.types";
import type { NullableIndicatorScore } from "../scoring.helpers";

type Props = {
  siteReconversionType: SiteReconversionType;
  soilsEvolutionDetails: Pick<
    SoilEvolutionDetails,
    "newGreenSoilSurfaces" | "permeableSurfaceDifference"
  >;
};
const getZanComplianceLetterGrade = ({
  siteReconversionType,
  soilsEvolutionDetails,
}: Props): LetterGrade | undefined => {
  const permeableVariation = soilsEvolutionDetails.permeableSurfaceDifference.percentVariation;
  const hasNewGreenSoil = soilsEvolutionDetails.newGreenSoilSurfaces > 0;
  if (siteReconversionType === "friche") {
    if (hasNewGreenSoil || permeableVariation > 80) return "A";
    if (permeableVariation > 30) return "B";
    if (permeableVariation < -50) return "E";
    return "C";
  }

  if (siteReconversionType === "enaf" || siteReconversionType === "friche_agricole") {
    if (hasNewGreenSoil || permeableVariation >= -15) return "D";
    return "E";
  }

  // TODO ZAE / urbain à compléter
  return undefined;
};

export const getZanComplianceScore = ({
  siteReconversionType,
  soilsEvolutionDetails,
}: Props): NullableIndicatorScore<ZanComplianceIndicatorMetrics> => {
  const letterGrade = getZanComplianceLetterGrade({ siteReconversionType, soilsEvolutionDetails });

  return {
    letterGrade,
    metrics: {
      permeableSurfaceDifference: soilsEvolutionDetails.permeableSurfaceDifference,
      newGreenSoilSurfaces: soilsEvolutionDetails.newGreenSoilSurfaces,
      siteReconversionType,
    },
  };
};
