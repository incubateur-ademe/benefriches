import {
  IndirectEconomicImpact,
  SiteYearlyExpense,
  SiteYearlyIncome,
  sumList,
  sumListWithKey,
} from "shared";

import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computePropertyValueImpact } from "../../property-value/propertyValueImpact";
import { computeYearlyRoadsAndUtilitiesMaintenanceExpenses } from "../../roads-and-utilities-expenses/roadsAndUtilitiesExpensesImpact";
import { computeCumulativeByYear } from "../projectIndirectEconomicImpacts";

const FRICHE_COST_PURPOSES = [
  "security",
  "illegalDumpingCost",
  "accidentsCost",
  "otherSecuringCosts",
  "maintenance",
] as const;

type FricheCostPurpose = (typeof FRICHE_COST_PURPOSES)[number];

export const getAvoidedFricheMaintenanceAndSecuringCosts = (props: {
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  yearlyExpenses: SiteYearlyExpense[];
}): IndirectEconomicImpact[] => {
  const currentFricheCosts = props.yearlyExpenses.filter(({ purpose }) =>
    FRICHE_COST_PURPOSES.includes(purpose as FricheCostPurpose),
  ) as { purpose: FricheCostPurpose; amount: number; bearer: string }[];

  return currentFricheCosts.map(({ bearer, amount, purpose }) => {
    const detailsByYear = props.sumOnEvolutionPeriodService.getWeightedYearlyValues(amount, [
      "discount",
    ]);
    const name =
      bearer === "tenant"
        ? "avoidedFricheMaintenanceAndSecuringCostsForTenant"
        : "avoidedFricheMaintenanceAndSecuringCostsForOwner";
    return {
      total: sumList(detailsByYear),
      detailsByYear,
      cumulativeByYear: computeCumulativeByYear(detailsByYear),
      details: purpose,
      name,
    };
  });
};

export const getPreviousSiteOperationBenefitLoss = ({
  previousYearlyIncomes,
  previousYearlyExpenses,
  sumOnEvolutionPeriodService,
}: {
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
  previousYearlyIncomes: SiteYearlyIncome[];
  previousYearlyExpenses: SiteYearlyExpense[];
}): IndirectEconomicImpact => {
  const yearlySiteEconomicBalance =
    sumListWithKey(previousYearlyIncomes, "amount") -
    sumListWithKey(previousYearlyExpenses, "amount");

  const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
    yearlySiteEconomicBalance,
    ["discount"],
  );
  return {
    total: sumList(detailsByYear),
    detailsByYear: detailsByYear,
    cumulativeByYear: computeCumulativeByYear(detailsByYear),

    name: "previousSiteOperationBenefitLoss",
  };
};

export const getFricheRoadsAndUtilitiesExpensesImpact = ({
  siteSurfaceArea,
  sumOnEvolutionPeriodService,
}: {
  siteSurfaceArea: number;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): IndirectEconomicImpact => {
  const yearlyMaintenanceAmount =
    computeYearlyRoadsAndUtilitiesMaintenanceExpenses(siteSurfaceArea);
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
    name: "previousSiteOperationBenefitLoss",
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
}): IndirectEconomicImpact[] => {
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
