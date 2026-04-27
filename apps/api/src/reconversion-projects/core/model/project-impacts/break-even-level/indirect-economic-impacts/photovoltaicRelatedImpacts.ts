import {
  DevelopmentPlanFeatures,
  Impact,
  IndirectEconomicImpact,
  RecurringExpense,
  sumList,
} from "shared";

import { SumOnEvolutionPeriodService } from "../../../sum-on-evolution-period/SumOnEvolutionPeriodService";
import { computeAvoidedCO2TonsWithEnergyProductionImpact } from "../../renewable-energy/avoided-CO2-with-energy-production/avoidedCO2WithEnergyProductionImpact";
import { computeHouseholdsPoweredByRenewableEnergyImpact } from "../../renewable-energy/households-powered-by-renewable-energy/householdsPoweredByRenewableEnergyImpact";
import {
  computeCumulativeByYear,
  InputReconversionProjectData,
} from "../projectIndirectEconomicImpacts";

const getPhotovoltaicProductionRelatedImpacts = (props: {
  expectedAnnualProduction: number;
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): {
  monetaryImpact: IndirectEconomicImpact;
  impactsMetrics: {
    avoidedCO2TonsWithEnergyProduction: number;
    householdsPoweredByRenewableEnergy: Impact;
  };
} => {
  const avoidedCO2TonsWithEnergyProduction = computeAvoidedCO2TonsWithEnergyProductionImpact({
    forecastAnnualEnergyProductionMWh: props.expectedAnnualProduction,
  });

  const avoidedCO2TonsWithEnergyProductionMonetaryValueDetailsByYear =
    props.sumOnEvolutionPeriodService.getWeightedYearlyValues(avoidedCO2TonsWithEnergyProduction, [
      "co2_value",
      "discount",
    ]);

  const householdsPoweredByRenewableEnergy = computeHouseholdsPoweredByRenewableEnergyImpact({
    forecastRenewableEnergyAnnualProductionMWh: props.expectedAnnualProduction,
  });

  return {
    impactsMetrics: {
      avoidedCO2TonsWithEnergyProduction,
      householdsPoweredByRenewableEnergy,
    },
    monetaryImpact: {
      detailsByYear: avoidedCO2TonsWithEnergyProductionMonetaryValueDetailsByYear,
      cumulativeByYear: computeCumulativeByYear(
        avoidedCO2TonsWithEnergyProductionMonetaryValueDetailsByYear,
      ),
      total: sumList(avoidedCO2TonsWithEnergyProductionMonetaryValueDetailsByYear),
      name: "avoidedCo2eqWithEnergyProduction",
    },
  };
};

const getNewPhotovoltaicTaxesIncomeImpact = ({
  yearlyProjectedExpenses,
  sumOnEvolutionPeriodService,
}: {
  yearlyProjectedExpenses: RecurringExpense[];
  sumOnEvolutionPeriodService: SumOnEvolutionPeriodService;
}): IndirectEconomicImpact | undefined => {
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
}: PhotovoltaicImpactsProps): IndirectEconomicImpact[] => {
  const impacts: IndirectEconomicImpact[] = [];

  if (!reconversionProject.developmentPlan.features.expectedAnnualProduction) {
    return impacts;
  }

  impacts.push(
    getPhotovoltaicProductionRelatedImpacts({
      sumOnEvolutionPeriodService,
      expectedAnnualProduction:
        reconversionProject.developmentPlan.features.expectedAnnualProduction,
    }).monetaryImpact,
  );

  const taxesImpact = getNewPhotovoltaicTaxesIncomeImpact({
    yearlyProjectedExpenses: reconversionProject.yearlyProjectedExpenses,
    sumOnEvolutionPeriodService,
  });
  if (taxesImpact) {
    impacts.push(taxesImpact);
  }

  return impacts;
};
