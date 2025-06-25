import {
  LocalTransferDutiesIncreaseImpact,
  ReconversionProjectImpacts,
  AvoidedCarRelatedExpensesImpact,
  AvoidedAirConditioningExpensesImpact,
  TravelTimeSavedImpact,
  AvoidedTrafficAccidentsImpact,
  AvoidedAirPollutionImpact,
  AvoidedPropertyDamagesExpensesImpact,
  AvoidedCO2EqEmissions,
  RentalIncomeImpact,
  AvoidedFricheCostsImpact,
  PropertyTransferDutiesIncomeImpact,
  SiteOperationBenefitsLoss,
  LocalHousingPropertyValueIncreaseImpact,
  EcosystemServicesImpact,
  WaterRegulationImpact,
} from "../reconversion-project-impacts";
import { SiteFricheCostsImpact } from "../site";

type ComparisonRentalIncomeImpact = RentalIncomeImpact & {
  details: {
    impact: "project_rental_income" | "site_statu_quo_rental_income";
    amount: number;
  }[];
};

type ComparisonTaxesIncomesImpact = {
  amount: number;
  impact: "taxes_income";
  impactCategory: "economic_indirect";
  actor: "community";
  details: {
    impact:
      | "project_new_houses_taxes_income"
      | "project_new_company_taxation_income"
      | "project_photovoltaic_taxes_income"
      | "site_statu_quo_taxes"
      | "site_statu_quo_property_taxes"
      | "site_statu_quo_operation_taxes";
    amount: number;
  }[];
};

type ComparisonSiteFricheCostsImpact = {
  amount: number;
  impact: "statu_quo_friche_costs";
  impactCategory: "economic_direct";
  actor: string;
  details: SiteFricheCostsImpact["details"];
};

export type ComparisonRoadAndUtilitiesConstructionImpact = {
  amount: number;
  impact:
    | "avoided_roads_and_utilities_construction_expenses"
    | "roads_and_utilities_construction_expenses";
  impactCategory: "economic_direct";
  actor: string;
};

export type ComparisonRoadAndUtilitiesMaintenanceImpact = {
  amount: number;
  impact:
    | "avoided_roads_and_utilities_maintenance_expenses"
    | "roads_and_utilities_maintenance_expenses";
  impactCategory: "economic_indirect";
  actor: "community";
};

type UrbanSprawlComparisonSocioEconomicImpacts =
  // merged impacts
  | ComparisonRentalIncomeImpact
  | ComparisonTaxesIncomesImpact
  | WaterRegulationImpact
  | EcosystemServicesImpact
  // project impacts
  | AvoidedFricheCostsImpact
  | PropertyTransferDutiesIncomeImpact
  | AvoidedCarRelatedExpensesImpact
  | AvoidedAirConditioningExpensesImpact
  | SiteOperationBenefitsLoss
  | TravelTimeSavedImpact
  | AvoidedCO2EqEmissions
  | AvoidedTrafficAccidentsImpact
  | AvoidedAirPollutionImpact
  | AvoidedPropertyDamagesExpensesImpact
  | LocalHousingPropertyValueIncreaseImpact
  | LocalTransferDutiesIncreaseImpact
  // comparison specific impacts
  | ComparisonSiteFricheCostsImpact
  | ComparisonRoadAndUtilitiesConstructionImpact
  | ComparisonRoadAndUtilitiesMaintenanceImpact;

export type UrbanSprawlComparisonImpacts = {
  economicBalance: ReconversionProjectImpacts["economicBalance"];
  socioeconomic: {
    impacts: UrbanSprawlComparisonSocioEconomicImpacts[];
    total: number;
  };
  social: ReconversionProjectImpacts["social"];
  environmental: ReconversionProjectImpacts["environmental"];
};
