import {
  sumListWithKey,
  GetReconversionProjectImpactsResultDto,
  IndirectEconomicImpactName,
  typedObjectEntries,
  ReconversionStakeholders,
  AggregatedReconversionIndirectEconomicImpactsDataView,
  AggregatedReconversionProjectOnSiteImpactItemView,
  RecurringExpensePurpose,
  RecurringRevenue,
  AvoidedFricheCostsIndirectEconomicImpactItemView,
} from "shared";

import { groupIndirectEconomicImpactsByBearer } from "./groupIndirectImpactsByBearer";

export type SocioEconomicImpactsByBearerListView = {
  total: number;
  humanity: { total: number; impacts: SocioEconomicImpactsDetailsByBearerListView[] };
  localPeopleOrCompany: { total: number; impacts: SocioEconomicImpactsDetailsByBearerListView[] };
  localAuthority: { total: number; impacts: SocioEconomicImpactsDetailsByBearerListView[] };
};

const simpleSocioEconomicImpactNames = [
  "previousSiteOperationBenefitLoss",
  "projectedRentalIncome",
  "oldRentalIncomeLoss",
  "avoidedPropertyDamageExpenses",
  "avoidedCarRelatedExpenses",
  "avoidedAirConditioningExpenses",
  "travelTimeSavedPerTravelerExpenses",
  "localPropertyValueIncrease",
  "propertyTransferDutiesIncome",
  "localTransferDutiesIncrease",
  "waterRegulation",
  "fricheRoadsAndUtilitiesExpenses",
  "avoidedAirPollutionHealthExpenses",
] as const satisfies IndirectEconomicImpactName[];

type SimpleSocioEconomicImpactName = (typeof simpleSocioEconomicImpactNames)[number];

export type WithDetailsSocioEconomicImpactName =
  | "avoidedFricheMaintenanceAndSecuringCostsForOwner"
  | "avoidedFricheMaintenanceAndSecuringCostsForTenant"
  | "taxesIncome"
  | "ecosystemServices"
  | "avoidedCo2eqEmissions"
  | "avoidedTrafficAccidents"
  | "projectOperatingRevenues"
  | "projectOperatingExpenses";

export type SocioEconomicImpactListViewGroupName =
  | WithDetailsSocioEconomicImpactName
  | SimpleSocioEconomicImpactName;

export type SocioEconomicMainImpactName = SocioEconomicImpactListViewGroupName;
export type SocioEconomicDetailsName = SocioEconomicImpactListViewDetailsName;

type SocioEconomicImpactListViewDetailsName =
  | `projectOperatingRevenues.${RecurringRevenue["source"]}`
  | `projectOperatingExpenses.${RecurringExpensePurpose}`
  | `${AvoidedFricheCostsIndirectEconomicImpactItemView["name"]}.${AvoidedFricheCostsIndirectEconomicImpactItemView["details"]}`
  | "projectNewHousesTaxesIncome"
  | "projectNewCompanyTaxationIncome"
  | "projectPhotovoltaicTaxesIncome"
  | "newStoredCo2Eq"
  | "natureRelatedWelnessAndLeisure"
  | "forestRelatedProduct"
  | "pollination"
  | "invasiveSpeciesRegulation"
  | "waterCycle"
  | "nitrogenCycle"
  | "soilErosion"
  | "avoidedCo2eqWithEnergyProduction"
  | "avoidedAirConditioningCo2eqEmissions"
  | "avoidedTrafficCo2EqEmissions"
  | "avoidedAccidentsMinorInjuriesExpenses"
  | "avoidedAccidentsSevereInjuriesExpenses"
  | "avoidedAccidentsDeathsExpenses";

export type SocioEconomicImpactsDetailsByBearerListView = {
  name: SocioEconomicImpactListViewGroupName;
  amount: number;
  bearerName?: string;
  details?: {
    name: SocioEconomicImpactListViewDetailsName;
    amount: number;
  }[];
};

const BEARER_NAME_RESOLVERS: Map<
  SocioEconomicImpactListViewGroupName,
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
  itemName: SocioEconomicImpactListViewGroupName,
  stakeholders?: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"],
): string | undefined => {
  const resolve = BEARER_NAME_RESOLVERS.get(itemName);
  return resolve ? resolve(stakeholders) : undefined;
};

export const groupByListViewCategory = (
  indirectEconomicImpacts: AggregatedReconversionProjectOnSiteImpactItemView[],
) => {
  return Object.groupBy(indirectEconomicImpacts, ({ name, total }) => {
    switch (name) {
      case "projectNewHousesTaxesIncome":
      case "projectNewCompanyTaxationIncome":
      case "projectPhotovoltaicTaxesIncome":
        return "taxesIncome";

      case "avoidedCo2eqWithEnergyProduction":
      case "avoidedAirConditioningCo2eqEmissions":
      case "avoidedTrafficCo2EqEmissions":
        return "avoidedCo2eqEmissions";

      case "newStoredCo2Eq":
      case "natureRelatedWelnessAndLeisure":
      case "forestRelatedProduct":
      case "pollination":
      case "invasiveSpeciesRegulation":
      case "waterCycle":
      case "nitrogenCycle":
      case "soilErosion":
        return "ecosystemServices";

      case "avoidedAccidentsMinorInjuriesExpenses":
      case "avoidedAccidentsSevereInjuriesExpenses":
      case "avoidedAccidentsDeathsExpenses":
        return "avoidedTrafficAccidents";

      case "projectOperatingEconomicBalance":
        return total > 0 ? "projectOperatingRevenues" : "projectOperatingExpenses";

      default:
        return name;
    }
  });
};

const formatAsListViewArray = (
  indirectEconomicImpacts: AggregatedReconversionProjectOnSiteImpactItemView[],
  stakeholders?: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"],
) => {
  return typedObjectEntries(groupByListViewCategory(indirectEconomicImpacts)).reduce<
    SocioEconomicImpactsDetailsByBearerListView[]
  >((result, [groupName, impacts]) => {
    if (impacts?.length === 1) {
      const [impact] = impacts;
      if (simpleSocioEconomicImpactNames.some((e) => e === impact?.name)) {
        return result.concat({
          name: groupName,
          amount: sumListWithKey(impacts ?? [], "total"),
          bearerName: getBearerName(groupName, stakeholders),
        });
      }
    }

    return result.concat({
      name: groupName,
      amount: sumListWithKey(impacts ?? [], "total"),
      bearerName: getBearerName(groupName, stakeholders),
      details: impacts?.map((item) => ({
        amount: item.total,
        name:
          item.name === "avoidedFricheMaintenanceAndSecuringCostsForOwner" ||
          item.name === "avoidedFricheMaintenanceAndSecuringCostsForTenant" ||
          item.name === "projectOperatingEconomicBalance"
            ? `${groupName}.${item.details}`
            : item.name,
      })),
    } as SocioEconomicImpactsDetailsByBearerListView);
  }, []);
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

  const humanityImpacts: SocioEconomicImpactsDetailsByBearerListView[] = formatAsListViewArray(
    humanity.details,
    stakeholders,
  );

  const localPeopleOrCompanyImpacts: SocioEconomicImpactsDetailsByBearerListView[] =
    formatAsListViewArray(localPeopleOrCompany.details, stakeholders);

  const localAuthorityImpacts: SocioEconomicImpactsDetailsByBearerListView[] =
    formatAsListViewArray(localAuthority.details, stakeholders);

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
