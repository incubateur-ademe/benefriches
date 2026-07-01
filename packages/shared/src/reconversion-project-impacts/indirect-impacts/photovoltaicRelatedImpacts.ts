import {
  computeDefaultPhotovoltaicConversionFullTimeJobs,
  computeDefaultPhotovoltaicOperationsFullTimeJobs,
  RecurringExpense,
} from "../../reconversion-projects";
import { roundTo2Digits, sumList } from "../../services";
import { SumOnEvolutionPeriodService } from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeCumulativeByYear } from "../../sum-on-evolution-period/computeCumulativeByYear";
import {
  getDurationFromScheduleInYears,
  spreadTemporaryFullTimeJobsOver,
} from "../helpers/fullTimeJobs.helper";
import {
  DevelopmentPlanFeatures,
  ProjectOnSiteImpactMetric,
  ReconversionProjectOnSiteIndirectEconomicImpact,
} from "../projectImpactsDataView.types";
import { InputReconversionProjectData } from "../projectIndirectImpacts";
import { computeAvoidedCO2TonsWithEnergyProductionImpact } from "./renewable-energy/avoided-CO2-with-energy-production/avoidedCO2WithEnergyProductionImpact";
import { computeHouseholdsPoweredByRenewableEnergyImpact } from "./renewable-energy/households-powered-by-renewable-energy/householdsPoweredByRenewableEnergyImpact";

const getPhotovoltaicProductionRelatedImpacts = (props: {
  expectedAnnualProduction: number;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): {
  economicImpacts: ReconversionProjectOnSiteIndirectEconomicImpact[];
  impactMetrics: ProjectOnSiteImpactMetric[];
} => {
  const avoidedCO2TonsWithEnergyProductionPerYear = computeAvoidedCO2TonsWithEnergyProductionImpact(
    {
      forecastAnnualEnergyProductionMWh: props.expectedAnnualProduction,
    },
  );

  const avoidedCO2TonsWithEnergyProductionDetailsByYear =
    props.sumOnEvolutionPeriodService.getWeightedYearlyValues(
      avoidedCO2TonsWithEnergyProductionPerYear,
      [],
    );

  const avoidedCO2TonsWithEnergyProductionMonetaryValueDetailsByYear =
    props.sumOnEvolutionPeriodService.getWeightedYearlyValues(
      avoidedCO2TonsWithEnergyProductionPerYear,
      ["co2_value", "discount"],
    );

  const householdsPoweredByRenewableEnergy = computeHouseholdsPoweredByRenewableEnergyImpact({
    forecastRenewableEnergyAnnualProductionMWh: props.expectedAnnualProduction,
  });

  return {
    impactMetrics: [
      {
        name: "avoidedCO2TonsWithEnergyProduction",
        total: sumList(avoidedCO2TonsWithEnergyProductionDetailsByYear),
        detailsByYear: avoidedCO2TonsWithEnergyProductionDetailsByYear,
      },
      {
        name: "householdsPoweredByRenewableEnergy",
        total: householdsPoweredByRenewableEnergy,
      },
    ],
    economicImpacts: [
      {
        detailsByYear: avoidedCO2TonsWithEnergyProductionMonetaryValueDetailsByYear,
        cumulativeByYear: computeCumulativeByYear(
          avoidedCO2TonsWithEnergyProductionMonetaryValueDetailsByYear,
        ),
        total: sumList(avoidedCO2TonsWithEnergyProductionMonetaryValueDetailsByYear),
        name: "avoidedCo2eqWithEnergyProduction",
      },
    ],
  };
};

const getNewPhotovoltaicTaxesIncomeImpact = ({
  yearlyProjectedExpenses,
  sumOnEvolutionPeriodService,
}: {
  yearlyProjectedExpenses: RecurringExpense[];
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): ReconversionProjectOnSiteIndirectEconomicImpact | undefined => {
  const projectedTaxesAmount =
    yearlyProjectedExpenses.find(({ purpose }) => purpose === "taxes")?.amount ?? 0;

  if (projectedTaxesAmount) {
    const detailsByYear = sumOnEvolutionPeriodService.getWeightedYearlyValues(
      projectedTaxesAmount,
      ["discount", "gdp_evolution"],
    );

    return {
      detailsByYear,
      total: sumList(detailsByYear),
      cumulativeByYear: computeCumulativeByYear(detailsByYear),

      name: "projectPhotovoltaicTaxesIncome",
    };
  }
  return undefined;
};

type PhotovoltaicImpactsProps = {
  reconversionProject: InputReconversionProjectData & {
    developmentPlan: Extract<DevelopmentPlanFeatures, { type: "PHOTOVOLTAIC_POWER_PLANT" }>;
  };
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
};
export const getPhotovoltaicPowerPlantProjectImpacts = ({
  reconversionProject,
  sumOnEvolutionPeriodService,
}: PhotovoltaicImpactsProps): {
  economicImpacts: ReconversionProjectOnSiteIndirectEconomicImpact[];
  impactMetrics: ProjectOnSiteImpactMetric[];
} => {
  const economicImpacts: ReconversionProjectOnSiteIndirectEconomicImpact[] = [];
  const impactMetrics: ProjectOnSiteImpactMetric[] = [];

  if (!reconversionProject.developmentPlan.features.expectedAnnualProduction) {
    return { economicImpacts, impactMetrics };
  }

  const { economicImpacts: pvEconomicImpacts, impactMetrics: pvImpactMetrics } =
    getPhotovoltaicProductionRelatedImpacts({
      sumOnEvolutionPeriodService,
      expectedAnnualProduction:
        reconversionProject.developmentPlan.features.expectedAnnualProduction,
    });

  economicImpacts.push(...pvEconomicImpacts);
  impactMetrics.push(...pvImpactMetrics);

  const taxesImpact = getNewPhotovoltaicTaxesIncomeImpact({
    yearlyProjectedExpenses: reconversionProject.yearlyProjectedExpenses,
    sumOnEvolutionPeriodService,
  });
  if (taxesImpact) {
    economicImpacts.push(taxesImpact);
  }

  // ETP
  const operationsFullTimeJobs = computeDefaultPhotovoltaicOperationsFullTimeJobs(
    reconversionProject.developmentPlan.features.electricalPowerKWc,
  );
  if (operationsFullTimeJobs) {
    impactMetrics.push({
      name: "operationsFullTimeJobs",
      total: operationsFullTimeJobs,
    });
  }

  if (reconversionProject.conversionSchedule) {
    const conversionFullTimeJobs = computeDefaultPhotovoltaicConversionFullTimeJobs(
      reconversionProject.developmentPlan.features.electricalPowerKWc,
    );
    const conversionDurationInYears = roundTo2Digits(
      getDurationFromScheduleInYears(reconversionProject.conversionSchedule),
    );
    const conversionJobsSpreadOverEvaluationPeriod = spreadTemporaryFullTimeJobsOver({
      targetDurationInYears: sumOnEvolutionPeriodService.evaluationPeriodInYears,
      currentDurationInYears: conversionDurationInYears,
      temporaryFullTimeJobs: conversionFullTimeJobs,
    });

    if (conversionJobsSpreadOverEvaluationPeriod) {
      impactMetrics.push({
        name: "conversionFullTimeJobs",
        total: conversionJobsSpreadOverEvaluationPeriod,
      });
    }
  }

  return { economicImpacts, impactMetrics };
};
