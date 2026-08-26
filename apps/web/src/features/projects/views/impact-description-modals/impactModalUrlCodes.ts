// shared/impacts/modals/impactModalUrlCodes.ts
import {
  EconomicBalanceImpactKeyName,
  EconomicBalanceMainImpactKeyName,
} from "@/features/projects/core/projectImpactsEconomicBalance";
import { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import { SocialImpactMetricKeyName } from "@/features/projects/core/projectImpactsSocial";
import { SocioEconomicImpactImpactKeyName } from "@/features/projects/core/projectImpactsSocioEconomic";
import { KeyImpactIndicatorData } from "@/features/projects/core/projectKeyImpactIndicators";

import {
  EnvironmentalSectionName,
  SocialSectionName,
  SocioEconomicSectionName,
} from "./ImpactModalDescriptionContext";

export const SECTION_CODES = {
  summary: "synthese",
  economicBalance: "bilan",
  socioEconomic: "socio-eco",
  "socioEconomic.humanity": "humanite",
  "socioEconomic.localPeopleOrCompany": "acteurs-locaux",
  "socioEconomic.localAuthority": "collectivite",
  social: "social",
  "social.jobs": "social.emplois",
  "social.humanity": "social.societe",
  "social.localPeopleOrCompany": "social.riverains",
  environmental: "environnement",
  "environmental.co2eq": "environnement.co2",
  "environmental.soils": "environnement.sols",
  breakEvenLevel: "seuil-rentabilite",
} as const satisfies Record<
  | "summary"
  | "economicBalance"
  | SocioEconomicSectionName
  | SocialSectionName
  | EnvironmentalSectionName
  | "breakEvenLevel",
  string
>;

type ValueOf<T> = T[keyof T];
export type SectionCode = ValueOf<typeof SECTION_CODES>;
export type DetailsCode =
  | ValueOf<typeof ECONOMIC_BALANCE_DETAILS_CODES>
  | ValueOf<typeof SOCIO_ECO_DETAILS_CODES>
  | ValueOf<typeof SOCIAL_DETAILS_CODES>
  | ValueOf<typeof ENVIRONMENTAL_DETAILS_CODES>
  | ValueOf<typeof SUMMARY_DETAILS_CODES>;

export const ECONOMIC_BALANCE_IMPACT_CODES = {
  projectOperatingExpenses: "depenses-exploitation",
  projectOperatingRevenues: "revenus-exploitation",
  realEstateAcquisition: "transaction-fonciere",
  projectBuildingsInstallation: "installation-batiments",
  siteReinstatement: "remise-en-etat",
  financialAssistanceRevenues: "aides",
  photovoltaicProjectInstallation: "installation-pv",
  urbanProjectInstallation: "installation-urbain",
} as const satisfies Record<EconomicBalanceMainImpactKeyName, string>;

export const ECONOMIC_BALANCE_DETAILS_CODES = {
  projectOperatingExpenses: "depenses-exploitation",
  projectOperatingRevenues: "revenus-exploitation",
  realEstateAcquisition: "transaction-fonciere",
  projectBuildingsInstallation: "installation-batiments",
  siteReinstatement: "remise-en-etat",
  financialAssistanceRevenues: "aides",
  photovoltaicProjectInstallation: "installation-pv",
  urbanProjectInstallation: "installation-urbain",

  "realEstateAcquisition.sitePurchase": "transaction-fonciere.achat-terrain",
  "realEstateAcquisition.siteResaleRevenue": "transaction-fonciere.revente-terrain",
  "realEstateAcquisition.buildingsResaleRevenue": "transaction-fonciere.revente-batiments",
  "siteReinstatement.asbestos_removal": "remise-en-etat.desamiantage",
  "siteReinstatement.deimpermeabilization": "remise-en-etat.desimpermeabilisation",
  "siteReinstatement.demolition": "remise-en-etat.demolition",
  "siteReinstatement.other_reinstatement": "remise-en-etat.autre",
  "siteReinstatement.remediation": "remise-en-etat.depollution",
  "siteReinstatement.sustainable_soils_reinstatement": "remise-en-etat.remise-en-etat-durable-sols",
  "siteReinstatement.waste_collection": "remise-en-etat.collecte-dechets",
  "photovoltaicProjectInstallation.other": "installation-pv.autre",
  "photovoltaicProjectInstallation.technical_studies": "installation-pv.etudes-techniques",
  "photovoltaicProjectInstallation.installation_works": "installation-pv.travaux-installation",
  "projectOperatingRevenues.operations": "revenus-exploitation.exploitation",
  "photovoltaicProjectInstallation.development_works": "installation-pv.travaux-amenagement",
  "urbanProjectInstallation.technical_studies": "installation-urbain.etudes-techniques",
  "urbanProjectInstallation.installation_works": "installation-urbain.travaux-installation",
  "urbanProjectInstallation.development_works": "installation-urbain.travaux-amenagement",
  "urbanProjectInstallation.other": "installation-urbain.autre",
  "projectBuildingsInstallation.technical_studies_and_fees":
    "installation-batiments.etudes-techniques-honoraires",
  "projectBuildingsInstallation.buildings_construction_works":
    "installation-batiments.travaux-construction",
  "projectBuildingsInstallation.buildings_rehabilitation_works":
    "installation-batiments.travaux-rehabilitation",
  "projectBuildingsInstallation.other_construction_expenses":
    "installation-batiments.autres-depenses-construction",
  "financialAssistanceRevenues.other": "aides.autre",
  "financialAssistanceRevenues.local_or_regional_authority_participation":
    "aides.participation-collectivite",
  "financialAssistanceRevenues.public_subsidies": "aides.subventions-publiques",

  "projectOperatingExpenses.other": "depenses-exploitation.autre",
  "projectOperatingExpenses.rent": "depenses-exploitation.loyer",
  "projectOperatingExpenses.maintenance": "depenses-exploitation.entretien",
  "projectOperatingExpenses.taxes": "depenses-exploitation.taxes",
  "projectOperatingRevenues.other": "revenus-exploitation.autre",
  "projectOperatingRevenues.rent": "revenus-exploitation.loyer",
} as const satisfies Record<EconomicBalanceImpactKeyName, string>;

export const SOCIO_ECO_DETAILS_CODES = {
  avoidedFricheMaintenanceAndSecuringCostsForOwner:
    "couts-entretien-securisation-friche-proprietaire",
  avoidedFricheMaintenanceAndSecuringCostsForTenant:
    "couts-entretien-securisation-friche-locataire",
  waterRegulation: "regulation-eau",
  avoidedAirConditioningExpenses: "depenses-climatisation-evitees",
  avoidedPropertyDamageExpenses: "depenses-dommages-materiels-evitees",
  avoidedCarRelatedExpenses: "depenses-liees-voiture-evitees",
  avoidedAirPollutionHealthExpenses: "depenses-sante-pollution-air-evitees",
  travelTimeSavedPerTravelerExpenses: "temps-trajet-gagne-par-voyageur",
  propertyTransferDutiesIncome: "recettes-droits-mutation",
  localPropertyValueIncrease: "hausse-valeur-immobiliere-locale",
  localTransferDutiesIncrease: "hausse-droits-mutation-locaux",
  projectedRentalIncome: "revenus-locatifs-projetes",
  fricheRoadsAndUtilitiesExpenses: "depenses-voirie-reseaux-friche",
  previousSiteOperationBenefitLoss: "perte-benefice-exploitation-site-precedent",
  oldRentalIncomeLoss: "perte-revenus-locatifs-anciens",

  projectOperatingExpenses: "depenses-exploitation",
  projectOperatingRevenues: "revenus-exploitation",
  taxesIncome: "recettes-fiscales",

  ecosystemServices: "services-ecosystemiques",
  avoidedTrafficAccidents: "accidents-circulation-evites",

  "avoidedTrafficAccidents.avoidedAccidentsMinorInjuriesExpenses":
    "accidents-circulation-evites.depenses-blessures-legeres",
  "avoidedTrafficAccidents.avoidedAccidentsSevereInjuriesExpenses":
    "accidents-circulation-evites.depenses-blessures-graves",
  "avoidedTrafficAccidents.avoidedAccidentsDeathsExpenses":
    "accidents-circulation-evites.depenses-deces",
  "ecosystemServices.newStoredCo2Eq": "services-ecosystemiques.nouveau-co2eq-stocke",

  "ecosystemServices.natureRelatedWelnessAndLeisure":
    "services-ecosystemiques.bien-etre-loisirs-nature",
  "ecosystemServices.forestRelatedProduct": "services-ecosystemiques.produits-forestiers",
  "ecosystemServices.pollination": "services-ecosystemiques.pollinisation",
  "ecosystemServices.invasiveSpeciesRegulation":
    "services-ecosystemiques.regulation-especes-invasives",

  "ecosystemServices.waterCycle": "services-ecosystemiques.cycle-eau",
  "ecosystemServices.nitrogenCycle": "services-ecosystemiques.cycle-azote",
  "ecosystemServices.soilErosion": "services-ecosystemiques.erosion-sols",
  "avoidedCo2eqEmissions.avoidedCo2eqWithEnergyProduction":
    "emissions-co2eq-evitees.co2eq-evite-production-energie",

  "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions":
    "emissions-co2eq-evitees.co2eq-evite-climatisation",
  "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions":
    "emissions-co2eq-evitees.co2eq-evite-circulation",
  "taxesIncome.projectNewHousesTaxesIncome": "recettes-fiscales.taxes-nouveaux-logements",
  "taxesIncome.projectNewCompanyTaxationIncome": "recettes-fiscales.taxes-nouvelle-entreprise",

  "taxesIncome.projectPhotovoltaicTaxesIncome": "recettes-fiscales.taxes-photovoltaique",
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.security":
    "couts-entretien-securisation-friche-proprietaire.securite",
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.illegalDumpingCost":
    "couts-entretien-securisation-friche-proprietaire.depots-sauvages",
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.accidentsCost":
    "couts-entretien-securisation-friche-proprietaire.accidents",

  "avoidedFricheMaintenanceAndSecuringCostsForOwner.maintenance":
    "couts-entretien-securisation-friche-proprietaire.entretien",
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.otherSecuringCosts":
    "couts-entretien-securisation-friche-proprietaire.autres-couts-securisation",
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.maintenance":
    "couts-entretien-securisation-friche-locataire.entretien",
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.security":
    "couts-entretien-securisation-friche-locataire.securite",

  "avoidedFricheMaintenanceAndSecuringCostsForTenant.illegalDumpingCost":
    "couts-entretien-securisation-friche-locataire.depots-sauvages",
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.accidentsCost":
    "couts-entretien-securisation-friche-locataire.accidents",
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.otherSecuringCosts":
    "couts-entretien-securisation-friche-locataire.autres-couts-securisation",

  avoidedCo2eqEmissions: "emissions-co2eq-evitees",
  "projectOperatingRevenues.operations": "revenus-exploitation.exploitation",
  "projectOperatingExpenses.other": "depenses-exploitation.autre",
  "projectOperatingExpenses.rent": "depenses-exploitation.loyer",
  "projectOperatingExpenses.maintenance": "depenses-exploitation.entretien",
  "projectOperatingExpenses.taxes": "depenses-exploitation.taxes",
  "projectOperatingRevenues.other": "revenus-exploitation.autre",
  "projectOperatingRevenues.rent": "revenus-exploitation.loyer",
} as const satisfies Record<SocioEconomicImpactImpactKeyName, string>;

export const SOCIAL_DETAILS_CODES = {
  "fullTimeJobs.conversionFullTimeJobs": "emplois-temps-plein.conversion-emplois-temps-plein",
  avoidedVehiculeKilometers: "kilometres-vehicule-evites",
  timeTravelSavedInHours: "temps-trajet-gagne-heures",
  householdsPoweredByRenewableEnergy: "foyers-alimentes-energie-renouvelable",
  "fullTimeJobs.photovoltaicOperationsFullTimeJobs":
    "emplois-temps-plein.emplois-exploitation-photovoltaique",
  "fullTimeJobs.urbanOperationsFullTimeJobs": "emplois-temps-plein.emplois-exploitation-urbain",
  fullTimeJobs: "emplois-temps-plein",
  avoidedTrafficAccidents: "accidents-circulation-evites",
  avoidedFricheAccidents: "accidents-friche-evites",
  "avoidedTrafficAccidents.avoidedTrafficAccidentsDeaths": "accidents-circulation-evites.deces",
  "avoidedTrafficAccidents.avoidedTrafficAccidentsSevereInjuries":
    "accidents-circulation-evites.blessures-graves",
  "avoidedTrafficAccidents.avoidedTrafficAccidentsMinorInjuries":
    "accidents-circulation-evites.blessures-legeres",

  "avoidedFricheAccidents.avoidedFricheAccidentsDeaths": "accidents-friche-evites.deces",
  "avoidedFricheAccidents.avoidedFricheAccidentsSevereInjuries":
    "accidents-friche-evites.blessures-graves",
  "avoidedFricheAccidents.avoidedFricheAccidentsMinorInjuries":
    "accidents-friche-evites.blessures-legeres",
} as const satisfies Record<SocialImpactMetricKeyName, string>;

export const ENVIRONMENTAL_DETAILS_CODES = {
  avoidedCo2eqEmissions: "emissions-co2eq-evitees",
  "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions":
    "emissions-co2eq-evitees.co2eq-evite-climatisation",
  "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions":
    "emissions-co2eq-evitees.co2eq-evite-circulation",
  "avoidedCo2eqEmissions.avoidedCO2TonsWithEnergyProduction":
    "emissions-co2eq-evitees.tonnes-co2-evitees-production-energie",
  "avoidedCo2eqEmissions.newStoredCo2Eq": "emissions-co2eq-evitees.nouveau-co2eq-stocke",
  newPermeableSurface: "nouvelle-surface-permeable",
  "newPermeableSurface.newPermeableMineralSurface":
    "nouvelle-surface-permeable.surface-minerale-permeable",
  "newPermeableSurface.newPermeableGreenSurface":
    "nouvelle-surface-permeable.surface-verte-permeable",
  nonContaminatedSurfaceArea: "surface-non-contaminee",
} as const satisfies Record<EnvironmentalImpactMetricKeyName, string>;

export const SUMMARY_DETAILS_CODES = {
  avoidedCo2eqEmissions: "emissions-co2-evites",
  avoidedFricheCostsForLocalAuthority: "couts-evites-collectivite",
  fullTimeJobs: "emplois",
  householdsPoweredByRenewableEnergy: "foyer-alimentes-enr",
  localPropertyValueIncrease: "hausse-valeur-patrimoniale",
  nonContaminatedSurfaceArea: "depollution",
  permeableSurfaceArea: "surface-permeable",
  projectImpactBalance: "bilan-projet",
  taxesIncomesImpact: "impots",
  zanCompliance: "loi-zan",
} as const satisfies Record<KeyImpactIndicatorData["name"], string>;

function invert<T extends Record<string, string>>(map: T): Record<string, keyof T | undefined> {
  return Object.fromEntries(Object.entries(map).map(([k, v]) => [v, k]));
}

export const SECTION_CODES_REVERSE = invert(SECTION_CODES);
export const ECONOMIC_BALANCE_IMPACT_CODES_REVERSE = invert(ECONOMIC_BALANCE_IMPACT_CODES);
export const ECONOMIC_BALANCE_DETAILS_CODES_REVERSE = invert(ECONOMIC_BALANCE_DETAILS_CODES);
export const SOCIO_ECO_DETAILS_CODES_REVERSE = invert(SOCIO_ECO_DETAILS_CODES);
export const SOCIAL_DETAILS_CODES_REVERSE = invert(SOCIAL_DETAILS_CODES);
export const ENVIRONMENTAL_DETAILS_CODES_REVERSE = invert(ENVIRONMENTAL_DETAILS_CODES);
export const SUMMARY_DETAILS_CODES_REVERSE = invert(SUMMARY_DETAILS_CODES);
