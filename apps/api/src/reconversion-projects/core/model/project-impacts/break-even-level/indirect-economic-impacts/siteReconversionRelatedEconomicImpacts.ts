import { ReconversionProjectOnSiteIndirectEconomicImpact, sumList } from "shared";

import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computePropertyValueImpact } from "../../property-value/propertyValueImpact";
import { computeFricheYearlyRoadsAndUtilitiesMaintenanceExpenses } from "../../roads-and-utilities-expenses/roadsAndUtilitiesExpensesImpact";
import { computeCumulativeByYear } from "../projectIndirectEconomicImpacts";

export const getFricheRoadsAndUtilitiesExpensesImpact = ({
  siteSurfaceArea,
  sumOnEvolutionPeriodService,
}: {
  siteSurfaceArea: number;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): ReconversionProjectOnSiteIndirectEconomicImpact => {
  const yearlyMaintenanceAmount =
    computeFricheYearlyRoadsAndUtilitiesMaintenanceExpenses(siteSurfaceArea);
  const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
    -1 * yearlyMaintenanceAmount,
    ["discount"],
    {
      startYearIndex: 1,
    },
  );
  return {
    total: sumList(detailsByYear),
    detailsByYear: detailsByYear,
    cumulativeByYear: computeCumulativeByYear(detailsByYear),
    name: "fricheRoadsAndUtilitiesExpenses",
  };
};

export const getLocalPropertyIncreaseWithFricheRemovalImpacts = ({
  siteSurfaceArea,
  siteCityData,
  sumOnEvolutionPeriodService,
}: {
  siteSurfaceArea: number;
  siteCityData: {
    citySquareMetersSurfaceArea: number;
    cityPopulation: number;
    cityPropertyValuePerSquareMeter: number;
  };
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): ReconversionProjectOnSiteIndirectEconomicImpact[] => {
  const {
    propertyValueIncrease,
    propertyTransferDutiesIncrease,
    propertyTransferDutiesIncreaseDetailsByYear,
    propertyValueIncreaseDetailsByYear,
  } = computePropertyValueImpact(
    siteSurfaceArea,
    siteCityData.citySquareMetersSurfaceArea,
    siteCityData.cityPopulation,
    siteCityData.cityPropertyValuePerSquareMeter,
    sumOnEvolutionPeriodService,
    false, // TODO: quartier V2 créer une méthode de calcul pour ce paramètre
  );
  return [
    {
      total: propertyValueIncrease,
      detailsByYear: propertyValueIncreaseDetailsByYear,
      cumulativeByYear: computeCumulativeByYear(propertyValueIncreaseDetailsByYear),
      name: "localPropertyValueIncrease",
    },
    {
      total: propertyTransferDutiesIncrease,
      name: "localTransferDutiesIncrease",
      detailsByYear: propertyTransferDutiesIncreaseDetailsByYear,
      cumulativeByYear: computeCumulativeByYear(propertyTransferDutiesIncreaseDetailsByYear),
    },
  ];
};
