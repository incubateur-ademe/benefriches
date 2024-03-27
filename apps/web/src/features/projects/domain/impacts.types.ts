import { SoilType } from "@/shared/domain/soils";

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
type PropertyTransferDutiesIncomeImpact = BaseEconomicImpact & {
  impact: "property_transfer_duties_income";
  impactCategory: "economic_indirect";
  actor: "community";
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
      | "soil_erosion";
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
    impacts: (
      | RentalIncomeImpact
      | AvoidedFricheCostsImpact
      | TaxesIncomeImpact
      | PropertyTransferDutiesIncomeImpact
      | EcosystemServicesImpact
    )[];
  };
};
