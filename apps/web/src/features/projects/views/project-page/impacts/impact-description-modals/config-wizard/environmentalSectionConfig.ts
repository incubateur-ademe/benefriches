import { EnvironmentalImpactMetricKeyName } from "@/features/projects/core/projectImpactsEnvironmental";
import {
  formatCO2Impact,
  formatSurfaceAreaImpact,
} from "@/features/projects/views/shared/formatImpactValue";
import { EnvironmentSubSectionName } from "@/features/projects/views/shared/impacts/modals/ImpactModalDescriptionContext";

import { ModalImpactConfig } from "./config.type";

export const ENVIRONMENTAL_METRICS_MODALS = {
  environmental: {
    title: "Impacts environnementaux",
    ContentComponent: () => import("../mdx/environmental_section.mdx"),
  },
  co2eq: {
    title: "Impacts sur le CO2-eq",
    ContentComponent: () => import("../mdx/environmental_co2_section.mdx"),
  },
  soils: {
    title: "Impacts sur les sols",
    ContentComponent: () => import("../mdx/environmental_soils_section.mdx"),
  },

  avoidedCo2eqEmissions: {
    title: "☁️ CO2-eq stocké ou évité",
    type: "co2",
    formatFn: formatCO2Impact,

    ContentComponent: () => import("../mdx/avoided-co2eq-emissions/avoided_co2eq_emissions.mdx"),
  },
  "avoidedCo2eqEmissions.avoidedAirConditioningCo2eqEmissions": {
    title: "❄️ Evitées grâce à l’utilisation réduite de la climatisation",
    type: "co2",
    formatFn: formatCO2Impact,

    ContentComponent: () =>
      import("../mdx/avoided-co2eq-emissions/avoided_co2eq_emissions__avoided_air_conditioning_co2eq_emissions.mdx"),
  },
  "avoidedCo2eqEmissions.avoidedCO2TonsWithEnergyProduction": {
    title: "⚡️️ Emissions de CO2-eq évitées grâce à la production d'énergies renouvelables",
    type: "co2",
    formatFn: formatCO2Impact,

    ContentComponent: () =>
      import("../mdx/avoided-co2eq-emissions/avoided_co2eq_emissions__avoided_co2eq_with_energy_production.mdx"),
  },
  "avoidedCo2eqEmissions.avoidedTrafficCo2EqEmissions": {
    title: "🚙 Evitées grâce aux déplacements en voiture évités",
    type: "co2",
    formatFn: formatCO2Impact,

    ContentComponent: () =>
      import("../mdx/avoided-co2eq-emissions/avoided_co2eq_emissions__avoided_traffic_co2_eq_emissions.mdx"),
  },
  "avoidedCo2eqEmissions.newStoredCo2Eq": {
    title: "🍂 CO2-eq stocké dans les sols",
    type: "co2",
    formatFn: formatCO2Impact,
    ContentComponent: () =>
      import("../mdx/ecosystem-services/ecosystem_services__new_stored_co2_eq.mdx"),
  },
  newPermeableSurface: {
    title: "🌧️ Surface perméable",
    type: "surface_area",
    formatFn: formatSurfaceAreaImpact,

    ContentComponent: () => import("../mdx/new_permeable_surface.mdx"),
  },
  "newPermeableSurface.newPermeableGreenSurface": {
    title: "☘️ Surface végétalisée",
    type: "surface_area",
    formatFn: formatSurfaceAreaImpact,
    ContentComponent: () => import("../mdx/new_permeable_surface__green_surface.mdx"),
  },
  "newPermeableSurface.newPermeableMineralSurface": {
    title: "🪨 Surface minérale",
    formatFn: formatSurfaceAreaImpact,

    type: "surface_area",

    ContentComponent: () => import("../mdx/new_permeable_surface__mineral_surface.mdx"),
  },
  nonContaminatedSurfaceArea: {
    title: "✨ Surface non polluée",
    type: "surface_area",
    formatFn: formatSurfaceAreaImpact,

    ContentComponent: () => import("../mdx/non_contaminated_surface.mdx"),
  },
} as const satisfies Record<
  EnvironmentalImpactMetricKeyName | EnvironmentSubSectionName | "environmental",
  ModalImpactConfig
>;
