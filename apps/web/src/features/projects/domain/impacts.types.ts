type PurposeCost = "rent" | "maintenance" | "taxes" | "other";
type SourceRevenue = "operations" | "other";

type BaseEconomicImpact = { actor: string; amount: number };
type RentalIncomeImpact = BaseEconomicImpact & {
  impact: "rental_income";
  impactCategory: "economic_direct";
};
type AvoidedFricheCostsImpact = BaseEconomicImpact & {
  impact: "avoided_friche_costs";
  impactCategory: "economic_direct";
};
type TaxesIncomeImpact = BaseEconomicImpact & {
  impact: "taxes_income";
  impactCategory: "economic_indirect";
  actor: "community";
};

export type ReconversionProjectImpacts = {
  permeableSurfaceArea: {
    base: number;
    forecast: number;
    difference: number;
    greenSoil: {
      base: number;
      forecast: number;
      difference: number;
    };
    mineralSoil: {
      base: number;
      forecast: number;
      difference: number;
    };
  };
  contaminatedSurfaceArea?: { base: number; forecast: number; difference: number };
  fullTimeJobs: {
    current: number;
    forecast: number;
    conversion: { current: number; forecast: number };
    operations: { current: number; forecast: number };
  };
  accidents?: {
    current: number;
    forecast: 0;
    severeInjuries: {
      current: number;
      forecast: 0;
    };
    minorInjuries: {
      current: number;
      forecast: 0;
    };
    deaths: {
      current: number;
      forecast: 0;
    };
  };
  economicBalance: {
    total: number;
    bearer?: string;
    costs: {
      total: number;
      operationsCosts: {
        total: number;
        expenses: { purpose: PurposeCost; amount: number }[];
      };
      siteReinstatement?: number;
      developmentPlanInstallation: number;
      realEstateTransaction?: number;
    };
    revenues: {
      total: number;
      operationsRevenues: {
        bearer?: string;
        total: number;
        revenues: { source: SourceRevenue; amount: number }[];
      };
      financialAssistance?: number;
    };
  };
  householdsPoweredByRenewableEnergy?: {
    current: 0;
    forecast: number;
  };
  avoidedCO2TonsWithEnergyProduction?: {
    current: 0;
    forecast: number;
  };
  socioeconomic: {
    impacts: (RentalIncomeImpact | AvoidedFricheCostsImpact | TaxesIncomeImpact)[];
  };
};
