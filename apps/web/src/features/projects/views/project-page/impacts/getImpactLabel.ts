import { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";
import {
  CO2BenefitDetails,
  EnvironmentalImpactDetailsName,
  EnvironmentalMainImpactName,
  PermeableSoilsDetails,
} from "@/features/projects/core/projectImpactsEnvironmental";
import { SocialImpactName } from "@/features/projects/core/projectImpactsSocial";
import {
  SocioEconomicDetailsName,
  SocioEconomicMainImpactName,
} from "@/features/projects/core/projectImpactsSocioEconomic";
import { getLabelForBuildingsConstructionExpense } from "@/shared/core/urbanProject";

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

export const getEconomicBalanceImpactLabel = (name: EconomicBalanceImpactKeyName): string => {
  switch (name) {
    case "siteReinstatement":
      return "🚧 Remise en état de la friche";
    case "siteReinstatement.asbestos_removal":
      return "☣️ Désamiantage";
    case "siteReinstatement.deimpermeabilization":
      return "🌧️ Désimperméabilisation";
    case "siteReinstatement.demolition":
      return "🧱 Déconstruction";
    case "siteReinstatement.other_reinstatement":
      return "🏗️ Autres dépenses de remise en état";
    case "siteReinstatement.remediation":
      return "✨ Dépollution des sols";
    case "siteReinstatement.sustainable_soils_reinstatement":
      return "🌱 Restauration écologique";
    case "siteReinstatement.waste_collection":
      return "♻️️ Évacuation et traitement des déchets";

    case "financialAssistanceRevenues":
      return "🏦 Aides financières";

    case "financialAssistanceRevenues.local_or_regional_authority_participation":
      return "🏛️ Participation des collectivités";
    case "financialAssistanceRevenues.public_subsidies":
      return "🏫 Subventions publiques";
    case "financialAssistanceRevenues.other":
      return "🏦 Autres ressources";

    case "photovoltaicProjectInstallation":
      return "⚡️ Installation des panneaux photovoltaïques";

    case "urbanProjectInstallation.technical_studies":
    case "photovoltaicProjectInstallation.technical_studies":
      return "📋 Études et honoraires techniques";

    case "photovoltaicProjectInstallation.installation_works":
    case "photovoltaicProjectInstallation.development_works":
      return "🛠️ Travaux d'installation des panneaux";
    case "photovoltaicProjectInstallation.other":
      return "⚡️ Autres frais d'installation des panneaux";

    case "urbanProjectInstallation":
      return "🏘️️ Aménagement du site";
    case "urbanProjectInstallation.development_works":
    case "urbanProjectInstallation.installation_works":
      return "🏗️ Travaux d'aménagement";
    case "urbanProjectInstallation.other":
      return "🏘️ Autres dépenses d'aménagement";

    case "projectBuildingsInstallation":
      return "🏗️ Construction et réhabilitation des bâtiments";
    case "projectBuildingsInstallation.buildings_construction_works":
      return getLabelForBuildingsConstructionExpense("buildingsConstructionWorks");
    case "projectBuildingsInstallation.buildings_rehabilitation_works":
      return getLabelForBuildingsConstructionExpense("buildingsRehabilitationWorks");
    case "projectBuildingsInstallation.other_construction_expenses":
      return getLabelForBuildingsConstructionExpense("otherConstructionExpenses");

    case "projectBuildingsInstallation.technical_studies_and_fees":
      return getLabelForBuildingsConstructionExpense("technicalStudiesAndFees");

    case "projectOperatingExpenses":
      return "💸️ Charges d'exploitation";
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

    case "realEstateAcquisition":
      return "🏠 Transaction foncière";
    case "realEstateAcquisition.buildingsResaleRevenue":
      return "🏢 Cession des bâtiments";
    case "realEstateAcquisition.sitePurchase":
      return "🏠 Acquisition du site";
    case "realEstateAcquisition.siteResaleRevenue":
      return "🚪 Cession du site";
  }
};
