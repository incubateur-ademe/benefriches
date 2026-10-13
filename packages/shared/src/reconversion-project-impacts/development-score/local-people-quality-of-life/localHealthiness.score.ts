import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import type {
  LocalHealthinessIndicatorMetrics,
  SiteReconversionType,
  SoilEvolutionDetails,
} from "../developmentScore.types";
import type { NullableIndicatorScore } from "../scoring.helpers";

export const getLocalHealthinessScore = (props: {
  siteReconversionType: SiteReconversionType;
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
  soilEvolutionDetails: Pick<SoilEvolutionDetails, "newGreenSoilSurfaces">;
}): NullableIndicatorScore<LocalHealthinessIndicatorMetrics> => {
  const sportsFacilitiesFloorSurface = props.buildingsFloorAreaDistribution.SPORTS_FACILITIES ?? 0;

  const projectHealthinessImprovment =
    sportsFacilitiesFloorSurface > 0 || props.soilEvolutionDetails.newGreenSoilSurfaces > 0;

  const metrics = {
    siteReconversionType: props.siteReconversionType,
    sportsFacilitiesFloorSurface,
    newGreenSoilSurfaces: props.soilEvolutionDetails.newGreenSoilSurfaces,
  };

  if (props.siteReconversionType === "friche" || projectHealthinessImprovment) {
    return {
      letterGrade:
        props.siteReconversionType === "friche" && projectHealthinessImprovment ? "A" : "B",
      metrics,
    };
  }
  return { letterGrade: undefined, metrics };
};
