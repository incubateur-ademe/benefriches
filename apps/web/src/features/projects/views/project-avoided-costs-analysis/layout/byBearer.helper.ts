import {
  HumanityCategory,
  LocalAuthorityCategory,
  LocalPeopleOrCompanyCategory,
} from "@/features/projects/domain/groupIndirectImpactsByBearer";

export const FRICHE_COST_NAMES = [
  "fricheMaintenanceAndSecuringCostsForOwner",
  "fricheMaintenanceAndSecuringCostsForTenant",
] as const;

export const PROJECT_MUNICIPALITY_EXPENSE_NAMES = [
  "waterRegulation",
  "fricheRoadsAndUtilitiesExpenses",
  "avoidedRoadsAndUtilitiesConstructionExpenses",
  "avoidedRoadsAndUtilitiesMaintenanceExpenses",
] as const;

export const SITE_STATU_QUO_MUNICIPALITY_EXPENSE_NAMES = ["waterRegulation"] as const;

export const TAX_INCOME_NAMES = [
  "projectNewCompanyTaxationIncome",
  "projectNewHousesTaxesIncome",
  "projectPhotovoltaicTaxesIncome",
  "propertyTransferDutiesIncome",
  "localTransferDutiesIncrease",
] as const;

export const BUYING_POWER_NAMES = [
  "avoidedAirConditioningExpenses",
  "avoidedCarRelatedExpenses",
  "avoidedPropertyDamageExpenses",
  "travelTimeSavedPerTravelerExpenses",
] as const;

export const AVOIDED_HEALTH_EXPENSE_NAMES = [
  "avoidedAccidentsDeathsExpenses",
  "avoidedAccidentsMinorInjuriesExpenses",
  "avoidedAccidentsSevereInjuriesExpenses",
  "avoidedAirPollutionHealthExpenses",
] as const;

export const ECOSYSTEM_SERVICE_NAMES = [
  "forestRelatedProduct",
  "invasiveSpeciesRegulation",
  "natureRelatedWelnessAndLeisure",
  "nitrogenCycle",
  "pollination",
  "soilErosion",
  "storedCo2Eq",
  "waterCycle",
] as const;

export const ENVIRONMENTAL_ACTION_NAMES = [
  "avoidedAirConditioningCo2eqEmissions",
  "avoidedCo2eqWithEnergyProduction",
  "avoidedTrafficCo2EqEmissions",
  ...ECOSYSTEM_SERVICE_NAMES,
] as const;

export const extractByName = (
  list: {
    name: LocalPeopleOrCompanyCategory | HumanityCategory | LocalAuthorityCategory;
    amount: number;
  }[],
  extract: readonly (LocalPeopleOrCompanyCategory | HumanityCategory | LocalAuthorityCategory)[],
) => {
  return list.filter(({ name }) => extract.includes(name));
};
