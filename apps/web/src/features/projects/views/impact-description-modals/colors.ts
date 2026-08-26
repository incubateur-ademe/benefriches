import { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";
import { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";
import { SocioEconomicImpactImpactKeyName } from "@/features/projects/core/projectImpactsSocioEconomic";

export const getEconomicBalanceImpactColor = (name: EconomicBalanceImpactKeyName) => {
  switch (name) {
    case "realEstateAcquisition":
      return "#C649CA";
    case "siteReinstatement":
      return "#DE3317";
    case "financialAssistanceRevenues":
      return "#66D6FF";
    case "photovoltaicProjectInstallation":
      return "#FF9700";
    case "urbanProjectInstallation":
      return "#E4D1AF";
    case "projectBuildingsInstallation":
      return "#854C1B";
    case "projectOperatingExpenses":
      return "#F5E900";
    case "projectOperatingRevenues":
      return "#57B54B";

    case "siteReinstatement.asbestos_removal":
      return "#F4C00A";
    case "siteReinstatement.deimpermeabilization":
      return "#039CF2";
    case "siteReinstatement.demolition":
      return "#85341B";
    case "siteReinstatement.other_reinstatement":
      return "#DE3317";
    case "siteReinstatement.remediation":
      return "#F6DB1F";
    case "siteReinstatement.sustainable_soils_reinstatement":
      return "#7ACA17";
    case "siteReinstatement.waste_collection":
      return "#298435";

    case "photovoltaicProjectInstallation.installation_works":
      return "#7E7F81";
    case "photovoltaicProjectInstallation.technical_studies":
      return "#C4C5C6";
    case "photovoltaicProjectInstallation.other":
      return "#FF9700";

    case "urbanProjectInstallation.development_works":
      return "#9E89CC";
    case "urbanProjectInstallation.technical_studies":
      return "#C4C5C6";
    case "urbanProjectInstallation.other":
      return "#E9DABE";

    case "financialAssistanceRevenues.local_or_regional_authority_participation":
      return "#1D5DA2";
    case "financialAssistanceRevenues.public_subsidies":
      return "#AFF6FF";
    case "financialAssistanceRevenues.other":
      return "#FFADFE";

    case "realEstateAcquisition.sitePurchase":
    case "realEstateAcquisition.buildingsResaleRevenue":
    case "realEstateAcquisition.siteResaleRevenue":
      return "#C649CA";
  }
};

export const getSocioEconomicImpactColor = (impactName: SocioEconomicImpactImpactKeyName) => {
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

    case "avoidedFricheMaintenanceAndSecuringCostsForOwner.accidentsCost":
    case "avoidedFricheMaintenanceAndSecuringCostsForTenant.accidentsCost":
      return "#E73518";
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner.illegalDumpingCost":
    case "avoidedFricheMaintenanceAndSecuringCostsForTenant.illegalDumpingCost":
      return "#AD6524";
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner.maintenance":
    case "avoidedFricheMaintenanceAndSecuringCostsForTenant.maintenance":
      return "#9E89CC";
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner.otherSecuringCosts":
    case "avoidedFricheMaintenanceAndSecuringCostsForTenant.otherSecuringCosts":
      return "#C4C5C6";
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner.security":
    case "avoidedFricheMaintenanceAndSecuringCostsForTenant.security":
      return "#AFF6FF";

    case "avoidedCo2eqEmissions.avoidedCo2eqWithEnergyProduction":
      return "#F6E900";
    case "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions":
      return "#1F60FB";
    case "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions":
      return "#C750CA";

    case "ecosystemServices.newStoredCo2Eq":
      return "#FF8910";
    case "ecosystemServices.soilErosion":
      return "#C3D869";
    case "ecosystemServices.forestRelatedProduct":
      return "#A27C61";
    case "ecosystemServices.natureRelatedWelnessAndLeisure":
      return "#75399D";
    case "ecosystemServices.pollination":
      return "#F6E900";
    case "ecosystemServices.invasiveSpeciesRegulation":
      return "#2D163C";
    case "ecosystemServices.nitrogenCycle":
      return "#F83A31";
    case "ecosystemServices.waterCycle":
      return "#1F60FB";

    case "taxesIncome.projectNewCompanyTaxationIncome":
      return "#1D5DA2";
    case "taxesIncome.projectNewHousesTaxesIncome":
      return "#C649CA";
    case "taxesIncome.projectPhotovoltaicTaxesIncome":
      return "#FF9700";
  }
};

export const getSocialImpactColor = (impactName: SocialImpactMetricKeyName) => {
  switch (impactName) {
    case "avoidedTrafficAccidents.avoidedTrafficAccidentsSevereInjuries":
      return "#E73518";
    case "avoidedTrafficAccidents.avoidedTrafficAccidentsMinorInjuries":
      return "#F6DB1F";
    case "avoidedTrafficAccidents.avoidedTrafficAccidentsDeaths":
      return "#2D163C";
    case "fullTimeJobs.conversionFullTimeJobs":
      return "#E73518";
    case "fullTimeJobs.urbanOperationsFullTimeJobs":
    case "fullTimeJobs.photovoltaicOperationsFullTimeJobs":
      return "#C4C5C6";
  }
};

export const getEnvironmentalImpactColor = (impactName: EnvironmentalImpactMetricKeyName) => {
  switch (impactName) {
    case "avoidedCo2eqEmissions.avoidedCO2TonsWithEnergyProduction":
      return "#F6E900";
    case "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions":
      return "#1F60FB";
    case "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions":
      return "#C750CA";
    case "avoidedCo2eqEmissions.newStoredCo2Eq":
      return "#FF8910";
    case "nonContaminatedSurfaceArea":
      return "#FCDF3B";
    case "newPermeableSurface.newPermeableGreenSurface":
      return "#7ACA17";
    case "newPermeableSurface.newPermeableMineralSurface":
      return "#70706A";
  }
};
