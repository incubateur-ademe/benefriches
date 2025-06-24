export type SocioEconomicImpact =
  | DirectAndIndirectEconomicImpact
  | EnvironmentalMonetaryImpact
  | AvoidedCarRelatedExpensesImpact
  | AvoidedAirConditioningExpensesImpact
  | TravelTimeSavedImpact
  | AvoidedTrafficAccidentsImpact
  | AvoidedAirPollutionImpact
  | AvoidedPropertyDamagesExpensesImpact
  | AvoidedCO2EqEmissions
  | LocalHousingPropertyValueIncreaseImpact
  | LocalTransferDutiesIncreaseImpact;

type BaseEconomicImpact = { actor: string; amount: number };

/* ECONOMIC DIRECT */
type RentalIncomeImpact = BaseEconomicImpact & {
  impact: "rental_income";
  impactCategory: "economic_direct";
};
export type AvoidedFricheCostsImpact = BaseEconomicImpact & {
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

/* ECONOMIC INDIRECT */
export type TaxesIncomeImpact = BaseEconomicImpact & {
  impact: "taxes_income";
  impactCategory: "economic_indirect";
  actor: "community";
  details: {
    impact:
      | "project_new_houses_taxes_income"
      | "project_new_company_taxation_income"
      | "project_photovoltaic_taxes_income";
    amount: number;
  }[];
};
type PropertyTransferDutiesIncomeImpact = BaseEconomicImpact & {
  impact: "property_transfer_duties_income";
  impactCategory: "economic_direct";
  actor: "community";
};
export type AvoidedCarRelatedExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_car_related_expenses";
  impactCategory: "economic_indirect";
  actor: "local_people";
};

export type AvoidedAirConditioningExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_air_conditioning_expenses";
  impactCategory: "economic_indirect";
  actor: "local_people" | "local_companies";
};

type RoadsAndUtilitiesMaintenanceExpensesImpact = BaseEconomicImpact & {
  impact: "roads_and_utilities_maintenance_expenses";
  impactCategory: "economic_direct";
  actor: "community";
};

export type SiteOperationBenefitsLoss = BaseEconomicImpact & {
  impact: "site_operation_benefits_loss";
  impactCategory: "economic_indirect";
};

export type DirectAndIndirectEconomicImpact =
  | RentalIncomeImpact
  | AvoidedFricheCostsImpact
  | TaxesIncomeImpact
  | PropertyTransferDutiesIncomeImpact
  | AvoidedCarRelatedExpensesImpact
  | AvoidedAirConditioningExpensesImpact
  | RoadsAndUtilitiesMaintenanceExpensesImpact
  | SiteOperationBenefitsLoss;

export type TravelTimeSavedImpact = BaseEconomicImpact & {
  impact: "travel_time_saved";
  impactCategory: "social_monetary";
  actor: "local_people";
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

export type AvoidedCO2EqEmissions = BaseEconomicImpact & {
  impact: "avoided_co2_eq_emissions";
  impactCategory: "environmental_monetary";
  actor: "human_society";
  details: {
    amount: number;
    impact:
      | "avoided_co2_eq_with_enr"
      | "avoided_traffic_co2_eq_emissions"
      | "avoided_air_conditioning_co2_eq_emissions";
  }[];
};

export type AvoidedPropertyDamagesExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_property_damages_expenses";
  impactCategory: "economic_indirect";
  actor: "french_society";
};

export type AvoidedAirPollutionImpact = BaseEconomicImpact & {
  actor: "french_society";
  impactCategory: "social_monetary";
  impact: "avoided_air_pollution";
};

export type LocalHousingPropertyValueIncreaseImpact = BaseEconomicImpact & {
  impact: "local_property_value_increase";
  impactCategory: "economic_indirect";
  actor: "local_people";
};

export type LocalTransferDutiesIncreaseImpact = BaseEconomicImpact & {
  impact: "local_transfer_duties_increase";
  impactCategory: "economic_indirect";
  actor: "community";
};

export type EnvironmentalMonetaryImpact = EcosystemServicesImpact | WaterRegulationImpact;

export type WaterRegulationImpact = {
  amount: number;
  actor: "community";
  impactCategory: "environmental_monetary";
  impact: "water_regulation";
};
export type EcosystemServicesImpact = {
  amount: number;
  actor: "human_society";
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
      | "soils_co2_eq_storage";
  }[];
};
