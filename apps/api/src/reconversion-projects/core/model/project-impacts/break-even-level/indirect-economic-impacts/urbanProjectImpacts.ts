import {
  BuildingsUseDistribution,
  computeEstimatedPropertyTaxesAmount,
  DevelopmentPlanFeatures,
  IndirectEconomicImpact,
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
} from "../projectIndirectEconomicImpacts";

export const getNewUsagesTaxesIncomeImpact = ({
  buildingsFloorAreaDistribution,
  sumOnEvolutionPeriodService,
}: {
  buildingsFloorAreaDistribution: BuildingsUseDistribution;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): IndirectEconomicImpact[] => {
  const impacts: IndirectEconomicImpact[] = [];

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
}: UrbanProjectImpactsProps): IndirectEconomicImpact[] => {
  const impacts: IndirectEconomicImpact[] = [];

  // Helper local : évite la répétition du pattern
  // getter → guard → getWeightedYearlyValues → push
  const pushImpact = (
    name: IndirectEconomicImpact["name"],
    yearlyValue: number | undefined,
    weights: ("discount" | "gdp_evolution" | "co2_value" | "co2_emitted_per_vehicule")[],
  ) => {
    if (!yearlyValue) return;
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(yearlyValue, weights);
    impacts.push({
      name,
      total: sumList(detailsByYear),
      detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
    });
  };

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

  pushImpact(
    "avoidedAirConditioningCo2eqEmissions",
    urbanFreshnessImpactsService.getAvoidedAirConditioningCo2EmissionsInTonsPerYear(),
    ["discount", "co2_value"],
  );
  pushImpact(
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

  pushImpact(
    "avoidedPropertyDamageExpenses",
    travelRelatedImpactsService.getAvoidedPropertyDamageExpensesPerYear(),
    ["discount", "gdp_evolution"],
  );
  pushImpact(
    "avoidedCarRelatedExpenses",
    travelRelatedImpactsService.getAvoidedCarRelatedExpensesPerYear(),
    ["discount", "gdp_evolution"],
  );
  pushImpact(
    "travelTimeSavedPerTravelerExpenses",
    travelRelatedImpactsService.getTravelTimeSavedPerTravelerExpensesPerYear(),
    ["discount", "gdp_evolution"],
  );
  // Les émissions CO2 du trafic nécessitent un facteur supplémentaire
  pushImpact(
    "avoidedTrafficCo2EqEmissions",
    travelRelatedImpactsService.getAvoidedTrafficCO2EmissionsInTonsPerYear(),
    ["co2_emitted_per_vehicule", "co2_value", "discount"],
  );
  pushImpact(
    "avoidedAirPollutionHealthExpenses",
    travelRelatedImpactsService.getAvoidedAirPollutionHealthExpensesPerYear(),
    ["discount", "gdp_evolution"],
  );
  pushImpact(
    "avoidedAccidentsMinorInjuriesExpenses",
    travelRelatedImpactsService.getAvoidedAccidentsMinorInjuriesExpensesPerYear(),
    ["discount", "gdp_evolution"],
  );
  pushImpact(
    "avoidedAccidentsSevereInjuriesExpenses",
    travelRelatedImpactsService.getAvoidedAccidentsSevereInjuriesExpensesPerYear(),
    ["discount", "gdp_evolution"],
  );
  pushImpact(
    "avoidedAccidentsDeathsExpenses",
    travelRelatedImpactsService.getAvoidedAccidentsDeathsExpensesPerYear(),
    ["discount", "gdp_evolution"],
  );

  // --- Taxes liées aux nouveaux usages ---
  impacts.push(
    ...getNewUsagesTaxesIncomeImpact({
      buildingsFloorAreaDistribution:
        reconversionProject.developmentPlan.features.buildingsFloorAreaDistribution,
      sumOnEvolutionPeriodService,
    }),
  );

  return impacts;
};
