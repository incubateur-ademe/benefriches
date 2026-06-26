import {
  BuildingsUseDistribution,
  computeDefaultOperationsFullTimeJobsFromBuildingsAreaDistribution,
  computeEstimatedPropertyTaxesAmount,
  DevelopmentPlanFeatures,
  ProjectOnSiteImpactMetric,
  ReconversionProjectOnSiteIndirectEconomicImpact,
  sumList,
  sumListWithKey,
} from "shared";

import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { YearlyTravelRelatedImpacts } from "../../travel-related-impacts-service/YearlyTravelRelatedImpacts";
import { YearlyUrbanFreshnessRelatedImpacts } from "../../urban-freshness-related-impacts-service/YearlyUrbanFreshnessRelatedImpacts";
import {
  computeCumulativeByYear,
  InputReconversionProjectData,
  InputSiteData,
} from "../projectIndirectImpacts";
import {
  getFricheRoadsAndUtilitiesExpensesImpact,
  getLocalPropertyIncreaseWithFricheRemovalImpacts,
} from "./siteReconversionRelatedEconomicImpacts";

export const getNewUsagesTaxesIncomeImpact = ({
  buildingsFloorAreaDistribution,
  sumOnEvolutionPeriodService,
}: {
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): ReconversionProjectOnSiteIndirectEconomicImpact[] => {
  const impacts: ReconversionProjectOnSiteIndirectEconomicImpact[] = [];

  const newHousesSurfaceArea = buildingsFloorAreaDistribution.RESIDENTIAL ?? 0;

  if (newHousesSurfaceArea > 0) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      computeEstimatedPropertyTaxesAmount(newHousesSurfaceArea),
      ["gdp_evolution", "discount"],
    );
    impacts.push({
      detailsByYear,
      total: sumList(detailsByYear),
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      name: "projectNewHousesTaxesIncome",
    });
  }

  const newCompanySurfaceArea = buildingsFloorAreaDistribution.OFFICES ?? 0;

  if (newCompanySurfaceArea > 0) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      (2018 * newCompanySurfaceArea) / 15,
      ["gdp_evolution", "discount"],
    );
    impacts.push({
      detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      total: sumList(detailsByYear),
      name: "projectNewCompanyTaxationIncome",
    });
  }

  return impacts;
};

type UrbanProjectImpactsProps = {
  reconversionProject: InputReconversionProjectData & {
    developmentPlan: Extract<DevelopmentPlanFeatures, { type: "URBAN_PROJECT" }>;
  };
  relatedSite: InputSiteData;
  siteCityData: {
    citySquareMetersSurfaceArea: number;
    cityPopulation: number;
    cityPropertyValuePerSquareMeter: number;
  };
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};

/**
 * Calcule l'ensemble des impacts indirects spécifiques aux projets urbains :
 * fraîcheur urbaine, mobilité/déplacements et taxes liées aux nouveaux usages.
 */
export const getUrbanProjectImpacts = ({
  reconversionProject,
  relatedSite,
  siteCityData,
  sumOnEvolutionPeriodService,
}: UrbanProjectImpactsProps): {
  economicImpacts: ReconversionProjectOnSiteIndirectEconomicImpact[];
  impactMetrics: ProjectOnSiteImpactMetric[];
} => {
  const economicImpacts: ReconversionProjectOnSiteIndirectEconomicImpact[] = [];
  const impactsMetrics: ProjectOnSiteImpactMetric[] = [];

  const pushEconomicImpact = (
    name: ReconversionProjectOnSiteIndirectEconomicImpact["name"],
    yearlyValue: number | undefined,
    weights: ("discount" | "gdp_evolution" | "co2_value" | "co2_emitted_per_vehicule")[],
  ) => {
    if (!yearlyValue) return;
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(yearlyValue, weights);
    economicImpacts.push({
      name,
      total: sumList(detailsByYear),
      detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
    });
  };

  const pushImpactMetrics = (
    name: ProjectOnSiteImpactMetric["name"],
    yearlyValue: number | undefined,
    weights: ("co2_value" | "co2_emitted_per_vehicule")[],
  ) => {
    if (!yearlyValue) return;
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(yearlyValue, weights);
    impactsMetrics.push({
      name,
      total: sumList(detailsByYear),
      detailsByYear,
    });
  };

  // --- Taxes liées aux nouveaux usages ---
  economicImpacts.push(
    ...getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution:
        reconversionProject.developmentPlan.features.buildingsFloorAreaDistribution,
      sumOnEvolutionPeriodService,
    }),
  );

  // ETP
  const operationsFullTimeJobs = computeDefaultOperationsFullTimeJobsFromBuildingsAreaDistribution(
    reconversionProject.developmentPlan.features.buildingsFloorAreaDistribution,
  );
  if (operationsFullTimeJobs) {
    impactsMetrics.push({
      name: "operationsFullTimeJobs",
      total: operationsFullTimeJobs,
    });
  }

  if (relatedSite.nature === "FRICHE") {
    economicImpacts.push(
      getFricheRoadsAndUtilitiesExpensesImpact({
        siteSurfaceArea: relatedSite.surfaceArea,
        sumOnEvolutionPeriodService,
      }),
    );
    economicImpacts.push(
      ...getLocalPropertyIncreaseWithFricheRemovalImpacts({
        siteSurfaceArea: relatedSite.surfaceArea,
        siteCityData,
        sumOnEvolutionPeriodService,
      }),
    );

    // --- Fraîcheur urbaine ---
    const urbanFreshnessImpactsService = new YearlyUrbanFreshnessRelatedImpacts({
      buildingsFloorAreaDistribution:
        reconversionProject.developmentPlan.features.buildingsFloorAreaDistribution,
      projectPublicGreenSpaceSurface: sumListWithKey(
        reconversionProject.soilsDistribution.filter(
          ({ spaceCategory }) => spaceCategory === "PUBLIC_GREEN_SPACE",
        ),
        "surfaceArea",
      ),
      siteSquareMetersSurfaceArea: relatedSite.surfaceArea,
      citySquareMetersSurfaceArea: siteCityData.citySquareMetersSurfaceArea,
      cityPopulation: siteCityData.cityPopulation,
    });

    pushEconomicImpact(
      "avoidedAirConditioningCo2eqEmissions",
      urbanFreshnessImpactsService.getAvoidedAirConditioningCo2EmissionsInTonsPerYear(),
      ["discount", "co2_value"],
    );

    pushImpactMetrics(
      "avoidedAirConditioningCo2eqEmissions",
      urbanFreshnessImpactsService.getAvoidedAirConditioningCo2EmissionsInTonsPerYear(),
      [],
    );

    pushEconomicImpact(
      "avoidedAirConditioningExpenses",
      urbanFreshnessImpactsService.getAvoidedAirConditioningExpensesPerYear(),
      ["discount"],
    );

    // --- Impacts liés aux déplacements ---
    const travelRelatedImpactsService = new YearlyTravelRelatedImpacts({
      buildingsFloorAreaDistribution:
        reconversionProject.developmentPlan.features.buildingsFloorAreaDistribution,
      siteSquareMetersSurfaceArea: relatedSite.surfaceArea,
      citySquareMetersSurfaceArea: siteCityData.citySquareMetersSurfaceArea,
      cityPopulation: siteCityData.cityPopulation,
    });

    pushImpactMetrics(
      "avoidedVehiculeKilometers",
      travelRelatedImpactsService.getAvoidedKilometersPerVehiculePerYear(),
      [],
    );

    pushImpactMetrics(
      "timeTravelSavedInHours",
      travelRelatedImpactsService.getTravelTimeSavedPerTravelerPerYear(),
      [],
    );

    pushEconomicImpact(
      "avoidedCarRelatedExpenses",
      travelRelatedImpactsService.getAvoidedCarRelatedExpensesPerYear(),
      ["discount", "gdp_evolution"],
    );
    pushEconomicImpact(
      "travelTimeSavedPerTravelerExpenses",
      travelRelatedImpactsService.getTravelTimeSavedPerTravelerExpensesPerYear(),
      ["discount", "gdp_evolution"],
    );

    pushImpactMetrics(
      "avoidedTrafficCo2EqEmissions",
      travelRelatedImpactsService.getAvoidedKilometersPerVehiculePerYear(),
      ["co2_emitted_per_vehicule"],
    );

    pushEconomicImpact(
      "avoidedTrafficCo2EqEmissions",
      travelRelatedImpactsService.getAvoidedKilometersPerVehiculePerYear(),
      ["co2_emitted_per_vehicule", "co2_value", "discount"],
    );
    pushEconomicImpact(
      "avoidedAirPollutionHealthExpenses",
      travelRelatedImpactsService.getAvoidedAirPollutionHealthExpensesPerYear(),
      ["discount", "gdp_evolution"],
    );

    pushImpactMetrics(
      "avoidedTrafficAccidentsSevereInjuries",
      travelRelatedImpactsService.getTrafficAccidentsPerYear().severe,
      [],
    );

    pushImpactMetrics(
      "avoidedTrafficAccidentsMinorInjuries",
      travelRelatedImpactsService.getTrafficAccidentsPerYear().minor,
      [],
    );

    pushImpactMetrics(
      "avoidedTrafficAccidentsDeaths",
      travelRelatedImpactsService.getTrafficAccidentsPerYear().deaths,
      [],
    );

    pushEconomicImpact(
      "avoidedPropertyDamageExpenses",
      travelRelatedImpactsService.getAvoidedPropertyDamageExpensesPerYear(),
      ["discount", "gdp_evolution"],
    );

    pushEconomicImpact(
      "avoidedAccidentsMinorInjuriesExpenses",
      travelRelatedImpactsService.getAvoidedAccidentsMinorInjuriesExpensesPerYear(),
      ["discount", "gdp_evolution"],
    );
    pushEconomicImpact(
      "avoidedAccidentsSevereInjuriesExpenses",
      travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesExpensesPerYear(),
      ["discount", "gdp_evolution"],
    );
    pushEconomicImpact(
      "avoidedAccidentsDeathsExpenses",
      travelRelatedImpactsService.getAvoidedAccidentsDeathsExpensesPerYear(),
      ["discount", "gdp_evolution"],
    );
  }

  return {
    economicImpacts: economicImpacts,
    impactMetrics: impactsMetrics,
  };
};
