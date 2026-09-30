import { sumListWithKey } from "../../../services";
import { isForest, isPrairie, isWetLand } from "../../../soils";
import type { SoilEvolutionDetails } from "../readFeatures.helpers";
import type { ScoredMetrics } from "../scoring.helpers";

export const getWaterQualityScore = (
  soilsEvolutionDetails: Pick<SoilEvolutionDetails, "contamination" | "soilsDistribution">,
): ScoredMetrics<
  Pick<SoilEvolutionDetails, "contamination"> & {
    prairieSurfaceDifference: number;
    forestSurfaceDifference: number;
    agriculturalSurfaceDifference: number;
    wetLandSurfaceDifference: number;
  }
> => {
  const prairieSurfaceDifference = sumListWithKey(
    soilsEvolutionDetails.soilsDistribution.filter((item) => isPrairie(item.soilType)),
    "total",
  );
  const forestSurfaceDifference = sumListWithKey(
    soilsEvolutionDetails.soilsDistribution.filter((item) => isForest(item.soilType)),
    "total",
  );
  const wetLandSurfaceDifference = sumListWithKey(
    soilsEvolutionDetails.soilsDistribution.filter((item) => isWetLand(item.soilType)),
    "total",
  );
  const agriculturalSurfaceDifference = sumListWithKey(
    soilsEvolutionDetails.soilsDistribution.filter(
      (item) =>
        item.soilType === "CULTIVATION" ||
        item.soilType === "ORCHARD" ||
        item.soilType === "VINEYARD",
    ),
    "total",
  );

  const metrics = {
    contamination: soilsEvolutionDetails.contamination,
    prairieSurfaceDifference,
    forestSurfaceDifference,
    agriculturalSurfaceDifference,
    wetLandSurfaceDifference,
  };

  if (prairieSurfaceDifference < 0 || wetLandSurfaceDifference < 0)
    return { letterGrade: "E", metrics };
  // TODO ajouter condition si projet ZAE avec réduction de la surface réservée
  if (agriculturalSurfaceDifference < 0 || forestSurfaceDifference < 0)
    return { letterGrade: "D", metrics };

  if (soilsEvolutionDetails.contamination.siteContaminatedSurface === 0) {
    return { letterGrade: "C", metrics };
  }

  const reduction = soilsEvolutionDetails.contamination.percentVariation;
  if (reduction >= 75) return { letterGrade: "A", metrics };
  if (reduction >= 10) return { letterGrade: "B", metrics };
  return { letterGrade: "C", metrics };
};
