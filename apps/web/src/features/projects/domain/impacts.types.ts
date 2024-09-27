import {
  FinancialAssistanceRevenue,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SoilType,
} from "shared";

export type FinancialAssistance = "local_or_regional_authority_participation" | "public_subsidies";
export type DevelopmentPlanInstallationExpense = {
  purpose: "technical_studies" | "installation_works" | "development_works" | "other";
  amount: number;
};

type ExpensesTotalAndDetails<TExpense> = {
  total: number;
  costs: TExpense[];
};

type BaseEconomicImpact = { actor: string; amount: number };
type RentalIncomeImpact = BaseEconomicImpact & {
  impact: "rental_income";
  impactCategory: "economic_direct";
};
export type AvoidedFricheExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_friche_costs";
  impactCategory: "economic_direct";
  details: {
    amount: number;
    impact:
      | "avoided_security_costs"
      | "avoided_illegal_dumping_costs"
      | "avoided_accidents_costs"
      | "avoided_other_securing_costs"
      | "avoided_maintenance_costs";
  }[];
};
type TaxesIncomeImpact = BaseEconomicImpact & {
  impact: "taxes_income";
  impactCategory: "economic_indirect";
  actor: "community";
};
type PropertyTransferDutiesIncomeImpact = BaseEconomicImpact & {
  impact: "property_transfer_duties_income";
  impactCategory: "economic_direct";
  actor: "community";
};

type AvoidedCarRelatedExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_car_related_expenses";
  impactCategory: "economic_indirect";
  actor: "local_workers" | "local_residents";
};

type AvoidedPropertyDamagesExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_property_damages_expenses";
  impactCategory: "economic_indirect";
  actor: "french_society";
};

type AvoidedAirConditioningExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_air_conditioning_expenses";
  impactCategory: "economic_indirect";
  actor: "local_companies" | "local_residents";
};

type TravelTimeSavedImpact = BaseEconomicImpact & {
  impact: "travel_time_saved";
  impactCategory: "social_monetary";
  actor: "local_workers" | "local_residents";
};

export type AvoidedTrafficAccidentsImpact = BaseEconomicImpact & {
  impact: "avoided_traffic_accidents";
  impactCategory: "social_monetary";
  actor: "french_society";
  details: {
    amount: number;
    impact:
      | "avoided_traffic_minor_injuries"
      | "avoided_traffic_severe_injuries"
      | "avoided_traffic_deaths";
  }[];
};

type AvoidedTrafficCO2EqEmissions = BaseEconomicImpact & {
  impact: "avoided_traffic_co2_eq_emissions";
  impactCategory: "environmental_monetary";
  actor: "human_society";
};

type AvoidedAirConditioningCO2EqEmissions = BaseEconomicImpact & {
  impact: "avoided_air_conditioning_co2_eq_emissions";
  impactCategory: "environmental_monetary";
  actor: "human_society";
};

export type AvoidedCO2EqWithEnRImpact = BaseEconomicImpact & {
  actor: "human_society";
  impactCategory: "environmental_monetary";
  impact: "avoided_co2_eq_with_enr";
};

type AvoidedAirPollutionImpact = BaseEconomicImpact & {
  actor: "human_society";
  impactCategory: "environmental_monetary";
  impact: "avoided_air_pollution";
};

type LocalHousingPropertyValueIncreaseImpact = BaseEconomicImpact & {
  impact: "local_property_value_increase";
  impactCategory: "economic_indirect";
  actor: "local_residents";
};

type LocalTransferDutiesIncreaseImpact = BaseEconomicImpact & {
  impact: "local_transfer_duties_increase";
  impactCategory: "economic_indirect";
  actor: "community";
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
  nonContaminatedSurfaceArea?: { current: number; forecast: number; difference: number };
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
      operationsCosts?: ExpensesTotalAndDetails<RecurringExpense>;
      developmentPlanInstallation?: ExpensesTotalAndDetails<DevelopmentPlanInstallationExpense>;
      siteReinstatement?: ExpensesTotalAndDetails<ReinstatementExpense>;
      sitePurchase?: number;
    };
    revenues: {
      total: number;
      siteResale?: number;
      operationsRevenues?: {
        bearer?: string;
        total: number;
        revenues: RecurringRevenue[];
      };
      financialAssistance?: {
        total: number;
        revenues: FinancialAssistanceRevenue[];
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
      | AvoidedFricheExpensesImpact
      | TaxesIncomeImpact
      | PropertyTransferDutiesIncomeImpact
      | EcosystemServicesImpact
      | AvoidedCO2EqWithEnRImpact
      | WaterRegulationImpact
      | AvoidedCarRelatedExpensesImpact
      | AvoidedPropertyDamagesExpensesImpact
      | AvoidedAirConditioningExpensesImpact
      | TravelTimeSavedImpact
      | AvoidedTrafficAccidentsImpact
      | AvoidedTrafficCO2EqEmissions
      | AvoidedAirConditioningCO2EqEmissions
      | AvoidedAirPollutionImpact
      | LocalHousingPropertyValueIncreaseImpact
      | LocalTransferDutiesIncreaseImpact
    )[];
  };
  avoidedVehiculeKilometers?: number;
  travelTimeSaved?: number;
  avoidedTrafficAccidents?: {
    total: number;
    minorInjuries: number;
    severeInjuries: number;
    deaths: number;
  };
  avoidedCarTrafficCo2EqEmissions?: number;
  avoidedAirConditioningCo2EqEmissions?: number;
};
