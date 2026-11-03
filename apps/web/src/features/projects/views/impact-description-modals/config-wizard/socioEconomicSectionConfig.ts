import { lazy } from "react";

import type { SocioEconomicImpactImpactKeyName } from "@/features/projects/core/projectImpactsSocioEconomic";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

import type { SocioEconomicSectionName } from "../ImpactModalDescriptionContext";
import type { ContentComponentType, ModalImpactConfig } from "./config.type";
import { formatSocioEconomicDataProps, formatSubsectionImpactsDataProps } from "./formatData";

const SOCIO_ECONOMIC_MODALS = {
  socioEconomic: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/socio_economic_section.mdx"),
    ),
    dataProps: (p) =>
      formatSocioEconomicDataProps({
        impactsData: p.impactsData,
        getDetailsLink: p.getDetailsLink,
      }),
  },
  "socioEconomic.humanity": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/socio_economic_humanity_section.mdx"),
    ),
    dataProps: (p) =>
      formatSubsectionImpactsDataProps({
        key: "humanity",
        impactsData: p.impactsData,
        getDetailsLink: p.getDetailsLink,
      }),
  },
  "socioEconomic.localPeopleOrCompany": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/socio_economic_local_people_or_company_section.mdx"),
    ),
    dataProps: (p) =>
      formatSubsectionImpactsDataProps({
        key: "localPeopleOrCompany",
        impactsData: p.impactsData,
        getDetailsLink: p.getDetailsLink,
      }),
  },
  "socioEconomic.localAuthority": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/socio_economic_local_authority_section.mdx"),
    ),
    dataProps: (p) =>
      formatSubsectionImpactsDataProps({
        key: "localAuthority",
        impactsData: p.impactsData,
        getDetailsLink: p.getDetailsLink,
      }),
  },

  projectedRentalIncome: {
    description: "répartis entre l'actuel propriétaire et le futur propriétaire",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/projected_rental_income.mdx"),
    ),
  },
  avoidedFricheMaintenanceAndSecuringCostsForOwner: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs.mdx"),
    ),
  },
  avoidedFricheMaintenanceAndSecuringCostsForTenant: {
    subtitle: "Grâce à la reconversion de la friche",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs.mdx"),
    ),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.accidentsCost": undefined,
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.accidentsCost": undefined,
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.illegalDumpingCost": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__illegal_dumping_cost.mdx"),
    ),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.illegalDumpingCost": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__illegal_dumping_cost.mdx"),
    ),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.maintenance": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__maintenance.mdx"),
    ),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.maintenance": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__maintenance.mdx"),
    ),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.otherSecuringCosts": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__other_securing_costs.mdx"),
    ),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.otherSecuringCosts": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__other_securing_costs.mdx"),
    ),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForOwner.security": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__security.mdx"),
    ),
  },
  "avoidedFricheMaintenanceAndSecuringCostsForTenant.security": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-friche-costs/avoided_friche_maintenance_and_securing_costs__security.mdx"),
    ),
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
    subtitle: "Grâce à la reconversion du site",
    description: "pour la population locale",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/local_property_value_increase.mdx"),
    ),
  },
  localTransferDutiesIncrease: {
    description: "pour la collectivité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/local_transfer_duties_increase.mdx"),
    ),
  },
  taxesIncome: {
    description: "pour la collectivité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/taxes_income.mdx"),
    ),
  },

  "taxesIncome.projectNewCompanyTaxationIncome": undefined,
  "taxesIncome.projectNewHousesTaxesIncome": undefined,
  "taxesIncome.projectPhotovoltaicTaxesIncome": undefined,

  previousSiteOperationBenefitLoss: undefined,

  avoidedPropertyDamageExpenses: {
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided_property_damage_expenses.mdx"),
    ),
  },
  avoidedCarRelatedExpenses: {
    subtitle: "Grâce à la ou les commodités créées dans le quartier",
    description: "pour la population locale",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided_car_related_expenses.mdx"),
    ),
  },
  avoidedAirConditioningExpenses: {
    description: "pour la population locale et les structures locales",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided_air_conditioning_expenses.mdx"),
    ),
  },
  fricheRoadsAndUtilitiesExpenses: {
    description: "pour la collectivité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/friche_roads_and_utilities_expenses.mdx"),
    ),
  },
  travelTimeSavedPerTravelerExpenses: {
    subtitle: "Grâce à la ou les commodités créées dans le quartier",
    description: "pour la population locale",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/travel_time_saved_per_traveler_expenses.mdx"),
    ),
  },
  avoidedTrafficAccidents: {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-accidents/avoided_traffic_accidents.mdx"),
    ),
  },
  "avoidedTrafficAccidents.avoidedAccidentsDeathsExpenses": {
    subtitle: "Grâce aux déplacements évités",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-accidents/avoided_traffic_accidents__avoided_accidents_deaths.mdx"),
    ),
  },
  "avoidedTrafficAccidents.avoidedAccidentsMinorInjuriesExpenses": {
    subtitle: "Grâce aux déplacements évités",

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-accidents/avoided_traffic_accidents__avoided_accidents_minor_injuries.mdx"),
    ),
  },
  "avoidedTrafficAccidents.avoidedAccidentsSevereInjuriesExpenses": {
    subtitle: "Grâce aux déplacements évités",

    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-accidents/avoided_traffic_accidents__avoided_accidents_severe_injuries.mdx"),
    ),
  },
  avoidedCo2eqEmissions: {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-co2eq-emissions/avoided_co2eq_emissions.mdx"),
    ),
  },
  "avoidedCo2eqEmissions.avoidedCo2eqWithEnergyProduction": {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-co2eq-emissions/avoided_co2eq_emissions__avoided_co2eq_with_energy_production.mdx"),
    ),
  },
  "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions": {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-co2eq-emissions/avoided_co2eq_emissions__avoided_traffic_co2_eq_emissions.mdx"),
    ),
  },
  "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions": {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided-co2eq-emissions/avoided_co2eq_emissions__avoided_air_conditioning_co2eq_emissions.mdx"),
    ),
  },
  avoidedAirPollutionHealthExpenses: {
    subtitle: "Grâce aux déplacements évités",
    description: "pour la société française",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/avoided_air_pollution_health_expenses.mdx"),
    ),
  },
  waterRegulation: {
    subtitle:
      "Grâce à la dépollution de la friche et à la régulation de la qualité de l’eau par les espaces naturels",
    description: "pour la collectivité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/water_regulation.mdx"),
    ),
  },
  ecosystemServices: {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/ecosystem-services/ecosystem_services.mdx"),
    ),
  },
  "ecosystemServices.forestRelatedProduct": {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/ecosystem-services/ecosystem_services__forest_related_product.mdx"),
    ),
  },
  "ecosystemServices.invasiveSpeciesRegulation": {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/ecosystem-services/ecosystem_services__invasive_species_regulation.mdx"),
    ),
  },
  "ecosystemServices.natureRelatedWelnessAndLeisure": {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/ecosystem-services/ecosystem_services__nature_related_welness_and_leisure.mdx"),
    ),
  },
  "ecosystemServices.nitrogenCycle": {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/ecosystem-services/ecosystem_services__nitrogen_cycle.mdx"),
    ),
  },
  "ecosystemServices.pollination": {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/ecosystem-services/ecosystem_services__pollination.mdx"),
    ),
  },
  "ecosystemServices.soilErosion": {
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/ecosystem-services/ecosystem_services__soil_erosion.mdx"),
    ),
  },
  "ecosystemServices.waterCycle": {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/ecosystem-services/ecosystem_services__water_cycle.mdx"),
    ),
  },
  "ecosystemServices.newStoredCo2Eq": {
    description: "pour l'humanité",
    ContentComponent: lazy<ContentComponentType>(
      () =>
        import("@/features/projects/views/impact-description-modals/mdx-component/ecosystem-services/ecosystem_services__new_stored_co2_eq.mdx"),
    ),
  },
  oldRentalIncomeLoss: undefined,
} as const satisfies Record<
  SocioEconomicImpactImpactKeyName | SocioEconomicSectionName,
  ModalImpactConfig
>;

export const SOCIO_ECONOMIC_MODAL_CONFIG = {
  sections: [
    "socioEconomic",
    "socioEconomic.humanity",
    "socioEconomic.localPeopleOrCompany",
    "socioEconomic.localAuthority",
  ] satisfies readonly SocioEconomicSectionName[],
  modals: SOCIO_ECONOMIC_MODALS,
  formatFn: formatMonetaryImpact,
  caption: "Liste des impacts monétaires positifs et négatifs",
} as const;
