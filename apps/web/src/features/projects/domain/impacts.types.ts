import { SoilType } from "shared";

export type SourceRevenue = "operations" | "other";
export type FinancialAssistance = "local_or_regional_authority_participation" | "public_subsidies";
export type DevelopmentPlanInstallationCost = {
  purpose: "technical_studies" | "installation_works" | "other";
  amount: number;
};
export type OperationsCost = {
  purpose: "rent" | "maintenance" | "taxes" | "other";
  amount: number;
};
export type ReinstatementCost = {
  purpose:
    | "asbestos_removal"
    | "sustainable_soils_reinstatement"
    | "deimpermeabilization"
    | "remediation"
    | "demolition"
    | "waste_collection";
  amount: number;
};

type CostsTotalAndDetails<TCost> = {
  total: number;
  costs: TCost[];
};

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
type PropertyTransferDutiesIncomeImpact = BaseEconomicImpact & {
  impact: "property_transfer_duties_income";
  impactCategory: "economic_indirect";
  actor: "community";
};

export type AvoidedCO2EqWithEnRImpact = BaseEconomicImpact & {
  actor: "human_society";
  impactCategory: "environmental_monetary";
  impact: "avoided_co2_eq_with_enr";
};

export type WaterRegulationImpact = BaseEconomicImpact & {
  actor: "community";
  impactCategory: "environmental_monetary";
  impact: "water_regulation";
};

export type EcosystemServicesImpact = BaseEconomicImpact & {
  impact: "ecosystem_services";
  impactCategory: "environmental_monetary";
  details: {
    amount: number;
    impact:
      | "nature_related_wellness_and_leisure"
      | "forest_related_product"
      | "pollination"
      | "invasive_species_regulation"
      | "water_cycle"
      | "nitrogen_cycle"
      | "soil_erosion"
      | "carbon_storage";
  }[];
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
  nonContaminatedSurfaceArea?: { current: number; forecast: number };
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
      operationsCosts?: CostsTotalAndDetails<OperationsCost>;
      developmentPlanInstallation?: CostsTotalAndDetails<DevelopmentPlanInstallationCost>;
      siteReinstatement?: CostsTotalAndDetails<ReinstatementCost>;
      realEstateTransaction?: number;
    };
    revenues: {
      total: number;
      operationsRevenues?: {
        bearer?: string;
        total: number;
        revenues: { source: SourceRevenue; amount: number }[];
      };
      financialAssistance?: {
        total: number;
        revenues: { source: FinancialAssistance; amount: number }[];
      };
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
  soilsCarbonStorage: {
    current: {
      total: number;
      soils: {
        type: SoilType;
        surfaceArea: number;
        carbonStorage: number;
      }[];
    };
    forecast: {
      total: number;
      soils: {
        type: SoilType;
        surfaceArea: number;
        carbonStorage: number;
      }[];
    };
  };
  socioeconomic: {
    total: number;
    impacts: (
      | RentalIncomeImpact
      | AvoidedFricheCostsImpact
      | TaxesIncomeImpact
      | PropertyTransferDutiesIncomeImpact
      | EcosystemServicesImpact
      | AvoidedCO2EqWithEnRImpact
      | WaterRegulationImpact
    )[];
  };
};
