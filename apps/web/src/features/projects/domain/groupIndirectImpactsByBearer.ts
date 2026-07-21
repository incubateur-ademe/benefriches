import {
  GetReconversionProjectImpactsResultDto,
  LOCAL_AUTHORITIES,
  SiteStatuQuoEconomicImpact,
  sumListWithKey,
  UrbanSprawlComparisonIndirectEconomicImpactItemView,
  AggregatedReconversionProjectOnSiteImpactItemView,
} from "shared";

const isLocalAuthority = (structureType?: string) =>
  structureType === "localAuthority" || LOCAL_AUTHORITIES.some((item) => item === structureType);

export type IndirectEconomicImpactItem =
  | AggregatedReconversionProjectOnSiteImpactItemView
  | UrbanSprawlComparisonIndirectEconomicImpactItemView
  | SiteStatuQuoEconomicImpact;

export const groupIndirectEconomicImpactsByBearer = <
  T extends IndirectEconomicImpactItem = IndirectEconomicImpactItem,
>(
  indirectEconomicImpacts: T[],
  stakeholders?: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"],
) => {
  const {
    humanity = [],
    localAuthority = [],
    localPeopleOrCompany = [],
  } = Object.groupBy(indirectEconomicImpacts, (item) => {
    switch (item.name) {
      case "oldRentalIncomeLoss":
      case "projectedRentalIncome":
      case "rentalIncome":
        return isLocalAuthority(stakeholders?.current.owner?.structureType)
          ? "localAuthority"
          : "localPeopleOrCompany";
      case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
      case "fricheMaintenanceAndSecuringCostsForOwner":
        return isLocalAuthority(stakeholders?.current.owner?.structureType)
          ? "localAuthority"
          : "localPeopleOrCompany";
      case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
      case "fricheMaintenanceAndSecuringCostsForTenant":
        return isLocalAuthority(stakeholders?.current.tenant?.structureType)
          ? "localAuthority"
          : "localPeopleOrCompany";

      case "previousSiteOperationBenefitLoss":
      case "operatingEconomicBalance":
        return isLocalAuthority(stakeholders?.current.operator?.structureType)
          ? "localAuthority"
          : "localPeopleOrCompany";

      case "projectOperatingEconomicBalance":
        return isLocalAuthority(stakeholders?.project.developer?.structureType)
          ? "localAuthority"
          : "localPeopleOrCompany";

      case "propertyTransferDutiesIncome":
      case "localTransferDutiesIncrease":
      case "projectNewHousesTaxesIncome":
      case "projectNewCompanyTaxationIncome":
      case "projectPhotovoltaicTaxesIncome":
      case "taxesIncome":
      case "waterRegulation":
      case "fricheRoadsAndUtilitiesExpenses":
      case "avoidedRoadsAndUtilitiesConstructionExpenses":
      case "avoidedRoadsAndUtilitiesMaintenanceExpenses":
        return "localAuthority";

      case "localPropertyValueIncrease":
      case "avoidedCarRelatedExpenses":
      case "travelTimeSavedPerTravelerExpenses":
      case "avoidedPropertyDamageExpenses":
      case "avoidedAirConditioningExpenses":
        return "localPeopleOrCompany";

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
  });

  return {
    humanity: {
      total: sumListWithKey(humanity, "total"),
      details: humanity,
    },
    localAuthority: {
      total: sumListWithKey(localAuthority, "total"),
      details: localAuthority,
    },
    localPeopleOrCompany: {
      total: sumListWithKey(localPeopleOrCompany, "total"),
      details: localPeopleOrCompany,
    },
  };
};

export type IndirectEconomicImpactsGroupedByCategory<
  T extends IndirectEconomicImpactItem = IndirectEconomicImpactItem,
> = Partial<
  Record<
    | "localPropertyValueIncrease"
    | "rentalIncome"
    | "taxesIncome"
    | "operatingEconomicBalance"
    | "fricheCosts"
    | "municipalityExpenses"
    | "purchasingPowerIncrease"
    | "environmentalAction"
    | "avoidedHealthExpenses",
    T[]
  >
>;

export const groupIndirectEconomicImpactsByCategory = <
  T extends IndirectEconomicImpactItem = IndirectEconomicImpactItem,
>(
  indirectEconomicImpacts: T[],
): IndirectEconomicImpactsGroupedByCategory<T> => {
  return Object.groupBy(indirectEconomicImpacts, ({ name }) => {
    switch (name) {
      case "oldRentalIncomeLoss":
      case "projectedRentalIncome":
      case "rentalIncome":
        return "rentalIncome";

      case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
      case "fricheMaintenanceAndSecuringCostsForOwner":
        return "fricheCosts";
      case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
      case "fricheMaintenanceAndSecuringCostsForTenant":
        return "fricheCosts";

      case "previousSiteOperationBenefitLoss":
      case "operatingEconomicBalance":
      case "projectOperatingEconomicBalance":
        return "operatingEconomicBalance";

      case "propertyTransferDutiesIncome":
      case "localTransferDutiesIncrease":
      case "projectNewHousesTaxesIncome":
      case "projectNewCompanyTaxationIncome":
      case "projectPhotovoltaicTaxesIncome":
      case "taxesIncome":
        return "taxesIncome";

      case "waterRegulation":
      case "fricheRoadsAndUtilitiesExpenses":
      case "avoidedRoadsAndUtilitiesConstructionExpenses":
      case "avoidedRoadsAndUtilitiesMaintenanceExpenses":
        return "municipalityExpenses";

      case "localPropertyValueIncrease":
        return "localPropertyValueIncrease";

      case "avoidedCarRelatedExpenses":
      case "travelTimeSavedPerTravelerExpenses":
      case "avoidedPropertyDamageExpenses":
      case "avoidedAirConditioningExpenses":
        return "purchasingPowerIncrease";

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
        return "environmentalAction";

      case "avoidedAirPollutionHealthExpenses":
      case "avoidedAccidentsMinorInjuriesExpenses":
      case "avoidedAccidentsSevereInjuriesExpenses":
      case "avoidedAccidentsDeathsExpenses":
        return "avoidedHealthExpenses";

      default:
        return name;
    }
  });
};

export type IndirectEconomicImpactsByBearerAndGroupCategory<
  T extends IndirectEconomicImpactItem = IndirectEconomicImpactItem,
> = {
  total: number;
  localAuthority: {
    total: number;
  } & Pick<
    IndirectEconomicImpactsGroupedByCategory<T>,
    | "rentalIncome"
    | "taxesIncome"
    | "fricheCosts"
    | "municipalityExpenses"
    | "operatingEconomicBalance"
  >;
  localPeopleOrCompany: {
    total: number;
  } & Pick<
    IndirectEconomicImpactsGroupedByCategory<T>,
    | "rentalIncome"
    | "fricheCosts"
    | "operatingEconomicBalance"
    | "localPropertyValueIncrease"
    | "purchasingPowerIncrease"
  >;
  humanity: {
    total: number;
  } & Pick<
    IndirectEconomicImpactsGroupedByCategory<T>,
    "avoidedHealthExpenses" | "environmentalAction"
  >;
};

type Props<T extends IndirectEconomicImpactItem = IndirectEconomicImpactItem> = {
  indirectEconomicImpacts?: T[];
  indirectEconomicImpactsTotal?: number;
  stakeholders?: GetReconversionProjectImpactsResultDto["impacts"]["stakeholders"];
};
export const groupIndirectEconomicImpactsByBearerAndCategory = <
  T extends IndirectEconomicImpactItem = IndirectEconomicImpactItem,
>({
  indirectEconomicImpacts,
  indirectEconomicImpactsTotal,
  stakeholders,
}: Props<T>): IndirectEconomicImpactsByBearerAndGroupCategory<T> => {
  if (!indirectEconomicImpacts || !stakeholders || !indirectEconomicImpactsTotal) {
    return {
      total: 0,
      humanity: { total: 0 },
      localAuthority: { total: 0 },
      localPeopleOrCompany: { total: 0 },
    };
  }

  const { humanity, localAuthority, localPeopleOrCompany } =
    groupIndirectEconomicImpactsByBearer<T>(indirectEconomicImpacts, stakeholders);

  return {
    total: indirectEconomicImpactsTotal,
    humanity: {
      total: humanity.total,
      ...groupIndirectEconomicImpactsByCategory(humanity.details),
    },
    localAuthority: {
      total: localAuthority.total,
      ...groupIndirectEconomicImpactsByCategory(localAuthority.details),
    },
    localPeopleOrCompany: {
      total: localPeopleOrCompany.total,
      ...groupIndirectEconomicImpactsByCategory(localPeopleOrCompany.details),
    },
  };
};
