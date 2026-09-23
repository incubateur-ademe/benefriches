import type { ReinstatementExpense } from "../../../reconversion-projects";
import { computeReinstatementFullTimeJobs } from "../../../reconversion-projects";
import { roundTo2Digits, sumList } from "../../../services";
import type { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeCumulativeByYear } from "../../../sum-on-evolution-period/computeCumulativeByYear";
import type {
  ProjectIndirectEconomicImpactName,
  ProjectIndirectImpactItemView,
  ProjectOnSiteImpactMetric,
} from "../../projectImpacts.types";
import type { Schedule } from "../fullTimeJobs.helper";
import {
  getDurationFromScheduleInYears,
  spreadTemporaryFullTimeJobsOver,
} from "../fullTimeJobs.helper";
import { computePropertyValueImpact } from "../urban-project/property-value/propertyValueImpact";
import { computeFricheYearlyRoadsAndUtilitiesMaintenanceExpenses } from "../urban-project/roads-and-utilities-expenses/roadsAndUtilitiesExpensesImpact";

export const getFricheRoadsAndUtilitiesExpensesImpact = ({
  siteSurfaceArea,
  sumOnEvolutionPeriodService,
}: {
  siteSurfaceArea: number;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): ProjectIndirectImpactItemView<ProjectIndirectEconomicImpactName> => {
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
    cityIsRural: boolean;
    cityMteZonageAbc?: "A" | "B" | "C" | "B1" | "B2" | "Abis";
    cityAnnualRateOfPopulationChange?: number;
  };
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): ProjectIndirectImpactItemView<ProjectIndirectEconomicImpactName>[] => {
  const impact = computePropertyValueImpact({
    siteSurfaceArea,
    citySurfaceArea: siteCityData.citySquareMetersSurfaceArea,
    cityPopulation: siteCityData.cityPopulation,
    localHousePriceEuroPerSquareMeters: siteCityData.cityPropertyValuePerSquareMeter,
    sumOnEvolutionPeriodService,
    isRenaturation: false, // TODO: quartier V2 créer une méthode de calcul pour ce paramètre,
    cityIsRural: siteCityData.cityIsRural,
    cityMteZonageAbc: siteCityData.cityMteZonageAbc,
    cityAnnualRateOfPopulationChange: siteCityData.cityAnnualRateOfPopulationChange,
  });

  if (!impact) {
    return [];
  }

  const {
    propertyValueIncrease,
    propertyTransferDutiesIncrease,
    propertyTransferDutiesIncreaseDetailsByYear,
    propertyValueIncreaseDetailsByYear,
  } = impact;
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

export const getReinstatementFullTimeJobs = ({
  reinstatementSchedule,
  reinstatementExpenses,
  evaluationPeriodInYears,
}: {
  reinstatementSchedule: Schedule;
  reinstatementExpenses: ReinstatementExpense[];
  evaluationPeriodInYears: number;
}): ProjectOnSiteImpactMetric | undefined => {
  const reinstatementFullTimeJobs = computeReinstatementFullTimeJobs(reinstatementExpenses);
  const reinstatementDurationInYears = roundTo2Digits(
    getDurationFromScheduleInYears(reinstatementSchedule),
  );
  const reinstatementJobsSpreadOverEvaluationPeriod = spreadTemporaryFullTimeJobsOver({
    targetDurationInYears: evaluationPeriodInYears,
    currentDurationInYears: reinstatementDurationInYears,
    temporaryFullTimeJobs: reinstatementFullTimeJobs,
  });

  if (reinstatementJobsSpreadOverEvaluationPeriod) {
    return {
      name: "reinstatementFullTimeJobs",
      total: reinstatementJobsSpreadOverEvaluationPeriod,
    };
  }
  return undefined;
};
