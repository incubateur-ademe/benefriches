import { EconomicBalanceImpactKeyName } from "@/features/projects/core/projectImpactsEconomicBalance";
import { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";
import { SocioEconomicImpactImpactKeyName } from "@/features/projects/core/projectImpactsSocioEconomic";
import { getLabelForBuildingsConstructionExpense } from "@/shared/core/urbanProject";

export const getEnvironmentalImpactLabel = (name: EnvironmentalImpactMetricKeyName) => {
  switch (name) {
    case "nonContaminatedSurfaceArea":
      return "✨ Surface non polluée";
    case "avoidedCo2eqEmissions":
      return "☁️ CO2-eq stocké ou évité";
    case "newPermeableSurface":
      return "🌧️ Surface perméable";
    case "newPermeableSurface.newPermeableMineralSurface":
      return "🪨 Surface perméable minérale";
    case "newPermeableSurface.newPermeableGreenSurface":
      return "🌱 Surface perméable végétalisée";
    case "avoidedCo2eqEmissions.newStoredCo2Eq":
      return "🍂 CO2-eq stocké dans les sols";
    case "avoidedCo2eqEmissions.avoidedCO2TonsWithEnergyProduction":
      return "⚡️ Émissions de CO2-eq évitées grâce à la production d'EnR";
    case "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions":
      return "🚶 Evitées grâce aux déplacements en voiture évités";
    case "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions":
      return "❄️ Evitées grâce à l'utilisation réduite de de la climatisation";
  }
};

export const getSocialImpactLabel = (name: SocialImpactMetricKeyName) => {
  switch (name) {
    case "fullTimeJobs.conversionFullTimeJobs":
      return "👷 Reconversion du site";
    case "fullTimeJobs.photovoltaicOperationsFullTimeJobs":
    case "fullTimeJobs.urbanOperationsFullTimeJobs":
      return "🧑‍🔧 Exploitation du site";

    case "avoidedFricheAccidents":
      return "💥 Personnes préservées des accidents sur la friche";
    case "avoidedFricheAccidents.avoidedFricheAccidentsMinorInjuries":
      return "🤕 Blessés légers évités";
    case "avoidedFricheAccidents.avoidedFricheAccidentsSevereInjuries":
      return "🚑 Blessés graves évités";
    case "avoidedFricheAccidents.avoidedFricheAccidentsDeaths":
      return "Décès évités";

    case "avoidedTrafficAccidents":
      return "🚘 Personnes préservées des accidents de la route";
    case "avoidedTrafficAccidents.avoidedTrafficAccidentsSevereInjuries":
      return "🤕 Blessés légers évités";
    case "avoidedTrafficAccidents.avoidedTrafficAccidentsMinorInjuries":
      return "🚑 Blessés graves évités";
    case "avoidedTrafficAccidents.avoidedTrafficAccidentsDeaths":
      return "🪦 Décès évités";
    case "householdsPoweredByRenewableEnergy":
      return "🏠 Foyers alimentés par les EnR";
    case "fullTimeJobs":
      return "🧑‍🔧 Emplois équivalent temps plein mobilisés";
    case "avoidedVehiculeKilometers":
      return "🚙 Kilomètres évités";
    case "timeTravelSavedInHours":
      return "⏱️ Temps passé en moins dans les transports";
  }
};

export const getSocioEconomicImpactLabel = (name: SocioEconomicImpactImpactKeyName) => {
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
    case "taxesIncome.projectNewCompanyTaxationIncome":
      return "🏢 Fiscalité sur les entreprises créées";
    case "taxesIncome.projectNewHousesTaxesIncome":
      return "🏠 Taxe foncière sur les habitations créées";
    case "taxesIncome.projectPhotovoltaicTaxesIncome":
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
    case "avoidedTrafficAccidents.avoidedAccidentsDeathsExpenses":
      return "🪦 Décès évités";
    case "avoidedTrafficAccidents.avoidedAccidentsMinorInjuriesExpenses":
      return "🤕 Blessés légers évités";
    case "avoidedTrafficAccidents.avoidedAccidentsSevereInjuriesExpenses":
      return "‍🚑 Blessés graves évités";
    // Environementaux monétarisés
    case "avoidedCo2eqEmissions":
      return "☁️  Valeur monétaire de la décarbonation ";
    case "avoidedCo2eqEmissions.avoidedCo2eqWithEnergyProduction":
      return "⚡️️ Production d'énergies renouvelables";
    case "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions":
      return "🚙 Déplacements en voiture évités";
    case "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions":
      return "❄️ Utilisation réduite de de la climatisation";

    case "avoidedAirPollutionHealthExpenses":
      return "💨 Dépenses de santé évitées grâce à la réduction de la pollution de l’air";
    case "waterRegulation":
      return "🚰 Dépenses de traitement de l’eau évitées";
    // Services écosystémiques
    case "ecosystemServices":
      return "🌱 Valeur monétaire des services écosystémiques";
    case "ecosystemServices.forestRelatedProduct":
      return "🪵 Produits issus de la forêt";
    case "ecosystemServices.invasiveSpeciesRegulation":
      return "🦔 Régulation des espèces invasives";
    case "ecosystemServices.natureRelatedWelnessAndLeisure":
      return "🚵 Bien-être et loisirs liés à la nature";
    case "ecosystemServices.nitrogenCycle":
      return "🍄 Cycle de l'azote";
    case "ecosystemServices.pollination":
      return "🐝 Pollinisation";
    case "ecosystemServices.soilErosion":
      return "🌾 Régulation de l'érosion des sols";
    case "ecosystemServices.waterCycle":
      return "💧 Cycle de l'eau";
    case "ecosystemServices.newStoredCo2Eq":
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
