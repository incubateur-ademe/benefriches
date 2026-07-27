import { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";

export const getEconomicBalanceImpactColor = (name: EconomicBalanceImpactKeyName): string => {
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

    default:
      return "";
  }
};
