import {
  BuildingsConstructionExpensePurpose,
  FinancialAssistanceRevenue,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
} from "shared";

import {
  DevelopmentPlanInstallationExpenseName,
  EconomicBalanceMainName,
  EconomicBalanceName,
} from "@/features/projects/domain/projectImpactsEconomicBalance";
import {
  CO2BenefitDetails,
  EnvironmentalImpactDetailsName,
  EnvironmentalMainImpactName,
  PermeableSoilsDetails,
} from "@/features/projects/domain/projectImpactsEnvironmental";
import { SocialImpactName } from "@/features/projects/domain/projectImpactsSocial";
import {
  SocioEconomicDetailsName,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import { getLabelForBuildingsConstructionExpenseFromApiPurpose } from "@/shared/core/urbanProject";

export const getEnvironmentalImpactLabel = (name: EnvironmentalMainImpactName) => {
  switch (name) {
    case "non_contaminated_surface_area":
      return "✨ Surface non polluée";
    case "co2_benefit":
      return "☁️ CO2-eq stocké ou évité";
    case "permeable_surface_area":
      return "🌧️ Surface perméable";
  }
};

export const getEnvironmentalDetailsImpactLabel = (
  mainCategory: EnvironmentalMainImpactName,
  name: EnvironmentalImpactDetailsName,
) => {
  switch (mainCategory) {
    case "permeable_surface_area":
      return getPermeableSurfaceDetailsImpactLabel(name as PermeableSoilsDetails);
    case "co2_benefit":
      return getCO2BenefitDetailsImpactLabel(name as CO2BenefitDetails);
    default:
      return "Autre";
  }
};

const getCO2BenefitDetailsImpactLabel = (name: CO2BenefitDetails) => {
  switch (name) {
    case "stored_co2_eq":
      return "🍂 CO2-eq stocké dans les sols";
    case "avoided_co2_eq_emissions_with_production":
      return "⚡️ Émissions de CO2-eq évitées grâce à la production d'EnR";
    case "avoided_car_traffic_co2_eq_emissions":
      return "🚶 Evitées grâce aux déplacements en voiture évités";
    case "avoided_air_conditioning_co2_eq_emissions":
      return "❄️ Evitées grâce à l'utilisation réduite de de la climatisation";
  }
};

const getPermeableSurfaceDetailsImpactLabel = (name: PermeableSoilsDetails) => {
  switch (name) {
    case "mineral_soil":
      return "🪨 Surface perméable minérale";
    case "green_soil":
      return "🌱 Surface perméable végétalisée";
  }
};

export const getSocialImpactLabel = (name: SocialImpactName) => {
  switch (name) {
    case "conversion_full_time_jobs":
      return "👷 Reconversion du site";
    case "operations_full_time_jobs":
      return "🧑‍🔧 Exploitation du site";
    case "avoided_friche_accidents":
      return "💥 Personnes préservées des accidents sur la friche";
    case "avoided_friche_minor_accidents":
      return "🤕 Blessés légers évités";
    case "avoided_friche_severe_accidents":
      return "🚑 Blessés graves évités";

    case "avoided_traffic_accidents":
      return "🚘 Personnes préservées des accidents de la route";
    case "avoided_traffic_minor_injuries":
      return "🤕 Blessés légers évités";
    case "avoided_traffic_severe_injuries":
      return "🚑 Blessés graves évités";
    case "avoided_traffic_deaths":
      return "🪦 Décès évités";
    case "households_powered_by_renewable_energy":
      return "🏠 Foyers alimentés par les EnR";
    case "full_time_jobs":
      return "🧑‍🔧 Emplois équivalent temps plein mobilisés";
    case "avoided_vehicule_kilometers":
      return "🚙 Kilomètres évités";
    case "travel_time_saved":
      return "⏱️ Temps passé en moins dans les transports";
  }
};

export const getSocioEconomicImpactLabel = (
  name: SocioEconomicMainImpactName | SocioEconomicDetailsName,
) => {
  switch (name) {
    // Économique directs
    case "projectedRentalIncome":
      return "🔑 Revenu locatif";
    case "oldRentalIncomeLoss":
      return "🔑 Perte de revenu locatif";

    // Arrêt de la sécurisation de la friche
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner":
      return "🏚️ Dépenses liées à la friche évitées pour le propriétaire";

    case "avoidedFricheMaintenanceAndSecuringCostsForTenant":
      return "🏚️ Dépenses liées à la friche évitées pour le locataire";

    case "avoidedFricheMaintenanceAndSecuringCostsForTenant.accidentsCost":
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner.accidentsCost":
      return "💥 Accidents évités";
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner.illegalDumpingCost":
    case "avoidedFricheMaintenanceAndSecuringCostsForTenant.illegalDumpingCost":
      return "🚮 Débarras de dépôt sauvage";
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner.maintenance":
    case "avoidedFricheMaintenanceAndSecuringCostsForTenant.maintenance":
      return "🔧 Entretien";
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner.otherSecuringCosts":
    case "avoidedFricheMaintenanceAndSecuringCostsForTenant.otherSecuringCosts":
      return "🛡 Autres dépenses de sécurisation";
    case "avoidedFricheMaintenanceAndSecuringCostsForOwner.security":
    case "avoidedFricheMaintenanceAndSecuringCostsForTenant.security":
      return "👮 Gardiennage";

    case "projectOperatingExpenses":
      return "💸 Charges d’exploitation";

    case "projectOperatingExpenses.rent":
      return "🔑 Loyer";
    case "projectOperatingExpenses.maintenance":
      return "⚙️ Entretien et maintenance";
    case "projectOperatingExpenses.taxes":
      return "🏛️ Taxes et impôts";
    case "projectOperatingExpenses.other":
      return "💸 Autres charges d’exploitation";

    case "projectOperatingRevenues":
      return "💰 Recettes d'exploitation";

    case "projectOperatingRevenues.operations":
      return "💰 Recettes principales";
    case "projectOperatingRevenues.other":
      return "💶 Recettes secondaires";
    case "projectOperatingRevenues.rent":
      return "🔑 Revenu locatif";

    // Économique indirects
    case "taxesIncome":
      return "🏛️ Recettes fiscales";

    case "propertyTransferDutiesIncome":
      return "🏛️ Droits de mutation sur la transaction foncière";
    case "localPropertyValueIncrease":
      return "🏡 Hausse de la valeur patrimoniale des bâtiments alentour";
    case "localTransferDutiesIncrease":
      return "🏛️ Droits de mutation sur les ventes immobilières alentour";
    case "projectNewCompanyTaxationIncome":
      return "🏢 Fiscalité sur les entreprises créées";
    case "projectNewHousesTaxesIncome":
      return "🏠 Taxe foncière sur les habitations créées";
    case "projectPhotovoltaicTaxesIncome":
      return "⚡️ Taxes et impôts sur la centrale EnR";
    case "previousSiteOperationBenefitLoss":
      return "👨‍🌾 Perte de revenus agricoles";
    /// Projet urbain
    case "avoidedPropertyDamageExpenses":
      return "🚙 Dépenses d’entretien et réparation évitées";
    case "avoidedCarRelatedExpenses":
      return "🚗 Dépenses automobiles évitées";
    case "avoidedAirConditioningExpenses":
      return "❄️ Dépenses de climatisation évitées";
    case "fricheRoadsAndUtilitiesExpenses":
      return "🅿️ Dépenses d’entretien des VRD";
    // Sociaux monétarisés
    /// Projet urbain
    case "travelTimeSavedPerTravelerExpenses":
      return "⏱️️ Valeur monétaire du temps passé en moins dans les transports";

    case "avoidedTrafficAccidents":
      return "🚗 Dépenses de santé évitées grâce à la diminution des accidents de la route";
    case "avoidedAccidentsDeathsExpenses":
      return "🪦 Décès évités";
    case "avoidedAccidentsMinorInjuriesExpenses":
      return "🤕 Blessés légers évités";
    case "avoidedAccidentsSevereInjuriesExpenses":
      return "‍🚑 Blessés graves évités";
    // Environementaux monétarisés
    case "avoidedCo2eqEmissions":
      return "☁️  Valeur monétaire de la décarbonation ";
    case "avoidedCo2eqWithEnergyProduction":
      return "⚡️️ Production d'énergies renouvelables";
    case "avoidedTrafficCo2EqEmissions":
      return "🚙 Déplacements en voiture évités";
    case "avoidedAirConditioningCo2eqEmissions":
      return "❄️ Utilisation réduite de de la climatisation";

    case "avoidedAirPollutionHealthExpenses":
      return "💨 Dépenses de santé évitées grâce à la réduction de la pollution de l’air";
    case "waterRegulation":
      return "🚰 Dépenses de traitement de l’eau évitées";
    // Services écosystémiques
    case "ecosystemServices":
      return "🌱 Valeur monétaire des services écosystémiques";
    case "forestRelatedProduct":
      return "🪵 Produits issus de la forêt";
    case "invasiveSpeciesRegulation":
      return "🦔 Régulation des espèces invasives";
    case "natureRelatedWelnessAndLeisure":
      return "🚵 Bien-être et loisirs liés à la nature";
    case "nitrogenCycle":
      return "🍄 Cycle de l'azote";
    case "pollination":
      return "🐝 Pollinisation";
    case "soilErosion":
      return "🌾 Régulation de l'érosion des sols";
    case "waterCycle":
      return "💧 Cycle de l'eau";
    case "newStoredCo2Eq":
      return "🍂️ Carbone stocké dans les sols";
  }
};

export const getEconomicBalanceImpactLabel = (name: EconomicBalanceMainName): string => {
  switch (name) {
    case "site_purchase":
      return "🏠 Acquisition du site";
    case "site_resale":
      return "🚪 Cession du site";
    case "site_reinstatement":
      return "🚧 Remise en état de la friche";
    case "financial_assistance":
      return "🏦 Aides financières";
    case "development_plan_installation":
      return "🏗️️ Aménagement du projet";
    case "photovoltaic_development_plan_installation":
      return "⚡️ Installation des panneaux photovoltaïques";
    case "urban_project_development_plan_installation":
      return "🏘️️ Aménagement du site";
    case "urban_project_buildings_construction_and_rehabilitation":
      return "🏗️ Construction et réhabilitation des bâtiments";
    case "operations_costs":
      return "💸️ Charges d'exploitation";
    case "operations_revenues":
      return "💰 Recettes d'exploitation";
    case "buildings_resale":
      return "🏢 Cession des bâtiments";
  }
};

export const getEconomicBalanceDetailsImpactLabel = (
  mainCategory: EconomicBalanceMainName,
  name: EconomicBalanceName,
): string => {
  switch (mainCategory) {
    case "site_reinstatement":
      return getEconomicBalanceReinstatementExpensePurposeLabel(
        name as ReinstatementExpense["purpose"],
      );
    case "operations_costs":
      return getEconomicBalanceYearlyExpensePurposeLabel(name as RecurringExpense["purpose"]);
    case "operations_revenues":
      return getEconomicBalanceYearlyRevenueSourceLabel(name as RecurringRevenue["source"]);
    case "financial_assistance":
      return getEconomicBalanceFinancialAssistanceLabel(
        name as FinancialAssistanceRevenue["source"],
      );
    case "photovoltaic_development_plan_installation":
    case "urban_project_development_plan_installation":
    case "development_plan_installation":
      return getEconomicBalanceInstallationLabel(name as DevelopmentPlanInstallationExpenseName);
    case "urban_project_buildings_construction_and_rehabilitation":
      return getLabelForBuildingsConstructionExpenseFromApiPurpose(
        name as BuildingsConstructionExpensePurpose,
      );
    default:
      return "Autre";
  }
};

const getEconomicBalanceYearlyExpensePurposeLabel = (purpose: RecurringExpense["purpose"]) => {
  switch (purpose) {
    case "rent":
      return "🔑 Loyer";
    case "maintenance":
      return "⚙️ Entretien et maintenance";
    case "taxes":
      return "🏛️ Taxes et impôts";
    case "other":
      return "💸 Autres charges d’exploitation";
  }
};

const getEconomicBalanceYearlyRevenueSourceLabel = (source: RecurringRevenue["source"]): string => {
  switch (source) {
    case "operations":
      return "💰 Recettes principales";
    case "other":
      return "💶 Recettes secondaires";
    case "rent":
      return "🔑 Revenu locatif";
  }
};

const getEconomicBalanceReinstatementExpensePurposeLabel = (
  purpose: ReinstatementExpense["purpose"],
): string => {
  switch (purpose) {
    case "asbestos_removal":
      return "☣️ Désamiantage";
    case "sustainable_soils_reinstatement":
      return "🌱 Restauration écologique";
    case "deimpermeabilization":
      return "🌧️ Désimperméabilisation";
    case "remediation":
      return "✨ Dépollution des sols";
    case "demolition":
      return "🧱 Déconstruction";
    case "waste_collection":
      return "♻️️ Évacuation et traitement des déchets";
    default:
      return "🏗️ Autres dépenses de remise en état";
  }
};

const getEconomicBalanceFinancialAssistanceLabel = (
  revenueSource: FinancialAssistanceRevenue["source"],
): string => {
  switch (revenueSource) {
    case "local_or_regional_authority_participation":
      return "🏛️ Participation des collectivités";
    case "public_subsidies":
      return "🏫 Subventions publiques";
    default:
      return "🏦 Autres ressources";
  }
};

const getEconomicBalanceInstallationLabel = (
  purpose: DevelopmentPlanInstallationExpenseName,
): string => {
  switch (purpose) {
    case "urban_project_technical_studies":
    case "photovoltaic_technical_studies":
    case "technical_studies":
      return "📋 Études et honoraires techniques";
    case "photovoltaic_works":
      return "🛠️ Travaux d'installation des panneaux";
    case "photovoltaic_other":
      return "⚡️ Autres frais d'installation des panneaux";
    case "urban_project_works":
      return "🏗️ Travaux d'aménagement";
    case "urban_project_other":
      return "🏘️ Autres dépenses d'aménagement";
    case "installation_works":
    case "development_works":
      return "🛠️ Travaux d'installation";
    case "other":
      return "🏗️ Autres frais d'installation";
  }
};
