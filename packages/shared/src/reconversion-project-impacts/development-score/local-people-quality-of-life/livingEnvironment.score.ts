import type { BuildingsUseDistribution } from "../../../reconversion-projects";
import type {
  LetterGrade,
  LivingEnvironmentContext,
  LivingEnvironmentIndicatorMetrics,
} from "../developmentScore.types";
import { filterBuildingsUses } from "../readFeatures.helpers";
import type { RequiredIndicatorScore } from "../scoring.helpers";

const PROXIMITY_AMENITY_BUILDINGS: Set<keyof BuildingsUseDistribution> = new Set([
  "RESIDENTIAL",
  "LOCAL_STORE",
  "LOCAL_SERVICES",
  "ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES",
  "PUBLIC_FACILITIES",

  // Health facilities
  "LOCAL_HEALTH_SERVICE",
  "MEDICAL_SOCIAL_FACILITY",
  "HOSPITAL",

  // Leisure and culture facilities
  "CINEMA",
  "MUSEUM",
  "THEATER",
  "RECREATIONAL_FACILITY",
  "OTHER_CULTURAL_PLACE",
  "SPORTS_FACILITIES",
]);

const EDUCATIONAL_FACILITIES_BUILDINGS: Set<keyof BuildingsUseDistribution> = new Set([
  "KINDERGARTEN_OR_PRIMARY_SCHOOL",
  "SECONDARY_SCHOOL",
  "OTHER_EDUCATIONAL_FACILITY",
]);

const getLivingEnvironmentLetterGrade = (ctx: LivingEnvironmentContext): LetterGrade => {
  if (ctx.siteNature === "NATURAL_AREA") return "E";
  if (ctx.siteNature === "AGRICULTURAL_OPERATION" || ctx.siteReconversionType === "friche_agricole")
    return "D";

  const hasProximityAmenity =
    filterBuildingsUses(ctx.buildingsFloorAreaDistribution ?? {}, PROXIMITY_AMENITY_BUILDINGS)
      .length > 0;

  const hasImprovement = ctx.soilEvolutionDetails.newGreenSoilSurfaces > 0 || hasProximityAmenity;

  if (ctx.projectDevelopmentPlanType === "SUBURBAN_DENSIFICATION")
    return hasImprovement ? "C" : "D";

  if (ctx.siteNature === "FRICHE" || ctx.projectDevelopmentPlanType === "GRAND_ENSEMBLE")
    return hasImprovement ? "A" : "B";

  const hasEducationalFacility =
    filterBuildingsUses(ctx.buildingsFloorAreaDistribution ?? {}, EDUCATIONAL_FACILITIES_BUILDINGS)
      .length > 0;

  if (hasImprovement || hasEducationalFacility) return "B";
  return "C";
};

export const getLivingEnvironmentScore = (
  ctx: LivingEnvironmentContext,
): RequiredIndicatorScore<LivingEnvironmentIndicatorMetrics> => ({
  letterGrade: getLivingEnvironmentLetterGrade(ctx),
  metrics: ctx,
});
