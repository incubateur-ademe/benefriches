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
  currentTenant?: string;
  futureSiteOwner?: string;
  yearlyCurrentCosts: { purpose: string; amount: number }[];
  yearlyProjectedCosts: ReconversionProject["yearlyProjectedCosts"];
  propertyTransferDutiesAmount?: number;
  baseSoilsDistribution: SoilsDistribution;
  forecastSoilsDistribution: SoilsDistribution;
  baseSoilsCarbonStorage: number;
  forecastSoilsCarbonStorage: number;
  operationsFirstYear: number;
};

type EconomicImpact = DirectAndIndirectEconomicImpact | EnvironmentalMonetaryImpact;

export type SocioEconomicImpactsResult = {
  impacts: EconomicImpact[];
};

export const computeSocioEconomicImpacts = (
  input: SocioEconomicImpactsInput,
): SocioEconomicImpactsResult => {
  return {
    impacts: [
      ...computeDirectAndIndirectEconomicImpacts({
        evaluationPeriodInYears: input.evaluationPeriodInYears,
        currentOwner: input.currentOwner,
        currentTenant: input.currentTenant,
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
      }),
    ] as EconomicImpact[],
  };
};
