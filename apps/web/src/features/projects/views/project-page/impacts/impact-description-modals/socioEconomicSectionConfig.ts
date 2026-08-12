import { MDXComponents } from "mdx/types";

import type { ModalDataProps } from "@/features/projects/application/project-impacts/selectors/projectImpacts.selectors";
import { SocioEconomicImpactImpactKeyName } from "@/features/projects/core/projectImpactsSocioEconomic";
import { SocioEconomicSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { LazyContentComponent } from "./shared/lazy-component/LazyContentComponent";

export const SOCIO_ECONOMIC_MODALS = {
  socio_economic: {
    BodyComponent: () => import("./body-component/socio-economic/SocioEconomicDescription"),
  },
  humanity: {
    BodyComponent: () => import("./body-component/socio-economic/HumanityDescription"),
  },
  localPeopleOrCompany: {
    BodyComponent: () => import("./body-component/socio-economic/LocalPeopleOrCompanyDescription"),
  },
  localAuthority: {
    BodyComponent: () => import("./body-component/socio-economic/LocalAuthorityDescription"),
  },

  projectedRentalIncome: {
    title: "🔑 Revenu locatif",
    description: "répartis entre l'actuel propriétaire et le futur propriétaire",
    ContentComponent: () => import("./mdx/projected_rental_income.mdx"),
  },
  avoidedFricheMaintenanceAndSecuringCostsForOwner: {
    title: "🏚️ Dépenses liées à la friche évitées pour le propriétaire",
    ContentComponent: () =>
      import("./mdx/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs.mdx"),
  },
  avoidedFricheMaintenanceAndSecuringCostsForTenant: {
    title: "🏚️ Dépenses liées à la friche évitées pour le locataire",
    subtitle: "Grâce à la reconversion de la friche",
    ContentComponent: () =>
      import("./mdx/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.accidentsCost": undefined,
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.accidentsCost": undefined,
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.illegalDumpingCost": {
    title: "🚮 Débarras de dépôt sauvage",

    ContentComponent: () =>
      import("./mdx/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__illegal_dumping_cost.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.illegalDumpingCost": {
    title: "🚮 Débarras de dépôt sauvage",

    ContentComponent: () =>
      import("./mdx/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__illegal_dumping_cost.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.maintenance": {
    title: "🔧 Entretien",

    ContentComponent: () =>
      import("./mdx/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__maintenance.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.maintenance": {
    title: "🔧 Entretien",

    ContentComponent: () =>
      import("./mdx/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__maintenance.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.otherSecuringCosts": {
    title: "🛡 Autres dépenses de sécurisation",

    ContentComponent: () =>
      import("./mdx/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__other_securing_costs.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.otherSecuringCosts": {
    title: "🛡 Autres dépenses de sécurisation",

    ContentComponent: () =>
      import("./mdx/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__other_securing_costs.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.security": {
    title: "👮 Gardiennage",

    ContentComponent: () =>
      import("./mdx/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__security.mdx"),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.security": {
    title: "👮 Gardiennage",

    ContentComponent: () =>
      import("./mdx/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__security.mdx"),
  },
  projectOperatingExpenses: undefined,
  "projectOperatingExpenses.rent": undefined,
  "projectOperatingExpenses.taxes": undefined,
  "projectOperatingExpenses.other": undefined,

  projectOperatingRevenues: undefined,
  "projectOperatingRevenues.operations": undefined,
  "projectOperatingRevenues.rent": undefined,
  "projectOperatingRevenues.other": undefined,
  "projectOperatingExpenses.maintenance": undefined,

  propertyTransferDutiesIncome: undefined,

  localPropertyValueIncrease: {
    title: "🏡 Hausse de la valeur patrimoniale des bâtiments alentour",
    subtitle: "Grâce à la reconversion du site",
    description: "pour la population locale",
    ContentComponent: () => import("./mdx/local_property_value_increase.mdx"),
  },
  localTransferDutiesIncrease: {
    title: "🏛️ Droits de mutation sur les ventes immobilières alentour",
    description: "pour la collectivité",
    ContentComponent: () => import("./mdx/local_transfer_duties_increase.mdx"),
  },
  taxesIncome: {
    title: "🏛️ Recettes fiscales",
    description: "pour la collectivité",
    ContentComponent: () => import("./mdx/taxes_income.mdx"),
  },

  "taxesIncome.projectNewCompanyTaxationIncome": undefined,
  "taxesIncome.projectNewHousesTaxesIncome": undefined,
  "taxesIncome.projectPhotovoltaicTaxesIncome": undefined,

  previousSiteOperationBenefitLoss: undefined,

  avoidedPropertyDamageExpenses: {
    title: "🚙 Dépenses de réparation évitées",
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: () => import("./mdx/avoided_property_damage_expenses.mdx"),
  },
  avoidedCarRelatedExpenses: {
    title: "🚗 Dépenses automobiles évitées",
    subtitle: "Grâce à la ou les commodités créées dans le quartier",
    description: "pour la population locale",
    ContentComponent: () => import("./mdx/avoided_car_related_expenses.mdx"),
  },
  avoidedAirConditioningExpenses: {
    title: "❄️ Dépenses de climatisation évitées",
    description: "pour la population locale et les structures locales",
    ContentComponent: () => import("./mdx/avoided_air_conditioning_expenses.mdx"),
  },
  fricheRoadsAndUtilitiesExpenses: {
    title: "🅿️ Dépenses d’entretien des VRD",
    description: "pour la collectivité",
    ContentComponent: () => import("./mdx/friche_roads_and_utilities_expenses.mdx"),
  },
  travelTimeSavedPerTravelerExpenses: {
    title: "⏱️️ Valeur monétaire du temps passé en moins dans les transports",
    subtitle: "Grâce à la ou les commodités créées dans le quartier",
    description: "pour la population locale",
    ContentComponent: () => import("./mdx/travel_time_saved_per_traveler_expenses.mdx"),
  },
  avoidedTrafficAccidents: {
    title: "🚗 Dépenses de santé évitées grâce à la diminution des accidents de la route",
    ContentComponent: () => import("./mdx/avoided-accidents/avoided_traffic_accidents.mdx"),
  },
  "avoidedTrafficAccidents.avoidedAccidentsDeathsExpenses": {
    title: "🪦 Décès évités",
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: () =>
      import("./mdx/avoided-accidents/avoided_traffic_accidents__avoided_accidents_deaths.mdx"),
  },
  "avoidedTrafficAccidents.avoidedAccidentsMinorInjuriesExpenses": {
    title: "🤕 Blessés légers évités",
    subtitle: "Grâce aux déplacements évités",

    ContentComponent: () =>
      import("./mdx/avoided-accidents/avoided_traffic_accidents__avoided_accidents_minor_injuries.mdx"),
  },
  "avoidedTrafficAccidents.avoidedAccidentsSevereInjuriesExpenses": {
    title: "‍🚑 Blessés graves évités",
    subtitle: "Grâce aux déplacements évités",

    ContentComponent: () =>
      import("./mdx/avoided-accidents/avoided_traffic_accidents__avoided_accidents_severe_injuries.mdx"),
  },
  avoidedCo2eqEmissions: {
    title: "☁️ Valeur monétaire de la décarbonation",
    description: "pour l'humanité",
    ContentComponent: () => import("./mdx/avoided_co2eq_emissions.mdx"),
  },
  "avoidedCo2eqEmissions.avoidedCo2eqWithEnergyProduction": {
    title: "⚡️️ Production d'énergies renouvelables",
    description: "pour l'humanité",
    ContentComponent: () =>
      import("./mdx/avoided_co2eq_emissions__avoided_co2eq_with_energy_production.mdx"),
  },
  "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions": {
    title: "🚙 Déplacements en voiture évités",
    description: "pour l'humanité",
    ContentComponent: () =>
      import("./mdx/avoided_co2eq_emissions__avoided_traffic_co2_eq_emissions.mdx"),
  },
  "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions": {
    title: "❄️ Utilisation réduite de de la climatisation",
    description: "pour l'humanité",
    ContentComponent: () =>
      import("./mdx/avoided_co2eq_emissions__avoided_air_conditioning_co2eq_emissions.mdx"),
  },
  avoidedAirPollutionHealthExpenses: {
    title: "💨 Dépenses de santé évitées grâce à la réduction de la pollution de l’air",
    subtitle: "Grâce aux déplacements évités",
    description: "pour la société française",
    ContentComponent: () => import("./mdx/avoided_air_pollution_health_expenses.mdx"),
  },
  waterRegulation: {
    title: "🚰 Dépenses de traitement de l’eau évitées",
    subtitle:
      "Grâce à la dépollution de la friche et à la régulation de la qualité de l’eau par les espaces naturels",
    description: "pour la collectivité",
    ContentComponent: () => import("./mdx/water_regulation.mdx"),
  },
  ecosystemServices: {
    title: "🌱 Valeur monétaire des services écosystémiques",
    description: "pour l'humanité",
    ContentComponent: () => import("./mdx/ecosystem-services/ecosystem_services.mdx"),
  },
  "ecosystemServices.forestRelatedProduct": {
    title: "🪵 Produits issus de la forêt",
    description: "pour l'humanité",
    ContentComponent: () =>
      import("./mdx/ecosystem-services/ecosystem_services__forest_related_product.mdx"),
  },
  "ecosystemServices.invasiveSpeciesRegulation": {
    title: "🦔 Régulation des espèces invasives",
    description: "pour l'humanité",
    ContentComponent: () =>
      import("./mdx/ecosystem-services/ecosystem_services__invasive_species_regulation.mdx"),
  },
  "ecosystemServices.natureRelatedWelnessAndLeisure": {
    title: "🚵 Bien-être et loisirs liés à la nature",
    description: "pour l'humanité",
    ContentComponent: () =>
      import("./mdx/ecosystem-services/ecosystem_services__nature_related_welness_and_leisure.mdx"),
  },
  "ecosystemServices.nitrogenCycle": {
    title: "🍄 Cycle de l'azote",
    description: "pour l'humanité",
    ContentComponent: () =>
      import("./mdx/ecosystem-services/ecosystem_services__nitrogen_cycle.mdx"),
  },
  "ecosystemServices.pollination": {
    title: "🐝 Pollinisation",
    description: "pour l'humanité",
    ContentComponent: () => import("./mdx/ecosystem-services/ecosystem_services__pollination.mdx"),
  },
  "ecosystemServices.soilErosion": {
    title: "🌾 Régulation de l'érosion des sols",
    ContentComponent: () => import("./mdx/ecosystem-services/ecosystem_services__soil_erosion.mdx"),
  },
  "ecosystemServices.waterCycle": {
    title: "💧 Cycle de l'eau",
    description: "pour l'humanité",
    ContentComponent: () => import("./mdx/ecosystem-services/ecosystem_services__water_cycle.mdx"),
  },
  "ecosystemServices.newStoredCo2Eq": {
    title: "🍂️ CO2-eq stocké dans les sols",
    description: "pour l'humanité",
    ContentComponent: () =>
      import("./mdx/ecosystem-services/ecosystem_services__new_stored_co2_eq.mdx"),
  },
  oldRentalIncomeLoss: undefined,
} as const satisfies Record<
  SocioEconomicImpactImpactKeyName | SocioEconomicSubSectionName | "socio_economic",
  | {
      title: string;
      subtitle?: string;
      description?: string;
      ContentComponent: LazyContentComponent;
    }
  | {
      BodyComponent: () => Promise<{
        default: React.ComponentType<{
          components?: MDXComponents;
          impactsData: ModalDataProps["impactsData"];
          contextData: ModalDataProps["contextData"];
        }>;
      }>;
    }
  | undefined
>;
