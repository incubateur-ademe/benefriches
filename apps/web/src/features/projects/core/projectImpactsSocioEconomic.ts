import {
  GetReconversionProjectImpactsResultDto,
  ReconversionStakeholders,
  AggregatedReconversionIndirectEconomicImpactsDataView,
  AggregatedReconversionProjectOnSiteImpactItemView,
} from "shared";

import { filterByName } from "@/shared/core/filter-by-name/filterByName";

import { extractDetailsGroup } from "./group-impacts/extractDetailsGroup";
import { filterNonEmptyImpacts } from "./group-impacts/filterNonEmpty";
import { groupImpactsByName } from "./group-impacts/groupImpactsByName";
import { groupIndirectEconomicImpactsByBearer } from "./groupIndirectImpactsByBearer";

export type SocioEconomicImpactsByBearerListView = {
  total: number;
  humanity: { total: number; impacts: SocioEconomicImpactsDetailsByBearerListView[] };
  localPeopleOrCompany: { total: number; impacts: SocioEconomicImpactsDetailsByBearerListView[] };
  localAuthority: { total: number; impacts: SocioEconomicImpactsDetailsByBearerListView[] };
};

type SocioEconomicImpactByListViewCategory = ReturnType<
  typeof groupSocioEconomicImpactsByListViewCategory
>;

export type SocioEconomicImpactMainImpactKeyName =
  SocioEconomicImpactByListViewCategory[number]["keyName"];

export type SocioEconomicImpactDetailsImpactKeyName = Extract<
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

export type SocioEconomicImpactImpactKeyName =
  | SocioEconomicImpactMainImpactKeyName
  | SocioEconomicImpactDetailsImpactKeyName;

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
  return filterNonEmptyImpacts([
    extractDetailsGroup(
      indirectEconomicImpacts,
      "avoidedFricheMaintenanceAndSecuringCostsForOwner",
      {
        bearerName: getBearerName("avoidedFricheMaintenanceAndSecuringCostsForOwner", stakeholders),
      },
    ),
    extractDetailsGroup(
      indirectEconomicImpacts,
      "avoidedFricheMaintenanceAndSecuringCostsForTenant",
      {
        bearerName: getBearerName(
          "avoidedFricheMaintenanceAndSecuringCostsForTenant",
          stakeholders,
        ),
      },
    ),
    extractDetailsGroup(indirectEconomicImpacts, "projectOperatingExpenses", {
      bearerName: getBearerName("projectOperatingExpenses", stakeholders),
    }),
    extractDetailsGroup(indirectEconomicImpacts, "projectOperatingRevenues", {
      bearerName: getBearerName("projectOperatingRevenues", stakeholders),
    }),
    groupImpactsByName(
      indirectEconomicImpacts,
      "taxesIncome",
      "projectNewHousesTaxesIncome",
      "projectNewCompanyTaxationIncome",
      "projectPhotovoltaicTaxesIncome",
    ),
    groupImpactsByName(
      indirectEconomicImpacts,
      "avoidedCo2eqEmissions",
      "avoidedCo2eqWithEnergyProduction",
      "avoidedAirConditioningCo2eqEmissions",
      "avoidedTrafficCo2EqEmissions",
    ),
    groupImpactsByName(
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
    groupImpactsByName(
      indirectEconomicImpacts,
      "avoidedTrafficAccidents",
      "avoidedAccidentsMinorInjuriesExpenses",
      "avoidedAccidentsSevereInjuriesExpenses",
      "avoidedAccidentsDeathsExpenses",
    ),
    ...formatImpacts(indirectEconomicImpacts, stakeholders),
  ]);
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

  return {
    total: indirectEconomicImpacts.total,
    humanity: {
      total: humanity.total,
      impacts: groupSocioEconomicImpactsByListViewCategory(humanity.details, stakeholders),
    },
    localAuthority: {
      total: localAuthority.total,
      impacts: groupSocioEconomicImpactsByListViewCategory(localAuthority.details, stakeholders),
    },
    localPeopleOrCompany: {
      total: localPeopleOrCompany.total,
      impacts: groupSocioEconomicImpactsByListViewCategory(
        localPeopleOrCompany.details,
        stakeholders,
      ),
    },
  };
};
