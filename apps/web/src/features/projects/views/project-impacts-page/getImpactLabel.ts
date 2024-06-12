import {
  EconomicBalanceMainName,
  EconomicBalanceName,
} from "../../application/projectImpactsEconomicBalance.selectors";
import {
  CO2BenefitDetails,
  EnvironmentalImpactDetailsName,
  EnvironmentalMainImpactName,
  PermeableSoilsDetails,
  SoilsCarbonStorageDetails,
} from "../../application/projectImpactsEnvironmental.selectors";
import { SocialImpactName } from "../../application/projectImpactsSocial.selectors";
import { SocioEconomicImpactName } from "../../application/projectImpactsSocioEconomic.selectors";
import {
  DevelopmentPlanInstallationCost,
  FinancialAssistance,
  OperationsCost,
  ReinstatementCost,
  SourceRevenue,
} from "../../domain/impacts.types";

export const getEnvironmentalImpactLabel = (name: EnvironmentalMainImpactName) => {
  switch (name) {
    case "soils_carbon_storage":
      return "🍂 Carbone stocké dans les sols";
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
    case "soils_carbon_storage":
      return getSoilStorageDetailsImpactLabel(name as SoilsCarbonStorageDetails);
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

const getSoilStorageDetailsImpactLabel = (name: SoilsCarbonStorageDetails) => {
  switch (name) {
    case "buildings":
      return "Bâtiments";
    case "impermeable_soils":
      return "Sols imperméabilisés";
    case "mineral_soil":
      return "Sol perméable minéral";
    case "artificial_grass_or_bushes_filled":
      return "Sol enherbé et arbustif";
    case "artificial_tree_filled":
      return "Sol arboré";
    case "forest_conifer":
      return "Forêt de conifères";
    case "forest_deciduous":
      return "Forêt de feuillus";
    case "forest_poplar":
      return "Forêt de peupliers";
    case "forest_mixed":
      return "Forêt mixte";
    case "prairie_grass":
      return "Prairie herbacée";
    case "prairie_bushes":
      return "Prairie arbustive";
    case "prairie_trees":
      return "Prairie arborée";
    case "wet_land":
      return "Zone humide";
    case "cultivation":
      return "Culture";
    case "orchard":
      return "Verger";
    case "vineyard":
      return "Vigne";
    case "water":
      return "Plan d'eau";
  }
};

export const getSocialImpactLabel = (name: SocialImpactName) => {
  switch (name) {
    case "conversion_full_time_jobs":
      return "👷 Reconversion du site";
    case "operations_full_time_jobs":
      return "🧑‍🔧 Exploitation du site";
    case "avoided_minor_accidents":
      return "💥 Blessés légers évités";
    case "avoided_severe_accidents":
      return "🚑 Blessés graves évités";
    case "households_powered_by_renewable_energy":
      return "🏠 Foyers alimentés par les EnR";
    case "avoided_accidents":
      return "🤕 Accidents évités sur la friche";
    case "full_time_jobs":
      return "🧑‍🔧 Emplois équivalent temps plein mobilisés";
  }
};

export const getSocioEconomicImpactLabel = (name: SocioEconomicImpactName) => {
  switch (name) {
    // Économique directs
    case "rental_income":
      return "🔑 Revenu locatif";
    case "avoided_friche_costs":
      return "🏚 Dépenses de gestion et sécurisation de la friche évitées";
    // Économique indirects
    case "taxes_income":
      return "🏛 Recettes fiscales";
    case "property_transfer_duties_income":
      return "🏛 Droits de mutation sur la transaction foncière";
    // Environementaux monétarisés
    case "co2_benefit_monetary":
      return "☁️ Emissions de CO2-eq évitées";
    case "avoided_co2_eq_with_enr":
      return "⚡️️ Grâce à la production d'énergies renouvelables";
    case "water_regulation":
      return "🚰 Régulation de la qualité de l'eau";
    // Services écosystémiques
    case "ecosystem_services":
      return "🌻 Services écosystémiques";
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

export const getEconomicBalanceImpactLabel = (name: EconomicBalanceMainName) => {
  switch (name) {
    case "real_estate_transaction":
      return "🏠 Acquisition du site";
    case "site_reinstatement":
      return "🚧 Remise en état de la friche";
    case "financial_assistance":
      return "🏦 Aides financières";
    case "development_plan_installation":
      return "⚡️ Installation des panneaux photovoltaïques";
    case "operations_costs":
      return "💸️ Charges d'exploitation";
    case "operations_revenues":
      return "💰 Recettes d'exploitation";
  }
};

export const getEconomicBalanceDetailsImpactLabel = (
  mainCategory: EconomicBalanceMainName,
  name: EconomicBalanceName,
) => {
  switch (mainCategory) {
    case "site_reinstatement":
      return getEconomicBalanceReinstatementCostPurposeLabel(name as ReinstatementCost["purpose"]);
    case "operations_costs":
      return getEconomicBalanceYearlyCostPurposeLabel(name as OperationsCost["purpose"]);
    case "operations_revenues":
      return getEconomicBalanceYearlyRevenueSourceLabel(name as SourceRevenue);
    case "financial_assistance":
      return getEconomicBalanceFinancialAssistanceLabel(name as FinancialAssistance);
    case "development_plan_installation":
      return getEconomicBalancePhotovoltaicInstallationLabel(
        name as DevelopmentPlanInstallationCost["purpose"],
      );
    default:
      return "Autre";
  }
};

const getEconomicBalanceYearlyCostPurposeLabel = (purpose: OperationsCost["purpose"]) => {
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

const getEconomicBalanceYearlyRevenueSourceLabel = (source: SourceRevenue) => {
  switch (source) {
    case "operations":
      return "💰 Recettes principales";
    case "other":
      return "💶 Recettes secondaires";
  }
};

const getEconomicBalanceReinstatementCostPurposeLabel = (
  costPurpose: ReinstatementCost["purpose"],
): string => {
  switch (costPurpose) {
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

const getEconomicBalanceFinancialAssistanceLabel = (revenueSource: FinancialAssistance): string => {
  switch (revenueSource) {
    case "local_or_regional_authority_participation":
      return "🏛 Participation des collectivités";
    case "public_subsidies":
      return "🏫 Subventions publiques";
    default:
      return "🏦 Autres ressources";
  }
};

const getEconomicBalancePhotovoltaicInstallationLabel = (
  photovoltaicCostPurpose: DevelopmentPlanInstallationCost["purpose"],
): string => {
  switch (photovoltaicCostPurpose) {
    case "technical_studies":
      return "📋 Études et honoraires techniques";
    case "installation_works":
      return "🛠 Travaux d'installation des panneaux";
    case "other":
      return "⚡️ Autres frais d'installation des panneaux";
  }
};
