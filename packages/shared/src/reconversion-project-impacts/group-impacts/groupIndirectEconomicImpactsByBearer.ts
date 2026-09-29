import type { GetReconversionProjectImpactsResultDto } from "../../api-dtos";
import { LOCAL_AUTHORITIES } from "../../local-authority";
import { sumListWithKey } from "../../services";
import type { SiteStatuQuoEconomicImpact } from "../../site";
import type {
  AggregatedReconversionProjectOnSiteImpactItemView,
  UrbanSprawlComparisonIndirectEconomicImpactItemView,
} from "../projectImpacts.types";

export type IndirectEconomicImpactItem =
  | AggregatedReconversionProjectOnSiteImpactItemView
  | UrbanSprawlComparisonIndirectEconomicImpactItemView
  | SiteStatuQuoEconomicImpact;

const isLocalAuthority = (structureType?: string) =>
  structureType === "localAuthority" || LOCAL_AUTHORITIES.some((item) => item === structureType);

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

      case "projectOperatingExpenses":
      case "projectOperatingRevenues":
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
