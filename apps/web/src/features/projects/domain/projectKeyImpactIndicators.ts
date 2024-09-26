import { SyntheticImpact } from "../application/projectImpactsSynthetics.selectors";

export type ProjectOverallImpact = "strong_negative" | "negative" | "positive" | "strong_positive";

type ProjectKeyImpactIndicators = SyntheticImpact;

export const isProjectOverallImpactPositive = (
  projectOverallImpact: ProjectOverallImpact,
): boolean => {
  return projectOverallImpact === "positive" || projectOverallImpact === "strong_positive";
};

const isKeyIndicatorPositive = (keyIndicator: ProjectKeyImpactIndicators): boolean =>
  keyIndicator.isSuccess;

export const getProjectOverallImpact = (
  projectKeyImpactIndicators: ProjectKeyImpactIndicators[],
): ProjectOverallImpact => {
  const projectOverallMonetaryBalance = projectKeyImpactIndicators.find((keyIndicator) => {
    return keyIndicator.name === "projectImpactBalance";
  });
  const hasPositiveOverallMonetaryBalance = !!projectOverallMonetaryBalance?.isSuccess;

  const positiveKeyImpactIndicators = projectKeyImpactIndicators.filter(isKeyIndicatorPositive);
  const negativeKeyImpactIndicators = projectKeyImpactIndicators.filter(
    (keyIndicator) => !isKeyIndicatorPositive(keyIndicator),
  );

  if (hasPositiveOverallMonetaryBalance) {
    if (positiveKeyImpactIndicators.length < 5) {
      return "positive";
    }
    return "strong_positive";
  }

  return negativeKeyImpactIndicators.length < 5 ? "negative" : "strong_negative";
};

const MAIN_KEY_IMPACT_INDICATORS_COUNT = 3;
const DEFAULT_KEY_INDICATORS_ORDER_PRIORITY = [
  "taxesIncomesImpact",
  "fullTimeJobs",
  "avoidedCo2eqEmissions",
  "zanCompliance",
  "projectImpactBalance",
  "avoidedFricheCostsForLocalAuthority",
  "nonContaminatedSurfaceArea",
  "permeableSurfaceArea",
  "householdsPoweredByRenewableEnergy",
  "localPropertyValueIncrease",
] as const;
const STRONG_POSITIVE_ORDER_PRIORITY = [
  "zanCompliance",
  "projectImpactBalance",
  "avoidedFricheCostsForLocalAuthority",
  "taxesIncomesImpact",
  "fullTimeJobs",
  "avoidedCo2eqEmissions",
  "nonContaminatedSurfaceArea",
  "permeableSurfaceArea",
  "householdsPoweredByRenewableEnergy",
  "localPropertyValueIncrease",
] as const;
export const getMainKeyImpactIndicators = (
  projectKeyImpactIndicators: ProjectKeyImpactIndicators[],
): ProjectKeyImpactIndicators[] => {
  const overallImpact = getProjectOverallImpact(projectKeyImpactIndicators);
  const keyIndicatorsToSort = isProjectOverallImpactPositive(overallImpact)
    ? projectKeyImpactIndicators.filter(isKeyIndicatorPositive)
    : projectKeyImpactIndicators.filter((keyIndicator) => !isKeyIndicatorPositive(keyIndicator));
  const orderPriority =
    overallImpact === "strong_positive"
      ? STRONG_POSITIVE_ORDER_PRIORITY
      : DEFAULT_KEY_INDICATORS_ORDER_PRIORITY;

  return keyIndicatorsToSort
    .sort((a, b) => orderPriority.indexOf(a.name) - orderPriority.indexOf(b.name))
    .slice(0, MAIN_KEY_IMPACT_INDICATORS_COUNT);
};
