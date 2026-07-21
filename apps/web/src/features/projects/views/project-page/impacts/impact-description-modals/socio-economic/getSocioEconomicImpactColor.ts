import { SocioEconomicMainImpactName } from "@/features/projects/domain/projectImpactsSocioEconomic";

export const getSocioEconomicImpactColor = (impactName: SocioEconomicMainImpactName) => {
  switch (impactName) {
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
    case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
      return "#E73518";
    case "propertyTransferDutiesIncome":
      return "#A29674";
    case "oldRentalIncomeLoss":
    case "projectedRentalIncome":
      return "#F5E900";
    case "fricheRoadsAndUtilitiesExpenses":
      return "#9E89CC";
    case "localPropertyValueIncrease":
      return "#8DC85D";
    case "localTransferDutiesIncrease":
      return "#D2E4AF";
    case "taxesIncome":
      return "#1D5DA2";
    case "avoidedCarRelatedExpenses":
      return "#D3C800";
    case "avoidedAirConditioningExpenses":
      return "#AFF6FF";
    case "travelTimeSavedPerTravelerExpenses":
      return "#FD63BA";
    case "avoidedTrafficAccidents":
      return "#FF9700";
    case "avoidedPropertyDamageExpenses":
      return "#F7735A";
    case "avoidedAirPollutionHealthExpenses":
      return "#7CCFFD";
    case "avoidedCo2eqEmissions":
      return "#CAD3DB";
    case "ecosystemServices":
      return "#7ACE14";
    case "waterRegulation":
      return "#038FDD";
    case "previousSiteOperationBenefitLoss":
      return "#E9DABE";
    case "projectOperatingExpenses":
      return "#F5E900";
    case "projectOperatingRevenues":
      return "#57B54B";
  }
};
