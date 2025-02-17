import {
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
import { SocioEconomicImpactName } from "@/features/projects/domain/projectImpactsSocioEconomic";

export const getEnvironmentalImpactLabel = (name: EnvironmentalMainImpactName) => {
  switch (name) {
    case "non_contaminated_surface_area":
      return "✨ Surface non polluée";
    case "co2_benefit":
      return "☁️ CO2-eq stocké ou évité";
    case "permeable_surface_area":
      return "🌧 Surface perméable";
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
      return "🚶‍♀️ Evitées grâce aux déplacements en voiture évités";
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
      return "⏱ Temps passé en moins dans les transports";
  }
};

export const getSocioEconomicImpactLabel = (name: SocioEconomicImpactName) => {
  switch (name) {
    // Économique directs
    case "rental_income":
      return "🔑 Revenu locatif";
    // Arrêt de la sécurisation de la friche
    case "avoided_friche_costs":
      return "🏚 Dépenses de gestion et sécurisation de la friche évitées";
    case "avoided_accidents_costs":
      return "💥 Accidents évités";
    case "avoided_illegal_dumping_costs":
      return "🚮 Débarras de dépôt sauvage";
    case "avoided_maintenance_costs":
      return "🔧 Entretien";
    case "avoided_other_securing_costs":
      return "🛡 Autres dépenses de sécurisation";
    case "avoided_security_costs":
      return "👮‍♀️ Gardiennage";
    // Économique indirects
    case "taxes_income":
      return "🏛 Recettes fiscales";
    case "property_transfer_duties_income":
      return "🏛 Droits de mutation sur la transaction foncière";
    case "local_property_value_increase":
      return "🏡 Valeur patrimoniale des bâtiments alentour";
    case "local_transfer_duties_increase":
      return "🏛 Droits de mutation sur les ventes immobilières alentour";
    case "project_new_company_taxation_income":
      return "🏢 Fiscalité sur les entreprises créées";
    case "project_new_houses_taxes_income":
      return "🏠 Taxe foncière sur les habitations créées";
    case "project_photovoltaic_taxes_income":
      return "⚡️ Taxes et impôts sur la centrale EnR";
    /// Projet urbain
    case "avoided_property_damages_expenses":
      return "🚙 Dépenses d’entretien et réparation évitées";
    case "avoided_car_related_expenses":
      return "🚗 Dépenses automobiles évitées";
    case "avoided_air_conditioning_expenses":
      return "❄️ Dépenses de climatisation évitées";
    case "roads_and_utilities_maintenance_expenses":
      return "🅿️ Dépenses d’entretien des VRD";
    // Sociaux monétarisés
    /// Projet urbain
    case "travel_time_saved":
      return "⏱ Valeur monétaire du temps passé en moins dans les transports";
    case "avoided_traffic_accidents":
      return "🚗 Dépenses de santé évitées grâce à la diminution des accidents de la route";
    case "avoided_traffic_deaths":
      return "🪦 Décès évités";
    case "avoided_traffic_minor_injuries":
      return "🤕 Blessés légers évités";
    case "avoided_traffic_severe_injuries":
      return "‍🚑 Blessés graves évités";
    // Environementaux monétarisés
    case "avoided_co2_eq_emissions":
      return "☁️  Valeur monétaire de la décarbonation ";
    case "avoided_co2_eq_with_enr":
      return "⚡️️ Production d'énergies renouvelables";
    case "avoided_traffic_co2_eq_emissions":
      return "🚙 Déplacements en voiture évités";
    case "avoided_air_conditioning_co2_eq_emissions":
      return "❄️ Utilisation réduite de de la climatisation";
    case "avoided_air_pollution":
      return "💨 Dépenses de santé évitées grâce à la réduction de la pollution de l’air";
    case "water_regulation":
      return "🚰 Dépenses de traitement de l’eau évitées";
    // Services écosystémiques
    case "ecosystem_services":
      return "🌱 Valeur monétaire des services écosystémiques";
    case "forest_related_product":
      return "🪵 Produits issus de la forêt";
    case "invasive_species_regulation":
      return "🦔 Régulation des espèces invasives";
    case "nature_related_wellness_and_leisure":
      return "🚵‍♂️ Bien-être et loisirs liés à la nature";
    case "nitrogen_cycle":
      return "🍄 Cycle de l'azote";
    case "pollination":
      return "🐝 Pollinisation";
    case "soil_erosion":
      return "🌾 Régulation de l'érosion des sols";
    case "water_cycle":
      return "💧 Cycle de l'eau";
    case "carbon_storage":
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
      return "🏗 Aménagement du projet";
    case "photovoltaic_development_plan_installation":
      return "⚡️ Installation des panneaux photovoltaïques";
    case "urban_project_development_plan_installation":
      return "🏘 Aménagement du site";
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
      return "🏛 Taxes et impôts";
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
      return "🔑 Loyer";
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
      return "🌧 Désimperméabilisation";
    case "remediation":
      return "✨ Dépollution des sols";
    case "demolition":
      return "🧱 Déconstruction";
    case "waste_collection":
      return "♻️ Évacuation et traitement des déchets";
    default:
      return "🏗 Autres dépenses de remise en état";
  }
};

const getEconomicBalanceFinancialAssistanceLabel = (
  revenueSource: FinancialAssistanceRevenue["source"],
): string => {
  switch (revenueSource) {
    case "local_or_regional_authority_participation":
      return "🏛 Participation des collectivités";
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
      return "🛠 Travaux d'installation des panneaux";
    case "photovoltaic_other":
      return "⚡️ Autres frais d'installation des panneaux";
    case "urban_project_works":
      return "🏗 Travaux d'aménagement";
    case "urban_project_other":
      return " 🏘 Autres dépenses d'aménagement";
    case "installation_works":
    case "development_works":
      return "🛠 Travaux d'installation";
    case "other":
      return "🏗 Autres frais d'installation";
  }
};
