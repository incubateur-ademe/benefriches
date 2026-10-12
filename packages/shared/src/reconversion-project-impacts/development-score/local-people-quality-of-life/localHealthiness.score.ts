import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import type {
  LocalHealthinessIndicator,
  SiteReconversionType,
  SoilEvolutionDetails,
} from "../developmentScore.types";

export const getLocalHealthinessScore = (props: {
  siteReconversionType: SiteReconversionType;
  buildingsFloorAreaDistribution: BuildingsUseDistribution | undefined;
  soilEvolutionDetails: Pick<SoilEvolutionDetails, "newGreenSoilSurfaces">;
}): LocalHealthinessIndicator => {
  if (!props.buildingsFloorAreaDistribution) {
    return undefined;
  }
  const sportsFacilitiesFloorSurface = props.buildingsFloorAreaDistribution.SPORTS_FACILITIES ?? 0;

  const projectHealthinessImprovment =
    sportsFacilitiesFloorSurface > 0 || props.soilEvolutionDetails.newGreenSoilSurfaces > 0;

  if (props.siteReconversionType === "friche" || projectHealthinessImprovment) {
    return {
      letterGrade:
        props.siteReconversionType === "friche" && projectHealthinessImprovment ? "A" : "B",
      metrics: {
        siteReconversionType: props.siteReconversionType,
        sportsFacilitiesFloorSurface,
        newGreenSoilSurfaces: props.soilEvolutionDetails.newGreenSoilSurfaces,
      },
    };
  }
  return undefined;
};
