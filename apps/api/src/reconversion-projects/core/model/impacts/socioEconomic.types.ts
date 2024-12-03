export type SocioEconomicImpact =
  | DirectAndIndirectEconomicImpact
  | EnvironmentalMonetaryImpact
  | AvoidedCarRelatedExpensesImpact
  | AvoidedAirConditioningExpensesImpact
  | TravelTimeSavedImpact
  | AvoidedTrafficAccidentsImpact
  | AvoidedTrafficCO2EqEmissions
  | AvoidedAirConditioningCO2EqEmissions
  | AvoidedAirPollutionImpact
  | AvoidedCO2EqWithEnRImpact
  | LocalHousingPropertyValueIncreaseImpact
  | LocalTransferDutiesIncreaseImpact;

type BaseEconomicImpact = { actor: string; amount: number };

type RentalIncomeImpact = BaseEconomicImpact & {
  impact: "rental_income";
  impactCategory: "economic_direct";
};
type AvoidedFricheCostsImpact = BaseEconomicImpact & {
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

export type DirectAndIndirectEconomicImpact =
  | RentalIncomeImpact
  | AvoidedFricheCostsImpact
  | TaxesIncomeImpact
  | PropertyTransferDutiesIncomeImpact;

type AvoidedCarRelatedExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_car_related_expenses";
  impactCategory: "economic_indirect";
  actor: "local_residents";
};

type AvoidedAirConditioningExpensesImpact = BaseEconomicImpact & {
  impact: "avoided_air_conditioning_expenses";
  impactCategory: "economic_indirect";
  actor: "local_residents";
};

type TravelTimeSavedImpact = BaseEconomicImpact & {
  impact: "travel_time_saved";
  impactCategory: "economic_indirect";
  actor: "local_residents" | "local_workers";
};

type AvoidedTrafficAccidentsImpact = BaseEconomicImpact & {
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

export type EnvironmentalMonetaryImpact = EcosystemServicesImpact | WaterRegulationImpact;

type WaterRegulationImpact = {
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
      | "carbon_storage";
  }[];
};

type AvoidedCO2EqWithEnRImpact = {
  amount: number;
  actor: "human_society";
  impactCategory: "environmental_monetary";
  impact: "avoided_co2_eq_with_enr";
};
