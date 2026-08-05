import {
  sumListWithKey,
  GetReconversionProjectImpactsResultDto,
  ReconversionStakeholders,
  AggregatedReconversionIndirectEconomicImpactsDataView,
  AggregatedReconversionProjectOnSiteImpactItemView,
} from "shared";

import { filterByName } from "@/shared/core/filter-by-name/filterByName";

import { groupIndirectEconomicImpactsByBearer } from "./groupIndirectImpactsByBearer";

export type SocioEconomicImpactsByBearerListView = {
  total: number;
  humanity: { total: number; impacts: SocioEconomicImpactsDetailsByBearerListView[] };
  localPeopleOrCompany: { total: number; impacts: SocioEconomicImpactsDetailsByBearerListView[] };
  localAuthority: { total: number; impacts: SocioEconomicImpactsDetailsByBearerListView[] };
};

export type SocioEconomicMainImpactName = SocioEconomicImpactMainImpactKeyName;
export type SocioEconomicDetailsName = SocioEconomicImpactDetailsImpactKeyName;

export type SocioEconomicImpactImpactKeyName =
  | SocioEconomicImpactMainImpactKeyName
  | SocioEconomicImpactDetailsImpactKeyName;

type SocioEconomicImpactByListViewCategory = ReturnType<
  typeof groupSocioEconomicImpactsByListViewCategory
>;
export type SocioEconomicImpactMainImpactKeyName =
  SocioEconomicImpactByListViewCategory[number]["keyName"];

type SocioEconomicImpactDetailsImpactKeyName = Extract<
  SocioEconomicImpactByListViewCategory[number],
  {
    keyName:
      | "avoidedFricheMaintenanceAndSecuringCostsForOwner"
      | "avoidedFricheMaintenanceAndSecuringCostsForTenant"
      | "projectOperatingExpenses"
      | "projectOperatingRevenues"
      | "taxesIncome"
      | "avoidedCo2eqEmissions"
      | "ecosystemServices"
      | "avoidedTrafficAccidents";
  }
>["details"][number]["keyName"];

export type SocioEconomicImpactsDetailsByBearerListView =
  SocioEconomicImpactByListViewCategory[number];

const BEARER_NAME_RESOLVERS: Map<
  AggregatedReconversionIndirectEconomicImpactsDataView["details"][number]["name"],
  (s?: ReconversionStakeholders) => string
> = new Map([
  [
    "avoidedFricheMaintenanceAndSecuringCostsForOwner",
    (s?: ReconversionStakeholders) => s?.current.owner.structureName ?? "Actuel propriétaire",
  ],
  [
    "avoidedFricheMaintenanceAndSecuringCostsForTenant",
    (s?: ReconversionStakeholders) => s?.current.tenant?.structureName ?? "Actuel locataire",
  ],
  [
    "previousSiteOperationBenefitLoss",
    (s?: ReconversionStakeholders) => s?.current.operator?.structureName ?? "Ancien exploitant",
  ],
  [
    "projectedRentalIncome",
    (s?: ReconversionStakeholders) => s?.future.owner?.structureName ?? "Futur propriétaire",
  ],
  [
    "oldRentalIncomeLoss",
    (s?: ReconversionStakeholders) => s?.current.owner.structureName ?? "Actuel propriétaire",
  ],
  [
    "projectOperatingExpenses",
    (s?: ReconversionStakeholders) => s?.future.operator?.structureName ?? "Futur exploitant",
  ],
  [
    "projectOperatingRevenues",
    (s?: ReconversionStakeholders) => s?.future.operator?.structureName ?? "Futur exploitant",
  ],
]);

const getBearerName = (
  itemName: AggregatedReconversionIndirectEconomicImpactsDataView["details"][number]["name"],
  stakeholders?: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"],
): string | undefined => {
  const resolve = BEARER_NAME_RESOLVERS.get(itemName);
  return resolve ? resolve(stakeholders) : undefined;
};

function extractDetails<
  T extends AggregatedReconversionProjectOnSiteImpactItemView,
  G extends Extract<
    T["name"],
    | "avoidedFricheMaintenanceAndSecuringCostsForOwner"
    | "avoidedFricheMaintenanceAndSecuringCostsForTenant"
    | "projectOperatingExpenses"
    | "projectOperatingRevenues"
  >,
>(items: readonly T[], groupName: G, bearerName?: string) {
  const details = filterByName(items, groupName).map((item) => ({
    name: item.details as Extract<T, { name: G }>["details"],
    total: item.total,
    keyName: `${groupName}.${item.details}` as `${G}.${Extract<T, { name: G }>["details"]}`,
  }));

  return {
    total: sumListWithKey(details, "total"),
    details,
    keyName: groupName,
    bearerName: bearerName,
  };
}

function groupImpacts<
  T extends AggregatedReconversionProjectOnSiteImpactItemView,
  G extends string,
  N extends T["name"],
>(items: readonly T[], groupName: G, ...names: N[]) {
  const details = filterByName(items, ...names).map((item) => ({
    name: item.name,
    total: item.total,
    keyName: `${groupName}.${item.name}` as const,
  }));

  return {
    total: sumListWithKey(details, "total"),
    details,
    keyName: groupName,
  };
}

function formatImpacts(
  items: readonly AggregatedReconversionProjectOnSiteImpactItemView[],
  stakeholders?: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"],
) {
  return filterByName(
    items,
    "previousSiteOperationBenefitLoss",
    "oldRentalIncomeLoss",
    "projectedRentalIncome",
    "fricheRoadsAndUtilitiesExpenses",
    "waterRegulation",
    "avoidedAirConditioningExpenses",
    "avoidedPropertyDamageExpenses",
    "avoidedCarRelatedExpenses",
    "avoidedAirPollutionHealthExpenses",
    "travelTimeSavedPerTravelerExpenses",
    "propertyTransferDutiesIncome",
    "localPropertyValueIncrease",
    "localTransferDutiesIncrease",
  ).map((item) => ({
    name: item.name,
    total: item.total,
    keyName: item.name,
    bearerName: getBearerName(item.name, stakeholders),
  }));
}

export const groupSocioEconomicImpactsByListViewCategory = (
  indirectEconomicImpacts: AggregatedReconversionIndirectEconomicImpactsDataView["details"],
  stakeholders?: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"],
) => {
  return [
    extractDetails(
      indirectEconomicImpacts,
      "avoidedFricheMaintenanceAndSecuringCostsForOwner",
      getBearerName("avoidedFricheMaintenanceAndSecuringCostsForOwner", stakeholders),
    ),

    extractDetails(
      indirectEconomicImpacts,
      "avoidedFricheMaintenanceAndSecuringCostsForTenant",
      getBearerName("avoidedFricheMaintenanceAndSecuringCostsForTenant", stakeholders),
    ),

    extractDetails(
      indirectEconomicImpacts,
      "projectOperatingExpenses",
      getBearerName("projectOperatingExpenses", stakeholders),
    ),
    extractDetails(
      indirectEconomicImpacts,
      "projectOperatingRevenues",
      getBearerName("projectOperatingRevenues", stakeholders),
    ),

    groupImpacts(
      indirectEconomicImpacts,
      "taxesIncome",
      "projectNewHousesTaxesIncome",
      "projectNewCompanyTaxationIncome",
      "projectPhotovoltaicTaxesIncome",
    ),
    groupImpacts(
      indirectEconomicImpacts,
      "avoidedCo2eqEmissions",
      "avoidedCo2eqWithEnergyProduction",
      "avoidedAirConditioningCo2eqEmissions",
      "avoidedTrafficCo2EqEmissions",
    ),
    groupImpacts(
      indirectEconomicImpacts,
      "ecosystemServices",
      "newStoredCo2Eq",
      "natureRelatedWelnessAndLeisure",
      "forestRelatedProduct",
      "pollination",
      "invasiveSpeciesRegulation",
      "waterCycle",
      "nitrogenCycle",
      "soilErosion",
    ),
    groupImpacts(
      indirectEconomicImpacts,
      "avoidedTrafficAccidents",
      "avoidedAccidentsMinorInjuriesExpenses",
      "avoidedAccidentsSevereInjuriesExpenses",
      "avoidedAccidentsDeathsExpenses",
    ),
    ...formatImpacts(indirectEconomicImpacts, stakeholders),
  ].filter((item) => ("details" in item && item.details.length !== 0) || item.total !== 0);
};

export const getSocioEconomicProjectImpactsGroupedByCategory = (
  indirectEconomicImpacts?: AggregatedReconversionIndirectEconomicImpactsDataView,
  stakeholders?: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"],
): SocioEconomicImpactsByBearerListView => {
  if (!indirectEconomicImpacts || !stakeholders) {
    return {
      total: 0,
      humanity: { total: 0, impacts: [] },
      localAuthority: { total: 0, impacts: [] },
      localPeopleOrCompany: { total: 0, impacts: [] },
    };
  }

  const { humanity, localAuthority, localPeopleOrCompany } =
    groupIndirectEconomicImpactsByBearer<AggregatedReconversionProjectOnSiteImpactItemView>(
      indirectEconomicImpacts.details,
      stakeholders,
    );

  const humanityImpacts = groupSocioEconomicImpactsByListViewCategory(
    humanity.details,
    stakeholders,
  );

  const localPeopleOrCompanyImpacts = groupSocioEconomicImpactsByListViewCategory(
    localPeopleOrCompany.details,
    stakeholders,
  );

  const localAuthorityImpacts = groupSocioEconomicImpactsByListViewCategory(
    localAuthority.details,
    stakeholders,
  );

  return {
    total: indirectEconomicImpacts.total,
    humanity: {
      total: humanity.total,
      impacts: humanityImpacts,
    },
    localAuthority: {
      total: localAuthority.total,
      impacts: localAuthorityImpacts,
    },
    localPeopleOrCompany: {
      total: localPeopleOrCompany.total,
      impacts: localPeopleOrCompanyImpacts,
    },
  };
};
