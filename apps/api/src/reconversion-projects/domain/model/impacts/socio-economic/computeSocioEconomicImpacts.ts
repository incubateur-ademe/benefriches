import { SoilsDistribution } from "src/soils/domain/soils";
import { ReconversionProject } from "../../reconversionProject";
import {
  computeDirectAndIndirectEconomicImpacts,
  DirectAndIndirectEconomicImpact,
} from "./computeDirectAndIndirectEconomicImpacts";
import {
  computeEnvironmentalMonetaryImpacts,
  EnvironmentalMonetaryImpact,
} from "./computeEnvironmentalMonetaryImpacts";

type SocioEconomicImpactsInput = {
  evaluationPeriodInYears: number;
  currentOwner: string;
  currentOperator?: string;
  futureSiteOwner?: string;
  yearlyCurrentCosts: { purpose: string; amount: number }[];
  yearlyProjectedCosts: ReconversionProject["yearlyProjectedCosts"];
  propertyTransferDutiesAmount?: number;
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
  baseSoilsCarbonStorage: number;
  forecastSoilsCarbonStorage: number;
  operationsFirstYear: number;
  avoidedCO2TonsWithEnergyProduction?: number;
  decontaminatedSurface?: number;
};

type EconomicImpact = DirectAndIndirectEconomicImpact | EnvironmentalMonetaryImpact;

export type SocioEconomicImpactsResult = {
  impacts: EconomicImpact[];
  total: number;
};

export const computeSocioEconomicImpacts = (
  input: SocioEconomicImpactsInput,
): SocioEconomicImpactsResult => {
  const impacts = [
    ...computeDirectAndIndirectEconomicImpacts({
      evaluationPeriodInYears: input.evaluationPeriodInYears,
      currentOwner: input.currentOwner,
      currentOperator: input.currentOperator,
      futureSiteOwner: input.futureSiteOwner,
      yearlyCurrentCosts: input.yearlyCurrentCosts,
      yearlyProjectedCosts: input.yearlyProjectedCosts,
      propertyTransferDutiesAmount: input.propertyTransferDutiesAmount,
    }),
    ...computeEnvironmentalMonetaryImpacts({
      baseSoilsDistribution: input.baseSoilsDistribution,
      forecastSoilsDistribution: input.forecastSoilsDistribution,
      evaluationPeriodInYears: input.evaluationPeriodInYears,
      baseSoilsCarbonStorage: input.baseSoilsCarbonStorage,
      forecastSoilsCarbonStorage: input.forecastSoilsCarbonStorage,
      operationsFirstYear: input.operationsFirstYear,
      avoidedCO2TonsWithEnergyProduction: input.avoidedCO2TonsWithEnergyProduction,
      decontaminatedSurface: input.decontaminatedSurface,
    }),
  ] as EconomicImpact[];
  return {
    total: impacts.map(({ amount }) => amount).reduce((total, amount) => total + amount, 0),
    impacts,
  };
};
