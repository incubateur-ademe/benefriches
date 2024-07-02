import { computeAvoidedCO2TonsWithEnergyProductionImpact } from "../avoided-CO2-with-energy-production/avoidedCO2WithEnergyProductionImpact";
import { computeHouseholdsPoweredByRenewableEnergyImpact } from "../households-powered-by-renewable-energy/householdsPoweredByRenewableEnergyImpact";
import { CO2eqMonetaryValueService } from "../services/CO2eqMonetaryValueService";

type AvoidedCO2EqWithEnRImpact = {
  amount: number;
  actor: "human_society";
  impactCategory: "environmental_monetary";
  impact: "avoided_co2_eq_with_enr";
};

export type PhotovoltaicSocioEconomicSpecificImpact = AvoidedCO2EqWithEnRImpact;

type Input = {
  evaluationPeriodInYears: number;
  operationsFirstYear: number;
  expectedAnnualProduction?: number;
};

export const getPhotovoltaicProjectSpecificImpacts = ({
  evaluationPeriodInYears,
  operationsFirstYear,
  expectedAnnualProduction,
}: Input) => {
  if (!expectedAnnualProduction) {
    return { socioeconomic: [] };
  }

  const avoidedCO2TonsWithEnergyProduction = computeAvoidedCO2TonsWithEnergyProductionImpact({
    forecastAnnualEnergyProductionMWh: expectedAnnualProduction,
  });

  const co2eqMonetaryValueService = new CO2eqMonetaryValueService();

  const socioeconomic = [
    {
      amount: co2eqMonetaryValueService.getAnnualizedCO2MonetaryValueForDuration(
        avoidedCO2TonsWithEnergyProduction.forecast,
        operationsFirstYear,
        evaluationPeriodInYears,
      ),
      impact: "avoided_co2_eq_with_enr",
      impactCategory: "environmental_monetary",
      actor: "human_society",
    },
  ] as PhotovoltaicSocioEconomicSpecificImpact[];

  const householdsPoweredByRenewableEnergy = computeHouseholdsPoweredByRenewableEnergyImpact({
    forecastRenewableEnergyAnnualProductionMWh: expectedAnnualProduction,
  });

  return {
    socioeconomic,
    avoidedCO2TonsWithEnergyProduction,
    householdsPoweredByRenewableEnergy,
  };
};
