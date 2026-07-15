import {
  GetReconversionProjectImpactsResultDto,
  ProjectIndirectImpactItemView,
  IndirectEconomicImpactName,
  LOCAL_AUTHORITIES,
  ProjectOperatingEconomicBalanceItem,
  SiteStatuQuoEconomicImpact,
} from "shared";

type Bearer = "local_authority" | "local_people_or_company" | "humanity";
const isLocalAuthority = (structureType?: string) =>
  structureType === "local_authority" || LOCAL_AUTHORITIES.some((item) => item === structureType);

type StakeholderRelatedCategory =
  // Project related impacts
  | "projectOperatingEconomicBalance"
  | Extract<
      IndirectEconomicImpactName,
      | "avoidedFricheMaintenanceAndSecuringCostsForTenant"
      | "avoidedFricheMaintenanceAndSecuringCostsForOwner"
      | "oldRentalIncomeLoss"
      | "projectedRentalIncome"
      | "previousSiteOperationBenefitLoss"
    >
  // Site statu quo impacts
  | "operatingEconomicBalance"
  | Extract<
      SiteStatuQuoEconomicImpact["name"],
      | "rentalIncome"
      | "fricheMaintenanceAndSecuringCostsForTenant"
      | "fricheMaintenanceAndSecuringCostsForOwner"
    >;

export type LocalAuthorityCategory =
  | StakeholderRelatedCategory
  // Site statu quo impacts
  | Extract<SiteStatuQuoEconomicImpact["name"], "taxesIncome">
  | Extract<
      IndirectEconomicImpactName,
      // Project related impacts
      | "propertyTransferDutiesIncome"
      | "localTransferDutiesIncrease"
      | "projectNewHousesTaxesIncome"
      | "projectNewCompanyTaxationIncome"
      | "projectPhotovoltaicTaxesIncome"
      | "avoidedRoadsAndUtilitiesMaintenanceExpenses"
      | "avoidedRoadsAndUtilitiesConstructionExpenses"
      // Statu quo or project related impacts
      | "fricheRoadsAndUtilitiesExpenses"
      | "waterRegulation"
    >;

export type LocalPeopleOrCompanyCategory =
  | StakeholderRelatedCategory
  // Project only
  | Extract<
      IndirectEconomicImpactName,
      | "localPropertyValueIncrease"
      | "avoidedCarRelatedExpenses"
      | "travelTimeSavedPerTravelerExpenses"
      | "avoidedPropertyDamageExpenses"
      | "avoidedAirConditioningExpenses"
    >;

export type HumanityCategory = Extract<
  IndirectEconomicImpactName,
  // project related only
  | "avoidedCo2eqWithEnergyProduction"
  | "avoidedAirConditioningCo2eqEmissions"
  | "avoidedTrafficCo2EqEmissions"
  | "avoidedAirPollutionHealthExpenses"
  | "avoidedAccidentsMinorInjuriesExpenses"
  | "avoidedAccidentsSevereInjuriesExpenses"
  | "avoidedAccidentsDeathsExpenses"
  // statu quo or project related impacts
  | "storedCo2Eq"
  | "newStoredCo2Eq"
  | "natureRelatedWelnessAndLeisure"
  | "forestRelatedProduct"
  | "pollination"
  | "invasiveSpeciesRegulation"
  | "waterCycle"
  | "nitrogenCycle"
  | "soilErosion"
>;

export const getBearerForImpact = (
  name: LocalAuthorityCategory | HumanityCategory | LocalPeopleOrCompanyCategory,
  stakeholders: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"],
): Bearer => {
  switch (name) {
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
    case "oldRentalIncomeLoss":
    case "projectedRentalIncome":
    case "fricheMaintenanceAndSecuringCostsForOwner":
    case "rentalIncome":
      return isLocalAuthority(stakeholders.current.owner?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
    case "fricheMaintenanceAndSecuringCostsForTenant":
      return isLocalAuthority(stakeholders.current.tenant?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "previousSiteOperationBenefitLoss":
    case "operatingEconomicBalance":
      return isLocalAuthority(stakeholders.current.operator?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "projectOperatingEconomicBalance":
      return isLocalAuthority(stakeholders.project.developer?.structureType)
        ? "local_authority"
        : "local_people_or_company";

    case "propertyTransferDutiesIncome":
    case "localTransferDutiesIncrease":
    case "waterRegulation":
    case "projectNewHousesTaxesIncome":
    case "projectNewCompanyTaxationIncome":
    case "projectPhotovoltaicTaxesIncome":
    case "fricheRoadsAndUtilitiesExpenses":
    case "avoidedRoadsAndUtilitiesConstructionExpenses":
    case "avoidedRoadsAndUtilitiesMaintenanceExpenses":
    case "taxesIncome":
      return "local_authority";

    case "localPropertyValueIncrease":
    case "avoidedCarRelatedExpenses":
    case "travelTimeSavedPerTravelerExpenses":
    case "avoidedPropertyDamageExpenses":
    case "avoidedAirConditioningExpenses":
      return "local_people_or_company";

    case "avoidedCo2eqWithEnergyProduction":
    case "avoidedAirConditioningCo2eqEmissions":
    case "avoidedTrafficCo2EqEmissions":
    case "newStoredCo2Eq":
    case "storedCo2Eq":
    case "natureRelatedWelnessAndLeisure":
    case "forestRelatedProduct":
    case "pollination":
    case "invasiveSpeciesRegulation":
    case "waterCycle":
    case "nitrogenCycle":
    case "soilErosion":
    case "avoidedAirPollutionHealthExpenses":
    case "avoidedAccidentsMinorInjuriesExpenses":
    case "avoidedAccidentsSevereInjuriesExpenses":
    case "avoidedAccidentsDeathsExpenses":
      return "humanity";
  }
};

export type IndirectEconomicImpactsByBearer = {
  local_authority: { total: number; details: { name: LocalAuthorityCategory; amount: number }[] };
  local_people_or_company: {
    total: number;
    details: {
      name: LocalPeopleOrCompanyCategory;
      amount: number;
    }[];
  };
  humanity: {
    total: number;
    details: {
      name: HumanityCategory;
      amount: number;
    }[];
  };
};

const EMPTY_BEARER_STATE: IndirectEconomicImpactsByBearer = {
  local_authority: { total: 0, details: [] },
  local_people_or_company: { total: 0, details: [] },
  humanity: { total: 0, details: [] },
};
export const groupIndirectEconomicImpactsByBearer = (
  indirectEconomicImpacts: (
    | ProjectIndirectImpactItemView
    | ProjectOperatingEconomicBalanceItem
    | SiteStatuQuoEconomicImpact
  )[],
  stakeholders: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"],
): IndirectEconomicImpactsByBearer => {
  return indirectEconomicImpacts.reduce<IndirectEconomicImpactsByBearer>(
    (result, { name, total }) => {
      const bearer = getBearerForImpact(name, stakeholders);
      return {
        ...result,
        [bearer]: {
          details: [...result[bearer].details, { amount: total, name }],
          total: result[bearer].total + total,
        },
      };
    },
    structuredClone(EMPTY_BEARER_STATE),
  );
};
