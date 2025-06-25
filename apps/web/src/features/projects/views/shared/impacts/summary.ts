import { KeyImpactIndicatorData } from "@/features/projects/domain/projectKeyImpactIndicators";

export const PRIORITY_ORDER = [
  "zanCompliance",
  "projectImpactBalance",
  "avoidedFricheCostsForLocalAuthority",
  "avoidedMaintenanceCostsForLocalAuthority",
  "taxesIncomesImpact",
  "localPropertyValueIncrease",
  "fullTimeJobs",
  "householdsPoweredByRenewableEnergy",
  "avoidedCo2eqEmissions",
  "permeableSurfaceArea",
  "nonContaminatedSurfaceArea",
];

export const getSummaryIndicatorTitle = ({
  name,
  isSuccess,
}: {
  name: KeyImpactIndicatorData["name"];
  isSuccess: boolean;
}) => {
  switch (name) {
    case "avoidedCo2eqEmissions":
      return isSuccess ? "- d’émissions de CO2\u00a0☁️" : "+ d’émissions de CO2\u00a0☁️";
    case "taxesIncomesImpact":
      return isSuccess ? "+ de recettes fiscales\u00a0💰" : "- de recettes fiscales\u00a0💸";
    case "localPropertyValueIncrease":
      return "Un cadre de vie amélioré\u00a0🏡";
    case "householdsPoweredByRenewableEnergy":
      return "+ d’énergies renouvelables\u00a0⚡";
    case "nonContaminatedSurfaceArea":
      return isSuccess
        ? "Des risques sanitaires réduits\u00a0☢️"
        : "des sols encore pollués\u00a0☢️";
    case "fullTimeJobs":
      return isSuccess ? "+ d’emplois\u00a0👷" : "- d’emplois\u00a0👷";
    case "permeableSurfaceArea":
      return isSuccess ? "+ de sols perméables\u00a0☔️" : "- de sols perméables\u00a0☔️";
    case "avoidedFricheCostsForLocalAuthority":
      return isSuccess
        ? "- de dépenses de sécurisation\u00a0💰"
        : "Des dépenses de sécurisation demeurent\u00a0💸";
    case "projectImpactBalance":
      return isSuccess
        ? "Les impacts compensent le déficit de l'opération\u00a0💰"
        : "Les impacts ne compensent pas le déficit de l'opération\u00a0💸";
    case "zanCompliance":
      return isSuccess ? `Projet favorable au ZAN\u00a0🌾` : `Projet defavorable au ZAN\u00a0🌾`;
    case "avoidedMaintenanceCostsForLocalAuthority":
      return isSuccess
        ? "Des dépenses de fonctionnement à la charge de la collectivité réduites\u00a0✅"
        : "Des dépenses de fonctionnement à la charge de la collectivité maintenues\u00a0🚨";
  }
};
