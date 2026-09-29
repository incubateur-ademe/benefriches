import { type DevelopmentPlanType } from "../../../reconversion-projects";
import { type SiteStatuQuoImpactMetric } from "../../../site";
import { type AggregatedProjectImpactMetric } from "../../projectImpacts.types";
import { getEvolutionAsPercentage } from "../readFeatures.helpers";
import { type ItemScoreResult, type LetterScore, sumMetricsTotalByName } from "../scoring.helpers";

const getPhotovoltaicLetterScore = ({
  avoidedWithEnergyCo2eq,
  totalCo2eq,
  soilStoredPercentageVariation,
}: {
  avoidedWithEnergyCo2eq: number;
  totalCo2eq: number;
  soilStoredPercentageVariation: number;
}): LetterScore => {
  if (totalCo2eq < 0) return "E";

  if (avoidedWithEnergyCo2eq >= 5000) {
    if (soilStoredPercentageVariation > 0) return "A";
    if (soilStoredPercentageVariation >= -5) return "B";
    if (soilStoredPercentageVariation >= -10) return "C";
  } else if (avoidedWithEnergyCo2eq >= 500) {
    if (soilStoredPercentageVariation > 0) return "A";
    if (soilStoredPercentageVariation >= -10) return "B";
    if (soilStoredPercentageVariation >= -20) return "C";
  } else if (avoidedWithEnergyCo2eq >= 0) {
    if (soilStoredPercentageVariation > -10) return "C";
  }

  return "D";
};

const getUrbanProjectLetterScore = ({
  avoidedCo2eqEmissions,
  soilStoredPercentageVariation,
  totalCo2eq,
}: {
  avoidedCo2eqEmissions: number;
  soilStoredPercentageVariation: number;
  totalCo2eq: number;
}): LetterScore => {
  if (totalCo2eq < 0 && soilStoredPercentageVariation < 0) {
    return "E";
  }

  if (avoidedCo2eqEmissions > 0) {
    if (soilStoredPercentageVariation >= 50) return "A";
    if (soilStoredPercentageVariation >= 0) return "B";
    if (soilStoredPercentageVariation >= -10) return "C";
  }

  return "D";
};

export const getAvoidedCo2EmissionsScore = (props: {
  projectDevelopmentPlanType: DevelopmentPlanType;
  aggregatedReconversionImpactMetrics: AggregatedProjectImpactMetric[];
  siteStatuQuoImpactMetrics: SiteStatuQuoImpactMetric[];
}): ItemScoreResult<{ avoidedCo2eqEmissions: number; newStoredCo2Eq: number }> => {
  const avoidedCo2eqEmissions = sumMetricsTotalByName(
    props.aggregatedReconversionImpactMetrics,
    "avoidedAirConditioningCo2eqEmissions",
    "avoidedCO2TonsWithEnergyProduction",
    "avoidedTrafficCo2EqEmissions",
  );
  const newStoredCo2Eq = sumMetricsTotalByName(
    props.aggregatedReconversionImpactMetrics,
    "newStoredCo2Eq",
  );
  const co2eqStockBeforeReconversion =
    props.siteStatuQuoImpactMetrics.find((item) => item.name === "storedCo2Eq")?.total ?? 0;

  const totalCo2eq = avoidedCo2eqEmissions + newStoredCo2Eq;
  const soilStoredPercentageVariation = getEvolutionAsPercentage({
    before: co2eqStockBeforeReconversion,
    difference: newStoredCo2Eq,
  });

  const metrics = { avoidedCo2eqEmissions, newStoredCo2Eq };

  switch (props.projectDevelopmentPlanType) {
    case "PHOTOVOLTAIC_POWER_PLANT":
      return {
        letterScore: getPhotovoltaicLetterScore({
          avoidedWithEnergyCo2eq: avoidedCo2eqEmissions,
          soilStoredPercentageVariation,
          totalCo2eq,
        }),
        metrics,
      };
    case "URBAN_PROJECT":
      return {
        letterScore: getUrbanProjectLetterScore({
          avoidedCo2eqEmissions,
          soilStoredPercentageVariation,
          totalCo2eq,
        }),
        metrics,
      };
    default:
      return undefined;
  }
};
